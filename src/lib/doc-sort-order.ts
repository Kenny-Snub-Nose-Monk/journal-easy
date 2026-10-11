export const SORT_ORDER_STEP = 1024

type SortableDoc = {
  id: string
  sortOrder?: number | null
}

/** 默认目录排序：sortOrder ASC, id ASC */
export function compareDocsBySortOrder(a: SortableDoc, b: SortableDoc) {
  const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER
  const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER
  if (aOrder !== bOrder) return aOrder - bOrder
  return a.id.localeCompare(b.id)
}

/** 同级末尾：无同级时为 1024，否则为最大值 + 1024 */
export function nextSortOrder(maxSortOrder: number | null | undefined) {
  if (maxSortOrder == null) return SORT_ORDER_STEP
  return maxSortOrder + SORT_ORDER_STEP
}
