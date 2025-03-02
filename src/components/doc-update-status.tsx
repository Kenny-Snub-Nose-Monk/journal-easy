'use client'

import { useState, useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import emitter from '@/lib/emitter'
import {
  EVENT_KEY_CHANGE_COLLAB_STATE,
  EVENT_KEY_CHANGE_COLLAB_USERS,
} from '@/constants'
import { cn } from '@/lib/utils'
import { useEditorStore } from '@/stores/editor-store'

interface IUserInfo {
  clientId: string
  name: string
  email: string
  avatar: string
}

interface IProps {
  id: string
}
export default function DocUpdateStatus(props: IProps) {
  const { id } = props

  // 字符數量
  const characterCount = useEditorStore((s) => s.characterCount)

  // collaborative state
  const [collaborativeState, setCollaborativeState] = useState('connecting')
  useEffect(() => {
    function handler(payload: any) {
      const { status = 'connecting', id: docId = '' } = payload
      if (docId === id) setCollaborativeState(status)
    }
    emitter.on(EVENT_KEY_CHANGE_COLLAB_STATE, handler)
    return () => {
      emitter.off(EVENT_KEY_CHANGE_COLLAB_STATE, handler) // 及时销毁自定义事件
    }
  }, [id])
  // collaborative users
  const [collaborativeUsers, setCollaborativeUsers] = useState<IUserInfo[]>([])
  useEffect(() => {
    function handler(payload: any) {
      const { users = [], id: docId = '' } = payload
      // console.log('users...', users.length, users)
      if (docId === id) setCollaborativeUsers(users)
    }
    emitter.on(EVENT_KEY_CHANGE_COLLAB_USERS, handler)
    return () => {
      emitter.off(EVENT_KEY_CHANGE_COLLAB_USERS, handler) // 及时销毁自定义事件
    }
  }, [id])

  return (
    <>
      {/* collaborative users */}
      <div className="ml-5 flex">
        {collaborativeUsers.map((user: IUserInfo) => {
          let { clientId, name, avatar, email } = user || {}
          if (!name) name = email
          if (!name) return null
          return (
            <TooltipProvider key={clientId}>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="h-7 w-7 border -ml-2">
                    <AvatarImage src={avatar || ''} alt={name || ''} />
                    <AvatarFallback>{name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
      {/* collaborative state */}
      <div className="ml-2 inline-flex items-center">
        <div
          className={cn('w-2 h-2 rounded-full', {
            'bg-yellow-500 dark:bg-yellow-400':
              collaborativeState === 'connecting',
            'bg-green-500 dark:bg-green-400':
              collaborativeState === 'connected',
            'bg-red-500 dark:bg-red-400': collaborativeState === 'disconnected',
          })}
        ></div>
        <span className="text-muted-foreground ml-1">{collaborativeState}</span>
      </div>
      <span className="text-muted-foreground text-sm ml-3 inline-flex items-center">
        共 {characterCount >= 0 ? characterCount : '---'} 字
      </span>
    </>
  )
}
