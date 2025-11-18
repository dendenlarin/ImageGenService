'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getSettings, saveSettings } from '@/lib/storage'
import { Settings } from '@/lib/types'

const settingsSchema = z.object({
  openaiApiKey: z.string().optional(),
  geminiApiKey: z.string().optional(),
  qstashToken: z.string().optional(),
  qstashUrl: z.string().optional(),
  systemPrompts: z.object({
    parameters: z.string().min(1, 'Системный промпт для параметров обязателен'),
    prompts: z.string().min(1, 'Системный промпт для промптов обязателен'),
    generations: z.string().min(1, 'Системный промпт для генераций обязателен'),
  }),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      openaiApiKey: '',
      geminiApiKey: '',
      systemPrompts: {
        parameters:
          'You are an AI assistant that generates parameter values. Given a parameter name, generate a comma-separated list of relevant values.',
        prompts:
          'You are an AI assistant that generates image generation prompts. Given a topic or theme, create a detailed, descriptive prompt suitable for AI image generation.',
        generations:
          'You are an AI assistant helping with image generation workflows.',
      },
    },
  })

  // Load settings on mount
  useEffect(() => {
    const settings = getSettings()
    form.reset(settings)
  }, [form])

  function onSubmit(data: SettingsFormValues) {
    saveSettings(data as Settings)
    alert('Настройки сохранены!')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* API Keys Section */}
        <Card>
          <CardHeader>
            <CardTitle>API Ключи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="openaiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OpenAI API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Используется для генерации параметров и промптов
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="geminiApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gemini API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="AI..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Используется для генерации изображений
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="qstashToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QStash Token (Опционально)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="eyJ..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Используется для управления очередями генерации (опционально)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* System Prompts Section */}
        <Card>
          <CardHeader>
            <CardTitle>Системные промпты</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="parameters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="parameters">Параметры</TabsTrigger>
                <TabsTrigger value="prompts">Промпты</TabsTrigger>
                <TabsTrigger value="generations">Генерации</TabsTrigger>
              </TabsList>

              <TabsContent value="parameters" className="space-y-4">
                <FormField
                  control={form.control}
                  name="systemPrompts.parameters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Системный промпт для генерации параметров</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Введите системный промпт..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Этот промпт будет использоваться при генерации значений параметров через OpenAI
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="prompts" className="space-y-4">
                <FormField
                  control={form.control}
                  name="systemPrompts.prompts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Системный промпт для генерации промптов</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Введите системный промпт..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Этот промпт будет использоваться при генерации промптов через OpenAI
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="generations" className="space-y-4">
                <FormField
                  control={form.control}
                  name="systemPrompts.generations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Системный промпт для генераций</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Введите системный промпт..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Этот промпт будет использоваться в процессе генерации изображений
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Сохранить настройки
          </Button>
        </div>
      </form>
    </Form>
  )
}
