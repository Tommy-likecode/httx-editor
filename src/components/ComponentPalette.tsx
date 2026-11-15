import { PALETTE } from '../lib/visual/ops'
import { SNIPPETS } from '../lib/snippets'
import type { DesignVariable, VisualKind } from '../lib/visual/types'
import { VariablesPanel } from './VariablesPanel'

interface ComponentPaletteProps {
  onAdd: (kind: VisualKind) => void
  onInsertSnippet: (html: string, name: string) => void
  variables: DesignVariable[]
  onVariablesChange: (variables: DesignVariable[]) => void
  onInsertVariableToken: (token: string) => void
}

export function ComponentPalette({
  onAdd,
  onInsertSnippet,
  variables,
  onVariablesChange,
  onInsertVariableToken,
}: ComponentPaletteProps) {
  return (
    <aside className="palette-pane">
      <div className="pane-header">
        <strong>组件</strong>
      </div>
      <div className="palette-list">
        {PALETTE.map((item) => (
          <button
            key={item.kind}
            type="button"
            className="palette-item"
            draggable
            data-testid={`palette-${item.kind}`}
            title={item.hint}
            onDragStart={(event) => {
              event.dataTransfer.setData('application/httx-kind', item.kind)
              event.dataTransfer.effectAllowed = 'copy'
            }}
            onClick={() => onAdd(item.kind)}
          >
            <span>{item.label}</span>
            <small>{item.hint}</small>
          </button>
        ))}
      </div>

      <div className="pane-header">
        <strong>片段</strong>
      </div>
      <div className="palette-list">
        {SNIPPETS.map((snippet) => (
          <button
            key={snippet.id}
            type="button"
            className="palette-item"
            title={snippet.description}
            onClick={() => onInsertSnippet(snippet.html, snippet.name)}
          >
            <span>{snippet.name}</span>
            <small>{snippet.description}</small>
          </button>
        ))}
      </div>

      <VariablesPanel
        variables={variables}
        onChange={onVariablesChange}
        onInsertToken={onInsertVariableToken}
      />
    </aside>
  )
}
