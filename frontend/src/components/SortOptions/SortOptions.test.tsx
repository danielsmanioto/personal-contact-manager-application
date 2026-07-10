import { render, screen, fireEvent } from '@testing-library/react';
import SortOptions from './SortOptions';
import { describe, it, expect, vi } from 'vitest';

describe('SortOptions', () => {
  it('renders both sort options', () => {
    const mockSort = vi.fn();
    render(<SortOptions sortBy="name" onSort={mockSort} />);

    expect(screen.getByText(/name \(a-z\)/i)).toBeInTheDocument();
    expect(screen.getByText(/date \(newest\)/i)).toBeInTheDocument();
  });

  it('highlights selected sort option', () => {
    const mockSort = vi.fn();
    const { rerender } = render(<SortOptions sortBy="name" onSort={mockSort} />);

    const nameButton = screen.getByText(/name \(a-z\)/i);
    expect(nameButton).toHaveClass('bg-blue-600');

    rerender(<SortOptions sortBy="date" onSort={mockSort} />);
    const dateButton = screen.getByText(/date \(newest\)/i);
    expect(dateButton).toHaveClass('bg-blue-600');
  });

  it('calls onSort when sort option clicked', () => {
    const mockSort = vi.fn();
    render(<SortOptions sortBy="name" onSort={mockSort} />);

    const dateButton = screen.getByText(/date \(newest\)/i);
    fireEvent.click(dateButton);

    expect(mockSort).toHaveBeenCalledWith('date');
  });
});
