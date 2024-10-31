'use client'

import debounce from 'lodash.debounce'
import { updateDoc } from './action'
import TiptapEditor from '@/components/editor'

const saveContent = debounce((id: string, content: string) => {
  updateDoc(id, { content })
}, 1000)

export default function Content(props: { id: string; content: string }) {
  const { id, content = '' } = props

  function handleUpdate(content: string) {
    saveContent(id, content)
  }

  return <TiptapEditor rawContent={content} handleUpdate={handleUpdate} />
}
