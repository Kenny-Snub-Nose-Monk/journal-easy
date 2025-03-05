'use client'

import { useState, useEffect, useRef } from 'react'
import { Share } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { IDoc } from '@/stores/docs-store'
import { useUserStore } from '@/stores/user-store'
import { CONTENT_WIDTH } from '@/constants'
import { Input } from '@/components/ui/input'
import BackToTop from '@/components/back-to-top'
import TiptapEditor from '@/components/editor'
import { useDocsStore } from '@/stores/docs-store'
import { useTranslations } from 'next-intl'

interface IProps {
  doc: IDoc
}

export default function ContentForShareDoc(props: IProps) {
  const { doc } = props
  const userInfo = useUserStore((s) => s.userInfo)
  const contentContainerRef = useRef(null)
  const curDocId = useDocsStore((s) => s.curDocId)
  const addOtherDoc = useDocsStore((s) => s.addOtherDoc)
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
  const [UnauthorizedText, setUnauthorizedText] = useState(t('checking'))

  useEffect(() => {
    setAuthority(false)
  }, [curDocId])

  useEffect(() => {
    if (doc.id !== curDocId) return

    if (!doc.sharePassword) {
      setUnauthorizedText(t('notShared'))
      return
    }

    const STORAGE_KEY = `SHARED_PASSWORD_${doc.id}`
    if (localStorage.getItem(STORAGE_KEY) === doc.sharePassword) {
      setAuthority(true)
      return
    }

    // If there is no password in localStorage or not correct, get it
    const p = prompt(t('inputPassword'))
    if (!p?.trim() || p !== doc.sharePassword) {
      setUnauthorizedText(t('passwordWrong'))
      return
    }
    if (p === doc.sharePassword) {
      localStorage.setItem(STORAGE_KEY, p)
      setAuthority(true)
    }
  }, [doc, curDocId, t])

  // Add doc to otherDocs
  useEffect(() => {
    // console.log('store other doc...', doc.id, isMyDoc, authority)
    if (isMyDoc) return
    if (!authority) return
    addOtherDoc({ id: doc.id, title: doc.title })
  }, [doc, addOtherDoc, authority, isMyDoc])

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
      <div className="mx-10 -mt-4 mb-4">
        <div className="inline-flex items-center text-sm">
          <Share size={16} className="mr-1 text-muted-foreground" />
          <span className="text-muted-foreground mr-2">{t('shareTip')}</span>
          <Link href="/work/" className="underline">
            {t('toMyDocs')}
          </Link>
        </div>
      </div>
      {authority && renderEditor && <TiptapEditor id={doc.id} />}
      {/* {authority && <p className="mx-10">editor {doc.id}</p>} */}
      {!authority && (
        <p className="mx-10 mt-44 text-center">{UnauthorizedText}</p>
      )}
    </div>
  )
}
