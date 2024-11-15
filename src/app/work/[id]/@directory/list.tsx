'use client'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Item from './item'
import { useToast } from '@/hooks/use-toast'
import emitter from '@/lib/emitter'
import { nav } from './util'
import { IDoc } from './type'

interface ListProps {
  defaultParamId: string
  defaultList: IDoc[]
}
export default function List({ defaultParamId, defaultList }: ListProps) {
  const { toast } = useToast()

  const [paramId, setParamId] = useState(defaultParamId)

  useEffect(() => {
    const eventKey = 'NAV_DOC'
    function handler(payload: any) {
      const { id } = payload || {}
      if (!id) return
      setParamId(id)
    }
    emitter.on(eventKey, handler)
    return () => {
      emitter.off(eventKey, handler) // 及時清理自定義事件
    }
  }, [])

  const [list, setList] = useState(defaultList)

  // 创建文档
  function createDoc(parentId: string | null = null) {
    const newId = uuid()

    // 更新列表
    setList([
      ...list,
      {
        id: newId,
        title: '',
        parentId,
      },
    ])

    // 跳转
    nav(newId, 'create')

    // 異步創建
    fetch('/api/doc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: newId, parentId }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.errno !== 0) {
          toast({
            variant: 'destructive',
            description: resData.msg || '創建失敗',
          })
          return
        }
      })
  }
  return (
    // <div className="h-[1000px]">
    <>
      {/* render list */}
      {list
        .filter((i) => i.parentId == null) // 頂級目錄
        .map((doc) => {
          const { id, title } = doc
          return (
            <Item
              key={id}
              id={id}
              defaultTitle={title}
              paramId={paramId}
              list={list}
              onCreateDoc={createDoc}
            />
          )
        })}
      {/* create button */}
      <Button
        className="w-full justify-start px-0.5 font-bold"
        variant="ghost"
        onClick={() => createDoc()}
      >
        <Plus className="h-4 w-4 mr-1" />
        創建文檔
      </Button>
    </>
  )
}
