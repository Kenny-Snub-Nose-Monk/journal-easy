import { db } from '@/db/db'
import { getUserInfo } from '@/lib/session'
import { sendErrorAlert } from '@/lib/mailer'

export async function getDoc(id: string) {
  try {
    const user = await getUserInfo()
    if (user == null) return null

    const doc = await db.doc.findUnique({
      where: { id, isDeleted: false },
      select: {
        title: true,
        isStar: true,
        userId: true,
      },
    })

    return {
      doc,
      user,
    }
  } catch (err: any) {
    console.error('getDoc error: ', err)
    sendErrorAlert(err, 'getDoc error')
    return null
  }
}
