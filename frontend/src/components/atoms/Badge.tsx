import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-sky-50 text-sky-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-red-50 text-red-600',
  info: 'bg-sky-50 text-sky-600',
};

export const Badge = ({ children, variant = 'primary', className }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 rounded-full text-xs font-semibold',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
