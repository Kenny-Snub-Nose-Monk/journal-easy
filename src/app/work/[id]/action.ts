'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db/db'
import { getUserInfo } from '@/lib/session'

export async function getDoc(id: string) {
  const user = await getUserInfo()
  if (!user || !user.id) return null

  try {
    const doc = await db.doc.findUnique({
      where: { id, userId: user.id },
    })
    return doc
  } catch (ex) {
    return null
  }
}

export async function updateDoc(
  id: string,
  data: { title?: string; content?: string }
) {
  const user = await getUserInfo()
  if (!user || !user.id) return null

  try {
    await db.doc.update({
      where: { id, userId: user.id },
      data,
    })

    revalidatePath(`/work/${id}`)
  } catch (ex) {
    console.error(ex)
  }
}
