import type { Meta, StoryObj } from '@storybook/react'
import { NavItem } from './nav-item'
import { Home, Settings, Users } from 'lucide-react'

const meta = {
  title: 'Molecules/NavItem',
  component: NavItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64 p-4 bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: '/',
    label: 'Home',
  },
}

export const WithIcon: Story = {
  args: {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
}

export const Active: Story = {
  args: {
    href: '/users',
    label: 'Users',
    icon: Users,
    active: true,
  },
}

export const Multiple: Story = {
  render: () => (
    <div className="space-y-1">
      <NavItem href="/" label="Home" icon={Home} active />
      <NavItem href="/users" label="Users" icon={Users} />
      <NavItem href="/settings" label="Settings" icon={Settings} />
    </div>
  ),
}
