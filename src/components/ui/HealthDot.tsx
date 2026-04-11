type HealthStatus = 'healthy' | 'warning' | 'critical'

interface HealthDotProps {
  status: HealthStatus
  className?: string
}

const statusColors: Record<HealthStatus, string> = {
  healthy: 'bg-[#5BAF6A]',
  warning: 'bg-[#E0A030]',
  critical: 'bg-[#D95555]',
}

export function HealthDot({ status, className = '' }: HealthDotProps) {
  return (
    <span
      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 inline-block ${statusColors[status]} ${className}`}
      aria-label={`Health status: ${status}`}
    />
  )
}
