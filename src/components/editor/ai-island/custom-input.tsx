import { forwardRef, ForwardedRef, useMemo } from 'react'
import { Editor } from '@tiptap/react'
import {
  Sparkles,
  CornerDownLeft,
  LoaderCircle,
  CircleStop,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MessagesType,
  genSystemMessage,
  genSelectedContentMessages,
} from './messages'
interface IProps {
  isFocus: boolean
  loading: boolean
  editor: Editor | null
  isSelectionEmpty: boolean
  onRequestAI: (message: MessagesType) => void
  onAbortRequestAI: () => void
  instruction: string
  setInstruction: (instruction: string) => void
}
const CustomInput = forwardRef(
  (props: IProps, inputRef: ForwardedRef<HTMLInputElement>) => {
    const {
      editor,
      onRequestAI,
      onAbortRequestAI,
      setInstruction,
      isFocus,
      loading,
      isSelectionEmpty,
      instruction,
    } = props

    function genMessages(instruction: string): MessagesType {
      let messages: MessagesType = []
      if (!instruction.trim()) return messages
      if (editor == null) return messages
      // system message
      messages.push(genSystemMessage())
      // selected content message
      if (!isSelectionEmpty) {
        messages = messages.concat(genSelectedContentMessages(editor))
      }
      // current message
      messages.push({ role: 'user', content: instruction })
      return messages
    }
    function handleClick() {
      if (!instruction.trim()) return
      const messages = genMessages(instruction)
      onRequestAI(messages)
    }
    function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
      const { key } = event
      if (key === 'Enter') {
        if (!instruction.trim()) return
        const messages = genMessages(instruction)
        onRequestAI(messages)
      }
      if (key === 'Escape') {
        editor?.commands.focus()
      }
    }
    // placeholder
    const placeholder = useMemo(() => {
      if (!isFocus) return '使用 AI 寫作'
      if (isSelectionEmpty) return '輸入 AI 指令，如：根據標題寫大綱'
      else return '針對選中內容，輸入 AI 指令，如：擴展一下這段內容'
    }, [isFocus, isSelectionEmpty])
    return (
      <div
        className={cn(
          'rounded-2xl p-1 border-2 shadow flex items-center justify-start',
          isFocus && 'border-blue-600'
        )}
      >
        <Sparkles
          size={18}
          className={cn(
            'ml-2',
            isFocus ? 'text-blue-600' : 'opacity-50',
            loading && 'animate-pulse'
          )}
        />
        <div className="flex-auto flex items-center justify-start">
          <Input
            placeholder={placeholder}
            tabIndex={-1}
            value={instruction}
            maxLength={300}
            disabled={loading}
            ref={inputRef}
            onKeyDown={handleKeydown}
            onChange={(e) => setInstruction(e.target.value)}
            className="bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className={cn(isFocus ? 'text-blue-600' : 'opacity-50')}
            onClick={handleClick}
            disabled={!instruction}
          >
            {!loading && <CornerDownLeft size={18} />}
            {loading && <LoaderCircle size={18} className="animate-spin" />}
          </Button>
          {loading && (
            <Button variant="ghost" size="icon" onClick={onAbortRequestAI}>
              <CircleStop size={18} />
            </Button>
          )}
        </div>
      </div>
    )
  }
)
export default CustomInput
