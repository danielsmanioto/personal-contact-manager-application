import React from 'react'
import { Input } from '@components/atoms'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  required,
  disabled,
  placeholder,
}) => {
  return (
    <Input
      id={name}
      name={name}
      type={type}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    />
  )
}

FormField.displayName = 'FormField'
