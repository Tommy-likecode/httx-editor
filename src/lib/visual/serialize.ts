import type { VisualDocument, VisualNode, VisualStyles } from './types'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function toKebab(key: string): string {
  return key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

function styleAttr(styles: VisualStyles): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(styles)) {
    if (!value) continue
    parts.push(`${toKebab(key)}: ${value}`)
  }
  return parts.length ? ` style="${escapeHtml(parts.join('; '))}"` : ''
}

function attrsAttr(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
    .join('')
}

function serializeNode(node: VisualNode, indent = 2): string {
  const pad = ' '.repeat(indent)
  const common = ` data-httx-id="${node.id}"${attrsAttr(node.attrs)}${styleAttr(node.styles)}`

  if (node.tag === 'img') {
    return `${pad}<img${common} />`
  }

  if (node.tag === 'input') {
    return `${pad}<input${common} />`
  }

  if (node.children.length === 0) {
    const text = node.text ?? ''
    return `${pad}<${node.tag}${common}>${escapeHtml(text)}</${node.tag}>`
  }

  const kids = node.children.map((child) => serializeNode(child, indent + 2)).join('\n')
  return `${pad}<${node.tag}${common}>\n${kids}\n${pad}</${node.tag}>`
}

export function serializeVisualToBody(doc: VisualDocument): string {
  if (doc.nodes.length === 0) return '  <!-- 从左侧拖入组件开始搭建 -->'
  return doc.nodes.map((node) => serializeNode(node, 2)).join('\n')
}

export function mergeBodyIntoHtml(originalHtml: string, bodyInner: string): string {
  if (/<body[^>]*>[\s\S]*?<\/body>/i.test(originalHtml)) {
    return originalHtml.replace(/<body([^>]*)>[\s\S]*?<\/body>/i, `<body$1>\n${bodyInner}\n</body>`)
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Httx</title>
</head>
<body>
${bodyInner}
</body>
</html>`
}

export function serializeVisualToHtml(originalHtml: string, doc: VisualDocument): string {
  return mergeBodyIntoHtml(originalHtml, serializeVisualToBody(doc))
}
