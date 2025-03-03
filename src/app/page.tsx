import Link from 'next/link'
import { Zap, User, Code } from 'lucide-react'
import HomeNav from '@/components/home-nav'
import Slogan from '@/components/Slogan'
import StartButton from '@/components/start-button'
import { Button } from '@/components/ui/button'
import SignInButton from '@/components/sigin-in-button'
import { getUserInfo } from '@/lib/session'
// import QRCode from '@/components/QRCode'
// import { isUserInvited } from '@/app/invitation-code/action'

export default async function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <div className="flex flex-col justify-center text-start md:text-center mx-6">
        <section className="md:flex md:justify-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold">滑水 AI ，</h2>
          <h2 className="text-4xl lg:text-5xl mt-2 md:mt-0">
            智能寫作，高效工作
          </h2>
        </section>
        <Slogan />
        <section className="mt-10 flex justify-center space-x-4">
          <MainButton />
          <LearnButton />
        </section>
      </div>
      {/* <div className="w-32 md:w-48 fixed bottom-2 right-2">
        <QRCode />
      </div> */}
    </main>
  )
}

async function MainButton() {
  const user = await getUserInfo()
  if (user == null) {
    return (
      <SignInButton className="text-base" size="lg">
        <User className="h-4 w-4" />
        &nbsp;登錄 / 註冊
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
