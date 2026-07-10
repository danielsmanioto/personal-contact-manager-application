import { render, screen, fireEvent } from '@testing-library/react';
import ToastContainer from './Toast';
import { describe, it, expect, vi } from 'vitest';
import type { ToastMessage } from '../../types';

describe('ToastContainer', () => {
  it('renders toasts', () => {
    const toasts: ToastMessage[] = [
      { id: '1', type: 'success', message: 'Success!' },
      { id: '2', type: 'error', message: 'Error!' },
    ];
    const mockClose = vi.fn();

    render(<ToastContainer toasts={toasts} onClose={mockClose} />);

    expect(screen.getByText('Success!')).toBeTruthy();
    expect(screen.getByText('Error!')).toBeTruthy();
  });

  it('renders empty when no toasts', () => {
    const mockClose = vi.fn();
    const { container } = render(<ToastContainer toasts={[]} onClose={mockClose} />);

    expect(container.firstChild?.childNodes.length).toBe(0);
  });

  it('calls onClose when toast closed', () => {
    const toasts: ToastMessage[] = [{ id: '1', type: 'success', message: 'Success!' }];
    const mockClose = vi.fn();

    render(<ToastContainer toasts={toasts} onClose={mockClose} />);

    const closeButtons = screen.getAllByRole('button');
    fireEvent.click(closeButtons[0]);

    expect(mockClose).toHaveBeenCalledWith('1');
  });

  it('renders multiple toasts stacked', () => {
    const toasts: ToastMessage[] = [
      { id: '1', type: 'success', message: 'Success 1!' },
      { id: '2', type: 'info', message: 'Info!' },
      { id: '3', type: 'error', message: 'Error!' },
    ];
    const mockClose = vi.fn();

    const { container } = render(<ToastContainer toasts={toasts} onClose={mockClose} />);

    const toastElements = container.querySelectorAll('[role="alert"]');
    expect(toastElements.length).toBe(3);
  });
});
