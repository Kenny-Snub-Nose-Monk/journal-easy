import { useEffect, useCallback } from 'react'
import { Editor } from '@tiptap/core'
import throttle from 'lodash.throttle'
import { EDITOR_CHARACTER_LIMIT } from '@/constants'
import { useToast } from '@/components/ui/use-toast'
import { useEditorStore } from '@/stores/editor-store'

const limitToast = throttle(
  (toast) => {
    const { dismiss } = toast({
      variant: 'destructive',
      description: `文章最多可输入 ${EDITOR_CHARACTER_LIMIT} 字`,
    })
    setTimeout(dismiss, 5000)
  },
  3000,
  { leading: true, trailing: false }
)

export default function useCountLimit(editor: Editor | null) {
  const { toast } = useToast()
  const countLimitToast = useCallback(() => {
    limitToast(toast)
  }, [toast])

  const setCharacterCount = useEditorStore((s) => s.setCharacterCount)

  useEffect(() => {
    if (editor == null) return
    editor.on('update', () => {
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
      // characterCount.words() 可統計英文單詞數量，但不適用於中文
    })
  }, [editor, countLimitToast, setCharacterCount])
}
