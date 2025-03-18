'use client'

import { File, FileOutput, ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import scrollIntoView from 'scroll-into-view-if-needed'
import { isDescendant, nav } from './util'
import { IDoc } from '@/stores/docs-store'
import useDocs from '../hooks/useDocs'
import ItemHandlers from './item-handlers'
import { useTranslations } from 'next-intl'

interface IProps {
  id: string
  title: string
  isStar: boolean
  sharePassword?: string | null
  curDocId: string
  docs: IDoc[]
  level?: number
}

export default function Item(props: IProps) {
  const { createDoc } = useDocs()
  const {
    id,
    title,
    docs = [],
    curDocId,
    isStar,
    sharePassword,
    level = 0,
  } = props
  const isCurrent = id === curDocId

  const titleContainerRef = useRef<HTMLDivElement>(null)

  const children = docs.filter((i) => i.parentId === id)
  const hasChildren = children.length > 0
  const [showChildren, setShowChildren] = useState(
    hasChildren ? isDescendant(id, curDocId, docs) : false
  )

  const t = useTranslations('docItem')

  function toggleShowChildren(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation
    setShowChildren(!showChildren)
  }

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

  // 新建子節點
  function createDocHandler(parentId: string | null) {
    createDoc({ parentId })
  }

  return (
    <div>
      <div
        ref={titleContainerRef}
        className={cn(
          'text-sm flex justify-between items-center w-full hover:text-secondary-foreground hover:bg-active rounded-sm group mb-0.5 px-1 pl-3',
          isCurrent && 'text-secondary-foreground font-bold'
        )}
      >
        {/* icon 顯示/隱藏 children */}
        {hasChildren && (
          <div
            className="cursor-pointer hover:bg-background rounded-full p-0.5"
            onClick={toggleShowChildren}
          >
            {showChildren && <ChevronDown className="h-4 w-4" />}
            {!showChildren && <ChevronRight className="h-4 w-4" />}
          </div>
        )}

        {/* 標題連結 */}
        <div
          onClick={onClickTitle}
          className="cursor-pointer flex-auto overflow-hidden py-1.5 px-0.5 flex items-center"
        >
          {!hasChildren && (
            <div className="w-4 mr-1">
              {!!sharePassword ? (
                <FileOutput className="h-4 w-4" />
              ) : (
                <File className="h-4 w-4" />
              )}
            </div>
          )}
          <span className="truncate flex-auto">{title || t('unTitled')}</span>
        </div>

        {/* 操作按鈕 */}
        <div className="inline-flex items-center invisible group-hover:visible ml-1 w-6 pr-2">
          <ItemHandlers id={id} />
        </div>

        {/* 創建文檔 */}
        <div
          onClick={() => createDocHandler(id)}
          className="cursor-pointer rounded-full p-1 hover:bg-background invisible group-hover:visible"
        >
          <Plus className="h-4 w-4" />
        </div>
      </div>

      {/* children */}
      {hasChildren && showChildren && (
        <div className="ml-3">
          {children.map((doc) => {
            const { id, title, isStar, sharePassword } = doc
            return (
              <Item
                key={id}
                id={id}
                title={title}
                curDocId={curDocId}
                docs={docs}
                isStar={!!isStar}
                sharePassword={sharePassword}
                level={level + 1}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
