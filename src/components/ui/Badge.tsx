type BadgeVariant = 'healthy' | 'warning' | 'critical' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const badgeClasses: Record<BadgeVariant, string> = {
  healthy: 'bg-mint-2 text-sage-deep',
  warning: 'bg-[#FEF3D8] text-[#8B6010]',
  critical: 'bg-[#FCE8E8] text-[#8B2020]',
  neutral: 'bg-cream-2 text-plant-mid',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${badgeClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
