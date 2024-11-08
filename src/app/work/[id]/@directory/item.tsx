'use client'

import Link from 'next/link'
import { FileText, Ellipsis, Trash2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
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
  isCurrent: boolean
}

export default function Item(props: IProps) {
  const { id, title, isCurrent } = props

  const titleSpanRef = useRef<HTMLSpanElement>(null)
  const titleContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 修改標題時觸發事件
    const eventKey = `CHANGE_DOC_TITLE_${id}`
    emitter.on(eventKey, (payload) => {
      const newTitle = payload as string
      changedTitleObj[id] = newTitle // 記錄下
      if (titleSpanRef.current) {
        titleSpanRef.current!.textContent = newTitle // 修改 DOM
      }
    })
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

  return (
    <div
      className={cn(
        'flex justify-between w-full hover:text-secondary-foreground group',
        isCurrent ? 'bg-card' : 'hover:bg-card'
      )}
      ref={titleContainerRef}
    >
      <Link
        href={`/work/${id}`}
        className="flex-auto overflow-hidden p-2 flex items-center"
      >
        <div className="w-4 mr-1">
          <FileText className="h-4 w-4" />
        </div>
        <span ref={titleSpanRef} className="truncate flex-auto">
          {getTitle(id, title)}
        </span>
      </Link>

      <div className="inline-flex items-center invisible group-hover:visible ml-1 w-6 pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis className="h-4 w-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer"
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
    </div>
  )
}
