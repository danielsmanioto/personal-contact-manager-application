import React from 'react'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-8 py-2 text-xs',
  md: 'px-12 py-4 text-sm',
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'primary', size = 'sm', icon, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-4 font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]}`}
        {...props}
      >
        {icon && <span>{icon}</span>}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
