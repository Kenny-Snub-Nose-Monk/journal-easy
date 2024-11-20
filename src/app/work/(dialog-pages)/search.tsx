'use client'
import { useRouter } from 'next/navigation'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import debounce from 'lodash.debounce'
import { get } from '@/lib/ajax'
import { IDoc } from '../[id]/@directory/type'

export default function Search() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2 h-9" variant="ghost">
          <SearchIcon className="h-4 w-4 mr-1" />
          搜索
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>搜索</DialogTitle>
          <DialogDescription asChild>
            <SearchPanel />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
function SearchPanel() {
  const router = useRouter()
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
      console.log('url', url)
      console.log('list', list)
      setList(list)
      setLoading(false)
    }, 500),
    []
  )
  // search result
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const notFound = !loading && list.length === 0 && keyword.trim().length > 0

  // item click
  function handleClick(doc: IDoc) {
    const { isDeleted, id } = doc
    if (isDeleted) return
    router.push(`/work/${id}`)
  }
  return (
    <div className="h-96 overflow-y-auto">
      <div className="flex items-center border rounded p-1 pl-2 mt-3">
        <SearchIcon className=" text-muted-foreground" />
        <Input
          ref={inputRef}
          value={keyword}
          onChange={handleChange}
          placeholder="輸入關鍵字..."
          className="border-none py-0 px-1 h-8 focus-visible:ring-transparent"
        />
      </div>
      <div>
        {keyword.trim().length === 0 && (
          <div className="text-muted-foreground opacity-50 flex items-center justify-center h-60">
            <FileSearch className="w-16 h-16" />
          </div>
        )}
        {loading && (
          <p className="text-muted-foreground text-center mt-8">loading...</p>
        )}
        {notFound && (
          <p className="text-muted-foreground text-center mt-8">未找到内容</p>
        )}
        {!loading && list.length > 0 && (
          <div className="mt-4">
            {list.map((doc: IDoc) => (
              <div
                key={doc.id}
                onClick={() => handleClick(doc)}
                className={cn(
                  `flex items-center text-muted-foreground hover:bg-muted text-lg p-1 cursor-pointer`,
                  doc.isDeleted ? 'line-through cursor-not-allowed' : ''
                )}
              >
                {doc.isDeleted ? (
                  <Trash2 className="h-4 w-4 mr-1" />
                ) : (
                  <FileText className="h-4 w-4 mr-1" />
                )}
                <p className="flex-auto truncate">{doc.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
