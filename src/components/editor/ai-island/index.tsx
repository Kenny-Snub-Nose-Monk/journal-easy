'use client'

import { Editor } from '@tiptap/react'
import { useState, useRef, useEffect, useCallback } from 'react'
import throttle from 'lodash/throttle'
import { CONTENT_WIDTH, EVENT_KEY_FOCUS_AI } from '@/constants'
import emitter from '@/lib/emitter'

import { send } from './api'
import { MessagesType } from './messages'
import {
  MenusWhenSelectionIsEmpty,
  MenusWhenSelectionIsNotEmpty,
} from './menus'
import ResultPanel from './result-panel'
import CustomInput from './custom-input'

export default function AIIsland(props: { editor: Editor | null }) {
  const { editor } = props
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocus, setIsFocus] = useState(false)

  const [instruction, setInstruction] = useState('')
  const [isSelectionEmpty, setIsSelectionEmpty] = useState(true)
  const [AIResult, setAIResult] = useState('')

  // eslint-disable-next-line
  const editorScrollIntoView = useCallback(
    throttle(() => editor?.commands.scrollIntoView(), 500),
    [editor]
  )

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
            editorScrollIntoView()
            return
          }
          // 有換行符，則需要考慮換行
          const arr = content.split('\n')
          arr.forEach((c, index) => {
            if (c) {
              editor?.commands.insertContent(c)
              editorScrollIntoView()
            }
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
      <CustomInput
        ref={inputRef}
        isFocus={isFocus}
        loading={loading}
        editor={editor}
        isSelectionEmpty={isSelectionEmpty}
        onRequestAI={requestAI}
        instruction={instruction}
        setInstruction={setInstruction}
      />
      <p className="text-sm text-center my-1 text-muted-foreground opacity-50">
        注意，AI 可能會生成錯誤信息，請自行檢查判斷
      </p>
    </div>
  )
}
