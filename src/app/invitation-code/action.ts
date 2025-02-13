'use server'
import { redirect } from 'next/navigation'
import { getUserInfo } from '@/lib/session'
import { db } from '@/db/db'

export async function checkInvitationCode(formData: FormData) {
  const user = await getUserInfo()
  if (user == null) return
  // @ts-ignore
  if (user.isInvited) return
  const { email } = user
  const code = formData.get('invitationCode') as string
  // console.log('code', formData.get('invitationCode'))
  // 根據 email 和 code 查找
  const res = await db.invitationCode.findFirst({
    where: {
      email: email || '',
      code,
    },
  })
  // 未找到邀請碼
  if (res == null) {
    redirect('/invitation-code/fail')
  }
  // 更新用戶信息
  await db.user.update({
    where: { email: email || '' },
    data: { isInvited: true },
  })
  redirect('/work')
}
