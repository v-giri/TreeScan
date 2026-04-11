import React from 'react'

interface CardProps {
  variant?: 'surface' | 'hero' | 'tile' | 'mint'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const variantClasses: Record<string, string> = {
  surface: 'bg-white rounded-[20px] shadow-card p-4',
  hero: 'bg-sage-deep rounded-[28px] overflow-hidden relative',
  tile: 'bg-white rounded-[28px] shadow-card p-4',
  mint: 'bg-mint rounded-[14px] p-3',
}

export function Card({ variant = 'surface', children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
