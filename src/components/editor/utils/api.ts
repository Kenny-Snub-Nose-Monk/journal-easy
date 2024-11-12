export async function uploadImageFn(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  console.log('file', file)
  // 更詳細的日誌
  console.log('Uploading file:', {
    name: file.name,
    type: file.type,
    size: file.size,
  })

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
