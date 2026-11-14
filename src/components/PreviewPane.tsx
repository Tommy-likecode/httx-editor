import { useEffect, useRef } from 'react'
import type { ConsoleEntry, ConsoleLevel } from '../types'

interface PreviewPaneProps {
  srcdoc: string
  fullscreen: boolean
  onToggleFullscreen: () => void
  onConsole: (entry: Omit<ConsoleEntry, 'id' | 'timestamp'> & { level: ConsoleLevel }) => void
  onClearConsole: () => void
}

export function PreviewPane({
  srcdoc,
  fullscreen,
  onToggleFullscreen,
  onConsole,
  onClearConsole,
}: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data
      if (!data || data.source !== 'httx-preview') return

      if (data.type === 'console') {
        onConsole({
          level: (data.level as ConsoleLevel) || 'log',
          message: String(data.message ?? ''),
        })
      }

      if (data.type === 'runtime-error') {
        onConsole({
          level: 'error',
          message: String(data.message ?? '未知运行时错误'),
        })
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onConsole])

  useEffect(() => {
    onClearConsole()
  }, [srcdoc, onClearConsole])

  return (
    <div className={fullscreen ? 'preview-pane fullscreen' : 'preview-pane'}>
      <div className="pane-header">
        <span>预览</span>
        <div className="pane-actions">
          <button type="button" className="ghost-btn" onClick={onClearConsole}>
            清空控制台
          </button>
          <button type="button" className="ghost-btn" onClick={onToggleFullscreen}>
            {fullscreen ? '退出全屏' : '全屏预览'}
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="Httx 预览"
        className="preview-frame"
        sandbox="allow-scripts"
        srcDoc={srcdoc}
      />
    </div>
  )
}
