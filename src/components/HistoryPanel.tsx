import type { HistoryEntry } from '../lib/history'

interface HistoryPanelProps {
  open: boolean
  entries: HistoryEntry[]
  onRestore: (entry: HistoryEntry) => void
  onSnapshot: () => void
  onClear: () => void
  onClose: () => void
}

export function HistoryPanel({
  open,
  entries,
  onRestore,
  onSnapshot,
  onClear,
  onClose,
}: HistoryPanelProps) {
  if (!open) return null

  return (
    <section className="history-panel">
      <div className="cdn-header">
        <div>
          <h2>版本历史</h2>
          <p>本地快照，可回退到之前的草稿状态。</p>
        </div>
        <div className="pane-actions">
          <button type="button" className="ghost-btn" onClick={onSnapshot}>
            立即快照
          </button>
          <button type="button" className="ghost-btn danger" onClick={onClear}>
            清空历史
          </button>
          <button type="button" className="ghost-btn" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
      <div className="history-list">
        {entries.length === 0 ? (
          <p className="cdn-empty">暂无历史。保存草稿或点击「立即快照」创建记录。</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="history-row">
              <div>
                <strong>{entry.label}</strong>
                <span>{new Date(entry.createdAt).toLocaleString()}</span>
              </div>
              <button type="button" onClick={() => onRestore(entry)}>
                恢复
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
