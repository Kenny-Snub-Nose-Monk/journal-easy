'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { get, IAjaxRes } from '@/lib/ajax'
interface IProps {
  tokenLimit: number
  setTokenLimit: React.Dispatch<React.SetStateAction<number>>
}
export default function Info(props: IProps) {
  const { tokenLimit, setTokenLimit } = props
  useEffect(() => {
    // console.log('get token limit...')
    const url = '/api/gpt/token-usage'
    get(url).then((res: IAjaxRes) => {
      if (res.errno !== 0) {
        console.error('Get token usage failed', res.msg)
        return
      }
      const { data } = res
      const { tokensLimit = 0 } = data || {}
      setTokenLimit(tokensLimit)
    })
  }, []) // eslint-disable-line
  return (
    <p className="text-sm text-center my-1 text-muted-foreground">
      AI 可能會生成錯誤信息，請自行檢查判斷。你本月&nbsp;
      <Link
        href="/ai-token"
        className="underline"
        title="什麼是 token limit ？"
      >
        AI token limit
      </Link>
      &nbsp;數量 <TokenLimitSpan tokenLimit={tokenLimit} /> ，
      <Link href="/ai-token#add-limit-heading" className="underline">
        領取更多
      </Link>
    </p>
  )
}

function TokenLimitSpan({ tokenLimit }: { tokenLimit: number }) {
  let color = 'text-green-500'
  if (tokenLimit < 3000) color = 'text-orange-500'
  if (tokenLimit < 1000) color = 'text-red-500'
  if (tokenLimit < 0) return <span>---</span>
  return <span className={`${color} font-bold`}>{tokenLimit}</span>
}
