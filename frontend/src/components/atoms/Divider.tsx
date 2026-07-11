import React from 'react'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'sm' | 'md' | 'lg'
}

const spacingStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'my-8 mx-8',
  md: 'my-16 mx-16',
  lg: 'my-24 mx-24',
}

export const Divider: React.FC<DividerProps> = ({ orientation = 'horizontal', spacing = 'md' }) => {
  if (orientation === 'vertical') {
    return <div className={`w-px h-16 bg-neutral-200 ${spacingStyles[spacing]}`} />
  }

  return <hr className={`border-none border-t border-neutral-200 ${spacingStyles[spacing]}`} />
}

Divider.displayName = 'Divider'
