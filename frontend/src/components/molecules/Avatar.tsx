import React from 'react'

interface AvatarProps {
  src?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  alt?: string
}

const sizeMap = { sm: 32, md: 40, lg: 48 }

export const Avatar: React.FC<AvatarProps> = ({ src, initials, size = 'md', alt = 'Avatar' }) => {
  const dimension = sizeMap[size]

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="rounded-full object-cover"
        style={{ width: dimension, height: dimension }}
      />
    )
  }

  return (
    <div
      className="rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold"
      style={{ width: dimension, height: dimension }}
    >
      {initials}
    </div>
  )
}

Avatar.displayName = 'Avatar'
