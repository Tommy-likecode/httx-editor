import type { ReactNode } from 'react'
import type { VisualNode, VisualStyles } from '../lib/visual/types'

interface PropertyPanelProps {
  node: VisualNode | null
  onChange: (node: VisualNode) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (direction: 'up' | 'down') => void
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
  onChange,
  onDelete,
  onDuplicate,
  onMove,
}: PropertyPanelProps) {
  if (!node) {
    return (
      <aside className="props-pane">
        <div className="pane-header">
          <strong>属性</strong>
        </div>
        <div className="props-empty">
          <p>选中画布中的元素以编辑属性。</p>
          <p className="hint">可改文本、颜色、字号、间距、对齐、圆角、链接与图片地址。</p>
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
        <button type="button" className="danger" onClick={onDelete}>
          删除
        </button>
      </div>

      <div className="props-body">
        {node.text !== undefined ? (
          <Field label="文本" hint="元素显示的文字内容">
            <textarea
              rows={3}
              value={node.text}
              onChange={(event) => onChange({ ...node, text: event.target.value })}
            />
          </Field>
        ) : null}

        {node.tag === 'a' || node.kind === 'link' ? (
          <Field label="链接" hint="href 地址">
            <input
              type="url"
              value={node.attrs.href || ''}
              onChange={(event) => patchAttrs({ href: event.target.value })}
              placeholder="https://"
            />
          </Field>
        ) : null}

        {node.tag === 'img' || node.kind === 'image' ? (
          <>
            <Field label="图片地址" hint="支持 https URL 或本地上传转 Data URL">
              <input
                type="url"
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

        <Field label="文字颜色">
          <input
            type="color"
            value={normalizeColor(node.styles.color)}
            onChange={(event) => patchStyles({ color: event.target.value })}
          />
        </Field>
        <Field label="背景色">
          <input
            type="color"
            value={normalizeColor(node.styles.backgroundColor, '#ffffff')}
            onChange={(event) => patchStyles({ backgroundColor: event.target.value })}
          />
        </Field>
        <Field label="字号" hint="如 16px / 1.25rem">
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
        <Field label="内边距" hint="padding，如 1rem">
          <input
            value={node.styles.padding || ''}
            onChange={(event) => patchStyles({ padding: event.target.value })}
          />
        </Field>
        <Field label="外边距" hint="margin">
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
        <Field label="圆角" hint="border-radius">
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
      </div>
    </aside>
  )
}

function normalizeColor(value?: string, fallback = '#0f172a'): string {
  if (!value) return fallback
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return value.length === 4
    ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
    : value
  return fallback
}
