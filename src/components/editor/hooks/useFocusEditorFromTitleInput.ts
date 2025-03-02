import { useEffect } from 'react'
import { Editor } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import emitter from '@/lib/emitter'
import { EVENT_KEY_FOCUS_CONTENT } from '@/constants'

export default function useFocusEditorFromTitleInput(editor: Editor | null) {
  // insert a paragraph at the beginning when title input enter
  useEffect(() => {
    // 聚焦到編輯器內容區域
    function handler() {
      if (!editor) return

      const { dispatch } = editor.view
      const { tr, schema } = editor.state

      // 聚焦到內容區域
      editor.chain().focus()
      // 創建段落 node
      const newParagraph = schema.nodes.paragraph.create(null, null)
      // 創建一個在文章開頭插入段落的事務
      const transaction = tr.insert(0, newParagraph)
      // 文檔的開始位置
      const startPos = transaction.doc.resolve(0)
      // 光標選擇到文檔開始的位置
      transaction.setSelection(TextSelection.near(startPos))
      // 派發事務
      dispatch(transaction)
    }
    emitter.on(EVENT_KEY_FOCUS_CONTENT, handler)
    return () => emitter.off(EVENT_KEY_FOCUS_CONTENT, handler)
  }, [editor])
}
