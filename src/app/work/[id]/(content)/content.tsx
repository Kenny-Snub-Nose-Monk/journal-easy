'use client'
import { useEffect, useState, useCallback } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import TiptapEditor from '@/components/editor'
import { getDoc, updateContent, updateTitle } from './client-action'
import emitter from '@/lib/emitter'

interface IProps {
  id: string
  defaultTitle: string
  defaultContent: string
}

export default function Content(props: IProps) {
  const { id, defaultTitle, defaultContent } = props
  // loading
  const [loading, setLoading] = useState(false)
  // 找不到文章
  const [notFound, setNotFound] = useState(false)
  // 標題
  const [title, setTitle] = useState(defaultTitle)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    setTitle(newTitle)
    updateTitle(id, newTitle)
    // 觸發事件，以更新左側列表的文章標題
    const key = `CHANGE_DOC_TITLE_${id}`
    emitter.emit(key, newTitle)
  }
  // 編輯器內容
  const [editorContent, SetEditorContent] = useState(defaultContent)
  function handleUpdate(content: string) {
    updateContent(id, content)
  }
  // 獲取文章內容
  useEffect(() => {
    const eventKey = 'NAV_DOC'
    function load(payload: any) {
      const { id } = payload || {}
      if (!id) return
      setLoading(true)
      getDoc(id).then((data: any) => {
        // 通過 id 找不到 doc
        if (data == null) {
          setNotFound(true)
          return
        }
        setTitle(data.title)
        SetEditorContent(data.content)
        setLoading(false)
      })
    }
    emitter.on(eventKey, load)
    return () => {
      emitter.off(eventKey, load) // 及時銷毀自定義事件
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col space-y-3">
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
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到文檔...</p>
      </div>
    )
  }
  return (
    <>
      <div className="mx-10 mb-6 pb-4 border-b">
        <Input
          placeholder="請輸入標題..."
          value={title}
          maxLength={100}
          onChange={handleChange}
          className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
        />
        {/* 可能還會再增加其他功能，例如設置 Icon 、背景等 */}
      </div>
      <TiptapEditor rawContent={editorContent} handleUpdate={handleUpdate} />
    </>
  )
}
