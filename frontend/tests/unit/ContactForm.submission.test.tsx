import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../src/components/ContactForm/ContactForm';

describe('ContactForm - Submission', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  it('should enable submit button after filling required fields', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Initially disabled
    expect(submitButton).toBeDisabled();

    // Fill name
    await user.type(nameInput, 'João Silva');
    expect(submitButton).toBeDisabled();

    // Fill email
    await user.type(emailInput, 'joao@example.com');

    // Wait for button to enable
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should call onSubmit with correct data when form is submitted', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const phoneInput = screen.getByLabelText(/Telefone/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Fill form
    await user.type(nameInput, 'Maria Silva');
    await user.type(emailInput, 'maria@example.com');
    await user.type(phoneInput, '11987654321');

    // Submit form
    await user.click(submitButton);

    // Verify onSubmit was called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Maria Silva',
          email: 'maria@example.com',
          phone: '11987654321',
        })
      );
    });
  });

  it('should submit form with empty optional fields', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Fill only required fields
    await user.type(nameInput, 'Alex');
    await user.type(emailInput, 'alex@example.com');

    // Submit
    await user.click(submitButton);

    // Verify submission with empty optional fields
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alex',
          email: 'alex@example.com',
          phone: '',
          birthDate: '',
        })
      );
    });
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });

    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Fill form
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');

    // Submit (button should show loading state)
    await user.click(submitButton);

    // During submission, button should be disabled and show loading indicator
    expect(submitButton).toBeDisabled();
  });

  it('should not submit when name is empty', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Fill only email
    await user.type(emailInput, 'test@example.com');

    // Submit button should still be disabled
    expect(submitButton).toBeDisabled();
  });

  it('should not submit when email is invalid', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Fill with invalid email
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'invalid-email');

    // Submit button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();

    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    // Fill and submit
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    // After submission, form should be reset
    await waitFor(() => {
      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
    });
  });
});
