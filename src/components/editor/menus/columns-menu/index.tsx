import { BubbleMenu, Editor } from '@tiptap/react'
import { use, useCallback } from 'react'
// 從 tippy.js 引入 sticky 插件
// sticky 用於確保 tippy 彈出框在滾動時保持固定位置
// 當頁面滾動時，彈出框會跟隨其參考元素移動
import { sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'
import { Columns2, PanelLeft, PanelRight, Trash2 } from 'lucide-react'
import { getRenderContainer } from '@/components/editor/utils/getRenderContainer'
import { ColumnLayout } from '@/components/editor/extensions/column/Columns'
import { Button } from '@/components/ui/button'

interface IProps {
  editor: Editor | null
  appendTo: React.RefObject<any>
}

export default function ColumnsMenu(props: IProps) {
  const { editor, appendTo } = props

  //計算menu的定位
  const getReferenceClientRect = useCallback(() => {
    if (editor == null) return new DOMRect(-1000, -1000, 0, 0)

    const renderContainer = getRenderContainer(editor, 'columns')
    const rect =
      renderContainer?.getBoundingClientRect() ||
      new DOMRect(-1000, -1000, 0, 0)

    return rect
  }, [editor])

  //menu 是否顯示
  const shouldShow = useCallback(() => {
    if (editor == null) return false
    const isColumns = editor.isActive('columns')
    return isColumns
  }, [editor])

  // left
  const onColumnLeft = useCallback(() => {
    editor && editor.chain().focus().setLayout(ColumnLayout.SidebarLeft).run()
  }, [editor])

  const isLeftActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('columns', {
        layout: ColumnLayout.SidebarLeft,
      })
    )
  }, [editor])

  // right
  const onColumnRight = useCallback(() => {
    editor && editor.chain().focus().setLayout(ColumnLayout.SidebarRight).run()
  }, [editor])
  const isRightActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('columns', {
        layout: ColumnLayout.SidebarRight,
      })
    )
  }, [editor])

  // two
  const onColumnTwo = useCallback(() => {
    editor && editor.chain().focus().setLayout(ColumnLayout.TwoColumn).run()
  }, [editor])
  const isTwoActive = useCallback(() => {
    return (
      editor &&
      editor.isActive('columns', {
        layout: ColumnLayout.TwoColumn,
      })
    )
  }, [editor])

  if (editor == null) return

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={`columnsMenu-${uuid()}`} //
      updateDelay={100}
      shouldShow={shouldShow}
      // BubbleMenu 是基於 tippy 開發的，所以它可以傳入一些 tippy 的配置 https://atomiks.github.io/tippyjs/v6/all-props/
      tippyOptions={{
        offset: [0, 8],
        popperOptions: {
          modifiers: [{ name: 'flip', enabled: false }],
        },
        getReferenceClientRect,
        appendTo: () => appendTo?.current,
        plugins: [sticky],
        sticky: 'popper',
      }}
    >
      <div
        className="
          border rounded p-1 shadow
          bg-background dark:bg-background-dark dark:border-gray-800 dark:shadow-lg 
          inline-flex space-x-1
        "
      >
        <Button
          size="sm"
          onClick={onColumnLeft}
          variant={isLeftActive() ? 'secondary' : 'ghost'}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={onColumnTwo}
          variant={isTwoActive() ? 'secondary' : 'ghost'}
        >
          <Columns2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={onColumnRight}
          variant={isRightActive() ? 'secondary' : 'ghost'}
        >
          <PanelRight className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().deleteColumns().run()}
          variant="ghost"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </BubbleMenu>
  )
}
