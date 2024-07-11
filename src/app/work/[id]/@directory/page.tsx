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
    <div>
      {list.map((doc) => {
        const { id, title } = doc
        let isCurrent = false

        if (id === params.id) isCurrent = true

        return <Item key={id} id={id} title={title} isCurrent={isCurrent} />
      })}

      <form action={create}>
        <CreateSubmitButton />
      </form>
    </div>
  )
}
