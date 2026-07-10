import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
import { describe, it, expect, vi } from 'vitest';

describe('Pagination', () => {
  it('renders pagination controls', () => {
    const mockPageChange = vi.fn();
    render(
      <Pagination
        currentPage={0}
        totalPages={3}
        totalItems={30}
        pageSize={10}
        onPageChange={mockPageChange}
      />
    );

    expect(screen.getByText(/showing 1 to 10 of 30/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    const mockPageChange = vi.fn();
    render(
      <Pagination
        currentPage={0}
        totalPages={3}
        totalItems={30}
        pageSize={10}
        onPageChange={mockPageChange}
      />
    );

    const prevButton = screen.getByLabelText(/previous page/i);
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    const mockPageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        totalItems={30}
        pageSize={10}
        onPageChange={mockPageChange}
      />
    );

    const nextButton = screen.getByLabelText(/next page/i);
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange with next page number', () => {
    const mockPageChange = vi.fn();
    render(
      <Pagination
        currentPage={0}
        totalPages={3}
        totalItems={30}
        pageSize={10}
        onPageChange={mockPageChange}
      />
    );

    const nextButton = screen.getByLabelText(/next page/i);
    fireEvent.click(nextButton);

    expect(mockPageChange).toHaveBeenCalledWith(1);
  });

  it('shows correct item range', () => {
    const mockPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        totalItems={30}
        pageSize={10}
        onPageChange={mockPageChange}
      />
    );

    expect(screen.getByText(/showing 11 to 20 of 30/i)).toBeInTheDocument();
  });

  it('hides pagination for single page', () => {
    const mockPageChange = vi.fn();
    render(
      <Pagination
        currentPage={0}
        totalPages={1}
        totalItems={5}
        pageSize={10}
        onPageChange={mockPageChange}
      />
    );

    expect(screen.queryByLabelText(/next page/i)).not.toBeInTheDocument();
  });
});
