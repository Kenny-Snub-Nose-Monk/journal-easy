import { compressImage } from './img'

export async function uploadImageFn(file: File) {
  try {
    console.log('Starting upload for file:', file.name)
    console.log('Environment URL:', process.env.NEXT_PUBLIC_IMAGE_PROCESSOR_URL)

    // 獲取用戶信息
    const userRes = await fetch('/api/user/info')
    const userData = await userRes.json()
    const userId = userData.data?.id || 'anonymous'

    const compressedFile = await compressImage(file)

    const formData = new FormData()
    formData.append('image', compressedFile, compressedFile.name)
    formData.append('userId', userId)
    formData.append('fileName', compressedFile.name)

    console.log('Uploading file:', {
      name: compressedFile.name,
      type: compressedFile.type,
      size: compressedFile.size,
    })

    const processorUrl = `${process.env.NEXT_PUBLIC_IMAGE_PROCESSOR_URL}/compress`
    console.log('Final URL before fetch:', processorUrl)

    // Add request headers for better debugging
    const processorRes = await fetch(processorUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    })

    if (!processorRes.ok) {
      const errorText = await processorRes.text()
      console.error('Upload failed:', {
        status: processorRes.status,
        statusText: processorRes.statusText,
        error: errorText,
        url: processorUrl,
      })
      throw new Error(
        `Upload failed: ${processorRes.status} ${processorRes.statusText}`
      )
    }

    const processorData = await processorRes.json()
    console.log('Upload response:', processorData)

    if (!processorData.success) {
      throw new Error('image processing failed')
    }

    return processorData.url
  } catch (error) {
    console.error('Upload error details:', {
      error,
      env: process.env.NEXT_PUBLIC_IMAGE_PROCESSOR_URL,
      file: file.name,
    })
    throw error
  }
}

// export async function uploadImageFn(file: File) {
//   // 壓縮圖片
//   const blob = await imageCompression(file, imageCompressionOptions)
//   const compressedFile = new File([blob], file.name)

//   const formData = new FormData()
//   formData.append('file', compressedFile)

//     // 先上傳到圖片處理服務
//     const processorRes = await fetch(process.env.NEXT_PUBLIC_IMAGE_PROCESSOR_URL as string, {
//       method: 'POST',
//       body: formData,
//     })

//   // console.log('file', file)
//   // console.log('Uploading file:', {
//   //   name: file.name,
//   //   type: file.type,
//   //   size: file.size,
//   // })

//   const res = await fetch('/api/upload', {
//     method: 'POST',
//     body: formData,
//   })
//   const dataRes = await res.json()

//   if (dataRes.errno !== 0) {
//     throw new Error('upload error')
//   }
//   const { url } = dataRes.data // GCS url

//   return url
// }
