'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Search as SearchIcon,
  FileText,
  Trash2,
  FileSearch,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import debounce from 'lodash.debounce'
import { get } from '@/lib/ajax'
import { IDoc } from '@/stores/docs-store'
import scrollIntoView from 'scroll-into-view-if-needed'
import useBindKeyPress from '../hooks/useBindKeyPress'

export default function Search() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2 h-9" variant="ghost">
          <SearchIcon className="h-4 w-4 mr-1" />
          搜尋
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>搜尋</DialogTitle>
        </DialogHeader>
        <SearchPanel />
      </DialogContent>
    </Dialog>
  )
}

function SearchPanel() {
  // input elem
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current!.focus()
  })

  // search keyword
  const [keyword, setKeyword] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value
    setLoading(true)
    // 重置選擇文檔的狀態
    setCurrentIndex(-1)
    setKeyword(newKeyword)
    searchFn(newKeyword)
  }

  // eslint-disable-next-line
  const searchFn = useCallback(
    debounce(async (keyword: string) => {
      if (keyword.trim().length === 0) {
        setList([])
        setLoading(false)
        return
      }

      const url = `/api/doc?keyword=${keyword}`
      const { data: list } = await get(url)
      setList(list)
      setLoading(false)
    }, 500),
    []
  )

  // search result
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState<IDoc[]>([])
  const notFound = !loading && list.length === 0 && keyword.trim().length > 0

  // item click
  function handleClick(doc: IDoc) {
    const { isDeleted, id } = doc
    if (isDeleted) return
    location.href = `/work/${id}`
  }

  // 監聽鍵盤上下鍵和回車鍵，返回當前激活的文檔的索引 currentIndex
  const { currentIndex, setCurrentIndex } = useBindKeyPress({
    list,
    setKeyword,
    handleClick,
  })

  return (
    <div className="h-96 flex flex-col">
      <div className="h-10 flex items-center border rounded p-1 pl-2 mt-3">
        <SearchIcon className=" text-muted-foreground" />
        <Input
          ref={inputRef}
          value={keyword}
          onChange={handleChange}
          placeholder="輸入關鍵字..."
          className="border-none py-0 px-1 h-8 focus-visible:ring-transparent"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {keyword.trim().length === 0 && (
          <div className="text-muted-foreground opacity-50 flex items-center justify-center h-60">
            <FileSearch className="w-16 h-16" />
          </div>
        )}
        {loading && (
          <p className="text-muted-foreground text-center mt-8">loading...</p>
        )}
        {notFound && (
          <p className="text-muted-foreground text-center mt-8">未找到內容</p>
        )}
        {!loading && list.length > 0 && (
          <div className="mt-4">
            {list.map((doc: IDoc, docIndex: number) => {
              return (
                <Item
                  key={doc.id}
                  doc={doc}
                  handleClick={handleClick}
                  currentIndex={currentIndex}
                  docIndex={docIndex}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

interface ItemProps {
  doc: IDoc
  handleClick: (doc: IDoc) => void
  currentIndex: number
  docIndex: number
}

// 單獨拆分出 Item 組件，使得列表元素過多並需要滾動時，滾動到超出視口的文章
function Item(props: ItemProps) {
  const { doc, handleClick, currentIndex, docIndex } = props
  const isCurrent = currentIndex === docIndex
  const titleContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCurrent) return
    if (titleContainerRef.current == null) return
    scrollIntoView(titleContainerRef.current!, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
    })
  }, [isCurrent])

  return (
    <div
      ref={titleContainerRef}
      key={doc.id}
      onClick={() => handleClick(doc)}
      className={cn(
        `flex items-center text-muted-foreground hover:bg-muted text-lg p-1 cursor-pointer`,
        doc.isDeleted ? 'line-through cursor-not-allowed' : '',
        isCurrent ? 'bg-muted' : ''
      )}
    >
      {doc.isDeleted ? (
        <Trash2 className="h-4 w-4 mr-1" />
      ) : (
        <FileText className="h-4 w-4 mr-1" />
      )}
      <p className="flex-auto truncate">{doc.title}</p>
    </div>
  )
}
