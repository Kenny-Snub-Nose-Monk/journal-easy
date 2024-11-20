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
export default function TopBarHandlers(props: IProps) {
  const { id } = props
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer px-3 h-9 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md">
          <Ellipsis className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="p-0">
          <DocDeleteButton id={id} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>其他操作1</DropdownMenuItem>
        <DropdownMenuItem>其他操作2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
