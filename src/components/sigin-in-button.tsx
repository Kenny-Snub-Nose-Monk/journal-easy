'use client'

// import { Link } from '@/i18n/routing'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function getHref() {
  if (typeof location === 'undefined') return ''
  return location.href
}

export default function SignInButton({
  children,
  className,
  size,
}: {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'lg'
}) {
  const href = getHref()
  const url = `/auth/signin?callbackUrl=${encodeURIComponent(href)}`

  return (
    <Button className={className} size={size} asChild>
      <Link href={url}>{children}</Link>
    </Button>
  )
}
