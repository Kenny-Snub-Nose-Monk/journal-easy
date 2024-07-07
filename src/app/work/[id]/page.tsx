import { ScrollArea } from '@/components/ui/scroll-area'
// import AIIsland from '@/components/AIIsland'
import { getDoc } from './action'
import Title from './title'
import Content from './content'

export default async function OneWork({ params }: { params: { id: string } }) {
  const uid = params.id

  const doc = await getDoc(uid)

  if (doc == null)
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>找不到檔案...</p>
      </div>
    )

  return (
    <>
      <ScrollArea className="h-[calc(100vh-46px)]">
        <div className="max-w-[900px] mx-auto my-10">
          <Title uid={uid} title={doc.title} />
          <Content uid={uid} content={doc.content} />
        </div>
      </ScrollArea>
      {/* <AIIsland /> */}
    </>
  )
}
