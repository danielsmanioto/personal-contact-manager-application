import React from 'react'
import { Input } from '@components/atoms'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  id?: string
  icon?: React.ReactNode
  hint?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      name,
      type = 'text',
      value,
      onChange,
      onBlur,
      error,
      helperText,
      required,
      disabled,
      placeholder,
      id,
      icon,
      hint,
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        id={id || name}
        name={name}
        type={type}
        label={label}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        error={error}
        helperText={helperText || hint}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        icon={icon}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
    )
  }
)

FormField.displayName = 'FormField'
