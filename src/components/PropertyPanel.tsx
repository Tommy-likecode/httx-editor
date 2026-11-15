import type { ReactNode } from 'react'
import { canAcceptChildren } from '../lib/visual/ops'
import type { DesignVariable, VisualNode, VisualStyles } from '../lib/visual/types'
import { varToken } from '../lib/variables'

interface PropertyPanelProps {
  node: VisualNode | null
  variables: DesignVariable[]
  onChange: (node: VisualNode) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (direction: 'up' | 'down') => void
  onWrap: () => void
  onUnwrap: () => void
}

const FONT_OPTIONS = [
  { label: '默认', value: '' },
  { label: 'IBM Plex Sans', value: '"IBM Plex Sans", system-ui, sans-serif' },
  { label: '衬线', value: 'Georgia, "Noto Serif SC", serif' },
  { label: '等宽', value: '"IBM Plex Mono", ui-monospace, monospace' },
]

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="prop-field">
      <span>
        {label}
        {hint ? <em title={hint}>?</em> : null}
      </span>
      {children}
    </label>
  )
}

export function PropertyPanel({
  node,
  variables,
  onChange,
  onDelete,
  onDuplicate,
  onMove,
  onWrap,
  onUnwrap,
}: PropertyPanelProps) {
  if (!node) {
    return (
      <aside className="props-pane">
        <div className="pane-header">
          <strong>属性</strong>
        </div>
        <div className="props-empty">
          <p>选中画布或结构树中的元素以编辑。</p>
          <p className="hint">支持嵌套容器、拖拽排序，以及 {`{{变量}}`} 绑定。</p>
        </div>
      </aside>
    )
  }

  const patchStyles = (partial: Partial<VisualStyles>) => {
    onChange({ ...node, styles: { ...node.styles, ...partial } })
  }

  const patchAttrs = (partial: Record<string, string>) => {
    onChange({ ...node, attrs: { ...node.attrs, ...partial } })
  }

  const insertIntoText = (token: string) => {
    if (node.text === undefined) return
    onChange({ ...node, text: `${node.text || ''}${token}` })
  }

  return (
    <aside className="props-pane" data-testid="property-panel">
      <div className="pane-header">
        <strong>属性</strong>
        <span className="hint">{node.kind}</span>
      </div>

      <div className="props-actions">
        <button type="button" onClick={() => onMove('up')}>
          上移
        </button>
        <button type="button" onClick={() => onMove('down')}>
          下移
        </button>
        <button type="button" onClick={onDuplicate}>
          复制
        </button>
        <button type="button" onClick={onWrap} title="用容器包裹">
          成组
        </button>
        {canAcceptChildren(node) ? (
          <button type="button" onClick={onUnwrap} title="拆开容器">
            解组
          </button>
        ) : null}
        <button type="button" className="danger" onClick={onDelete}>
          删除
        </button>
      </div>

      <div className="props-body">
        {node.text !== undefined ? (
          <Field label="文本" hint="可用 {{varName}} 插入变量">
            <textarea
              rows={3}
              value={node.text}
              onChange={(event) => onChange({ ...node, text: event.target.value })}
            />
          </Field>
        ) : null}

        {variables.length && node.text !== undefined ? (
          <div className="var-insert-row">
            <span>插入变量</span>
            {variables.map((variable) => (
              <button
                key={variable.id}
                type="button"
                className="ghost-btn"
                onClick={() => insertIntoText(varToken(variable.name))}
              >
                {variable.name}
              </button>
            ))}
          </div>
        ) : null}

        {node.tag === 'a' || node.kind === 'link' ? (
          <Field label="链接" hint="支持 {{urlVar}}">
            <input
              value={node.attrs.href || ''}
              onChange={(event) => patchAttrs({ href: event.target.value })}
              placeholder="https:// 或 {{urlVar}}"
            />
          </Field>
        ) : null}

        {node.tag === 'img' || node.kind === 'image' ? (
          <>
            <Field label="图片地址" hint="URL / {{imageUrl}} / 上传">
              <input
                value={node.attrs.src || ''}
                onChange={(event) => patchAttrs({ src: event.target.value })}
              />
            </Field>
            <Field label="上传图片">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const reader = new FileReader()
                  reader.onload = () => {
                    patchAttrs({ src: String(reader.result || ''), alt: file.name })
                  }
                  reader.readAsDataURL(file)
                }}
              />
            </Field>
            <Field label="替代文本">
              <input
                value={node.attrs.alt || ''}
                onChange={(event) => patchAttrs({ alt: event.target.value })}
              />
            </Field>
          </>
        ) : null}

        {canAcceptChildren(node) ? (
          <>
            <Field label="布局" hint="容器内部排列">
              <select
                value={node.styles.display || ''}
                onChange={(event) => patchStyles({ display: event.target.value || undefined })}
              >
                <option value="">默认</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="block">Block</option>
              </select>
            </Field>
            <Field label="方向">
              <select
                value={node.styles.flexDirection || ''}
                onChange={(event) =>
                  patchStyles({ flexDirection: event.target.value || undefined })
                }
              >
                <option value="">默认</option>
                <option value="row">横向</option>
                <option value="column">纵向</option>
              </select>
            </Field>
            <Field label="间距 gap">
              <input
                value={node.styles.gap || ''}
                onChange={(event) => patchStyles({ gap: event.target.value })}
                placeholder="0.75rem"
              />
            </Field>
          </>
        ) : null}

        <Field label="文字颜色" hint="可填 {{primaryColor}}">
          <div className="color-row">
            <input
              type="color"
              value={normalizeColor(node.styles.color)}
              onChange={(event) => patchStyles({ color: event.target.value })}
            />
            <input
              value={node.styles.color || ''}
              onChange={(event) => patchStyles({ color: event.target.value })}
              placeholder="#0f172a / {{primaryColor}}"
            />
          </div>
        </Field>
        <Field label="背景色">
          <div className="color-row">
            <input
              type="color"
              value={normalizeColor(node.styles.backgroundColor, '#ffffff')}
              onChange={(event) => patchStyles({ backgroundColor: event.target.value })}
            />
            <input
              value={node.styles.backgroundColor || ''}
              onChange={(event) => patchStyles({ backgroundColor: event.target.value })}
            />
          </div>
        </Field>
        <Field label="字号" hint="如 16px / 1.25rem / {{fontSize}}">
          <input
            value={node.styles.fontSize || ''}
            onChange={(event) => patchStyles({ fontSize: event.target.value })}
            placeholder="1rem"
          />
        </Field>
        <Field label="字体">
          <select
            value={node.styles.fontFamily || ''}
            onChange={(event) => patchStyles({ fontFamily: event.target.value || undefined })}
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="内边距">
          <input
            value={node.styles.padding || ''}
            onChange={(event) => patchStyles({ padding: event.target.value })}
          />
        </Field>
        <Field label="外边距">
          <input
            value={node.styles.margin || ''}
            onChange={(event) => patchStyles({ margin: event.target.value })}
          />
        </Field>
        <Field label="对齐">
          <select
            value={node.styles.textAlign || ''}
            onChange={(event) =>
              patchStyles({
                textAlign: (event.target.value || undefined) as VisualStyles['textAlign'],
              })
            }
          >
            <option value="">默认</option>
            <option value="left">左对齐</option>
            <option value="center">居中</option>
            <option value="right">右对齐</option>
          </select>
        </Field>
        <Field label="圆角">
          <input
            value={node.styles.borderRadius || ''}
            onChange={(event) => patchStyles({ borderRadius: event.target.value })}
            placeholder="0 / 8px"
          />
        </Field>
        <Field label="宽度">
          <input
            value={node.styles.width || ''}
            onChange={(event) => patchStyles({ width: event.target.value })}
            placeholder="100% / 320px"
          />
        </Field>
        <Field label="高度">
          <input
            value={node.styles.height || ''}
            onChange={(event) => patchStyles({ height: event.target.value })}
          />
        </Field>
        <Field label="定位" hint="自由移动会写入 relative + left/top">
          <select
            value={node.styles.position || ''}
            onChange={(event) => patchStyles({ position: event.target.value || undefined })}
          >
            <option value="">静态</option>
            <option value="relative">relative</option>
            <option value="absolute">absolute</option>
          </select>
        </Field>
        <Field label="左偏移 left">
          <input
            value={node.styles.left || ''}
            onChange={(event) => patchStyles({ left: event.target.value })}
            placeholder="0px"
          />
        </Field>
        <Field label="上偏移 top">
          <input
            value={node.styles.top || ''}
            onChange={(event) => patchStyles({ top: event.target.value })}
            placeholder="0px"
          />
        </Field>
      </div>
    </aside>
  )
}

function normalizeColor(value?: string, fallback = '#0f172a'): string {
  if (!value) return fallback
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value))
    return value.length === 4
      ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
      : value
  return fallback
}
