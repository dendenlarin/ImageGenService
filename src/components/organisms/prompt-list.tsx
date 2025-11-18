'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Prompt } from '@/lib/types'
import { extractParameterNames } from '@/lib/prompt-utils'
import { cn } from '@/lib/utils'

interface PromptListProps {
  prompts: Prompt[]
  selectedPrompt: Prompt | null
  onSelect: (prompt: Prompt) => void
}

export function PromptList({
  prompts,
  selectedPrompt,
  onSelect,
}: PromptListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Список промптов</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {prompts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Промпты отсутствуют. Создайте первый промпт.
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {prompts.map((prompt) => {
                const parameterNames = extractParameterNames(prompt.content)
                return (
                  <div
                    key={prompt.id}
                    onClick={() => onSelect(prompt)}
                    className={cn(
                      'cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent',
                      selectedPrompt?.id === prompt.id &&
                        'border-primary bg-accent'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{prompt.name}</h3>
                      {parameterNames.length > 0 && (
                        <Badge variant="secondary">
                          {parameterNames.length} параметров
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {prompt.content}
                    </p>
                    {parameterNames.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {parameterNames.map((name) => (
                          <Badge key={name} variant="outline" className="text-xs">
                            {`{{${name}}}`}
                          </Badge>
                        ))}
                      </div>
                    )}
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
