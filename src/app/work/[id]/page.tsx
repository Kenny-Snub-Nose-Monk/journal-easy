import AIIsland from '@/components/ai-island'
import Content from './(content)/content'
import { CONTENT_WIDTH } from '@/constants'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id
  const fullWidth = CONTENT_WIDTH + 80 // 兩邊留白 40px

  const doc = await getDoc(id)
  const notFound = !doc
  const { title = '', content = '', isStar = false } = doc || {}

  return (
    <>
      <div
        className={`mx-auto my-10 mb-24`}
        style={{ width: `${fullWidth}px` }}
      >
        <Content
          defaultId={id}
          defaultTitle={title}
          defaultContent={content?.toString() || ''}
          defaultNotFound={notFound}
          defaultIsStar={isStar}
        />
      </div>
      <AIIsland />
    </>
  )
}
