import { getUserInfo } from '@/lib/session'
import { genSuccessData, genUnAuthData } from '../../utils/gen-res-data'

export async function GET() {
  const user = await getUserInfo()

  if (!user) {
    return Response.json(genUnAuthData())
  }

  return Response.json(genSuccessData({ id: user.id }))
}
