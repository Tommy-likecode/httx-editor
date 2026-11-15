import { useState } from 'react'
import { createVariable, isValidVarName, varToken } from '../lib/variables'
import type { DesignVariable, VariableType } from '../lib/visual/types'

interface VariablesPanelProps {
  variables: DesignVariable[]
  onChange: (variables: DesignVariable[]) => void
  onInsertToken?: (token: string) => void
}

export function VariablesPanel({ variables, onChange, onInsertToken }: VariablesPanelProps) {
  const [name, setName] = useState('headline')
  const [type, setType] = useState<VariableType>('text')

  return (
    <div className="variables-panel" data-testid="variables-panel">
      <div className="pane-header">
        <strong>变量</strong>
        <span className="hint">在文本中使用 {`{{name}}`}</span>
      </div>

      <div className="variables-add">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="变量名"
          aria-label="变量名"
        />
        <select value={type} onChange={(event) => setType(event.target.value as VariableType)}>
          <option value="text">文本</option>
          <option value="color">颜色</option>
          <option value="number">数字</option>
          <option value="url">URL</option>
        </select>
        <button
          type="button"
          onClick={() => {
            if (!isValidVarName(name)) return
            if (variables.some((v) => v.name === name)) return
            onChange([...variables, createVariable(name, type)])
            setName('')
          }}
        >
          添加
        </button>
      </div>

      <div className="variables-list">
        {variables.length === 0 ? (
          <p className="hint">暂无变量。添加后可绑定到文本/颜色/链接。</p>
        ) : (
          variables.map((variable) => (
            <div key={variable.id} className="variable-row">
              <div className="variable-meta">
                <code>{varToken(variable.name)}</code>
                <span>{variable.type}</span>
              </div>
              {variable.type === 'color' ? (
                <input
                  type="color"
                  value={/^#/.test(variable.value) ? variable.value : '#0f766e'}
                  onChange={(event) =>
                    onChange(
                      variables.map((v) =>
                        v.id === variable.id ? { ...v, value: event.target.value } : v,
                      ),
                    )
                  }
                />
              ) : (
                <input
                  value={variable.value}
                  onChange={(event) =>
                    onChange(
                      variables.map((v) =>
                        v.id === variable.id ? { ...v, value: event.target.value } : v,
                      ),
                    )
                  }
                />
              )}
              <div className="variable-actions">
                {onInsertToken ? (
                  <button type="button" className="ghost-btn" onClick={() => onInsertToken(varToken(variable.name))}>
                    插入
                  </button>
                ) : null}
                <button
                  type="button"
                  className="ghost-btn danger"
                  onClick={() => onChange(variables.filter((v) => v.id !== variable.id))}
                >
                  删
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
