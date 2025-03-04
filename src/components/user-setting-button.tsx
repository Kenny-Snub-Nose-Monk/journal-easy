'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserProfileForm } from './user-profile-form'
import { useUserStore } from '@/stores/user-store'
import { User } from 'next-auth'
import { useTranslations } from 'next-intl'

interface IUser {
  name?: string | null
  image?: string | null
  email?: string | null
}

export default function UserSettingButton() {
  const userInfo = useUserStore((s) => s.userInfo)
  const { name, image, email } = userInfo || {}

  const t = useTranslations('userAndSetting')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start px-2 " variant="ghost">
          <UserAvatar user={userInfo} />
          &nbsp;&nbsp;{t('title')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('changeUerInfo')}</DialogTitle>
          <UserProfileForm
            name={name || ''}
            avatar={image || ''}
            email={email || ''}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

function UserAvatar({ user }: { user: User | null }) {
  let { name, image, email } = user || {}
  if (!name) name = email

  return (
    <Avatar className="h-7 w-7 border">
      <AvatarImage src={image || ''} alt={name || ''} />
      <AvatarFallback>{name?.slice(0, 1)}</AvatarFallback>
    </Avatar>
  )
}
