import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '@/components/ui/BottomNav'
import { HealthDot } from '@/components/ui/HealthDot'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { HealthStatus } from '@/types/scan'

type FilterType = 'all' | HealthStatus

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Warning', value: 'warning' },
  { label: 'Critical', value: 'critical' },
]

export function History() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('scans').select('*').order('created_at', { ascending: false })
      if (data) {
        setHistory(data.map(d => ({
          id: d.id,
          name: d.plant_name,
          scientific: d.scientific_name,
          date: new Date(d.created_at).toLocaleDateString(),
          status: d.status,
          emoji: '🌱'
        })))
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all' ? history : history.filter(s => s.status === filter)

  return (
    <motion.div
      className="min-h-screen bg-cream pb-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto pt-14 pb-4 flex items-center gap-3">
        <h1 className="font-serif text-[22px] text-plant-dark flex-1">Scan History</h1>
        <span className="bg-mint-2 text-sage-deep text-xs font-semibold rounded-full px-3 py-1">
          {history.length} scans
        </span>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-8 max-w-3xl md:mx-auto flex gap-2 overflow-x-auto pb-1 mb-4">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f.value ? 'bg-sage-deep text-white' : 'bg-cream-2 text-plant-mid'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Scan List */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto space-y-2.5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <span className="text-5xl">🌿</span>
            <p className="text-sm font-semibold text-plant-dark">No scans yet</p>
            <p className="text-xs text-plant-light">Scan your first plant to get started!</p>
            <button
              onClick={() => navigate('/scan')}
              className="bg-sage-deep text-white text-sm font-semibold rounded-full px-6 py-2.5 mt-2"
            >
              Scan a Plant
            </button>
          </div>
        ) : filtered.map((scan, i) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(`/result/${scan.id}`)}
            className="bg-white rounded-[20px] shadow-card p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="w-13 h-13 bg-mint rounded-[14px] flex items-center justify-center text-3xl flex-shrink-0">
              {scan.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-plant-dark truncate">{scan.name}</p>
              <p className="text-[11px] italic text-plant-light">{scan.scientific}</p>
              <p className="text-[10px] text-plant-light mt-0.5">{scan.date}</p>
            </div>
            <HealthDot status={scan.status} />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </motion.div>
  )
}
