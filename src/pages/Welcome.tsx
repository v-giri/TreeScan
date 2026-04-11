import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Welcome() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="min-h-screen bg-sage-deep flex flex-col px-6 py-10 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-center items-center gap-3 mb-12 md:max-w-md md:mx-auto md:w-full relative z-10">
        <div className="w-12 h-12 bg-white/20 rounded-[14px] flex items-center justify-center">
          <span className="text-2xl">🌿</span>
        </div>
        <span className="text-white font-semibold text-xl md:text-2xl">TreeScan</span>
      </div>

      {/* Hero */}
      <div className="flex-1 md:max-w-md md:mx-auto md:w-full md:flex md:flex-col md:justify-center relative z-10">
        <motion.h1
          className="font-serif italic text-center mx-auto text-white text-[24px] md:text-[28px] leading-tight mb-3 max-w-[280px] md:max-w-[400px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Know your plants,<br />heal your garden
        </motion.h1>
        <motion.p
          className="text-white/70 text-xs md:text-sm text-center mx-auto mb-10 leading-relaxed max-w-[280px] md:max-w-[340px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          AI-powered plant health analysis in seconds.
        </motion.p>

        {/* Features */}
        <motion.div
          className="space-y-4 mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {[
            { emoji: '🔍', title: 'Instant Identification', desc: 'Identify 10,000+ plant species' },
            { emoji: '🩺', title: 'Health Analysis', desc: 'Detect diseases & deficiencies' },
            { emoji: '💊', title: 'Treatment Plans', desc: 'AI-generated care instructions' },
          ].map(f => (
            <div key={f.title} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/15 rounded-[14px] flex items-center justify-center flex-shrink-0 text-lg">
                {f.emoji}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{f.title}</p>
                <p className="text-white/60 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => navigate('/signup')}
            className="w-full !bg-white !text-sage-deep rounded-full py-3.5 text-sm font-semibold"
          >
            Get Started
          </Button>
          <button
            onClick={() => navigate('/login')}
            className="w-full text-white/80 text-sm py-2 underline underline-offset-2"
          >
            Sign In
          </button>
        </motion.div>
      </div>

      {/* Decorative plant */}
      <div className="absolute bottom-10 right-4 text-[100px] leading-none opacity-20 pointer-events-none select-none">
        🌿
      </div>
    </motion.div>
  )
}
