import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';
import { describe, it, expect, vi } from 'vitest';

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} />);

    const input = screen.getByPlaceholderText(/search by name or email/i);
    expect(input).toBeInTheDocument();
  });

  it('calls onSearch with debounced value', async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} debounceMs={100} />);

    const input = screen.getByPlaceholderText(/search by name or email/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'john' } });

    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('john');
    }, { timeout: 200 });
  });

  it('clears search on clear button click', async () => {
    const mockSearch = vi.fn();
    render(<SearchBar onSearch={mockSearch} debounceMs={50} />);

    const input = screen.getByPlaceholderText(/search by name or email/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
    });

    const clearButton = screen.getByLabelText(/clear search/i);
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
  });

  it('accepts custom placeholder', () => {
    const mockSearch = vi.fn();
    const customPlaceholder = 'Custom search text';
    render(<SearchBar onSearch={mockSearch} placeholder={customPlaceholder} />);

    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });
});
