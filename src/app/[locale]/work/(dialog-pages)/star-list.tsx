'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IDoc } from '@/stores/docs-store'
import { timeAgo } from '@/lib/dt'
import { get } from '@/lib/ajax'
import scrollIntoView from 'scroll-into-view-if-needed'
import debounce from 'lodash.debounce'
import useBindKeyPress from '../hooks/useBindKeyPress'
import { cn } from '@/lib/utils'

export default function StarList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2 h-9" variant="ghost">
          <Star className="h-4 w-4 mr-1" />
          收藏夾
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>收藏夾</DialogTitle>
        </DialogHeader>
        <StarListTable />
      </DialogContent>
    </Dialog>
  )
}

function StarListTable() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<IDoc[]>([])

  // 搜索
  // eslint-disable-next-line
  const searchFn = useCallback(
    debounce(async (keyword: string) => {
      const url = `/api/doc?isStar=1&keyword=${keyword}`
      setLoading(true)
      const { data: list } = await get(url)
      setList(list)
      setLoading(false)
    }, 500),
    []
  )

  useEffect(() => {
    searchFn(keyword)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 搜索關鍵字
  const [keyword, setKeyword] = useState('')
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newKeyword = e.target.value
    setCurrentIndex(-1)
    setKeyword(newKeyword)
    searchFn(newKeyword)
  }

  // 點擊，跳轉
  function handleClick(doc: IDoc) {
    const { id } = doc
    location.href = `/work/${id}`
  }

  // 監聽鍵盤上下鍵和回車鍵，返回當前激活的文檔的索引 currentIndex
  const { currentIndex, setCurrentIndex } = useBindKeyPress({
    list,
    handleClick,
    setKeyword,
  })

  return (
    <div className="h-96 flex flex-col">
      <div className="h-10 my-2">
        <Input
          value={keyword}
          onChange={handleChange}
          maxLength={20}
          placeholder="搜索標題..."
          className="focus-visible:ring-transparent"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="h-96">
            <p className="mt-10 text-center text-muted-foreground">
              loading...
            </p>
          </div>
        )}
        {!loading && list.length === 0 && (
          <div className="h-96">
            <p className="mt-10 text-center text-muted-foreground">暫無數據</p>
          </div>
        )}
        {!loading && list.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-60">標題</TableHead>
                <TableHead>更新時間</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((doc, docIndex) => {
                return (
                  <Item
                    key={doc.id}
                    doc={doc}
                    currentIndex={currentIndex}
                    docIndex={docIndex}
                    handleClick={handleClick}
                  />
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

interface ItemProps {
  doc: IDoc
  docIndex: number
  currentIndex: number
  handleClick: (doc: IDoc) => void
}

// 單獨拆分出 Item 組件，使得列表元素過多並需要滾動時，滾動到超出視口的文章
function Item(props: ItemProps) {
  const { doc, docIndex, currentIndex, handleClick } = props
  const isCurrent = currentIndex === docIndex
  const tableRowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    if (!isCurrent) return
    if (tableRowRef.current == null) return
    scrollIntoView(tableRowRef.current!, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
    })
  }, [isCurrent])

  // 緩存一下更新時間，防止鍵盤上下鍵選擇的時候，由於父組件重新渲染，導致更新時間頻繁重複渲染
  const time = useMemo(() => {
    return timeAgo(doc.updatedAt || null)
  }, [doc.updatedAt])

  return (
    <TableRow
      ref={tableRowRef}
      key={doc.id}
      className={cn('cursor-pointer', isCurrent && 'bg-muted')}
      onClick={() => handleClick(doc)}
    >
      <TableCell>
        <p className="w-60 overflow-hidden truncate">
          {doc.title || '<無標題>'}
        </p>
      </TableCell>
      <TableCell>{time}</TableCell>
    </TableRow>
  )
}
