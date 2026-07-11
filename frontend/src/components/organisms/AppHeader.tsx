import React from 'react'
import { motion } from 'framer-motion'

interface AppHeaderProps {
  title?: string
  onMenuClick?: () => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'Contact Manager', onMenuClick }) => {
  return (
    <motion.header className="bg-white border-b border-neutral-200 px-24 py-16 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-16">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="text-neutral-600 hover:text-neutral-900"
              aria-label="Menu"
            >
              ☰
            </button>
          )}
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
        </div>

        <nav className="flex items-center gap-16">
          <a href="/" className="text-neutral-600 hover:text-neutral-900 text-sm">
            Home
          </a>
          <a href="/contacts" className="text-neutral-600 hover:text-neutral-900 text-sm">
            Contacts
          </a>
          <a href="/about" className="text-neutral-600 hover:text-neutral-900 text-sm">
            About
          </a>
        </nav>
      </div>
    </motion.header>
  )
}

AppHeader.displayName = 'AppHeader'
