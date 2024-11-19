'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
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
import { IDoc } from '../[id]/@directory/type'
import { timeAgo } from '@/lib/dt'
import { getDescendantsIds } from '../[id]/@directory/util'
import { getDoc, updateParentId } from '../[id]/(content)/client-action'
import { get, patch, del as ajaxDelete } from '@/lib/ajax'

export default function Trash() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2" variant="ghost">
          <Trash2 className="h-4 w-4" />
          &nbsp;&nbsp;回收站
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>回收站</DialogTitle>
          <DialogDescription asChild>
            <TrashTable />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
function TrashTable() {
  const router = useRouter()
  const { toast } = useToast()
  const [list, setList] = useState<IDoc[]>([])
  const [loading, setLoading] = useState(true)

  // 加載數據
  const load = useCallback(async () => {
    const url = `/api/doc?isDeleted=1`
    const { data: list } = await get(url)

    return list
  }, [])
  useEffect(() => {
    load().then((l) => {
      setList(l)
      setLoading(false)
    })
  }, [load])
  // 搜索關鍵字
  const [keyword, setKeyword] = useState('')
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newKeyword = e.target.value
    setKeyword(newKeyword)
  }
  // 恢復
  async function restore(id: string, parentId: string | null) {
    // 判斷 parentId 文檔是否還存在，可能被刪除了
    if (parentId) {
      const parentDoc = await getDoc(parentId)
      if (parentDoc == null) {
        // 未找到 parentDoc ，則先設置 parentId 未 null
        await updateParentId(id, null)
      }
    }
    // 所有下級文檔
    const descendantsIds = getDescendantsIds(id, list)
    const ids = [...descendantsIds, id]

    const { errno, msg } = await patch('/api/doc', {
      ids,
      data: { isDeleted: false },
    })
    if (errno === 0) {
      router.push(`/work/${id}`)
    } else {
      toast({
        variant: 'destructive',
        description: msg || '執行失敗',
      })
    }
  }
  // 徹底刪除
  function del(id: string) {
    if (!confirm('是否徹底刪除該文檔？刪除後不可恢復')) return
    const descendantsIds = getDescendantsIds(id, list)
    const ids = [...descendantsIds, id]
    // 異步刪除
    ajaxDelete('/api/doc', { ids })
    // 更新列表
    setList(list.filter((d) => !ids.includes(d.id)))
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
            <TableHead className="w-24">刪除時間</TableHead>
            <TableHead className="text-right w-24">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list
            .filter((i) => i.title.includes(keyword))
            .map((doc) => (
              <TableRow key={doc.id} className="group">
                <TableCell>
                  <p className="overflow-hidden truncate">
                    {doc.title || '<無標題>'}
                  </p>
                </TableCell>
                <TableCell>{timeAgo(doc.updatedAt || '')}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex space-x-1 invisible group-hover:visible">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 h-7"
                      onClick={() => restore(doc.id, doc.parentId)}
                    >
                      恢復
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="px-2 h-7"
                      onClick={() => del(doc.id)}
                    >
                      刪除
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
