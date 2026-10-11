'use client'

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
  size?: 'sm' | 'lg' | 'default' | 'icon' | null
}) {
  const href = getHref()
  const url = `/api/auth/signin?callbackUrl=${encodeURIComponent(href)}`

  return (
    <Button className={className} size={size} asChild>
      <Link role="sign-in-link" href={url}>
        {children}
      </Link>
    </Button>
  )
}
