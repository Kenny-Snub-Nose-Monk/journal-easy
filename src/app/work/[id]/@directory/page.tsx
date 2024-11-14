import { create, getDocList } from './action'
import CreateSubmitButton from './CreateSubmitButton'
import Item from './item'

export default async function Directory({
  params,
}: {
  params: { id: string }
}) {
  const list = await getDocList()

  return (
    // <div className="h-[1000px]">
    <>
      {list
        .filter((i) => i.parentId == null) // 顶级目录
        .map((doc) => {
          const { id, title } = doc
          return (
            <Item
              key={id}
              id={id}
              title={title}
              paramId={params.id}
              list={list}
            />
          )
        })}

      <form action={create}>
        <CreateSubmitButton />
      </form>
    </>
  )
}
