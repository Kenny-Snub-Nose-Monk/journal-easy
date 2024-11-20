import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import emitter from '@/lib/emitter'
import { EVENT_KEY_DEL_DOC } from '@/constants'
interface IProps {
  id: string
  className?: string
}
export default function DocDeleteButton(props: IProps) {
  const { id, className = '' } = props
  // 刪除文檔
  function delDocHandler(id: string) {
    emitter.emit(EVENT_KEY_DEL_DOC, { id })
  }
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start p-2 h-8 text-destructive', className)}
      onClick={() => delDocHandler(id)}
    >
      <Trash2 className="h-4 w-4 mr-1" />
      刪除
    </Button>
  )
}
