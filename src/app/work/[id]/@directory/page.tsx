import Link from 'next/link'
import { FileText } from 'lucide-react'
import { create, getDocList } from './action'
import CreateSubmitButton from './CreateSubmitButton'
import { cn } from '@/lib/utils'

export default async function Directory({
  params,
}: {
  params: { id: string }
}) {
  const list = await getDocList()

  return (
    <div>
      {list.map((doc) => {
        const { uid, title } = doc
        let isCurrent = false

        if (uid === params.id) isCurrent = true

        return (
          <Link
            href={`/work/${uid}`}
            key={uid}
            className={cn(
              'inline-flex items-center w-full p-2 py-1 cursor-pointer hover:text-secondary-foreground',
              isCurrent ? 'bg-card' : 'hover:bg-card'
            )}
          >
            <FileText className="h-4 w-4" />
            &nbsp;{title || '<無標題>'}
          </Link>
        )
      })}

      <form action={create}>
        <CreateSubmitButton />
      </form>
    </div>
  )
}
