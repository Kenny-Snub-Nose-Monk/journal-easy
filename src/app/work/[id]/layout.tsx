import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import TopBar from './top-bar'
import { Separator } from '@/components/ui/separator'
import { LogOut } from 'lucide-react'
import UserSettingButton from '@/components/user-setting-button'
import SignOutButton from '@/components/sign-out-button'
import Trash from '../(dialog-pages)/trash'
import StarList from '../(dialog-pages)/star-list'
import SearchComp from '../(dialog-pages)/search'
import {
  RESIZABLE_RIGHT_PANEL_ID,
  WORK_CONTENT_SCROLL_CONTAINER,
  RESIZABLE_LEFT_PANEL_ID,
  RESIZABLE_HANDLE_ID,
} from '@/constants'
import ShareList from '../(dialog-pages)/share-list'

export default async function Layout({
  params,
  children,
  directory, // parallel route
}: Readonly<{
  params: { id: string }
  children: React.ReactNode
  directory: React.ReactNode
}>) {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel
        id={RESIZABLE_LEFT_PANEL_ID}
        defaultSize={18}
        className="min-w-44 max-w-[500px]"
      >
        <div className="flex flex-col h-screen bg-muted text-muted-foreground p-2">
          <div>
            <UserSettingButton />
            <SearchComp />
            <StarList />
            <ShareList />
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
      <ResizableHandle withHandle id={RESIZABLE_HANDLE_ID} />
      <ResizablePanel defaultSize={82}>
        <div
          id={RESIZABLE_RIGHT_PANEL_ID}
          className="h-screen flex flex-col relative"
        >
          {/* top bar */}
          <TopBar />
          {/* content */}
          <div
            id={WORK_CONTENT_SCROLL_CONTAINER}
            className="flex-auto overflow-y-auto"
          >
            {children}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
