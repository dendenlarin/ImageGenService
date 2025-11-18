'use client'

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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Generation, GeminiModel, GenerationTask } from '@/lib/types'
import { getPrompts, getPromptById } from '@/lib/storage'
import { generatePromptVariants } from '@/lib/prompt-utils'

const generationSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  promptId: z.string().min(1, 'Выберите промпт'),
  model: z.enum(['imagen-4', 'nano-banana'] as const),
  rateLimit: z.number().min(1).max(100),
})

type GenerationFormValues = z.infer<typeof generationSchema>

interface GenerationFormProps {
  onSave: (generation: Generation) => void
  onCancel: () => void
}

export function GenerationForm({ onSave, onCancel }: GenerationFormProps) {
  const prompts = getPrompts()

  const form = useForm<GenerationFormValues>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      name: '',
      promptId: '',
      model: 'imagen-4',
      rateLimit: 10,
    },
  })

  function onSubmit(data: GenerationFormValues) {
    const prompt = getPromptById(data.promptId)
    if (!prompt) {
      alert('Промпт не найден')
      return
    }

    // Generate all variants for the prompt
    const variants = generatePromptVariants(prompt)

    // Create tasks for each variant
    const tasks: GenerationTask[] = variants.map((variant) => ({
      id: `task-${Date.now()}-${Math.random()}`,
      variantId: variant.id,
      prompt: variant.content,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }))

    const now = new Date().toISOString()

    const newGeneration: Generation = {
      id: `gen-${Date.now()}`,
      name: data.name,
      promptId: data.promptId,
      model: data.model,
      rateLimit: data.rateLimit,
      variants,
      tasks,
      createdAt: now,
      updatedAt: now,
    }

    onSave(newGeneration)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Создать генерацию</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название генерации</FormLabel>
                  <FormControl>
                    <Input placeholder="My generation batch" {...field} />
                  </FormControl>
                  <FormDescription>
                    Краткое название для этой генерации
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="promptId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Промпт</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите промпт" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {prompts.map((prompt) => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Промпт будет использован для генерации изображений
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Модель</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="imagen-4">Gemini Imagen 4</SelectItem>
                      <SelectItem value="nano-banana">
                        Gemini nano-banana
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Модель Gemini для генерации изображений
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rateLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Лимит запросов в час</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Максимальное количество запросов в час (1-100)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
              <Button type="submit">Создать генерацию</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
