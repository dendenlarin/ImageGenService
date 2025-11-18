'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/templates/main-layout'
import { Settings, FileText, Layers, Images, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GenerationList } from '@/components/organisms/generation-list'
import { GenerationForm } from '@/components/organisms/generation-form'
import { GenerationDetail } from '@/components/organisms/generation-detail'
import { ImageGallery } from '@/components/organisms/image-gallery'
import { Generation } from '@/lib/types'
import { getGenerations, saveGenerations } from '@/lib/storage'

export default function GenerationsPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Load generations on mount
  useEffect(() => {
    setGenerations(getGenerations())
  }, [])

  const handleSaveGeneration = (generation: Generation) => {
    const existingIndex = generations.findIndex((g) => g.id === generation.id)
    let updatedGenerations: Generation[]

    if (existingIndex >= 0) {
      updatedGenerations = [...generations]
      updatedGenerations[existingIndex] = generation
    } else {
      updatedGenerations = [...generations, generation]
    }

    setGenerations(updatedGenerations)
    saveGenerations(updatedGenerations)
    setIsCreating(false)
    setSelectedGeneration(generation)
  }

  const handleDeleteGeneration = (id: string) => {
    const updatedGenerations = generations.filter((g) => g.id !== id)
    setGenerations(updatedGenerations)
    saveGenerations(updatedGenerations)
    setSelectedGeneration(null)
  }

  const handleSelectGeneration = (generation: Generation) => {
    setSelectedGeneration(generation)
    setIsCreating(false)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setSelectedGeneration(null)
  }

  const handleCancelCreate = () => {
    setIsCreating(false)
  }

  const handleUpdateGeneration = (generation: Generation) => {
    const updatedGenerations = generations.map((g) =>
      g.id === generation.id ? generation : g
    )
    setGenerations(updatedGenerations)
    saveGenerations(updatedGenerations)
    setSelectedGeneration(generation)
  }

  const handleDeleteImage = (imageId: string) => {
    if (!selectedGeneration) return

    const updatedTasks = selectedGeneration.tasks.filter((t) => t.id !== imageId)
    const updatedGeneration = {
      ...selectedGeneration,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    }

    handleUpdateGeneration(updatedGeneration)
  }

  // Get all completed images from selected generation
  const galleryImages = selectedGeneration
    ? selectedGeneration.tasks
        .filter((t) => t.status === 'completed' && t.imageUrl)
        .map((t) => ({
          id: t.id,
          url: t.imageUrl!,
          prompt: t.prompt,
        }))
    : []

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
            <h1 className="text-3xl font-bold">Генерации</h1>
            <p className="text-muted-foreground">
              Создавайте и управляйте генерациями изображений
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Создать генерацию
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left side - List */}
          <GenerationList
            generations={generations}
            selectedGeneration={selectedGeneration}
            onSelect={handleSelectGeneration}
          />

          {/* Right side - Form or Detail (spans 2 columns) */}
          <div className="lg:col-span-2">
            {isCreating ? (
              <GenerationForm
                onSave={handleSaveGeneration}
                onCancel={handleCancelCreate}
              />
            ) : selectedGeneration ? (
              <GenerationDetail
                generation={selectedGeneration}
                onDelete={handleDeleteGeneration}
                onUpdate={handleUpdateGeneration}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                  <Images className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Выберите генерацию
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Выберите генерацию из списка или создайте новую
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full-width Gallery Section */}
        {selectedGeneration && (
          <ImageGallery
            images={galleryImages}
            onDelete={handleDeleteImage}
            className="mt-6"
          />
        )}
      </div>
    </MainLayout>
  )
}
