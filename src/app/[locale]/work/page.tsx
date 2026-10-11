import { db } from '@/db/db'
import { redirect } from '@/i18n/routing'
import { getLocale } from 'next-intl/server'
import { getUserInfo } from '@/lib/session'
import { getNextSortOrderForParent } from '@/lib/doc-sort-order.server'
import {
  DEFAULT_NEW_DOC_TITLE,
  DEFAULT_NEW_DOC_CONTENT,
  DEFAULT_NEW_DOC_TITLE_EN,
  DEFAULT_NEW_DOC_CONTENT_EN,
} from '@/constants'

export default async function Work() {
  const user = await getUserInfo()
  if (user == null || !user.id) {
    redirect('/')
    return
  }

  const firstDoc = await db.doc.findFirst({
    where: { userId: user.id, isDeleted: false },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  if (firstDoc != null) {
    // 找到第一篇文档，然后跳转过去
    redirect(`/work/${firstDoc?.id}`)
    return
  }

  const count = await db.doc.count({
    where: { userId: user.id }, // 不限制 delete
  })
  if (count > 0) {
    // 有文档，但是都是删除状态
    redirect(`/work/0`)
    return
  }

  // 找不到任何文档，则新建文档
  const locale = await getLocale()
  const sortOrder = await getNextSortOrderForParent(user.id, null)
  const newDoc = await db.doc.create({
    data: {
      userId: user.id,
      icon: '🐈',
      title: locale === 'zh-tw' ? DEFAULT_NEW_DOC_TITLE : DEFAULT_NEW_DOC_TITLE_EN, // useCreateEditor 中會用到這個變量，做判斷
      content: locale === 'zh-tw' ? DEFAULT_NEW_DOC_CONTENT : DEFAULT_NEW_DOC_CONTENT_EN,
      isStar: true,
      sortOrder,
    },
  })
  // 跳转
  redirect(`/work/${newDoc.id}`)

  // 不渲染页面
  return null
}
