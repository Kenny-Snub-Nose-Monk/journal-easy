'use client'
import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Item from './item'
import emitter from '@/lib/emitter'
import { IDoc } from '@/stores/docs-store'
import { EVENT_KEY_NAV_DOC } from '@/constants'
import { useDocsStore } from '@/stores/docs-store'
import useDocs from '../hooks/useDocs'

interface ListProps {
  defaultParamId: string
  defaultList: IDoc[]
}
export default function List({ defaultParamId, defaultList }: ListProps) {
  const loading = useDocsStore((s) => s.loading)
  const docs = useDocsStore((s) => s.docs)
  const curDocId = useDocsStore((s) => s.curDocId)
  const setLoading = useDocsStore((s) => s.setLoading)
  const setDocs = useDocsStore((s) => s.setDocs)
  const setCurDocId = useDocsStore((s) => s.setCurDocId)

  const { createDoc } = useDocs()

  // 切換文檔，重新設置 paramId
  useEffect(() => {
    function handler(payload: any) {
      const { id } = payload || {}
      if (!id) return
      setCurDocId(id)
    }
    emitter.on(EVENT_KEY_NAV_DOC, handler)
    return () => {
      emitter.off(EVENT_KEY_NAV_DOC, handler) // 及時清理自定義事件
    }
  }, [])

  useEffect(() => {
    setDocs(defaultList)
    setCurDocId(defaultParamId)
    setLoading(false)
  }, [defaultParamId, defaultList, setDocs, setCurDocId, setLoading])

  if (loading)
    return (
      <div className="space-y-2 px-2 pt-2">
        <Skeleton className="h-6 w-full bg-black/10" />
        <Skeleton className="h-6 w-full bg-black/10" />
        <Skeleton className="h-6 w-full bg-black/10" />
      </div>
    )

  return (
    // <div className="h-[1000px]">
    <>
      {/* render doc list */}
      {docs
        .filter((i) => i.parentId == null) // 頂級目錄
        .map((doc) => {
          const { id, title, isStar, sharePassword } = doc
          return (
            <Item
              key={id}
              id={id}
              title={title}
              isStar={!!isStar}
              sharePassword={sharePassword}
              curDocId={curDocId}
              docs={docs}
            />
          )
        })}
      {/* create button */}
      <Button
        className="justify-start px-0.5 font-bold text-sm"
        size="sm"
        variant="ghost"
        onClick={() => createDoc()}
      >
        <Plus className="h-4 w-4 mr-1" />
        創建文檔
      </Button>
    </>
  )
}
