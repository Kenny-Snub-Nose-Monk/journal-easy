import { redirect } from '@/i18n/routing'
import ContentWrapper from './(content)/wrapper'
import { getUserInfo } from '@/lib/session'
import { User } from 'next-auth'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  const userInfo = await getUserInfo()
  if (userInfo == null) {
    redirect('/user-info')
  }

  return <ContentWrapper id={id} userInfo={userInfo as User} />
}
