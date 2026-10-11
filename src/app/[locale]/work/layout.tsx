import { Link, redirect } from '@/i18n/routing'
import { getUserInfo } from '@/lib/session'
import { isMobileDevice } from '@/lib/isMobileDevice'
import { getTranslations } from 'next-intl/server'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = await isMobileDevice()
  const t = await getTranslations('common')

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p>
          <Link href="/" className="font-bold underline">
            {t('brandName')} AI
          </Link>
          , {t('notSupportMobile')}
        </p>
      </div>
    )
  }

  const user = await getUserInfo()
  if (user == null) {
    redirect('/user-info')
    return null
  }

  return <>{children}</>
}
