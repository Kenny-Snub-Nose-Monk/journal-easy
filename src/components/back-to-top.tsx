import { Button } from '@/components/ui/button'
import { ArrowUpFromLine } from 'lucide-react'
import scrollIntoView from 'scroll-into-view-if-needed'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import debounce from 'lodash.debounce'
import { useEffect, useState } from 'react'
import { WORK_CONTENT_SCROLL_CONTAINER } from '@/constants'

export default function BackToTop(props: { target: React.RefObject<any> }) {
  const { target } = props

  const [shouldShowBackToTop, setShouldShowBackToTop] = useState(false)

  // 檢查滾動條狀態，判斷是否展示”返回頂部“按鈕。
  const checkScrollBar = debounce(() => {
    const element = document.getElementById(WORK_CONTENT_SCROLL_CONTAINER)
    if (element) {
      const hasVerticalScrollbar = element.scrollTop > 0
      setShouldShowBackToTop(hasVerticalScrollbar)
    }
  }, 200)

  useEffect(() => {
    // 由於滾動條的捕獲元素為WORK_CONTENT_SCROLL_CONTAINER，所以在此處捕獲其滾動事件
    const element = document.getElementById(WORK_CONTENT_SCROLL_CONTAINER)
    if (element) {
      element.addEventListener('scroll', checkScrollBar)
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', checkScrollBar)
      }
    }
  }, [checkScrollBar])

  const scrollToTop = () => {
    scrollIntoView(target.current!, {
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      {shouldShowBackToTop && (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={scrollToTop}
                className="fixed bottom-24 right-10 rounded-full"
              >
                <ArrowUpFromLine />
              </Button>
            </TooltipTrigger>
            <TooltipContent align="center">
              <p>回頂部</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  )
}
