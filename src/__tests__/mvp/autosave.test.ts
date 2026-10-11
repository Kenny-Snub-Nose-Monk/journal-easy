import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSaveQueue } from '@/lib/autosave/queue'

afterEach(() => vi.useRealTimers())
describe('single-user autosave', () => {
  it('coalesces keystrokes to the latest document', async () => {
    vi.useFakeTimers()
    const write = vi.fn().mockResolvedValue(undefined)
    const queue = createSaveQueue(write)
    queue.schedule('first')
    queue.schedule('latest')
    await vi.advanceTimersByTimeAsync(700)
    expect(write.mock.calls).toEqual([['latest']])
  })
  it('waits for an in-flight write before saving newer content', async () => {
    const writes: string[] = []
    let finish!: () => void
    const queue = createSaveQueue(async (snapshot: string) => {
      writes.push(snapshot)
      if (snapshot === 'first')
        await new Promise<void>((resolve) => {
          finish = resolve
        })
    })
    queue.schedule('first')
    const flushing = queue.flush()
    queue.schedule('latest')
    expect(writes).toEqual(['first'])
    finish()
    await flushing
    expect(writes).toEqual(['first', 'latest'])
  })
  it('retains a failed snapshot for reconnect retry', async () => {
    const write = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined)
    const queue = createSaveQueue(write)
    queue.schedule('draft')
    await expect(queue.flush()).rejects.toThrow('offline')
    await queue.flush()
    expect(write.mock.calls).toEqual([['draft'], ['draft']])
  })
  it('does not resurrect failed old content over a newer pending draft', async () => {
    let fail!: (reason: Error) => void
    const write = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<void>((_resolve, reject) => {
            fail = reject
          })
      )
      .mockResolvedValue(undefined)
    const queue = createSaveQueue(write)
    queue.schedule('old')
    const flushing = queue.flush()
    queue.schedule('new')
    fail(new Error('offline'))
    await expect(flushing).rejects.toThrow()
    await queue.flush()
    expect(write.mock.calls).toEqual([['old'], ['new']])
  })
})
