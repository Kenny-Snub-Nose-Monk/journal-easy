'use client'

import { useState, useEffect, useRef } from 'react'
import { IDoc } from '@/stores/docs-store'
import { useUserStore } from '@/stores/user-store'
import { CONTENT_WIDTH } from '@/constants'
import { Input } from '@/components/ui/input'
import BackToTop from '@/components/back-to-top'
import TiptapEditor from '@/components/editor'
import { useDocsStore } from '@/stores/docs-store'
import { useShareStore } from '@/stores/share-store'
import { useTranslations } from 'next-intl'

interface IProps {
  doc: IDoc
}

export default function ContentForShareDoc(props: IProps) {
  const { doc } = props
  const userInfo = useUserStore((s) => s.userInfo)
  const contentContainerRef = useRef(null)
  const curDocId = useDocsStore((s) => s.curDocId)
  const shareRelations = useShareStore((s) => s.shareRelations)
  const isMyDoc = userInfo?.id === doc.userId

  const t = useTranslations('sharedDocPage')

  const [renderEditor, setRenderEditor] = useState(false)

  useEffect(() => {
    setRenderEditor(false)
    setTimeout(() => {
      setRenderEditor(true) // when doc changed, force re-render editor
    }, 100)
  }, [doc])

  useEffect(() => {
    document.title = doc.title || t('unTitled')
  }, [doc, t])

  const [authority, setAuthority] = useState(false)
  // const [UnauthorizedText, setUnauthorizedText] = useState(t('checking'))

  useEffect(() => {
    setAuthority(false)
  }, [curDocId])

  useEffect(() => {
    if (doc.id !== curDocId) return

    shareRelations.some((r) => {
      if (r.docId === doc.id && r.userId === userInfo?.id) {
        setAuthority(true)
        return true
      }
    })
  }, [doc, curDocId, shareRelations, userInfo])

  if (isMyDoc) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>{t('isMyDoc')}</p>
      </div>
    )
  }

  const fullWidth = CONTENT_WIDTH + 80 // 兩邊留白 40px

  return (
    <div
      className={`mx-auto my-8 mb-20 scroll-mt-5`}
      style={{ width: `${fullWidth}px` }}
      ref={contentContainerRef}
    >
      <div className="mx-10 mb-6">
        <Input
          value={doc.title}
          maxLength={100}
          className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
          disabled
        />
        {/* 可能還會再增加其他功能，例如設置 Icon 、背景等 */}
      </div>
      <BackToTop target={contentContainerRef} />
      {authority && renderEditor && <TiptapEditor id={doc.id} />}
      {/* {authority && <p className="mx-10">editor {doc.id}</p>} */}
      {!authority && <p className="mx-10 mt-44 text-center">No Authority</p>}
    </div>
  )
}
