'use server'

import { db } from '@/db/db'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/lib/session'

export async function getDocList() {
  const user = await getUserInfo()
  if (user == null) return []

  const list = db.doc.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
    },
    where: {
      userId: user.id || '',
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return list || []
}

export async function del(id: string) {
  const user = await getUserInfo()
  if (!user || !user.id) return

  // 刪除
  await db.doc.delete({
    where: {
      id,
      userId: user.id,
    },
  })

  const list = await getDocList()
  const idList = list.map((doc) => doc.id)
  const otherId = idList.find((i) => i !== id)

  redirect(`/work/${otherId}`)
}
