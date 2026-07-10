import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Contact, ContactRequest } from '../../types';
import { contactSchema, type ContactFormData } from '../../utils/validation';
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
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
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

  const handleFormSubmit = async (data: ContactFormData) => {
    await onSubmit(data as ContactRequest);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Name"
            placeholder="John Doe"
            {...register('name')}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          label="Phone"
          placeholder="1234567890"
          {...register('phone')}
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
