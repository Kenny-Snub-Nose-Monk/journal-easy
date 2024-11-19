import debounce from 'lodash.debounce'
import { get, patch } from '@/lib/ajax'
import emitter from '@/lib/emitter'
import { EVENT_KEY_CHANGE_UPDATING } from '@/constants'

export async function getDoc(id: string) {
  const url = `/api/doc/${id}`
  const res = await fetch(url)
  const { errno, msg, data } = await get(url)
  if (errno === 0) return data
  else return msg
}
async function updateDoc(
  id: string,
  data: {
    title?: string
    content?: string
    parentId?: string | null
    isStar?: boolean | null
  }
) {
  const url = `/api/doc/${id}`
  const res = await patch(url, data)

  emitter.emit(EVENT_KEY_CHANGE_UPDATING, { updating: false }) // 標記“已更新”

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

export const updateIsStar = async (id: string, isStar: boolean | null) => {
  return await updateDoc(id, { isStar })
}
