import { FileText, Plus } from 'lucide-react'
import { create } from './action'
import CreateSubmitButton from './CreateSubmitButton'

export default function Directory({ params }: { params: { id: string } }) {
  return (
    <div className=" h-[800px]">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className="inline-flex items-center w-full p-2 py-1 cursor-pointer hover:bg-card hover:text-secondary-foreground"
        >
          <FileText className="h-4 w-4" />
          &nbsp;动物农场{i} {params.id}
        </div>
      ))}
      <form action={create}>
        <CreateSubmitButton />
      </form>
    </div>
  )
}
