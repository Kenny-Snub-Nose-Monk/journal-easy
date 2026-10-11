'use client'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { WORK_CONTENT_CONTAINER_ID } from '@/constants'
import { cn } from '@/lib/utils'

// Browser PDF output supports system CJK fonts without a 46 MB GCP font module.
export default function ExportPdfButton({ className = '' }: { id: string; className?: string }) {
  const t = useTranslations('docItem')
  async function print() {
    const source = document.getElementById(WORK_CONTENT_CONTAINER_ID)
    const content = source?.querySelector('.tiptap')
    if (!content) return
    const popup = window.open('', '_blank', 'width=900,height=700')
    if (!popup) return window.alert('請允許彈出視窗 / Please allow popups')
    popup.opener = null
    popup.document.title = document.title
    const style = popup.document.createElement('style')
    style.textContent =
      '@page { size: A4; margin: 20mm } body { font-family: system-ui, sans-serif; line-height: 1.7 } img, svg { max-width: 100% } table { border-collapse: collapse; width: 100% } td, th { border: 1px solid #aaa; padding: 6px } pre { white-space: pre-wrap }'
    popup.document.head.append(style)
    const title = popup.document.createElement('h1')
    title.textContent = document.title
    popup.document.body.append(title)
    const clone = content.cloneNode(true) as HTMLElement
    clone.removeAttribute('contenteditable')
    clone.removeAttribute('style')
    clone.querySelectorAll('button, [data-print-hidden]').forEach((el) => el.remove())
    popup.document.body.append(clone)
    await Promise.all(
      Array.from(popup.document.images).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              img.onload = () => resolve()
              img.onerror = () => resolve()
            })
      )
    )
    popup.focus()
    popup.print()
  }
  return (
    <Button variant="ghost" className={cn('w-full justify-start p-2 h-8', className)} onClick={() => void print()}>
      <FileDown className="w-4 h-4 mr-1" />
      {t('exportPDF')}
    </Button>
  )
}
