import { createNodeId } from './id'
import type { VisualDocument, VisualKind, VisualNode, VisualStyles } from './types'

const STYLE_KEYS: (keyof VisualStyles)[] = [
  'color',
  'backgroundColor',
  'fontSize',
  'padding',
  'margin',
  'textAlign',
  'borderRadius',
  'width',
  'height',
  'minHeight',
  'fontFamily',
  'fontWeight',
  'display',
  'gap',
  'flexDirection',
  'alignItems',
  'justifyContent',
  'position',
  'left',
  'top',
  'zIndex',
]

function camelStyle(name: string): keyof VisualStyles | null {
  const camel = name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) as keyof VisualStyles
  return STYLE_KEYS.includes(camel) ? camel : null
}

function parseInlineStyles(styleAttr: string | null): VisualStyles {
  if (!styleAttr) return {}
  const styles: VisualStyles = {}
  for (const part of styleAttr.split(';')) {
    const [rawKey, ...rest] = part.split(':')
    if (!rawKey || rest.length === 0) continue
    const key = camelStyle(rawKey.trim())
    if (!key) continue
    const value = rest.join(':').trim()
    if (!value) continue
    ;(styles as Record<string, string>)[key] = value
  }
  return styles
}

function inferKind(el: Element): VisualKind {
  const tag = el.tagName.toLowerCase()
  if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') return 'heading'
  if (tag === 'p' || tag === 'span' || tag === 'label') return 'text'
  if (tag === 'button') return 'button'
  if (tag === 'img') return 'image'
  if (tag === 'a') return 'link'
  if (tag === 'nav') return 'nav'
  if (tag === 'form') return 'form'
  if (tag === 'input' || tag === 'textarea') return 'input'
  if (tag === 'article' || el.classList.contains('card')) return 'card'
  if (tag === 'section' || tag === 'main' || tag === 'header' || tag === 'footer') return 'section'
  return 'container'
}

function isTextHeavy(kind: VisualKind): boolean {
  return kind === 'heading' || kind === 'text' || kind === 'button' || kind === 'link'
}

function elementToNode(el: Element): VisualNode {
  const kind = inferKind(el)
  const attrs: Record<string, string> = {}
  for (const attr of Array.from(el.attributes)) {
    if (attr.name === 'style' || attr.name === 'data-httx-id') continue
    attrs[attr.name] = attr.value
  }

  const id = el.getAttribute('data-httx-id') || createNodeId(kind)
  const styles = parseInlineStyles(el.getAttribute('style'))
  const children: VisualNode[] = []

  if (isTextHeavy(kind) && el.children.length === 0) {
    return {
      id,
      kind,
      tag: el.tagName.toLowerCase(),
      text: el.textContent ?? '',
      attrs,
      styles,
      children: [],
    }
  }

  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      children.push(elementToNode(child as Element))
    }
  }

  let text: string | undefined
  if (children.length === 0 && isTextHeavy(kind)) {
    text = el.textContent ?? ''
  }

  return {
    id,
    kind,
    tag: el.tagName.toLowerCase(),
    text,
    attrs,
    styles,
    children,
  }
}

export function extractBodyHtml(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  if (bodyMatch) return bodyMatch[1].trim()
  return html.trim()
}

export function parseHtmlToVisual(html: string): VisualDocument {
  const bodyHtml = extractBodyHtml(html)
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div id="__httx_root">${bodyHtml}</div>`, 'text/html')
  const root = doc.getElementById('__httx_root')
  if (!root) return { nodes: [] }

  const nodes = Array.from(root.children).map((child) => elementToNode(child))
  return { nodes }
}
