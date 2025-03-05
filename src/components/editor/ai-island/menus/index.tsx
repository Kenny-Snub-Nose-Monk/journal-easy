import { Editor } from '@tiptap/react'
import { MessagesType } from '../hooks/useGenMessages'
import ContinueMenu from './continue-menu'
import BrainStormMenu from './brain-storm-menu'
import OutlineMenu from './outline-menu'
import SummaryMenu from './summary-menu'
import MakeLongerMenu from './make-longer-menu'
import MakeShorterMenu from './make-shorter-menu'
// import FixSyntaxMenu from './fix-syntax-menu'
import ChangeToneMenu from './change-tone-menu'
import TranslateMenu from './translate-menu'
import ExplainMenu from './explain-menu'
interface IProps {
  editor: Editor | null
  onRequestAI: (message: MessagesType) => void
  setInstruction: (instruction: string) => void
}
export function MenusWhenSelectionIsEmpty(props: IProps) {
  const { editor, onRequestAI, setInstruction } = props
  return (
    <div className="flex justify-center">
      <ContinueMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      <BrainStormMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      <OutlineMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      <SummaryMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
    </div>
  )
}
export function MenusWhenSelectionIsNotEmpty(props: IProps) {
  const { editor, onRequestAI, setInstruction } = props
  return (
    <div className="flex justify-center">
      <MakeLongerMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      <MakeShorterMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      <ChangeToneMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      <TranslateMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      <ExplainMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      />
      {/* <FixSyntaxMenu
        editor={editor}
        onRequestAI={onRequestAI}
        setInstruction={setInstruction}
      /> */}
    </div>
  )
}
