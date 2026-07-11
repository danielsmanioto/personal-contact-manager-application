import React from 'react'

type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  type?: InputType
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, type = 'text', className = '', ...props }, ref) => {
    const baseStyles = 'w-full px-12 py-8 text-base border-2 rounded-md transition-colors focus-visible:outline-none focus-visible:border-primary-500'
    const borderColor = error ? 'border-error-DEFAULT' : props.disabled ? 'border-neutral-300' : 'border-neutral-200'
    const focusColor = error ? 'focus:border-error-DEFAULT' : 'focus:border-primary-500'

    return (
      <div className="flex flex-col gap-4">
        {label && (
          <label htmlFor={props.id} className="text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-error-DEFAULT ml-2">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`${baseStyles} ${borderColor} ${focusColor} disabled:bg-neutral-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-error-DEFAULT flex items-center gap-2">❌ {error}</p>}
        {helperText && !error && <p className="text-sm text-neutral-500">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
