'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно быть не менее 2 символов' }),
  email: z.string().email({ message: 'Некорректный email' }),
  subject: z.string().min(3, { message: 'Тема должна быть не менее 3 символов' }),
  message: z.string().min(10, { message: 'Сообщение должно быть не менее 10 символов' }),
})

export type ContactFormData = z.infer<typeof contactSchema>

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void | Promise<void>
  className?: string
  showCard?: boolean
  title?: string
  description?: string
  submitText?: string
  isLoading?: boolean
}

export function ContactForm({
  onSubmit,
  className,
  showCard = true,
  title = 'Свяжитесь с нами',
  description = 'Заполните форму и мы свяжемся с вами',
  submitText = 'Отправить',
  isLoading = false,
}: ContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  const handleSubmit = async (data: ContactFormData) => {
    if (onSubmit) {
      await onSubmit(data)
    }
  }

  const FormContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="example@mail.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тема</FormLabel>
              <FormControl>
                <Input placeholder="Вопрос по услугам" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Сообщение</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ваше сообщение..."
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Минимум 10 символов
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Отправка...' : submitText}
        </Button>
      </form>
    </Form>
  )

  if (!showCard) {
    return <div className={className}>{FormContent}</div>
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{FormContent}</CardContent>
    </Card>
  )
}
