'use client'
import { useState, useEffect, useCallback } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { getDescendantsIds } from '../[id]/@directory/util'
import { getDoc, updateParentId } from '../[id]/client-action'
import { get, patch, del as ajaxDelete } from '@/lib/ajax'
import { useTranslations } from 'next-intl'

export default function Trash() {
  const t = useTranslations('trash')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2 h-9" variant="ghost">
          <Trash2 className="h-4 w-4 mr-1" />
          {t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('desc')}</DialogDescription>
        </DialogHeader>
        <TrashTable />
      </DialogContent>
    </Dialog>
  )
}
function TrashTable() {
  const { toast } = useToast()
  const t = useTranslations('trash')
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
      console.log('load trash list', l)
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
    // 所有下級文檔
    const descendantsIds = getDescendantsIds(id, list)
    const ids = [...descendantsIds, id]

    const { errno, msg } = await patch('/api/doc', {
      ids,
      data: { isDeleted: false },
    })

    // 判斷 parentId 文檔是否還存在，可能被刪除了
    if (parentId) {
      const parentDoc = await getDoc(parentId)
      if (parentDoc == null) {
        // 未找到 parentDoc ，則先設置 parentId 未 null
        await updateParentId(id, null)
      }
    }

    if (errno === 0) {
      location.href = `/work/${id}`
    } else {
      toast({
        variant: 'destructive',
        description: msg || t('failed'),
      })
    }
  }
  // 徹底刪除
  function del(id: string) {
    const confirmText = t('confirm')
    if (!confirm(confirmText)) return
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
        <p className="mt-10 text-center text-muted-foreground">
          {t('notFound')}
        </p>
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
          placeholder={t('inputPlaceholder')}
          className="focus-visible:ring-transparent"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-auto">{t('docTitle')}</TableHead>
            <TableHead className="w-24">{t('docDelTime')}</TableHead>
            <TableHead className="text-right w-24">{t('operation')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list
            .filter((i) => i.title.includes(keyword))
            .map((doc) => (
              <TableRow key={doc.id} className="group">
                <TableCell>
                  <p className="overflow-hidden truncate">
                    {doc.title || t('unTitled')}
                  </p>
                </TableCell>
                <TableCell>{timeAgo(doc.updatedAt || null)}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex space-x-1 invisible group-hover:visible">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2 h-7"
                      onClick={() => restore(doc.id, doc.parentId)}
                    >
                      {t('restore')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="px-2 h-7"
                      onClick={() => del(doc.id)}
                    >
                      {t('delete')}
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
