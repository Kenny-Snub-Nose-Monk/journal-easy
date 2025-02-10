import OpenAI from 'openai'
import emitter from '@/lib/emitter'
import { EVENT_KEY_AI_EDIT } from '@/constants'

const openai = new OpenAI({
  dangerouslyAllowBrowser: true, // Only if you're okay with exposing your API key in the frontend
  organization: 'org-V8AiRkfnZD9gTSW7RU7Znmua',
  project: 'proj_dWN3zm1cfCtAmhDMwNDwgA5Z',
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
})

export async function send(instruction: string, callback: () => void) {
  if (!instruction.trim()) {
    callback()
    return
  }

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [{ role: 'user', content: instruction }],
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content == null) {
        emitter.emit(EVENT_KEY_AI_EDIT, { type: 'enter' })
      }
      emitter.emit(EVENT_KEY_AI_EDIT, { type: 'insert', content })
    }
    emitter.emit(EVENT_KEY_AI_EDIT, { type: 'enter' })
    callback()
  } catch (err) {
    console.error('OpenAI API error:', err)
    callback()
  }
}
