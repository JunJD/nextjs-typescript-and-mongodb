'use client'

import GjsEditor from '@grapesjs/react'
import grapesjs from 'grapesjs';
import type { Editor, EditorConfig, ObjectAny } from 'grapesjs'
import { devices } from '@/lib/constants/devices'
import { registerComponents } from '@/lib/components'
import { useState } from 'react'
import LinkageForm from '@/plugins/linkageForm'
import gjsblockbasic from 'grapesjs-blocks-basic';
import tailwindPlugin from 'grapesjs-tailwind'
import formatTempList from '@/plugins/formatTempList'
// @ts-ignore
import gjsPluginExport from 'grapesjs-plugin-export';
// import gjsForms from 'grapesjs-plugin-forms';
import gjsStyleBg from 'grapesjs-style-bg';
import gjsStyleFilter from 'grapesjs-style-filter';
import gjsStyleGradient from 'grapesjs-style-gradient';
import gjsTuiImageEditor from 'grapesjs-tui-image-editor';
import 'grapesjs/dist/css/grapes.min.css';
import { styleManager } from './config/styleManager';

export default function BuilderEditor({ children, projectData }: { children: React.ReactNode, projectData: ObjectAny }) {
  const [isLoading, setIsLoading] = useState(true)

  const onEditor = (editor: Editor) => {
    console.log('Editor loaded')
      ; (window as any).editor = editor

    // 注册组件
    registerComponents(editor)
  }

  const onReady = (editor: Editor) => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">
            加载编辑器...
          </div>
        </div>
      )}
      <GjsEditor
        className="gjs-custom-editor"
        grapesjs={grapesjs}
        options={{
          ...gjsOptions,
          projectData
        }}
        plugins={[
          gjsblockbasic,
          // @ts-ignore
          gjsPluginExport,
          LinkageForm,
          formatTempList,
          tailwindPlugin,
          gjsStyleBg,
          gjsStyleFilter,
          gjsStyleGradient,
          gjsTuiImageEditor,
        ]}
        onEditor={onEditor}
        onReady={onReady}
      >
        {children}
      </GjsEditor>
    </>
  )
}
const gjsOptions: EditorConfig = {
  // stylePrefix: 'editor-h5-',
  height: '100vh',
  storageManager: false,
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  canvas: {
    infiniteCanvas: true
  },
  // 使用基础 blocks
  // blockManager: {
  //   custom: true,
  //   blocks
  // },
  deviceManager: {
    devices: Object.values(devices).map(device => ({
      id: device.id,
      name: device.name,
      width: `${device.width}px`,
      height: `${device.height}px`,
      widthMedia: undefined
    }))
  },
  pluginsOpts: {
    // @ts-ignore
    [gjsPluginExport as string]: {
      root: {
        css: {
          'style.css': (editor: Editor) => editor.getCss(),
        },
        'index.html': (editor: Editor) =>
          `<!doctype html>
          <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
              <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
              <script>
                tailwind.config = {
                  theme: {
                    extend: {}
                  }
                }
              </script>
              <link rel="stylesheet" href="./css/style.css">
            </head>
            <body>
              <div x-data="formHandler">
                ${editor.getHtml()}
              </div>

              <script>
                document.addEventListener('alpine:init', () => {
                  Alpine.data('formHandler', () => ({
                    formData: {},
                    linkageRules: {},
                    
                    init() {
                      // 收集所有输入框的初始值
                      document.querySelectorAll('input[name]').forEach(input => {
                        this.formData[input.name] = input.value || '';
                      });
                      
                      // 收集联动规则
                      document.querySelectorAll('input[linkage-target]').forEach(input => {
                        this.linkageRules[input.name] = {
                          target: input.getAttribute('linkage-target'),
                          triggerValue: input.getAttribute('linkage-value'),
                          setValue: input.getAttribute('linkage-set')
                        };
                        console.log('Rule added for:', input.name, this.linkageRules[input.name]);
                      });

                      // 添加事件监听和数据绑定
                      document.querySelectorAll('input[name]').forEach(input => {
                        input.addEventListener('input', this.handleInput.bind(this));
                      });
                    },

                    handleInput(event) {
                      const input = event.target;
                      this.formData[input.name] = input.value;
                      console.log('Input changed:', input.name, input.value);
                      
                      // 检查联动规则
                      const rule = this.linkageRules[input.name];
                      if (rule && this.formData[input.name] === rule.triggerValue) {
                        console.log('Rule matched:', rule);
                        this.formData[rule.target] = rule.setValue;
                        const targetInput = document.querySelector('input[name="' + rule.target + '"]');
                        if (targetInput) {
                          targetInput.value = rule.setValue;
                          console.log('Updated target:', rule.target, rule.setValue);
                        }
                      }
                    }
                  }));
                });
              </script>
            </body>
          </html>`
      },
    },
    // @ts-ignore
    [gjsblockbasic as string]: {
      // 启用的
      blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'image'],
      // 使用 flexbox 布局
      flexGrid: true,
      // 使用基础 CSS
      addBasicStyle: true,
      // 分类名称
      category: 'Basic',
    }
  },
  styleManager
}

