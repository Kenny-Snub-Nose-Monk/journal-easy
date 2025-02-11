import { db } from '@/db/db'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/lib/session'

export default async function Work() {
  let pathname = '/work/0'

  const user = await getUserInfo()
  if (user && user.id) {
    const firstDoc = await db.doc.findFirst({
      where: { userId: user.id, isDeleted: false },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    if (firstDoc != null) pathname = `/work/${firstDoc?.id}` // 找到第一篇文檔，然後跳轉過去
  }

  redirect(pathname)

  // return (
  //   <Wrapper>
  //     <Link href={pathname} className="underline">
  //       跳轉到 {pathname}
  //     </Link>
  //   </Wrapper>
  // )
}

// function Wrapper({ children }: { children: React.ReactNode }) {
//   return <div>{children}</div>
// }
