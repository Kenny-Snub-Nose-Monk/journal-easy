import { Editor } from '@tiptap/react'
import { useCallback, useRef, useState } from 'react'
import { MessagesType } from './messages'
import { send } from './api'
import { toast } from '@/hooks/use-toast'
import { post } from '@/lib/ajax'

interface UseRequestAIProps {
  editor: Editor | null
  isSelectionEmpty: boolean
  setInstruction: React.Dispatch<React.SetStateAction<string>>
  setAIResult: React.Dispatch<React.SetStateAction<string>>
  inputRef: React.RefObject<HTMLInputElement>
  tokenLimit: number
  setTokenLimit: React.Dispatch<React.SetStateAction<number>>
}

export const useRequestAI = ({
  editor,
  isSelectionEmpty,
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

      if (content) {
        setAIResult((r) => r + content)
      }
    },
    [editor, isSelectionEmpty, setAIResult, setTokenLimit]
  )

  function onSuccess() {
    setLoading(false)
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
      editor?.setEditable(true)
      setLoading(false)
    }
  }, [])

  return {
    loading,
    requestAI,
    abortRequestAI,
  }
}
