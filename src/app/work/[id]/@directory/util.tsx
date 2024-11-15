import emitter from '@/lib/emitter'

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
export function nav(id: string) {
  const url = `/work/${id}`
  emitter.emit('NAV_DOC', { id })
  history.pushState({ docId: id }, '', url)
}
if (typeof window !== 'undefined') {
  const handlePopState = (event: PopStateEvent) => {
    emitter.emit('NAV_DOC', { id: event.state.docId })
  }
  window.addEventListener('popstate', handlePopState) // 只能綁定一次
}
