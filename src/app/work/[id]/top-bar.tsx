'use client'
import { useState, useEffect, useCallback } from 'react'
import Logo from '@/components/Logo'
import ChangeTheme from '@/components/change-theme'
import { Button } from '@/components/ui/button'
import { Forward, Star, Check, PencilLine } from 'lucide-react'
import DocHandlers from '@/components/doc-handlers'
import emitter from '@/lib/emitter'
import {
  EVENT_KEY_NAV_DOC,
  EVENT_KEY_CHANGE_UPDATING,
  EVENT_KEY_CHANGE_IS_STAR,
} from '@/constants'
import { updateIsStar } from './(content)/client-action'

interface IProps {
  defaultId: string
}
export default function TopBar(props: IProps) {
  const { defaultId } = props

  // 目前 id
  const [id, setId] = useState(defaultId)

  useEffect(() => {
    function handler(payload: any) {
      const { id } = payload || {}
      if (!id) return
      setId(id)
    }
    emitter.on(EVENT_KEY_NAV_DOC, handler)
    return () => {
      emitter.off(EVENT_KEY_NAV_DOC, handler) // 及時銷毀自定義事件
    }
  }, [])

  // 更新狀態 “修改中” 或 “已更新”
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    function handler(payload: any) {
      const { updating = false } = payload
      setUpdating(updating)
    }
    emitter.on(EVENT_KEY_CHANGE_UPDATING, handler)
    return () => {
      emitter.off(EVENT_KEY_CHANGE_UPDATING, handler) // 及时銷毀自定義事件
    }
  }, [])

  // 監聽 isStar 狀態
  const [isStar, setIsStar] = useState(false)

  useEffect(() => {
    function handler(payload: any) {
      const { isStar = false } = payload
      setIsStar(isStar)
    }
    emitter.on(EVENT_KEY_CHANGE_IS_STAR, handler)
    return () => emitter.off(EVENT_KEY_CHANGE_IS_STAR, handler) // 及時銷毀自定義事件
  }, [])

  // isStar 更新數據庫
  const handleUpdateIsStar = useCallback(async () => {
    const newIsStar = !isStar
    setUpdating(true)
    await updateIsStar(id, newIsStar)
    setIsStar(newIsStar)
    setUpdating(false)
  }, [isStar, id])

  return (
    <div className="flex text-secondary-foreground my-1 mx-3 bg-ground pb-1 border-b">
      <div className="text-start inline-flex items-center">
        <Logo />
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
      </div>
      <div className="flex-1 text-end">
        {/* 後續再拆分組件 */}
        <div className="inline-flex items-center">
          {/* <Button variant="ghost" size="sm">
            <Forward className="h-4 w-4" />
            &nbsp;分享
          </Button> */}
          <Button
            variant={isStar ? 'secondary' : 'ghost'}
            size="sm"
            onClick={handleUpdateIsStar}
          >
            <Star className="h-4 w-4 mr-1" />
            {isStar ? '已收藏' : '收藏'}
          </Button>
          <DocHandlers
            id={id}
            triggerButtonClassName="px-3 h-9 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md"
          />
          <ChangeTheme />
        </div>
      </div>
    </div>
  )
}
