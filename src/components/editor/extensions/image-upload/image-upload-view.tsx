import { Range } from '@tiptap/core'
import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback, useState } from 'react'
import ImageUploader from './image-uploader'
import { getWidthPercent } from '@/components/editor/utils/img'

interface ImageUploadViewProps {
  getPos: () => number
  editor: Editor
}

export default function ImageUploadView(props: ImageUploadViewProps) {
  const { editor } = props
  const [range, setRange] = useState<Range | null>(null)
  function setCurUploaderRange() {
    const { from, to } = editor.state.selection
    // console.log('range ', from, to)
    setRange({ from, to })
  }

  const onUpload = useCallback(
    (url: string, ratio: number) => {
      const width = getWidthPercent(ratio)
      if (url && range) {
        editor
          .chain()
          .setImageBlockAt({ src: url, pos: range }) // 插入圖片 imageBlock Node
          .setImageBlockWidth(width)
          .setImageBlockRatio(ratio) // 刪除當前 imageUpload Node
          .focus()
          .run()
      }
    },
    [editor, range]
  )

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <ImageUploader
          onUpload={onUpload}
          setCurUploaderRange={setCurUploaderRange}
        />
      </div>
    </NodeViewWrapper>
  )
}
