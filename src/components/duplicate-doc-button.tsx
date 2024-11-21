'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'
import { post } from '@/lib/ajax'
interface IProps {
  id: string
  className?: string
}
export default function DuplicateDocButton(props: IProps) {
  const { id, className = '' } = props
  const { toast } = useToast()
  const router = useRouter()
  const handlerClick = useCallback(async () => {
    const { errno, data, msg } = await post('/api/doc', { originId: id })
    if (errno !== 0) {
      toast({
        variant: 'destructive',
        description: msg || '創建失敗',
      })
      return
    }
    router.push(`/work/${data.id}`) // 跳轉
  }, [id, toast, router])
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start p-2 h-8', className)}
      onClick={handlerClick}
    >
      <Copy className="w-4 h-4 mr-1" />
      複製
    </Button>
  )
}
