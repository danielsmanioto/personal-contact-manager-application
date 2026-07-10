import { render, screen, fireEvent } from '@testing-library/react';
import SortOptions from './SortOptions';
import { describe, it, expect, vi } from 'vitest';

describe('SortOptions', () => {
  it('renders both sort options', () => {
    const mockSort = vi.fn();
    render(<SortOptions sortBy="name" onSort={mockSort} />);

    expect(screen.getByText(/name \(a-z\)/i)).toBeTruthy();
    expect(screen.getByText(/date \(newest\)/i)).toBeTruthy();
  });

  it('calls onSort when sort option clicked', () => {
    const mockSort = vi.fn();
    render(<SortOptions sortBy="name" onSort={mockSort} />);

    const dateButton = screen.getByText(/date \(newest\)/i);
    fireEvent.click(dateButton);

    expect(mockSort).toHaveBeenCalledWith('date');
  });

  it('renders with different sort options', () => {
    const mockSort = vi.fn();
    const { container } = render(<SortOptions sortBy="name" onSort={mockSort} />);

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });
});
