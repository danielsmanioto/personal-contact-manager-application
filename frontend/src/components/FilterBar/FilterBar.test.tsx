import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from './FilterBar';
import { describe, it, expect, vi } from 'vitest';

describe('FilterBar', () => {
  it('renders filter button', () => {
    const mockFilter = vi.fn();
    const mockClear = vi.fn();
    render(<FilterBar onFilter={mockFilter} onClearFilters={mockClear} />);

    const button = screen.getByText(/filter by date/i);
    expect(button).toBeInTheDocument();
  });

  it('opens filter panel on button click', () => {
    const mockFilter = vi.fn();
    const mockClear = vi.fn();
    render(<FilterBar onFilter={mockFilter} onClearFilters={mockClear} />);

    const button = screen.getByText(/filter by date/i);
    fireEvent.click(button);

    const title = screen.getByText(/birth date range/i);
    expect(title).toBeInTheDocument();
  });

  it('renders apply and clear buttons in filter panel', () => {
    const mockFilter = vi.fn();
    const mockClear = vi.fn();
    render(<FilterBar onFilter={mockFilter} onClearFilters={mockClear} />);

    const button = screen.getByText(/filter by date/i);
    fireEvent.click(button);

    expect(screen.getByText(/^apply$/i)).toBeInTheDocument();
    expect(screen.getByText(/^clear$/i)).toBeInTheDocument();
  });
});
