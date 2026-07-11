import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ContactForm from '../../src/components/ContactForm/ContactForm';
import type { ContactRequest } from '../../src/types';

describe('ContactForm - Rendering', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('should display all four form fields', () => {
    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // Check for all four fields by their labels
    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data de Nascimento/i)).toBeInTheDocument();
  });

  it('should display submit button and it starts disabled', () => {
    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should display cancel button', () => {
    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    expect(cancelButton).toBeInTheDocument();
  });

  it('should have proper field types', () => {
    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const phoneInput = screen.getByLabelText(/Telefone/i) as HTMLInputElement;
    const birthDateInput = screen.getByLabelText(/Data de Nascimento/i) as HTMLInputElement;

    expect(emailInput.type).toBe('email');
    expect(phoneInput.type).toBe('tel');
    expect(birthDateInput.type).toBe('date');
  });

  it('should display placeholder text for guidance', () => {
    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByPlaceholderText(/João da Silva/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\(11\) 98765-4321/i)).toBeInTheDocument();
  });

  it('should show hint text for optional fields', () => {
    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/Opcional - 10 a 20 dígitos/i)).toBeInTheDocument();
    expect(screen.getByText(/Opcional - Apenas datas passadas/i)).toBeInTheDocument();
  });

  it('should show "Atualizar" button when editing', () => {
    const existingContact = {
      id: 'test-id',
      name: 'João',
      email: 'joao@example.com',
      phone: '11987654321',
      birthDate: '1990-05-20',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(
      <ContactForm
        initialValues={existingContact}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const updateButton = screen.getByRole('button', { name: /Atualizar Contato/i });
    expect(updateButton).toBeInTheDocument();
  });

  it('should disable all inputs when isLoading is true', () => {
    render(
      <ContactForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const nameInput = screen.getByLabelText(/Nome Completo/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /Criar Contato/i });

    expect(nameInput.disabled).toBe(true);
    expect(emailInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
  });
});
