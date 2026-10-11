'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Sparkles, Users, BotMessageSquare, Edit3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const getDefaultImg = () =>
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAtAAAAGQAQMAAAC9KcUuAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAWJQAAFiUBSVIk8AAAAANQTFRF9PT1qLDE/AAAADpJREFUeNrtwYEAAAAAw6D5U1/gCFUBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAMjjAAAWvqgdoAAAAASUVORK5CYII='

export default function HomeTabs() {
  const t = useTranslations('home')

  const tabsRef = useRef<HTMLDivElement>(null)

  const [img1, setImg1] = useState(getDefaultImg())
  const [img2, setImg2] = useState(getDefaultImg())
  const [img3, setImg3] = useState(getDefaultImg())
  const [img4, setImg4] = useState(getDefaultImg())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // tabs 进入视口
            // 產品示範動圖。未設定 NEXT_PUBLIC_DEMO_BASE 時維持佔位圖，不會破版。
            // 待錄製 Journal Easy 自己的操作畫面後再設定此變數。
            const base = process.env.NEXT_PUBLIC_DEMO_BASE
            if (base) {
              setImg1(`${base}/demo-ai-gen.gif`)
              setImg2(`${base}/demo-ai-exp.gif`)
              setImg3(`${base}/demo-ai-chat.gif`)
              setImg4(`${base}/demo-collab.gif`)
            }
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px', // 提前 50px 載入
        threshold: 0.01,
      }
    )
    const tabsElement = tabsRef.current
    if (tabsElement) {
      observer.observe(tabsElement)
    }
    return () => {
      if (tabsElement) {
        observer.unobserve(tabsElement)
      }
    }
  }, [])

  return (
    <Tabs defaultValue="feature-gen-text" className="w-full" ref={tabsRef}>
      <TabsList className="h-auto grid w-full grid-cols-4 mb-12 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/25 rounded-xl p-2 border border-gray-200 dark:border-gray-700">
        <TabsTrigger
          value="feature-gen-text"
          role="tab-gen-text"
          className="flex items-center space-x-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300 text-gray-600 dark:text-gray-400"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">{t('AIGenText')}</span>
          <span className="sm:hidden">AI Writing</span>
        </TabsTrigger>
        <TabsTrigger
          value="feature-opt-text"
          role="tab-opt-text"
          className="flex items-center space-x-2 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900/30 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300 text-gray-600 dark:text-gray-400"
        >
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">{t('AIProcessText')}</span>
          <span className="sm:hidden">AI Opt</span>
        </TabsTrigger>
        <TabsTrigger
          value="feature-chat"
          role="tab-chat"
          className="flex items-center space-x-2 data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900/30 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-300 text-gray-600 dark:text-gray-400"
        >
          <BotMessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">{t('AIChat')}</span>
          <span className="sm:hidden">AI Chat</span>
        </TabsTrigger>
        <TabsTrigger
          value="feature-collab"
          role="tab-collab"
          className="flex items-center space-x-2 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/30 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-300 text-gray-600 dark:text-gray-400"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">{t('shareAndCollab')}</span>
          <span className="sm:hidden">Collaboration</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="feature-gen-text" className="space-y-8" role="tab-content-gen-text">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('AIGenTextTitle')}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('AIGenTextDesc')}</p>
        </div>
        <div className="aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/25 overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={img1} alt="AI Writing" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </TabsContent>

      <TabsContent value="feature-opt-text" className="space-y-8" role="tab-content-opt-text">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('AIProcessTextTitle')}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('AIProcessTextDesc')}</p>
        </div>
        <div className="aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/25 overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={img2} alt="AI Text Optimization" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </TabsContent>

      <TabsContent value="feature-chat" className="space-y-8" role="tab-content-chat">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('AIChat')}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('AIChatDesc')}</p>
        </div>
        <div className="aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/25 overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={img3} alt="Feature C demonstration" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </TabsContent>

      <TabsContent value="feature-collab" className="space-y-8" role="tab-content-collab">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('shareAndCollabTitle')}</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t('shareAndCollabDesc')}</p>
        </div>
        <div className="aspect-video bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/25 overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={img4} alt="Collaboration" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </TabsContent>
    </Tabs>
  )
}
