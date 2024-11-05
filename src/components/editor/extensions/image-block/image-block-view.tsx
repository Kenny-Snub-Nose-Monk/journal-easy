import { cn } from '@/lib/utils'
import { Node } from '@tiptap/pm/model'
import { Editor, NodeView, NodeViewWrapper } from '@tiptap/react'
import { use, useCallback, useRef } from 'react'

interface ImageBlockViewProps {
  editor: Editor
  getPos: () => number
  node: Node & {
    attrs: {
      src: string
    }
  }
  updateAttributes: (attrs: Record<string, string>) => void
}

export const ImageBlockView = (props: ImageBlockViewProps) => {
  const { editor, getPos, node } = props
  const { src } = node.attrs

  const wrapperClassName = cn(
    node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
    node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
    node.attrs.align === 'center' && 'mx-auto'
  )

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos())
  }, [getPos, editor.commands])

  return (
    <NodeViewWrapper>
      <div className={wrapperClassName} style={{ width: node.attrs.width }}>
        {/* eslint-disable-next-line */}
        <img className="block" src={src} alt="" onClick={onClick} />
      </div>
    </NodeViewWrapper>
  )
}

export default ImageBlockView
