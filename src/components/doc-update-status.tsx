'use client'

import { useState, useEffect } from 'react'
import { Check, PencilLine } from 'lucide-react'
import emitter from '@/lib/emitter'
import {
  EVENT_KEY_CHANGE_UPDATING,
  EVENT_KEY_CHANGE_CHAR_COUNT,
} from '@/constants'
import debounce from 'lodash.debounce'

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

  // 字符數量
  const [characterCount, setCharacterCount] = useState(-1)
  useEffect(() => {
    const handler = debounce((payload: any) => {
      const { count = 0, id: docId = '' } = payload
      if (docId === id) setCharacterCount(count)
    }, 300)
    emitter.on(EVENT_KEY_CHANGE_CHAR_COUNT, handler)
    return () => {
      emitter.off(EVENT_KEY_CHANGE_CHAR_COUNT, handler) // 及時銷毀自定義事件
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
          已保存，共 {characterCount >= 0 ? characterCount : '---'} 字
        </>
      )}
    </span>
  )
}
