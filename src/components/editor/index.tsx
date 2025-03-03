'use client'

import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { EditorContent } from '@tiptap/react'
import { Skeleton } from '@/components/ui/skeleton'
import ContentMenu from './menus/content-menu'
import TextMenu from './menus/text-menu'
import ColumnsMenu from './menus/columns-menu'
import LinkMenu from './menus/link-menu'
import ImageBlockMenu from './menus/image-block-menu'
import { TableRowMenu, TableColMenu } from './menus/table-menu'
import { RESIZABLE_RIGHT_PANEL_ID } from '@/constants'
import useCreateEditor from './hooks/useCreateEditor'
import useLimitCharCount from './hooks/useLimitCharCount'
import useCollabStateAndUsers from './hooks/useCollabStateAndUsers'
import useFocusEditorFromTitleInput from './hooks/useFocusEditorFromTitleInput'
import AIIsland from './ai-island'
import { useToast } from '@/components/ui/use-toast'

interface IProps {
  id: string
}

const TiptapEditor = (props: IProps) => {
  const { id } = props

  const menuContainerRef = useRef(null)

  const { editor, loading, provider, isConnectedTimeout, isDisconnected } =
    useCreateEditor(id)

  const { toast } = useToast()

  // limit character count
  useLimitCharCount(editor)

  // collaborative state and users
  useCollabStateAndUsers(editor, provider)

  // focus editor from title input
  useFocusEditorFromTitleInput(editor)

  // AI island element
  const [rightPanelDiv, setRightPanelDiv] = useState<HTMLElement | null>(null)
  useEffect(() => {
    setRightPanelDiv(document.getElementById(RESIZABLE_RIGHT_PANEL_ID))
  }, [])

  // disconnected alert
  useEffect(() => {
    if (isDisconnected) {
      toast({
        variant: 'destructive',
        description: '協同編輯服務連接失敗，請刷新頁面重試～',
      })
    }
  }, [isDisconnected, toast])

  if (isConnectedTimeout) {
    return (
      <div className="mx-10">
        <p className="text-sm text-muted-foreground">
          協同編輯服務連接失敗，請刷新頁面重試~
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-2 mx-10">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    )
  }

  return (
    <>
      {isDisconnected && (
        <div className="mx-10 mb-6 text-red-500">
          協同編輯服務連接失敗，請刷新頁面重試～
        </div>
      )}
      <div ref={menuContainerRef}>
        <EditorContent editor={editor} />
        <ContentMenu editor={editor} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColMenu editor={editor} appendTo={menuContainerRef} />
      </div>
      {rightPanelDiv &&
        createPortal(<AIIsland editor={editor} />, rightPanelDiv)}
    </>
  )
}

export default TiptapEditor
