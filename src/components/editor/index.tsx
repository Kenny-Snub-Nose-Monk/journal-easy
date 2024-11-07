'use client'
import { useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import TextMenu from './menus/text-menu'
import ColumnsMenu from './menus/columns-menu'
import LinkMenu from './menus/link-menu'
import ImageBlockMenu from './menus/image-block-menu'
import { extensions } from './extensions'
import ContentMenu from './menus/content-menu'

interface IProps {
  rawContent: string
  handleUpdate: (content: string) => void
}

// Output JSON
function get_content(rawContent: string) {
  try {
    return JSON.parse(rawContent)
  } catch (error) {
    return undefined
  }
}

const TiptapEditor = (props: IProps) => {
  const { rawContent, handleUpdate } = props
  const menuContainerRef = useRef(null)

  const editor = useEditor({
    extensions,
    content: get_content(rawContent),
    onUpdate: ({ editor }) => {
      const data = editor.getJSON()
      handleUpdate(JSON.stringify(data))
    },
    editorProps: {
      attributes: {
        class: 'min-h-96 prose dark:prose-invert focus:outline-none max-w-none',
      },
    },
  })
  return (
    <div ref={menuContainerRef}>
      <EditorContent editor={editor} />
      <ContentMenu editor={editor} />
      <TextMenu editor={editor} />
      <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
    </div>
  )
}
export default TiptapEditor
