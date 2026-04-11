import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { fileToBase64, compressImage, validateImageFile } from '@/lib/imageUtils'
import { setCachedScan } from '@/lib/db'
import type { ScanResult, ScanRecord } from '@/types/scan'

interface ScannerState {
  isLoading: boolean
  error: string | null
  progress: number
}

export function useScanner() {
  const [state, setState] = useState<ScannerState>({ isLoading: false, error: null, progress: 0 })

  const setProgress = (progress: number) => setState(s => ({ ...s, progress }))
  const setError = (error: string | null) => setState(s => ({ ...s, error, isLoading: false }))

  const analyze = useCallback(async (file: File): Promise<{ result: ScanResult; scanId: string } | null> => {
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      return null
    }

    setState({ isLoading: true, error: null, progress: 0 })

    try {
      // Step 1: Compress
      setProgress(10)
      const compressed = await compressImage(file, 1)

      // Step 2: Convert to base64
      setProgress(25)
      const imageBase64 = await fileToBase64(compressed)
      const mimeType = compressed.type

      // Step 3: Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      setProgress(40)

      // Step 4: Call Edge Function (with retry)
      let result: ScanResult | null = null
      let lastError: Error | null = null
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data, error } = await supabase.functions.invoke<ScanResult>('analyze-plant', {
            body: { imageBase64, mimeType, userId: user.id },
          })
          if (error) throw new Error(error.message)
          if (data) { result = data; break }
        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error')
          if (attempt < 2) await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
        }
      }
      if (!result) throw lastError || new Error('Analysis failed')

      setProgress(75)

      // Step 5: Upload image to Storage
      const ext = file.name.split('.').pop() || 'jpg'
      const imagePath = `${user.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('scan-images')
        .upload(imagePath, compressed)

      const imageUrl = uploadError ? null : supabase.storage.from('scan-images').getPublicUrl(imagePath).data.publicUrl

      setProgress(88)

      // Step 6: Save scan record to DB
      const { data: savedScan, error: dbError } = await supabase
        .from('scans')
        .insert({
          user_id: user.id,
          image_url: imageUrl,
          common_name: result.commonName,
          scientific_name: result.scientificName,
          family: result.family,
          confidence: result.confidence,
          health_status: result.health,
          problems: result.problems,
          treatments: result.treatments,
          care_profile: result.careProfile,
          summary: result.summary,
          fun_fact: result.funFact,
          urgency: result.urgency,
        })
        .select()
        .single()

      if (dbError) throw new Error(dbError.message)

      const scanRecord = savedScan as ScanRecord
      setProgress(100)

      // Cache locally
      await setCachedScan(scanRecord.id, scanRecord)

      setState({ isLoading: false, error: null, progress: 100 })
      return { result, scanId: scanRecord.id }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setError(message)
      return null
    }
  }, [])

  return { ...state, analyze }
}
