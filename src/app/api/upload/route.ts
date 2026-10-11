import { v4 as uuid } from 'uuid'
import { getUserInfo } from '@/lib/session'
import { genSuccessData, genUnAuthData, genErrorData } from '../utils/gen-res-data'
import { uploadFile } from '@/lib/storage'

export async function POST(req: Request) {
  const user = await getUserInfo()
  if (user == null) return Response.json(genUnAuthData())

  const formData = await req.formData()
  const file = formData.get('file') as File // `file` 是 FormData key
  if (!file || typeof file.arrayBuffer !== 'function')
    return Response.json(genErrorData('File required'), { status: 400 })
  const types: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
  }
  const ext = types[file.type]
  if (!ext || file.size > 5 * 1024 * 1024)
    return Response.json(genErrorData('Only PNG/JPEG/GIF/WebP up to 5 MB'), { status: 400 })

  // 物件名稱： `/` 可自动创建文件夹，`uuid()` 用于避免文件名重复
  const objectName = `files/u-${user.id}/imgs/${uuid()}.${ext}`

  try {
    const result = await uploadFile(objectName, Buffer.from(await file.arrayBuffer()), file.type)

    return Response.json(genSuccessData(result))
  } catch (e) {
    console.error('upload error', e)
    return Response.json(genErrorData('upload error'))
  }
}
