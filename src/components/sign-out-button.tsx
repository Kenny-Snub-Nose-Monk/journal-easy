import { signOut } from 'auth'
import { Button } from '@/components/ui/button'

export default function SignOutButton({
  children,
  className,
  size,
}: {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'lg'
}) {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
      className="w-full"
    >
      <Button className={className} size={size}>
        {children}
      </Button>
    </form>
  )
}
