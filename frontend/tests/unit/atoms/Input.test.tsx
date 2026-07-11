import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@components/atoms'

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Input label="Name" error="Name is required" />)
    expect(screen.getByText('Name is required')).toBeInTheDocument()
  })

  it('displays helper text', () => {
    render(<Input label="Username" helperText="Choose a unique username" />)
    expect(screen.getByText('Choose a unique username')).toBeInTheDocument()
  })

  it('handles input changes', async () => {
    const handleChange = vi.fn()
    render(
      <Input value="" onChange={(e) => handleChange(e.target.value)} />
    )
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test value')
    expect(handleChange).toHaveBeenCalledWith('test value')
  })

  it('disables input when disabled prop is true', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
