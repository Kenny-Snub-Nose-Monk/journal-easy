'use client'

import { useState, useEffect, useRef } from 'react'
import { Share } from 'lucide-react'
import Link from 'next/link'
import { IDoc } from '@/stores/docs-store'
import { useUserStore } from '@/stores/user-store'
import {
  CONTENT_WIDTH,
  RESIZABLE_LEFT_PANEL_ID,
  RESIZABLE_HANDLE_ID,
} from '@/constants'
import { Input } from '@/components/ui/input'
import BackToTop from '@/components/back-to-top'
import TiptapEditor from '@/components/editor'

interface IProps {
  doc: IDoc
}

export default function ContentForShareDoc(props: IProps) {
  const { doc } = props
  const userInfo = useUserStore((s) => s.userInfo)
  const contentContainerRef = useRef(null)

  useEffect(() => {
    document.title = doc.title || '<無標題>'
  }, [doc])

  useEffect(() => {
    document.getElementById(RESIZABLE_LEFT_PANEL_ID)!.style.display = 'none'
    document.getElementById(RESIZABLE_HANDLE_ID)!.style.display = 'none'
  }, [])

  const [authority, setAuthority] = useState(false)
  const [UnauthorizedText, setUnauthorizedText] = useState('共享權限校驗中...')
  useEffect(() => {
    if (!doc.sharePassword) {
      setUnauthorizedText('該文檔未開啟分享，你無權限查看')
      return
    }

    const STORAGE_KEY = `SHARED_PASSWORD_${doc.id}`
    if (localStorage.getItem(STORAGE_KEY) === doc.sharePassword) {
      setAuthority(true)
      return
    }

    // If there is no password in localStorage or not correct, get it
    const p = prompt('請輸入共享密碼：')
    if (!p?.trim() || p !== doc.sharePassword) {
      setUnauthorizedText('密碼錯誤，請刷新頁面重試')
      return
    }
    if (p === doc.sharePassword) {
      localStorage.setItem(STORAGE_KEY, p)
      setAuthority(true)
    }
  }, [doc.id, authority, doc.sharePassword])

  const isMyDoc = userInfo?.id === doc.userId
  if (isMyDoc) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Error: this doc is mine, not a share doc.</p>
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
          <span className="text-muted-foreground mr-2">此為共享文檔</span>
          <Link href="/work/" className="underline">
            跳轉到我的文檔
          </Link>
        </div>
      </div>
      {authority && <TiptapEditor id={doc.id} />}
      {/* {authority && <p className="mx-10">editor {doc.id}</p>} */}
      {!authority && (
        <p className="mx-10 mt-44 text-center">{UnauthorizedText}</p>
      )}
    </div>
  )
}
