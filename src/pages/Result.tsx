import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Share2 } from 'lucide-react'
import { BottomNav } from '@/components/ui/BottomNav'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { HealthStatus } from '@/types/scan'

// Demo result data
const demoResult = {
  commonName: 'Monstera Deliciosa',
  scientificName: 'Monstera deliciosa',
  family: 'Araceae',
  confidence: 94,
  health: 'warning' as HealthStatus,
  emoji: '🌿',
  summary: 'Your Monstera is generally healthy but showing early signs of overwatering. The yellowing leaves indicate root stress that can be corrected with improved drainage.',
  problems: ['Yellowing lower leaves (overwatering)', 'Root bound in current pot'],
  treatments: [
    'Reduce watering frequency to every 10–14 days and allow top 2cm of soil to dry out between watering.',
    'Check drainage holes — ensure water flows freely and the pot does not sit in standing water.',
    'Repot to a container 1–2 sizes larger with well-draining potting mix (perlite:soil 30:70).',
    'Remove yellowed leaves with clean scissors to redirect plant energy to healthy growth.',
  ],
  careProfile: {
    watering: 'Every 10–14 days',
    sunlight: 'Bright indirect light',
    soil: 'Well-draining mix',
    fertilizer: 'Monthly (spring/summer)',
  },
  funFact: 'Monstera leaves develop their iconic holes (fenestrations) to survive high winds and allow light to pass through to lower leaves in the rainforest canopy!',
}

export function Result() {
  const navigate = useNavigate()
  const { id } = useParams()
  const result = demoResult // Will come from Supabase in Phase 2

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `TreeScan — ${result.commonName}`,
        text: result.summary,
        url: window.location.href,
      })
    }
  }

  return (
    <motion.div
      className="min-h-screen bg-cream pb-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Hero Header */}
      <div className="bg-sage-deep px-4 pt-14 pb-20">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/15 rounded-[12px] flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <span className="text-white text-sm font-semibold">Scan Result</span>
          <button onClick={handleShare} className="w-9 h-9 bg-white/15 rounded-[12px] flex items-center justify-center">
            <Share2 size={16} className="text-white" />
          </button>
        </div>
        <div className="flex justify-center">
          <span className="text-[80px] leading-none">{result.emoji}</span>
        </div>
      </div>

      {/* Floating Result Card */}
      <div className="mx-4 -mt-14 z-10 relative">
        <motion.div
          className="bg-white rounded-[28px] shadow-card-lg p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="font-serif text-[22px] text-plant-dark">{result.commonName}</h1>
          <p className="text-xs italic text-plant-light mb-3">{result.scientificName}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant={result.health}>
              {result.health === 'healthy' ? '✓ Healthy' : result.health === 'warning' ? '⚠ Needs Attention' : '✗ Critical'}
            </Badge>
            <Badge variant="neutral">{result.family}</Badge>
            <Badge variant="neutral">{result.confidence}% match</Badge>
          </div>

          {/* Confidence Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-plant-light mb-1.5">
              <span>Confidence</span>
              <span>{result.confidence}%</span>
            </div>
            <div className="h-1.5 bg-cream-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sage to-sage-deep rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Summary */}
        <div className="bg-white rounded-[20px] shadow-card p-4">
          <p className="text-xs text-plant-mid leading-relaxed">{result.summary}</p>
        </div>

        {/* Care Grid */}
        <div>
          <h2 className="text-[15px] font-semibold text-plant-dark mb-2">Care Guide</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4">
            {[
              { emoji: '💧', label: 'Watering', value: result.careProfile.watering },
              { emoji: '☀️', label: 'Sunlight', value: result.careProfile.sunlight },
              { emoji: '🌱', label: 'Soil', value: result.careProfile.soil },
              { emoji: '🧪', label: 'Fertilizer', value: result.careProfile.fertilizer },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className="bg-white rounded-[20px] shadow-card p-3.5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <span className="text-xl">{item.emoji}</span>
                <p className="text-[10px] uppercase tracking-wide text-plant-light mt-1">{item.label}</p>
                <p className="text-xs font-semibold text-plant-dark mt-0.5">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Problems */}
        {result.problems.length > 0 && (
          <div>
            <h2 className="text-[15px] font-semibold text-plant-dark mb-2">Issues Detected</h2>
            <div className="bg-white rounded-[20px] shadow-card p-4 space-y-2">
              {result.problems.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#D95555] flex-shrink-0 mt-1" />
                  <p className="text-xs text-plant-mid">{p}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Treatments */}
        <div>
          <h2 className="text-[15px] font-semibold text-plant-dark mb-2">Treatment Plan</h2>
          <div className="space-y-2.5">
            {result.treatments.map((t, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-[20px] shadow-card p-4 flex gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <div className="w-6 h-6 rounded-full bg-mint-2 text-sage-deep text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-xs text-plant-mid leading-relaxed">{t}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        <div className="bg-mint rounded-[20px] p-4 flex gap-3">
          <span className="text-xl flex-shrink-0">💡</span>
          <p className="text-xs text-plant-mid leading-relaxed">{result.funFact}</p>
        </div>

        {/* CTA */}
        <Button fullWidth onClick={() => alert(`Saved! Scan ID: ${id}`)}>
          🪴 Save to Garden
        </Button>
      </div>

      <BottomNav />
    </motion.div>
  )
}
