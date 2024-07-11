'use server'

import { db } from '@/db/db'
import { redirect } from 'next/navigation'

export async function create() {
  const newDoc = await db.doc.create({
    data: {
      title: '新建檔案' + Date.now().toString().slice(-4),
      content: '檔案内容...',
    },
  })

  redirect(`/work/${newDoc.id}`)
}

export async function getDocList() {
  const list = db.doc.findMany({
    select: {
      id: true,
      uid: true,
      title: true,
    },
    orderBy: {
      id: 'asc',
    },
  })

  return list || []
}

export async function del(id: string) {
  // 刪除
  await db.doc.delete({
    where: {
      id,
    },
  })

  const list = await getDocList()
  const idList = list.map((doc) => doc.id)
  const otherId = idList.find((id) => id !== id)

  redirect(`/work/${otherId}`)
}
