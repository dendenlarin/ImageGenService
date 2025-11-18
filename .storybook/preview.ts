import type { Preview } from '@storybook/react-vite'
import '../src/index.css'

// Mock Next.js router
const mockRouter = {
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  reload: () => {},
  back: () => {},
  forward: () => {},
  prefetch: () => Promise.resolve(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
}

// Mock Next.js navigation hooks
if (typeof window !== 'undefined') {
  // Mock useRouter
  ;(window as any).next = {
    router: mockRouter,
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    nextjs: {
      appDirectory: true,
      router: mockRouter,
    },
  },
};

export default preview;