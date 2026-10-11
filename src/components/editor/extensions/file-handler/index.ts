import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { uploadImageFn } from '@/components/editor/utils/api'

const imageTypes = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp'])

// Public ProseMirror APIs replace the private registry extension.
export const FileHandler = Extension.create({
  name: 'localFileHandler',
  addProseMirrorPlugins() {
    const editor = this.editor
    const insert = async (files: File[], pos: number) => {
      for (const file of files) {
        try {
          const src = await uploadImageFn(file)
          if (editor.isDestroyed || !editor.isEditable) return
          const safePos = Math.min(pos, editor.state.doc.content.size)
          editor.chain().setImageBlockAt({ pos: safePos, src }).focus().run()
        } catch {
          window.alert('圖片上傳失敗 / Image upload failed')
        }
      }
    }
    return [
      new Plugin({
        props: {
          handleDrop(view, event, _slice, moved) {
            if (moved || !editor.isEditable) return false
            const files = Array.from(event.dataTransfer?.files || []).filter((f) => imageTypes.has(f.type))
            if (!files.length) return false
            event.preventDefault()
            const pos = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos ?? view.state.selection.from
            void insert(files, pos)
            return true
          },
          handlePaste(view, event) {
            if (!editor.isEditable || event.clipboardData?.getData('text/html')) return false
            const files = Array.from(event.clipboardData?.files || []).filter((f) => imageTypes.has(f.type))
            if (!files.length) return false
            event.preventDefault()
            void insert(files, view.state.selection.from)
            return true
          },
        },
      }),
    ]
  },
})
