import HomeNav from '@/components/home-nav'
import { getUserInfo } from '@/lib/session'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { checkInvitationCode } from './action'
import Link from 'next/link'

export default async function InvitationPage() {
  console.log('InvitationPage')

  const user = await getUserInfo()
  if (user == null)
    return (
      <Wrapper>
        <Link href="/" className="underline text-xl">
          尚未登錄，請到首頁登錄
        </Link>
      </Wrapper>
    )
  // @ts-ignore
  if (user.isInvited) {
    return (
      <Wrapper>
        <p>你已經被邀請了</p>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <div className="flex-col ">
        <p className="text-sm mb-4">
          項目在內測階段，需要邀請碼才能進入。如無邀請碼，請聯繫管理員申請，加
          vx：
          <code className="text-muted-foreground">fe-wfp</code>
          ，備註：“劃水測試”。
        </p>
        <form
          action={checkInvitationCode}
          className="flex space-x-2 w-60 mx-auto"
        >
          <Input name="invitationCode" placeholder="請輸入邀請碼" />
          <Button type="submit">提交</Button>
        </form>
      </div>
    </Wrapper>
  )
}

// 容器
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center">
      <HomeNav />
      {children}
    </div>
  )
}
