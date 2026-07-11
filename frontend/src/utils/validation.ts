import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must not exceed 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .transform(val => val?.trim() || '')
    .refine(
      (val) => !val || /^[0-9]{10,20}$/.test(val),
      'Phone must be 10-20 digits'
    )
    .optional(),
  birthDate: z
    .string()
    .transform(val => val?.trim() || '')
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      'Please enter a valid date'
    )
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return date <= new Date();
    }, 'Birth date must be in the past')
    .optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
