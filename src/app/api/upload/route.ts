import { v4 as uuid } from 'uuid'
import { getUserInfo } from '@/lib/session'
import {
  genSuccessData,
  genUnAuthData,
  genErrorData,
} from '../utils/gen-res-data'
import { bucket } from '@/lib/gcs'

// 這是一個處理文件上傳的 API 端點
export async function POST(req: Request) {
  console.log('1. Upload endpoint hit')

  try {
    // 步驟 1: 檢查用戶認證
    console.log('2. Checking user authentication...')
    const user = await getUserInfo()
    console.log('3. User info:', user)

    if (user == null) {
      console.log('4A. Authentication failed')
      return Response.json(genUnAuthData())
    }
    console.log('4B. Authentication successful')

    // 步驟 2: 處理表單數據
    console.log('5. Processing form data...')
    const formData = await req.formData()
    const file = formData.get('file') as File
    console.log('6. File details:', {
      name: file?.name,
      type: file?.type,
      size: file?.size,
      exists: !!file,
    })

    // 步驟 3: 準備文件名
    console.log('7. Preparing file name...')
    const fileName = `files/${user.id}/imgs/${uuid()}.${file.name}`
    console.log('8. Generated file name:', fileName)

    try {
      // 步驟 4: 準備文件數據
      console.log('9. Converting file to buffer...')
      const fileBuffer = Buffer.from(await file.arrayBuffer())

      // 步驟 5: 創建 GCS 文件對象
      console.log('10. Creating GCS file object...')
      const blob = bucket.file(fileName)

      // 步驟 6: 上傳到 GCS
      console.log('11. Uploading to GCS...')
      // 簡單的上傳，不設置 ACL
      await blob.save(fileBuffer)

      console.log('12. File uploaded successfully to GCS')

      // 步驟 7: 生成公開 URL
      console.log('13. Generating public URL...')
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
      console.log('14. Public URL generated:', publicUrl)

      // 返回成功響應
      console.log('15. Sending success response')
      return Response.json(genSuccessData({ url: publicUrl }))
    } catch (uploadError) {
      // GCS 相關錯誤的詳細日誌
      console.error('GCS operation failed:', {
        step: 'GCS upload',
        error: uploadError,
        // errorMessage: uploadError.message,
        // errorCode: uploadError.code,
        // errorStack: uploadError.stack,
      })
      throw uploadError // 重新拋出錯誤以便被外層 catch 捕獲
    }
  } catch (e) {
    // 最外層錯誤處理
    console.error('Final error catch:', {
      error: e,
      // message: e.message,
      // stack: e.stack,
      type: typeof e,
    })
    return Response.json(genErrorData('upload error'))
  }
}
