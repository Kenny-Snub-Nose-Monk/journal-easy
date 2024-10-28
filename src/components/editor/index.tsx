'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<h2>Title</h2><p>Hello World! 🌎️</p>',
    editorProps: {
      attributes: {
        class:
          'min-h-96 prose dark:prose-invert lg:prose-lg focus:outline-none',
      },
    },
  })
  return <EditorContent editor={editor} />
}
export default TiptapEditor
