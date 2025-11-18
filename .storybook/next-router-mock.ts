// Mock Next.js router and navigation hooks for Storybook

// Mock usePathname hook
export const usePathname = () => '/'

// Mock useRouter hook
export const useRouter = () => ({
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
})

// Mock useSearchParams hook
export const useSearchParams = () => new URLSearchParams()

// Mock useParams hook
export const useParams = () => ({})

// Setup mocks globally
if (typeof window !== 'undefined') {
  ;(window as any).__NEXT_DATA__ = {
    props: {},
    page: '/',
    query: {},
    buildId: 'development',
    isFallback: false,
  }
}
