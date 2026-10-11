import { Link } from '@/i18n/routing'
import HomeNav from '@/components/home-nav'
import { getUserInfo } from '@/lib/session'
import { AI_DEFAULT_TOKEN_LIMIT } from '@/constants'
import { getTokenUsage } from '@/lib/token-usage'
import AddLimit from './add-limit'
import UpdateTime from './update-time'

export default async function AITokenPage() {
  const user = await getUserInfo()

  if (user == null || !user.id)
    return (
      <Wrapper>
        <Link href="/" className="underline text-xl">
          請到首頁登入
        </Link>
      </Wrapper>
    )

  const tokenUsage = await getTokenUsage(user.id)
  const { tokensLimit, updateLimitAt } = tokenUsage

  return (
    <>
      <HomeNav />
      <div className="w-[800px] mx-auto my-20">
        <div className=" prose dark:prose-invert">
          <h2>What is token</h2>
          <p>
            AI 大模型一般使用 token 來計算輸入和輸出的內容長度，API 會根據 token 來計費。token
            不是字元、英文和漢字，簡單瞭解的話：
          </p>
          <ul>
            <li>100 token 約等於 75 英文單詞（是單詞，不是字母）</li>
            <li>100 token 約等於 100 個漢字或標點符號</li>
            <li>
              AI API 一般根據 token 使用量來計算收費，如{' '}
              <a href="https://openai.com/api/pricing/" target="_blank" className="underline">
                OpenAI API 價格
              </a>
            </li>
            <li>AI API 的輸入、輸出都要計算 token ，一次請求，雙向累計</li>
          </ul>
          <p>
            可以藉助&nbsp;
            <a href="https://platform.openai.com/tokenizer" target="_blank" className="underline">
              OpenAI tokenizer
            </a>
            &nbsp; 工具來測試
          </p>
          <h2>What is token limit</h2>
          <p>
            Token limit 是 Journal Easy 對於 AI 使用量的限制，當 token limit 小於等於 0 時，AI
            功能將不可用。如果不加限制，使用者無節制的使用，可能會浪費我們的 AI API 費用。
          </p>
          <p>每個使用者註冊以後，都會分配 token limit ，此後每月會自動補充額度，還可以自己手動領取。</p>
          <h2 id="add-limit-heading">Get token limit</h2>
          <p>token limit 領取規則</p>
          <ul>
            <li>
              每月初會自動重置 token limit 為 {AI_DEFAULT_TOKEN_LIMIT}（當你的 token limit 大於等於{' '}
              {AI_DEFAULT_TOKEN_LIMIT} 時，不重置）
            </li>
            <li>
              每週可手動領取一次 token limit 1000（當你的 token limit 大於等於 {AI_DEFAULT_TOKEN_LIMIT} 時，不能領取）
            </li>
          </ul>
          <hr />
          <p>
            Your have token limit {tokensLimit} , last update at &nbsp;
            <UpdateTime dt={updateLimitAt} />
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
