'use client'

import { Editor } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  MoveUpRight,
  SquareArrowUp,
  LoaderCircle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CONTENT_WIDTH } from '@/constants' // 在這裏獲取內容寬度，不要直接使用數字

import { send } from './api'
import { cn } from '@/lib/utils'
import emitter from '@/lib/emitter'

export default function AIIsland(props: { editor: Editor | null }) {
  const { editor } = props
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocus, setIsFocus] = useState(false)

  const [instruction, setInstruction] = useState('')

  function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { key } = event
    if (key === 'Enter') {
      requestAI()
    }
    if (key === 'Escape') {
      inputRef.current?.blur()
      editor?.commands.focus()
    }
    if (key === 'Backspace' && !instruction) {
      inputRef.current?.blur()
      editor?.commands.focus()
    }
  }

  function requestAI() {
    if (loading) return
    setLoading(true)
    inputRef.current?.blur()
    send(
      instruction,
      (content: string) => {
        editor?.commands.insertContent(content)
      },
      (done: boolean) => {
        setLoading(false)
        setInstruction('')
        if (done) editor?.commands.enter()
        editor?.commands.focus()
      }
    )
  }

  // 監聽 input focus blur
  useEffect(() => {
    if (!inputRef.current) return
    function handleFocus() {
      setIsFocus(true)
    }
    function handleBlur() {
      setIsFocus(false)
    }
    inputRef.current.addEventListener('focus', handleFocus)
    inputRef.current.addEventListener('blur', handleBlur)
    return () => {
      if (!inputRef.current) return
      inputRef.current.removeEventListener('focus', handleFocus)
      inputRef.current.removeEventListener('blur', handleBlur)
    }
  }, [inputRef, editor])

  // 監聽空格輸入，focus AI island
  useEffect(() => {
    if (editor == null) return
    function fn(event: KeyboardEvent) {
      if (event.key !== ' ' && event.code !== 'Tab') return
      if (editor == null) return
      const selection = editor.state.selection
      if (!selection.empty) return
      const node = selection.$anchor.node()
      if (node && node.isTextblock && node.textContent.trim() === '') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    editor.view.dom.addEventListener('keydown', fn)
    return () => editor.view.dom.removeEventListener('keydown', fn)
  }, [editor])
  if (!editor) return null

  return (
    <div
      className="absolute bottom-0 bg-background"
      style={{
        width: `${CONTENT_WIDTH}px`,
        marginLeft: `-${CONTENT_WIDTH / 2}px`,
        left: '50%',
      }}
    >
      {isFocus && !loading && (
        <div className="ml-11">
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            續寫
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            頭腦風暴
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            寫大綱
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            總結
            <MoveUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 hover:bg-inherit hover:text-muted-foreground"
          >
            更多...
          </Button>
        </div>
      )}
      <div
        className={cn(
          'rounded-2xl p-2 pl-4 border shadow flex items-center justify-start',
          isFocus && 'border-primary'
        )}
      >
        <Sparkles
          size={24}
          className={cn(
            isFocus ? '' : 'opacity-50',
            loading && 'animate-pulse'
          )}
        />
        <div className="flex-auto flex items-center justify-start">
          <Input
            placeholder="請輸入 AI 指令，如：根據標題寫大綱"
            value={instruction}
            maxLength={300}
            disabled={loading}
            ref={inputRef}
            onKeyDown={handleKeydown}
            onChange={(e) => setInstruction(e.target.value)}
            className="text-base bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-inherit hover:text-muted-foreground"
            onClick={requestAI}
            disabled={!instruction}
          >
            {!loading && <SquareArrowUp size={24} />}
            {loading && <LoaderCircle size={24} className="animate-spin" />}
          </Button>
        </div>
      </div>
      <p className="text-sm text-center my-1 text-muted-foreground opacity-50">
        注意，AI 可能會生成錯誤信息，請自行檢查判斷
      </p>
    </div>
  )
}
