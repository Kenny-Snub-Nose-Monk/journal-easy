import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { MoveUpRight, Ellipsis } from 'lucide-react'
import {
  MessagesType,
  genSystemMessage,
  genSelectedContentMessages,
} from '../messages'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
interface IProps {
  editor: Editor | null
  onRequestAI: (message: MessagesType) => void
  setInstruction: (instruction: string) => void
}
export default function ChangeToneMenu(props: IProps) {
  const { editor, onRequestAI, setInstruction } = props
  function genMessages(instruction: string): MessagesType {
    if (editor == null) return []
    // messages
    let messages: MessagesType = []
    messages.push(genSystemMessage()) // system message
    // selected content message
    messages = messages.concat(genSelectedContentMessages(editor))
    // current message
    messages.push({ role: 'user', content: instruction })
    return messages
  }
  function handleClick(tone: string) {
    if (editor == null) return
    const { empty } = editor.state.selection
    if (empty) return
    const instruction = `使用${tone}的語氣重寫這段話`
    const messages = genMessages(instruction)
    setInstruction(instruction)
    onRequestAI(messages)
  }
  if (editor == null) return null
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          切換語氣
          <Ellipsis className="h-4 w-4 ml-1" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="p-1 w-auto">
        <Button
          variant="ghost"
          onClick={() => handleClick('專業')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          專業
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleClick('隨和的')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          隨和的
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleClick('强调')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          強調
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleClick('自信的')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          自信的
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleClick('友好的')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          友好的
          <MoveUpRight className="h-4 w-4" />
        </Button>
      </HoverCardContent>
    </HoverCard>
  )
}
