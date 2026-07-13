import React from 'react'
import { motion } from 'framer-motion'
import { hoverScale, activeScale } from '@utils/animations'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  isLoading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 active:bg-neutral-400',
  tertiary: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100',
  danger: 'bg-error-DEFAULT text-white hover:bg-red-700 active:bg-red-800',
  ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-50 active:bg-neutral-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-12 py-6 text-sm',
  md: 'px-16 py-8 text-base',
  lg: 'px-24 py-12 text-lg',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = 'primary', size = 'md', loading = false, fullWidth = false, icon, isLoading, ...props },
    ref
  ) => {
    const isLoadingState = loading || isLoading
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-50 disabled:cursor-not-allowed'
    const variantClass = variantStyles[variant]
    const sizeClass = sizeStyles[size]
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass}`}
        whileHover={!props.disabled && !isLoadingState ? hoverScale : {}}
        whileTap={!props.disabled && !isLoadingState ? activeScale : {}}
        disabled={props.disabled || isLoadingState}
        {...props}
      >
        {isLoadingState ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading...
          </>
        ) : (
          <>
            {icon && <span className="mr-2">{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
