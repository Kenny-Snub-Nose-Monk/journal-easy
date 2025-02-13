import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { EVENT_KEY_FOCUS_AI } from '@/constants'
import emitter from '@/lib/emitter'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useRef } from 'react'
interface IProps {
  editor: Editor | null
}
export default function AIMenu(props: IProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { editor } = props

  if (editor == null) return
  function handleClick() {
    emitter.emit(EVENT_KEY_FOCUS_AI)

    // 隐藏 BubbleMenu （PS：未找到合适的 API ，先用这种直接的方式来做，待优化...）
    setTimeout(() => {
      if (buttonRef.current == null) return
      const bubbleMenuElem = buttonRef.current.closest('div[data-tippy-root]')
      if (bubbleMenuElem == null) return
      bubbleMenuElem.remove()
    }, 150)
  }
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleClick}
      tabIndex={-1}
      className="text-blue-500 hover:text-blue-500"
      ref={buttonRef}
    >
      <Sparkles className="h-4 w-4 mr-1" />
      Ask AI
    </Button>
  )
}
