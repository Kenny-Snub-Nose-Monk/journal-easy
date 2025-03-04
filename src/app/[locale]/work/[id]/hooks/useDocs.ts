import { useState, useEffect, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { useToast } from '@/components/ui/use-toast'
import { nav, getDescendantsIds } from '../@directory/util'
import { post, patch, IAjaxRes } from '@/lib/ajax'
import { useDocsStore } from '@/stores/docs-store'
import { useUserStore } from '@/stores/user-store'

export default function useDocs() {
  const { toast } = useToast()
  const docs = useDocsStore((s) => s.docs)
  const setCreating = useDocsStore((s) => s.setCreating)
  const addDoc = useDocsStore((s) => s.addDoc)
  const removeDoc = useDocsStore((s) => s.removeDoc)
  const curDocId = useDocsStore((s) => s.curDocId)
  const userInfo = useUserStore((s) => s.userInfo)

  // 創建文檔
  const createDoc = useCallback(
    (opt?: { parentId: string | null }) => {
      const { parentId = null } = opt || {}
      const newId = uuid()

      if (userInfo == null) {
        throw new Error('User info is required')
      }

      // add doc, update docs
      addDoc({
        id: newId,
        title: '',
        parentId,
        sharePassword: null,
        userId: userInfo.id,
      })

      // 跳轉
      nav(newId)

      // 異步創建
      setCreating(true)
      post('/api/doc', { id: newId, parentId }).then((resData: IAjaxRes) => {
        if (resData.errno === 0) {
          setCreating(false)
          return
        }

        // 提示錯誤
        toast({
          variant: 'destructive',
          description: resData.msg || '創建失敗',
        })
        setTimeout(() => {
          location.href = '/work/0'
        }, 1500)
      })
    },
    [addDoc, toast, userInfo, setCreating]
  )

  // 刪除文檔
  const deleteDoc = useCallback(
    (id: string) => {
      // 找到所有下級節點 ids
      const descendantsIds = getDescendantsIds(id, docs)
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

      // remove doc, update docs
      removeDoc(id)

      // 跳轉頁面
      if (id === curDocId) {
        const remainList = docs.filter((i) => !ids.includes(i.id))
        const length = remainList.length
        if (length === 0) nav('0')
        else nav(remainList[length - 1].id) // 跳轉到 list 最後一個
      }
    },
    [docs, removeDoc, toast, curDocId]
  )

  return { createDoc, deleteDoc }
}
