import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Contact, ContactRequest } from '../../types';
import Button from '../Common/Button';
import Input from '../Common/Input';

interface ContactFormProps {
  initialValues?: Contact;
  onSubmit: (data: ContactRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ContactForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactRequest>({
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      birthDate: initialValues?.birthDate || '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        email: initialValues.email,
        phone: initialValues.phone || '',
        birthDate: initialValues.birthDate || '',
      });
    }
  }, [initialValues, reset]);

  const handleFormSubmit = async (_data: ContactRequest) => {
    await onSubmit(_data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Name"
            placeholder="John Doe"
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 1,
                message: 'Name must be at least 1 character',
              },
              maxLength: {
                value: 255,
                message: 'Name must not exceed 255 characters',
              },
            })}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address',
              },
            })}
            error={errors.email?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          label="Phone"
          placeholder="1234567890"
          {...register('phone', {
            pattern: {
              value: /^[0-9]{10,20}$/,
              message: 'Phone must be 10-20 digits',
            },
          })}
          error={errors.phone?.message}
          helperText="10-20 digits (optional)"
          disabled={isLoading}
        />

        <Input
          label="Birth Date"
          type="date"
          {...register('birthDate')}
          error={errors.birthDate?.message}
          helperText="Optional"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          isLoading={isLoading}
          className="flex-1"
        >
          {initialValues ? 'Update Contact' : 'Create Contact'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
