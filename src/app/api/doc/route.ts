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

  console.log('searchParams', searchParams)

  // 是否軟刪除
  const isDeletedParam = searchParams.get('isDeleted')
  const isDeleted = isDeletedParam === null ? undefined : !!isDeletedParam
  // 是否收藏
  let isStarParam = searchParams.get('isStar')
  const isStar = isStarParam === null ? undefined : !!isStarParam

  // 搜索關鍵字
  const keyword = searchParams.get('keyword') || null

  console.log({
    userId: user.id || '',
    isDeleted: isDeleted,
    isStar: isStar,
    title: keyword ? { contains: keyword } : undefined,
  })

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
      isDeleted: isDeleted,
      isStar: isStar,
      title: keyword ? { contains: keyword } : undefined,
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
