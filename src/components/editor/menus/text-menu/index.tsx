'use client'

import { BubbleMenu, Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  Superscript,
  Subscript,
  AlignCenter,
  AlignLeft,
  AlignRight,
} from 'lucide-react'

interface IProps {
  editor: Editor | null
}

export default function TextMenu(props: IProps) {
  const { editor } = props
  if (editor == null) return

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      updateDelay={100}
    >
      <div
        className="
          border rounded p-1 shadow
          bg-background dark:bg-background-dark dark:border-gray-800 dark:shadow-lg 
          inline-flex space-x-1
        "
      >
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          variant={editor.isActive('code') ? 'secondary' : 'ghost'}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="border h-auto" />
        <Button
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          variant={
            editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'
          }
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          variant={
            editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'
          }
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          variant={
            editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'
          }
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-auto" />
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          variant={editor.isActive('superscript') ? 'secondary' : 'ghost'}
        >
          <Superscript className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          variant={editor.isActive('subscript') ? 'secondary' : 'ghost'}
        >
          <Subscript className="h-4 w-4" />
        </Button>
      </div>
    </BubbleMenu>
  )
}
