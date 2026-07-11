import React from 'react'

type InputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  type?: InputType
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, type = 'text', className = '', icon, ...props }, ref) => {
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
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`${baseStyles} ${borderColor} ${focusColor} disabled:bg-neutral-100 disabled:cursor-not-allowed ${icon ? 'pl-10' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-error-DEFAULT flex items-center gap-2">❌ {error}</p>}
        {helperText && !error && <p className="text-sm text-neutral-500">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
