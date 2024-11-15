import emitter from '@/lib/emitter'
import { EVENT_KEY_NAV_DOC } from '@/constants'

// 判斷是否展示子節點
export function isShowChildren(
  id: string,
  paramId: string,
  list: Array<{ id: string; parentId: string | null }>
) {
  let curId = paramId
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
