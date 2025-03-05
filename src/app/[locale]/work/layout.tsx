import { Link, redirect } from '@/i18n/routing'
import { getUserInfo } from '@/lib/session'
import { isMobileDevice } from '@/lib/isMobileDevice'
// import { isUserInvited } from '@/app/invitation-code/action'
import { getTranslations } from 'next-intl/server'
import { useLocale } from 'next-intl'
export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = await isMobileDevice()
  const t = await getTranslations('common')
  const locale = useLocale()
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p>
          <Link href="/" className="font-bold underline">
            {t('brandName')}
          </Link>
          , {t('notSupportMobile')}
        </p>
      </div>
    )
  }

  const user = await getUserInfo()

  if (user == null) {
    redirect({ href: '/user-info', locale })
  }

  // 先略過邀請碼的設定
  // const isInvited = await isUserInvited(user.id)

  // if (!isInvited) {
  //   redirect('/invitation-code')
  //   return null
  // }

  return <>{children}</>
}
