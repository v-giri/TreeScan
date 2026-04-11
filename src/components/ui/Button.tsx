import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  isLoading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const variantClasses: Record<string, string> = {
  primary: 'bg-sage-deep text-white shadow-fab rounded-full',
  secondary: 'bg-white border border-sage-dark text-sage-dark rounded-[20px]',
  ghost: 'bg-transparent text-sage-dark',
  danger: 'bg-[#FCE8E8] text-[#8B2020] rounded-[20px]',
}

export function Button({
  variant = 'primary',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      className={`
        font-sans text-sm font-semibold py-3.5 px-4 
        flex items-center justify-center gap-2
        transition-opacity duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </motion.button>
  )
}
