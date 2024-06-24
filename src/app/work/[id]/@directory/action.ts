'use server'

import { db } from '@/db/db'

export async function create() {
  await db.doc.create({
    data: {
      title: '新建檔案',
      content: '檔案内容...',
    },
  })
}
