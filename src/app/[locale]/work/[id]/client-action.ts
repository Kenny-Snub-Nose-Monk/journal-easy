import debounce from 'lodash.debounce'
import { get, patch } from '@/lib/ajax'
import { collaborationEnabled } from '@/lib/editor-mode'
import { scheduleDocMetadata } from '@/lib/doc-version/snapshot-provider'

export async function getDoc(id: string) {
  const url = `/api/doc/${id}`
  const { errno, msg, data } = await get(url)
  if (errno !== 0) return null
  return data
}

async function updateDoc(
  id: string,
  data: { title?: string; icon?: string | null; content?: string; isStar?: boolean }
) {
  const url = `/api/doc/${id}`
  const res = await patch(url, data)
  return res
}

const titleUpdates = new Map<string, ReturnType<typeof debounce>>()
export function updateTitle(id: string, title: string) {
  if (!collaborationEnabled && scheduleDocMetadata(id)) return
  let update = titleUpdates.get(id)
  if (!update) {
    update = debounce(
      async (value: string) => updateDoc(id, { title: value }).catch(() => ({ errno: -1, msg: 'Title save failed' })),
      700
    )
    titleUpdates.set(id, update)
  }
  return update(title)
}
export async function flushDocTitle(id: string) {
  const update = titleUpdates.get(id)
  const result = await update?.flush()
  if (result && result.errno !== 0) throw new Error(result.msg || 'Title save failed')
}

export const updateIcon = async (id: string, icon: string) => {
  return await updateDoc(id, { icon })
}

export const updateIsStar = async (id: string, isStar: boolean) => {
  return await updateDoc(id, { isStar })
}
