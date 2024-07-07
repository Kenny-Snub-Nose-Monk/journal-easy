'use client'

import { Input } from '@/components/ui/input'
import { useState } from 'react'
import debounce from 'lodash.debounce'
import { updateDoc } from './action'

const saveTitle = debounce((uid: string, title: string) => {
  updateDoc(uid, { title })
}, 1000)

export default function Title(props: { uid: string; title: string }) {
  const [title, setTitle] = useState(props.title || '')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value
    setTitle(newTitle)
    saveTitle(props.uid, newTitle)
  }

  return (
    <div className="mb-8">
      <Input
        placeholder="請輸入內容..."
        value={title}
        onChange={handleChange}
        className="border-none p-0 text-4xl font-bold focus-visible:ring-transparent"
      />
      {
        // 可能還會增加其他功能，例如設定Icon、背景等
      }
    </div>
  )
}
