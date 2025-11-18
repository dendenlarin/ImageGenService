import type { Meta, StoryObj } from '@storybook/react'
import { ContactForm } from './contact-form'

const meta = {
  title: 'Forms/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContactForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Contact:', data)
      alert(`Message from ${data.name}`)
    },
  },
}

export const WithoutCard: Story = {
  args: {
    showCard: false,
    onSubmit: (data) => {
      console.log('Contact:', data)
    },
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    onSubmit: (data) => {
      console.log('Contact:', data)
    },
  },
}

export const CustomText: Story = {
  args: {
    title: 'Get in Touch',
    description: 'We would love to hear from you',
    submitText: 'Send Message',
    onSubmit: (data) => {
      console.log('Contact:', data)
    },
  },
}
