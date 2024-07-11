'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db/db'

export async function getDoc(id: string) {
  try {
    const doc = await db.doc.findUnique({
      where: { id },
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
  try {
    await db.doc.update({
      where: { id },
      data,
    })

    revalidatePath(`/work/${id}`)
  } catch (ex) {
    console.error(ex)
  }
}
