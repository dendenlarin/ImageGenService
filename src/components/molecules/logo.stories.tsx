import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from './logo'

const meta = {
  title: 'Molecules/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'Logo',
  },
}

export const CustomText: Story = {
  args: {
    text: 'MyService',
  },
}

export const LongText: Story = {
  args: {
    text: 'ComponentsFactory',
  },
}
