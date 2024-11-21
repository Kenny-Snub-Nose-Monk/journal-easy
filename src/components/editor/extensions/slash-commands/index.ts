import { Editor, Extension } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { PluginKey } from '@tiptap/pm/state'
import tippy from 'tippy.js'
import { GROUPS } from './groups'
import render from './sug-render'

export const extensionName = 'slashCommand'

export let popup: any

export const SlashCommands = Extension.create({
  // 擴展名稱
  name: extensionName,

  // 設置優先級,數字越大優先級越高
  priority: 200,

  // 當編輯器初始化完成時觸發
  onCreate() {
    // 創建 tippy 實例用於顯示命令菜單
    popup = tippy('body', {
      interactive: true, // 允許與彈出框互動
      trigger: 'manual', // 手動觸發顯示/隱藏
      placement: 'bottom-start', // 彈出框位置
      theme: 'slash-command', // 主題樣式
      maxWidth: '16rem', // 最大寬度
      offset: [16, 8], // 偏移量 [x軸, y軸]
      popperOptions: {
        strategy: 'fixed', // 固定定位策略
        modifiers: [
          {
            name: 'flip',
            enabled: false, // 禁用自動翻轉, doc: https://popper.js.org/docs/v2/modifiers/flip/
          },
        ],
      },
    })
  },

  // 添加 ProseMirror 插件
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/', // 觸發字符
        allowSpaces: true, // 允許空格
        startOfLine: true, // 僅在行首觸發
        pluginKey: new PluginKey(extensionName), // 插件唯一標識

        // 判斷是否允許觸發建議菜單
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const isRootDepth = $from.depth === 1 // 檢查是否在文檔根層級
          const isParagraph = $from.parent.type.name === 'paragraph' // 檢查是否在段落中
          const isStartOfNode = $from.parent.textContent?.charAt(0) === '/' // 檢查是否在節點開頭

          const isInColumn = this.editor.isActive('column') // 檢查是否在column中

          // 檢查斜槓後是否有兩個空格(避免重複觸發)
          const afterContent = $from.parent.textContent?.substring(
            $from.parent.textContent?.indexOf('/')
          )
          const isValidAfterContent = !afterContent?.endsWith('  ')

          // 返回觸發條件：
          // 1. 在根層級的段落開頭 或 在列中的段落開頭
          // 2. 斜槓後沒有兩個空格
          return (
            ((isRootDepth && isParagraph && isStartOfNode) ||
              (isInColumn && isParagraph && isStartOfNode)) &&
            isValidAfterContent
          )
        },

        // 執行命令的處理函數
        command: ({ editor, props }: { editor: Editor; props: any }) => {
          const { view, state } = editor
          const { $head, $from } = view.state.selection

          // 計算需要刪除的範圍
          const end = $from.pos
          const from = $head?.nodeBefore
            ? end -
              ($head.nodeBefore.text?.substring(
                $head.nodeBefore.text?.indexOf('/')
              ).length ?? 0)
            : $from.start()

          // 刪除斜槓命令文本
          const tr = state.tr.deleteRange(from, end)
          view.dispatch(tr)

          // 執行選中命令的動作
          props.action(editor)
          view.focus()
        },

        // 獲取並過濾建議項目
        items: ({ query }: { query: string }) => {
          // 根據查詢過濾命令
          const withFilteredCommands = GROUPS.map((group) => ({
            ...group,
            commands: group.commands
              // 根據標籤和別名過濾
              .filter((item) => {
                const labelNormalized = item.label.toLowerCase().trim()
                const queryNormalized = query.toLowerCase().trim()
                if (item.aliases) {
                  const aliases = item.aliases.map((alias) =>
                    alias.toLowerCase().trim()
                  )
                  return (
                    labelNormalized.includes(queryNormalized) ||
                    aliases.includes(queryNormalized)
                  )
                }
                return labelNormalized.includes(queryNormalized)
              })
              // 過濾掉應該隱藏的命令
              .filter((command) =>
                command.shouldBeHidden
                  ? !command.shouldBeHidden(this.editor)
                  : true
              ),
          }))

          // 過濾掉沒有命令的分組
          const withoutEmptyGroups = withFilteredCommands.filter((group) => {
            return group.commands.length > 0
          })

          // 為每個命令添加啟用狀態
          const withEnabledSettings = withoutEmptyGroups.map((group) => ({
            ...group,
            commands: group.commands.map((command) => ({
              ...command,
              isEnabled: true,
            })),
          }))

          return withEnabledSettings
        },

        // 渲染建議菜單
        render,
      }),
    ]
  },

  // 初始化存儲數據
  addStorage() {
    return {
      // 存儲彈出框位置信息
      rect: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    }
  },
})
