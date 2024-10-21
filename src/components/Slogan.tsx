'use client'

import Typed from 'typed.js'
import { useEffect, useRef } from 'react'

export default function Slogan() {
  const el = useRef(null)

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        '基於 GPT 模型，AI 寫作，AI 智慧提示，AI 文件處理，多人協作編輯',
      ],
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      cursorChar: ' _',
    })

    return () => {
      typed.destroy()
    }
  }, [])

  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
      <span ref={el}>&nbsp;</span>
    </p>
  )
}
