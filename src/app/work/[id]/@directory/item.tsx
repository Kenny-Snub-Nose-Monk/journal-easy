'use client'

import { FileText, ChevronDown, ChevronRight, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import emitter from '@/lib/emitter'
import scrollIntoView from 'scroll-into-view-if-needed'
import { isDescendant, nav } from './util'
import { IDoc } from './type'
import { EVENT_KEY_CHANGE_DOC_TITLE, EVENT_KEY_CREATE_DOC } from '@/constants'
import ItemHandlers from './item-handlers'

interface IProps {
  id: string
  defaultTitle: string
  isStar: boolean
  paramId: string
  list: IDoc[]
}

export default function Item(props: IProps) {
  const { id, defaultTitle, list = [], paramId, isStar } = props
  const isCurrent = id === paramId

  const titleContainerRef = useRef<HTMLDivElement>(null)

  const children = list.filter((i) => i.parentId === id)
  const hasChildren = children.length > 0
  const [showChildren, setShowChildren] = useState(
    hasChildren ? isDescendant(id, paramId, list) : false
  )
  function toggleShowChildren(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation
    setShowChildren(!showChildren)
  }

  // 修改標題時觸發事件
  const [title, setTitle] = useState(defaultTitle || '<無標題>')
  useEffect(() => {
    if (!isCurrent) return // 只監聽當前文檔

    function handler(payload: any) {
      let newTitle = payload as string
      if (!newTitle.trim()) newTitle = '<無標題>'
      setTitle(newTitle)
    }

    emitter.on(EVENT_KEY_CHANGE_DOC_TITLE, handler)
    return () => {
      emitter.off(EVENT_KEY_CHANGE_DOC_TITLE, handler) // 及時清理自定義事件
    }
  }, [isCurrent])

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
    emitter.emit(EVENT_KEY_CREATE_DOC, { parentId })
    setShowChildren(true)
  }

  return (
    <div>
      <div
        ref={titleContainerRef}
        className={cn(
          'text-sm flex justify-between items-center w-full hover:text-secondary-foreground group',
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
              <FileText className="h-4 w-4" />
            </div>
          )}
          <span className="truncate flex-auto">{title}</span>
        </div>

        {/* 操作按鈕 */}
        <div className="inline-flex items-center invisible group-hover:visible ml-1 w-6 pr-2">
          <ItemHandlers id={id} isStar={isStar} />
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
            const { id, title, isStar } = doc
            return (
              <Item
                key={id}
                id={id}
                defaultTitle={title}
                paramId={paramId}
                list={list}
                isStar={!!isStar}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
