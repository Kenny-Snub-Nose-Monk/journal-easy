import { getDocList, getShareRelations } from './action'
import List from './list'
import OtherList from './other-list'

export default async function Directory({
  params,
}: {
  params: { id: string }
}) {
  const list = await getDocList()
  const shareRelations = await getShareRelations()

  return (
    <>
      <OtherList defaultShareRelations={shareRelations} />
      <List defaultList={list} defaultParamId={params.id} />
    </>
  )
}
