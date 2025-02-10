'use client'
import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import TextMenu from './menus/text-menu'
import ColumnsMenu from './menus/columns-menu'
import LinkMenu from './menus/link-menu'
import ImageBlockMenu from './menus/image-block-menu'
import { extensions } from './extensions'
import ContentMenu from './menus/content-menu'
import { TableRowMenu, TableColMenu } from './menus/table-menu'
import emitter from '@/lib/emitter'
import { EVENT_KEY_AI_EDIT, EVENT_KEY_FOCUS_AI } from '@/constants'

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

  // 監聽 AI island 事件
  useEffect(() => {
    function handler(payload: any) {
      if (editor == null) return

      const { content = '' } = payload || {}
      if (!content) return

      editor.commands.insertContent(content)
    }

    emitter.on(EVENT_KEY_AI_EDIT, handler)

    return () => {
      emitter.off(EVENT_KEY_AI_EDIT, handler)
    }
  }, [editor])

  // 監聽空格輸入，focus AI island
  useEffect(() => {
    if (editor == null) return
    function fn(event: KeyboardEvent) {
      if (event.key !== ' ' && event.code !== 'Tab') return
      if (editor == null) return
      const selection = editor.state.selection
      if (!selection.empty) return
      const node = selection.$anchor.node()
      if (node && node.isTextblock && node.textContent.trim() === '') {
        event.preventDefault()
        emitter.emit(EVENT_KEY_FOCUS_AI)
      }
    }
    editor.view.dom.addEventListener('keydown', fn)
    return () => editor.view.dom.removeEventListener('keydown', fn)
  }, [editor])

  return (
    <div ref={menuContainerRef}>
      <EditorContent editor={editor} />
      <ContentMenu editor={editor} />
      <TextMenu editor={editor} />
      <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      <TableRowMenu editor={editor} appendTo={menuContainerRef} />
      <TableColMenu editor={editor} appendTo={menuContainerRef} />
    </div>
  )
}
export default TiptapEditor
