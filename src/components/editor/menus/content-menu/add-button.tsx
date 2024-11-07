import { useCallback } from 'react'
import { Editor } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AddButtonProps {
  editor: Editor | null
  currentNode: Node | null
  currentNodePos: number
}

export default function AddButton(props: AddButtonProps) {
  const { editor, currentNode, currentNodePos } = props

  // 處理點擊加號按鈕的事件
  const handleAdd = useCallback(() => {
    // 只有當有選中節點時才執行
    if (currentNodePos !== -1) {
      // 計算當前節點的大小和插入位置
      const currentNodeSize = currentNode?.nodeSize || 0
      const insertPos = currentNodePos + currentNodeSize

      // 判斷當前節點是否為空段落
      const currentNodeIsEmptyParagraph =
        currentNode?.type.name === 'paragraph' &&
        currentNode?.content?.size === 0

      // 計算光標位置
      // 如果是空段落,光標位置為當前位置+2
      // 否則為插入位置+2
      const focusPos = currentNodeIsEmptyParagraph
        ? currentNodePos + 2
        : insertPos + 2

      editor &&
        editor
          .chain()
          .command(({ dispatch, tr, state }) => {
            if (dispatch) {
              if (currentNodeIsEmptyParagraph) {
                // 如果是空段落,直接在當前位置插入 '/'
                tr.insertText('/', currentNodePos, currentNodePos + 1)
              } else {
                // 否則創建新段落並插入 '/'
                tr.insert(
                  insertPos,
                  state.schema.nodes.paragraph.create(null, [
                    state.schema.text('/'),
                  ])
                )
              }
              return dispatch(tr)
            }
            return true
          })
          // 設置光標位置並執行
          .focus(focusPos)
          .run()
    }
  }, [currentNode, currentNodePos, editor])

  // 如果沒有editor則不渲染
  if (editor == null) return

  // 渲染加號按鈕
  return (
    <Button size="sm" variant="ghost" onClick={handleAdd}>
      <Plus className="h-4 w-4" />
    </Button>
  )
}
