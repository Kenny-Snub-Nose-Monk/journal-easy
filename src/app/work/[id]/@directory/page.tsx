import { getDocList } from './action'
import List from './list'

export default async function Directory({
  params,
}: {
  params: { id: string }
}) {
  const list = await getDocList()

  return <List list={list} defaultParamId={params.id} />
}
