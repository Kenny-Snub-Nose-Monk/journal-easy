import { type NextRequest } from 'next/server'
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

// 更新多個 docs
export async function PATCH(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  const body = await request.json()
  const { ids = [], data = {} } = body

  try {
    await db.doc.updateMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
      data,
    })
    return Response.json(genSuccessData())
  } catch (ex) {
    console.error('Delete docs error', ex)
    return Response.json(genErrorData('Delete docs error'))
  }
}

// 獲取多個 docs
export async function GET(request: NextRequest) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  const searchParams = request.nextUrl.searchParams
  const isDeleted = searchParams.get('isDeleted') // 是否軟刪除

  const list = await db.doc.findMany({
    select: {
      id: true,
      title: true,
      parentId: true, // ? 為什麼要是 true??
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      userId: user.id || '',
      isDeleted: !!isDeleted,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return Response.json(genSuccessData(list || []))
}

// 刪除多個 docs
export async function DELETE(request: NextRequest) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  const body = await request.json()
  const { ids = [] } = body

  try {
    // 真實刪除
    await db.doc.deleteMany({
      where: {
        id: { in: ids },
        userId: user.id,
      },
    })
    return Response.json(genSuccessData())
  } catch (ex) {
    console.error('Delete docs error', ex)
    return Response.json(genErrorData('Delete docs error'))
  }
}
