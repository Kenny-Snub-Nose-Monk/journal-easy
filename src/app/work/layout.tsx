import { auth } from 'auth'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactDOM
}>) {
  const session = await auth()
  if (!session?.user) {
    redirect('/user-info')
    return null
  }

  return <>{children}</>
}
