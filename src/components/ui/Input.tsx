import React, { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs text-plant-mid font-medium"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          bg-white border-[1.5px] rounded-[14px] px-4 py-3
          font-sans text-sm text-plant-dark placeholder:text-plant-light
          transition-all duration-150 outline-none
          ${error
            ? 'border-[#D95555] focus:ring-2 focus:ring-[#D95555]/20'
            : 'border-cream-2 focus:border-sage-dark focus:ring-2 focus:ring-sage-dark/15'
          }
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[11px] text-[#D95555] font-medium">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
