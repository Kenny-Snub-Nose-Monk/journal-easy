import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'
import { Ellipsis, Subscript, Superscript, Strikethrough } from 'lucide-react'

interface IProps {
  editor: Editor | null
}

export default function MoreMenu(props: IProps) {
  const { editor } = props
  if (editor == null) return null

  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button size="sm" variant="ghost">
          <Ellipsis className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-2">
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          variant={editor.isActive('superscript') ? 'secondary' : 'ghost'}
        >
          <Superscript className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          variant={editor.isActive('subscript') ? 'secondary' : 'ghost'}
        >
          <Subscript className="h-4 w-4" />
        </Button>
      </HoverCardContent>
    </HoverCard>
  )
}
