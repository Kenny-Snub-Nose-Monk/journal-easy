// import AIIsland from '@/components/all-island'
import Content from './(content)/content'
import { CONTENT_WIDTH } from '@/constants'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id
  const fullWidth = CONTENT_WIDTH + 80 // 兩邊留白 40px

  return (
    <>
      <div className={`max-w-[${fullWidth}px] mx-auto my-10`}>
        <Content id={id} />
      </div>
      {/* <AIIsland /> */}
    </>
  )
}
