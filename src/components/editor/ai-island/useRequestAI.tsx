import { Editor } from '@tiptap/react'
import { useCallback, useRef, useState } from 'react'
import { MessagesType } from './messages'
import { send } from './api'
import { toast } from '@/hooks/use-toast'

interface UseRequestAIProps {
  editor: Editor | null
  isSelectionEmpty: boolean
  editorScrollIntoView: () => void
  setInstruction: (value: string) => void
  setAIResult: (value: string | ((prev: string) => string)) => void
  inputRef: React.RefObject<HTMLInputElement>
}

export const useRequestAI = ({
  editor,
  isSelectionEmpty,
  editorScrollIntoView,
  setInstruction,
  setAIResult,
  inputRef,
}: UseRequestAIProps) => {
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const requestAI = useCallback(
    async (messages: MessagesType) => {
      if (loading) return

      // Clear any existing abort controller
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController()

      setLoading(true)
      setAIResult('')
      inputRef.current?.blur()

      try {
        await send(
          messages,
          // Handle streaming content
          (content: string) => {
            if (!content) return
            if (isSelectionEmpty) {
              if (content.indexOf('\n') < 0) {
                editor?.commands.insertContent(content)
                editorScrollIntoView()
                return
              }

              const arr = content.split('\n')
              arr.forEach((c, index) => {
                if (c) {
                  editor?.commands.insertContent(c)
                  editorScrollIntoView()
                }
                if (index < arr.length - 1) {
                  editor?.commands.enter()
                }
              })
            } else {
              setAIResult((r) => r + content)
            }
          },
          // Handle completion
          (done: boolean) => {
            setLoading(false)
            if (isSelectionEmpty) {
              setInstruction('')
              if (done) editor?.commands.enter()
              editor?.commands.focus()
            }
          },
          (msg: string) => {
            setLoading(false)
            toast({
              variant: 'destructive',
              title: 'Error happened, Please wait a second.',
              description: msg,
            })
          },
          abortControllerRef.current.signal // Pass the signal to send
        )
      } catch (error) {
        setLoading(false)
      }
    },
    [
      loading,
      editor,
      isSelectionEmpty,
      editorScrollIntoView,
      setInstruction,
      setAIResult,
      inputRef,
    ]
  )

  const abortRequestAI = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setLoading(false)
    }
  }, [])

  return {
    loading,
    requestAI,
    abortRequestAI,
  }
}
