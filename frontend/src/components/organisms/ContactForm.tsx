import React, { useState } from 'react'
import { Button } from '@components/atoms'
import { FormField } from '@components/molecules'
import { motion } from 'framer-motion'

interface ContactFormData {
  name: string
  email: string
  phone: string
  notes: string
}

interface ContactFormProps {
  initialValues?: Partial<ContactFormData>
  onSubmit: (data: ContactFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export const ContactForm: React.FC<ContactFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: initialValues.name || '',
    email: initialValues.email || '',
    phone: initialValues.phone || '',
    notes: initialValues.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')

    try {
      await onSubmit(formData)
      setSuccessMessage('Contact saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ form: 'Failed to save contact' })
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {successMessage && (
        <div className="bg-green-50 border-2 border-green-200 text-green-700 p-12 rounded-md">
          ✓ {successMessage}
        </div>
      )}

      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
      />

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
        error={errors.phone}
      />

      <FormField
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, notes: e.target.value })}
        error={errors.notes}
      />

      <div className="flex gap-12 justify-end">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={isLoading}>
          Save Contact
        </Button>
      </div>
    </motion.form>
  )
}

ContactForm.displayName = 'ContactForm'
