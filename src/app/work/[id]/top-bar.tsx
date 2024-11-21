'use client'
import { useState, useEffect, useCallback } from 'react'
import Logo from '@/components/Logo'
import ChangeTheme from '@/components/change-theme'
import { Forward, Check, PencilLine } from 'lucide-react'
import TopBarHandlers from './top-bar-handlers'
import emitter from '@/lib/emitter'
import { EVENT_KEY_NAV_DOC } from '@/constants'
import StarDocButton from '@/components/star-doc-button'
import DocUpdateStatus from '@/components/doc-update-status'

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

  return (
    <div className="flex text-secondary-foreground my-1 mx-3 bg-ground pb-1 border-b">
      <div className="text-start inline-flex items-center">
        <Logo />
        <DocUpdateStatus id={id} />
      </div>
      <div className="flex-1 text-end">
        {/* 後續再拆分組件 */}
        <div className="inline-flex items-center">
          {/* <Button variant="ghost" size="sm">
            <Forward className="h-4 w-4" />
            &nbsp;分享
          </Button> */}
          <StarDocButton id={id} />
          <TopBarHandlers id={id} />
          <ChangeTheme />
        </div>
      </div>
    </div>
  )
}
