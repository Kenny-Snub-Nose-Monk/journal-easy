import { type NextRequest } from 'next/server'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import { genSuccessData, genUnAuthData } from '../../utils/gen-res-data'

export async function GET(request: NextRequest) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())
  const searchParams = request.nextUrl.searchParams
  const lastDocId = searchParams.get('lastDocId')
  await db.user.update({
    where: { id: user.id },
    data: {
      lastDocId,
    },
  })
  return Response.json(genSuccessData())
}
