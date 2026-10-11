import 'server-only'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

interface AIInstance {
  provider: ReturnType<typeof createOpenAICompatible>
  model: string
  key: string
  isError: boolean
}
let cached: AIInstance | null = null

export function getAIInstance(): AIInstance | null {
  if (cached) return cached
  const baseURL = process.env.AI_BASE_URL
  const model = process.env.AI_MODEL
  if (!baseURL || !model) return null
  const key = process.env.AI_API_KEY || 'ollama'
  cached = {
    provider: createOpenAICompatible({ name: 'journal-ai', baseURL, apiKey: key, includeUsage: true }),
    model,
    key,
    isError: false,
  }
  return cached
}
