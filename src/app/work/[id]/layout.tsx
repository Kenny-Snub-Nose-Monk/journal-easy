import { redirect } from 'next/navigation'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import TopBar from './top-bar'
import { Separator } from '@/components/ui/separator'
import { LogOut, Users } from 'lucide-react'
import UserSettingButton from '@/components/user-setting-button'
import SignOutButton from '@/components/sign-out-button'
import { getUserInfo } from '@/lib/session'
import Trash from '../(dialog-pages)/trash'
import StarList from '../(dialog-pages)/star-list'
import SearchComp from '../(dialog-pages)/search'

export default async function Layout({
  params,
  children,
  directory, // parallel route
}: Readonly<{
  params: { id: string }
  children: React.ReactNode
  directory: React.ReactNode
}>) {
  const user = await getUserInfo()
  if (user == null) {
    redirect('/user-info')
  }
  const { id = '0' } = params

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={18}>
        <div className="flex flex-col h-screen bg-muted text-muted-foreground p-2">
          <div>
            <UserSettingButton user={user} />
            <SearchComp />
            <StarList />
            {/* <Button
              className="w-full justify-start px-2 font-bold hover:bg-card"
              variant="ghost"
            >
              <Users className="h-4 w-4" />
              &nbsp;&nbsp;共同編輯
            </Button> */}
          </div>
          <Separator className="my-4" />
          <div className="flex-auto overflow-y-auto">{directory}</div>
          <Separator className="my-4" />
          <div>
            <Trash />
            <SignOutButton
              className="w-full justify-start px-2 "
              variant="ghost"
            >
              <LogOut className="h-4 w-4" />
              &nbsp;&nbsp;退出登入
            </SignOutButton>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={82}>
        <div className="h-screen flex flex-col relative">
          {/* top bar */}
          <TopBar defaultId={id} />
          {/* content */}
          <div
            id="work-content-scroll-container"
            className="flex-auto overflow-y-auto"
          >
            {children}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
