'use client'

import { 
  GoHome,
  GoLock
} from 'react-icons/go'
import { Button } from '@/components/ui'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from 'atomic-utils'
import Link from 'next/link'
import { DevicesProvider, useEditorMaybe } from '@grapesjs/react'
import { useParams } from 'next/navigation'
import { updateIssue } from '@/actions/builder'

export const BuilderHeader = () => {
  const title = '未命名页面'
  const locked = false
  const leftPanelSize = 0
  const rightPanelSize = 0
  const isDragging = false
  const editor = useEditorMaybe()

  const id = useParams().id as string
  
  const onExport = () => {
    editor?.runCommand('gjs-export-zip');
  }
  
  const onSave = async () => {
    if (!editor) return

    const html = editor.getHtml() ?? ''
    const css = editor.getCss() ?? ''
    const projectData = editor.getProjectData() ?? {}
    
    console.log(html, css, projectData)
    updateIssue(id, { html, css, projectData })
    // try {
    //   await fetch('/api/issues/[id]', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       content: {
    //         html,
    //         css,
    //         projectData
    //       }
    //     })
    //   })
    // } catch (error) {
    //   console.error('保存失败:', error)
    // }
  }

  return (
    <TooltipProvider>
      <div
        style={{ left: `${leftPanelSize}%`, right: `${rightPanelSize}%` }}
        className={cn(
          "fixed inset-x-0 top-0 z-[60] h-16 bg-background/50 backdrop-blur-lg lg:z-20",
          !isDragging && "transition-[left,right]",
        )}
      >
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center justify-center gap-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild size="icon" variant="ghost">
                  <Link href="/client/issues">
                    <GoHome />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>返回列表</TooltipContent>
            </Tooltip>

            <span className="mr-2 text-xs opacity-40">/</span>

            <h1 className="font-medium">{title}</h1>

            {locked && (
              <Tooltip>
                <TooltipTrigger>
                  <GoLock className="ml-2 opacity-75" size={14} />
                </TooltipTrigger>
                <TooltipContent>页面已锁定，无法编辑</TooltipContent>
              </Tooltip>
            )}
          </div>

          <DevicesProvider>
            {({ selected, select, devices }) => {
              return (
                <div className="flex items-center gap-2">
                  {devices.map(device => (
                    <Button
                      key={device.id}
                      size="sm"
                      variant={selected === device.id ? 'default' : 'ghost'}
                      onClick={() => select(device.id.toString())}
                    >
                      {device.getName()}
                    </Button>
                  ))}
                </div>
              )
            }}
          </DevicesProvider>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onExport} size="sm">
              导出
            </Button>
            <Button size="sm" onClick={onSave}>
              保存
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
