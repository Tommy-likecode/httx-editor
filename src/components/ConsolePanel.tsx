import { explainJsError } from '../lib/errors-zh'
import type { ConsoleEntry } from '../types'

interface ConsolePanelProps {
  entries: ConsoleEntry[]
  open: boolean
  onToggle: () => void
  onClear: () => void
}

export function ConsolePanel({ entries, open, onToggle, onClear }: ConsolePanelProps) {
  const errorCount = entries.filter((entry) => entry.level === 'error').length

  return (
    <section className={open ? 'console-panel open' : 'console-panel'}>
      <header className="console-header">
        <button type="button" className="console-toggle" onClick={onToggle}>
          控制台
          {errorCount > 0 ? <span className="badge">{errorCount}</span> : null}
          <span className="chevron">{open ? '▾' : '▸'}</span>
        </button>
        <button type="button" className="ghost-btn" onClick={onClear}>
          清空
        </button>
      </header>
      {open ? (
        <div className="console-body" role="log" aria-live="polite">
          {entries.length === 0 ? (
            <p className="console-empty">暂无输出。预览中的 console 与运行时错误会出现在这里。</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className={`console-line level-${entry.level}`}>
                <span className="level">{entry.level}</span>
                <div className="message-block">
                  <span className="message">{entry.message}</span>
                  {entry.level === 'error' ? (
                    <span className="hint-zh">{entry.hint || explainJsError(entry.message)}</span>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}
    </section>
  )
}
