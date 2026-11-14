import { useEffect, useRef } from 'react'
import type { DevicePreset } from '../lib/visual/types'
import type { ConsoleEntry, ConsoleLevel } from '../types'

interface PreviewPaneProps {
  srcdoc: string
  fullscreen: boolean
  device: DevicePreset
  onDeviceChange: (device: DevicePreset) => void
  onToggleFullscreen: () => void
  onConsole: (entry: Omit<ConsoleEntry, 'id' | 'timestamp'> & { level: ConsoleLevel }) => void
  onClearConsole: () => void
}

const DEVICE_WIDTH: Record<DevicePreset, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
}

export function PreviewPane({
  srcdoc,
  fullscreen,
  device,
  onDeviceChange,
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
        <div className="pane-actions device-switch">
          <button
            type="button"
            className={device === 'desktop' ? 'ghost-btn active' : 'ghost-btn'}
            onClick={() => onDeviceChange('desktop')}
          >
            桌面
          </button>
          <button
            type="button"
            className={device === 'tablet' ? 'ghost-btn active' : 'ghost-btn'}
            onClick={() => onDeviceChange('tablet')}
          >
            平板
          </button>
          <button
            type="button"
            className={device === 'mobile' ? 'ghost-btn active' : 'ghost-btn'}
            onClick={() => onDeviceChange('mobile')}
          >
            手机
          </button>
          <button type="button" className="ghost-btn" onClick={onClearConsole}>
            清空控制台
          </button>
          <button type="button" className="ghost-btn" onClick={onToggleFullscreen}>
            {fullscreen ? '退出全屏' : '全屏预览'}
          </button>
        </div>
      </div>
      <div className="device-frame-wrap">
        <iframe
          ref={iframeRef}
          title="Httx 预览"
          className="preview-frame"
          style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }}
          sandbox="allow-scripts"
          srcDoc={srcdoc}
        />
      </div>
    </div>
  )
}
