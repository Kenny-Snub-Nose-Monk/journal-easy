import { Editor } from '@tiptap/react'
import { useCallback, useRef, useState } from 'react'
import { MessagesType } from './messages'
import { send } from './api'
import { toast } from '@/hooks/use-toast'
import { post } from '@/lib/ajax'

interface UseRequestAIProps {
  editor: Editor | null
  isSelectionEmpty: boolean
  editorScrollIntoView: () => void
  setInstruction: React.Dispatch<React.SetStateAction<string>>
  setAIResult: React.Dispatch<React.SetStateAction<string>>
  inputRef: React.RefObject<HTMLInputElement>
  tokenLimit: number
  setTokenLimit: React.Dispatch<React.SetStateAction<number>>
}

export const useRequestAI = ({
  editor,
  isSelectionEmpty,
  editorScrollIntoView,
  setInstruction,
  setAIResult,
  inputRef,
  tokenLimit,
  setTokenLimit,
}: UseRequestAIProps) => {
  const [loading, setLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const insertContent = useCallback(
    (content: string, usage: any) => {
      if (usage) {
        const {
          prompt_tokens = 0,
          completion_tokens = 0,
          total_tokens = 0,
        } = usage
        // console.log('usage', prompt_tokens, completion_tokens, total_tokens)
        // 更新客户端
        setTokenLimit((n: number) => {
          if (n <= total_tokens) return 0
          return n - total_tokens
        })
        // 更新服务端数据

        console.log('total_tokens', total_tokens)
        post('/api/gpt/token-usage', { total_tokens })
      }

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
    [editor, isSelectionEmpty, editorScrollIntoView, setAIResult, setTokenLimit]
  )

  function onSuccess(done: boolean) {
    setLoading(false)
    if (isSelectionEmpty) {
      setInstruction('')
      if (done) editor?.commands.enter()
      editor?.commands.focus()
    }

    editor?.setEditable(true)
  }

  function onError(msg: string) {
    setLoading(false)
    toast({
      variant: 'destructive',
      title: 'Error happened, Please wait a second.',
      description: msg,
    })

    editor?.setEditable(true)
  }

  const requestAI = useCallback(
    async (messages: MessagesType) => {
      if (loading) return

      if (tokenLimit <= 0) {
        onError('AI tokens 使用量已超出限制，請先領取或購買')
        return
      }

      // Clear any existing abort controller
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController()

      setLoading(true)
      editor?.setEditable(false)
      setAIResult('')
      inputRef.current?.blur()

      try {
        await send(
          messages,
          insertContent,
          onSuccess,
          onError,
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
      tokenLimit,
      setTokenLimit,
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
