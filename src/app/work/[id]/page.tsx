// import AIIsland from '@/components/AIIsland'
import Content from './(content)/content'

export default async function OneWork({ params }: { params: { id: string } }) {
  const id = params.id

  return (
    <>
      <div className="max-w-[880px] mx-auto my-10">
        <Content id={id} />
      </div>
      {/* <AIIsland /> */}
    </>
  )
}
