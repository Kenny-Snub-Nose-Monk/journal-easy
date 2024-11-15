// import AIIsland from '@/components/all-island'
import Content from './(content)/content'
import { CONTENT_WIDTH } from '@/constants'
import { getDoc } from './action'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id
  const fullWidth = CONTENT_WIDTH + 80 // 兩邊留白 40px

  const doc = await getDoc(id)
  if (!doc)
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到文檔...</p>
      </div>
    )

  return (
    <>
      <div className={`max-w-[${fullWidth}px] mx-auto my-10`}>
        <Content
          id={id}
          defaultTitle={doc.title?.toString() || ''}
          defaultContent={doc.content?.toString() || ''}
        />
      </div>
      {/* <AIIsland /> */}
    </>
  )
}
