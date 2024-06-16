import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from '@/components/ui/resizable';
import WorkNav from '@/components//WorkNav';

export default function Layout({
    params,
    children
}: Readonly<{
    params: { id: string}
    children: React.ReactNode
}>) {
    const { id = '0' } = params;

    return (
        <ResizablePanelGroup direction="horizontal" className="h-screen">
            <ResizablePanel defaultSize={20}>
                <div>
                    <span className="font-semibold">Sidebar {id}</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
                <div className="h-screen flex flex-col">
                    {/* nav bar */}
                    <WorkNav workId={id} />
                    {/* content */}
                    <div className="flex-1">{children}</div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}