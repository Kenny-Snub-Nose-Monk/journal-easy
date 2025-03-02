'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import TiptapEditor from '@/components/editor'
import { updateTitle } from '../client-action'
import emitter from '@/lib/emitter'
import {
  CONTENT_WIDTH,
  DOC_TITLE_INPUT_ID,
  LAST_DOC_ID_KEY,
  EVENT_KEY_FOCUS_CONTENT,
} from '@/constants'
import { useKeyPress } from 'ahooks'
import BackToTop from '@/components/back-to-top'
import { useDocsStore } from '@/stores/docs-store'

export default function ContentForMyDoc() {
  const docs = useDocsStore((s) => s.docs)
  const id = useDocsStore((s) => s.curDocId)
  const curDoc = useMemo(() => docs.find((d) => d.id === id), [docs, id])
  const { title } = curDoc || {}
  const updateDocTitle = useDocsStore((s) => s.updateDocTitle)

  // record last doc id
  useEffect(() => {
    localStorage.setItem(LAST_DOC_ID_KEY, id) // 保存最後一次打開的文檔 id
  }, [id])

  // 標題
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    updateDocTitle(id, newTitle)
    updateTitle(id, newTitle || '<無標題>') // 更新數據庫
  }

  useEffect(() => {
    document.title = title || '<無標題>'
  }, [title])

  const [renderEditor, setRenderEditor] = useState(false)
  useEffect(() => {
    setRenderEditor(false)
    setTimeout(() => {
      setRenderEditor(true) // when doc changed, force re-render editor
    }, 100)
  }, [id])

  const contentContainerRef = useRef(null)

  const titleInputRef = useRef<HTMLInputElement>(null)

  // 標題輸入框聚焦狀態
  const [isTitleInputFocus, setIsTitleInputFocus] = useState(false)
  // 監聽回車鍵
  useKeyPress('Enter', (e: KeyboardEvent) => {
    // 標題輸入框沒有聚焦，則不執行後面邏輯
    if (!isTitleInputFocus) return

    // 標題輸入框中光標的位置
    const pos = (e.target as HTMLInputElement).selectionStart || 0
    // 光標前的標題，需要留下
    const titleBeforePos = title?.slice(0, pos)
    // 使用光標前的標題，更新標題狀態
    updateDocTitle(id, titleBeforePos || '')
    // 使用光標前的標題，更新數據庫和左側列表的文章標題
    // updateDocTitle(titleBeforePos)

    // 光標後的標題，需要進入到編輯器的內容區域
    const titleAfterPos = title?.slice(pos)

    // 派發聚焦到編輯器內容區域的自定義事件
    emitter.emit(EVENT_KEY_FOCUS_CONTENT, { titleAfterPos })
  })

  const fullWidth = CONTENT_WIDTH + 80 // 兩邊留白 40px

  if (!curDoc) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Error: curDoc is null.</p>
      </div>
    )
  }

  return (
    <div
      className={`mx-auto my-8 mb-20 scroll-mt-5`}
      style={{ width: `${fullWidth}px` }}
      ref={contentContainerRef}
    >
      <div className="mx-10 mb-6">
        <Input
          id={DOC_TITLE_INPUT_ID}
          placeholder="請輸入標題..."
          value={title}
          maxLength={100}
          onChange={handleChange}
          className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
          ref={titleInputRef}
          onFocus={() => setIsTitleInputFocus(true)}
          onBlur={() => setIsTitleInputFocus(false)}
        />
        {/* 可能還會再增加其他功能，例如設置 Icon 、背景等 */}
      </div>
      <BackToTop target={contentContainerRef} />
      {renderEditor && <TiptapEditor id={id} />}
      {/* <p className="mx-10">editor {id}</p> */}
    </div>
  )
}
