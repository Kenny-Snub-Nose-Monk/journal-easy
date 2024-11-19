'use client'
import { Ellipsis, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import emitter from '@/lib/emitter'
import { EVENT_KEY_DEL_DOC } from '@/constants'
interface IProps {
  id: string
  triggerButtonClassName?: string
}
export default function DocHandlers(props: IProps) {
  const { id, triggerButtonClassName = '' } = props
  // 刪除節點
  function delDocHandler(id: string) {
    emitter.emit(EVENT_KEY_DEL_DOC, { id })
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={cn('cursor-pointer', triggerButtonClassName)}>
          <Ellipsis className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={() => delDocHandler(id)}
        >
          <Trash2 className="h-4 w-4" />
          &nbsp;刪除
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>其他操作</DropdownMenuItem>
        <DropdownMenuItem>其他操作</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
