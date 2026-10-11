import { readFile } from 'node:fs/promises'
import { localUploadPath } from '@/lib/storage'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'

const mime: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
}
export async function GET(_request: Request, { params }: { params: { path: string[] } }) {
  const user = await getUserInfo()
  const [files, owner, images, filename, ...rest] = params.path
  if (
    files !== 'files' ||
    !owner?.startsWith('u-') ||
    images !== 'imgs' ||
    rest.length ||
    !/^[a-f0-9-]+\.(png|jpe?g|webp|gif)$/.test(filename || '')
  ) {
    return new Response('Not found', { status: 404 })
  }
  const url = `/api/media/${params.path.join('/')}`
  const own = owner === `u-${user?.id}`
  const published =
    !own &&
    (await db.pubDoc.findFirst({
      where: { userId: owner.slice(2), status: 'PUBLISHED', htmlContent: { contains: url } },
      select: { id: true },
    }))
  const shared =
    !own &&
    !published &&
    user?.id &&
    (await db.doc.findFirst({
      where: {
        userId: owner.slice(2),
        isDeleted: false,
        content: { contains: url },
        shareRelations: { some: { userId: user.id } },
      },
      select: { id: true },
    }))
  if (!own && !published && !shared) return new Response('Not found', { status: 404 })
  try {
    const data = await readFile(localUploadPath(params.path.join('/')))
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': mime[filename.split('.').pop()!],
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
