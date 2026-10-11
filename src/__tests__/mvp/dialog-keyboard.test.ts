import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useDialogListKeyPress from '@/app/[locale]/work/(dialog-pages)/hooks/useDialogListKeyPress'
import { IDoc } from '@/stores/docs-store'

const list = [
  { id: 'one', title: 'First' },
  { id: 'two', title: 'Second' },
] as IDoc[]

function press(key: string, options: KeyboardEventInit = {}) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...options })
  act(() => document.dispatchEvent(event))
  return event
}

function setup(docs = list) {
  const setKeyword = vi.fn()
  const handleClick = vi.fn()
  const hook = renderHook(({ docs }) => useDialogListKeyPress({ list: docs, setKeyword, handleClick }), {
    initialProps: { docs },
  })
  return { ...hook, setKeyword, handleClick }
}

describe('dialog result keyboard navigation', () => {
  it('wraps in both directions and opens the selected result', () => {
    const hook = setup()
    press('ArrowUp')
    expect(hook.result.current.currentIndex).toBe(1)
    expect(hook.setKeyword).toHaveBeenLastCalledWith('Second')
    press('ArrowDown')
    expect(hook.result.current.currentIndex).toBe(0)
    press('Enter')
    expect(hook.handleClick).toHaveBeenCalledWith(list[0])
    hook.unmount()
  })

  it('leaves input-method composition and browser shortcuts alone', () => {
    const hook = setup()
    expect(press('ArrowDown', { isComposing: true }).defaultPrevented).toBe(false)
    expect(press('Enter', { keyCode: 229 }).defaultPrevented).toBe(false)
    expect(press('ArrowDown', { ctrlKey: true }).defaultPrevented).toBe(false)
    expect(hook.result.current.currentIndex).toBe(-1)
    expect(hook.handleClick).not.toHaveBeenCalled()
    hook.unmount()
  })

  it('does not intercept keys when there are no results', () => {
    const hook = setup([])
    expect(press('ArrowDown').defaultPrevented).toBe(false)
    expect(press('Enter').defaultPrevented).toBe(false)
    expect(hook.setKeyword).not.toHaveBeenCalled()
    hook.unmount()
  })

  it('uses refreshed results and removes the listener when the dialog closes', () => {
    const hook = setup()
    press('ArrowDown')
    const updated = [{ ...list[0], title: 'Updated' }]
    hook.rerender({ docs: updated })
    press('Enter')
    expect(hook.handleClick).toHaveBeenCalledWith(updated[0])
    hook.unmount()
    hook.handleClick.mockClear()
    expect(press('Enter').defaultPrevented).toBe(false)
    expect(hook.handleClick).not.toHaveBeenCalled()
  })
})
