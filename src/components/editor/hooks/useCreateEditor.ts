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
} from '@/constants'
import { useUserStore } from '@/stores/user-store'

export default function useCreateEditor(id: string) {
  const userInfo = useUserStore((s) => s.userInfo)

  const [loading, setLoading] = useState(true)

  // Yjs document and provider
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
