import type { Meta, StoryObj } from '@storybook/react'
import { Sidebar } from './sidebar'
import { Home, Users, Settings, BarChart, FileText, Mail } from 'lucide-react'
import { Logo } from '@/components/molecules/logo'

const meta = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-screen flex">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    sections: [
      {
        title: 'Main',
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: Home },
          { href: '/analytics', label: 'Analytics', icon: BarChart },
        ],
      },
      {
        title: 'Management',
        items: [
          { href: '/users', label: 'Users', icon: Users },
          { href: '/reports', label: 'Reports', icon: FileText },
        ],
      },
      {
        title: 'Settings',
        items: [{ href: '/settings', label: 'Settings', icon: Settings }],
      },
    ],
  },
}

export const WithHeader: Story = {
  args: {
    sections: [
      {
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: Home },
          { href: '/analytics', label: 'Analytics', icon: BarChart },
          { href: '/users', label: 'Users', icon: Users },
        ],
      },
    ],
    header: <Logo text="MyService" />,
  },
}

export const WithFooter: Story = {
  args: {
    sections: [
      {
        items: [
          { href: '/dashboard', label: 'Dashboard', icon: Home },
          { href: '/analytics', label: 'Analytics', icon: BarChart },
        ],
      },
    ],
    footer: (
      <div className="text-xs text-muted-foreground">
        <p>© 2024 MyService</p>
        <p>Version 1.0.0</p>
      </div>
    ),
  },
}
