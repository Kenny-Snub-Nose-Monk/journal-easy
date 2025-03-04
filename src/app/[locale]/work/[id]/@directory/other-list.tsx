'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronRight, FileInput, X as XIcon } from 'lucide-react'
import { useDocsStore } from '@/stores/docs-store'
import { SHARE_DOC_LIST_KEY, LAST_DOC_ID_KEY } from '@/constants'
import scrollIntoView from 'scroll-into-view-if-needed'
import { nav } from './util'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export default function OtherList() {
  const otherDocs = useDocsStore((s) => s.otherDocs)
  const setOtherDocs = useDocsStore((s) => s.setOtherDocs)
  const [showList, setShowList] = useState(true)
  const t = useTranslations('othersDocs')

  useEffect(() => {
    const otherDocsFroStorage = JSON.parse(
      localStorage.getItem(SHARE_DOC_LIST_KEY) || '[]'
    )
    setOtherDocs(otherDocsFroStorage)
  }, [setOtherDocs])

  function toggleShowList() {
    setShowList(!showList)
  }

  if (otherDocs.length === 0) return null

  return (
    <>
      <h3 className="px-1 my-2 text-sm font-bold flex items-center">
        <div
          className="cursor-pointer hover:bg-active rounded-full"
          onClick={toggleShowList}
        >
          {showList && <ChevronDown className="h-4 w-4 mr-1" />}
          {!showList && <ChevronRight className="h-4 w-4 mr-1" />}
        </div>
        <span>{t('title')}</span>
      </h3>
      {showList &&
        otherDocs.map((doc) => (
          <OtherDocItem key={doc.id} id={doc.id} title={doc.title} />
        ))}
    </>
  )
}

function OtherDocItem(props: { id: string; title: string }) {
  const { id, title } = props
  const curDocId = useDocsStore((s) => s.curDocId)
  const removeOtherDoc = useDocsStore((s) => s.removeOtherDoc)
  const isCurrent = id === curDocId
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('othersDocs')

  // 滾動到當前標題
  useEffect(() => {
    if (!isCurrent) return
    if (titleContainerRef.current == null) return
    scrollIntoView(titleContainerRef.current!, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
    })
  }, [isCurrent])

  // 點擊標題
  function onClickTitle() {
    if (isCurrent) return
    nav(id)
  }

  // 移除文檔
  function onRemove(id: string) {
    const confirmText = t('deleteConfirm')
    const c = confirm(confirmText)
    if (!c) return
    removeOtherDoc(id)

    if (isCurrent) {
      const lastDocId = localStorage.getItem(LAST_DOC_ID_KEY)
      lastDocId && nav(lastDocId)
    }
  }

  return (
    <div
      ref={titleContainerRef}
      className={cn(
        'text-sm flex justify-between items-center w-full hover:text-secondary-foreground hover:bg-active rounded-sm group mb-0.5 px-1',
        isCurrent && 'text-secondary-foreground font-bold bg-active rounded-sm'
      )}
    >
      <div
        onClick={onClickTitle}
        className="cursor-pointer flex-auto overflow-hidden py-1.5 px-0.5 ml-2 flex items-center"
      >
        <FileInput className="h-4 w-4 mr-1" />
        <span className="truncate flex-auto">{title || t('unTitled')}</span>
      </div>

      {/* 移除 */}
      <div
        onClick={() => onRemove(id)}
        className="cursor-pointer rounded-full p-1 hover:bg-active invisible group-hover:visible"
      >
        <XIcon className="h-4 w-4" />
      </div>
    </div>
  )
}
