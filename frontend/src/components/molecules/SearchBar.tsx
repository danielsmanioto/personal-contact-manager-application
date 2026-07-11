import React, { useState } from 'react'
import { Input } from '@components/atoms'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSearch?: () => void
  disabled?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onSearch,
  disabled,
}) => {
  return (
    <div className="relative flex items-center">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onSearch) onSearch()
          if (e.key === 'Escape') onChange('')
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-16 text-neutral-400 hover:text-neutral-600"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}

SearchBar.displayName = 'SearchBar'
