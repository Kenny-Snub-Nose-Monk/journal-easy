'use server'

import { db } from '@/db/db'
import { getUserInfo } from '@/lib/session'

export async function getDocList() {
  const user = await getUserInfo()
  if (user == null) return []

  const list = db.doc.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
      isStar: true,
    },
    where: {
      userId: user.id || '',
      isDeleted: false,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return list || []
}
