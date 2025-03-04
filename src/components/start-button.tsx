'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LAST_DOC_ID_KEY } from '@/constants'
import { useTranslations } from 'next-intl'

export default function StartButton() {
  const [lastDocId, setLastDocId] = useState('')
  const homeTrans = useTranslations('home')

  useEffect(() => {
    const lastDocId = localStorage.getItem(LAST_DOC_ID_KEY)
    if (lastDocId) {
      setLastDocId(lastDocId)
    }
  }, [])

  return (
    <Link href={lastDocId ? `/work/${lastDocId}` : '/work/'}>
      <Button className="text-base" size="lg">
        <Zap className="h-4 w-4 mr-1" />
        {homeTrans('getStarted')}
      </Button>
    </Link>
  )
}
