'use client'

import { useState, useEffect } from 'react'
import { Ellipsis } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import ChangeTheme from '@/components/change-theme'
import emitter from '@/lib/emitter'
import { EVENT_KEY_NAV_DOC, EVENT_KEY_CHANGE_DOC_USER_ID } from '@/constants'
import ShareDocButton from '@/components/share-doc-button'
import StarDocButton from '@/components/star-doc-button'
import DocUpdateStatus from '@/components/doc-update-status'
import { Separator } from '@/components/ui/separator'
import DocDeleteButton from '@/components/delete-doc-button'
import DuplicateDocButton from '@/components/duplicate-doc-button'
import MoveDocButton from '@/components/move-doc-button'

interface IUser {
  id?: string
  name?: string | null
  image?: string | null
  email?: string | null
}

interface IProps {
  defaultId: string
  user: IUser
}

export default function TopBar(props: IProps) {
  const { defaultId, user } = props

  // 當前 id
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

  // doc user id
  const [docUserId, setDocUserId] = useState('')

  useEffect(() => {
    function handler(payload: any) {
      const { docUserId = '', id: docId } = payload || {}
      if (docId !== id) return
      setDocUserId(docUserId)
    }
    emitter.on(EVENT_KEY_CHANGE_DOC_USER_ID, handler)
  }, [docUserId, id])

  return (
    <div className="flex text-secondary-foreground my-1 mx-3 bg-ground pb-1">
      <div className="text-start inline-flex items-center">
        <Logo />
        <DocUpdateStatus id={id} />
      </div>
      <div className="flex-1 text-end">
        {/* 後續再拆分組件 */}
        <div className="inline-flex items-center">
          <ShareDocButton id={id} disabled={docUserId !== user.id} />
          <StarDocButton id={id} disabled={docUserId !== user.id} />
          <TopBarHandlers id={id} disabled={docUserId !== user.id} />
          <ChangeTheme />
        </div>
      </div>
    </div>
  )
}

function TopBarHandlers(props: { id: string; disabled?: boolean }) {
  const { id, disabled = false } = props

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mx-2"
          disabled={disabled}
        >
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
