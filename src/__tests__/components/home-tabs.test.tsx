import { expect, test, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NextIntlClientProviderWrapper from '../utils/next-intl-client-provider-wrapper'
import HomeTabs from '@/components/home-tabs'

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

test('Home tabs component', async () => {
  render(
    <NextIntlClientProviderWrapper>
      <HomeTabs />
    </NextIntlClientProviderWrapper>
  )

  const tab1 = screen.getByRole('tab-gen-text')
  expect(tab1).toBeDefined()
  const tabContent1 = screen.getByRole('tab-content-gen-text')
  expect(tabContent1).toBeDefined()

  const tab2 = screen.getByRole('tab-opt-text')
  expect(tab2).toBeDefined()
  // fireEvent.click(tab2)
  // await waitFor(() => {
  //   const tabContent2 = screen.getByRole('tab-content-opt-text')
  //   expect(tabContent2).toBeDefined()
  // })

  const tab3 = screen.getByRole('tab-chat')
  expect(tab3).toBeDefined()

  const tab4 = screen.getByRole('tab-collab')
  expect(tab4).toBeDefined()
  // const tabContent3 = screen.getByRole('tab-content-collab')
  // expect(tabContent3).toBeDefined()
})
