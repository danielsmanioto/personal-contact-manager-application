import React from 'react'
import { Input } from '@components/atoms'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  hint?: string
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      hint,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        id={id}
        label={label}
        error={error}
        helperText={helperText || hint}
        icon={icon}
        {...props}
      />
    )
  }
)

FormField.displayName = 'FormField'
