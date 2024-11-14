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
