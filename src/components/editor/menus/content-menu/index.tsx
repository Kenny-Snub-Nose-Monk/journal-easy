import { useState, useEffect } from 'react'
import { Node } from '@tiptap/pm/model'
import { NodeSelection } from '@tiptap/pm/state'
import AddButton from './add-button'
import DragButton from './drag-button'
import TriggerAIButton from './trigger-ai-button'
import { useGetEditor } from '@/components/editor'

// A selection toolbar uses only public editor APIs. Drag/drop is handled by ProseMirror.
export default function ContentMenu() {
  const editor = useGetEditor()
  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [pos, setPos] = useState(-1)
  useEffect(() => {
    if (!editor) return
    const update = () => {
      const { $from } = editor.state.selection
      const position = $from.depth ? $from.before(1) : $from.pos
      setPos(position)
      setCurrentNode(editor.state.doc.nodeAt(position))
    }
    editor.on('selectionUpdate', update)
    editor.on('update', update)
    update()
    return () => {
      editor.off('selectionUpdate', update)
      editor.off('update', update)
    }
  }, [editor])
  if (!editor?.isEditable || !currentNode || pos < 0) return null
  return (
    <div className="flex items-center text-muted-foreground my-2" aria-label="Block actions">
      <AddButton currentNode={currentNode} currentNodePos={pos} />
      <span
        draggable
        aria-label="Drag selected block"
        onDragStart={(event) => {
          const selection = NodeSelection.create(editor.state.doc, pos)
          editor.view.dispatch(editor.state.tr.setSelection(selection))
          const slice = selection.content()
          editor.view.dragging = { slice, move: true }
          event.dataTransfer.setData('text/plain', currentNode.textContent)
          event.dataTransfer.effectAllowed = 'move'
        }}
      >
        <DragButton currentNode={currentNode} currentNodePos={pos} />
      </span>
      <TriggerAIButton currentNode={currentNode} currentNodePos={pos} />
    </div>
  )
}
