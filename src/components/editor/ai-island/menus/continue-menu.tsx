import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { MoveUpRight } from 'lucide-react'
import { MessagesType, genSystemMessage } from '../messages'
import { AI_CONTEXT_MAX_LENGTH } from '@/constants'
interface IProps {
  editor: Editor | null
  onRequestAI: (message: MessagesType) => void
  setInstruction: (instruction: string) => void
}
export default function ContinueMenu(props: IProps) {
  const { editor, onRequestAI, setInstruction } = props
  function genMessages(instruction: string): MessagesType {
    if (editor == null) return []
    // messages
    const messages: MessagesType = []
    messages.push(genSystemMessage()) // system message
    // context message
    const selection = editor.state.selection
    let prevText = editor.view.state.doc.textBetween(0, selection.head) // 選區之前的文本內容
    if (prevText.trim() !== '') {
      messages.push({ role: 'user', content: '文章已有哪些內容？' })
      if (prevText.length > AI_CONTEXT_MAX_LENGTH) {
        // 上下文內容不能太多，否則會影響速度
        prevText = prevText.slice(-AI_CONTEXT_MAX_LENGTH)
      }
      messages.push({ role: 'assistant', content: prevText })
    }
    // current message
    messages.push({ role: 'user', content: instruction })
    return messages
  }
  function handleClick() {
    if (editor == null) return
    const instruction = '根據文章標題和內容，繼續寫作，200 字以內'
    const messages = genMessages(instruction)
    setInstruction(instruction)
    onRequestAI(messages)
  }
  if (editor == null) return null
  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
    >
      續寫
      <MoveUpRight className="h-4 w-4" />
    </Button>
  )
}
