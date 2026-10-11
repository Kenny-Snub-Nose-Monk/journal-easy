import { z } from 'zod'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import { genSuccessData, genErrorData, genUnAuthData } from '@/app/api/utils/gen-res-data'
import { sendEmail } from '@/lib/mailer'

const updateDocSchema = z
  .object({
    title: z.string().max(100).optional(),
    icon: z.string().max(64).nullable().optional(),
    content: z.string().max(2_000_000).optional(),
    isStar: z.boolean().optional(),
    contentBinaryBase64: z
      .string()
      .max(8_000_000)
      .regex(/^[A-Za-z0-9+/]*={0,2}$/)
      .optional(),
    expectedContent: z.string().optional(),
  })
  .strict()

// 获取单个 doc 内容
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserInfo()
  if (!user?.id) return Response.json(genUnAuthData(), { status: 401 })

  const { id } = params

  try {
    const doc = await db.doc.findUnique({
      where: { id, isDeleted: false, OR: [{ userId: user.id }, { shareRelations: { some: { userId: user.id } } }] },
    })
    if (doc == null) {
      return Response.json(genErrorData('Doc not found'))
    }
    return Response.json(genSuccessData(doc))
  } catch (ex: any) {
    console.error('Get doc error', ex)
    sendEmail({ subject: 'Get doc error', text: ex.message || 'error' })
    return Response.json(genErrorData('Get doc error 獲取文檔錯誤'))
  }
}

// 更新单个 doc 内容
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  const { id } = params
  const parsed = updateDocSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json(genErrorData('Update payload invalid'), { status: 400 })
  try {
    const { contentBinaryBase64, expectedContent, ...data } = parsed.data
    if (data.content !== undefined) {
      try {
        const content = JSON.parse(data.content)
        if (content?.type !== 'doc') throw new Error('Invalid document')
      } catch {
        return Response.json(genErrorData('Invalid document JSON'), { status: 400 })
      }
    }
    const writable = await db.doc.findFirst({
      where: {
        id,
        isDeleted: false,
        OR: [{ userId: user.id }, { shareRelations: { some: { userId: user.id, access: 'WRITE' } } }],
      },
      select: { id: true },
    })
    if (!writable) return Response.json(genErrorData('Doc not found'), { status: 404 })
    const result = await db.doc.updateMany({
      where: { id, isDeleted: false, ...(expectedContent !== undefined ? { content: expectedContent } : {}) },
      data: {
        ...data,
        ...(contentBinaryBase64 !== undefined ? { contentBinary: Buffer.from(contentBinaryBase64, 'base64') } : {}),
      },
    })
    if (!result.count)
      return Response.json(genErrorData('Document changed in another tab. Reload to recover your draft.'), {
        status: 409,
      })
    return Response.json(genSuccessData())
  } catch (ex: any) {
    console.error('Update doc error', ex)
    sendEmail({ subject: 'Update doc error', text: ex.message || 'error' })
    return Response.json(genErrorData('Update doc error 更新失敗'))
  }
}
