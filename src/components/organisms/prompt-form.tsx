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
import { Badge } from '@/components/ui/badge'
import { Prompt } from '@/lib/types'
import { validatePromptParameters } from '@/lib/prompt-utils'
import { generatePromptContent } from '@/lib/ai-api'
import { getSettings, getParameters } from '@/lib/storage'
import { Sparkles, Loader2 } from 'lucide-react'

const promptSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  content: z.string().min(1, 'Содержимое промпта обязательно'),
})

type PromptFormValues = z.infer<typeof promptSchema>

interface PromptFormProps {
  prompt?: Prompt | null
  onSave: (prompt: Prompt) => void
  onCancel: () => void
}

export function PromptForm({ prompt, onSave, onCancel }: PromptFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [validation, setValidation] = useState<{
    valid: string[]
    invalid: string[]
  }>({ valid: [], invalid: [] })

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      name: prompt?.name || '',
      content: prompt?.content || '',
    },
  })

  const contentValue = form.watch('content')
  const nameValue = form.watch('name')
  const canGenerate = nameValue.trim().length > 0

  // Validate parameters when content changes
  useState(() => {
    if (contentValue) {
      setValidation(validatePromptParameters(contentValue))
    }
  })

  // Update validation when content changes
  const handleContentChange = (value: string) => {
    form.setValue('content', value)
    setValidation(validatePromptParameters(value))
  }

  async function handleGeneratePrompt() {
    const settings = getSettings()

    if (!settings.openaiApiKey) {
      alert('Пожалуйста, укажите OpenAI API ключ в настройках')
      return
    }

    setIsGenerating(true)

    try {
      const generatedContent = await generatePromptContent(
        nameValue,
        settings.systemPrompts.prompts
      )
      handleContentChange(generatedContent)
    } catch (error) {
      console.error('Error generating prompt:', error)
      alert('Ошибка при генерации промпта: ' + (error as Error).message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleInsertParameter = (parameterName: string) => {
    const currentContent = form.getValues('content')
    const newContent = currentContent + ` {{${parameterName}}}`
    handleContentChange(newContent)
  }

  function onSubmit(data: PromptFormValues) {
    const now = new Date().toISOString()

    const updatedPrompt: Prompt = {
      id: prompt?.id || `prompt-${Date.now()}`,
      name: data.name,
      content: data.content,
      createdAt: prompt?.createdAt || now,
      updatedAt: now,
    }

    onSave(updatedPrompt)
  }

  const availableParameters = getParameters()

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {prompt ? 'Редактировать промпт' : 'Создать промпт'}
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
                  <FormLabel>Название промпта</FormLabel>
                  <FormControl>
                    <Input placeholder="Futuristic cityscape" {...field} />
                  </FormControl>
                  <FormDescription>
                    Краткое описание темы промпта
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Промпт</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canGenerate || isGenerating}
                      onClick={handleGeneratePrompt}
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
                      placeholder="A futuristic cityscape with {{style}} buildings and {{mood}} atmosphere"
                      className="min-h-[150px]"
                      {...field}
                      onChange={(e) => handleContentChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    Используйте формат {`{{parameter_name}}`} для вставки параметров
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parameter validation badges */}
            {(validation.valid.length > 0 || validation.invalid.length > 0) && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Используемые параметры:</div>
                <div className="flex flex-wrap gap-2">
                  {validation.valid.map((name) => (
                    <Badge key={name} variant="success">
                      {`{{${name}}}`}
                    </Badge>
                  ))}
                  {validation.invalid.map((name) => (
                    <Badge key={name} variant="destructive">
                      {`{{${name}}}`} - не найден
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Available parameters */}
            {availableParameters.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Доступные параметры:</div>
                <div className="flex flex-wrap gap-2">
                  {availableParameters.map((param) => (
                    <Button
                      key={param.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleInsertParameter(param.name)}
                    >
                      {`{{${param.name}}}`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
              <Button type="submit">{prompt ? 'Сохранить' : 'Создать'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
