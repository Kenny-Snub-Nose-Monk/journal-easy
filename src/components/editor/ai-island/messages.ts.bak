import { Editor } from '@tiptap/react'
import { AI_CONTEXT_MAX_LENGTH } from '@/constants'
import { getTitle } from './util'

export interface IMessage {
  role: 'user' | 'system' | 'assistant'
  content: string
}
export type MessagesType = IMessage[]
export function genSystemMessage(): IMessage {
  let systemContent = '你正在寫一篇文章'
  const title = getTitle()
  if (title) {
    systemContent += `，文章標題是：${title}`
  }
  return { role: 'system', content: systemContent }
}

export function genSelectedContentMessages(editor: Editor): MessagesType {
  const messages: MessagesType = []
  const { empty, from, to } = editor.state.selection
  if (empty) return messages
  let selectedText = editor.state.doc.textBetween(from, to)
  if (selectedText.length > AI_CONTEXT_MAX_LENGTH) {
    selectedText = selectedText.slice(0, AI_CONTEXT_MAX_LENGTH) + '...' // 截斷
  }
  messages.push({ role: 'user', content: '接下來要處理的內容是什麼？' })
  messages.push({ role: 'assistant', content: selectedText })
  return messages
}
