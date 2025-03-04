'use client'

import { useState, useEffect, useCallback } from 'react'
import { MoveUpRight, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { get, patch } from '@/lib/ajax'
import { IDoc } from '@/stores/docs-store'
import { isDescendant } from '@/app/[locale]/work/[id]/@directory/util'

export default function MoveDocButton(props: {
  id: string
  className?: string
}) {
  const { id, className = '' } = props
  const [parentId, setParentId] = useState<null | string>(null)
  const { toast } = useToast()

  async function handleClick() {
    if (parentId === '') return // 可以是 null ，但不能是空字符串
    const url = `/api/doc/${id}`
    const { errno, msg } = await patch(url, { parentId })
    if (errno !== 0) {
      toast({
        variant: 'destructive',
        description: msg || '更新失败',
      })
    }
    location.href = location.href // router.refresh() 只刷新服務端組件，不會更改客戶端組件狀態，這裏先用簡單粗暴的刷新來代替
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn('w-full justify-start p-2 h-8', className)}
        >
          <MoveUpRight className="w-4 h-4 mr-1" />
          移動
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>移動</DialogTitle>
          <DialogDescription>移動到選中文檔的下級</DialogDescription>
        </DialogHeader>
        <SelectParentDoc curId={id} onSelectParentId={setParentId} />
        <DialogFooter>
          <Button onClick={handleClick}>移動</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SelectParentDoc(props: {
  curId: string
  onSelectParentId: (parentId: string | null) => void
}) {
  const { curId, onSelectParentId } = props

  const [selectedId, setSelectedId] = useState<null | string>(null)
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])

  // 加载文档列表
  useEffect(() => {
    const url = '/api/doc?isDeleted=false'
    get(url).then((res) => {
      const { errno, data = [], msg } = res
      if (errno !== 0) {
        console.error('move error', msg)
      }

      console.log('List!!!!!!!!!', data)

      setList(data)
      setLoading(false)
    })
  }, [])

  function handleSelect(sid: string | null) {
    setSelectedId(sid)
    onSelectParentId(sid)
  }

  if (loading) {
    return (
      <div className="h-80">
        <p className="mt-10 text-center text-muted-foreground">loading...</p>
      </div>
    )
  }

  if (!loading && list.length === 0) {
    return (
      <div className="h-80">
        <p className="mt-10 text-center text-muted-foreground">暫無數據</p>
      </div>
    )
  }

  return (
    <div className="h-80 overflow-y-auto">
      <div
        className={cn(
          'flex items-center cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground py-0.5 px-1',
          selectedId == null ? 'bg-muted font-bold text-foreground' : ''
        )}
        onClick={() => handleSelect(null)}
      >
        {list.length > 0 && <ChevronDown className="w-4 h-4 mr-1" />}
        {list.length === 0 && <FileText className="w-4 h-4 mr-1" />}
        <p>根目錄</p>
      </div>
      {list.length > 0 && (
        <div className="ml-3">
          {list
            .filter((i: IDoc) => i.parentId == null)
            .map((doc: IDoc) => (
              <Item
                key={doc.id}
                doc={doc}
                selectedId={selectedId}
                list={list}
                curId={curId}
                onSelect={handleSelect}
              />
            ))}
        </div>
      )}
    </div>
  )
}

function Item(props: {
  doc: IDoc
  selectedId: string | null
  onSelect: (id: string) => void
  list: IDoc[]
  curId: string
}) {
  const { doc, selectedId, list = [], curId, onSelect } = props

  const children = list.filter((i: IDoc) => i.parentId === doc.id)
  const hasChildren = children.length > 0

  const isDescendantDoc = isDescendant(curId, doc.id, list)

  function handleClick() {
    if (doc.id === curId) return // 不能選中自己
    if (isDescendantDoc) return // 不能選中下級
    onSelect(doc.id)
  }

  return (
    <>
      <div
        className={cn(
          'flex items-center cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground py-0.5 px-1',
          curId === doc.id ? 'cursor-not-allowed' : '',
          isDescendantDoc ? 'cursor-not-allowed' : '',
          doc.id === selectedId ? 'bg-muted font-bold text-foreground' : ''
        )}
        onClick={handleClick}
      >
        {hasChildren && <ChevronDown className="w-4 h-4 mr-1" />}
        {!hasChildren && <FileText className="w-4 h-4 mr-1" />}
        <p className="flex-auto truncate">{doc.title || '<無標題>'}</p>
      </div>
      {hasChildren && (
        <div className="ml-3">
          {children.map((d: IDoc) => (
            <Item
              key={d.id}
              doc={d}
              selectedId={selectedId}
              curId={curId}
              list={list}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  )
}
