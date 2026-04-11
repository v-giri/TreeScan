import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { BottomNav } from '@/components/ui/BottomNav'
import { HealthDot } from '@/components/ui/HealthDot'
import { SkeletonTile } from '@/components/ui/Skeleton'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { HealthStatus } from '@/types/scan'

type GardenTab = 'all' | 'needs-care' | 'healthy'

const tabs: { label: string; value: GardenTab }[] = [
  { label: 'All Plants', value: 'all' },
  { label: 'Needs Care', value: 'needs-care' },
  { label: 'Healthy', value: 'healthy' },
]

export function Garden() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<GardenTab>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [garden, setGarden] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('garden').select('*, scans(*)').order('added_at', { ascending: false })
      if (data) {
        setGarden(data.filter(d => d.scans).map(d => ({
          id: d.scans.id,
          name: d.nickname || d.scans.plant_name,
          scientific: d.scans.scientific_name,
          status: d.scans.status as HealthStatus,
          emoji: '🪴',
          date: new Date(d.added_at).toLocaleDateString()
        })))
      }
      setIsLoading(false)
    }
    load()
  }, [])

  const filtered = activeTab === 'all' ? garden
    : activeTab === 'healthy' ? garden.filter(p => p.status === 'healthy')
    : garden.filter(p => p.status !== 'healthy')

  const healthyCount = garden.filter(p => p.status === 'healthy').length

  return (
    <motion.div
      className="min-h-screen bg-cream pb-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="px-4 pt-14 pb-4">
        <h1 className="font-serif text-[22px] text-plant-dark">My Garden</h1>
        <p className="text-xs text-plant-light mt-0.5">{garden.length} plants · {healthyCount} healthy</p>
      </div>

      {/* Tab Switcher */}
      <div className="mx-4 bg-white rounded-[14px] p-1 flex gap-0.5 shadow-card mb-4">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-1 py-2 rounded-[10px] text-xs font-semibold transition-colors ${
              activeTab === tab.value ? 'bg-sage-deep text-white' : 'text-plant-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="px-4 md:px-8 max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-5">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <SkeletonTile key={i} />)
        ) : filtered.map((plant, i) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(`/result/${plant.id}`)}
            className="bg-white rounded-[28px] shadow-card p-4 flex flex-col items-center gap-2 cursor-pointer active:scale-[0.97] transition-transform relative"
          >
            <HealthDot status={plant.status} className="absolute top-3 right-3" />
            <span className="text-[44px] leading-none">{plant.emoji}</span>
            <p className="text-xs font-semibold text-plant-dark text-center">{plant.name}</p>
            <p className="text-[10px] italic text-plant-light text-center">{plant.scientific}</p>
            <p className="text-[9px] text-plant-light">{plant.date}</p>
          </motion.div>
        ))}

        {/* Add Tile */}
        <button
          onClick={() => navigate('/scan')}
          className="bg-mint border-2 border-dashed border-sage-light rounded-[28px] p-4 flex flex-col items-center justify-center gap-2 active:scale-[0.97] transition-transform min-h-[160px]"
        >
          <div className="w-7 h-7 flex items-center justify-center">
            <Plus size={28} className="text-sage" />
          </div>
          <p className="text-xs text-sage font-medium">Add a plant</p>
        </button>
      </div>

      <BottomNav />
    </motion.div>
  )
}
