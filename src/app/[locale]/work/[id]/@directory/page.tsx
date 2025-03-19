import { getDocList, getShareRelations, getMyShareRelations } from './action'
import List from './list'
import OtherList from './other-list'

export default async function Directory({
  params,
}: {
  params: { id: string }
}) {
  const list = await getDocList()
  const shareRelations = await getShareRelations()
  const myShareRelations = await getMyShareRelations()

  return (
    <>
      <OtherList
        defaultShareRelations={shareRelations}
        defaultMyShareRelations={myShareRelations}
      />
      <List defaultList={list} defaultParamId={params.id} />
    </>
  )
}
