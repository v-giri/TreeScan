import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getCachedScan, setCachedScan } from '@/lib/db'
import type { ScanRecord } from '@/types/scan'

export function useHistory() {
  const [scans, setScans] = useState<ScanRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchScans = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: dbError } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (dbError) throw dbError
      const records = (data || []) as ScanRecord[]

      // Cache each
      for (const scan of records) {
        const cached = await getCachedScan(scan.id)
        if (!cached) await setCachedScan(scan.id, scan)
      }

      setScans(records)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteScan = useCallback(async (id: string) => {
    const { error } = await supabase.from('scans').delete().eq('id', id)
    if (!error) setScans(prev => prev.filter(s => s.id !== id))
  }, [])

  return { scans, isLoading, error, fetchScans, deleteScan }
}
