import { signOut } from 'auth'
import { post } from '@/lib/ajax'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function SignOutButton({
  children,
  className,
  size,
  variant,
}: {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'lg'
  variant?:
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | null
}) {
  const t = useTranslations('userInfo')

  async function onClick() {
    const text = t('logoutConfirm')
    const c = confirm(text)
    if (!c) return

    try {
      await post('/api/user/sign-out', {})
    } catch (e) {}
    console.log('sign out')
    location.href = '/'
  }

  return (
    <div className="w-full">
      <Button
        className={className}
        size={size}
        variant={variant}
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}
