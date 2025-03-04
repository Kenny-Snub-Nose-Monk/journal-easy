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
import BackToTop from '@/components/back-to-top'
import { useDocsStore } from '@/stores/docs-store'
import { useTranslations } from 'next-intl'

export default function ContentForMyDoc() {
  const docs = useDocsStore((s) => s.docs)
  const id = useDocsStore((s) => s.curDocId)
  const curDoc = useMemo(() => docs.find((d) => d.id === id), [docs, id])
  const { title = '' } = curDoc || {}
  const t = useTranslations('docItem')
  const updateDocTitle = useDocsStore((s) => s.updateDocTitle)

  // record last doc id
  useEffect(() => {
    localStorage.setItem(LAST_DOC_ID_KEY, id) // 保存最後一次打開的文檔 id
  }, [id])

  const [renderEditor, setRenderEditor] = useState(false)
  useEffect(() => {
    setRenderEditor(false)
    setTimeout(() => {
      setRenderEditor(true) // when doc changed, force re-render editor
    }, 100)
  }, [id])

  const contentContainerRef = useRef(null)

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
        <TitleInput id={id} title={title} updateDocTitle={updateDocTitle} />
        {/* 可能還會再增加其他功能，例如設置 Icon 、背景等 */}
      </div>
      <BackToTop target={contentContainerRef} />
      {renderEditor && <TiptapEditor id={id} />}
      {/* <p className="mx-10">editor {id}</p> */}
    </div>
  )
}

function TitleInput(props: {
  id: string
  title: string
  updateDocTitle: (id: string, title: string) => void
}) {
  const { id, title, updateDocTitle } = props
  const t = useTranslations('docItem')

  useEffect(() => {
    document.title = title || t('unTitled')
  }, [title, t])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    updateDocTitle(id, newTitle)
    updateTitle(id, newTitle || t('unTitled')) // 更新數據庫
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code !== 'Enter') return
    const pos = (e.target as HTMLInputElement).selectionStart || 0 // cursor position
    if (pos < title.length) return
    emitter.emit(EVENT_KEY_FOCUS_CONTENT)
  }

  return (
    <Input
      id={DOC_TITLE_INPUT_ID}
      placeholder={t('titleInputPlaceholder')}
      value={title}
      maxLength={100}
      onChange={handleChange}
      className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
      onKeyUp={handleKeyUp}
    />
  )
}
