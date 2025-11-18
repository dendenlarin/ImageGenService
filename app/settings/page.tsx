'use client'

import { MainLayout } from '@/components/templates/main-layout'
import { Settings, FileText, Layers, Images } from 'lucide-react'
import { SettingsForm } from '@/components/forms/settings-form'

export default function SettingsPage() {
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
        <div>
          <h1 className="text-3xl font-bold">Настройки</h1>
          <p className="text-muted-foreground">
            Управление API ключами и системными промптами
          </p>
        </div>

        <SettingsForm />
      </div>
    </MainLayout>
  )
}
