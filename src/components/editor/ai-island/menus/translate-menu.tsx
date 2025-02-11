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
export default function TranslateMenu(props: IProps) {
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
  function handleClick(lang: '英語' | '中文' | '日語') {
    if (editor == null) return
    const { empty } = editor.state.selection
    if (empty) return
    const instruction = `把這段文字翻譯為${lang}`
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
          翻译
          <Ellipsis className="h-4 w-4 ml-1" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="p-1 w-auto">
        <Button
          variant="ghost"
          onClick={() => handleClick('英語')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          翻譯為英文
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleClick('日語')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          翻譯為日文
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleClick('中文')}
          className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
        >
          翻譯為中文
          <MoveUpRight className="h-4 w-4" />
        </Button>
      </HoverCardContent>
    </HoverCard>
  )
}
