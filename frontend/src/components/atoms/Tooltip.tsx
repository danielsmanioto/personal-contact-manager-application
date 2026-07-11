import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClass: Record<string, string> = {
    top: 'bottom-full mb-8 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-8 left-1/2 -translate-x-1/2',
    left: 'right-full mr-8 top-1/2 -translate-y-1/2',
    right: 'left-full ml-8 top-1/2 -translate-y-1/2',
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute whitespace-nowrap bg-neutral-900 text-white text-xs px-8 py-4 rounded-md ${positionClass[position]} z-tooltip`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Tooltip.displayName = 'Tooltip'
