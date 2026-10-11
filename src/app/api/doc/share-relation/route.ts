import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import { genSuccessData, genErrorData, genUnAuthData } from '../../utils/gen-res-data'
import { sendEmail } from '@/lib/mailer'

// create doc share relation
export async function POST(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  // get body
  const body = await request.json()
  const { email, access, docId, docTitle } = body

  if (!['READ', 'WRITE'].includes(access)) return Response.json(genErrorData('Invalid access'), { status: 400 })
  const owned = await db.doc.findFirst({
    where: { id: docId, userId: user.id, isDeleted: false },
    select: { id: true },
  })
  if (!owned) return Response.json(genErrorData('Doc not found'), { status: 404 })

  // check email
  const userByEmail = await db.user.findUnique({ where: { email } })
  if (userByEmail == null) return Response.json(genErrorData('User not found by email 根據郵箱未找到用戶'))

  const { id, name: userName } = userByEmail

  // create share relation
  try {
    const shareRelation = await db.shareRelation.create({
      data: {
        docId,
        authorId: user.id as string,
        userId: id,
        access,
        noticeType: 'NEW',
      },
    })

    // send email - async
    sendEmail({
      subject: `Journal Easy: "${user.name || user.email}" 分享給你一篇文檔 share a document with you`,
      text: `Document name "${docTitle}", please check it in ${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'journal-easy.com'} .`,
      toEmail: email,
    })

    return Response.json(genSuccessData({ shareRelation, userName }))
  } catch (err) {
    console.log('Create share relation error ', err)
    return Response.json(genErrorData('Something went wrong, try again please.'))
  }
}

// delete share relation
export async function DELETE(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  // get id from request body
  const body = await request.json()
  const { id, docTitle, email } = body

  // delete from db
  try {
    await db.shareRelation.delete({
      where: { id, authorId: user.id },
    })

    // send email - async
    sendEmail({
      subject: `Journal Easy: "${user.name}" 取消了你的文檔分享 canceled a document sharing`,
      text: `Document name "${docTitle}", please check it in ${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'journal-easy.com'} .`,
      toEmail: email,
    })

    return Response.json(genSuccessData())
  } catch (err) {
    console.log('Delete share relation error ', err)
    return Response.json(genErrorData('Something went wrong, try again please.'))
  }
}

export async function PATCH(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  // get body
  const body = await request.json()
  const { id, noticeType } = body

  // update db
  try {
    await db.shareRelation.update({
      where: { id, userId: user.id },
      data: { noticeType },
    })
    return Response.json(genSuccessData())
  } catch (err) {
    console.log('Update share relation error ', err)
    return Response.json(genErrorData('Something went wrong, try again please.'))
  }
}
