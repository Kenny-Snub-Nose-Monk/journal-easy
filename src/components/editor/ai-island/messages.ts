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
