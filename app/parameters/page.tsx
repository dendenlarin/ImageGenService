'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/templates/main-layout'
import { Settings, FileText, Layers, Images, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ParameterList } from '@/components/organisms/parameter-list'
import { ParameterForm } from '@/components/organisms/parameter-form'
import { ParameterDetail } from '@/components/organisms/parameter-detail'
import { Parameter } from '@/lib/types'
import { getParameters, saveParameters } from '@/lib/storage'

export default function ParametersPage() {
  const [parameters, setParameters] = useState<Parameter[]>([])
  const [selectedParameter, setSelectedParameter] = useState<Parameter | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Load parameters on mount
  useEffect(() => {
    setParameters(getParameters())
  }, [])

  // Save parameters to storage
  const handleSaveParameter = (parameter: Parameter) => {
    const existingIndex = parameters.findIndex((p) => p.id === parameter.id)
    let updatedParameters: Parameter[]

    if (existingIndex >= 0) {
      updatedParameters = [...parameters]
      updatedParameters[existingIndex] = parameter
    } else {
      updatedParameters = [...parameters, parameter]
    }

    setParameters(updatedParameters)
    saveParameters(updatedParameters)
    setIsCreating(false)
    setIsEditing(false)
    setSelectedParameter(parameter)
  }

  const handleDeleteParameter = (id: string) => {
    const updatedParameters = parameters.filter((p) => p.id !== id)
    setParameters(updatedParameters)
    saveParameters(updatedParameters)
    setSelectedParameter(null)
  }

  const handleSelectParameter = (parameter: Parameter) => {
    setSelectedParameter(parameter)
    setIsCreating(false)
    setIsEditing(false)
  }

  const handleCreateNew = () => {
    setIsCreating(true)
    setIsEditing(false)
    setSelectedParameter(null)
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
            <h1 className="text-3xl font-bold">Параметры</h1>
            <p className="text-muted-foreground">
              Создавайте и управляйте параметрами для промптов
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            Создать параметр
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left side - List */}
          <ParameterList
            parameters={parameters}
            selectedParameter={selectedParameter}
            onSelect={handleSelectParameter}
          />

          {/* Right side - Form or Detail */}
          <div>
            {isCreating || isEditing ? (
              <ParameterForm
                parameter={isEditing ? selectedParameter : undefined}
                onSave={handleSaveParameter}
                onCancel={handleCancelEdit}
              />
            ) : selectedParameter ? (
              <ParameterDetail
                parameter={selectedParameter}
                onEdit={handleEdit}
                onDelete={handleDeleteParameter}
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8">
                <div className="text-center">
                  <Layers className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Выберите параметр</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Выберите параметр из списка или создайте новый
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
