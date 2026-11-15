import { canAcceptChildren, flattenTree } from '../lib/visual/ops'
import type { VisualDocument } from '../lib/visual/types'

interface HierarchyTreeProps {
  doc: VisualDocument
  selectedId: string | null
  onSelect: (id: string) => void
}

const KIND_LABEL: Record<string, string> = {
  heading: '标题',
  text: '文本',
  button: '按钮',
  image: '图片',
  link: '链接',
  nav: '导航',
  form: '表单',
  input: '输入',
  card: '卡片',
  section: '区块',
  container: '容器',
}

export function HierarchyTree({ doc, selectedId, onSelect }: HierarchyTreeProps) {
  const rows = flattenTree(doc)

  return (
    <div className="hierarchy-tree" data-testid="hierarchy-tree">
      <div className="pane-header">
        <strong>结构</strong>
        <span className="hint">点击选中嵌套元素</span>
      </div>
      <div className="hierarchy-list">
        {rows.length === 0 ? (
          <p className="hint" style={{ padding: '0.5rem 0.65rem' }}>
            暂无节点
          </p>
        ) : (
          rows.map(({ node, depth }) => (
            <button
              key={node.id}
              type="button"
              className={selectedId === node.id ? 'hierarchy-row selected' : 'hierarchy-row'}
              style={{ paddingLeft: `${0.55 + depth * 0.75}rem` }}
              onClick={() => onSelect(node.id)}
            >
              <span className="hierarchy-kind">
                {KIND_LABEL[node.kind] || node.kind}
                {canAcceptChildren(node) ? ' ▾' : ''}
              </span>
              <span className="hierarchy-preview">
                {(node.text || node.attrs.placeholder || node.attrs.alt || node.tag).slice(0, 18)}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
