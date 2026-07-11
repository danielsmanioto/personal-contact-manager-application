import React from 'react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeMap = { sm: 24, md: 32, lg: 48 }

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', label }) => {
  const dimension = sizeMap[size]

  return (
    <div className="flex flex-col items-center gap-12">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, easing: 'linear' }}
      >
        <svg
          width={dimension}
          height={dimension}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" opacity="0.1" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            strokeLinecap="round"
            className="text-primary-600"
          />
        </svg>
      </motion.div>
      {label && <p className="text-sm text-neutral-600">{label}</p>}
    </div>
  )
}

LoadingSpinner.displayName = 'LoadingSpinner'
