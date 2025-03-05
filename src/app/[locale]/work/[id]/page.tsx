import { redirect } from '@/i18n/routing'
import ContentWrapper from './(content)/wrapper'
import { getUserInfo } from '@/lib/session'
import { useLocale } from 'next-intl'
import { User } from 'next-auth'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id
  const locale = useLocale()

  const userInfo = await getUserInfo()
  if (userInfo == null) {
    redirect({ href: '/user-info', locale })
  }

  return <ContentWrapper id={id} userInfo={userInfo as User} />
}
