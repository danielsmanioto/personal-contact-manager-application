import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Contact, ContactRequest } from '../../types';
import { contactSchema, type ContactFormData } from '../../utils/validation';
import { Button } from '../atoms';
import { FormField } from '../molecules';
import { Mail, Phone, Calendar, User } from 'lucide-react';

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
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      birthDate: initialValues?.birthDate || '',
    },
  });

  const formValues = watch();

  // Manual validity check - button enables when required fields are filled
  const hasName = formValues.name && formValues.name.trim().length > 0;
  const hasEmail = formValues.email && formValues.email.trim().length > 0;
  const isFormValid = hasName && hasEmail;

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
      <div className="space-y-6">
        {/* Name Field */}
        <FormField
          id="name"
          label="Nome Completo"
          placeholder="João da Silva"
          icon={<User className="w-4 h-4" />}
          hint="Máximo 255 caracteres"
          required
          disabled={isLoading}
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Email Field */}
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          icon={<Mail className="w-4 h-4" />}
          hint="Formato: nome@dominio.com"
          required
          disabled={isLoading}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Phone Field */}
        <FormField
          id="phone"
          label="Telefone"
          placeholder="(11) 98765-4321"
          icon={<Phone className="w-4 h-4" />}
          hint="Opcional - 10 a 20 dígitos"
          disabled={isLoading}
          error={errors.phone?.message}
          {...register('phone')}
        />

        {/* Birth Date Field */}
        <FormField
          id="birthDate"
          label="Data de Nascimento"
          type="date"
          icon={<Calendar className="w-4 h-4" />}
          hint="Opcional - Apenas datas passadas"
          disabled={isLoading}
          error={errors.birthDate?.message}
          {...register('birthDate')}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-400">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading || !isFormValid}
          isLoading={isLoading}
          className="flex-1"
        >
          {initialValues ? '✎ Atualizar Contato' : '+ Criar Contato'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
