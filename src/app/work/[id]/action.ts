import { db } from '@/db/db'
import { getUserInfo } from '@/lib/session'
export async function getDoc(id: string) {
  const user = await getUserInfo()
  if (user == null) return null
  const doc = await db.doc.findUnique({
    where: { id, userId: user.id },
  })
  return doc
}
