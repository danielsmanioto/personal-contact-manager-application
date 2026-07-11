import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'Primary', variant: 'primary' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-12 flex-wrap">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-12">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
    </div>
  ),
}
