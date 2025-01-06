'use client'
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable-panel";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builder";
import DraftEditor from "@/components/issue/editor/draft";
const OutletSlot = ({ children }: { children: React.ReactNode }) => (
    <>
        {/* <BuilderHeader /> */}

        {/* <DraftEditor editable={true} content={'22222'} /> */}
        <div className="absolute inset-0">
            {children}
        </div>

        {/* <BuilderToolbar /> */}
    </>
);

export default function EditIssuePage({ params }: { params: { id: string } }) {

    console.log(params, 'params222')
    const sheet = useBuilderStore((state) => state.sheet);

    const leftSetSize = useBuilderStore((state) => state.panel.left.setSize);
    const rightSetSize = useBuilderStore((state) => state.panel.right.setSize);

    const leftHandle = useBuilderStore((state) => state.panel.left.handle);
    const rightHandle = useBuilderStore((state) => state.panel.right.handle);


    return (
        <div className="relative size-full overflow-hidden">
            <PanelGroup direction="horizontal" id="issue-edit-panel-group">
                <Panel
                    minSize={25}
                    maxSize={40}
                    defaultSize={25}
                    className={cn("z-10 bg-background", !leftHandle.isDragging && "transition-[flex]")}
                    onResize={leftSetSize}
                >
                    left
                </Panel>
                <PanelResizeHandle
                    isDragging={leftHandle.isDragging}
                    onDragging={leftHandle.setDragging}
                />
                <Panel >
                    <OutletSlot>
                        <iframe
                            title={'artboard'}
                            src="/artboard"
                            className="mt-16 w-screen"
                            style={{ height: `calc(100vh - 64px)` }}
                        />
                    </OutletSlot>
                </Panel>
                <PanelResizeHandle
                    isDragging={rightHandle.isDragging}
                    onDragging={rightHandle.setDragging}
                />
                <Panel
                    minSize={25}
                    maxSize={40}
                    defaultSize={25}
                    className={cn("z-10 bg-background", !rightHandle.isDragging && "transition-[flex]")}
                    onResize={rightSetSize}
                >
                    right
                </Panel>
            </PanelGroup>
        </div>
    )
}