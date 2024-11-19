import emitter from '@/lib/emitter'
import { EVENT_KEY_NAV_DOC } from '@/constants'
import { IDoc } from './type'

// 判斷一個節點，是否是另一個節點的下級
export function isDescendant(id: string, descendantId: string, list: IDoc[]) {
  let curId = descendantId
  while (curId) {
    curId = list.find((i) => i.id === curId)?.parentId || '' // 父級目錄
    if (curId === id) return true
  }
  return false
}

// 跳轉鏈接 切換文檔
export function nav(id: string, type: 'nav' | 'create' = 'nav') {
  const url = `/work/${id}`
  emitter.emit(EVENT_KEY_NAV_DOC, { id, type })
  history.pushState({ docId: id }, '', url)
}

if (typeof window !== 'undefined') {
  const handlePopState = (event: PopStateEvent) => {
    emitter.emit(EVENT_KEY_NAV_DOC, { id: event.state.docId })
  }
  window.addEventListener('popstate', handlePopState) // 只能綁定一次
}

// 找到所有下級節點
export function getDescendantsIds(id: string, list: IDoc[]) {
  const res: string[] = []
  list.forEach((doc) => {
    const { id: itemId } = doc
    if (isDescendant(id, itemId, list)) res.push(itemId)
  })
  return res
}
