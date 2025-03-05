import OpenAI from 'openai'
import { AI_RES_MAX_TOKENS } from '@/constants'
import { MessagesType } from './hooks/useGenMessages'

const openai = new OpenAI({
  dangerouslyAllowBrowser: true, // Only if you're okay with exposing your API key in the frontend
  organization: 'org-V8AiRkfnZD9gTSW7RU7Znmua',
  project: 'proj_dWN3zm1cfCtAmhDMwNDwgA5Z',
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
})

export async function send(
  messages: MessagesType,
  onData: (content: string, usage: any) => void,
  callback: (done: boolean) => void,
  onError: (msg: string) => void,
  signal: AbortSignal
) {
  if (!messages || messages.length === 0) {
    callback(false)
    return
  }

  try {
    const stream = await openai.chat.completions.create(
      {
        model: 'gpt-3.5-turbo',
        messages: [...messages],
        stream: true,
        stream_options: { include_usage: true },
        max_tokens: AI_RES_MAX_TOKENS,
      },
      {
        signal,
      }
    )

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      const usage = chunk.usage

      if (content == null) {
        callback(true)
      }
      onData(content ?? '', usage)
    }
    callback(true)
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.log('Request was aborted')
      onError('Request was aborted')
    } else {
      console.error('OpenAI API error:', err)
      const errorMessage = mapOpenAIErrorToMessage(err)
      await sendErrorAlertToAPI(err, 'OpenAI API Error in send function')
      onError(errorMessage)
    }
    callback(false)
  }
}

// Helper function to map OpenAI API errors to user-friendly messages
function mapOpenAIErrorToMessage(err: any): string {
  if (err.response) {
    switch (err.response.status) {
      case 400:
        return 'Bad Request: The request was unacceptable, often due to missing a required parameter.'
      case 401:
        return 'Unauthorized: No valid API key provided.'
      case 403:
        return "Forbidden: The API key doesn't have permissions to perform the request."
      case 404:
        return "Not Found: The requested resource doesn't exist."
      case 429:
        return "Too Many Requests: You've hit the rate limit or are sending too many requests."
      case 500:
        return "Server Error: Something went wrong on OpenAI's end."
      default:
        return `Unexpected Error: ${err.response.data?.message || 'An unknown error occurred.'}`
    }
  }
  return 'Network Error: Please check your internet connection.'
}

async function sendErrorAlertToAPI(error: any, context: string) {
  try {
    // Ensure error object is properly formatted
    const errorData = {
      error: {
        message: error?.message || 'Unknown error',
        stack: error?.stack || new Error().stack || 'No stack trace',
      },
      context: context || 'No context provided',
    }

    const response = await fetch('/api/gpt/error-alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    })

    if (!response.ok) {
      const errorResponse = await response.json()
      console.error('Error alert failed:', errorResponse)
    }
  } catch (err) {
    console.error('Failed to send error alert:', err)
  }
}
