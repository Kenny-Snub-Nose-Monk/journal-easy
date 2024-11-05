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
import { SlashCommands } from './slash-commands'
import Document from './document'
import { Columns, Column } from './column'
import ImageBlock from './image-block'

export const extensions = [
  Document,
  Columns,
  Column,
  StarterKit.configure({
    document: false,
  }),
  Underline,
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  SubScript,
  Superscript,
  Highlight.configure({ multicolor: true }),
  ImageBlock,
  Placeholder.configure({
    placeholder: '請輸入內容...',
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Link.configure({
    openOnClick: false,
  }),
  SlashCommands,
]
