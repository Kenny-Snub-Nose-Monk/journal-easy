import Link from 'next/link'

import SignInButton from '@/components/sigin-in-button'
import { Button } from '@/components/ui/button'
import { Zap, User, Code } from 'lucide-react'
import { getUserInfo } from '@/lib/session'

export async function StartButton() {
  const user = await getUserInfo()

  if (user == null) {
    return (
      <SignInButton className="text-base" size="lg">
        <Zap className="h-4 w-4 mr-1" />
        驗證邀請碼
      </SignInButton>
    )
  }

  // @ts-ignore
  if (!user.isInvited) {
    return (
      <Link href="/invitation-code">
        <Button className="text-base" size="lg">
          <Code className="h-4 w-4 mr-1" />
          驗證邀請碼
        </Button>
      </Link>
    )
  }

  const lastDocId = (user as any).lastDocId || ''

  return (
    <Link href={`/work/${lastDocId}`}>
      <Button className="text-base" size="lg">
        <Zap className="h-4 w-4" />
        &nbsp;開始使用
      </Button>
    </Link>
  )
}

export function LearnButton() {
  return (
    <Link href="/join">
      <Button variant="secondary" className="text-base" size="lg">
        <Code className="h-4 w-4 mr-1" />
        學習/參與開發
      </Button>
    </Link>
  )
}
