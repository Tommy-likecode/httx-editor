import type { EditorMode } from '../lib/visual/types'

interface ModeToggleProps {
  mode: EditorMode
  onChange: (mode: EditorMode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="mode-toggle" role="group" aria-label="编辑模式">
      <button
        type="button"
        className={mode === 'visual' ? 'active' : undefined}
        data-testid="mode-visual"
        onClick={() => onChange('visual')}
      >
        可视化
      </button>
      <button
        type="button"
        className={mode === 'code' ? 'active' : undefined}
        data-testid="mode-code"
        onClick={() => onChange('code')}
      >
        代码
      </button>
    </div>
  )
}
