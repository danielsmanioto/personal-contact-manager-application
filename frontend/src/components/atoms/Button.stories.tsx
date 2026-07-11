import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'Primary Button', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Secondary Button', variant: 'secondary' },
}

export const Tertiary: Story = {
  args: { children: 'Tertiary Button', variant: 'tertiary' },
}

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger' },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-16">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex gap-16 flex-col">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  ),
}
