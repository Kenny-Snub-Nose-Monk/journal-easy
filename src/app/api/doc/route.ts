import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '@/app/api/utils/gen-res-data'

// 創建 doc
export async function POST(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())
  const body = await request.json()
  const { id = undefined, title = '', content = '', parentId = null } = body
  try {
    await db.doc.create({
      data: {
        id,
        title,
        content,
        parentId,
        userId: user.id!,
      },
    })
    return Response.json(genSuccessData())
  } catch (ex) {
    console.error('Create doc error', ex)
    return Response.json(genErrorData('Create doc error'))
  }
}
