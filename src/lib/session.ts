import 'server-only' // 標注只在服務端使用（客户端组件引入會報錯）
import { auth } from 'auth'
import { cache } from 'react'

async function getUserInfoFn() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return session.user // 格式如 { id, name, email, image }
}

export const getUserInfo = cache(getUserInfoFn)
