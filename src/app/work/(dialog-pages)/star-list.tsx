'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Star } from 'lucide-react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IDoc } from '@/app/work/[id]/@directory/type'
import { timeAgo } from '@/lib/dt'
import { get } from '@/lib/ajax'

export default function StarList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2  h-8" variant="ghost">
          <Star className="h-4 w-4 mr-1" />
          收藏夹
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>收藏夹</DialogTitle>
          <DialogDescription asChild>
            <StarListTable />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function StarListTable() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<IDoc[]>([])
  // 加载数据
  const load = useCallback(async () => {
    const url = `/api/doc?isStar=1`
    const { data: list } = await get(url)
    return list
  }, [])

  useEffect(() => {
    load().then((l) => {
      setList(l)
      setLoading(false)
    })
  }, [load])

  // 搜尋關鍵字
  const [keyword, setKeyword] = useState('')
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newKeyword = e.target.value
    setKeyword(newKeyword)
  }
  // 點擊，跳轉
  function handleClick(id: string) {
    router.push('/work/' + id)
  }
  if (loading) {
    return (
      <div className="h-96">
        <p className="mt-10 text-center text-muted-foreground">loading...</p>
      </div>
    )
  }
  if (!loading && list.length === 0) {
    return (
      <div className="h-96">
        <p className="mt-10 text-center text-muted-foreground">暫無數據</p>
      </div>
    )
  }
  return (
    <div className="h-96 overflow-y-auto">
      <div className="my-2">
        <Input
          value={keyword}
          onChange={handleChange}
          maxLength={20}
          placeholder="搜索標題..."
          className="focus-visible:ring-transparent"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-auto">標題</TableHead>
            <TableHead>更新時間</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list
            .filter((i) => i.title.includes(keyword))
            .map((doc) => (
              <TableRow
                key={doc.id}
                className="cursor-pointer"
                onClick={() => handleClick(doc.id)}
              >
                <TableCell>
                  <p className="overflow-hidden truncate">
                    {doc.title || '<無標題>'}
                  </p>
                </TableCell>
                <TableCell>{timeAgo(doc.updatedAt || '')}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
