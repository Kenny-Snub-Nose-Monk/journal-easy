import TiptapTableHeader from '@tiptap/extension-table-header'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { getCellsInRow, isColumnSelected, selectColumn } from './utils'
export const TableHeader = TiptapTableHeader.extend({
  // 定義表格標題單元格的屬性
  addAttributes() {
    return {
      // colspan: 定義單元格橫跨的 column 數
      colspan: {
        default: 1,
      },
      // rowspan: 定義單元格縱跨的 row 數
      rowspan: {
        default: 1,
      },
      // colwidth: 定義 column 寬
      colwidth: {
        default: null,
        // 從 HTML 解析 column 寬屬性
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth')
          // 將逗號分隔的寬度值轉換為數字數組
          const value = colwidth
            ? colwidth.split(',').map((item) => parseInt(item, 10))
            : null
          return value
        },
      },
      // style: 定義單元格樣式
      style: {
        default: null,
      },
    }
  },

  // 添加 ProseMirror 插件
  addProseMirrorPlugins() {
    // 獲取編輯器是否可編輯狀態
    const { isEditable } = this.editor
    return [
      new Plugin({
        props: {
          // 處理裝飾器
          decorations: (state) => {
            // 如果不可編輯，返回空裝飾集
            if (!isEditable) {
              return DecorationSet.empty
            }

            const { doc, selection } = state
            const decorations: Decoration[] = []
            // 獲取第一 row 的所有單元格
            const cells = getCellsInRow(0)(selection)

            if (cells) {
              // 為每個單元格添加 column 控制器裝飾
              cells.forEach(({ pos }: { pos: number }, index: number) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    // 檢查當前 column 是否被選中
                    const colSelected = isColumnSelected(index)(selection)
                    let className = 'grip-column'

                    // 根據狀態添加對應的類名
                    if (colSelected) {
                      className += ' selected'
                    }

                    if (index === 0) {
                      className += ' first'
                    }

                    if (index === cells.length - 1) {
                      className += ' last'
                    }

                    // 創建 column 控制器元素
                    const grip = document.createElement('a')
                    grip.className = className
                    // 添加鼠標事件處理
                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault()
                      event.stopImmediatePropagation()

                      // 選中整 column
                      this.editor.view.dispatch(
                        selectColumn(index)(this.editor.state.tr)
                      )
                    })

                    return grip
                  })
                )
              })
            }

            // 返回所有裝飾的集合
            return DecorationSet.create(doc, decorations)
          },
        },
      }),
    ]
  },
})
