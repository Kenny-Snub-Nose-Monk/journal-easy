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
        const { uid, title } = doc
        let isCurrent = false

        if (uid === params.id) isCurrent = true

        return <Item key={uid} uid={uid} title={title} isCurrent={isCurrent} />
      })}

      <form action={create}>
        <CreateSubmitButton />
      </form>
    </div>
  )
}
