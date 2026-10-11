import 'server-only'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'

export function localUploadPath(objectName: string) {
  const root = resolve(process.env.UPLOAD_DIR || './data/uploads')
  const target = resolve(root, objectName)
  if (!target.startsWith(root + sep)) throw new Error('Invalid upload path')
  return target
}

export async function uploadFile(objectName: string, data: Buffer, contentType?: string) {
  if (process.env.STORAGE_DRIVER === 'gcs') {
    const { Storage } = await import('@google-cloud/storage')
    const name = process.env.GCS_BUCKET
    if (!name) throw new Error('GCS_BUCKET required')
    const bucket = new Storage().bucket(name)
    await bucket.file(objectName).save(data, { contentType })
    return { name: objectName, url: `https://${name}.storage.googleapis.com/${objectName}` }
  }
  const path = localUploadPath(objectName)
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, data, { flag: 'wx' })
  return { name: objectName, url: `/api/media/${objectName}` }
}
