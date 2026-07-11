import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta = {
  title: 'Atoms/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Card Title',
    children: 'This is a card with default elevation and padding.',
  },
}

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    elevation: 'lg',
    children: 'This card has larger shadow elevation.',
  },
}

export const Interactive: Story = {
  args: {
    title: 'Click Me',
    interactive: true,
    children: 'This card responds to hover interactions.',
  },
}

export const Compact: Story = {
  args: {
    title: 'Compact Card',
    padding: 'sm',
    children: 'This card has minimal padding.',
  },
}
