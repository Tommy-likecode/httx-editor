import {
  createElement,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { canAcceptChildren } from '../lib/visual/ops'
import type {
  DropPlacement,
  VisualDocument,
  VisualNode,
  VisualStyles,
} from '../lib/visual/types'
import { HierarchyTree } from './HierarchyTree'

interface VisualCanvasProps {
  doc: VisualDocument
  selectedId: string | null
  onSelect: (id: string | null) => void
  onDropKind: (kind: string, targetId: string | null, placement: DropPlacement) => void
  onRelocate: (sourceId: string, targetId: string | null, placement: DropPlacement) => void
  onFreeMove: (id: string, left: number, top: number) => void
  onResize: (id: string, width: number, height: number) => void
}

function stylesToCss(styles: VisualStyles): CSSProperties {
  return { ...styles } as CSSProperties
}

function DropLine({
  active,
  label,
}: {
  active: boolean
  label: string
}) {
  return <div className={active ? 'drop-line active' : 'drop-line'} data-label={label} />
}

function CanvasNode({
  node,
  selectedId,
  onSelect,
  dragOver,
  setDragOver,
  onNodeDragStart,
}: {
  node: VisualNode
  selectedId: string | null
  onSelect: (id: string | null) => void
  dragOver: { id: string; placement: DropPlacement } | null
  setDragOver: (value: { id: string; placement: DropPlacement } | null) => void
  onNodeDragStart: (event: DragEvent, id: string) => void
}) {
  const selected = node.id === selectedId
  const className = selected ? 'canvas-node selected' : 'canvas-node'
  const accept = canAcceptChildren(node)

  const handleSelect = (event: MouseEvent) => {
    event.stopPropagation()
    onSelect(node.id)
  }

  const onDragOverPlacement = (event: DragEvent, placement: DropPlacement) => {
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = 'move'
    setDragOver({ id: node.id, placement })
  }

  const content = (() => {
    if (node.tag === 'img') {
      return (
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={stylesToCss(node.styles)}
          draggable={false}
        />
      )
    }
    if (node.tag === 'input') {
      return (
        <input
          {...node.attrs}
          style={stylesToCss(node.styles)}
          readOnly
          onFocus={(event) => event.preventDefault()}
        />
      )
    }
    if (node.children.length === 0) {
      return createElement(
        node.tag,
        {
          style: stylesToCss(node.styles),
          ...(node.tag === 'a'
            ? { href: '#', onClick: (e: MouseEvent) => e.preventDefault() }
            : {}),
        },
        node.text,
      )
    }
    return createElement(
      node.tag,
      {
        style: {
          ...stylesToCss(node.styles),
          minHeight: node.styles.minHeight || (accept ? '40px' : undefined),
        },
      },
      node.children.map((child) => (
        <CanvasNode
          key={child.id}
          node={child}
          selectedId={selectedId}
          onSelect={onSelect}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onNodeDragStart={onNodeDragStart}
        />
      )),
    )
  })()

  return (
    <div
      className={className}
      data-node-id={node.id}
      data-testid={`canvas-node-${node.id}`}
      onClick={handleSelect}
      draggable
      onDragStart={(event) => onNodeDragStart(event, node.id)}
      onDragOver={(event) => {
        if (!accept) return
        onDragOverPlacement(event, 'inside')
      }}
    >
      <DropLine
        active={dragOver?.id === node.id && dragOver.placement === 'before'}
        label="之前"
      />
      <div
        className="drop-zone before"
        onDragOver={(event) => onDragOverPlacement(event, 'before')}
      />
      <div
        className={
          dragOver?.id === node.id && dragOver.placement === 'inside' && accept
            ? 'node-shell drop-inside'
            : 'node-shell'
        }
      >
        {selected ? <span className="node-badge">{node.kind}</span> : null}
        {content}
      </div>
      {accept ? (
        <div
          className="drop-zone inside-hint"
          onDragOver={(event) => onDragOverPlacement(event, 'inside')}
        />
      ) : null}
      <div
        className="drop-zone after"
        onDragOver={(event) => onDragOverPlacement(event, 'after')}
      />
      <DropLine
        active={dragOver?.id === node.id && dragOver.placement === 'after'}
        label="之后"
      />
    </div>
  )
}

export function VisualCanvas({
  doc,
  selectedId,
  onSelect,
  onDropKind,
  onRelocate,
  onFreeMove,
  onResize,
}: VisualCanvasProps) {
  const [dragOver, setDragOver] = useState<{ id: string; placement: DropPlacement } | null>(null)
  const [showTree, setShowTree] = useState(true)
  const stageRef = useRef<HTMLDivElement>(null)
  const freeDrag = useRef<{ id: string; startX: number; startY: number; origLeft: number; origTop: number } | null>(
    null,
  )
  const resizeDrag = useRef<{ id: string; startX: number; startY: number; origW: number; origH: number } | null>(
    null,
  )

  const onNodeDragStart = useCallback((event: DragEvent, id: string) => {
    event.stopPropagation()
    event.dataTransfer.setData('application/httx-node-id', id)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const finishDrop = (event: DragEvent, targetId: string | null, placement: DropPlacement) => {
    event.preventDefault()
    event.stopPropagation()
    const sourceId = event.dataTransfer.getData('application/httx-node-id')
    const kind = event.dataTransfer.getData('application/httx-kind')
    setDragOver(null)
    if (sourceId) {
      onRelocate(sourceId, targetId, placement)
      onSelect(sourceId)
      return
    }
    if (kind) onDropKind(kind, targetId, placement)
  }

  const selected = selectedId ? findSelected(doc, selectedId) : null

  const onPointerMove = (event: ReactPointerEvent) => {
    if (freeDrag.current) {
      const dx = event.clientX - freeDrag.current.startX
      const dy = event.clientY - freeDrag.current.startY
      onFreeMove(freeDrag.current.id, Math.round(freeDrag.current.origLeft + dx), Math.round(freeDrag.current.origTop + dy))
    }
    if (resizeDrag.current) {
      const dx = event.clientX - resizeDrag.current.startX
      const dy = event.clientY - resizeDrag.current.startY
      onResize(
        resizeDrag.current.id,
        Math.max(40, Math.round(resizeDrag.current.origW + dx)),
        Math.max(24, Math.round(resizeDrag.current.origH + dy)),
      )
    }
  }

  const endPointer = () => {
    freeDrag.current = null
    resizeDrag.current = null
  }

  return (
    <section className="visual-canvas" data-testid="visual-canvas">
      <div className="pane-header">
        <strong>画布</strong>
        <div className="pane-actions">
          <button
            type="button"
            className={showTree ? 'ghost-btn active' : 'ghost-btn'}
            onClick={() => setShowTree((v) => !v)}
          >
            结构树
          </button>
        </div>
        <span className="hint">拖拽排序/嵌套 · 选中后用手柄自由移动/缩放</span>
      </div>

      <div className="canvas-body">
        {showTree ? (
          <HierarchyTree doc={doc} selectedId={selectedId} onSelect={onSelect} />
        ) : null}

        <div
          ref={stageRef}
          className="canvas-stage"
          onClick={() => onSelect(null)}
          onDragOver={(event) => {
            event.preventDefault()
          }}
          onDrop={(event) => finishDrop(event, null, 'after')}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerLeave={endPointer}
        >
          {doc.nodes.length === 0 ? (
            <div className="canvas-empty">
              <p>从左侧拖入组件，或点击组件库添加</p>
              <p className="hint">可将元素拖入容器/卡片/表单实现嵌套</p>
            </div>
          ) : (
            doc.nodes.map((node) => (
              <div
                key={node.id}
                onDrop={(event) => {
                  const placement =
                    dragOver?.id === node.id ? dragOver.placement : canAcceptChildren(node) ? 'inside' : 'after'
                  finishDrop(event, node.id, placement)
                }}
              >
                <CanvasNode
                  node={node}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  dragOver={dragOver}
                  setDragOver={setDragOver}
                  onNodeDragStart={onNodeDragStart}
                />
              </div>
            ))
          )}

          {selected && selectedId ? (
            <div className="selection-tools" onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className="move-handle"
                data-testid="free-move-handle"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.currentTarget.setPointerCapture(event.pointerId)
                  const left = parseInt(selected.styles.left || '0', 10) || 0
                  const top = parseInt(selected.styles.top || '0', 10) || 0
                  freeDrag.current = {
                    id: selectedId,
                    startX: event.clientX,
                    startY: event.clientY,
                    origLeft: left,
                    origTop: top,
                  }
                }}
              >
                移动
              </button>
              <button
                type="button"
                className="resize-handle"
                data-testid="resize-handle"
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.currentTarget.setPointerCapture(event.pointerId)
                  const width = parseInt(selected.styles.width || '200', 10) || 200
                  const height = parseInt(selected.styles.height || '40', 10) || 40
                  resizeDrag.current = {
                    id: selectedId,
                    startX: event.clientX,
                    startY: event.clientY,
                    origW: width,
                    origH: height,
                  }
                }}
              >
                缩放
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function findSelected(doc: VisualDocument, id: string): VisualNode | null {
  const stack = [...doc.nodes]
  while (stack.length) {
    const node = stack.pop()!
    if (node.id === id) return node
    stack.push(...node.children)
  }
  return null
}
