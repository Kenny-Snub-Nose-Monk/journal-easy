import { type NextRequest } from 'next/server'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '@/app/api/utils/gen-res-data'
import { MAX_DOC_COUNT } from '@/constants'
import { sendErrorAlert } from '@/lib/mailer'

// 創建 doc
export async function POST(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  // 當前文檔數量
  const docCount = await db.doc.count({
    where: {
      userId: user.id,
      isDeleted: false,
    },
  })
  if (docCount > MAX_DOC_COUNT) {
    return Response.json(genErrorData(`最多只能創建 ${MAX_DOC_COUNT} 個文檔`))
  }

  const body = await request.json()
  let {
    originId,
    id = undefined,
    title = '',
    content = '',
    parentId = null,
  } = body

  // 從 originId 複製一個
  if (originId) {
    const originDoc = await db.doc.findUnique({
      where: { id: originId },
    })
    if (originDoc == null) {
      return Response.json(genErrorData('Origin doc not found'))
    }

    title = originDoc.title + ' 复制'
    content = originDoc.content
    parentId = originDoc.parentId
  }

  // 創建 doc
  try {
    const doc = await db.doc.create({
      data: {
        id,
        title,
        content,
        parentId,
        userId: user.id!,
      },
    })
    return Response.json(genSuccessData(doc))
  } catch (ex) {
    console.error('Create doc error', ex)
    sendErrorAlert(ex, 'Create doc error')
    return Response.json(genErrorData('Create doc error'))
  }
}

// 更新多个 docs
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

  // 是否軟刪除
  const isDeletedParam = searchParams.get('isDeleted') // '0' 或 '1'
  let isDeletedFlag: boolean | null = null
  if (isDeletedParam === '0') isDeletedFlag = false
  if (isDeletedParam === '1') isDeletedFlag = true

  // 徹底刪除 回收站 30 天之前的文檔
  if (isDeletedFlag) {
    await deleteDocsBefore30Days()
  }

  // 是否收藏
  let isStarParam = searchParams.get('isStar') // '0' 或 '1'
  let isStarFlag: boolean | null = null
  if (isStarParam === '0') isStarFlag = false
  if (isStarParam === '1') isStarFlag = true

  // 搜索關鍵字
  const keyword = searchParams.get('keyword') || null

  // where 條件
  const whereOpt: any = {
    isDeleted: false, // 默認
  }
  if (isDeletedFlag != null) {
    if (isDeletedFlag) {
      whereOpt.isDeleted = true
    } else {
      whereOpt.isDeleted = false
    }
  }
  if (isStarFlag != null) {
    if (isStarFlag) {
      whereOpt.isStar = true
    } else {
      whereOpt.isStar = false
    }
  }
  if (keyword != null) {
    whereOpt.title = {
      contains: keyword,
    }
  }

  const list = await db.doc.findMany({
    select: {
      id: true,
      title: true,
      parentId: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      userId: user.id || '',
      ...whereOpt,
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

// 回收站 30 天之前的文檔，徹底刪除
async function deleteDocsBefore30Days() {
  const user = await getUserInfo()
  if (user == null) return

  const now = new Date()
  const before30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  await db.doc.deleteMany({
    where: {
      userId: user.id,
      isDeleted: true,
      updatedAt: {
        lt: before30Days,
      },
    },
  })
}
