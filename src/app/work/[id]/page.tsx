import Content from './(content)/content'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  const data = await getDoc(id)
  const notFound = !data
  const { title = '', isStar = false } = data?.doc || {}

  const userInfo = {
    name: data?.user?.name || '',
    email: data?.user?.email || '',
    avatar: data?.user?.image || '',
  }

  return (
    <Content
      defaultId={id}
      defaultTitle={title}
      defaultNotFound={notFound}
      defaultIsStar={isStar}
      userInfo={userInfo}
    />
  )
}
