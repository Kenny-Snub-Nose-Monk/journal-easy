import Link from 'next/link'

import SignInButton from '@/components/sigin-in-button'
import { Button } from '@/components/ui/button'
import { Zap, User } from 'lucide-react'
import { getUserInfo } from '@/lib/session'

export default async function StartButton() {
  const user = await getUserInfo()

  if (user == null) {
    return (
      <SignInButton className="text-base" size="lg">
        <User className="h-4 w-4" />
        &nbsp;登入 / 註冊
      </SignInButton>
    )
  }

  return (
    <Link href="/work">
      <Button className="text-base" size="lg">
        <Zap className="h-4 w-4" />
        &nbsp;開始使用
      </Button>
    </Link>
  )
}
