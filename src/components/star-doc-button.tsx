import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { updateIsStar } from '@/app/work/[id]/(content)/client-action'
import emitter from '@/lib/emitter'
import { EVENT_KEY_CHANGE_IS_STAR } from '@/constants'
interface IProps {
  id: string
  defaultIsStar?: boolean
  className?: string
}
export default function StarDocButton(props: IProps) {
  const { id, defaultIsStar = false, className = '' } = props
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
  function handleUpdateIsStar() {
    const newIsStar = !isStar
    emitter.emit(EVENT_KEY_CHANGE_IS_STAR, { isStar: newIsStar, id }) // 廣播事件
    // 異步更新數據庫
    updateIsStar(id, newIsStar)
  }
  return (
    <Button
      variant={isStar ? 'secondary' : 'ghost'}
      size="sm"
      onClick={handleUpdateIsStar}
      className={cn(className)}
    >
      <Star className="h-4 w-4 mr-1" />
      {isStar ? '已收藏' : '收藏'}
    </Button>
  )
}
