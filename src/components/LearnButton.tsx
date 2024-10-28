import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Code } from 'lucide-react'

export default function LearnButton() {
  return (
    <Link href="/join">
      <Button variant="secondary" className="text-base" size="lg">
        <Code className="h-4 w-4 mr-1" />
        學習並參與開發
      </Button>
    </Link>
  )
}
