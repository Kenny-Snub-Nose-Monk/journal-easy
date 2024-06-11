// import Image from "next/image";
import { Button } from '@/components/ui/button'
import { Code, Zap } from 'lucide-react'
import HomeNav from '@/components/HomeNav'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center text-center">
      <HomeNav />
      <h2 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl">
        <span className="font-extrabold">划水 AI</span>，智能写作 高效工作
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-lg">
        <span>
          基于 GPT 模型，AI 写作，AI 智能提示，AI 文本处理，多人协同编辑
        </span>
      </p>
      <section className="mt-10 flex justify-center space-x-4">
        <Button className="text-base" size="lg">
          <Zap className="h-4 w-4" />
          &nbsp;开始使用
        </Button>
        <Button variant="secondary" className="text-base" size="lg">
          <Code className="h-4 w-4" />
          &nbsp;加入研发团队
          </Button>
      </section>
    </main>
  )
}