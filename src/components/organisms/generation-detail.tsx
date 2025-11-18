'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Generation, GenerationTask } from '@/lib/types'
import { getPromptById } from '@/lib/storage'
import { generateImageWithGemini } from '@/lib/ai-api'
import { Trash2, Play, Pause, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GenerationDetailProps {
  generation: Generation
  onDelete: (id: string) => void
  onUpdate: (generation: Generation) => void
}

export function GenerationDetail({
  generation,
  onDelete,
  onUpdate,
}: GenerationDetailProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null)

  const prompt = getPromptById(generation.promptId)

  const completedTasks = generation.tasks.filter(
    (t) => t.status === 'completed'
  ).length
  const failedTasks = generation.tasks.filter(
    (t) => t.status === 'failed'
  ).length
  const pendingTasks = generation.tasks.filter(
    (t) => t.status === 'pending'
  ).length
  const processingTasks = generation.tasks.filter(
    (t) => t.status === 'processing'
  ).length

  const completedImages = generation.tasks
    .filter((t) => t.status === 'completed' && t.imageUrl)
    .map((t) => ({
      id: t.id,
      url: t.imageUrl!,
      prompt: t.prompt,
    }))

  const handleDelete = () => {
    if (
      confirm(
        `Вы уверены, что хотите удалить генерацию "${generation.name}"? Это действие нельзя отменить.`
      )
    ) {
      onDelete(generation.id)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = generation.tasks.filter((t) => t.id !== taskId)
    const updatedGeneration = {
      ...generation,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    }
    onUpdate(updatedGeneration)
  }

  const handleClearCompleted = () => {
    const updatedTasks = generation.tasks.filter(
      (t) => t.status !== 'completed'
    )
    const updatedGeneration = {
      ...generation,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    }
    onUpdate(updatedGeneration)
  }

  const handleClearFailed = () => {
    const updatedTasks = generation.tasks.filter((t) => t.status !== 'failed')
    const updatedGeneration = {
      ...generation,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    }
    onUpdate(updatedGeneration)
  }

  const handleClearAll = () => {
    if (
      confirm(
        'Вы уверены, что хотите очистить всю очередь? Это действие нельзя отменить.'
      )
    ) {
      const updatedGeneration = {
        ...generation,
        tasks: [],
        updatedAt: new Date().toISOString(),
      }
      onUpdate(updatedGeneration)
    }
  }

  const processNextTask = async () => {
    const pendingTaskIndex = generation.tasks.findIndex(
      (t) => t.status === 'pending'
    )

    if (pendingTaskIndex === -1) {
      setIsProcessing(false)
      setCurrentTaskIndex(null)
      return
    }

    setCurrentTaskIndex(pendingTaskIndex)
    const task = generation.tasks[pendingTaskIndex]

    // Update task status to processing
    const updatedTasks = [...generation.tasks]
    updatedTasks[pendingTaskIndex] = {
      ...task,
      status: 'processing',
    }
    onUpdate({
      ...generation,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    })

    try {
      // Generate image
      const imageUrl = await generateImageWithGemini(task.prompt, generation.model)

      // Update task with completed status
      updatedTasks[pendingTaskIndex] = {
        ...task,
        status: 'completed',
        imageUrl,
        completedAt: new Date().toISOString(),
      }
    } catch (error) {
      // Update task with failed status
      updatedTasks[pendingTaskIndex] = {
        ...task,
        status: 'failed',
        error: (error as Error).message,
        completedAt: new Date().toISOString(),
      }
    }

    onUpdate({
      ...generation,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    })

    // Wait for rate limit (convert requests per hour to milliseconds)
    const delayMs = (60 * 60 * 1000) / generation.rateLimit
    await new Promise((resolve) => setTimeout(resolve, delayMs))

    // Process next task if still processing
    if (isProcessing) {
      await processNextTask()
    }
  }

  const handleStartProcessing = async () => {
    setIsProcessing(true)
    await processNextTask()
  }

  const handleStopProcessing = () => {
    setIsProcessing(false)
    setCurrentTaskIndex(null)
  }

  const getTaskStatusBadge = (status: GenerationTask['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Ожидает</Badge>
      case 'processing':
        return <Badge variant="warning">Обработка...</Badge>
      case 'completed':
        return <Badge variant="success">Завершено</Badge>
      case 'failed':
        return <Badge variant="destructive">Ошибка</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{generation.name}</CardTitle>
          <div className="flex gap-2">
            {!isProcessing && pendingTasks > 0 && (
              <Button variant="default" size="sm" onClick={handleStartProcessing}>
                <Play className="mr-2 h-4 w-4" />
                Запустить
              </Button>
            )}
            {isProcessing && (
              <Button variant="outline" size="sm" onClick={handleStopProcessing}>
                <Pause className="mr-2 h-4 w-4" />
                Остановить
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Generation Info */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Информация
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Промпт:</span>
                <span className="font-medium">{prompt?.name || 'Не найден'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Модель:</span>
                <span className="font-medium">{generation.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Лимит:</span>
                <span className="font-medium">{generation.rateLimit} зап/час</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Завершено:</span>
                <span className="font-medium text-green-600">{completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ошибки:</span>
                <span className="font-medium text-red-600">{failedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ожидает:</span>
                <span className="font-medium">{pendingTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Queue and Gallery */}
        <Tabs defaultValue="queue" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="queue">
              Очередь ({generation.tasks.length})
            </TabsTrigger>
            <TabsTrigger value="gallery">
              Галерея ({completedImages.length})
            </TabsTrigger>
          </TabsList>

          {/* Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <div className="flex gap-2">
              {completedTasks > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearCompleted}>
                  Очистить завершенные
                </Button>
              )}
              {failedTasks > 0 && (
                <Button variant="outline" size="sm" onClick={handleClearFailed}>
                  Очистить ошибки
                </Button>
              )}
              {generation.tasks.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Очистить все
                </Button>
              )}
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              {generation.tasks.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Очередь пуста
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {generation.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={cn(
                        'rounded-md border p-3',
                        currentTaskIndex === index && 'border-primary bg-accent'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            {getTaskStatusBadge(task.status)}
                            {task.status === 'processing' && (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            )}
                          </div>
                          <p className="text-sm line-clamp-2">{task.prompt}</p>
                          {task.error && (
                            <p className="text-xs text-destructive">{task.error}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={task.status === 'processing'}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            {completedImages.length === 0 ? (
              <div className="flex h-[400px] items-center justify-center rounded-md border">
                <div className="text-center text-sm text-muted-foreground">
                  Пока нет сгенерированных изображений
                </div>
              </div>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {completedImages.map((image) => (
                    <CarouselItem key={image.id}>
                      <div className="space-y-4">
                        <div className="aspect-square overflow-hidden rounded-lg border">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="rounded-md border p-3 text-sm">
                          <p className="text-muted-foreground">Промпт:</p>
                          <p className="mt-1">{image.prompt}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
