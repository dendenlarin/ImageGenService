'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Prompt, PromptVariant } from '@/lib/types'
import { generatePromptVariants, extractParameterNames } from '@/lib/prompt-utils'
import { Edit, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptDetailProps {
  prompt: Prompt
  onEdit: () => void
  onDelete: (id: string) => void
}

export function PromptDetail({ prompt, onEdit, onDelete }: PromptDetailProps) {
  const [variants, setVariants] = useState<PromptVariant[]>([])
  const [excludedVariants, setExcludedVariants] = useState<Set<string>>(
    new Set()
  )

  // Generate variants when prompt changes
  useEffect(() => {
    const generatedVariants = generatePromptVariants(prompt)
    setVariants(generatedVariants)
    setExcludedVariants(new Set())
  }, [prompt])

  const handleDelete = () => {
    if (
      confirm(
        `Вы уверены, что хотите удалить промпт "${prompt.name}"? Это действие нельзя отменить.`
      )
    ) {
      onDelete(prompt.id)
    }
  }

  const handleToggleVariant = (variantId: string) => {
    setExcludedVariants((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(variantId)) {
        newSet.delete(variantId)
      } else {
        newSet.add(variantId)
      }
      return newSet
    })
  }

  const parameterNames = extractParameterNames(prompt.content)
  const activeVariants = variants.filter((v) => !excludedVariants.has(v.id))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{prompt.name}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Информация
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Параметров:</span>
              <span className="font-medium">{parameterNames.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Всего вариантов:</span>
              <span className="font-medium">{variants.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Активных вариантов:</span>
              <span className="font-medium">{activeVariants.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Создан:</span>
              <span className="font-medium">
                {new Date(prompt.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Оригинальный промпт
          </h3>
          <div className="rounded-md border p-3 text-sm bg-muted/50">
            {prompt.content}
          </div>
        </div>

        {parameterNames.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Используемые параметры
            </h3>
            <div className="flex flex-wrap gap-2">
              {parameterNames.map((name) => (
                <Badge key={name} variant="secondary">
                  {`{{${name}}}`}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Все варианты промпта ({activeVariants.length} из {variants.length})
            </h3>
            {excludedVariants.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExcludedVariants(new Set())}
              >
                Восстановить все
              </Button>
            )}
          </div>
          <ScrollArea className="h-[400px] rounded-md border">
            <div className="p-4 space-y-2">
              {variants.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Нет вариантов для отображения
                </div>
              ) : (
                variants.map((variant, index) => {
                  const isExcluded = excludedVariants.has(variant.id)
                  return (
                    <div
                      key={variant.id}
                      className={cn(
                        'rounded-md border p-3 transition-colors',
                        isExcluded && 'opacity-50 bg-muted'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            {isExcluded && (
                              <Badge variant="destructive" className="text-xs">
                                Исключен
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{variant.content}</p>
                          {Object.keys(variant.parameters).length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(variant.parameters).map(
                                ([key, value]) => (
                                  <Badge
                                    key={key}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {key}: {value}
                                  </Badge>
                                )
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleVariant(variant.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
