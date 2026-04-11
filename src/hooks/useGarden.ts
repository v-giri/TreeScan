import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { GardenItem } from '@/types/scan'

export function useGarden() {
  const [gardenItems, setGardenItems] = useState<GardenItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGarden = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: dbError } = await supabase
        .from('garden')
        .select(`
          *,
          scan:scans(*)
        `)
        .order('saved_at', { ascending: false })

      if (dbError) throw dbError
      setGardenItems((data || []) as GardenItem[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load garden')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addToGarden = useCallback(async (scanId: string, nickname?: string, notes?: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('garden')
      .insert({ user_id: user.id, scan_id: scanId, nickname: nickname || null, notes: notes || null })
      .select()
      .single()

    if (!error && data) {
      setGardenItems(prev => [data as GardenItem, ...prev])
      return data as GardenItem
    }
    return null
  }, [])

  const removeFromGarden = useCallback(async (gardenId: string) => {
    const { error } = await supabase.from('garden').delete().eq('id', gardenId)
    if (!error) setGardenItems(prev => prev.filter(g => g.id !== gardenId))
  }, [])

  return { gardenItems, isLoading, error, fetchGarden, addToGarden, removeFromGarden }
}
