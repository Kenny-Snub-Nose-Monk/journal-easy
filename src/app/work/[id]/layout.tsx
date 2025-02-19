import { redirect } from 'next/navigation'
import Link from 'next/link'
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
import HomeNav from '@/components/home-nav'
import { getUserInfo } from '@/lib/session'
import Trash from '../trash'
import StarList from '../(dialog-pages)/star-list'
import SearchComp from '../(dialog-pages)/search'
import ShareList from '../share-list'
import { RIGHT_PANEL_DOM_ID } from '@/constants'
import { getDoc } from './(content)/client-action'

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

  // Is my own doc
  let isMyOwnDoc = true
  const data = await getDoc(id)
  const { userId: docUserId, sharePassword } = data?.doc || {}
  if (docUserId !== user.id) {
    isMyOwnDoc = false
  }
  // main section
  const mainSection = (
    <div id={RIGHT_PANEL_DOM_ID} className="h-screen flex flex-col relative">
      {/* top bar */}
      <TopBar defaultId={id} user={user} />
      {/* content */}
      <div
        id="work-content-scroll-container"
        className="flex-auto overflow-y-auto"
      >
        {children}
      </div>
    </div>
  )

  if (!isMyOwnDoc) {
    if (!sharePassword) {
      // not shared yet
      return (
        <div className="min-h-screen flex flex-col justify-center text-center">
          <HomeNav />
          <p>
            無權限訪問該文件，
            <Link href="/work/" className="underline">
              跳轉到我的文件
            </Link>
          </p>
        </div>
      )
    } else {
      // shared doc
      return mainSection
    }
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel defaultSize={18} className="min-w-44 max-w-[500px]">
        <div className="flex flex-col h-screen bg-muted text-muted-foreground p-2">
          <div>
            <UserSettingButton user={user} />
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
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={82}>{mainSection}</ResizablePanel>
    </ResizablePanelGroup>
  )
}
