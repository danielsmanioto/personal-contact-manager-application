import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Design System/Overview',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => (
    <div className="p-32 bg-neutral-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-24">Design System</h1>

        <section className="mb-32">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-16">Colors</h2>
          <div className="grid grid-cols-4 gap-16">
            {['primary', 'accent', 'success', 'warning', 'error', 'info'].map((color) => (
              <div key={color}>
                <div className={`w-full h-24 rounded-md bg-${color}-500 mb-8`} />
                <p className="text-sm font-medium text-neutral-900">{color}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-16">Typography</h2>
          <h1 className="text-4xl font-bold mb-8">Heading 1 (28px, Bold)</h1>
          <h2 className="text-3xl font-semibold mb-8">Heading 2 (24px, Semibold)</h2>
          <h3 className="text-2xl font-semibold mb-8">Heading 3 (20px, Semibold)</h3>
          <p className="text-base text-neutral-700 mb-8">Body text (14px, Normal)</p>
          <p className="text-sm text-neutral-600">Small text (12px)</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-16">Spacing Scale</h2>
          <p className="text-neutral-600">
            Spacing follows a consistent 2px base scale: 2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96px
          </p>
        </section>
      </div>
    </div>
  ),
}
