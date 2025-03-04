import { useEffect, useCallback } from 'react'
import { Editor } from '@tiptap/core'
import throttle from 'lodash.throttle'
import { EDITOR_CHARACTER_LIMIT } from '@/constants'
import { useToast } from '@/components/ui/use-toast'
import { useEditorStore } from '@/stores/editor-store'
import { useDebounceFn } from 'ahooks'
import { useTranslations, useLocale } from 'next-intl'

export default function useCountLimit(editor: Editor | null) {
  const t = useTranslations('editor')
  const locale = useLocale()
  const { toast } = useToast()

  const { run: limitToast } = useDebounceFn(
    (toast) => {
      const { dismiss } = toast({
        variant: 'destructive',
        // description: `文档最多可输入 ${EDITOR_CHARACTER_LIMIT} 字`,
        description: t('maxLengthTip', { limit: EDITOR_CHARACTER_LIMIT }),
      })
      setTimeout(dismiss, 3000)
    },
    { wait: 1000 }
  )
  const countLimitToast = useCallback(() => {
    limitToast(toast)
  }, [toast, limitToast])

  const setCharacterCount = useEditorStore((s) => s.setCharacterCount)
  const setWordCount = useEditorStore((s) => s.setWordCount)

  useEffect(() => {
    if (editor == null) return
    const fn = () => {
      const characterCount = editor?.storage.characterCount || {
        characters: () => 0,
        words: () => 0,
      }
      if (characterCount.characters() >= EDITOR_CHARACTER_LIMIT) {
        const { to } = editor.state.selection
        editor.commands.deleteRange({ from: to - 1, to })
        countLimitToast()
        return
      }
      setCharacterCount(characterCount.characters())
      setWordCount(characterCount.words())
      // 可統計英文單詞數量，但不適用於中文
    }
    editor.on('update', fn)

    return () => {
      editor.off('update', fn) // remove event listener in time
    }
  }, [editor, countLimitToast, setCharacterCount, setWordCount, locale])
}
