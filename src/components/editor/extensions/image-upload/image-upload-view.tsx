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
      if (url && range) {
        const width = getWidthPercent(ratio)
        editor
          .chain()
          .setImageBlockAt({ src: url, pos: range }) // 插圖圖片 imageBlock 節點
          .setImageBlockWidth(width)
          .setImageBlockRatio(ratio)
          .focus()
          .run()
      }
    },
    [editor, range]
  )

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <ImageUploader onUpload={onUpload} setCurUploaderRange={setCurUploaderRange} />
      </div>
    </NodeViewWrapper>
  )
}
