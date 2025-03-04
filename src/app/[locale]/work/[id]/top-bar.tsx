'use client'

import { useMemo } from 'react'
import { Ellipsis } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import Logo from '@/components/Logo'
import ChangeTheme from '@/components/change-theme'
import ShareDocButton from '@/components/share-doc-button'
import StarDocButton from '@/components/star-doc-button'
import DocUpdateStatus from '@/components/doc-update-status'
import { Separator } from '@/components/ui/separator'
import DocDeleteButton from '@/components/delete-doc-button'
import DuplicateDocButton from '@/components/duplicate-doc-button'
import MoveDocButton from '@/components/move-doc-button'
import { useDocsStore } from '@/stores/docs-store'
import { useUserStore } from '@/stores/user-store'

export default function TopBar() {
  const docs = useDocsStore((s) => s.docs)
  const id = useDocsStore((s) => s.curDocId)
  const doc = useMemo(() => docs.find((d) => d.id === id), [docs, id])
  const userInfo = useUserStore((s) => s.userInfo)

  return (
    <div className="flex text-secondary-foreground my-1 mx-3 bg-ground pb-1">
      <div className="text-start inline-flex items-center">
        <Logo />
        <DocUpdateStatus id={id} />
      </div>
      <div className="flex-1 text-end">
        {/* 後續再拆分組件 */}
        <div className="inline-flex items-center">
          <ShareDocButton id={id} disabled={doc?.userId !== userInfo?.id} />
          <StarDocButton id={id} disabled={doc?.userId !== userInfo?.id} />
          <TopBarHandlers id={id} disabled={doc?.userId !== userInfo?.id} />
          <ChangeTheme />
        </div>
      </div>
    </div>
  )
}

function TopBarHandlers(props: { id: string; disabled?: boolean }) {
  const { id, disabled = false } = props

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="mx-2"
          disabled={disabled}
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-28 p-1">
        <DuplicateDocButton id={id} />
        <MoveDocButton id={id} />
        <Separator className="my-1" />
        <DocDeleteButton id={id} />
      </PopoverContent>
    </Popover>
  )
}
