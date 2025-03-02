'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useEditorStore, ICollabUser } from '@/stores/editor-store'

interface IProps {
  id: string
}
export default function DocUpdateStatus(props: IProps) {
  const { id } = props

  // 字符數量
  const characterCount = useEditorStore((s) => s.characterCount)

  const editorDocId = useEditorStore((s) => s.docId)

  // collaborative state
  const collaborativeState = useEditorStore((s) => s.collaborativeState)
  // collaborative users
  const collaborativeUsers = useEditorStore((s) => s.collaborativeUsers)

  if (id !== editorDocId) return null

  return (
    <>
      {/* collaborative users */}
      <div className="ml-5 flex">
        {collaborativeUsers.map((user: ICollabUser) => {
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
