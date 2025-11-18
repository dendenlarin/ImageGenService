import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SpoilerProps {
  /** Дочерний элемент - скрываемый текст */
  children: React.ReactNode
  /** Стиль скрытия текста */
  style?: 'blur' | 'pixel'
  /** Начальное состояние (скрыт или показан) */
  defaultRevealed?: boolean
  /** CSS класс для обертки */
  className?: string
  /** Интенсивность эффекта (1-10) */
  intensity?: number
}

const styleEffects = {
  blur: (intensity: number) => ({
    filter: `blur(${intensity}px)`,
    WebkitFilter: `blur(${intensity}px)`,
  }),
  pixel: (intensity: number) => ({
    filter: `blur(${intensity * 0.5}px)`,
    WebkitFilter: `blur(${intensity * 0.5}px)`,
    imageRendering: 'pixelated' as const,
    textRendering: 'optimizeSpeed' as const,
  }),
}

/**
 * Spoiler - компонент для скрытия спойлерного контента с эффектом размытия или пикселизации.
 * При клике текст становится видимым, при повторном клике снова скрывается.
 * Идеален для использования в MDX файлах.
 *
 * @example
 * ```tsx
 * В первом сезоне Игры Престолов <Spoiler style="pixel">Нед Старк умрет</Spoiler>
 * ```
 *
 * @example
 * ```tsx
 * <Spoiler style="blur" intensity={8}>
 *   Это важный спойлер к фильму!
 * </Spoiler>
 * ```
 */
export const Spoiler: React.FC<SpoilerProps> = ({
  children,
  style = 'blur',
  defaultRevealed = false,
  className,
  intensity = 5,
}) => {
  const [isRevealed, setIsRevealed] = React.useState(defaultRevealed)

  const handleClick = () => {
    setIsRevealed((prev) => !prev)
  }

  const effectStyle = !isRevealed ? styleEffects[style](intensity) : {}

  return (
    <span
      onClick={handleClick}
      className={cn(
        'inline-block cursor-pointer select-none transition-all duration-300 ease-in-out',
        'rounded px-1 py-0.5',
        !isRevealed && 'bg-muted/30 hover:bg-muted/50',
        isRevealed && 'bg-transparent',
        className
      )}
      style={effectStyle}
      role="button"
      tabIndex={0}
      aria-label={isRevealed ? 'Скрыть спойлер' : 'Показать спойлер'}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      title={isRevealed ? 'Нажмите чтобы скрыть' : 'Нажмите чтобы показать'}
    >
      {children}
    </span>
  )
}

Spoiler.displayName = 'Spoiler'
