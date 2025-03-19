import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import {
  genSuccessData,
  genErrorData,
  genUnAuthData,
} from '../../utils/gen-res-data'

// create doc share relation
export async function POST(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  // get body
  const body = await request.json()
  const { email, access, docId } = body

  // check email
  const userByEmail = await db.user.findUnique({ where: { email } })
  if (userByEmail == null)
    return Response.json(
      genErrorData('User not found by email 根據mail未找到用戶')
    )

  const { id, name: userName } = userByEmail

  // create share relation
  try {
    const shareRelation = await db.shareRelation.create({
      data: {
        docId,
        authorId: user.id!,
        userId: id,
        access,
        noticeType: 'NEW',
      },
    })
    return Response.json(genSuccessData({ shareRelation, userName }))
  } catch (err) {
    console.log('Create share relation error ', err)
    return Response.json(
      genErrorData('Something went wrong, try again please.')
    )
  }
}

// delete share relation
export async function DELETE(request: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  // get id from request body
  const body = await request.json()
  const { id } = body

  // delete from db
  try {
    await db.shareRelation.deleteMany({
      where: { id },
    })
    return Response.json(genSuccessData())
  } catch (err) {
    console.log('Delete share relation error ', err)
    return Response.json(
      genErrorData('Something went wrong, try again please.')
    )
  }
}
