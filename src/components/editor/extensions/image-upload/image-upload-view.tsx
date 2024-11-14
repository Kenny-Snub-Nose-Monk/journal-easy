import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback } from 'react'
import ImageUploader from './image-uploader'
import { getWidthPercent } from '@/components/editor/utils/img'

interface ImageUploadViewProps {
  getPos: () => number
  editor: Editor
}

export default function ImageUploadView(props: ImageUploadViewProps) {
  const { getPos, editor } = props

  const onUpload = useCallback(
    (url: string, ratio: number) => {
      const width = getWidthPercent(ratio)
      if (url) {
        editor
          .chain()
          .setImageBlock({ src: url, ratio }) // 插入圖片 imageBlock Node
          .setImageBlockWidth(width)
          .deleteRange({ from: getPos(), to: getPos() }) // 刪除當前 imageUpload Node
          .focus()
          .run()
      }
    },
    [getPos, editor]
  )

  return (
    <NodeViewWrapper>
      <div className="p-0 m-0" data-drag-handle>
        <ImageUploader onUpload={onUpload} />
      </div>
    </NodeViewWrapper>
  )
}
