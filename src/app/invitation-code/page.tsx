import HomeNav from '@/components/home-nav'
import { getUserInfo } from '@/lib/session'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { checkInvitationCode } from './action'
// import GenerateCode from './generate-code'
import Link from 'next/link'
import { db } from '@/db/db'
// import { isUserInvited } from './action'

export default async function InvitationPage() {
  const user = await getUserInfo()

  if (user == null)
    return (
      <Wrapper>
        <Link href="/" className="underline text-xl">
          尚未登錄，請到首頁登錄
        </Link>
      </Wrapper>
    )

  // 管理员，邮箱先写死
  // const isAdmin = ['wangfupeng1988@163.com'].includes(user.email || '')
  // let codes: string[] = []
  // if (isAdmin) {
  //   const res = await db.invitationCode.findMany()
  //   codes = res.map((item) => item.code)
  // }

  // @ts-ignore
  // const isInvited = await isUserInvited(user.id)
  // if (isInvited) {
  //   return (
  //     <Wrapper>
  //       <div>
  //         <p>
  //           你已经被邀请了，
  //           <Link href="/" className="underline">
  //             返回首页
  //           </Link>
  //         </p>
  //         {isAdmin && (
  //           <div className="mt-6 p-4 py-2 bg-gray-100">
  //             <p>邀请码：</p>
  //             <ul className="text-basic my-4">
  //               {codes.map((code) => (
  //                 <li key={code}>{code}</li>
  //               ))}
  //             </ul>
  //             <GenerateCode />
  //           </div>
  //         )}
  //       </div>
  //     </Wrapper>
  //   )
  // }
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
