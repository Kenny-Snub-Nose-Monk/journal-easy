'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import TextMenu from './menus/text-menu'
import ColumnsMenu from './menus/columns-menu'
import LinkMenu from './menus/link-menu'
import ImageBlockMenu from './menus/image-block-menu'
import { extensions } from './extensions'
import ContentMenu from './menus/content-menu'
import { TableRowMenu, TableColMenu } from './menus/table-menu'
import AIIsland from './ai-island'
import emitter from '@/lib/emitter'
import { EVENT_KEY_CHANGE_CHAR_COUNT, RIGHT_PANEL_DOM_ID } from '@/constants'

interface IProps {
  id: string
}

const TiptapEditor = (props: IProps) => {
  const { id } = props
  const menuContainerRef = useRef(null)

  const editor = useEditor({
    extensions,
    onUpdate: ({ editor }) => {
      const data = editor.getJSON()
      updateCharacterCount()
    },
    editorProps: {
      attributes: {
        class: 'min-h-96 prose dark:prose-invert focus:outline-none max-w-none',
      },
    },
  })

  const updateCharacterCount = useCallback(() => {
    const characterCount = editor?.storage.characterCount || {
      characters: () => 0,
      words: () => 0,
    }
    emitter.emit(EVENT_KEY_CHANGE_CHAR_COUNT, {
      count: characterCount.characters(),
      id,
    })
    // characterCount.words() 可統計英文單詞數量，但不适用于中文
  }, [id, editor])

  useEffect(updateCharacterCount, [updateCharacterCount])

  const [rightPanelDiv, setRightPanelDiv] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setRightPanelDiv(document.getElementById(RIGHT_PANEL_DOM_ID))
  }, [])

  return (
    <>
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
      {rightPanelDiv &&
        createPortal(<AIIsland editor={editor} />, rightPanelDiv)}
    </>
  )
}
export default TiptapEditor
