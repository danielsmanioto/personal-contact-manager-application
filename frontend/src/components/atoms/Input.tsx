import { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  required?: boolean;
  hint?: string;
}

export const Input = ({
  label,
  error,
  icon,
  required,
  hint,
  className,
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">{icon}</div>}

        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-md border transition-all duration-200 font-inter',
            'focus:outline-none focus:ring-2 focus:ring-sky-500',
            icon ? 'pl-10' : '',
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-400 focus:border-sky-500',
            className
          )}
          {...props}
        />

        {!error && props.value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
            ✓
          </div>
        )}

        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            ✕
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="mt-2 text-xs text-gray-600">{hint}</p>}
    </div>
  );
};
