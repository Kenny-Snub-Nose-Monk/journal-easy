'use client'
import { useEffect, useState, useRef } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import TiptapEditor from '@/components/editor'
import { getDoc, updateContent, updateTitle } from './client-action'
import emitter from '@/lib/emitter'
import { get } from '@/lib/ajax'
import {
  EVENT_KEY_CHANGE_DOC_TITLE,
  EVENT_KEY_NAV_DOC,
  EVENT_KEY_CREATE_DOC,
  EVENT_KEY_CHANGE_UPDATING,
  EVENT_KEY_CHANGE_IS_STAR,
  CONTENT_WIDTH,
  DOC_TITLE_INPUT_ID,
} from '@/constants'

interface IProps {
  defaultId: string
  defaultTitle: string
  defaultContent: string
  defaultNotFound: boolean
  defaultIsStar: boolean | null
}

export default function Content(props: IProps) {
  const {
    defaultId,
    defaultTitle,
    defaultContent,
    defaultNotFound,
    defaultIsStar,
  } = props
  const [id, setId] = useState(defaultId)
  // loading
  const [loading, setLoading] = useState(false)
  // 找不到文章
  const [notFound, setNotFound] = useState(defaultNotFound)
  // 標題
  const [title, setTitle] = useState(defaultTitle)

  const fullWidth = CONTENT_WIDTH + 80 // 兩邊留白 40px

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    // 更新資料庫
    emitter.emit(EVENT_KEY_CHANGE_UPDATING, { updating: true, id }) // 標記“修改中”
    setTitle(newTitle)
    updateTitle(id, newTitle)
    // 觸發事件，以更新左側列表的文章標題
    emitter.emit(EVENT_KEY_CHANGE_DOC_TITLE, newTitle)
  }

  useEffect(() => {
    document.title = title || '<No Title>'
  }, [title])

  const titleInputRef = useRef<HTMLInputElement>(null)

  // 編輯器內容
  const [editorContent, SetEditorContent] = useState(defaultContent)
  function handleUpdate(content: string) {
    emitter.emit(EVENT_KEY_CHANGE_UPDATING, { updating: true, id }) // 標記“修改中”
    updateContent(id, content)
  }

  // isStar
  const [isStar, setIsStar] = useState(defaultIsStar)

  useEffect(() => {
    emitter.emit(EVENT_KEY_CHANGE_IS_STAR, { isStar, id })
  }, [isStar, id])

  // 獲取文章內容
  useEffect(() => {
    function load(payload: any) {
      const { id, type } = payload || {}
      if (!id) return
      setId(id) // 切換 id ，重要！
      setIsStar(false)
      setNotFound(false)
      setLoading(true)

      // 剛創建的新文檔，不用查詢內容（查也是空的）
      if (type === 'create') {
        // 用 setTimeout 模擬 loading 效果（還有，不用 setTimeout 無法徹底清除編輯器之前的内容）
        setTimeout(() => {
          setTitle('')
          SetEditorContent('')
          setLoading(false)
          setTimeout(() => titleInputRef.current?.focus(), 200)
        }, 200)
        return
      }

      getDoc(id).then((data: any) => {
        // 通過 id 找不到 doc
        if (data == null) {
          setNotFound(true)
          setTitle('Not Found')
          setLoading(false)
          return
        }
        setTitle(data.title)
        SetEditorContent(data.content)
        setLoading(false)
        setIsStar(data.isStar)
        emitter.emit(EVENT_KEY_CHANGE_UPDATING, { updating: false, id }) // 切換文檔，重置標記
      })
    }
    emitter.on(EVENT_KEY_NAV_DOC, load)
    return () => {
      emitter.off(EVENT_KEY_NAV_DOC, load) // 及時銷毀自定義事件
    }
  }, [id])

  // 監聽 window close 更新 lastDocId
  useEffect(() => {
    function handler() {
      const url = '/api/user/update-last-doc-id?lastDocId=' + id
      get(url) // window close 時只能發送 get 請求，如發送 patch 請求服務端會報錯
    }
    window.addEventListener('beforeunload', handler)
    return () => {
      window.removeEventListener('beforeunload', handler) // 及時銷毀 DOM 事件
    }
  }, [id])

  if (loading) {
    return (
      <div
        className="flex flex-col space-y-3 mx-auto mt-10"
        style={{ width: `${CONTENT_WIDTH}px` }}
      >
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    )
  }
  if (notFound) {
    return (
      <p>
        找不到文檔，
        <span
          className="underline cursor-pointer"
          onClick={() => emitter.emit(EVENT_KEY_CREATE_DOC)}
        >
          创建新文檔
        </span>
      </p>
    )
  }
  return (
    <div className={`mx-auto my-10 mb-52`} style={{ width: `${fullWidth}px` }}>
      <div className="mx-10 mb-6 pb-4 border-b">
        <Input
          id={DOC_TITLE_INPUT_ID}
          placeholder="請輸入標題..."
          value={title}
          maxLength={100}
          onChange={handleChange}
          className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
          ref={titleInputRef}
        />
        {/* 可能還會再增加其他功能，例如設置 Icon 、背景等 */}
      </div>
      <TiptapEditor
        id={id}
        rawContent={editorContent}
        handleUpdate={handleUpdate}
      />
    </div>
  )
}
