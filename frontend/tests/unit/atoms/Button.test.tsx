import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@components/atoms'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading prop is true', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies correct variant styles', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-error-DEFAULT')
  })
})
