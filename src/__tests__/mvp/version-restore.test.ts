import { expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ version: vi.fn(), update: vi.fn() }))
vi.mock('@/db/db', () => ({ db: { $transaction: vi.fn() } }))
import { restoreDocVersion } from '@/lib/doc-version/server'
it('restores local content and title in one transaction with a pre-restore backup, without a collab service', async () => {
  vi.stubEnv('NEXT_PUBLIC_COLLABORATE_EDIT_URL', '')
  const collab = vi.fn()
  const transaction = vi.fn(async (callback) =>
    callback({ docVersion: { create: mocks.version }, doc: { update: mocks.update } })
  )
  await restoreDocVersion(
    {
      docId: 'd',
      userId: 'u',
      currentSnapshot: { docId: 'd', title: 'current', content: 'current content', contentBinaryBase64: 'AQI=' },
      targetVersion: {
        id: 'v',
        docId: 'd',
        title: 'previous',
        content: 'previous content',
        contentBinary: Buffer.from([3]),
      },
    },
    { callCollabRestore: collab, runTransaction: transaction as any }
  )
  expect(collab).not.toHaveBeenCalled()
  expect(transaction).toHaveBeenCalledOnce()
  expect(mocks.version.mock.calls[0][0].data.content).toBe('current content')
  expect(mocks.update.mock.calls[0][0].data).toEqual({
    title: 'previous',
    content: 'previous content',
    contentBinary: Buffer.from([3]),
  })
  vi.unstubAllEnvs()
})
