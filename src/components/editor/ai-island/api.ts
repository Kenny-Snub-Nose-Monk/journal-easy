import OpenAI from 'openai'

const openai = new OpenAI({
  dangerouslyAllowBrowser: true, // Only if you're okay with exposing your API key in the frontend
  organization: 'org-V8AiRkfnZD9gTSW7RU7Znmua',
  project: 'proj_dWN3zm1cfCtAmhDMwNDwgA5Z',
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
})

export async function send(
  instruction: string,
  onData: (content: string) => void,
  callback: (done: boolean) => void
) {
  if (!instruction.trim()) {
    callback(false)
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
