import { db } from '@/db/db'
export default async function MonitorPage() {
  let error = false
  try {
    await db.doc.findFirst({
      where: { isDeleted: false },
      orderBy: {
        updatedAt: 'desc',
      },
      select: { id: true, title: true },
    })
  } catch (err) {
    error = true
  }
  return (
    <div>
      <p>Monitor Page</p>
      <p>{error ? 'error' : 'noError'}</p>
    </div>
  )
}
