import { useState, useEffect, useMemo } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { updateIsStar } from '@/app/[locale]/work/[id]/client-action'
import { useDocsStore } from '@/stores/docs-store'

interface IProps {
  id: string
  disabled?: boolean
  className?: string
}
export default function StarDocButton(props: IProps) {
  const { id, className = '', disabled = false } = props
  const { toast } = useToast()

  // 監聽 isStar 狀態
  const docs = useDocsStore((s) => s.docs)
  const updateDocIsStar = useDocsStore((s) => s.updateDocIsStar)
  const isStar = useMemo(
    () => docs.find((i) => i.id === id)?.isStar,
    [docs, id]
  )

  async function handleUpdateIsStar() {
    const newIsStar = !isStar
    const res = await updateIsStar(id, newIsStar)
    if (res.errno !== 0) {
      toast({
        variant: 'destructive',
        title: '錯誤',
        description: res.msg,
      })
      return
    }
    // 更新本地狀態
    updateDocIsStar(id, newIsStar)
  }
  return (
    <Button
      variant={isStar ? 'secondary' : 'ghost'}
      size="sm"
      onClick={handleUpdateIsStar}
      className={cn('focus-visible:ring-transparent', className)}
      disabled={disabled}
    >
      <Star className="h-4 w-4 mr-1" />
      {isStar ? '已收藏' : '收藏'}
    </Button>
  )
}
