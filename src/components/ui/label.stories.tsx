import type { Meta, StoryObj } from '@storybook/react'
import { Label } from './label'
import { Checkbox } from './checkbox'

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

// Базовый label
export const Default: Story = {
  args: {
    children: 'Email address',
    htmlFor: 'email',
  },
  render: (args) => (
    <div className="grid gap-2">
      <Label {...args} />
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        className="border rounded-md px-3 py-2 text-sm"
      />
    </div>
  ),
}

// Label с required полем
export const Required: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="username">
        Username <span className="text-red-500">*</span>
      </Label>
      <input
        id="username"
        type="text"
        placeholder="Enter username"
        className="border rounded-md px-3 py-2 text-sm"
        required
      />
    </div>
  ),
}

// Label с описанием
export const WithDescription: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <input
        id="password"
        type="password"
        placeholder="Enter password"
        className="border rounded-md px-3 py-2 text-sm"
      />
      <p className="text-muted-foreground text-sm">
        Must be at least 8 characters long
      </p>
    </div>
  ),
}

// Label с checkbox
export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checkbox-label" />
      <Label htmlFor="checkbox-label">I agree to the terms and conditions</Label>
    </div>
  ),
}

// Label с radio button
export const WithRadio: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <input type="radio" id="option1" name="option" className="h-4 w-4" />
        <Label htmlFor="option1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <input type="radio" id="option2" name="option" className="h-4 w-4" />
        <Label htmlFor="option2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <input type="radio" id="option3" name="option" className="h-4 w-4" />
        <Label htmlFor="option3">Option 3</Label>
      </div>
    </div>
  ),
}

// Label для disabled поля
export const Disabled: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="disabled-input" className="peer-disabled:opacity-70">
        Disabled field
      </Label>
      <input
        id="disabled-input"
        type="text"
        disabled
        placeholder="This field is disabled"
        className="border rounded-md px-3 py-2 text-sm opacity-50 cursor-not-allowed"
      />
    </div>
  ),
}

// Форма с несколькими labels
export const FormExample: Story = {
  render: () => (
    <div className="grid gap-4 w-80">
      <div className="grid gap-2">
        <Label htmlFor="form-name">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <input
          id="form-name"
          type="text"
          placeholder="John Doe"
          className="border rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="form-email">
          Email <span className="text-red-500">*</span>
        </Label>
        <input
          id="form-email"
          type="email"
          placeholder="john@example.com"
          className="border rounded-md px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="form-message">Message</Label>
        <textarea
          id="form-message"
          placeholder="Your message here..."
          className="border rounded-md px-3 py-2 text-sm min-h-20"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="form-terms" />
        <Label htmlFor="form-terms">I agree to the terms and conditions</Label>
      </div>
    </div>
  ),
}
