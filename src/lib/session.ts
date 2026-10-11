import 'server-only' // 標記只在伺服器端使用（客戶端組件引入會報錯）
import { auth } from 'auth'
import { db } from '@/db/db'

const ENV = process.env.NODE_ENV

export async function getUserInfo() {
  if (ENV === 'test') return null

  const session = await auth()
  if (!session?.user) {
    return null
  }

  const user = session.user // 格式如 { id, name, email, image }
  if (user.email == null) {
    return null
  }

  if (user.id == null) {
    try {
      const res = await db.user.findUnique({
        where: { email: user.email },
        select: { id: true },
      })
      if (res == null) {
        return null
      }
      return { ...user, id: res.id }
    } catch (e) {
      console.error('get user info error ', e)
      return null
    }
  }
  return user
}
