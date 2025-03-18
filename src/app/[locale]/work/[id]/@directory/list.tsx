'use client'
import { useEffect, useState } from 'react'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Item from './item'
import emitter from '@/lib/emitter'
import { IDoc } from '@/stores/docs-store'
import { EVENT_KEY_NAV_DOC } from '@/constants'
import { useDocsStore } from '@/stores/docs-store'
import useDocs from '../hooks/useDocs'
import { useTranslations } from 'next-intl'

interface ListProps {
  defaultParamId: string
  defaultList: IDoc[]
}
export default function List({ defaultParamId, defaultList }: ListProps) {
  const t = useTranslations('myDocs')
  const loading = useDocsStore((s) => s.loading)
  const docs = useDocsStore((s) => s.docs)
  const curDocId = useDocsStore((s) => s.curDocId)
  const setLoading = useDocsStore((s) => s.setLoading)
  const setDocs = useDocsStore((s) => s.setDocs)
  const setCurDocId = useDocsStore((s) => s.setCurDocId)

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
  }, [setCurDocId])

  useEffect(() => {
    setDocs(defaultList)
    setCurDocId(defaultParamId)
    setLoading(false)
  }, [defaultParamId, defaultList, setDocs, setCurDocId, setLoading])

  // show or hide list
  const [showChildren, setShowChildren] = useState(false)
  function toggleShowChildren(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setShowChildren(!showChildren)
  }
  useEffect(() => {
    if (docs.some((i) => i.id === curDocId)) {
      setShowChildren(true)
    }
  }, [curDocId, docs])

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
      <div className="mb-2">
        <h3
          className="px-1 mt-3 mb-1 text-sm font-bold flex items-center cursor-pointer"
          onClick={toggleShowChildren}
        >
          <div className="hover:bg-active rounded-full p-0.5">
            {showChildren && <ChevronDown className="h-4 w-4" />}
            {!showChildren && <ChevronRight className="h-4 w-4" />}
          </div>
          <span>{t('title')}</span>
        </h3>
        {showChildren &&
          docs
            .filter((i) => i.parentId == null) // 顶级目录
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
      </div>
    </>
  )
}

function CreateButton() {
  const t = useTranslations('myDocs')
  const { createDoc } = useDocs()

  return (
    <Button
      className="justify-start px-0.5 font-bold text-sm ml-1"
      size="sm"
      variant="ghost"
      onClick={() => createDoc()}
    >
      <Plus className="h-4 w-4 mr-1" />
      {t('create')}
    </Button>
  )
}
