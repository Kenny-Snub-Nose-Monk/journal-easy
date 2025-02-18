import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { updateIsStar } from '@/app/work/[id]/(content)/client-action'
import emitter from '@/lib/emitter'
import { EVENT_KEY_CHANGE_IS_STAR } from '@/constants'
interface IProps {
  id: string
  defaultIsStar?: boolean
  disabled?: boolean
  className?: string
}
export default function StarDocButton(props: IProps) {
  const { id, defaultIsStar = false, className = '', disabled = false } = props
  const { toast } = useToast()

  // 監聽 isStar 狀態
  const [isStar, setIsStar] = useState(defaultIsStar)

  useEffect(() => {
    function handler(payload: any) {
      const { isStar = false, id: docId = '' } = payload
      if (docId === id) setIsStar(isStar)
    }
    emitter.on(EVENT_KEY_CHANGE_IS_STAR, handler)
    return () => emitter.off(EVENT_KEY_CHANGE_IS_STAR, handler) // 及時銷毀自定義事件
  }, [id])

  async function handleUpdateIsStar() {
    const newIsStar = !isStar
    const res = await updateIsStar(id, newIsStar)
    if (res.errno !== 0) {
      toast({
        variant: 'destructive',
        title: '錯誤',
        description: res.msg,
      })
      return
    }
    emitter.emit(EVENT_KEY_CHANGE_IS_STAR, { isStar: newIsStar, id })
  }
  return (
    <Button
      variant={isStar ? 'secondary' : 'ghost'}
      size="sm"
      onClick={handleUpdateIsStar}
      className={cn('focus-visible:ring-transparent', className)}
      disabled={disabled}
    >
      <Star className="h-4 w-4 mr-1" />
      {isStar ? '已收藏' : '收藏'}
    </Button>
  )
}
