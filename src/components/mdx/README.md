# HoverInfo Component

Компонент для добавления всплывающих подсказок при наведении на текст. Идеально подходит для использования в MDX файлах.

## Установка

Компонент использует базовый `Tooltip` из shadcn/ui, который построен на [Radix UI Tooltip](https://www.radix-ui.com/docs/primitives/components/tooltip).

Зависимости уже установлены:
- `@radix-ui/react-tooltip`

## Использование

### Базовый пример

```tsx
import { HoverInfo } from '@/components/mdx/hover-info'

<HoverInfo text="Например попугаи вида ара">
  попугаи и другие птицы
</HoverInfo>
```

### В MDX

```mdx
В джунглях летают <HoverInfo text="Например попугаи вида ара">попугаи и другие птицы</HoverInfo>.
```

### С дополнительными параметрами

```tsx
<HoverInfo
  text="Дополнительная информация"
  side="right"
  delay={300}
  variant="info"
  maxWidth="400px"
>
  наведите на меня
</HoverInfo>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `React.ReactNode` | **required** | Текст всплывающей подсказки |
| `children` | `React.ReactNode` | **required** | Дочерний элемент, на который будет навешена подсказка |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Позиция подсказки относительно триггера |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Выравнивание подсказки |
| `delay` | `number` | `200` | Задержка перед показом подсказки в миллисекундах |
| `maxWidth` | `string` | `'300px'` | Максимальная ширина подсказки |
| `variant` | `'default' \| 'info' \| 'warning'` | `'default'` | Визуальный вариант подсказки |
| `triggerClassName` | `string` | - | CSS класс для триггера |
| `contentClassName` | `string` | - | CSS класс для контента подсказки |

## Варианты стилей

### Default

Стандартный вариант с нейтральным стилем.

```tsx
<HoverInfo text="Обычная подсказка">текст</HoverInfo>
```

### Info

Информационный вариант с голубым оттенком.

```tsx
<HoverInfo text="Информация" variant="info">текст</HoverInfo>
```

### Warning

Вариант для предупреждений с янтарным оттенком.

```tsx
<HoverInfo text="Важно!" variant="warning">текст</HoverInfo>
```

## Примеры

### Множественные подсказки в тексте

```mdx
В <HoverInfo text="Влажные тропические леса">джунглях</HoverInfo> обитают
<HoverInfo text="Попугаи, туканы, колибри" variant="info">разнообразные птицы</HoverInfo> и
<HoverInfo text="Некоторые виды под угрозой" variant="warning">редкие животные</HoverInfo>.
```

### С React элементами в подсказке

```tsx
<HoverInfo
  text={
    <div>
      <strong>Заголовок</strong>
      <p className="text-xs mt-1">Подробное описание...</p>
    </div>
  }
  maxWidth="250px"
>
  термин
</HoverInfo>
```

### Разные позиции

```tsx
<HoverInfo text="Сверху" side="top">текст</HoverInfo>
<HoverInfo text="Справа" side="right">текст</HoverInfo>
<HoverInfo text="Снизу" side="bottom">текст</HoverInfo>
<HoverInfo text="Слева" side="left">текст</HoverInfo>
```

## Рекомендации

- **Не перегружайте текст**: Используйте подсказки умеренно, чтобы не отвлекать читателя
- **Задержка**: Используйте задержку 200-300мс для лучшего UX
- **Ширина**: Ограничивайте максимальную ширину для длинных подсказок (250-400px)
- **Варианты**: Выбирайте подходящий вариант в зависимости от типа информации:
  - `default` - для нейтральных пояснений
  - `info` - для дополнительной информации
  - `warning` - для важных замечаний и предупреждений

## Доступность

Компонент построен на Radix UI и включает:

- ✅ Клавиатурная навигация
- ✅ Screen reader поддержка
- ✅ ARIA атрибуты
- ✅ Focus management

## Storybook

Для просмотра всех вариантов компонента запустите Storybook:

```bash
pnpm storybook
```

Примеры доступны в секциях:
- **MDX/HoverInfo** - интерактивные примеры компонента
- **MDX/HoverInfo Example** - демонстрация использования в MDX

## Архитектура

`HoverInfo` - это wrapper компонент над базовым `Tooltip` из shadcn/ui:

```
HoverInfo (wrapper для MDX)
  ↓
Tooltip (shadcn/ui)
  ↓
TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
  ↓
@radix-ui/react-tooltip
```

Такая архитектура обеспечивает:
- Гибкость при прямом использовании `Tooltip`
- Простоту использования в MDX через `HoverInfo`
- Единообразие с остальными компонентами проекта
