import { Sparkles, CornerDownLeft, MoveUpRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// TODO import { CONTENT_WIDTH } from '@/constants'
// 在這裏獲取內容寬度，不要直接使用數字

export default function AIIsland() {
  return (
    <div
      className="
        absolute bottom-10 w-[800px] left-1/2 ml-[-400px] 
        rounded-3xl p-4 pl-6 shadow-muted-foreground shadow-lg
        border-muted-foreground bg-secondary-foreground text-secondary 
        flex items-center justify-start
      "
    >
      <Sparkles size={24} />
      <div className="flex-auto flex items-center justify-start">
        <Input
          placeholder="請輸入 AI 指令，如：根據標題寫大綱"
          className="text-base bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-inherit hover:text-muted-foreground"
        >
          <CornerDownLeft size={24} />
        </Button>
      </div>
      <div className="ml-6 opacity-50">
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          續寫
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          頭腦風暴
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          總結
          <MoveUpRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-2 hover:bg-inherit hover:text-muted-foreground"
        >
          更多...
        </Button>
      </div>
    </div>
  )
}
