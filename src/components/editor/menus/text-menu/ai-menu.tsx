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
interface IProps {
  editor: Editor | null
}
export default function AIMenu(props: IProps) {
  const { editor } = props
  if (editor == null) return
  function handleClick() {
    emitter.emit(EVENT_KEY_FOCUS_AI)

    editor?.commands.setTextSelection({ from: 0, to: 0 })
  }
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClick}
            tabIndex={-1}
            className="text-blue-500 hover:text-blue-500"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Ask AI
          </Button>
        </TooltipTrigger>
        <TooltipContent className="text-background bg-foreground">
          <span className="text-sm">按 Tab 鍵</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
