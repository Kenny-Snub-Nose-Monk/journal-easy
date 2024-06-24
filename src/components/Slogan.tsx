'use client'

import Typed from 'typed.js'
import { useEffect, useRef } from 'react'

export default function Slogan() {
  const el = useRef(null)

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        '基于 GPT 模型，AI 写作，AI 智能提示，AI 文本处理，多人协同编辑',
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
