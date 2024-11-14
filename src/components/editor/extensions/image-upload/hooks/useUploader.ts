import { useState, useCallback } from 'react'
import { uploadImageFn } from '@/components/editor/utils/api'
import { useToast } from '@/hooks/use-toast'
import { getImageSize } from '@/components/editor/utils/img'

const useUploader = ({
  onUpload,
}: {
  onUpload: (url: string, ratio: number) => void
}) => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const uploadFile = useCallback(
    async (file: File) => {
      setLoading(true)
      const { width = NaN, height = NaN } = await getImageSize(file) // 獲取圖片尺寸
      const ratio = parseFloat((width / height).toFixed(2)) // 計算寬高比例

      try {
        const url = await uploadImageFn(file) // 上傳圖片
        onUpload(url, ratio) // 上傳成功後，調用 onUpload 方法
      } catch (errPayload: any) {
        console.error(errPayload)
        const error = errPayload?.response?.data?.error || '上傳失敗'
        toast({
          variant: 'destructive',
          description: error,
        })
      }
      setLoading(false)
    },
    [onUpload, toast]
  )

  return { loading, uploadFile }
}

export default useUploader
