'use client'
import { Ellipsis } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DocDeleteButton from '@/components/delete-doc-button'
import StarDocButton from '@/components/star-doc-button'
import DuplicateDocButton from '@/components/duplicate-doc-button'

interface IProps {
  id: string
  isStar: boolean
}

export default function ItemHandlers(props: IProps) {
  const { id, isStar = false } = props
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer rounded-full p-1 hover:bg-background">
          <Ellipsis className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="p-0">
          <StarDocButton
            id={id}
            defaultIsStar={isStar}
            className="w-full justify-start h-8 px-2"
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <DuplicateDocButton id={id} />
        </DropdownMenuItem>
        <DropdownMenuItem>其他操作</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <DocDeleteButton id={id} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
