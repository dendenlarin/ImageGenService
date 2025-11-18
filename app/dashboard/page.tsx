'use client'

import { MainLayout } from '@/components/templates/main-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Home, Mail } from 'lucide-react'

export default function DashboardPage() {
  return (
    <MainLayout
      header={{
        logoText: 'MyService',
        navItems: [{ href: '/dashboard', label: 'Dashboard', icon: Home }],
      }}
      sidebar={{
        sections: [
          {
            title: 'Основное',
            items: [
              {
                href: '/dashboard',
                label: 'Dashboard',
                icon: Home,
              },
              {
                href: '/contact',
                label: 'Контакты',
                icon: Mail,
              },
            ],
          },
        ],
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Добро пожаловать в ваш микро-веб-сервис
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Всего пользователей</CardTitle>
              <CardDescription>Активные пользователи</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Новые заказы</CardTitle>
              <CardDescription>За последние 30 дней</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Доход</CardTitle>
              <CardDescription>За текущий месяц</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Последняя активность</CardTitle>
            <CardDescription>Недавние события в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Новый пользователь зарегистрирован
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2 минуты назад
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Новый заказ #1234</p>
                  <p className="text-xs text-muted-foreground">
                    15 минут назад
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Обновление системы</p>
                  <p className="text-xs text-muted-foreground">1 час назад</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
