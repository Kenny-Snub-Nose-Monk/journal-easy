'use client'

import { useRef, useEffect, useCallback, useState, useMemo, use } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import { Skeleton } from '@/components/ui/skeleton'
import { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider'
import * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { extensions } from './extensions'
import ContentMenu from './menus/content-menu'
import TextMenu from './menus/text-menu'
import ColumnsMenu from './menus/columns-menu'
import LinkMenu from './menus/link-menu'
import ImageBlockMenu from './menus/image-block-menu'
import { TableRowMenu, TableColMenu } from './menus/table-menu'
import AIIsland from './ai-island'
import emitter from '@/lib/emitter'
import {
  EVENT_KEY_CHANGE_CHAR_COUNT,
  RIGHT_PANEL_DOM_ID,
  EDITOR_CHARACTER_LIMIT,
  COLLABORATE_EDIT_USER_COLORS,
  EVENT_KEY_CHANGE_COLLAB_STATE,
  EVENT_KEY_CHANGE_COLLAB_USERS,
} from '@/constants'
import { getRandomElement } from '@/lib/utils'
import { get } from '@/lib/ajax'
import { useToast } from '../ui/use-toast'
import throttle from 'lodash.throttle'

interface IUserInfo {
  name: string
  email: string
  avatar: string
}

interface IProps {
  id: string
  userInfo: IUserInfo
}

const limitToast = throttle(
  (toast) => {
    const { dismiss } = toast({
      variant: 'destructive',
      description: `文檔最多可輸入 ${EDITOR_CHARACTER_LIMIT} 字`,
    })
    setTimeout(dismiss, 5000)
  },
  3000,
  { leading: true, trailing: false }
)

const TiptapEditor = (props: IProps) => {
  const { id, userInfo } = props
  const { toast } = useToast()
  const menuContainerRef = useRef(null)

  // content loading
  const [contentLoading, setContentLoading] = useState(true)

  useEffect(() => setContentLoading(true), [id])

  // Yjs document and provider
  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url:
        process.env.NEXT_PUBLIC_COLLABORATE_EDIT_URL ||
        'wss://ws.journal-easy.com/collaborate/',
      name: id,
      document: ydoc,
      connect: false, // connect later
    })
  }, [id, ydoc])

  // connect and disconnect
  useEffect(() => {
    provider.connect()
    // if (!provider) return
    // if (!provider.isConnected) {

    // }
    return () => {
      provider.configuration.websocketProvider.disconnect() // https://github.com/ueberdosis/hocuspocus/issues/594#issuecomment-1740599461
      provider.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const editor = useEditor(
    {
      extensions: [
        ...extensions,
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            name: userInfo.name || userInfo.email,
            email: userInfo.email,
            avatar: userInfo.avatar,
            color: getRandomElement(COLLABORATE_EDIT_USER_COLORS), // random color
          },
        }),
      ],
      onCreate: ({ editor }) => {
        provider?.on('open', async () => {
          // console.log('editor provider open...')
          // Get doc content, and set content, when JSON convert to Yjs doc failed. We will remove this code after a long time (almost all docs have been converted).
          const { errno, data } = await get(`/api/doc/${id}`)
          if (errno !== 0) return
          // console.log('data....', data)
          const { contentBinary, content } = data
          if (contentBinary == null && content) {
            console.log('Notice: editor setContent by JSON format 1 ', id)
            editor.commands.setContent(JSON.parse(content))
            setContentLoading(false)
          }
          if (editor.isEmpty && content) {
            console.log('Notice: editor setContent by JSON format 2 ', id)
            editor.commands.setContent(JSON.parse(content))
            setContentLoading(false)
          }
        })
        provider?.on('synced', () => {
          // console.log('editor provider synced...')
          setContentLoading(false)
        })
      },
      onUpdate: ({ editor }) => {
        const characterCount = editor?.storage.characterCount || {
          characters: () => 0,
          words: () => 0,
        }
        if (characterCount.characters() >= EDITOR_CHARACTER_LIMIT) {
          const { to } = editor.state.selection
          editor.commands.deleteRange({ from: to - 1, to })
          countLimitToast()
          return
        }
        updateCharacterCount()
      },
      editorProps: {
        attributes: {
          class:
            'min-h-96 prose dark:prose-invert focus:outline-none max-w-none',
        },
      },
    },
    [id, ydoc, provider, userInfo]
  )

  const countLimitToast = useCallback(() => {
    limitToast(toast)
  }, [toast])

  // 更新字符計數
  const updateCharacterCount = useCallback(() => {
    const characterCount = editor?.storage.characterCount || {
      characters: () => 0,
      words: () => 0,
    }
    emitter.emit(EVENT_KEY_CHANGE_CHAR_COUNT, {
      count: characterCount.characters(),
      id,
    })
    // characterCount.words() 可以統計英文單詞數量，但不適用於中文
  }, [id, editor])
  useEffect(updateCharacterCount)

  // 更新協作狀態
  // update collaborative state
  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      emitter.emit(EVENT_KEY_CHANGE_COLLAB_STATE, { status: event.status, id })
    })
  }, [provider, id])

  // 獲取協作用戶
  useEffect(() => {
    const users = editor?.storage.collaborationCursor?.users || []
    if (users.length <= 0) return

    const emails: string[] = []
    const filteredUsers = users.filter((user: IUserInfo) => {
      if (emails.includes(user.email)) {
        // console.log('重複用戶...', user.email, emails)
        return false
      }
      emails.push(user.email)
      return true
    })

    emitter.emit(EVENT_KEY_CHANGE_COLLAB_USERS, { users: filteredUsers, id })
  }, [editor?.storage.collaborationCursor?.users, id])

  // AI 島元素
  const [rightPanelDiv, setRightPanelDiv] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setRightPanelDiv(document.getElementById(RIGHT_PANEL_DOM_ID))
  }, [])

  if (contentLoading) {
    return (
      <div className="space-y-2 mx-10">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }

  return (
    <>
      <div ref={menuContainerRef}>
        <EditorContent editor={editor} />
        <ContentMenu editor={editor} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColMenu editor={editor} appendTo={menuContainerRef} />
      </div>
      {rightPanelDiv &&
        createPortal(<AIIsland editor={editor} />, rightPanelDiv)}
    </>
  )
}

export default TiptapEditor
