import { forwardRef, ForwardedRef, useMemo, useState } from 'react'
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
  useGenSystemMessage,
  useGenSelectedContentMessages,
} from './hooks/useGenMessages'
import { useTranslations } from 'next-intl'

interface IProps {
  isFocus: boolean
  loading: boolean
  editor: Editor | null
  isSelectionEmpty: boolean
  onRequestAI: (message: MessagesType) => void
  onAbortRequestAI: () => void
  instruction: string
  setInstruction: (instruction: string) => void
  delay: number
}
const CustomInput = forwardRef(
  (props: IProps, inputRef: ForwardedRef<HTMLInputElement>) => {
    const t = useTranslations('AIInput')

    const {
      editor,
      onRequestAI,
      onAbortRequestAI,
      setInstruction,
      isFocus,
      loading,
      isSelectionEmpty,
      instruction,
      delay,
    } = props

    const systemMessage = useGenSystemMessage()
    const selectedContentMessages = useGenSelectedContentMessages(editor)

    function genMessages(instruction: string): MessagesType {
      let messages: MessagesType = []
      if (!instruction.trim()) return messages
      if (editor == null) return messages

      // system message
      messages.push(systemMessage)

      // selected content message
      if (!isSelectionEmpty) {
        messages = messages.concat(selectedContentMessages)
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

    const [composition, setComposition] = useState(false) // 中文輸入法狀態

    function handleCompositionStart() {
      setComposition(true)
    }
    function handleCompositionEnd() {
      setComposition(false)
    }

    function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
      const { key } = event
      if (key === 'Enter') {
        if (!instruction.trim()) return
        if (composition) return
        const messages = genMessages(instruction)
        onRequestAI(messages)
      }
      if (key === 'Escape') {
        editor?.commands.focus()
      }
    }
    // placeholder
    const placeholder = useMemo(() => {
      if (!isFocus) return t('inputPlaceholder1')
      if (isSelectionEmpty) return t('inputPlaceholder2')
      else return t('inputPlaceholder3')
    }, [isFocus, isSelectionEmpty, t])

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
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          {delay > 0 && (
            <span className="text-xs text-gray-400 ml-2">{delay}s</span>
          )}
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

// Add display name
CustomInput.displayName = 'CustomInput'

export default CustomInput
