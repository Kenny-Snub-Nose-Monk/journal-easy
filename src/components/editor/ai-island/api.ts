import OpenAI from 'openai'
import { AI_RES_MAX_TOKENS } from '@/constants'
import { MessagesType } from './messages'

const openai = new OpenAI({
  dangerouslyAllowBrowser: true, // Only if you're okay with exposing your API key in the frontend
  organization: 'org-V8AiRkfnZD9gTSW7RU7Znmua',
  project: 'proj_dWN3zm1cfCtAmhDMwNDwgA5Z',
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
})

export async function send(
  messages: MessagesType,
  onData: (content: string) => void,
  callback: (done: boolean) => void
) {
  if (!messages || messages.length === 0) {
    callback(false)
    return
  }

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [...messages],
      stream: true,
      max_tokens: AI_RES_MAX_TOKENS,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content == null) {
        callback(true)
      }
      onData(content ?? '')
    }
    callback(true)
  } catch (err) {
    console.error('OpenAI API error:', err)
    callback(false)
  }
}
