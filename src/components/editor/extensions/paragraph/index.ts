import { Extension } from '@tiptap/core'
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state'
import { EDITOR_PADDING_BOTTOM } from '@/constants'

export const addParagraph = Extension.create({
  name: 'addParagraph',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('addParagraph'),
        props: {
          handleDOMEvents: {
            // 點擊事件處理函數，在編輯器的 DOM 元素被點擊時被調用
            click(view, event) {
              const { state, dispatch } = view
              const { schema, tr, doc } = state

              // 獲取編輯器的 DOM 元素
              const editorElement = view.dom
              // 獲取編輯器元素的尺寸和位置信息
              const editorBounds = editorElement.getBoundingClientRect()
              // 獲取用戶點擊編輯器中點擊事件發生時的 Y 軸座標
              const clickY = event.clientY

              // 獲取編輯器內部最後一個節點
              const lastNode = doc.lastChild
              // 獲取編輯器文檔內容的最後一個位置
              const lastPos = doc.content.size
              // 將文檔中的最後一個位置轉換為視圖中的座標
              const lastCoords = view.coordsAtPos(lastPos)

              // 判斷點擊事件是否發生在編輯器底部的 padding-bottom 區域
              const isClickInBottomPadding =
                clickY > editorBounds.bottom - EDITOR_PADDING_BOTTOM

              // 判斷點擊事件是否發生在編輯器內部的最後一個節點底部之外的區域
              const isClickOutLastNodeBottom = clickY > lastCoords.bottom

              if (isClickInBottomPadding || isClickOutLastNodeBottom) {
                // 判斷最後一個節點是否為空段落，如果是，則不增加新的段落
                if (
                  lastNode &&
                  lastNode.type.name === 'paragraph' &&
                  lastNode.textContent === ''
                ) {
                  return false
                }
                // 獲取當前文檔內容的結束位置
                const endPos = doc.content.size

                // 插入新的段落並將光標移動至新段落開頭的位置
                // 1. 創建新的段落節點
                const newParagraph = schema.nodes.paragraph.create()
                // 2. 創建一個事務，在當前文檔的結束位置插入新的段落節點
                const transaction = tr.insert(endPos, newParagraph)
                // 3. 獲取插入節點之後的位置
                const resolvedPos = transaction.doc.resolve(endPos + 1)
                // 4. 將編輯器的光標移動到新插入段落的開始位置
                transaction.setSelection(TextSelection.near(resolvedPos))

                // 將事務派發至編輯器的狀態當中
                dispatch(transaction)
                // 確保編輯器的視圖聚焦在插入新段落之後的文檔部分
                view.focus()
                // 告訴 ProseMirror 的事件處理系統，此事件已被處理，不需要執行默認的處理
                return true
              }
              return false
            },
          },
        },
      }),
    ]
  },
})

export default addParagraph
