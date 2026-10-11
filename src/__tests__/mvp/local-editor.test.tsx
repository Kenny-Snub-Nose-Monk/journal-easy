import { beforeEach, afterEach, expect, it, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useUserStore } from '@/stores/user-store'
import { flushDocContent } from '@/lib/doc-version/snapshot-provider'
const mocks = vi.hoisted(() => ({ get: vi.fn(), patch: vi.fn(), provider: vi.fn() }))
vi.mock('@/lib/ajax', () => ({ get: mocks.get, patch: mocks.patch }))
vi.mock('next-intl', () => ({ useLocale: () => 'en', useTranslations: () => (key: string) => key }))
vi.mock('@hocuspocus/provider', () => ({ HocuspocusProvider: mocks.provider }))
import useCreateEditor from '@/components/editor/hooks/useCreateEditor'

beforeEach(() => {
  localStorage.clear()
  useUserStore.setState({ userInfo: { id: 'owner', name: 'Owner', email: 'owner@localhost' } })
  mocks.get.mockResolvedValue({
    errno: 0,
    data: {
      content: JSON.stringify({
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'saved journal' }] }],
      }),
    },
  })
  mocks.patch.mockResolvedValue({ errno: 0 })
})
afterEach(() => vi.clearAllMocks())
it('loads and edits a document without a WebSocket service, then persists the actual editor snapshot', async () => {
  const hook = renderHook(() => useCreateEditor('local-doc'))
  await waitFor(() => expect(hook.result.current.loading).toBe(false))
  expect(hook.result.current.editor?.getText()).toBe('saved journal')
  expect(mocks.provider).not.toHaveBeenCalled()
  act(() => {
    hook.result.current.editor?.commands.setContent('<p>new journal</p>', true)
  })
  await flushDocContent('local-doc')
  const body = mocks.patch.mock.calls.at(-1)?.[1]
  expect(JSON.parse(body.content).content[0].content[0].text).toBe('new journal')
  expect(body.contentBinaryBase64.length).toBeGreaterThan(0)
  expect(body.expectedContent).toContain('saved journal')
  expect(localStorage.getItem('journal-draft:owner:local-doc')).toBeNull()
  hook.unmount()
})

it('persists a title-only edit through the same autosave queue and retains it in a browser draft until saved', async () => {
  const { useDocsStore } = await import('@/stores/docs-store')
  const { updateTitle } = await import('@/app/[locale]/work/[id]/client-action')
  useDocsStore.setState({ docs: [{ id: 'title-doc', title: 'Old title', parentId: null, icon: null }] })
  const hook = renderHook(() => useCreateEditor('title-doc'))
  await waitFor(() => expect(hook.result.current.loading).toBe(false))
  act(() => {
    useDocsStore.getState().updateDocTitle('title-doc', 'New title')
    updateTitle('title-doc', 'New title')
  })
  expect(JSON.parse(localStorage.getItem('journal-draft:owner:title-doc')!).title).toBe('New title')
  await flushDocContent('title-doc')
  expect(mocks.patch.mock.calls.at(-1)?.[1].title).toBe('New title')
  hook.unmount()
})
