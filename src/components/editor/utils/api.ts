import imageCompression from 'browser-image-compression'

// 壓縮圖片的配置，參考文檔 https://www.npmjs.com/package/browser-image-compression
const imageCompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
}

export async function uploadImageFn(file: File) {
  // 壓縮圖片
  const blob = await imageCompression(file, imageCompressionOptions)
  const compressedFile = new File([blob], file.name)

  const formData = new FormData()
  formData.append('file', compressedFile)

  // console.log('file', file)
  // console.log('Uploading file:', {
  //   name: file.name,
  //   type: file.type,
  //   size: file.size,
  // })

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  const dataRes = await res.json()

  if (dataRes.errno !== 0) {
    throw new Error('upload error')
  }
  const { url } = dataRes.data // GCS url

  return url
}
