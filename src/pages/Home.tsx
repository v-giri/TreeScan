import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '@/components/ui/BottomNav'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { HealthDot } from '@/components/ui/HealthDot'
import { useAuth } from '@/context/AuthContext'
import type { HealthStatus } from '@/types/scan'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function Home() {
  const { user, profile } = useAuth()
  const [recentScans, setRecentScans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Friend'

  useEffect(() => {
    async function fetchRecent() {
      if (!user?.id) return
      const { data } = await supabase.from('scans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(3)
      if (data) {
        setRecentScans(data.map(d => ({
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
    fetchRecent()
  }, [user])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning 🌤' : hour < 17 ? 'Good afternoon ☀️' : 'Good evening 🌙'

  return (
    <motion.div
      className="min-h-screen bg-cream pb-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto pt-14 pb-4">
        <p className="text-xs text-plant-light">{greeting}</p>
        <h1 className="font-serif text-[22px] text-plant-dark">Hello, {firstName}</h1>
      </div>

      {/* Hero Card */}
      <motion.div
        className="mx-4 md:px-8 max-w-3xl md:mx-auto bg-sage-deep rounded-[28px] p-5 overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <span className="inline-block bg-white/15 text-white text-[10px] font-semibold rounded-full px-3 py-1 mb-3">
          🤖 AI Plant Doctor
        </span>
        <h2 className="font-serif text-[20px] text-white leading-tight max-w-[160px] mb-5">
          Diagnose your plant health instantly
        </h2>
        <button
          onClick={() => navigate('/scan')}
          className="bg-white text-sage-deep text-xs font-semibold rounded-full px-5 py-2.5 active:scale-95 transition-transform"
        >
          Scan Now →
        </button>
        <div className="absolute -bottom-2 -right-2 text-[90px] leading-none opacity-30 pointer-events-none select-none">
          🌿
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2.5 max-w-3xl md:mx-auto">
        {[
          { emoji: '📷', label: 'Quick Scan', path: '/scan', bg: 'bg-mint-2' },
          { emoji: '🪴', label: 'My Garden', path: '/garden', bg: 'bg-[#F5EDD6]' },
          { emoji: '📋', label: 'History', path: '/history', bg: 'bg-[#E8E4F5]' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="bg-white rounded-[20px] shadow-card p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className={`w-10 h-10 ${action.bg} rounded-[14px] flex items-center justify-center text-lg`}>
              {action.emoji}
            </div>
            <span className="text-[10px] text-plant-mid font-medium">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Recent Scans */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-plant-dark">Recent Scans</h2>
          <button onClick={() => navigate('/history')} className="text-xs text-sage-dark font-medium">See all</button>
        </div>

        <div className="space-y-2.5 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {isLoading ? (
            [1, 2, 3].map(i => <SkeletonCard key={i} />)
          ) : recentScans.map((scan, i) => (
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
      </div>

      <BottomNav />
    </motion.div>
  )
}
