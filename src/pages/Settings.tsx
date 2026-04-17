import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { BottomNav } from '@/components/ui/BottomNav'
import { useAuth } from '@/context/AuthContext'

export function Settings() {
  const { user, profile, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await signOut()
  }

  const settingGroups = [
    {
      title: 'Account',
      items: [
        { emoji: '👤', label: 'Edit Profile' },
        { emoji: '🔒', label: 'Change Password' },
        { emoji: '🔔', label: 'Notifications' },
      ],
    },
    {
      title: 'About',
      items: [
        { emoji: '⭐', label: 'Rate TreeScan' },
        { emoji: '📩', label: 'Send Feedback' },
        { emoji: 'ℹ️', label: 'App Version 1.0.0' },
      ],
    },
  ]

  return (
    <motion.div
      className="min-h-screen bg-cream pb-28"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="pt-14 pb-4">
          <h1 className="font-serif text-[22px] text-plant-dark">Profile</h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center py-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={displayName} className="w-[72px] h-[72px] rounded-full object-cover" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-mint-2 flex items-center justify-center">
              <span className="font-serif text-2xl text-sage-deep">{initials}</span>
            </div>
          )}
          <h2 className="text-base font-semibold text-plant-dark mt-3">{displayName}</h2>
          <p className="text-xs text-plant-light mt-0.5">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Total Scans', value: profile?.scan_count?.toString() || '0' },
            { label: 'In Garden', value: '4' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-[20px] shadow-card p-4 text-center">
              <p className="text-xl font-semibold text-sage-deep">{stat.value}</p>
              <p className="text-xs text-plant-light mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
          {settingGroups.map(group => (
            <div key={group.title}>
              <p className="text-[10px] uppercase tracking-widest text-plant-light font-medium mb-2 px-1">{group.title}</p>
              <div className="bg-white rounded-[20px] shadow-card overflow-hidden divide-y divide-cream-2">
                {group.items.map(item => (
                  <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-cream active:bg-cream transition-colors">
                    <span className="text-lg w-6">{item.emoji}</span>
                    <span className="flex-1 text-left text-sm text-plant-dark">{item.label}</span>
                    <ChevronRight size={16} className="text-plant-light" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full bg-cream-2 text-sage-deep font-semibold text-sm rounded-[20px] py-3.5 mt-2 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            {isSigningOut ? 'Signing out…' : 'Sign Out'}
          </button>

          <button className="w-full text-[#D95555] text-sm font-semibold py-2">
            Delete Account
          </button>
        </div>
      </div>

      <BottomNav />
    </motion.div>
  )
}
