import { db } from '@/db/db'
import { redirect } from '@/i18n/routing'
import { getLocale } from 'next-intl/server'
import { getUserInfo } from '@/lib/session'
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
    // 找到第一篇文檔，然後跳轉過去
    redirect(`/work/${firstDoc?.id}`)
    return
  }

  const count = await db.doc.count({
    where: { userId: user.id }, // 不限制 delete
  })
  if (count > 0) {
    // 有文檔，但是都是刪除狀態
    redirect(`/work/0`)
    return
  }

  // 找不到任何文檔，則新建文檔
  const locale = await getLocale()
  const newDoc = await db.doc.create({
    data: {
      userId: user.id,
      title: locale === 'zh-cn' ? DEFAULT_NEW_DOC_TITLE : DEFAULT_NEW_DOC_TITLE_EN, // useCreateEditor 中會用到這個變量，做判斷
      content: locale === 'zh-cn' ? DEFAULT_NEW_DOC_CONTENT : DEFAULT_NEW_DOC_CONTENT_EN,
    },
  })
  // 跳轉
  redirect(`/work/${newDoc.id}`)

  // 不渲染頁面
  return null
}

  // 不渲染页面
  return null
}
