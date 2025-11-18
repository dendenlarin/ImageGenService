import * as React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface HoverInfoProps {
  /** Текст всплывающей подсказки */
  text: React.ReactNode
  /** Дочерний элемент, на который будет навешена подсказка */
  children: React.ReactNode
  /** Позиция подсказки относительно триггера */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Выравнивание подсказки */
  align?: 'start' | 'center' | 'end'
  /** Задержка перед показом подсказки в миллисекундах */
  delay?: number
  /** Максимальная ширина подсказки */
  maxWidth?: string
  /** Визуальный вариант подсказки */
  variant?: 'default' | 'info' | 'warning'
  /** CSS класс для триггера */
  triggerClassName?: string
  /** CSS класс для контента подсказки */
  contentClassName?: string
}

const variantStyles = {
  default: '',
  info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
  warning:
    'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100',
}

/**
 * HoverInfo - компонент для отображения всплывающих подсказок при наведении на текст.
 * Идеален для использования в MDX файлах для добавления дополнительной информации.
 *
 * @example
 * ```tsx
 * <HoverInfo text="Например попугаи вида ара">
 *   попугаи и другие птицы
 * </HoverInfo>
 * ```
 *
 * @example
 * ```tsx
 * <HoverInfo
 *   text="Дополнительная информация"
 *   side="right"
 *   delay={300}
 *   variant="info"
 * >
 *   Наведите на меня
 * </HoverInfo>
 * ```
 */
export const HoverInfo: React.FC<HoverInfoProps> = ({
  text,
  children,
  side = 'top',
  align = 'center',
  delay = 200,
  maxWidth = '300px',
  variant = 'default',
  triggerClassName,
  contentClassName,
}) => {
  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'underline decoration-dotted underline-offset-2 cursor-help',
              triggerClassName
            )}
          >
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(variantStyles[variant], contentClassName)}
          style={{ maxWidth }}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

HoverInfo.displayName = 'HoverInfo'
