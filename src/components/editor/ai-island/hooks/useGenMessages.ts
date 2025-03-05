import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import { AI_CONTEXT_MAX_LENGTH } from '@/constants'
import { getTitle } from '../util'
import { useTranslations } from 'next-intl'

export interface IMessage {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export type MessagesType = IMessage[]

export function useGenSystemMessage(): IMessage {
  const t = useTranslations('AIInput')
  const [message, setMessage] = useState<IMessage>({
    role: 'system',
    content: t('writingArticle'),
  })

  useEffect(() => {
    const title = getTitle()
    if (title) {
      setMessage({
        role: 'system',
        content: t('writingArticle') + ', ' + t('titleTip', { title }),
      })
    }
  }, [t])

  return message
}

export function useGenSelectedContentMessages(
  editor: Editor | null
): MessagesType {
  const t = useTranslations('AIInput')
  const [messages, setMessages] = useState<MessagesType>([])

  useEffect(() => {
    if (editor == null) return
    const { empty, from, to } = editor.state.selection
    if (empty) return
    let selectedText = editor.state.doc.textBetween(from, to)
    if (selectedText.length > AI_CONTEXT_MAX_LENGTH) {
      selectedText = selectedText.slice(0, AI_CONTEXT_MAX_LENGTH) + '...' // 截断
    }
    setMessages((arr) =>
      arr.concat({ role: 'user', content: t('contentWillHandle') })
    )
    setMessages((arr) =>
      arr.concat({ role: 'assistant', content: selectedText })
    )
  }, [editor, t])

  return messages
}
