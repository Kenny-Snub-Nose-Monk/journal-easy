import { compressImage } from './img'

export async function uploadImageFn(file: File) {
  const compressedFile = await compressImage(file) // 壓縮圖片

  const formData = new FormData()
  formData.append('file', compressedFile)

  // 文件上传，和传统 ajax 请求不一样，直接手写 fetch
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  const dataRes = await res.json()
  if (dataRes.errno !== 0) {
    throw new Error('upload error')
  }

  const { url } = dataRes.data // GCS url

  // 替换 CDN 域名（未设定则直接用 GCS 原始网址）
  const cdnHostname = process.env.NEXT_PUBLIC_MEDIA_HOSTNAME
  if (!cdnHostname || url.startsWith('/')) return url

  const urlObj = new URL(url)
  urlObj.protocol = 'https'
  urlObj.hostname = cdnHostname
  return urlObj.href
}
