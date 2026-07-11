import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 shadow-blue',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-400 border border-gray-400 active:bg-gray-400',
  success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  ghost: 'text-sky-500 hover:bg-sky-50 active:bg-sky-100',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs font-semibold h-8',
  md: 'px-4 py-2 text-sm font-semibold h-10',
  lg: 'px-6 py-3 text-base font-semibold h-12',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'rounded-md transition-all duration-200 font-inter disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </span>
    </button>
  );
};
