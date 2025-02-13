import { useState, useEffect, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { useToast } from '@/hooks/use-toast'
import emitter from '@/lib/emitter'
import { getDescendantsIds, nav } from '../util'
import { IDoc } from '../type'
import {
  EVENT_KEY_CREATE_DOC,
  EVENT_KEY_DEL_DOC,
  EVENT_KEY_CHANGE_IS_STAR,
} from '@/constants'
import { post, patch, IAjaxRes } from '@/lib/ajax'

export default function useList(defaultList: IDoc[], paramId: string) {
  const { toast } = useToast()
  const [list, setList] = useState(defaultList)
  // 創建文檔
  const createDoc = useCallback(
    (parentId: string | null = null) => {
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
      // 跳轉
      nav(newId, 'create')
      // 異步創建
      post('/api/doc', { id: newId, parentId }).then((resData: IAjaxRes) => {
        if (resData.errno === 0) return
        toast({
          variant: 'destructive',
          description: resData.msg || '創建失敗',
        })

        setTimeout(() => {
          location.href = '/work/0'
        }, 1500)
      })
    },
    [list, toast]
  )
  // 創建文檔 - 綁定自定義事件
  useEffect(() => {
    function handleCreate(payload: any) {
      const { parentId = null } = payload || {}
      createDoc(parentId)
    }
    emitter.on(EVENT_KEY_CREATE_DOC, handleCreate)
    return () => {
      emitter.off(EVENT_KEY_CREATE_DOC, handleCreate) // 及時清除自定義事件
    }
  }, [createDoc])

  // 刪除文檔
  const deleteDoc = useCallback(
    (id: string) => {
      // 找到所有下級節點 ids
      const descendantsIds = getDescendantsIds(id, list)
      // 要刪除的所有 ids ，包括當前節點
      const ids = [...descendantsIds, id]
      // 異步執行軟刪除
      patch('/api/doc', { ids, data: { isDeleted: true } }).then(
        (resData: IAjaxRes) => {
          if (resData.errno !== 0) {
            toast({
              variant: 'destructive',
              description: resData.msg || '刪除失敗',
            })
            return
          }
          toast({
            description: `已刪除 ${ids.length} 個文檔，放在回收站`,
          })
        }
      )
      // 更新 list
      const remainList = list.filter((i) => !ids.includes(i.id))
      setList(remainList)
      // 跳轉頁面
      if (id === paramId) {
        const length = remainList.length
        if (length === 0) nav('0')
        else nav(remainList[length - 1].id) // 跳轉到 list 最後一個
      }
    },
    [list, toast, paramId]
  )
  // 刪除文檔 - 綁定自定義事件
  useEffect(() => {
    function handleDel(payload: any) {
      const { id } = payload || {}
      if (id) deleteDoc(id)
    }
    emitter.on(EVENT_KEY_DEL_DOC, handleDel)
    return () => {
      emitter.off(EVENT_KEY_DEL_DOC, handleDel) // 及時清除自定義事件
    }
  }, [deleteDoc])

  // 監聽 isStar 變化
  useEffect(() => {
    function handler(payload: any) {
      const { isStar = false, id: docId = '' } = payload
      if (!docId) return
      setList((prevList) => {
        return prevList.map((i) => {
          if (i.id === docId) return { ...i, isStar }
          return i
        })
      })
    }
    emitter.on(EVENT_KEY_CHANGE_IS_STAR, handler)
    return () => emitter.off(EVENT_KEY_CHANGE_IS_STAR, handler) // 及时銷毀自定義事件
  }, [])
  return { list }
}
