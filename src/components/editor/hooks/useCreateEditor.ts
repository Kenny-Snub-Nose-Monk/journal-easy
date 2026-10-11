import { useState, useEffect, useMemo } from 'react'
import { useEditor } from '@tiptap/react'
import { HocuspocusProvider } from '@hocuspocus/provider'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { getExtensions } from '../extensions'
import { getRandomElement } from '@/lib/utils'
import { get, patch } from '@/lib/ajax'
import { collaborationEnabled } from '@/lib/editor-mode'
import { createSaveQueue } from '@/lib/autosave/queue'
import {
  registerDocUpdater,
  unregisterDocUpdater,
  registerDocFlusher,
  unregisterDocFlusher,
} from '@/lib/doc-version/snapshot-provider'
import {
  EDITOR_PADDING_BOTTOM,
  COLLABORATE_EDIT_USER_COLORS,
  DEFAULT_NEW_DOC_TITLE,
  DEFAULT_NEW_DOC_TITLE_EN,
} from '@/constants'
import { useUserStore } from '@/stores/user-store'
import { useEditorStore } from '@/stores/editor-store'
import { useDocsStore, IDoc } from '@/stores/docs-store'
import { useLocale, useTranslations } from 'next-intl'
import { uint8ArrayToBase64 } from '@/lib/doc-version/binary'
import { registerDocSnapshotProvider, unregisterDocSnapshotProvider } from '@/lib/doc-version/snapshot-provider'

export default function useCreateEditor(id: string) {
  const userInfo = useUserStore((s) => s.userInfo)
  const collabAPUToken = useUserStore((s) => s.collabAPIToken)
  const locale = useLocale()
  const t = useTranslations('editor')

  const docs = useDocsStore((s) => s.docs)

  const setDocId = useEditorStore((s) => s.setDocId)

  const [loading, setLoading] = useState(true)

  // Yjs document and provider
  const ydoc = useMemo(() => new Y.Doc({ guid: id }), [id])
  useEffect(() => {
    // 将协同编辑内容缓存在本地， 断线或刷新后可继续恢复编辑状态
    if (!collaborationEnabled) return
    const persistence = new IndexeddbPersistence(id, ydoc)
    return () => {
      void persistence.destroy()
    }
  }, [id, ydoc])

  const provider = useMemo(() => {
    if (collaborationEnabled && collabAPUToken) {
      return new HocuspocusProvider({
        url: process.env.NEXT_PUBLIC_COLLABORATE_EDIT_URL || '',
        name: id,
        document: ydoc,
        connect: false, // connect later
        token: collabAPUToken,
      })
    }
  }, [id, ydoc, collabAPUToken])

  // connect and disconnect
  useEffect(() => {
    if (provider == null) return
    const status = provider.configuration.websocketProvider.status // disconnected connecting connected
    // console.log('provider status...', status, provider.isConnected)
    if (status !== 'connected') {
      provider.connect()
    }

    return () => {
      const status = provider.configuration.websocketProvider.status // disconnected connecting connected
      if (status === 'disconnected') return
      if (status === 'connecting') return
      provider.configuration.websocketProvider.disconnect() // https://github.com/ueberdosis/hocuspocus/issues/594#issuecomment-1740599461
      provider.disconnect()
    }
  }, [id, provider])

  // detect disconnect (maybe server closed)
  const [isDisconnected, setIsDisconnected] = useState(false)
  useEffect(() => {
    if (provider == null) return
    const onConnect = () => {
      console.log('editor provider connect......')
      setIsDisconnected(false)
    }
    const onDisconnect = ({ event }: { event: CloseEvent }) => {
      console.log('editor provider disconnect...', event)
      if (event.type === 'close') {
        setTimeout(() => {
          const status = provider.configuration.websocketProvider.status
          if (status === 'connected') return // maybe reconnect soon itself
          setIsDisconnected(true)
        }, 3 * 1000)
      }
    }
    provider.on('connect', onConnect)
    provider.on('disconnect', onDisconnect)
    return () => {
      provider.off('connect', onConnect)
      provider.off('disconnect', onDisconnect)
    }
  }, [provider, id])

  // is connected timeout
  const [isConnectedTimeout, setIsConnectedTimeout] = useState(false)
  useEffect(() => {
    if (provider == null) return
    setTimeout(() => {
      const status = provider.configuration.websocketProvider.status
      if (status === 'connected') return
      setIsConnectedTimeout(true)
    }, 6 * 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, provider])

  const extensions = getExtensions({
    placeholder: t('placeholder'),
    collaborative: true,
  })
  const editor = useEditor(
    {
      extensions: [
        ...extensions,
        Collaboration.configure({
          document: ydoc,
        }),
        ...(provider
          ? [
              CollaborationCursor.configure({
                provider,
                user: {
                  name: userInfo?.name || userInfo?.email,
                  email: userInfo?.email,
                  avatar: userInfo?.image,
                  color: getRandomElement(COLLABORATE_EDIT_USER_COLORS), // random color
                },
              }),
            ]
          : []),
      ],
      onCreate: ({ editor }) => {
        provider?.on('open', async () => {
          // console.log('editor provider open...')
          const doc = docs.find((i) => i.id === id)
          if (doc == null) return

          const AutoCreatedTitle = locale === 'zh-tw' ? DEFAULT_NEW_DOC_TITLE : DEFAULT_NEW_DOC_TITLE_EN
          const isAutoCreated = doc.title === AutoCreatedTitle // 自定創建的文檔，只有 JSON 格式，需要轉化一次格式
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
    [id, ydoc, provider, userInfo, locale]
  )

  useEffect(() => {
    if (collaborationEnabled || !editor || !userInfo?.id) return
    let active = true
    let ready = false
    let expectedContent = ''
    const draftKey = `journal-draft:${userInfo.id}:${id}`
    const setState = useEditorStore.getState().setCollaborativeState
    const queue = createSaveQueue<{ content: string; contentBinaryBase64: string; title?: string }>(
      async (snapshot) => {
        try {
          const result = await patch(`/api/doc/${id}`, { ...snapshot, expectedContent })
          if (result.errno !== 0) throw new Error(result.msg || 'Save failed')
          expectedContent = snapshot.content
          // A newer draft may already exist while this write was in flight.
          const draft = JSON.parse(localStorage.getItem(draftKey) || 'null')
          if (draft?.content === snapshot.content && draft?.title === snapshot.title) localStorage.removeItem(draftKey)
          else if (draft) localStorage.setItem(draftKey, JSON.stringify({ ...draft, baseContent: expectedContent }))
          if (active)
            setState(
              draft && (draft.content !== snapshot.content || draft.title !== snapshot.title)
                ? 'connecting'
                : 'connected'
            )
        } catch (error) {
          if (active) setState('disconnected')
          throw error
        }
      }
    )
    const snapshot = () => ({
      ...(useDocsStore.getState().docs.find((doc) => doc.id === id)?.title !== undefined
        ? { title: useDocsStore.getState().docs.find((doc) => doc.id === id)!.title }
        : {}),
      content: JSON.stringify(editor.getJSON()),
      contentBinaryBase64: uint8ArrayToBase64(Y.encodeStateAsUpdate(ydoc)),
    })
    const update = () => {
      if (!ready || !editor.isEditable || editor.isDestroyed) return
      const data = snapshot()
      try {
        localStorage.setItem(draftKey, JSON.stringify({ ...data, baseContent: expectedContent }))
      } catch {
        /* HTTP persistence remains available */
      }
      setState('connecting')
      queue.schedule(data)
    }
    async function load() {
      setLoading(true)
      try {
        const result = await get(`/api/doc/${id}`)
        if (!active) return
        if (result.errno !== 0 || !result.data) throw new Error('Document load failed')
        const doc = result.data
        expectedContent = doc.content || ''
        let recoveredDraft = false
        let content = doc.content ? JSON.parse(doc.content) : { type: 'doc', content: [{ type: 'paragraph' }] }
        // JSON is the authoritative snapshot in single-user mode; do not merge stale Yjs updates.
        try {
          const draft = JSON.parse(localStorage.getItem(draftKey) || 'null')
          if (
            draft?.content &&
            (draft.baseContent === expectedContent ||
              window.confirm('發現未儲存草稿，是否恢復？ / Restore unsaved draft?'))
          ) {
            content = JSON.parse(draft.content)
            recoveredDraft = true
            if (typeof draft.title === 'string') useDocsStore.getState().updateDocTitle(id, draft.title)
          }
        } catch {
          /* Ignore malformed browser drafts; the database content is intact. */
        }
        editor?.commands.setContent(content, true)
        ready = true
        setDocId(id)
        setLoading(false)
        setState('connected')
        // Persist a recovered draft as well as an empty newly created document.
        if (recoveredDraft || JSON.stringify(content) !== expectedContent) update()
      } catch {
        if (active) {
          setLoading(false)
          setIsConnectedTimeout(true)
        }
      }
    }
    void load()
    editor.on('update', update)
    const retry = () => {
      void queue.flush().catch(() => {})
    }
    const retryTimer = setInterval(retry, 10000)
    window.addEventListener('online', retry)
    registerDocFlusher(id, queue.flush)
    registerDocUpdater(id, () => {
      if (!ready) return false
      update()
      return true
    })
    return () => {
      active = false
      clearInterval(retryTimer)
      window.removeEventListener('online', retry)
      editor.off('update', update)
      unregisterDocFlusher(id)
      unregisterDocUpdater(id)
      void queue.flush().catch(() => {})
    }
  }, [editor, id, ydoc, userInfo?.id, setDocId])

  useEffect(() => {
    if (editor == null) return

    // 注册当前编辑器快照提供器，供版本保存和恢复时读取最新正文状态。
    registerDocSnapshotProvider(id, () => {
      if (editor.isDestroyed) return null
      const currentDoc = useDocsStore.getState().docs.find((item) => item.id === id)

      return {
        docId: id,
        title: currentDoc?.title || '',
        content: JSON.stringify(editor.getJSON()),
        contentBinaryBase64: uint8ArrayToBase64(Y.encodeStateAsUpdate(ydoc)),
      }
    })

    return () => {
      unregisterDocSnapshotProvider(id)
    }
  }, [editor, id, ydoc])

  return {
    editor,
    loading,
    provider,
    isConnectedTimeout,
    isDisconnected,
  }
}

/**
 * 判断该文档是否是最近更新的文档（最近更新的，会有 binary 格式，不用从 JSON 转换）
 * @param doc doc
 * @returns boolean
 */
function isDocRecentlyUpdated(doc: IDoc) {
  const createdAt = new Date(doc.createdAt || 0).getTime()
  const updatedAt = new Date(doc.updatedAt || 0).getTime()
  const dt = new Date('2024/08/15').getTime() // 08.14 協同編輯發布到預覽
  if (createdAt > dt) return true
  if (updatedAt > dt) return true
  return false
}

/**
 * 判断该文档是否已经解析过内容（不要重复解析）
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
