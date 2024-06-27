'use server'

import { db } from '@/db/db'
import { redirect } from 'next/navigation'

export async function create() {
  const newDoc = await db.doc.create({
    data: {
      title: '新建檔案',
      content: '檔案内容...',
    },
  })

  redirect(`/work/${newDoc.id}`)
}

export async function getDocList() {
  const list = db.doc.findMany({
    select: {
      id: true,
      title: true,
    },
  })

  return list || []
}
