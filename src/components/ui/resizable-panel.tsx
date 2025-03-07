'use client'

import { GoGrabber } from 'react-icons/go'
import { cn } from "@/lib/utils";
import * as PanelPrimitive from "react-resizable-panels";

export const PanelGroup = PanelPrimitive.PanelGroup;

export const Panel = PanelPrimitive.Panel;

type PanelResizeHandleProps = React.ComponentProps<typeof PanelPrimitive.PanelResizeHandle> & {
  isDragging?: boolean;
};

export const PanelResizeHandle = ({
  className,
  isDragging,
  onDragging,
  ...props
}: PanelResizeHandleProps) => (
  <PanelPrimitive.PanelResizeHandle
    className={cn("relative h-screen", className)}
    onDragging={onDragging}
    {...props}
  >
    <div className="flex h-full items-center justify-center">
      <div
        className={cn(
          "absolute inset-y-0 left-0 z-50 w-1 rounded-lg pl-1 transition-all hover:bg-destructive/20 hover:opacity-100",
          isDragging && "bg-destructive/20 opacity-100",
        )}
      />
    </div>

    <div className="pointer-events-none absolute inset-y-0 left-[-10px] z-50 flex items-center justify-center">
      <GoGrabber size={28}/>
    </div>
  </PanelPrimitive.PanelResizeHandle>
);
