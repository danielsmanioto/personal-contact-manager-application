import { render, screen, fireEvent } from '@testing-library/react';
import ContactCard from './ContactCard';
import { describe, it, expect, vi } from 'vitest';
import type { Contact } from '../../types';

describe('ContactCard', () => {
  const mockContact: Contact = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    birthDate: '1990-01-15',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  it('renders contact information', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    render(<ContactCard contact={mockContact} onEdit={mockEdit} onDelete={mockDelete} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    render(<ContactCard contact={mockContact} onEdit={mockEdit} onDelete={mockDelete} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockEdit).toHaveBeenCalledWith(mockContact);
  });

  it('calls onDelete when delete button clicked', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    render(<ContactCard contact={mockContact} onEdit={mockEdit} onDelete={mockDelete} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockDelete).toHaveBeenCalledWith(mockContact.id);
  });

  it('renders email as clickable link', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    render(<ContactCard contact={mockContact} onEdit={mockEdit} onDelete={mockDelete} />);

    const emailLink = screen.getByRole('link', { name: /john@example.com/i });
    expect(emailLink).toHaveAttribute('href', `mailto:${mockContact.email}`);
  });

  it('renders phone as clickable link', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    render(<ContactCard contact={mockContact} onEdit={mockEdit} onDelete={mockDelete} />);

    const phoneLink = screen.getByRole('link', { name: /1234567890/i });
    expect(phoneLink).toHaveAttribute('href', `tel:${mockContact.phone}`);
  });

  it('renders without phone when not provided', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    const contactWithoutPhone = { ...mockContact, phone: undefined };
    render(<ContactCard contact={contactWithoutPhone} onEdit={mockEdit} onDelete={mockDelete} />);

    const phoneLabel = screen.queryByText(/Phone:/);
    expect(phoneLabel).not.toBeInTheDocument();
  });
});
