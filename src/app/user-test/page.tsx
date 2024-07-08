import { auth, signIn, signOut } from 'auth'
import { Button } from '@/components/ui/button'

export default async function UserTestPage() {
  const session = await auth()

  if (!session?.user)
    return (
      <div>
        <SignInButton />
      </div>
    )

  return (
    <div>
      <p>session: {JSON.stringify(session)}</p>
      <SignOutButton />
    </div>
  )
}

// 登录 按钮
function SignInButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signIn()
      }}
    >
      <Button>Sign In</Button>
    </form>
  )
}

// 登出 按钮
function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
      className="w-full"
    >
      <Button>Sign Out</Button>
    </form>
  )
}
