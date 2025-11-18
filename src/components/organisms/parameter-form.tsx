'use client'

import { useState } from 'react'
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
import { Parameter } from '@/lib/types'
import { parseParameterValues, formatParameterValues } from '@/lib/prompt-utils'
import { generateParameterValues } from '@/lib/ai-api'
import { getSettings } from '@/lib/storage'
import { Sparkles, Loader2 } from 'lucide-react'

const parameterSchema = z.object({
  name: z
    .string()
    .min(1, 'Название обязательно')
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Используйте только английские буквы, цифры и подчеркивание'),
  values: z.string().min(1, 'Укажите хотя бы одно значение'),
})

type ParameterFormValues = z.infer<typeof parameterSchema>

interface ParameterFormProps {
  parameter?: Parameter | null
  onSave: (parameter: Parameter) => void
  onCancel: () => void
}

export function ParameterForm({
  parameter,
  onSave,
  onCancel,
}: ParameterFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<ParameterFormValues>({
    resolver: zodResolver(parameterSchema),
    defaultValues: {
      name: parameter?.name || '',
      values: parameter ? formatParameterValues(parameter.values) : '',
    },
  })

  const nameValue = form.watch('name')
  const canGenerate = nameValue.trim().length > 0

  async function handleGenerateValues() {
    const settings = getSettings()

    if (!settings.openaiApiKey) {
      alert('Пожалуйста, укажите OpenAI API ключ в настройках')
      return
    }

    setIsGenerating(true)

    try {
      const generatedValues = await generateParameterValues(
        nameValue,
        settings.systemPrompts.parameters
      )
      form.setValue('values', generatedValues)
    } catch (error) {
      console.error('Error generating values:', error)
      alert('Ошибка при генерации значений: ' + (error as Error).message)
    } finally {
      setIsGenerating(false)
    }
  }

  function onSubmit(data: ParameterFormValues) {
    const values = parseParameterValues(data.values)
    const now = new Date().toISOString()

    const updatedParameter: Parameter = {
      id: parameter?.id || `param-${Date.now()}`,
      name: data.name,
      values,
      createdAt: parameter?.createdAt || now,
      updatedAt: now,
    }

    onSave(updatedParameter)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {parameter ? 'Редактировать параметр' : 'Создать параметр'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название параметра</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="style"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Используйте английские буквы. Например: style, color, mood
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="values"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Значения</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canGenerate || isGenerating}
                      onClick={handleGenerateValues}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Генерация...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Сгенерировать с AI
                        </>
                      )}
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="realistic, anime, watercolor, oil painting, digital art"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Перечислите значения через запятую
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
              <Button type="submit">
                {parameter ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
