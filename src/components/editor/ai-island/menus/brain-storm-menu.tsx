import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { MoveUpRight } from 'lucide-react'
import { MessagesType, genSystemMessage } from '../messages'
interface IProps {
  editor: Editor | null
  onRequestAI: (message: MessagesType) => void
  setInstruction: (instruction: string) => void
}
export default function BrainStormMenu(props: IProps) {
  const { editor, onRequestAI, setInstruction } = props
  function genMessages(instruction: string): MessagesType {
    if (editor == null) return []
    // messages
    const messages: MessagesType = []
    messages.push(genSystemMessage()) // system message
    // current message
    messages.push({ role: 'user', content: instruction })
    return messages
  }
  function handleClick() {
    if (editor == null) return
    const instruction = '根據文章標題，頭腦風暴，給出一些想法'
    const messages = genMessages(instruction)
    setInstruction(instruction)
    onRequestAI(messages)
  }
  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
    >
      頭腦風暴
      <MoveUpRight className="h-4 w-4" />
    </Button>
  )
}
