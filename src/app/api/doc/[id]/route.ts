import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '@/app/api/utils/gen-res-data'
import { sendErrorAlert } from '@/lib/mailer'

// 添加這個條件檢查
if (process.env.NODE_ENV === 'development') {
  db.$connect()
}

// 獲取單個 doc 内容
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())
  const { id } = params
  try {
    const doc = await db.doc.findUnique({
      where: { id, userId: user.id, isDeleted: false },
    })
    if (doc == null) {
      return Response.json(genErrorData('Doc not found'))
    }
    return Response.json(genSuccessData(doc))
  } catch (ex: any) {
    console.error('Get doc error', ex)
    sendErrorAlert(ex, 'Get doc error')
    return Response.json(genErrorData('Get doc error'))
  }
}

// 更新單個 doc 内容
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())
  const { id } = params
  const body = await request.json()
  try {
    await db.doc.update({
      where: { id, userId: user.id, isDeleted: false },
      data: body,
    })
    return Response.json(genSuccessData())
  } catch (ex) {
    sendErrorAlert(ex, 'Update doc error')
    return Response.json(genErrorData('update doc error'))
  }
}
