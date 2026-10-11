import { beforeAll, vi } from 'vitest'
vi.mock('server-only', () => ({}))
beforeAll(() => {
  vi.mock('next/router', () => require('next-router-mock'))
  vi.mock('@/i18n/routing', () => ({
    ...require('next-router-mock'),
    usePathname() {
      return ''
    },
  }))
})
