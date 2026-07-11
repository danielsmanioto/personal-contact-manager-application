import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Alert } from '@components/molecules'

describe('Alert Component', () => {
  it('renders alert with message', () => {
    render(<Alert>This is an alert</Alert>)
    expect(screen.getByText('This is an alert')).toBeInTheDocument()
  })

  it('displays title when provided', () => {
    render(<Alert title="Warning">Something went wrong</Alert>)
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const handleDismiss = vi.fn()
    render(<Alert dismissible onDismiss={handleDismiss}>Alert</Alert>)
    const dismissButton = screen.getByLabelText('Dismiss alert')
    await userEvent.click(dismissButton)
    expect(handleDismiss).toHaveBeenCalled()
  })

  it('applies correct variant styles', () => {
    render(<Alert variant="error">Error message</Alert>)
    const alert = screen.getByText('Error message').closest('div')
    expect(alert).toHaveClass('bg-red-50')
  })
})
