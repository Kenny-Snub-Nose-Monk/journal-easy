import { Editor } from '@tiptap/react'
import { useCallback, useRef, useState } from 'react'
import { MessagesType } from './hooks/useGenMessages'
import { send } from './api'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { post } from '@/lib/ajax'
import { AI_REQUEST_DELAY } from '@/constants'
import { useEditorStore } from '@/stores/editor-store'
import { useTranslations } from 'next-intl'

interface UseRequestAIProps {
  editor: Editor | null
  isSelectionEmpty: boolean
  setInstruction: React.Dispatch<React.SetStateAction<string>>
  setAIResult: React.Dispatch<React.SetStateAction<string>>
  inputRef: React.RefObject<HTMLInputElement>
  delay: number
  setDelay: React.Dispatch<React.SetStateAction<number>>
}

export const useRequestAI = ({
  editor,
  isSelectionEmpty,
  setInstruction,
  setAIResult,
  inputRef,
  delay,
  setDelay,
}: UseRequestAIProps) => {
  const [loading, setLoading] = useState(false)
  const [prevMessages, setPrevMessages] = useState<MessagesType>([])
  const abortControllerRef = useRef<AbortController | null>(null)
  const AITokenLimit = useEditorStore((s) => s.AITokenLimit)
  const setAITokenLimit = useEditorStore((s) => s.setAITokenLimit)

  const t = useTranslations('AIInput')

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
        if (AITokenLimit != null) {
          if (AITokenLimit <= total_tokens) setAITokenLimit(0)
          else setAITokenLimit(AITokenLimit - total_tokens)
        }
        // 更新服务端数据

        console.log('total_tokens', total_tokens)
        post('/api/gpt/token-usage', { total_tokens })
      }

      if (content) {
        setAIResult((r) => r + content)
      }
    },
    [AITokenLimit, setAIResult, setAITokenLimit]
  )

  function onSuccess() {
    setLoading(false)
    editor?.setEditable(true)
    setDelay(AI_REQUEST_DELAY)
  }

  function onError(msg: string) {
    setLoading(false)
    toast({
      variant: 'destructive',
      title: t('somethingWrong'),
      description: msg,
      action: <ToastAction altText="OK">OK</ToastAction>,
    })

    editor?.setEditable(true)
  }

  const requestAI = useCallback(
    async (messages: MessagesType) => {
      if (loading) return

      if (delay > 0) {
        toast({
          title: 'Alert',
          description: t('waitSeconds', { seconds: delay }),
          action: <ToastAction altText="OK">OK</ToastAction>,
        })
        return
      }

      if (AITokenLimit != null && AITokenLimit <= 0) {
        onError(t('exceedLimit'))
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
      setPrevMessages(messages)
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
      delay,
      AITokenLimit,
      editor,
      insertContent,
      onError,
      onSuccess,
      setAIResult,
      inputRef,
      setPrevMessages,
    ]
  )

  const abortRequestAI = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      editor?.setEditable(true)
      setLoading(false)
    }
  }, [editor])

  function reRequestAI() {
    // console.log('reRequestAI...', prevMessages)
    requestAI(prevMessages)
  }

  return {
    loading,
    requestAI,
    abortRequestAI,
    reRequestAI,
  }
}
