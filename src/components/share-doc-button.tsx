'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { patch } from '@/lib/ajax'
import { useDocsStore } from '@/stores/docs-store'

interface IProps {
  id: string
  defaultSharePassword?: string
  disabled?: boolean
  className?: string
}

export default function ShareDocButton(props: IProps) {
  const { id, className = '', disabled = false } = props
  const [url, setUrl] = useState('')
  const docs = useDocsStore((s) => s.docs)
  const updateDocSharePassword = useDocsStore((s) => s.updateDocSharePassword)
  const sharePassword = useMemo(
    () => docs.find((i) => i.id === id)?.sharePassword,
    [docs, id]
  )

  // Set url
  useEffect(() => {
    setUrl(location.href)
  }, [])

  // Update server, change password
  async function updatePassword(password: string) {
    setLoading(true)
    updateDocSharePassword(id, password)
    const url = '/api/doc/' + id
    try {
      const res = await patch(url, { sharePassword: password })
      setLoading(false)
      return res
    } catch (err) {
      console.error('update sharePassword error: ', err)
      return null
    }
  }

  // Open share
  const [loading, setLoading] = useState(false)
  async function handleOpenShare() {
    if (sharePassword) return // already shared

    const password = Math.random().toString(36).slice(-5)
    await updatePassword(password)
  }

  // Close share
  async function CloseShare() {
    if (!sharePassword) return // not shared yet
    const confirm = window.confirm('确定取消分享？')
    if (!confirm) return
    await updatePassword('')
  }

  // Copy share link and password
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    copy(`【划水AI】分享文档\n链接：${url}\n密码：${sharePassword}`)
    setCopied(true)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={!!sharePassword ? 'secondary' : 'ghost'}
          size="sm"
          className={cn('focus-visible:ring-transparent', className)}
          disabled={disabled}
        >
          <Share className="h-4 w-4 mr-1" />
          {!!sharePassword ? '已分享' : '分享'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {loading && (
          <div className="h-40 flex flex-col items-center justify-center">
            <p>loading...</p>
          </div>
        )}
        {!sharePassword && !loading && (
          <div className="h-40 flex flex-col items-center justify-center">
            <p className="mb-2">分享给他人协同编辑</p>
            <Button size="sm" onClick={handleOpenShare}>
              开启分享
            </Button>
          </div>
        )}
        {sharePassword && !loading && (
          <div>
            <h3 className="mb-3 text-lg font-bold">分享给他人协同编辑</h3>
            <p className="mb-2">链接</p>
            <div className="mb-3">
              <Input
                type="text"
                readOnly
                value={url}
                className="w-full focus-visible:ring-transparent"
              />
            </div>
            <p className="mb-2">密码</p>
            <div className="mb-3">
              <Input
                type="text"
                readOnly
                value={sharePassword}
                className="w-full focus-visible:ring-transparent"
              />
            </div>
            <div className="flex items-center justify-between ">
              <Button size="sm" onClick={handleCopy} disabled={copied}>
                {copied ? '已复制' : '复制'}
              </Button>
              <Button variant="secondary" onClick={CloseShare}>
                取消分享
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
