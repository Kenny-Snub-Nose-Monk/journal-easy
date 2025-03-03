import 'server-only' // 標注只在服務端使用（客户端组件引入會報錯）
import { auth } from 'auth'
import { cache } from 'react'
import { db } from '@/db/db'

async function getUserInfoFn() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  const user = session.user // 格式如 { id, name, email, image }
  if (user.email == null) {
    return null
  }

  if (user.id == null) {
    const res = await db.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    })
    if (res == null) {
      return null
    }
    return { ...user, id: res.id }
  }

  return user
}

export const getUserInfo = cache(getUserInfoFn)
