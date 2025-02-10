import { Editor, Node } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { MoveUpRight } from 'lucide-react'
import { MessagesType, genSystemMessage } from '../messages'
import { AI_CONTEXT_MAX_LENGTH } from '@/constants'
interface IProps {
  editor: Editor | null
  onRequestAI: (message: MessagesType) => void
  setInstruction: (instruction: string) => void
}
export default function SummaryMenu(props: IProps) {
  const { editor, onRequestAI, setInstruction } = props
  function genMessages(instruction: string): MessagesType {
    if (editor == null) return []
    // messages
    const messages: MessagesType = []
    messages.push(genSystemMessage()) // system message
    // heading message
    const headings: any[] = []
    const { doc } = editor.state
    doc.descendants((node) => {
      if (node.type.name.startsWith('heading')) headings.push(node)
    })
    if (headings.length > 0) {
      let headingText = ''
      headings.forEach((h) => {
        const level = h.attrs.level
        const text = h.textContent
        headingText += `${'#'.repeat(level)} ${text}\n`
      })
      messages.push({ role: 'user', content: '文章的標題目錄是什麼' })
      messages.push({ role: 'assistant', content: headingText })
    }
    // context message
    const contentText = editor.getText()
    if (contentText.length <= AI_CONTEXT_MAX_LENGTH) {
      messages.push({ role: 'user', content: '文章的內容是什麼？' })
      messages.push({ role: 'assistant', content: contentText })
    } else {
      // 內容太多，只能提交部分內容
      // 前半部分內容
      let halfMaxLength = Math.floor(AI_CONTEXT_MAX_LENGTH / 2)
      let content1 = contentText.slice(0, halfMaxLength)
      messages.push({
        role: 'user',
        content: `文章開始${halfMaxLength}字的内容是什麼？`,
      })
      messages.push({ role: 'assistant', content: content1 })
      // 後半部分內容
      let content2 = contentText.slice(-halfMaxLength)
      messages.push({
        role: 'user',
        content: `文章最後${halfMaxLength}字的内容是什麼？`,
      })
      messages.push({ role: 'assistant', content: content2 })
    }
    // current message
    messages.push({ role: 'user', content: instruction })
    return messages
  }
  function handleClick() {
    if (editor == null) return
    const instruction = '根據文章標題和內容，寫出總結'
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
      寫總結
      <MoveUpRight className="h-4 w-4" />
    </Button>
  )
}
