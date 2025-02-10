import Content from './(content)/content'
import { CONTENT_WIDTH } from '@/constants'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  const doc = await getDoc(id)
  const notFound = !doc
  const { title = '', content = '', isStar = false } = doc || {}

  return (
    <Content
      defaultId={id}
      defaultTitle={title}
      defaultContent={content?.toString() || ''}
      defaultNotFound={notFound}
      defaultIsStar={isStar}
    />
  )
}
