import React from 'react'

interface IconProps extends React.SVGAttributes<SVGElement> {
  size?: number
  label?: string
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, label, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={label}
      {...props}
    />
  )
)

Icon.displayName = 'Icon'
