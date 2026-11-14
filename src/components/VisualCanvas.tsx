import { createElement, type CSSProperties, type MouseEvent } from 'react'
import type { VisualDocument, VisualNode, VisualStyles } from '../lib/visual/types'

interface VisualCanvasProps {
  doc: VisualDocument
  selectedId: string | null
  onSelect: (id: string | null) => void
  onDropKind: (kind: string) => void
}

function stylesToCss(styles: VisualStyles): CSSProperties {
  return { ...styles } as CSSProperties
}

function CanvasNode({
  node,
  selectedId,
  onSelect,
}: {
  node: VisualNode
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const selected = node.id === selectedId
  const className = selected ? 'canvas-node selected' : 'canvas-node'

  const handleSelect = (event: MouseEvent) => {
    event.stopPropagation()
    onSelect(node.id)
  }

  if (node.tag === 'img') {
    return (
      <div className={className} data-node-id={node.id} onClick={handleSelect}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={stylesToCss(node.styles)}
          draggable={false}
        />
      </div>
    )
  }

  if (node.tag === 'input') {
    return (
      <div className={className} data-node-id={node.id} onClick={handleSelect}>
        <input
          {...node.attrs}
          style={stylesToCss(node.styles)}
          readOnly
          onFocus={(event) => event.preventDefault()}
        />
      </div>
    )
  }

  if (node.children.length === 0) {
    return (
      <div className={className} data-node-id={node.id} onClick={handleSelect}>
        {createElement(
          node.tag,
          {
            style: stylesToCss(node.styles),
            ...(node.tag === 'a' ? { href: '#', onClick: (e: MouseEvent) => e.preventDefault() } : {}),
          },
          node.text,
        )}
      </div>
    )
  }

  return (
    <div className={className} data-node-id={node.id} onClick={handleSelect}>
      {createElement(
        node.tag,
        { style: stylesToCss(node.styles) },
        node.children.map((child) => (
          <CanvasNode key={child.id} node={child} selectedId={selectedId} onSelect={onSelect} />
        )),
      )}
    </div>
  )
}

export function VisualCanvas({ doc, selectedId, onSelect, onDropKind }: VisualCanvasProps) {
  return (
    <section
      className="visual-canvas"
      data-testid="visual-canvas"
      onClick={() => onSelect(null)}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={(event) => {
        event.preventDefault()
        const kind = event.dataTransfer.getData('application/httx-kind')
        if (kind) onDropKind(kind)
      }}
    >
      <div className="pane-header">
        <strong>画布</strong>
        <span className="hint">拖入组件或点击组件库添加 · 点击元素选中</span>
      </div>
      <div className="canvas-stage">
        {doc.nodes.length === 0 ? (
          <div className="canvas-empty">
            <p>从左侧拖入「标题 / 文本 / 按钮」开始搭建</p>
            <p className="hint">也可在顶部输入「登录表单」一键生成</p>
          </div>
        ) : (
          doc.nodes.map((node) => (
            <CanvasNode key={node.id} node={node} selectedId={selectedId} onSelect={onSelect} />
          ))
        )}
      </div>
    </section>
  )
}
