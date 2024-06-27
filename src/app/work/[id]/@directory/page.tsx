import { FileText, Plus } from 'lucide-react'
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
        const { id, title } = doc
        let isCurrent = false

        if (id === parseInt(params.id, 10)) isCurrent = true

        return (
          <div
            key={id}
            className={cn(
              'inline-flex items-center w-full p-2 py-1 cursor-pointer hover:text-secondary-foreground',
              isCurrent ? 'bg-card' : 'hover:bg-card'
            )}
          >
            <FileText className="h-4 w-4" />
            &nbsp;{title}
          </div>
        )
      })}

      <form action={create}>
        <CreateSubmitButton />
      </form>
    </div>
  )
}
