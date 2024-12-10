import { CONTENT_WIDTH } from '@/constants'
import { cn } from '@/lib/utils'
import { Node } from '@tiptap/pm/model'
import { Editor, NodeViewWrapper } from '@tiptap/react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ImageBlockViewProps {
  editor: Editor
  getPos: () => number
  node: Node & {
    attrs: {
      src: string
      ratio: number
    }
  }
  updateAttributes: (attrs: Record<string, string>) => void
}

export default function ImageBlockView(props: ImageBlockViewProps) {
  const { editor, getPos, node } = props
  const { src } = node.attrs
  const imgContainerRef = useRef<HTMLDivElement>(null)

  const wrapperClassName = cn(
    node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
    node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
    node.attrs.align === 'center' && 'mx-auto',
    'bg-muted'
  )

  const onClick = useCallback(() => {
    editor.commands.setNodeSelection(getPos())
  }, [getPos, editor.commands])

  const onDoubleClick = useCallback(() => {
    window.open(src, '_blank')
  }, [src])

  const [height, setHeight] = useState('auto')

  useEffect(() => {
    if (isNaN(node.attrs.ratio)) return
    if (!node.attrs.ratio) return
    let w = imgContainerRef.current!.clientWidth
    if (!w) {
      w = CONTENT_WIDTH * (parseInt(node.attrs.width) / 100) // 如 node.attrs.width 是 50%
    }
    setHeight(`${w / node.attrs.ratio}px`) // 根據寬高比例計算高度
  }, [setHeight, node.attrs.width, node.attrs.ratio])

  return (
    <NodeViewWrapper>
      <div
        ref={imgContainerRef}
        className={wrapperClassName}
        style={{ width: node.attrs.width, height }}
      >
        {/* eslint-disable-next-line  */}
        <img
          className="block"
          src={src}
          alt=""
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          style={{ height: '100%' }}
          loading="lazy"
        />
      </div>
    </NodeViewWrapper>
  )
}
