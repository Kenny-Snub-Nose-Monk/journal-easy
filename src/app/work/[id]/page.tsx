import Content from './(content)/content'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  const doc = await getDoc(id)
  const notFound = !doc
  const { title = '', isStar = false } = doc || {}

  return (
    <Content
      defaultId={id}
      defaultTitle={title}
      defaultNotFound={notFound}
      defaultIsStar={isStar}
    />
  )
}
