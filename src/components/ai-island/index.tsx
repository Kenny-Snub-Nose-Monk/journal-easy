'use client'
import { useState } from 'react'
import {
  Sparkles,
  MoveUpRight,
  SquareArrowUp,
  LoaderCircle,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CONTENT_WIDTH } from '@/constants' // 在這裏獲取內容寬度，不要直接使用數字

import { send } from './api'

export default function AIIsland() {
  const [loading, setLoading] = useState(false)
  const [instruction, setInstruction] = useState('')

  function handleClick() {
    if (loading) return
    setLoading(true)
    send(instruction, () => {
      setLoading(false)
      setInstruction('')
    })
  }

  return (
    <div
      className={`
        absolute bottom-6 
        rounded-2xl p-2 pl-4 border shadow bg-background
        flex items-center justify-start
      `}
      style={{
        width: `${CONTENT_WIDTH}px`,
        marginLeft: `-${CONTENT_WIDTH / 2}px`,
        left: '50%',
      }}
    >
      <Sparkles size={24} />
      <div className="flex-auto flex items-center justify-start">
        <Input
          placeholder="請輸入 AI 指令，如：根據標題寫大綱"
          className="text-base bg-inherit border-none focus-visible:ring-offset-0 focus-visible:ring-0"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={(e) => {
            e.key === 'Enter' && handleClick()
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-inherit hover:text-muted-foreground"
          onClick={handleClick}
          disabled={!instruction}
        >
          {!loading && <SquareArrowUp size={24} />}
          {loading && <LoaderCircle size={24} className="animate-spin" />}
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
