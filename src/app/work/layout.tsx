import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/lib/session'
import { isMobileDevice } from '@/lib/isMobileDevice'
// import { isUserInvited } from '@/app/invitation-code/action'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = await isMobileDevice()

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p>
          <Link href="/" className="font-bold underline">
            滑水 AI
          </Link>
          ，暫不支持移動端瀏覽器～
        </p>
      </div>
    )
  }

  const user = await getUserInfo()

  if (user == null) {
    redirect('/user-info')
  }

  // 先略過邀請碼的設定
  // const isInvited = await isUserInvited(user.id)

  // if (!isInvited) {
  //   redirect('/invitation-code')
  //   return null
  // }

  return <>{children}</>
}
