import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../src/components/ContactForm/ContactForm';

describe('ContactForm - Real-Time Validation & Button State Machine', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  describe('Button State Machine', () => {
    it('should start with disabled button on empty form', () => {
      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Criar Contato/i });
      expect(submitButton).toBeDisabled();
    });

    it('should remain disabled with only name filled', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nome Completo/i);
      const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

      await user.type(nameInput, 'John Doe');

      expect(submitButton).toBeDisabled();
    });

    it('should enable when both name and email are valid', async () => {
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

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should become disabled again when email becomes invalid', async () => {
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

      // Fill valid form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Make email invalid by deleting domain
      await user.tripleClick(emailInput);
      await user.type(emailInput, 'john@', { skipAutoClose: true });

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should remain enabled when optional phone is cleared', async () => {
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

      // Fill valid form with phone
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(phoneInput, '11987654321');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Clear phone
      await user.clear(phoneInput);

      // Button should remain enabled (phone is optional)
      expect(submitButton).not.toBeDisabled();
    });

    it('should become disabled when optional phone becomes invalid', async () => {
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

      // Fill valid form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Add invalid phone (too short)
      await user.type(phoneInput, '123');

      // Button should be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should re-enable when invalid phone is corrected', async () => {
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

      // Fill form with invalid phone
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(phoneInput, '123');

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      // Fix phone
      await user.clear(phoneInput);
      await user.type(phoneInput, '11987654321');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should handle future birth date (disable button)', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const birthDateInput = screen.getByLabelText(/Data de Nascimento/i);
      const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

      // Fill valid form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      // Add future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      await user.type(birthDateInput, futureDateString);

      // Button should be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('should enable with valid past birth date', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/Email/i);
      const birthDateInput = screen.getByLabelText(/Data de Nascimento/i);
      const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

      // Fill form
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(birthDateInput, '1990-05-20');

      // Button should be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should follow correct state transitions through multiple changes', async () => {
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

      // State 1: Empty form → Disabled
      expect(submitButton).toBeDisabled();

      // State 2: Only name → Disabled
      await user.type(nameInput, 'Test');
      expect(submitButton).toBeDisabled();

      // State 3: Name + valid email → Enabled
      await user.type(emailInput, 'test@example.com');
      await waitFor(() => expect(submitButton).not.toBeDisabled());

      // State 4: Add invalid phone → Disabled
      await user.type(phoneInput, '123');
      await waitFor(() => expect(submitButton).toBeDisabled());

      // State 5: Fix phone → Enabled
      await user.clear(phoneInput);
      await user.type(phoneInput, '11987654321');
      await waitFor(() => expect(submitButton).not.toBeDisabled());

      // State 6: Clear phone (optional) → Enabled
      await user.clear(phoneInput);
      expect(submitButton).not.toBeDisabled();

      // State 7: Make email invalid → Disabled
      await user.tripleClick(emailInput);
      await user.type(emailInput, 'invalid', { skipAutoClose: true });
      await waitFor(() => expect(submitButton).toBeDisabled());

      // State 8: Fix email → Enabled
      await user.tripleClick(emailInput);
      await user.type(emailInput, 'test@example.com', { skipAutoClose: true });
      await waitFor(() => expect(submitButton).not.toBeDisabled());
    });
  });
});
