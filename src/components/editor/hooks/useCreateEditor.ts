import { useState, useEffect, useMemo } from 'react'
import { useEditor } from '@tiptap/react'
import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { extensions } from '../extensions'
import { getRandomElement } from '@/lib/utils'
import { get } from '@/lib/ajax'
import {
  EDITOR_PADDING_BOTTOM,
  COLLABORATE_EDIT_USER_COLORS,
  DEFAULT_NEW_DOC_TITLE,
} from '@/constants'
import { useUserStore } from '@/stores/user-store'
import { useEditorStore } from '@/stores/editor-store'
import { useDocsStore, IDoc } from '@/stores/docs-store'

export default function useCreateEditor(id: string) {
  const userInfo = useUserStore((s) => s.userInfo)

  const docs = useDocsStore((s) => s.docs)

  const setDocId = useEditorStore((s) => s.setDocId)

  const [loading, setLoading] = useState(true)

  // Yjs document and provider
  const ydoc = useMemo(() => new Y.Doc({ guid: id }), [id])
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
    const status = provider.configuration.websocketProvider.status // disconnected connecting connected
    // console.log('provider status...', status, provider.isConnected)
    if (status === 'connected') return

    provider.connect()
    // .catch((error) => {
    //   console.log('12312312 ', error) // 监听不到 WebSocket 连接失败的错误
    // })

    // // websocket error 可监听到 WebSocket 连接失败的错误，但连接成功时也会报错！！
    // const ws = provider.configuration.websocketProvider.webSocket
    // ws?.addEventListener('error', (event) => {
    //   console.log('websocket error...', event)
    // })

    return () => {
      const status = provider.configuration.websocketProvider.status // disconnected connecting connected
      if (status === 'disconnected') return
      if (status === 'connecting') return
      provider.configuration.websocketProvider.disconnect() // https://github.com/ueberdosis/hocuspocus/issues/594#issuecomment-1740599461
      provider.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // is connected timeout
  const [isConnectedTimeout, setIsConnectedTimeout] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (provider.isConnected) return
      setIsConnectedTimeout(true)
    }, 6 * 1000)
  }, [id, provider])

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
          const doc = docs.find((i) => i.id === id)
          if (doc == null) return

          const isAutoCreated = doc.title === DEFAULT_NEW_DOC_TITLE

          const isRecentlyUpdated = isDocRecentlyUpdated(doc)
          if (isRecentlyUpdated && !isAutoCreated) return

          const hasParsed = hasDocParsedContent(id)
          if (hasParsed) return // has parsed content

          // Get doc content, and set content, when JSON convert to Yjs doc failed. We will remove this code after a long time (almost all docs have been converted).
          const { errno, data } = await get(`/api/doc/${id}`)
          if (errno !== 0) return
          // console.log('data....', data)
          const { contentBinary, content } = data
          if (contentBinary == null && content) {
            console.log('Notice: editor setContent by JSON format 1 ', id)
            editor.commands.setContent(JSON.parse(content))
            setLoading(false)
          }
        })
        provider?.on('synced', () => {
          // console.log('editor provider synced...')
          setLoading(false)
          setDocId(id)
        })
        provider?.on('connect', () => {
          // console.log('editor provider connect...')
        })
      },
      editorProps: {
        attributes: {
          class: 'prose dark:prose-invert focus:outline-none max-w-none',
          style: `min-height: calc(100vh - ${EDITOR_PADDING_BOTTOM}px); padding-bottom: ${EDITOR_PADDING_BOTTOM}px;`,
        },
      },
    },
    [id, ydoc, provider, userInfo]
  )

  return {
    editor,
    loading,
    provider,
    isConnectedTimeout,
  }
}

/**
 * 判斷該文檔是否是最近更新的文檔（最近更新的，會有 binary 格式，不用從 JSON 轉換）
 * @param doc doc
 * @returns boolean
 */
function isDocRecentlyUpdated(doc: IDoc) {
  const createdAt = new Date(doc.createdAt || 0).getTime()
  const updatedAt = new Date(doc.updatedAt || 0).getTime()
  const dt = new Date('2025/02/28').getTime() // 協同編輯發布到預覽
  if (createdAt > dt) return true
  if (updatedAt > dt) return true
  return false
}

/**
 * 判斷該文檔是否已經解析過內容（不要重複解析）
 * @param docId doc id
 * @returns boolean
 */
function hasDocParsedContent(docId: string) {
  const key = 'EDITOR_PARSED_CONTENT_IDS'
  const parsedIdsStr = localStorage.getItem(key)
  const parsedIds = parsedIdsStr ? JSON.parse(parsedIdsStr) : []
  if (parsedIds.includes(docId)) return true

  parsedIds.push(docId) // record
  localStorage.setItem(key, JSON.stringify(parsedIds)) // save
  return false
}
