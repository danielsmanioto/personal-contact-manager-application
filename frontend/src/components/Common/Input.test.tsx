import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';
import { describe, it, expect } from 'vitest';

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="Name" placeholder="Enter name" />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<Input label="Email" error="Invalid email" />);

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<Input label="Phone" helperText="10-20 digits" />);

    expect(screen.getByText('10-20 digits')).toBeInTheDocument();
  });

  it('disables input when disabled prop is true', () => {
    render(<Input label="Name" disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('handles onChange event', () => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      expect(e.target.value).toBe('test');
    };
    render(<Input label="Name" onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
  });

  it('renders different input types', () => {
    render(<Input label="Email" type="email" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.type).toBe('email');
  });
});
