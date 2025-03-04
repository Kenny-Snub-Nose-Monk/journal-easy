import { redirect } from 'next/navigation'
import ContentWrapper from './(content)/wrapper'
import { getUserInfo } from '@/lib/session'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  const userInfo = await getUserInfo()
  if (userInfo == null) {
    redirect('/user-info')
  }

  return <ContentWrapper id={id} userInfo={userInfo} />
}
