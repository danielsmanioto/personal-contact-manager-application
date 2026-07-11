import React from 'react'
import { Card, Badge } from '@components/atoms'
import { Avatar } from '@components/molecules'
import { motion } from 'framer-motion'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
}

interface ContactCardProps {
  contact: Contact
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  selected?: boolean
}

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onClick,
  onEdit,
  onDelete,
  selected = false,
}) => {
  return (
    <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
      <Card
        interactive
        onClick={onClick}
        className={`cursor-pointer ${selected ? 'ring-2 ring-primary-500' : ''}`}
      >
        <div className="flex gap-16 items-start">
          <Avatar initials={contact.name.charAt(0).toUpperCase()} />
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900">{contact.name}</h3>
            {contact.email && <p className="text-sm text-neutral-600">{contact.email}</p>}
            {contact.phone && <p className="text-sm text-neutral-600">{contact.phone}</p>}
          </div>
          <div className="flex gap-8">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="text-primary-600 hover:text-primary-700"
                aria-label="Edit contact"
              >
                ✎
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="text-error-DEFAULT hover:text-red-700"
                aria-label="Delete contact"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

ContactCard.displayName = 'ContactCard'
