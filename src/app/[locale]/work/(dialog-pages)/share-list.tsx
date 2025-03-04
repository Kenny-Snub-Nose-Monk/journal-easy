'use client'

import { useState, useEffect } from 'react'
import { FileOutput } from 'lucide-react'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IDoc } from '@/stores/docs-store'
import { get } from '@/lib/ajax'

export default function ShareList() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2 h-9" variant="ghost">
          <Users className="h-4 w-4 mr-1" />
          協同文件
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>我的分享</DialogTitle>
        </DialogHeader>
        <ShareListContent />
      </DialogContent>
    </Dialog>
  )
}

function ShareListContent() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<IDoc[]>([])

  // Load data
  useEffect(() => {
    const url = '/api/doc/shared-docs'
    get(url).then(({ data = [] }) => {
      setList(data)
      setLoading(false)
    })
  }, [])

  function handleClick(doc: IDoc) {
    const { id } = doc
    location.href = `/work/${id}`
  }

  return (
    <div className="h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="text-muted-foreground text-center mt-8">loading...</p>
        )}
        {!loading && list.length > 0 && (
          <div className="mt-4">
            {list.map((doc: IDoc) => {
              return (
                <div
                  key={doc.id}
                  onClick={() => handleClick(doc)}
                  className="flex items-center text-muted-foreground hover:bg-muted text-lg p-1 cursor-pointer"
                >
                  <FileOutput className="h-4 w-4 mr-1" />
                  <p className="flex-auto truncate">{doc.title}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
