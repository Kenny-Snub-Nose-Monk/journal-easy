'use client'

import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import debounce from 'lodash.debounce'
import { updateDoc } from './action'

const saveContent = debounce((uid: string, content: string) => {
  updateDoc(uid, { content })
}, 1000)

export default function Content(props: { uid: string; content: string }) {
  const [content, setContent] = useState(props.content || '')

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newContent = e.target.value

    setContent(newContent)
    saveContent(props.uid, newContent)
  }

  return (
    <div>
      <Textarea
        placeholder="請輸入標題..."
        value={content}
        onChange={handleChange}
        className="border-none p-0 text-base focus-visible:ring-transparent"
      />
    </div>
  )
}
