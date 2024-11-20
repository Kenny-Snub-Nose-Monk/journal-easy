import { useState, useEffect } from 'react'
import { Check, PencilLine } from 'lucide-react'
import emitter from '@/lib/emitter'
import { EVENT_KEY_CHANGE_UPDATING } from '@/constants'
interface IProps {
  id: string
}
export default function DocUpdateStatus(props: IProps) {
  const { id } = props
  // 更新狀態 “修改中” 或 “已更新”
  const [updating, setUpdating] = useState(false)
  useEffect(() => {
    function handler(payload: any) {
      const { updating = false, id: docId = '' } = payload
      if (docId === id) setUpdating(updating)
    }
    emitter.on(EVENT_KEY_CHANGE_UPDATING, handler)
    return () => {
      emitter.off(EVENT_KEY_CHANGE_UPDATING, handler) // 及時銷毀自定義事件
    }
  }, [id])
  return (
    <span className="text-muted-foreground text-sm ml-3 inline-flex items-center">
      {updating && (
        <>
          <PencilLine className="w-4 h-4 mr-1" />
          修改中...
        </>
      )}
      {!updating && (
        <>
          <Check className="w-4 h-4 mr-1" />
          已更新
        </>
      )}
    </span>
  )
}
