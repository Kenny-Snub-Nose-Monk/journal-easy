'use client'
import { useState, useEffect } from 'react'
import { Share } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
interface IProps {
  id: string
  defaultIsShared?: boolean
  disabled?: boolean
  className?: string
}
export default function ShareDocButton(props: IProps) {
  const {
    id,
    defaultIsShared = false,
    className = '',
    disabled = false,
  } = props
  const [isShared, setIsShared] = useState(defaultIsShared)
  const [url, setUrl] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    setUrl(location.href)
    setPassword(Math.random().toString().slice(-5))
  }, [id])
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    copy(`【划水AI】分享文檔\n連結：${url}\n密碼：${password}`)
    setCopied(true)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={isShared ? 'secondary' : 'ghost'}
          size="sm"
          className={cn('focus-visible:ring-transparent', className)}
          disabled={disabled}
        >
          <Share className="h-4 w-4 mr-1" />
          分享
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <h3 className="mb-3 text-lg font-bold">分享給他人協同編輯</h3>
        <p className="mb-2">連結</p>
        <div className="mb-3">
          <Input
            type="text"
            readOnly
            value={url}
            className="w-full focus-visible:ring-transparent"
          />
        </div>
        <p className="mb-2">密碼</p>
        <div className="mb-3">
          <Input
            type="text"
            readOnly
            value={password}
            className="w-full focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Button size="sm" onClick={handleCopy} disabled={copied}>
            {copied ? '已複製' : '複製'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
