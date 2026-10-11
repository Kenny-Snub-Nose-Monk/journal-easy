import 'server-only'
import { db } from '@/db/db'
import { nextSortOrder } from './doc-sort-order'

/** 计算指定父级下新建文档的 sortOrder（含软删除同级，避免与回收站冲突） */
export async function getNextSortOrderForParent(userId: string, parentId: string | null) {
  const result = await db.doc.aggregate({
    where: { userId, parentId },
    _max: { sortOrder: true },
  })
  return nextSortOrder(result._max.sortOrder)
}
