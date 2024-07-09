import { db } from '@/db/db'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Work() {
  //找到第一篇檔案, 然後跳轉過去
  const firstDoc = await db.doc.findFirst({
    orderBy: {
      updatedAt: 'desc',
    },
  })

  let pathname = '/work/0'
  if (firstDoc != null) pathname = `/work${firstDoc?.uid}`

  redirect(pathname)

  return (
    <Wrapper>
      <Link href={pathname} className="underline">
        跳轉到 {pathname}
      </Link>
    </Wrapper>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
