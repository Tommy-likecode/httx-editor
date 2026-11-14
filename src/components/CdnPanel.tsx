interface CdnPanelProps {
  open: boolean
  resources: string[]
  onChange: (resources: string[]) => void
}

export function CdnPanel({ open, resources, onChange }: CdnPanelProps) {
  if (!open) return null

  return (
    <section className="cdn-panel">
      <div className="cdn-header">
        <div>
          <h2>CDN 资源</h2>
          <p>每行一个 URL。`.css` 将作为样式表引入，其余按脚本加载。</p>
        </div>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => onChange([...resources, ''])}
        >
          添加
        </button>
      </div>
      <div className="cdn-list">
        {resources.length === 0 ? (
          <p className="cdn-empty">暂无 CDN。可添加例如 https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js</p>
        ) : (
          resources.map((url, index) => (
            <div key={index} className="cdn-row">
              <input
                type="url"
                value={url}
                placeholder="https://cdn.example.com/library.js"
                onChange={(event) => {
                  const next = [...resources]
                  next[index] = event.target.value
                  onChange(next)
                }}
              />
              <button
                type="button"
                className="ghost-btn danger"
                onClick={() => onChange(resources.filter((_, i) => i !== index))}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
