import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AlertVariant = 'success' | 'warning' | 'error' | 'info'

interface AlertProps {
  children: React.ReactNode
  variant?: AlertVariant
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

const variantStyles: Record<AlertVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
}

const iconMap: Record<AlertVariant, string> = {
  success: '✓',
  warning: '⚠',
  error: '✕',
  info: 'ℹ',
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`${variantStyles[variant]} border-2 rounded-md p-16 flex items-start gap-12`}
        >
          <span className="text-lg">{iconMap[variant]}</span>
          <div className="flex-1">
            {title && <h4 className="font-semibold mb-4">{title}</h4>}
            <p>{children}</p>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-neutral-400 hover:text-neutral-600"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

Alert.displayName = 'Alert'
