import debounce from 'lodash.debounce'
import { get, patch } from '@/lib/ajax'

export async function getDoc(id: string) {
  const url = `/api/doc/${id}`
  const res = await fetch(url)
  const { errno, msg, data } = await get(url)
  if (errno === 0) return data
  else return msg
}
async function updateDoc(
  id: string,
  data: { title?: string; content?: string; parentId?: string | null }
) {
  const url = `/api/doc/${id}`
  const res = await patch(url, data)

  return res
}
export const updateTitle = debounce(async (id: string, title: string) => {
  return await updateDoc(id, { title })
}, 1000)
export const updateContent = debounce(async (id: string, content: string) => {
  return await updateDoc(id, { content })
}, 1000)

export const updateParentId = async (id: string, parentId: string | null) => {
  return await updateDoc(id, { parentId })
}
