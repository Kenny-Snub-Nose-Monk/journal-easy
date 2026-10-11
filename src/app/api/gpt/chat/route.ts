import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { z } from 'zod'
import { getAIInstance } from '@/lib/ai-instances'
import { sendEmail } from '@/lib/mailer'
import { getUserInfo } from '@/lib/session'
import { getTokenUsage, updateTokenUsage } from '@/lib/token-usage'
import { genErrorData, genUnAuthData } from '@/app/api/utils/gen-res-data'

export async function POST(request: Request) {
  const user = await getUserInfo()
  if (user == null || !user.id) return Response.json(genUnAuthData(), { status: 401 })
  const userId = user.id

  const tokenUsage = await getTokenUsage(userId)
  if (tokenUsage.tokensLimit <= 0) {
    return Response.json(genErrorData('Token limit exceeded'), { status: 429 })
  }

  const parsed = z
    .object({
      messages: z
        .array(
          z.object({
            id: z.string(),
            role: z.enum(['system', 'user', 'assistant']),
            parts: z.array(z.object({ type: z.literal('text'), text: z.string().max(100_000) })),
          })
        )
        .min(1)
        .max(100),
      max_tokens: z.number().int().min(1).max(4096).optional(),
    })
    .safeParse(await request.json().catch(() => null))
  if (!parsed.success) return Response.json(genErrorData('Invalid AI request'), { status: 400 })
  const { messages, max_tokens } = parsed.data

  if (!messages || messages.length === 0) {
    return Response.json(genErrorData('messages required'), { status: 400 })
  }

  const instance = getAIInstance()
  if (instance == null)
    return Response.json(
      genErrorData('AI 尚未設定：請設定 AI_BASE_URL 與 AI_MODEL / Configure AI_BASE_URL and AI_MODEL'),
      { status: 503 }
    )

  try {
    const result = streamText({
      model: instance.provider(instance.model),
      // convertToModelMessages：将 UIMessage[] 转为 LLM 可接受的 ModelMessage[]
      messages: await convertToModelMessages(messages),
      maxOutputTokens: Math.min(max_tokens ?? 600, tokenUsage.tokensLimit),
      abortSignal: request.signal,
      async onFinish({ usage }) {
        await updateTokenUsage(userId, tokenUsage.totalTokens, tokenUsage.tokensLimit, usage.totalTokens ?? 0)
      },
      onError({ error }) {
        instance.isError = true
        sendEmail({ subject: `AI stream error`, text: String(error) })
      },
    })

    // originalMessages 让 SDK 在流结束后正确处理完整消息历史
    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      messageMetadata: ({ part }) => {
        if (part.type !== 'finish') return

        return {
          totalTokens: part.totalUsage.totalTokens,
        }
      },
    })
  } catch (err: unknown) {
    instance.isError = true
    const msg = err instanceof Error ? err.message : String(err)
    sendEmail({ subject: 'AI request error', text: msg })
    return Response.json(genErrorData(msg), { status: 502 })
  }
}
