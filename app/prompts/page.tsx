'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/templates/main-layout'
import { Settings, FileText, Layers, Images, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PromptList } from '@/components/organisms/prompt-list'
import { PromptForm } from '@/components/organisms/prompt-form'
import { PromptDetail } from '@/components/organisms/prompt-detail'
import { Prompt } from '@/lib/types'
import { getPrompts, savePrompts } from '@/lib/storage'

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Load prompts on mount
  useEffect(() => {
    setPrompts(getPrompts())
  }, [])

  const handleSavePrompt = (prompt: Prompt) => {
    const existingIndex = prompts.findIndex((p) => p.id === prompt.id)
    let updatedPrompts: Prompt[]

    if (existingIndex >= 0) {
      updatedPrompts = [...prompts]
      updatedPrompts[existingIndex] = prompt
    } else {
      updatedPrompts = [...prompts, prompt]
    }

    setPrompts(updatedPrompts)
    savePrompts(updatedPrompts)
    setIsCreating(false)
    setIsEditing(false)
    setSelectedPrompt(prompt)
  }

  const handleDeletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter((p) => p.id !== id)
    setPrompts(updatedPrompts)
    savePrompts(updatedPrompts)
    setSelectedPrompt(null)
  }

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setIsCreating(false)
    setIsEditing(false)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setIsEditing(false)
    setSelectedPrompt(null)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setIsCreating(false)
  }

  const handleCancelEdit = () => {
    setIsCreating(false)
    setIsEditing(false)
  }

  return (
    <MainLayout
      header={{
        logoText: 'ImageGen',
        navItems: [
          { href: '/settings', label: 'Настройки', icon: Settings },
          { href: '/parameters', label: 'Параметры', icon: Layers },
          { href: '/prompts', label: 'Промпты', icon: FileText },
          { href: '/generations', label: 'Генерации', icon: Images },
        ],
      }}
      sidebar={{
        sections: [
          {
            title: 'Навигация',
            items: [
              {
                href: '/settings',
                label: 'Настройки',
                icon: Settings,
              },
              {
                href: '/parameters',
                label: 'Параметры',
                icon: Layers,
              },
              {
                href: '/prompts',
                label: 'Промпты',
                icon: FileText,
              },
              {
                href: '/generations',
                label: 'Генерации',
                icon: Images,
              },
            ],
          },
        ],
      }}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Промпты</h1>
            <p className="text-muted-foreground">
              Создавайте промпты с параметрами для генерации изображений
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Создать промпт
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left side - List */}
          <PromptList
            prompts={prompts}
            selectedPrompt={selectedPrompt}
            onSelect={handleSelectPrompt}
          />

          {/* Right side - Form or Detail */}
          <div>
            {isCreating || isEditing ? (
              <PromptForm
                prompt={isEditing ? selectedPrompt : undefined}
                onSave={handleSavePrompt}
                onCancel={handleCancelEdit}
              />
            ) : selectedPrompt ? (
              <PromptDetail
                prompt={selectedPrompt}
                onEdit={handleEdit}
                onDelete={handleDeletePrompt}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Выберите промпт</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Выберите промпт из списка или создайте новый
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
