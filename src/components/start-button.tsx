'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LAST_DOC_ID_KEY } from '@/constants'
export default function StartButton() {
  const [lastDocId, setLastDocId] = useState('')
  useEffect(() => {
    const lastDocId = localStorage.getItem(LAST_DOC_ID_KEY)
    if (lastDocId) {
      setLastDocId(lastDocId)
    }
  }, [])
  return (
    <Link href={lastDocId ? `/work/${lastDocId}` : '/work/'}>
      <Button className="text-base" size="lg">
        <Zap className="h-4 w-4" />
        &nbsp;開始使用
      </Button>
    </Link>
  )
}
