'use client'

import Link from 'next/link'
import {
  FileText,
  Ellipsis,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { del } from './action'
import emitter from '@/lib/emitter'
import scrollIntoView from 'scroll-into-view-if-needed'
import { isShowChildren, nav } from './util'

// 儲存修改過的標題的
const changedTitleObj: { [key: string]: string } = {} // { id, changedTitle }
// 獲取標題
function getTitle(id: string, curTitle: string) {
  let res = '<無標題>'
  if (curTitle) res = curTitle
  const changedTitle = changedTitleObj[id]
  if (changedTitle) res = changedTitle // 如果有 changedTitle ，則用這個
  return res
}

interface IProps {
  id: string
  title: string
  paramId: string
  list: Array<{ id: string; title: string; parentId: string | null }>
}

export default function Item(props: IProps) {
  const { id, title, list = [], paramId } = props
  const isCurrent = id === paramId

  const titleSpanRef = useRef<HTMLSpanElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)

  const children = list.filter((i) => i.parentId === id)
  const hasChildren = children.length > 0
  const [showChildren, setShowChildren] = useState(
    hasChildren ? isShowChildren(id, paramId, list) : false
  )
  function toggleShowChildren(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation
    setShowChildren(!showChildren)
  }

  // 修改標題時觸發事件
  useEffect(() => {
    const eventKey = `CHANGE_DOC_TITLE_${id}`

    function handler(payload: any) {
      const newTitle = payload as string
      changedTitleObj[id] = newTitle // 記錄下
      if (titleSpanRef.current) {
        titleSpanRef.current!.textContent = newTitle // 修改 DOM
      }
    }

    emitter.on(eventKey, handler)
    return () => {
      emitter.off(eventKey, handler) // 及時清理自定義事件
    }
  }, [id])

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

  return (
    <div>
      <div
        ref={titleContainerRef}
        className={cn(
          'flex justify-between items-center w-full hover:text-secondary-foreground group',
          isCurrent && 'text-secondary-foreground'
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
          <span ref={titleSpanRef} className="truncate flex-auto">
            {getTitle(id, title)}
          </span>
        </div>

        {/* 操作按鈕 */}
        <div className="inline-flex items-center invisible group-hover:visible ml-1 w-6 pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer rounded-full p-1 hover:bg-background">
                <Ellipsis className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={() => del(id)}
              >
                <Trash2 className="h-4 w-4" />
                &nbsp;刪除
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>其他操作</DropdownMenuItem>
              <DropdownMenuItem>其他操作</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 創建文檔 */}
        <div className="cursor-pointer rounded-full p-1 hover:bg-background invisible group-hover:visible">
          <Plus className="h-4 w-4" />
        </div>
      </div>

      {/* children */}
      {hasChildren && showChildren && (
        <div className="ml-3">
          {children.map((doc) => {
            const { id, title } = doc
            return (
              <Item
                key={id}
                id={id}
                title={title}
                paramId={paramId}
                list={list}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
