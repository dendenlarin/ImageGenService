import type { Meta, StoryObj } from '@storybook/react'
import { Header } from './header'
import { Home, Users, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    logoText: 'MyService',
    navItems: [
      { href: '/', label: 'Home', icon: Home },
      { href: '/users', label: 'Users', icon: Users },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
}

export const WithRightContent: Story = {
  args: {
    logoText: 'MyService',
    navItems: [
      { href: '/', label: 'Home', icon: Home },
      { href: '/users', label: 'Users', icon: Users },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
    rightContent: (
      <>
        <Button variant="outline" size="sm">
          Sign In
        </Button>
        <Button size="sm">Sign Up</Button>
      </>
    ),
  },
}

export const MinimalNav: Story = {
  args: {
    logoText: 'Logo',
    navItems: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
    ],
  },
}
