import React from 'react'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export const Heading1: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`text-4xl font-bold text-neutral-900 ${className}`}>{children}</h1>
)

export const Heading2: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={`text-3xl font-semibold text-neutral-900 ${className}`}>{children}</h2>
)

export const Heading3: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold text-neutral-900 ${className}`}>{children}</h3>
)

export const Paragraph: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`text-base text-neutral-700 leading-normal ${className}`}>{children}</p>
)

export const Label: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <label className={`text-sm font-medium text-neutral-700 ${className}`}>{children}</label>
)

export const Caption: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`text-xs text-neutral-500 ${className}`}>{children}</span>
)
