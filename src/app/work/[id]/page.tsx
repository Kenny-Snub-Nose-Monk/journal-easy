import Content from './(content)/content'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  const data = await getDoc(id)
  const notFound = !data
  const { title = '', isStar = false } = data?.doc || {}

  return (
    <Content
      defaultId={id}
      defaultTitle={title}
      defaultNotFound={notFound}
      defaultIsStar={isStar}
    />
  )
}
