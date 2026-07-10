import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from './ContactForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Contact } from '../../types';

describe('ContactForm', () => {
  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    birthDate: '1990-01-15',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  let mockSubmit: ReturnType<typeof vi.fn>;
  let mockCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSubmit = vi.fn().mockResolvedValue(undefined);
    mockCancel = vi.fn();
  });

  it('renders create form without initial values', () => {
    render(<ContactForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    expect(screen.getByText('Create Contact')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toHaveValue('');
  });

  it('renders edit form with pre-filled values', () => {
    render(<ContactForm initialValues={mockContact} onSubmit={mockSubmit} onCancel={mockCancel} />);

    expect(screen.getByText('Update Contact')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button clicked', () => {
    render(<ContactForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockCancel).toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<ContactForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const submitButton = screen.getByText('Create Contact');

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Jane Smith',
          email: 'jane@example.com',
        })
      );
    });
  });

  it('disables form while loading', () => {
    render(<ContactForm onSubmit={mockSubmit} onCancel={mockCancel} isLoading={true} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

  it('shows loading spinner while submitting', () => {
    render(<ContactForm onSubmit={mockSubmit} onCancel={mockCancel} isLoading={true} />);

    const buttons = screen.getAllByRole('button');
    const submitButton = buttons[0];
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<ContactForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const submitButton = screen.getByText('Create Contact');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });
});
