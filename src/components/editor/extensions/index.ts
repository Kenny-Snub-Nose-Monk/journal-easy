import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import { TaskItem } from '@tiptap/extension-task-item'
import { TaskList } from '@tiptap/extension-task-list'
import Link from '@tiptap/extension-link'
import SearchAndReplace from '@sereneinserenade/tiptap-search-and-replace'
import { FileHandler } from './file-handler'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { CharacterCount } from '@tiptap/extension-character-count'
import Document from './document'
import HorizontalRule from './horizontal-rule'
import { SlashCommands } from './slash-commands'
import { Columns, Column } from './column'
import ImageBlock from './image-block'
import { ImageUpload } from './image-upload'
import { Table, TableCell, TableRow, TableHeader } from './table/index'
import Selection from './selection'
import AddParagraph from './paragraph'
import { CodeBlockTabIndent } from './code-block-tab-indent'
import { EDITOR_CHARACTER_LIMIT } from '@/constants'
import MermaidBlock from './mermaid'

interface IOptions {
  placeholder: string
  collaborative?: boolean
}

export const getExtensions = (opt: IOptions) => {
  const { placeholder } = opt

  const extensions = [
    Document,
    Columns,
    Column,
    HorizontalRule,
    StarterKit.configure({
      document: false,
      dropcursor: false,
      horizontalRule: false,
      history: opt.collaborative ? false : undefined,
    }),
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    SubScript,
    Superscript,
    Highlight.configure({ multicolor: true }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Link.configure({
      openOnClick: false,
    }),
    ImageBlock,
    ImageUpload,
    FileHandler,
    Table,
    TableCell,
    TableRow,
    TableHeader,
    Placeholder.configure({ placeholder }),
    SlashCommands,
    Dropcursor.configure({
      width: 2,
      class: 'ProseMirror-dropcursor border-black',
    }),
    Selection,
    SearchAndReplace.configure({
      searchResultClass: 'search-result',
      disableRegex: true,
    }),
    CharacterCount.configure({ limit: EDITOR_CHARACTER_LIMIT }),
    AddParagraph,
    CodeBlockTabIndent,
    MermaidBlock,
  ]

  return extensions
}
