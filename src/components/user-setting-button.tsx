import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUserInfo } from '@/lib/session'

export default function UserSettingButton() {
  return (
    <Button className="w-full justify-start px-2 " variant="ghost">
      <UserAvatar />
      &nbsp;&nbsp;帳戶/設置
    </Button>
  )
}

async function UserAvatar() {
  const user = await getUserInfo()
  let { name, image, email } = user || {}
  if (!name) name = email

  return (
    <Avatar className="h-7 w-7 border">
      <AvatarImage src={image || ''} alt={name || ''} />
      <AvatarFallback>{name?.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
}
