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
  RESIZABLE_RIGHT_PANEL_ID,
  EDITOR_CHARACTER_LIMIT,
  COLLABORATE_EDIT_USER_COLORS,
  EVENT_KEY_FOCUS_CONTENT,
} from '@/constants'
import { getRandomElement } from '@/lib/utils'
import { get } from '@/lib/ajax'
import { useToast } from '../ui/use-toast'
import throttle from 'lodash.throttle'
import { TextSelection } from '@tiptap/pm/state'
import { useUserStore } from '@/stores/user-store'
import { useEditorStore, ICollabUser } from '@/stores/editor-store'

interface IProps {
  id: string
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
  const { id } = props
  const { toast } = useToast()
  const menuContainerRef = useRef(null)
  const userInfo = useUserStore((s) => s.userInfo)

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

  // is connected in-time
  const [isConnected, setIsConnected] = useState(false)
  const [isConnectedTimeout, setIsConnectedTimeout] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      if (isConnected) return
      setIsConnectedTimeout(true)
    }, 6 * 1000)
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
            name: userInfo?.name || userInfo?.email,
            email: userInfo?.email,
            avatar: userInfo?.image,
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
        })
        provider?.on('synced', () => {
          // console.log('editor provider synced...')
          setContentLoading(false)
        })

        provider?.on('connect', () => {
          setIsConnected(true)
        })

        provider?.on('close', () => {
          setIsConnected(false)
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

  // update character count
  const setCharacterCount = useEditorStore((s) => s.setCharacterCount)
  const updateCharacterCount = useCallback(() => {
    const characterCount = editor?.storage.characterCount || {
      characters: () => 0,
      words: () => 0,
    }
    setCharacterCount(characterCount.characters())
    // characterCount.words() 可統計英文單詞數量，但不適用於中文
  }, [editor, setCharacterCount])
  useEffect(updateCharacterCount)

  // 更新協作狀態
  // update collaborative state
  const setCollaborativeState = useEditorStore((s) => s.setCollaborativeState)

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollaborativeState(event.status)
    })
  }, [provider, setCollaborativeState])

  const setCollaborativeUsers = useEditorStore((s) => s.setCollaborativeUsers)
  // 獲取協作用戶
  useEffect(() => {
    const users = (editor?.storage.collaborationCursor?.users ||
      []) as ICollabUser[]
    if (users.length <= 0) {
      setCollaborativeUsers([])
      return
    }

    const emails: string[] = []
    const filteredUsers = users.filter((user: ICollabUser) => {
      if (user.email == null) return false
      emails.push(user.email)
      return true
    })

    setCollaborativeUsers(filteredUsers)
  }, [editor?.storage.collaborationCursor?.users, setCollaborativeUsers])

  // AI 島元素
  const [rightPanelDiv, setRightPanelDiv] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setRightPanelDiv(document.getElementById(RESIZABLE_RIGHT_PANEL_ID))
  }, [])

  // insert a paragraph at the beginning where title input enter
  useEffect(() => {
    // 聚焦到編輯器內容區域
    function focusContent() {
      if (!editor) return

      const { dispatch } = editor.view
      const { tr, schema } = editor.state

      // 聚焦到內容區域
      editor.chain().focus()
      // 創建段落 node
      const newParagraph = schema.nodes.paragraph.create(null, null)
      // 創建一個在文章開頭插入段落的事務
      const transaction = tr.insert(0, newParagraph)
      // 文檔的開始位置
      const startPos = transaction.doc.resolve(0)
      // 光標選擇到文檔開始的位置
      transaction.setSelection(TextSelection.near(startPos))
      // 派發事務
      dispatch(transaction)
    }
    emitter.on(EVENT_KEY_FOCUS_CONTENT, focusContent)
    return () => emitter.off(EVENT_KEY_FOCUS_CONTENT, focusContent)
  }, [editor])

  if (!isConnected && isConnectedTimeout) {
    return (
      <div className="mx-10">
        <p className="text-sm text-muted-foreground">
          協同編輯服務連接失敗，請稍後重試~
        </p>
      </div>
    )
  }

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
