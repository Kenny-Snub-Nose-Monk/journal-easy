import { useLocale, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Zap, User, Code } from 'lucide-react'
import HomeNav from '@/components/home-nav'
import Slogan from '@/components/home-slogan'
import StartButton from '@/components/start-button'
import { Button } from '@/components/ui/button'
import SignInButton from '@/components/sigin-in-button'
import { getUserInfo } from '@/lib/session'

// import QRCode from '@/components/QRCode'
// import { isUserInvited } from '@/app/invitation-code/action'

export default function Home() {
  const homeTrans = useTranslations('home')
  const commonTrans = useTranslations('common')
  const locale = useLocale()

  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
        <span className="font-extrabold">{commonTrans('brandName')} AI</span>，
        {homeTrans('slogan')}
      </h2>
      <Slogan text={homeTrans('subTitle')} />
      <section className="mt-10 flex justify-center space-x-4">
        <MainButton />
        {/* {locale === 'zh-tw' && <LearnButton />} */}
      </section>
    </main>
  )
}

async function MainButton() {
  const user = await getUserInfo()
  const homeTrans = await getTranslations('home')

  if (user == null) {
    return (
      <SignInButton className="text-base" size="lg">
        <User className="h-4 w-4" />
        &nbsp;{homeTrans('login')} / {homeTrans('register')}
      </SignInButton>
    )
  }

  return <StartButton />

  // const isInvited = await isUserInvited(user.id)

  // if (isInvited) {
  //   return <StartButton />
  // }
  // return (
  //   <a href="/invitation-code">
  //     <Button className="text-base" size="lg">
  //       <Zap className="h-4 w-4 mr-1" />
  //       申请試用，驗證邀請碼
  //     </Button>
  //   </a>
  // )
}
function LearnButton() {
  return (
    <Link href="/join">
      <Button variant="secondary" className="text-base" size="lg">
        <Code className="h-4 w-4 mr-1" />
        學習項目/參與開發
      </Button>
    </Link>
  )
}
