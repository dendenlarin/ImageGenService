# NextJS Micro Web Service Template

Готовый шаблон для создания микро-веб-сервисов на NextJS с компонентами по методологии Atomic Design, shadcn/ui и Storybook.

## Технологии

- **Next.js 16** - React фреймворк с App Router
- **React 19** - библиотека для построения пользовательских интерфейсов
- **TypeScript** - типизированный JavaScript
- **shadcn/ui** - коллекция переиспользуемых компонентов, построенных с Tailwind CSS
- **Tailwind CSS** - utility-first CSS фреймворк
- **React Hook Form + Zod** - управление формами и валидация
- **Storybook** - инструмент для разработки и документации UI компонентов
- **Vite** - быстрый сборщик для Storybook
- **ESLint + Prettier** - инструменты для линтинга и форматирования кода

## Начало работы

### Установка зависимостей

```bash
pnpm install
```

### Запуск NextJS приложения

```bash
# Режим разработки
pnpm next:dev

# Сборка для продакшена
pnpm next:build

# Запуск продакшен версии
pnpm next:start
```

NextJS приложение откроется по адресу [http://localhost:3000](http://localhost:3000)

### Запуск Storybook

```bash
pnpm storybook
```

Storybook откроется по адресу [http://localhost:6006](http://localhost:6006)

### Другие команды

```bash
# Проверка кода через ESLint
pnpm lint

# Автоматическое исправление ошибок ESLint
pnpm lint:fix

# Форматирование кода через Prettier
pnpm format

# Сборка Storybook
pnpm build-storybook
```

## Структура проекта (Atomic Design)

```
/
├── app/                          # NextJS App Router
│   ├── layout.tsx               # Корневой layout
│   ├── globals.css              # Глобальные стили
│   ├── contact/                 # Страница контактов
│   └── dashboard/               # Dashboard страница
├── src/
│   ├── components/
│   │   ├── ui/                  # Atoms - базовые UI компоненты (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── form.tsx
│   │   │   └── ...
│   │   ├── molecules/           # Molecules - простые комбинации atoms
│   │   │   ├── logo.tsx
│   │   │   ├── nav-item.tsx
│   │   │   └── ...
│   │   ├── organisms/           # Organisms - сложные компоненты
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ...
│   │   ├── templates/           # Templates - макеты страниц
│   │   │   ├── main-layout.tsx
│   │   │   └── ...
│   │   └── forms/               # Forms - готовые формы
│   │       ├── contact-form.tsx
│   │       └── ...
│   └── lib/                     # Утилиты и хелперы
│       └── utils.ts
├── .storybook/                  # Конфигурация Storybook
└── ...конфигурационные файлы
```

## Atomic Design Методология

Проект следует методологии Atomic Design:

### Atoms (Атомы) - `src/components/ui/`
Базовые UI элементы из shadcn/ui:
- Button, Input, Label, Checkbox
- Card, Dialog, Tooltip
- Avatar, Separator, Sheet

### Molecules (Молекулы) - `src/components/molecules/`
Простые комбинации atoms:
- **Logo** - логотип с ссылкой
- **NavItem** - элемент навигации с иконкой

### Organisms (Организмы) - `src/components/organisms/`
Сложные компоненты:
- **Header** - шапка с меню, логотипом и мобильным меню
- **Sidebar** - боковая панель с навигацией

### Templates (Шаблоны) - `src/components/templates/`
Макеты страниц:
- **MainLayout** - основной layout с Header и Sidebar

### Forms (Формы) - `src/components/forms/`
Готовые формы с валидацией:
- **ContactForm** - форма обратной связи

## Готовые страницы

- `/dashboard` - Dashboard с примером использования
- `/contact` - Страница контактов

## Как использовать шаблон

### 1. Создание нового микро-сервиса

Просто склонируйте этот репозиторий:

```bash
git clone <repository-url> my-new-service
cd my-new-service
pnpm install
```

### 2. Использование готовых компонентов

```tsx
import { MainLayout } from '@/components/templates/main-layout'
import { ContactForm } from '@/components/forms/contact-form'
import { Home, Users } from 'lucide-react'

export default function MyPage() {
  return (
    <MainLayout
      header={{
        logoText: 'MyService',
        navItems: [
          { href: '/dashboard', label: 'Dashboard', icon: Home },
          { href: '/contact', label: 'Contact', icon: Users },
        ],
      }}
      sidebar={{
        sections: [
          {
            title: 'Main',
            items: [
              { href: '/dashboard', label: 'Dashboard', icon: Home },
            ],
          },
        ],
      }}
    >
      <h1>My Page Content</h1>
    </MainLayout>
  )
}
```

### 3. Создание новых форм

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  name: z.string().min(2),
})

export function MyCustomForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Разработка компонентов

### В Storybook

1. Создайте компонент в нужной папке (atoms/molecules/organisms/templates/forms)
2. Создайте story файл (`*.stories.tsx`)
3. Запустите Storybook: `pnpm storybook`
4. Разрабатывайте компонент в изоляции

### В NextJS

1. Создайте страницу в папке `app/`
2. Используйте готовые компоненты
3. Запустите dev сервер: `pnpm next:dev`
4. Протестируйте в браузере

## Spec-Driven Development

Следуйте этим принципам:

1. **Определите спецификацию** - опишите что должен делать компонент
2. **Создайте интерфейс** - определите Props и типы
3. **Напишите Story** - создайте примеры использования в Storybook
4. **Реализуйте компонент** - следуя интерфейсу и примерам
5. **Протестируйте** - проверьте все варианты использования

## Добавление новых компонентов shadcn/ui

К сожалению, CLI shadcn может не работать. Вместо этого:

1. Найдите нужный компонент на [ui.shadcn.com](https://ui.shadcn.com)
2. Скопируйте код компонента в `src/components/ui/`
3. Установите необходимые зависимости
4. Создайте story файл

## Component-Driven Development

- Компоненты должны быть **переиспользуемыми**
- Компоненты должны быть **изолированными**
- Компоненты должны иметь **четкий интерфейс** (Props)
- Компоненты должны быть **документированы** (Stories)
- Компоненты должны быть **типизированы** (TypeScript)
