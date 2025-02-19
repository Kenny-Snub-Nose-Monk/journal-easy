import Content from './(content)/content'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  const data = await getDoc(id)
  const notFound = !data
  const {
    title = '',
    isStar = false,
    sharePassword,
    userId = '',
  } = data?.doc || {}
  const defaultDoc = {
    defaultId: id,
    defaultTitle: title,
    defaultIsStar: isStar,
    defaultSharePassword: sharePassword || '',
    defaultDocUserId: userId,
  }

  const userInfo = {
    id: data?.user?.id || '',
    name: data?.user?.name || '',
    email: data?.user?.email || '',
    avatar: data?.user?.image || '',
  }

  return (
    <Content
      defaultNotFound={notFound}
      defaultDoc={defaultDoc}
      userInfo={userInfo}
    />
  )
}
