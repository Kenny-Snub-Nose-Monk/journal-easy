import Logo from './Logo'
import ChangeTheme from './change-theme'
import { Button } from './ui/button'
import { Forward, Star } from 'lucide-react'
import Link from 'next/link'

interface IProps {
  workId?: string
}

export default function WorkNav(props: IProps) {
  return (
    <div className="flex text-secondary-foreground my-1 mx-3 bg-ground pb-1 border-b">
      <div className="text-start inline-flex items-center">
        <Logo />
      </div>
      <div className="flex-1 text-end">
        <div className="flex-1 text-end">
          <Button variant="ghost">
            <Forward className="h-4 w4" />
            &nbsp;分享
          </Button>
          <Button variant="ghost">
            <Star className="h-4 w-4" />
            &nbsp;收藏
          </Button>
          <ChangeTheme />
        </div>
      </div>
    </div>
  )
}
