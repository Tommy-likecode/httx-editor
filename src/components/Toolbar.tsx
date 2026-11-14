import { TEMPLATES } from '../lib/templates'
import type { ThemeMode } from '../types'

interface ToolbarProps {
  theme: ThemeMode
  fontSize: number
  savedAt: number | null
  onFormat: () => void
  onSave: () => void
  onClearDraft: () => void
  onExport: () => void
  onThemeToggle: () => void
  onFontSizeChange: (size: number) => void
  onLoadTemplate: (id: string) => void
  onToggleResources: () => void
  resourcesOpen: boolean
}

export function Toolbar({
  theme,
  fontSize,
  savedAt,
  onFormat,
  onSave,
  onClearDraft,
  onExport,
  onThemeToggle,
  onFontSizeChange,
  onLoadTemplate,
  onToggleResources,
  resourcesOpen,
}: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="brand-block">
        <span className="brand">Httx</span>
        <span className="brand-sub">HTML 编辑器</span>
      </div>

      <div className="toolbar-group">
        <label className="field">
          <span>模板</span>
          <select
            defaultValue=""
            onChange={(event) => {
              const id = event.target.value
              if (id) {
                onLoadTemplate(id)
                event.target.value = ''
              }
            }}
          >
            <option value="" disabled>
              选择模板…
            </option>
            {TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={onFormat} title="格式化当前标签 (Shift+Alt+F)">
          格式化
        </button>
        <button type="button" onClick={onSave} title="保存草稿 (Ctrl/Cmd+S)">
          保存草稿
        </button>
        <button type="button" className="danger" onClick={onClearDraft}>
          清空草稿
        </button>
        <button type="button" onClick={onExport}>
          导出 HTML
        </button>
        <button
          type="button"
          className={resourcesOpen ? 'active' : undefined}
          onClick={onToggleResources}
        >
          CDN 资源
        </button>
      </div>

      <div className="toolbar-group trailing">
        <label className="field compact">
          <span>字号</span>
          <input
            type="range"
            min={12}
            max={20}
            step={1}
            value={fontSize}
            onChange={(event) => onFontSizeChange(Number(event.target.value))}
          />
          <em>{fontSize}</em>
        </label>
        <button type="button" onClick={onThemeToggle}>
          {theme === 'light' ? '深色主题' : '浅色主题'}
        </button>
        <span className="save-status">
          {savedAt ? `已保存 ${new Date(savedAt).toLocaleTimeString()}` : '未保存'}
        </span>
      </div>
    </header>
  )
}
