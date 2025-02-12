import Link from 'next/link'
import HomeNav from '@/components/home-nav'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'
import { isSameMonth } from '@/lib/dt'
import { AI_DEFAULT_TOKEN_LIMIT } from '@/constants'
import AddLimit from './add-limit'

export default async function AITokenPage() {
  const user = await getUserInfo()
  if (user == null || !user.id)
    return (
      <Wrapper>
        <Link href="/" className="underline text-xl">
          請到首頁登錄
        </Link>
      </Wrapper>
    )
  // 獲取 tokenUsage
  let tokenUsage = await db.tokenUsage.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (tokenUsage == null) {
    // 沒有則創建一個
    tokenUsage = await db.tokenUsage.create({ data: { userId: user.id } })
  }
  const { tokensLimit, updateLimitAt } = tokenUsage

  // 是否月初需要重置？
  if (!isSameMonth(updateLimitAt) && tokensLimit < AI_DEFAULT_TOKEN_LIMIT) {
    await db.tokenUsage.update({
      where: { id: tokenUsage.id },
      data: { tokensLimit: AI_DEFAULT_TOKEN_LIMIT, updateLimitAt: new Date() },
    })
    return (
      <Wrapper>
        <p>已自動重置 token limit ，請返回上一頁，繼續使用 AI 功能</p>
      </Wrapper>
    )
  }

  return (
    <>
      <HomeNav />
      <div className="w-[800px] mx-auto my-20">
        <div className=" prose dark:prose-invert">
          <h2>什麼是 token</h2>
          <p>
            AI 大模型一般使用 token 來計算輸入和輸出的內容長度，API 會根據 token
            來計費。token 不是字符、英文和漢字，簡單了解的話：
          </p>
          <ul>
            <li>100 token 約等於 75 英文單詞（是單詞，不是字母）</li>
            <li>100 token 約等於 100 個漢字或標點符號</li>
            <li>
              AI 接口一般根據 token 使用量來計算收費，如{' '}
              <a
                href="https://openai.com/api/pricing/"
                target="_blank"
                className="underline"
              >
                OpenAI API 價格
              </a>
            </li>
            <li>AI 接口的輸入、輸出都要計算 token ，一次請求，雙向累計</li>
          </ul>
          <p>
            可以借助&nbsp;
            <a
              href="https://platform.openai.com/tokenizer"
              target="_blank"
              className="underline"
            >
              OpenAI tokenizer
            </a>
            &nbsp; 工具來測試
          </p>
          <h2>什麼是 token limit</h2>
          <p>
            Token limit 是【划水 AI】項目對於 AI 使用量的限制，當 token limit
            小於等於 0 時，AI
            功能將不可用。如果不加限制，用戶無節制的使用，可能會浪費我們的 AI
            接口費用。
          </p>
          <p>
            每個用戶註冊以後，都會分配 token limit
            ，此後每月會自動充值，還可以自己手動領取。
          </p>
          <h2 id="add-limit-heading">領取 token limit</h2>
          <p>token limit 領取規則</p>
          <ul>
            <li>
              每月初會自動重置 token limit 為 10000 （當你的 token limit 大於 1w
              時，不重置）
            </li>
            <li>
              每周可手動領取一次 token limit 1000 （當你的 token limit 超過 1w
              時，不能領取）
            </li>
          </ul>
          <hr />
          <p>
            你當前 token limit 數量：{tokensLimit} ；最後領取（或重置）時間：
            {updateLimitAt.toLocaleString()} ；
          </p>
          <p>
            <AddLimit />
          </p>
        </div>
      </div>
    </>
  )
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center">
      <HomeNav />
      {children}
    </div>
  )
}
