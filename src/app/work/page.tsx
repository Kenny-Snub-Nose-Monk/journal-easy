import { db } from '@/db/db'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/lib/session'
import { DEFAULT_NEW_DOC_CONTENT } from '@/constants'

export default async function Work() {
  // Get user info
  const user = await getUserInfo()
  if (user == null || !user.id) {
    redirect('/')
  }

  // Get first doc
  const firstDoc = await db.doc.findFirst({
    where: { userId: user.id, isDeleted: false },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  // If there is a doc, redirect to it
  if (firstDoc != null) {
    redirect(`/work/${firstDoc?.id}`)
  }

  const count = await db.doc.count({
    where: { userId: user.id }, // 不限制 delete
  })
  if (count > 0) {
    // 有文檔，但是都是刪除狀態
    redirect(`/work/0`)
  }
  // 找不到任何文檔，則新建文檔
  const newDoc = await db.doc.create({
    data: {
      userId: user.id,
      title: '滑水 AI 是什么',
      content: DEFAULT_NEW_DOC_CONTENT,
    },
  })

  redirect(`/work/${newDoc.id}`)
}
