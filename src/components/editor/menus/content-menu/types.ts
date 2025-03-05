import { Editor } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'

export interface IButtonProps {
  editor: Editor | null
  currentNode: Node | null
  currentNodePos: number
}
