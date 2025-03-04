'use client'

import { useState, useEffect, useMemo } from 'react'
import { User } from 'next-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { useDocsStore, IDoc } from '@/stores/docs-store'
import { useUserStore } from '@/stores/user-store'
import { CONTENT_WIDTH } from '@/constants'
import { getDoc } from '../client-action'
import useDocs from '../hooks/useDocs'
import ContentForMyDoc from './content-for-my-doc'
import ContentForShareDoc from './content-for-share-doc'

interface IProps {
  id: string
  userInfo: User
}

export default function ContentWrapper(props: IProps) {
  const { userInfo: userInfoProp, id: idProp } = props

  const userInfo = useUserStore((s) => s.userInfo)
  const setUserInfo = useUserStore((s) => s.setUserInfo)
  useEffect(() => {
    setUserInfo(userInfoProp)
  }, [userInfoProp, setUserInfo])

  const loading = useDocsStore((s) => s.loading)
  const creating = useDocsStore((s) => s.creating)
  const curDocId = useDocsStore((s) => s.curDocId)
  const docs = useDocsStore((s) => s.docs)
  const curDoc = useMemo(
    () => docs.find((d) => d.id === curDocId),
    [docs, curDocId]
  )
  const setCurDocId = useDocsStore((s) => s.setCurDocId)
  useEffect(() => {
    setCurDocId(idProp)
  }, [idProp, setCurDocId])

  const [notFound, setNotFound] = useState(false)
  const [shareDoc, setShareDoc] = useState<IDoc>()
  useEffect(() => {
    if (loading) return
    if (curDoc != null) return

    // loading is false and curDoc is null, it's not current user's doc
    getDoc(curDocId).then((data: IDoc | null) => {
      // doc not found, invalid id
      if (data == null) {
        setNotFound(true)
        return
      }
      setShareDoc(data)
    })
  }, [curDoc, loading, curDocId])

  const { createDoc } = useDocs()

  if (loading || creating || userInfo == null) {
    return (
      <div
        className="flex flex-col space-y-3 mx-auto mt-8"
        style={{ width: `${CONTENT_WIDTH}px` }}
      >
        <Skeleton className="h-12 w-full mb-1" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    )
  }

  if (curDoc) {
    return <ContentForMyDoc />
  }

  if (notFound) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>
          找不到文檔，
          <span
            className="underline cursor-pointer"
            onClick={() => createDoc()}
          >
            創建新文檔
          </span>
        </p>
      </div>
    )
  }

  if (shareDoc) {
    return <ContentForShareDoc doc={shareDoc} />
  }
}
