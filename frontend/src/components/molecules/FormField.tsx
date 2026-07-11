import { InputHTMLAttributes, ReactNode } from 'react';
import { Input } from '../atoms';
import { cn } from '../../utils/cn';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
  required?: boolean;
  className?: string;
}

export const FormField = ({
  label,
  error,
  icon,
  hint,
  required,
  className,
  ...props
}: FormFieldProps) => {
  return (
    <div className={cn('mb-4', className)}>
      <Input
        label={label}
        error={error}
        icon={icon}
        hint={hint}
        required={required}
        {...props}
      />
    </div>
  );
};
