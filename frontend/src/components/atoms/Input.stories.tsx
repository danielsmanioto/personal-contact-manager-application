import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text...', label: 'Text Input' },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'email@example.com', label: 'Email Address' },
}

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    error: 'Password must be at least 8 characters',
    value: 'short',
  },
}

export const WithHelper: Story = {
  args: {
    label: 'Username',
    helperText: 'Choose a unique username',
  },
}

export const Disabled: Story = {
  args: { label: 'Disabled Input', placeholder: 'Cannot edit', disabled: true },
}
