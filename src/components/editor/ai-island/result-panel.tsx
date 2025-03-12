import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { X, Sparkle, BetweenHorizonalStart, Replace } from 'lucide-react'
import { useEffect, useRef } from 'react'
import scrollIntoView from 'scroll-into-view-if-needed'
import markdownit from 'markdown-it'
import { useTranslations } from 'next-intl'

const md = markdownit()

interface IProps {
  editor: Editor | null
  isSelectionEmpty: boolean
  loading: boolean
  result: string
  setResult: (result: string) => void
  setInstruction: (instruction: string) => void
  reRequestAI: () => void
}
export default function ResultPanel(props: IProps) {
  const {
    editor,
    isSelectionEmpty,
    loading,
    result = '',
    setResult,
    setInstruction,
    reRequestAI,
  } = props
  const menuRef = useRef<HTMLDivElement>(null)

  const resultHtml = md.render(result)
  const innerHtml = { __html: resultHtml }
  const t = useTranslations('AIInput')

  useEffect(() => {
    if (editor == null) return

    const handleUpdate = () => {
      console.log('編輯器內容已更新:', editor.getHTML())
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
    }
  }, [editor])

  // 插入編輯器，考慮換行
  function insertResultToEditor() {
    if (editor == null) return

    if (resultHtml) {
      editor.commands.insertContent(resultHtml)
    }

    editor.commands.scrollIntoView()
  }

  useEffect(() => {
    if (menuRef.current == null) return
    // 如果內容太多，需要持續滾動，保證一直能看到菜單
    scrollIntoView(menuRef.current!, {
      scrollMode: 'if-needed',
      behavior: 'smooth',
      block: 'center',
    })
  }, [result])
  // 替換
  function onReplace() {
    if (editor == null) return
    insertResultToEditor()
    editor.commands.focus()
    setResult('')
    setInstruction('')
  }

  useEffect(() => {
    if (editor == null) return
    console.log(editor.state.selection)
  }, [editor?.state.selection])

  // 插入
  function onInsert() {
    if (editor == null) return
    const { to } = editor.state.selection
    editor.commands.focus(to)
    editor.commands.enter()
    insertResultToEditor()
    setResult('')
    setInstruction('')
  }
  // 關閉
  function onClose() {
    setResult('')
    setInstruction('')
    editor?.commands.focus()
  }

  if (editor == null) return null
  // if (isSelectionEmpty) return null
  if (!result && !loading) return null

  return (
    <div className="border-2 border-blue-600 rounded-lg shadow-lg p-4 pb-2 mb-2">
      <div className="max-h-72 overflow-y-auto">
        <div>
          {!result && (
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {t('AIgenerating')}
              </span>
            </div>
          )}
          {result && (
            <div
              dangerouslySetInnerHTML={innerHtml}
              className="prose dark:prose-invert max-w-none"
            ></div>
          )}
        </div>
        <div className="flex justify-center mt-1" ref={menuRef}>
          {/* AI 結果的菜單：替換，插入，重新生成，取消 */}
          <Button
            onClick={onReplace}
            disabled={loading || isSelectionEmpty}
            variant="ghost"
            className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
            tabIndex={-1}
          >
            <Replace className="h-4 w-4 mr-1" />
            {t('replace')}
          </Button>
          <Button
            onClick={onInsert}
            disabled={loading}
            variant="ghost"
            className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
            tabIndex={-1}
          >
            <BetweenHorizonalStart className="h-4 w-4 mr-1" />
            {t('insert')}
          </Button>
          <Button
            onClick={reRequestAI}
            disabled={loading}
            variant="ghost"
            className="p-2 text-blue-500 hover:bg-inherit hover:text-blue-400"
            tabIndex={-1}
          >
            <Sparkle className="h-4 w-4 mr-1" />
            {t('regenerate')}
          </Button>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="ghost"
            className="p-2 text-red-500 hover:bg-inherit hover:text-red-400"
            tabIndex={-1}
          >
            <X className="h-4 w-4 mr-1" />
            {t('close')}
          </Button>
        </div>
      </div>
    </div>
  )
}
