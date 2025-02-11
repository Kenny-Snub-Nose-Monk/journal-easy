'use client'

import { Editor } from '@tiptap/react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { Sparkles, CornerDownLeft, LoaderCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CONTENT_WIDTH, EVENT_KEY_FOCUS_AI } from '@/constants'
import emitter from '@/lib/emitter'

import { send } from './api'
import { cn } from '@/lib/utils'
import {
  MessagesType,
  genSystemMessage,
  genSelectedContentMessages,
} from './messages'
import {
  MenusWhenSelectionIsEmpty,
  MenusWhenSelectionIsNotEmpty,
} from './menus'
import ContinueMenu from './menus/continue-menu'
import BrainStormMenu from './menus/brain-storm-menu'
import OutlineMenu from './menus/outline-menu'
import SummaryMenu from './menus/summary-menu'
import ResultPanel from './result-panel'
import MakeLongerMenu from './menus/make-longer-menu'
import MakeShorterMenu from './menus/make-shorter-menu'
import FixSyntaxMenu from './menus/fix-syntax-menu'
import ChangeToneMenu from './menus/change-tone-menu'
import TranslateMenu from './menus/translate-menu'
import ExplainMenu from './menus/explain-menu'

export default function AIIsland(props: { editor: Editor | null }) {
  const { editor } = props
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocus, setIsFocus] = useState(false)

  const [instruction, setInstruction] = useState('')
  const [isSelectionEmpty, setIsSelectionEmpty] = useState(true)
  const [AIResult, setAIResult] = useState('')

  function genMessages(instruction: string): MessagesType {
    let messages: MessagesType = []
    if (!instruction.trim()) return messages
    if (editor == null) return messages
    // system message
    messages.push(genSystemMessage())

    // selected content message
    if (!isSelectionEmpty) {
      messages = messages.concat(genSelectedContentMessages(editor))
    }

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
    setAIResult('')
    inputRef.current?.blur()
    // 發送 AI 請求
    send(
      messages,
      // 請求中，獲取 AI 結果
      (content: string) => {
        if (!content) return
        if (isSelectionEmpty) {
          // 未選中內容，直接插入到編輯器中
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
        } else {
          // 有選中內容，則另外顯示
          setAIResult((r) => r + content)
        }
      },
      // 請求完成
      (done: boolean) => {
        setLoading(false)
        if (isSelectionEmpty) {
          setInstruction('')
          if (done) editor?.commands.enter()
          editor?.commands.focus()
        }
      }
    )
  }

  // 監聽 input focus blur
  useEffect(() => {
    if (!inputRef.current) return

    function handleFocus() {
      setIsFocus(true)

      setAIResult('')
      // 判斷是否有選中內容
      if (editor == null) return
      const { empty } = editor.state.selection
      setIsSelectionEmpty(empty)
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

  // 監聽編輯器 text-menu 中 Ask AI 菜單按鈕
  useEffect(() => {
    function fn() {
      if (isFocus) return
      inputRef.current?.focus()
    }
    emitter.on(EVENT_KEY_FOCUS_AI, fn)
    return () => emitter.off(EVENT_KEY_FOCUS_AI, fn) // 及時清除自定義事件
  }, [inputRef, isFocus])
  // placeholder
  const placeholder = useMemo(() => {
    if (!isFocus) return '使用 AI 寫作'
    if (isSelectionEmpty) return '輸入 AI 指令，如：根據標題寫大綱'
    else return '針對選中內容，輸入 AI 指令，如：擴展一下這段內容'
  }, [isFocus, isSelectionEmpty])
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
      {/* 顯示 AI 輸出結果 （當有選中內容時，不直接插入到編輯器） */}
      {AIResult && (
        <ResultPanel
          editor={editor}
          loading={loading}
          result={AIResult}
          setResult={setAIResult}
          setInstruction={setInstruction}
        />
      )}
      {/* AI 菜單，isSelectionEmpty 時顯示 （當有選中內容時，不顯示 AI 菜單） */}
      {isFocus && !loading && isSelectionEmpty && !AIResult && (
        <MenusWhenSelectionIsEmpty
          editor={editor}
          onRequestAI={requestAI}
          setInstruction={setInstruction}
        />
      )}
      {/* AI 菜單，isSelectionEmpty === false 時 */}
      {isFocus && !loading && !isSelectionEmpty && !AIResult && (
        <MenusWhenSelectionIsNotEmpty
          editor={editor}
          onRequestAI={requestAI}
          setInstruction={setInstruction}
        />
      )}
      {/* AI 指令輸入框 */}
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
            placeholder={placeholder}
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
