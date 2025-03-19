'use client'

import { useEffect, useState, useRef } from 'react'
import { ChevronDown, ChevronRight, FileInput } from 'lucide-react'
import {
  useShareStore,
  IShareRelation,
  IShareRelationUser,
  IShareRelationDoc,
} from '@/stores/share-store'
import { useDocsStore } from '@/stores/docs-store'
import { useTranslations } from 'next-intl'
import scrollIntoView from 'scroll-into-view-if-needed'
import { nav } from './util'
import { cn } from '@/lib/utils'

interface IProps {
  defaultShareRelations: IShareRelation[]
  defaultMyShareRelations: IShareRelation[]
}

export default function OtherList(props: IProps) {
  const t = useTranslations('othersDocs')

  // set default share relations
  const { defaultShareRelations, defaultMyShareRelations } = props
  const setShareRelations = useShareStore((state) => state.setShareRelations)
  const shareRelations = useShareStore((state) => state.shareRelations)
  const setMyShareRelations = useShareStore(
    (state) => state.setMyShareRelations
  )

  useEffect(() => {
    setShareRelations(defaultShareRelations)
    setMyShareRelations(defaultMyShareRelations)
  }, [
    defaultShareRelations,
    defaultMyShareRelations,
    setShareRelations,
    setMyShareRelations,
  ])

  // authors
  const [authors, setAuthors] = useState<IShareRelationUser[]>([])
  useEffect(() => {
    const authors: IShareRelationUser[] = []
    shareRelations.forEach((s) => {
      if (s.author == null) return
      if (authors.some((i) => i.id === s.author?.id)) return
      authors.push(s.author)
    })
    setAuthors(authors)
  }, [shareRelations])

  // show or hide list
  const [showChildren, setShowChildren] = useState(false)
  function toggleShowChildren(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setShowChildren(!showChildren)
  }
  const curDocId = useDocsStore((s) => s.curDocId)
  useEffect(() => {
    if (shareRelations.some((i) => i.docId === curDocId)) {
      setShowChildren(true)
    }
  }, [curDocId, shareRelations])

  if (shareRelations.length === 0) return null

  return (
    <div className="mb-4">
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
        authors.map((author) => <AuthorList key={author.id} author={author} />)}
    </div>
  )
}

function AuthorList({ author }: { author: IShareRelationUser }) {
  // get docs of current author
  const [authorDocs, setAuthorDocs] = useState<IShareRelationDoc[]>([])
  const shareRelations = useShareStore((state) => state.shareRelations)
  useEffect(() => {
    const docs: IShareRelationDoc[] = []
    shareRelations.forEach((s) => {
      if (s.authorId !== author.id) return
      docs.push(s.doc)
    })
    setAuthorDocs(docs)
  }, [author, shareRelations])

  // show or hide list
  const [showChildren, setShowChildren] = useState(false)
  function toggleShowChildren(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setShowChildren(!showChildren)
  }
  const curDocId = useDocsStore((s) => s.curDocId)
  useEffect(() => {
    if (authorDocs.some((i) => i.id === curDocId)) {
      setShowChildren(true)
    }
  }, [curDocId, authorDocs])

  // return <div>{author.name || author.email}</div>
  return (
    <div>
      <div
        className="text-sm flex-auto overflow-hidden py-1.5 px-1 ml-2 flex items-center cursor-pointer"
        onClick={toggleShowChildren}
      >
        <div className="hover:bg-active rounded-full p-0.5">
          {showChildren && <ChevronDown className="h-4 w-4" />}
          {!showChildren && <ChevronRight className="h-4 w-4" />}
        </div>
        <span className="truncate flex-auto">
          {author.name || author.email}
        </span>
      </div>
      {showChildren &&
        authorDocs.map((d) => <OtherDocItem key={d.id} doc={d} />)}
    </div>
  )
}

function OtherDocItem({ doc }: { doc: IShareRelationDoc }) {
  const { id, title } = doc
  const curDocId = useDocsStore((s) => s.curDocId)
  const isCurrent = id === curDocId
  const titleContainerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('othersDocs')

  // scroll to current title
  useEffect(() => {
    if (!isCurrent) return
    if (titleContainerRef.current == null) return
    scrollIntoView(titleContainerRef.current!, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
    })
  }, [isCurrent])

  // click title
  function onClickTitle() {
    if (isCurrent) return
    nav(id)
  }

  return (
    <div
      ref={titleContainerRef}
      className={cn(
        'text-sm flex justify-between items-center w-full hover:text-secondary-foreground hover:bg-active rounded-sm group mb-0.5 px-1 pl-3',
        isCurrent && 'text-secondary-foreground font-bold bg-active rounded-sm'
      )}
    >
      <div
        onClick={onClickTitle}
        className="cursor-pointer flex-auto overflow-hidden py-1.5 px-0.5 ml-2 flex items-center"
      >
        <FileInput className="h-4 w-4 mr-1" />
        <span className="truncate flex-auto">{title || t('unTitled')}</span>
      </div>
    </div>
  )
}
