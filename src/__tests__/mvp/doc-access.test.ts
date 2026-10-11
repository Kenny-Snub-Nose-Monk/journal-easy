import { beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ user: vi.fn(), find: vi.fn(), update: vi.fn() }))
vi.mock('@/lib/session', () => ({ getUserInfo: mocks.user }))
vi.mock('@/db/db', () => ({ db: { doc: { findFirst: mocks.find, findUnique: mocks.find, updateMany: mocks.update } } }))
vi.mock('@/lib/mailer', () => ({ sendEmail: vi.fn() }))
import { GET, PATCH } from '@/app/api/doc/[id]/route'
beforeEach(() => {
  vi.clearAllMocks()
  mocks.user.mockResolvedValue({ id: 'owner' })
})
const params = { params: { id: 'doc' } }
const patch = (body: unknown) =>
  PATCH(new Request('http://localhost/api/doc/doc', { method: 'PATCH', body: JSON.stringify(body) }), params)

it('denies anonymous private document access before touching the database', async () => {
  mocks.user.mockResolvedValue(null)
  expect((await GET(new Request('http://localhost'), params)).status).toBe(401)
  expect(mocks.find).not.toHaveBeenCalled()
})
it('allows reads only for an owner or an explicit share recipient', async () => {
  mocks.find.mockResolvedValue(null)
  await GET(new Request('http://localhost'), params)
  expect(mocks.find.mock.calls[0][0].where.OR).toEqual([
    { userId: 'owner' },
    { shareRelations: { some: { userId: 'owner' } } },
  ])
})
it('requires WRITE permission and rejects a stale autosave', async () => {
  mocks.find.mockResolvedValue({ id: 'doc' })
  mocks.update.mockResolvedValue({ count: 0 })
  const response = await patch({ content: '{"type":"doc"}', expectedContent: 'old' })
  expect(response.status).toBe(409)
  expect(mocks.find.mock.calls[0][0].where.OR[1].shareRelations.some.access).toBe('WRITE')
  expect(mocks.update.mock.calls[0][0].where.content).toBe('old')
})
it('rejects forged fields and malformed editor JSON', async () => {
  expect((await patch({ userId: 'attacker' })).status).toBe(400)
  expect((await patch({ content: 'not JSON' })).status).toBe(400)
  expect(mocks.update).not.toHaveBeenCalled()
})
it('saves JSON and Yjs binary together', async () => {
  mocks.find.mockResolvedValue({ id: 'doc' })
  mocks.update.mockResolvedValue({ count: 1 })
  const response = await patch({ content: '{"type":"doc"}', contentBinaryBase64: 'AQI=', expectedContent: '' })
  expect((await response.json()).errno).toBe(0)
  expect(mocks.update.mock.calls[0][0].data.contentBinary).toEqual(Buffer.from([1, 2]))
})
