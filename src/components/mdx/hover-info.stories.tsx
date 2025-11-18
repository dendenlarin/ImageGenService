import type { Meta, StoryObj } from '@storybook/react'
import { HoverInfo } from './hover-info'

const meta = {
  title: 'MDX/HoverInfo',
  component: HoverInfo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Компонент для добавления всплывающих подсказок при наведении на текст. Идеален для использования в MDX файлах.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Текст всплывающей подсказки',
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Позиция подсказки относительно триггера',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Выравнивание подсказки',
    },
    delay: {
      control: 'number',
      description: 'Задержка перед показом подсказки в миллисекундах',
    },
    maxWidth: {
      control: 'text',
      description: 'Максимальная ширина подсказки',
    },
    variant: {
      control: 'select',
      options: ['default', 'info', 'warning'],
      description: 'Визуальный вариант подсказки',
    },
  },
} satisfies Meta<typeof HoverInfo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Базовый пример использования компонента HoverInfo.
 * Наведите курсор на подчеркнутый текст, чтобы увидеть всплывающую подсказку.
 */
export const Default: Story = {
  args: {
    text: 'Например попугаи вида ара',
    children: 'попугаи и другие птицы',
  },
}

/**
 * Пример использования в контексте предложения.
 * Демонстрирует, как компонент выглядит внутри обычного текста.
 */
export const InSentence: Story = {
  render: (args) => (
    <p className="max-w-md text-base">
      В джунглях летают{' '}
      <HoverInfo {...args}>попугаи и другие птицы</HoverInfo>, которые
      наполняют лес своими яркими красками и звуками.
    </p>
  ),
  args: {
    text: 'Например попугаи вида ара, туканы и колибри',
    side: 'top',
  },
}

/**
 * Подсказка с вариантом "info".
 * Используйте этот вариант для информационных сообщений.
 */
export const InfoVariant: Story = {
  args: {
    text: 'Это важная информация для понимания контекста',
    children: 'важный термин',
    variant: 'info',
  },
}

/**
 * Подсказка с вариантом "warning".
 * Используйте этот вариант для предупреждений и важных замечаний.
 */
export const WarningVariant: Story = {
  args: {
    text: 'Обратите особое внимание на этот момент!',
    children: 'важное предупреждение',
    variant: 'warning',
  },
}

/**
 * Подсказка справа от текста.
 * Полезно, когда текст находится с левой стороны экрана.
 */
export const RightSide: Story = {
  args: {
    text: 'Эта подсказка появляется справа',
    children: 'наведите сюда',
    side: 'right',
  },
}

/**
 * Подсказка снизу от текста.
 * Полезно, когда текст находится в верхней части экрана.
 */
export const BottomSide: Story = {
  args: {
    text: 'Эта подсказка появляется снизу',
    children: 'наведите сюда',
    side: 'bottom',
  },
}

/**
 * Подсказка слева от текста.
 * Полезно, когда текст находится справа.
 */
export const LeftSide: Story = {
  args: {
    text: 'Эта подсказка появляется слева',
    children: 'наведите сюда',
    side: 'left',
  },
}

/**
 * Подсказка с увеличенной задержкой.
 * Полезно, чтобы избежать случайного показа подсказок.
 */
export const LongDelay: Story = {
  args: {
    text: 'Подсказка появится через 500мс',
    children: 'подождите немного',
    delay: 500,
  },
}

/**
 * Подсказка без задержки.
 * Показывается мгновенно при наведении.
 */
export const NoDelay: Story = {
  args: {
    text: 'Подсказка появляется мгновенно',
    children: 'мгновенная подсказка',
    delay: 0,
  },
}

/**
 * Подсказка с длинным текстом.
 * Демонстрирует работу с максимальной шириной.
 */
export const LongText: Story = {
  args: {
    text: 'Это очень длинная подсказка, которая содержит много информации. Она автоматически переносится на новую строку благодаря ограничению максимальной ширины. Это помогает сохранить читаемость текста.',
    children: 'длинная подсказка',
    maxWidth: '400px',
  },
}

/**
 * Подсказка с узкой шириной.
 * Текст переносится раньше из-за меньшей максимальной ширины.
 */
export const NarrowWidth: Story = {
  args: {
    text: 'Эта подсказка имеет узкую максимальную ширину и текст переносится раньше.',
    children: 'узкая подсказка',
    maxWidth: '150px',
  },
}

/**
 * Подсказка с выравниванием по началу.
 * Полезно для выравнивания с началом триггера.
 */
export const AlignStart: Story = {
  args: {
    text: 'Подсказка выровнена по началу',
    children: 'выравнивание по началу',
    align: 'start',
    side: 'bottom',
  },
}

/**
 * Подсказка с выравниванием по концу.
 * Полезно для выравнивания с концом триггера.
 */
export const AlignEnd: Story = {
  args: {
    text: 'Подсказка выровнена по концу',
    children: 'выравнивание по концу',
    align: 'end',
    side: 'bottom',
  },
}

/**
 * Подсказка с React элементами.
 * Демонстрирует, что в подсказке можно использовать JSX.
 */
export const WithReactElements: Story = {
  args: {
    text: (
      <div>
        <strong>Попугай Ара</strong>
        <p className="text-xs mt-1">
          Крупный попугай с яркой окраской, обитающий в тропических лесах
          Южной Америки.
        </p>
      </div>
    ),
    children: 'попугай ара',
    maxWidth: '250px',
  },
}

/**
 * Множественные подсказки в одном тексте.
 * Демонстрирует использование нескольких компонентов HoverInfo.
 */
export const MultipleTooltips: Story = {
  render: () => (
    <div className="max-w-lg text-base">
      <p>
        В <HoverInfo text="Влажные тропические леса">джунглях</HoverInfo>{' '}
        Амазонии обитают{' '}
        <HoverInfo
          text="Например попугаи ара, туканы и колибри"
          variant="info"
        >
          разнообразные птицы
        </HoverInfo>
        ,{' '}
        <HoverInfo
          text="Ягуары, пумы, оцелоты и другие кошачьи"
          variant="info"
        >
          хищники
        </HoverInfo>{' '}
        и{' '}
        <HoverInfo
          text="Некоторые виды находятся под угрозой исчезновения"
          variant="warning"
        >
          редкие животные
        </HoverInfo>
        .
      </p>
    </div>
  ),
}
