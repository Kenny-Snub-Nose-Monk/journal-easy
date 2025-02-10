'use client'

import { Editor } from '@tiptap/react'
import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  MoveUpRight,
  CornerDownLeft,
  LoaderCircle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CONTENT_WIDTH } from '@/constants' // 在這裏獲取內容寬度，不要直接使用數字

import { send } from './api'
import { cn } from '@/lib/utils'
import { MessagesType, genSystemMessage } from './messages'
import ContinueMenu from './menus/continue-menu'
import BrainStormMenu from './menus/brain-storm-menu'
import OutlineMenu from './menus/outline-menu'
import SummaryMenu from './menus/summary-menu'

export default function AIIsland(props: { editor: Editor | null }) {
  const { editor } = props
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocus, setIsFocus] = useState(false)

  const [instruction, setInstruction] = useState('')

  function genMessages(instruction: string): MessagesType {
    const messages: MessagesType = []
    if (!instruction.trim()) return messages
    // system message
    messages.push(genSystemMessage())
    // current message
    messages.push({ role: 'user', content: instruction })
    return messages
  }
  function handleClick() {
    const messages = genMessages(instruction)
    requestAI(messages)
  }

  function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
    const { key } = event
    if (key === 'Enter') {
      const messages = genMessages(instruction)
      requestAI(messages)
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

  function requestAI(messages: MessagesType) {
    if (loading) return
    setLoading(true)
    inputRef.current?.blur()
    send(
      messages,
      (content: string) => {
        if (!content) return
        if (content.indexOf('\n') < 0) {
          // 沒有換行符，直接插入內容
          editor?.commands.insertContent(content)
          return
        }
        // 有換行符，則需要考慮換行
        const arr = content.split('\n')
        arr.forEach((c, index) => {
          if (c) editor?.commands.insertContent(c)
          if (index < arr.length - 1) {
            editor?.commands.enter() // 換行
          }
        })
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
      setTimeout(() => setIsFocus(false), 150)
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
          <ContinueMenu
            editor={editor}
            onRequestAI={requestAI}
            setInstruction={setInstruction}
          />
          <BrainStormMenu
            editor={editor}
            onRequestAI={requestAI}
            setInstruction={setInstruction}
          />
          <OutlineMenu
            editor={editor}
            onRequestAI={requestAI}
            setInstruction={setInstruction}
          />
          <SummaryMenu
            editor={editor}
            onRequestAI={requestAI}
            setInstruction={setInstruction}
          />
        </div>
      )}
      <div
        className={cn(
          'rounded-2xl p-2 pl-4 border shadow flex items-center justify-start',
          isFocus && 'border-blue-600'
        )}
      >
        <Sparkles
          size={24}
          className={cn(
            isFocus ? 'text-blue-600' : 'opacity-50',
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
            className={cn(isFocus ? 'text-blue-600' : 'opacity-50')}
            onClick={handleClick}
            disabled={!instruction}
          >
            {!loading && <CornerDownLeft size={24} />}
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
