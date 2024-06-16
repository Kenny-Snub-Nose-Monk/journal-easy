import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from '@/components/ui/resizable';

export default function Layout({
    params,
    children
}: Readonly<{
    params: { id: string}
    children: React.ReactNode
}>) {
    const { id = '0' } = params;

    return (
        <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel defaultSize={25}>
                <div>
                    <span className="font-semibold">Sidebar {id}</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
                <div className="flex h-full item-center justify-center p-6">
                    {children}
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}