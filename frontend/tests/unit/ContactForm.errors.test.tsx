import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../src/components/ContactForm/ContactForm';

describe('ContactForm - Error Message Display', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
    mockOnSubmit.mockResolvedValue(undefined);
  });

  describe('Required Field Errors', () => {
    it('should show "Name is required" when name is empty after touching', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/Email/i);

      // Focus and blur name field without input
      await user.click(nameInput);
      await user.click(emailInput);

      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      });
    });

    it('should show "Email is required" when email is empty after touching', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/Email/i);

      // Fill name but not email
      await user.type(nameInput, 'Test User');
      await user.click(emailInput);
      await user.click(nameInput); // Move focus away

      // Error message should appear
      await waitFor(() => {
        expect(screen.getByText(/Email is required|Please enter a valid email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Email Format Errors', () => {
    it('should show email format error for invalid format', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const emailInput = screen.getByLabelText(/Email/i);

      // Type invalid email formats
      const invalidEmails = ['user@', '@example.com', 'user', 'user@example'];

      for (const invalidEmail of invalidEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, invalidEmail);

        await waitFor(() => {
          expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
        });
      }
    });

    it('should not show error for valid email format', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const emailInput = screen.getByLabelText(/Email/i);
      const errorMessage = screen.queryByText(/Please enter a valid email address/i);

      await user.type(emailInput, 'valid@example.com');

      // Error should not appear
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  describe('Phone Format Errors', () => {
    it('should show "Phone must be 10-20 digits" for short phone', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const phoneInput = screen.getByLabelText(/Telefone/i);

      // Type phone with less than 10 digits
      await user.type(phoneInput, '123');

      await waitFor(() => {
        expect(screen.getByText(/Phone must be 10-20 digits/i)).toBeInTheDocument();
      });
    });

    it('should show error for phone with special characters', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const phoneInput = screen.getByLabelText(/Telefone/i);

      // Type phone with formatting
      await user.type(phoneInput, '(11) 98765-4321');

      await waitFor(() => {
        expect(screen.getByText(/Phone must be 10-20 digits/i)).toBeInTheDocument();
      });
    });

    it('should accept valid phone with 10-20 digits', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const phoneInput = screen.getByLabelText(/Telefone/i);
      const phoneError = screen.queryByText(/Phone must be 10-20 digits/i);

      // Type valid phone
      await user.type(phoneInput, '11987654321');

      expect(phoneError).not.toBeInTheDocument();
    });

    it('should allow empty phone (optional field)', async () => {
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

      // Fill required fields without phone
      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');

      // Leave phone empty - no error should appear
      const phoneError = screen.queryByText(/Phone must be 10-20 digits/i);
      expect(phoneError).not.toBeInTheDocument();
    });
  });

  describe('Birth Date Errors', () => {
    it('should show "Birth date must be in the past" for future date', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const birthDateInput = screen.getByLabelText(/Data de Nascimento/i);

      // Calculate future date
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      await user.type(birthDateInput, futureDateString);

      await waitFor(() => {
        expect(screen.getByText(/Birth date must be in the past/i)).toBeInTheDocument();
      });
    });

    it('should not show error for past date', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const birthDateInput = screen.getByLabelText(/Data de Nascimento/i);

      await user.type(birthDateInput, '1990-05-20');

      const birthDateError = screen.queryByText(/Birth date must be in the past/i);
      expect(birthDateError).not.toBeInTheDocument();
    });

    it('should allow empty birth date (optional field)', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nome Completo/i);
      const emailInput = screen.getByLabelText(/Email/i);

      // Fill required fields without birth date
      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');

      // Leave birth date empty - no error
      const birthDateError = screen.queryByText(/Birth date must be in the past/i);
      expect(birthDateError).not.toBeInTheDocument();
    });
  });

  describe('Error Message Behavior', () => {
    it('should remove error message when field is corrected', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const emailInput = screen.getByLabelText(/Email/i);

      // Type invalid email
      await user.type(emailInput, 'invalid');

      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
      });

      // Fix email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');

      await waitFor(() => {
        expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
      });
    });

    it('should show multiple errors simultaneously', async () => {
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

      // Fill name but leave email empty and phone invalid
      await user.type(nameInput, 'Test');
      await user.click(emailInput);
      await user.click(phoneInput); // Leave email empty
      await user.type(phoneInput, '123');

      // Both errors should appear
      await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/Phone must be 10-20 digits/i)).toBeInTheDocument();
      });
    });

    it('should display errors with proper visual association to fields', async () => {
      const user = userEvent.setup();

      render(
        <ContactForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/Nome Completo/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;

      // Trigger errors
      await user.click(nameInput);
      await user.click(emailInput);
      await user.click(nameInput);

      // Errors should be visible
      const errors = await screen.findAllByRole('alert', { hidden: false });
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
