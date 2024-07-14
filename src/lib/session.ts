import 'server-only' // 標注只在服務端使用（客户端组件引入會報錯）
import { auth } from 'auth'

export async function getUserInfo() {
  const session = await auth()

  if (!session?.user) {
    return null
  }

  return session.user // 格式如 { id, name, email, image }
}
