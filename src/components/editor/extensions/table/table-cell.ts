import { mergeAttributes, Node } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

import { getCellsInColumn, isRowSelected, selectRow } from './utils'

export interface TableCellOptions {
  HTMLAttributes: Record<string, any>
}

// 自定义 tableCell Node
export const TableCell = Node.create<TableCellOptions>({
  // 節點名稱
  name: 'tableCell',

  // 定義表格單元格可以包含的內容
  // block+ 表示至少需要一個區塊級元素，且不允許嵌套表格
  content: 'block+', // Do not allow table in table

  // 定義在表格中的角色為單元格
  tableRole: 'cell',

  // 設置為 true 表示這是一個隔離的節點
  // 這意味著其內容的選擇和刪除等操作不會影響到外部
  isolating: true,

  // 添加選項配置
  addOptions() {
    return {
      // 可以傳入自定義的 HTML 屬性
      HTMLAttributes: {},
    }
  },

  // 定義如何從 HTML 解析成節點
  parseHTML() {
    // 匹配 td 標籤
    return [{ tag: 'td' }]
  },

  // 定義如何將節點渲染為 HTML
  renderHTML({ HTMLAttributes }) {
    return [
      'td', // 標籤名
      // 合併默認屬性和自定義屬性
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0, // 內容位置
    ]
  },

  // 定義節點的屬性
  addAttributes() {
    return {
      // colspan 屬性：定義單元格橫跨的 column 數
      colspan: {
        default: 1,
        parseHTML: (element) => {
          const colspan = element.getAttribute('colspan')
          const value = colspan ? parseInt(colspan, 10) : 1

          return value
        },
      },
      // rowspan 屬性：定義單元格縱跨的 row 數
      rowspan: {
        default: 1,
        parseHTML: (element) => {
          const rowspan = element.getAttribute('rowspan')
          const value = rowspan ? parseInt(rowspan, 10) : 1

          return value
        },
      },
      // colwidth 屬性：定義 column 寬
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute('colwidth')
          const value = colwidth ? [parseInt(colwidth, 10)] : null

          return value
        },
      },
      // style 屬性：定義單元格樣式
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
            // 獲取第一 column 的所有單元格
            const cells = getCellsInColumn(0)(selection)

            if (cells) {
              // 為每個單元格添加 row 控制器裝飾
              cells.forEach(({ pos }: { pos: number }, index: number) => {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    // 檢查當前 row 是否被選中
                    const rowSelected = isRowSelected(index)(selection)
                    let className = 'grip-row'

                    // 根據狀態添加對應的類名
                    if (rowSelected) {
                      className += ' selected'
                    }

                    if (index === 0) {
                      className += ' first'
                    }

                    if (index === cells.length - 1) {
                      className += ' last'
                    }

                    // 創建 row 控制器元素
                    const grip = document.createElement('a')

                    grip.className = className
                    // 添加鼠標事件處理
                    grip.addEventListener('mousedown', (event) => {
                      event.preventDefault()
                      event.stopImmediatePropagation()

                      // 選中整 row
                      this.editor.view.dispatch(
                        selectRow(index)(this.editor.state.tr)
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
