import { type NextRequest } from 'next/server'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '@/app/api/utils/gen-res-data'

export async function GET(request: NextRequest) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())
  const list = await db.doc.findMany({
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      userId: user.id || '',
      isDeleted: false,
      // sharePassword is not null and not empty
      NOT: {
        OR: [
          {
            sharePassword: null,
          },
          {
            sharePassword: '',
          },
        ],
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return Response.json(genSuccessData(list || []))
}
