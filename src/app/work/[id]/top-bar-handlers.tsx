'use client'
import { Ellipsis } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DuplicateDocButton from '@/components/duplicate-doc-button'
import DocDeleteButton from '@/components/delete-doc-button'
import MoveDocButton from '@/components/move-doc-button'

interface IProps {
  id: string
}
export default function TopBarHandlers(props: IProps) {
  const { id } = props
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-28 p-1">
        <DuplicateDocButton id={id} />
        <MoveDocButton id={id} />
        <Separator className="my-1" />
        <DocDeleteButton id={id} />
      </PopoverContent>
    </Popover>
  )
}
