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
interface IProps {
  id: string
}
export default function ItemHandlers(props: IProps) {
  const { id } = props
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer rounded-full p-1 hover:bg-background">
          <Ellipsis className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="p-0">
          <DocDeleteButton id={id} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>其他操作</DropdownMenuItem>
        <DropdownMenuItem>其他操作</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
