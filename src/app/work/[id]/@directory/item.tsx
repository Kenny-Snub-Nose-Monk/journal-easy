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

  return (
    <div
      className={cn(
        'flex justify-between w-full p-2 cursor-pointer hover:text-secondary-foreground group',
        isCurrent ? 'bg-card' : 'hover:bg-card'
      )}
    >
      <Link href={`/work/${id}`} className="inline-flex items-center">
        <FileText className="h-4 w-4" />
        <span ref={titleSpanRef}>{getTitle(id, title)}</span>
      </Link>

      <div className="inline-flex items-center invisible group-hover:visible">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Ellipsis className="h-4 w-4" />
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
