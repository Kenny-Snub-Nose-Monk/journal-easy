import OpenAI from 'openai'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import { AI_RES_MAX_TOKENS } from '@/constants'
import { sendErrorAlert } from '@/lib/mailer'

// 在後端安全地初始化 OpenAI
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
})

export async function POST(request: Request) {
  const encoder = new TextEncoder()

  try {
    // 驗證用戶
    const user = await getUserInfo()
    if (user == null || !user.id) {
      return new Response(
        encoder.encode(JSON.stringify({ error: 'Unauthorized' })),
        { status: 401 }
      )
    }

    // 檢查用戶的 token 限制
    const tokenUsage = await db.tokenUsage.findUnique({
      where: { userId: user.id },
    })

    if (!tokenUsage || tokenUsage.tokensLimit <= 0) {
      return new Response(
        encoder.encode(JSON.stringify({ error: 'Token limit exceeded' })),
        { status: 403 }
      )
    }

    // 解析請求數據
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        encoder.encode(JSON.stringify({ error: 'Invalid messages format' })),
        { status: 400 }
      )
    }

    // 創建流式響應
    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      stream: true,
      stream_options: { include_usage: true },
      max_tokens: AI_RES_MAX_TOKENS,
    })

    // 創建 ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        let totalTokens = 0

        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            const usage = chunk.usage

            if (usage) {
              totalTokens = usage.total_tokens || 0
            }

            // 發送數據
            controller.enqueue(
              encoder.encode(JSON.stringify({ content, usage }))
            )
          }

          // 更新用戶的 token 使用量
          if (totalTokens > 0) {
            const newTokensLimit = Math.max(
              0,
              tokenUsage.tokensLimit - totalTokens
            )
            await db.tokenUsage.update({
              where: { userId: user.id },
              data: {
                totalTokens: tokenUsage.totalTokens + totalTokens,
                tokensLimit: newTokensLimit,
              },
            })
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    // 返回流式響應
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('OpenAI API stream error:', err)
    await sendErrorAlert(err, 'OpenAI API Error in stream route')
    return new Response(
      encoder.encode(
        JSON.stringify({ error: 'Failed to process OpenAI request' })
      ),
      { status: 500 }
    )
  }
}
