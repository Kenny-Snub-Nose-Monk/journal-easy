'use client'

import { useRef, useEffect, useCallback, useState, useMemo, use } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent } from '@tiptap/react'
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
import { useToast } from '../ui/use-toast'
import throttle from 'lodash.throttle'

interface IUserInfo {
  name: string
  email: String
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

  const ydoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLABORATE_EDIT_URL || '',
      name: id,
      document: ydoc,
      connect: false, // connect later
    })
  }, [id, ydoc])

  // connect and disconnect
  useEffect(() => {
    if (!provider.isConnected) {
      provider.connect()
    }
    return () => {
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
            avatar: userInfo.avatar,
            color: getRandomElement(COLLABORATE_EDIT_USER_COLORS), // random color
          },
        }),
      ],
      onCreate: ({ editor }) => {
        // provider?.on('synced', () => {
        //   console.log('editor provider synced...')
        // })
        provider?.on('authenticationFailed', (reason: any) => {
          console.log('editor provider authentication failed...', reason)
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

  const updateCharacterCount = useCallback(() => {
    const characterCount = editor?.storage.characterCount || {
      characters: () => 0,
      words: () => 0,
    }
    emitter.emit(EVENT_KEY_CHANGE_CHAR_COUNT, {
      count: characterCount.characters(),
      id,
    })
    // characterCount.words() 可統計英文單詞數量，但不適用中文
  }, [id, editor])
  useEffect(updateCharacterCount)

  // update collaborative state
  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      emitter.emit(EVENT_KEY_CHANGE_COLLAB_STATE, { status: event.status, id })
    })
  }, [provider, id])
  // get collaboration users
  useEffect(() => {
    const users = editor?.storage.collaborationCursor?.users || []
    if (users.length <= 0) return
    emitter.emit(EVENT_KEY_CHANGE_COLLAB_USERS, { users, id })
  }, [editor?.storage.collaborationCursor?.users, id])

  // AI island element
  const [rightPanelDiv, setRightPanelDiv] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setRightPanelDiv(document.getElementById(RIGHT_PANEL_DOM_ID))
  }, [])

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
