'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Generation } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getPromptById } from '@/lib/storage'

interface GenerationListProps {
  generations: Generation[]
  selectedGeneration: Generation | null
  onSelect: (generation: Generation) => void
}

export function GenerationList({
  generations,
  selectedGeneration,
  onSelect,
}: GenerationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Список генераций</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {generations.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Генерации отсутствуют. Создайте первую генерацию.
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {generations.map((generation) => {
                const prompt = getPromptById(generation.promptId)
                const completedTasks = generation.tasks.filter(
                  (t) => t.status === 'completed'
                ).length
                const totalTasks = generation.tasks.length

                return (
                  <div
                    key={generation.id}
                    onClick={() => onSelect(generation)}
                    className={cn(
                      'cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent',
                      selectedGeneration?.id === generation.id &&
                        'border-primary bg-accent'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{generation.name}</h3>
                      <Badge
                        variant={
                          completedTasks === totalTasks
                            ? 'success'
                            : 'secondary'
                        }
                      >
                        {completedTasks}/{totalTasks}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Промпт: {prompt?.name || 'Не найден'}</p>
                      <p>Модель: {generation.model}</p>
                      <p>Лимит: {generation.rateLimit} запросов/час</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
