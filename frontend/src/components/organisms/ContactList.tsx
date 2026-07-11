import React, { useState } from 'react'
import { ContactCard } from './ContactCard'
import { SearchBar, LoadingSpinner } from '@components/molecules'

interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
}

interface ContactListProps {
  contacts: Contact[]
  loading?: boolean
  error?: string
  onSearch?: (query: string) => void
  onSelect?: (contact: Contact) => void
  onEdit?: (contact: Contact) => void
  onDelete?: (contactId: string) => void
  viewMode?: 'grid' | 'list'
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  loading = false,
  error,
  onSearch,
  onSelect,
  onEdit,
  onDelete,
  viewMode = 'grid',
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) {
    return <LoadingSpinner label="Loading contacts..." />
  }

  if (error) {
    return (
      <div className="text-center py-32 text-error-DEFAULT">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-32 text-neutral-600">
        <p>No contacts found. Create your first contact!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-16">
      <SearchBar
        value={searchQuery}
        onChange={(query) => {
          setSearchQuery(query)
          onSearch?.(query)
        }}
        placeholder="Search contacts..."
      />
      <div
        className={viewMode === 'grid' ? 'grid grid-cols-1 gap-16 md:grid-cols-2' : 'flex flex-col gap-12'}
      >
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onClick={() => onSelect?.(contact)}
            onEdit={() => onEdit?.(contact)}
            onDelete={() => onDelete?.(contact.id)}
          />
        ))}
      </div>
    </div>
  )
}

ContactList.displayName = 'ContactList'
