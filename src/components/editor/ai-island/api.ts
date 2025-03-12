import { MessagesType } from './hooks/useGenMessages'

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
    // 使用我們的後端 API 而不是直接調用 OpenAI
    const response = await fetch('/api/gpt/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
      signal,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch from API')
    }

    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error('Response body is not readable')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        callback(true)
        break
      }

      const chunk = decoder.decode(value)
      buffer += chunk

      try {
        // 嘗試將緩衝區內容解析為多個JSON對象
        while (buffer.includes('}')) {
          const endPos = buffer.indexOf('}') + 1
          const jsonChunk = buffer.substring(0, endPos)
          buffer = buffer.substring(endPos)

          try {
            const data = JSON.parse(jsonChunk)
            onData(data.content || '', data.usage)
          } catch (jsonError) {
            // 可能是不完整的JSON，繼續緩衝
            buffer = jsonChunk + buffer
            break
          }
        }
      } catch (e) {
        console.error('Error parsing chunks:', e)
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.log('Request was aborted')
      onError('Request was aborted')
    } else {
      console.error('API error:', err)
      const errorMessage = mapOpenAIErrorToMessage(err)
      await sendErrorAlertToAPI(err, 'API Error in send function')
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
