'use server'

import { db } from '@/db/db'
import { sendErrorAlert } from '@/lib/mailer'
import { getUserInfo } from '@/lib/session'

export async function getDocList() {
  try {
    const user = await getUserInfo()
    if (user == null || user.id === '') return []
    const list = await db.doc.findMany({
      select: {
        id: true,
        title: true,
        parentId: true,
        isStar: true,
        sharePassword: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId: user.id,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    return list || []
  } catch (err: any) {
    console.error('getDocList error: ', err)
    sendErrorAlert(err, 'getDocList error')
    return []
  }
}

export async function getShareRelations() {
  const user = await getUserInfo()
  if (user == null || user.id === '') return []

  const shareRelations = await db.shareRelation.findMany({
    where: {
      userId: user.id,
    },
    include: {
      doc: {
        select: {
          id: true,
          title: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  })

  return shareRelations
}
