import type { Meta, StoryObj } from '@storybook/react'
import { Spoiler } from './spoiler'

const meta = {
  title: 'MDX/Spoiler',
  component: Spoiler,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент для скрытия спойлерного контента с эффектом размытия или пикселизации. При клике текст становится видимым, при повторном клике снова скрывается. Идеален для использования в MDX файлах.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    style: {
      control: 'select',
      options: ['blur', 'pixel'],
      description: 'Стиль скрытия текста',
    },
    defaultRevealed: {
      control: 'boolean',
      description: 'Начальное состояние (скрыт или показан)',
    },
    intensity: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Интенсивность эффекта (1-10)',
    },
  },
} satisfies Meta<typeof Spoiler>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Базовый пример использования компонента Spoiler с эффектом размытия.
 * Кликните на текст, чтобы показать или скрыть спойлер.
 */
export const Default: Story = {
  args: {
    children: 'Нед Старк умрет',
    style: 'blur',
  },
}

/**
 * Пример использования в контексте предложения с эффектом размытия.
 * Демонстрирует, как компонент выглядит внутри обычного текста.
 */
export const InSentence: Story = {
  render: (args) => (
    <p className="max-w-md text-base">
      В первом сезоне Игры Престолов{' '}
      <Spoiler {...args}>Нед Старк умрет</Spoiler>, что стало шокирующим
      поворотом для зрителей.
    </p>
  ),
  args: {
    style: 'blur',
  },
}

/**
 * Спойлер с эффектом пикселизации.
 * Использует pixelated rendering для имитации цензуры.
 */
export const PixelStyle: Story = {
  args: {
    children: 'Брюс Уиллис был мертв все это время',
    style: 'pixel',
  },
}

/**
 * Спойлер с эффектом пикселизации в предложении.
 * Демонстрирует pixel-стиль в контексте.
 */
export const PixelInSentence: Story = {
  render: (args) => (
    <p className="max-w-md text-base">
      В фильме "Шестое чувство"{' '}
      <Spoiler {...args}>Брюс Уиллис был мертв все это время</Spoiler>, что
      полностью меняет восприятие фильма.
    </p>
  ),
  args: {
    style: 'pixel',
  },
}

/**
 * Спойлер с высокой интенсивностью размытия.
 * Текст практически нечитаем до раскрытия.
 */
export const HighIntensity: Story = {
  args: {
    children: 'Кайзер Созе - это Вербал Кинт',
    style: 'blur',
    intensity: 10,
  },
}

/**
 * Спойлер с низкой интенсивностью размытия.
 * Текст частично читаем даже в скрытом состоянии.
 */
export const LowIntensity: Story = {
  args: {
    children: 'Дарт Вейдер - отец Люка',
    style: 'blur',
    intensity: 2,
  },
}

/**
 * Спойлер, который по умолчанию раскрыт.
 * Полезно, если нужно показать содержимое сразу.
 */
export const DefaultRevealed: Story = {
  args: {
    children: 'Розбад - это детские санки',
    style: 'blur',
    defaultRevealed: true,
  },
}

/**
 * Множественные спойлеры с разными стилями в одном тексте.
 * Демонстрирует использование нескольких компонентов Spoiler.
 */
export const MultipleSpilers: Story = {
  render: () => (
    <div className="max-w-lg text-base space-y-4">
      <p>
        <strong>Игра Престолов:</strong> В первом сезоне{' '}
        <Spoiler style="blur">Нед Старк умрет</Spoiler>, а в третьем сезоне
        произойдет <Spoiler style="pixel">Красная свадьба</Spoiler>.
      </p>
      <p>
        <strong>Звездные войны:</strong>{' '}
        <Spoiler style="blur" intensity={7}>
          Дарт Вейдер - отец Люка
        </Spoiler>
        , а{' '}
        <Spoiler style="pixel" intensity={6}>
          Лея - его сестра
        </Spoiler>
        .
      </p>
      <p>
        <strong>Матрица:</strong>{' '}
        <Spoiler style="blur">Нео - избранный</Spoiler>, и в конце фильма он{' '}
        <Spoiler style="pixel">научится летать</Spoiler>.
      </p>
    </div>
  ),
}

/**
 * Пример MDX использования с различными спойлерами.
 * Показывает типичные случаи применения в документации.
 */
export const MDXExample: Story = {
  render: () => (
    <div className="max-w-2xl text-base space-y-6">
      <h2 className="text-2xl font-bold mb-4">Спойлеры к фильмам</h2>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Обычные фильмы:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Шестое чувство:{' '}
            <Spoiler style="blur">Главный герой мертв</Spoiler>
          </li>
          <li>
            Обычные подозреваемые:{' '}
            <Spoiler style="pixel">Кайзер Созе - это Вербал</Spoiler>
          </li>
          <li>
            Гражданин Кейн:{' '}
            <Spoiler style="blur" intensity={6}>
              Розбад - детские санки
            </Spoiler>
          </li>
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Сериалы:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Breaking Bad:{' '}
            <Spoiler style="pixel" intensity={7}>
              Уолтер умрет в конце
            </Spoiler>
          </li>
          <li>
            Lost:{' '}
            <Spoiler style="blur" intensity={8}>
              Они были мертвы все это время (нет)
            </Spoiler>
          </li>
        </ul>
      </div>
    </div>
  ),
}

/**
 * Спойлер с кастомными стилями.
 * Демонстрирует возможность добавления собственных CSS классов.
 */
export const CustomStyling: Story = {
  args: {
    children: 'Секретная информация',
    style: 'blur',
    className: 'bg-red-100 dark:bg-red-900/30 font-bold text-red-800 dark:text-red-200',
  },
}

/**
 * Интерактивный пример для тестирования всех параметров.
 * Используйте контролы для настройки компонента.
 */
export const Interactive: Story = {
  args: {
    children: 'Настройте меня с помощью контролов!',
    style: 'blur',
    intensity: 5,
    defaultRevealed: false,
  },
}

/**
 * Длинный спойлер текст.
 * Показывает, как компонент работает с большим количеством текста.
 */
export const LongText: Story = {
  render: (args) => (
    <div className="max-w-2xl text-base">
      <p>
        В финале фильма происходит неожиданный поворот:{' '}
        <Spoiler {...args}>
          главный герой осознает, что весь фильм был его галлюцинацией, и на
          самом деле он находится в психиатрической больнице уже много лет
        </Spoiler>
        . Этот твист полностью меняет восприятие всех предыдущих событий.
      </p>
    </div>
  ),
  args: {
    style: 'blur',
    intensity: 6,
  },
}
