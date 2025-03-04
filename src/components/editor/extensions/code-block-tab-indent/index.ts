import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const extensionName = 'codeBlockTabIndent'

export const CodeBlockTabIndent = Extension.create({
  name: extensionName,

  //自定義插件，用於tab 鍵處理縮進
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey(extensionName),
        props: {
          // handleKeyDown是ProseMirror 插件 API 的一部分，用於在插件中捕獲和處理鍵盤事件。
          handleKeyDown(view, event) {
            if (event.key === 'Tab') {
              const { state, dispatch } = view
              const { $from, empty } = state.selection
              if (empty) {
                if ($from.parent.type.name === 'codeBlock') {
                  event.preventDefault()
                  // 創建一個事務，在當前光標位置插入 縮進(4個空格)
                  const tr = state.tr.insertText('    ', $from.pos)
                  // 派發該事務，從而更新文檔內容並通知編輯器視圖進行更新。
                  dispatch(tr)
                  // true，表示事件已經處理，不需要再傳遞給其他插件或默認行為
                  return true
                }
              }
            }
            // false，表示事件未處理，可以繼續傳遞給其他插件或默認行為
            return false
          },
        },
      }),
    ]
  },
})
