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

  redirect(`/work/${newDoc.uid}`)
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
