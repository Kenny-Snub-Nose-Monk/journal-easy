'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db/db'

export async function getDoc(uid: string) {
  try {
    const doc = await db.doc.findUnique({
      where: { uid },
    })
    return doc
  } catch (ex) {
    return null
  }
}

export async function updateDoc(
  uid: string,
  data: { title?: string; content?: string }
) {
  try {
    await db.doc.update({
      where: { uid },
      data,
    })

    revalidatePath(`/work/${uid}`)
  } catch (ex) {
    console.error(ex)
  }
}
