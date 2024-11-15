// import AIIsland from '@/components/all-island'
import Content from './(content)/content'
import { CONTENT_WIDTH } from '@/constants'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id
  const fullWidth = CONTENT_WIDTH + 80 // 兩邊留白 40px

  const doc = await getDoc(id)
  const notFound = !doc
  const { title = '', content = '' } = doc || {}

  return (
    <>
      <div className={`max-w-[${fullWidth}px] mx-auto my-10`}>
        <Content
          defaultId={id}
          defaultTitle={title}
          defaultContent={content?.toString() || ''}
          defaultNotFound={notFound}
        />
      </div>
      {/* <AIIsland /> */}
    </>
  )
}
