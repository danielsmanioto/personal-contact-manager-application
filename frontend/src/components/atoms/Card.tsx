import React from 'react'

type CardElevation = 'sm' | 'md' | 'lg'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title?: string
  elevation?: CardElevation
  padding?: 'sm' | 'md' | 'lg'
  interactive?: boolean
}

const elevationStyles: Record<CardElevation, string> = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
}

const paddingStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'p-12',
  md: 'p-16',
  lg: 'p-24',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, title, elevation = 'md', padding = 'md', interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`bg-white rounded-lg ${elevationStyles[elevation]} ${paddingStyles[padding]} ${interactive ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
        {...props}
      >
        {title && <h3 className="text-lg font-semibold text-neutral-900 mb-12">{title}</h3>}
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'
