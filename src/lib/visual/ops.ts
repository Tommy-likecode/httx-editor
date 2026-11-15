import { createNodeId } from './id'
import type { PaletteItem } from './types'
import type { VisualDocument, VisualKind, VisualNode } from './types'

export function createNodeFromKind(kind: VisualKind): VisualNode {
  const id = createNodeId(kind)
  switch (kind) {
    case 'heading':
      return {
        id,
        kind,
        tag: 'h1',
        text: '标题文字',
        attrs: {},
        styles: { margin: '0 0 0.75rem', fontSize: '1.75rem', color: '#0f172a' },
        children: [],
      }
    case 'text':
      return {
        id,
        kind,
        tag: 'p',
        text: '在这里编写一段说明文字。',
        attrs: {},
        styles: { margin: '0 0 1rem', color: '#334155' },
        children: [],
      }
    case 'button':
      return {
        id,
        kind,
        tag: 'button',
        text: '按钮',
        attrs: { type: 'button' },
        styles: {
          backgroundColor: '#0f766e',
          color: '#ecfdf5',
          borderRadius: '0',
          padding: '0.65rem 1.1rem',
          fontSize: '1rem',
        },
        children: [],
      }
    case 'image':
      return {
        id,
        kind,
        tag: 'img',
        attrs: {
          src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
          alt: '示例图片',
        },
        styles: { width: '100%', borderRadius: '0', display: 'block' },
        children: [],
      }
    case 'link':
      return {
        id,
        kind,
        tag: 'a',
        text: '了解更多',
        attrs: { href: '#' },
        styles: { color: '#0f766e', fontWeight: '600' },
        children: [],
      }
    case 'nav':
      return {
        id,
        kind,
        tag: 'nav',
        attrs: {},
        styles: {
          display: 'flex',
          gap: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
        },
        children: [
          {
            id: createNodeId('link'),
            kind: 'link',
            tag: 'a',
            text: '首页',
            attrs: { href: '#' },
            styles: { color: '#5eead4' },
            children: [],
          },
          {
            id: createNodeId('link'),
            kind: 'link',
            tag: 'a',
            text: '产品',
            attrs: { href: '#' },
            styles: { color: '#e2e8f0' },
            children: [],
          },
          {
            id: createNodeId('link'),
            kind: 'link',
            tag: 'a',
            text: '关于',
            attrs: { href: '#' },
            styles: { color: '#e2e8f0' },
            children: [],
          },
        ],
      }
    case 'form':
      return {
        id,
        kind,
        tag: 'form',
        attrs: {},
        styles: {
          display: 'grid',
          gap: '0.75rem',
          padding: '1.25rem',
          backgroundColor: '#ffffff',
          borderRadius: '0',
          width: 'min(360px, 100%)',
        },
        children: [
          {
            id: createNodeId('heading'),
            kind: 'heading',
            tag: 'h2',
            text: '登录',
            attrs: {},
            styles: { margin: '0', fontSize: '1.35rem' },
            children: [],
          },
          {
            id: createNodeId('input'),
            kind: 'input',
            tag: 'input',
            attrs: { type: 'email', placeholder: '邮箱', required: 'true' },
            styles: { padding: '0.65rem', borderRadius: '0' },
            children: [],
          },
          {
            id: createNodeId('input'),
            kind: 'input',
            tag: 'input',
            attrs: { type: 'password', placeholder: '密码', required: 'true' },
            styles: { padding: '0.65rem', borderRadius: '0' },
            children: [],
          },
          {
            id: createNodeId('button'),
            kind: 'button',
            tag: 'button',
            text: '提交',
            attrs: { type: 'submit' },
            styles: {
              backgroundColor: '#0f766e',
              color: '#fff',
              padding: '0.7rem',
              borderRadius: '0',
            },
            children: [],
          },
        ],
      }
    case 'card':
      return {
        id,
        kind,
        tag: 'article',
        attrs: { class: 'card' },
        styles: {
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          borderRadius: '0',
          width: 'min(380px, 100%)',
        },
        children: [
          {
            id: createNodeId('text'),
            kind: 'text',
            tag: 'p',
            text: 'HTTX',
            attrs: {},
            styles: { margin: '0 0 0.5rem', color: '#0f766e', fontWeight: '700' },
            children: [],
          },
          {
            id: createNodeId('heading'),
            kind: 'heading',
            tag: 'h2',
            text: '产品卡片',
            attrs: {},
            styles: { margin: '0 0 0.5rem', fontSize: '1.4rem' },
            children: [],
          },
          {
            id: createNodeId('text'),
            kind: 'text',
            tag: 'p',
            text: '拖拽组件，调整属性，右侧即时预览。',
            attrs: {},
            styles: { margin: '0 0 1rem', color: '#64748b' },
            children: [],
          },
          {
            id: createNodeId('button'),
            kind: 'button',
            tag: 'button',
            text: '了解更多',
            attrs: { type: 'button' },
            styles: { backgroundColor: '#0f766e', color: '#ecfdf5', padding: '0.6rem 1rem' },
            children: [],
          },
        ],
      }
    case 'section':
      return {
        id,
        kind,
        tag: 'section',
        attrs: {},
        styles: {
          padding: '2rem',
          backgroundColor: '#f8fafc',
          width: '100%',
        },
        children: [
          {
            id: createNodeId('heading'),
            kind: 'heading',
            tag: 'h2',
            text: '区块标题',
            attrs: {},
            styles: { margin: '0 0 0.75rem' },
            children: [],
          },
          {
            id: createNodeId('text'),
            kind: 'text',
            tag: 'p',
            text: '这是一个可编辑的内容区块。',
            attrs: {},
            styles: { margin: '0', color: '#475569' },
            children: [],
          },
        ],
      }
    case 'input':
      return {
        id,
        kind,
        tag: 'input',
        attrs: { type: 'text', placeholder: '输入内容' },
        styles: { padding: '0.65rem 0.75rem', width: '100%' },
        children: [],
      }
    case 'container':
    default:
      return {
        id,
        kind: 'container',
        tag: 'div',
        attrs: {},
        styles: {
          display: 'grid',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: '#ffffff',
        },
        children: [],
      }
  }
}

export const PALETTE: PaletteItem[] = [
  { kind: 'heading', label: '标题', hint: 'H1–H3 标题' },
  { kind: 'text', label: '文本', hint: '段落说明' },
  { kind: 'button', label: '按钮', hint: '可点击按钮' },
  { kind: 'image', label: '图片', hint: '图片 URL' },
  { kind: 'link', label: '链接', hint: '超链接' },
  { kind: 'nav', label: '导航', hint: '顶部导航' },
  { kind: 'form', label: '表单', hint: '登录表单' },
  { kind: 'card', label: '卡片', hint: '内容卡片' },
  { kind: 'section', label: '区块', hint: '页面分区' },
  { kind: 'container', label: '容器', hint: '可嵌套容器' },
]

function mapNodes(nodes: VisualNode[], mapper: (node: VisualNode) => VisualNode | null): VisualNode[] {
  const result: VisualNode[] = []
  for (const node of nodes) {
    const next = mapper({
      ...node,
      children: mapNodes(node.children, mapper),
    })
    if (next) result.push(next)
  }
  return result
}

export function findNode(doc: VisualDocument, id: string): VisualNode | null {
  const stack = [...doc.nodes]
  while (stack.length) {
    const node = stack.pop()!
    if (node.id === id) return node
    stack.push(...node.children)
  }
  return null
}

export function updateNode(
  doc: VisualDocument,
  id: string,
  updater: (node: VisualNode) => VisualNode,
): VisualDocument {
  return {
    nodes: mapNodes(doc.nodes, (node) => (node.id === id ? updater(node) : node)),
  }
}

export function deleteNode(doc: VisualDocument, id: string): VisualDocument {
  return {
    nodes: mapNodes(doc.nodes, (node) => (node.id === id ? null : node)),
  }
}

export function duplicateNode(doc: VisualDocument, id: string): VisualDocument {
  const cloneDeep = (node: VisualNode): VisualNode => ({
    ...node,
    id: createNodeId(node.kind),
    attrs: { ...node.attrs },
    styles: { ...node.styles },
    children: node.children.map(cloneDeep),
  })

  const insertAfter = (nodes: VisualNode[]): VisualNode[] => {
    const out: VisualNode[] = []
    for (const node of nodes) {
      const withKids = { ...node, children: insertAfter(node.children) }
      out.push(withKids)
      if (node.id === id) out.push(cloneDeep(node))
    }
    return out
  }

  return { nodes: insertAfter(doc.nodes) }
}

export function appendNode(doc: VisualDocument, node: VisualNode, parentId?: string | null): VisualDocument {
  if (!parentId) {
    return { nodes: [...doc.nodes, node] }
  }

  return updateNode(doc, parentId, (parent) => ({
    ...parent,
    children: [...parent.children, node],
  }))
}

export function moveNode(
  doc: VisualDocument,
  id: string,
  direction: 'up' | 'down',
): VisualDocument {
  const reorder = (nodes: VisualNode[]): VisualNode[] => {
    const index = nodes.findIndex((n) => n.id === id)
    if (index >= 0) {
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= nodes.length) return nodes
      const copy = [...nodes]
      const [item] = copy.splice(index, 1)
      copy.splice(target, 0, item)
      return copy
    }
    return nodes.map((n) => ({ ...n, children: reorder(n.children) }))
  }
  return { nodes: reorder(doc.nodes) }
}

export function canAcceptChildren(node: VisualNode): boolean {
  return (
    node.kind === 'container' ||
    node.kind === 'section' ||
    node.kind === 'card' ||
    node.kind === 'form' ||
    node.kind === 'nav' ||
    ['div', 'section', 'main', 'article', 'form', 'nav', 'header', 'footer'].includes(node.tag)
  )
}

export function getParentId(doc: VisualDocument, id: string): string | null {
  const search = (nodes: VisualNode[], parent: string | null): string | null | undefined => {
    for (const node of nodes) {
      if (node.id === id) return parent
      const child = search(node.children, node.id)
      if (child !== undefined) return child
    }
    return undefined
  }
  const result = search(doc.nodes, null)
  return result === undefined ? null : result
}

export function getNodePath(doc: VisualDocument, id: string): VisualNode[] {
  const path: VisualNode[] = []
  const walk = (nodes: VisualNode[]): boolean => {
    for (const node of nodes) {
      path.push(node)
      if (node.id === id) return true
      if (walk(node.children)) return true
      path.pop()
    }
    return false
  }
  walk(doc.nodes)
  return path
}

function extractNode(
  nodes: VisualNode[],
  id: string,
): { nodes: VisualNode[]; extracted: VisualNode | null } {
  const result: VisualNode[] = []
  let extracted: VisualNode | null = null
  for (const node of nodes) {
    if (node.id === id) {
      extracted = node
      continue
    }
    const childResult = extractNode(node.children, id)
    if (childResult.extracted) extracted = childResult.extracted
    result.push({ ...node, children: childResult.nodes })
  }
  return { nodes: result, extracted }
}

function insertAt(
  nodes: VisualNode[],
  targetId: string | null,
  placement: 'before' | 'after' | 'inside',
  node: VisualNode,
): VisualNode[] {
  if (!targetId) {
    return placement === 'before' ? [node, ...nodes] : [...nodes, node]
  }

  const out: VisualNode[] = []
  for (const current of nodes) {
    if (current.id === targetId) {
      if (placement === 'before') {
        out.push(node, current)
      } else if (placement === 'after') {
        out.push(current, node)
      } else {
        out.push({ ...current, children: [...current.children, node] })
      }
      continue
    }
    out.push({
      ...current,
      children: insertAt(current.children, targetId, placement, node),
    })
  }
  return out
}

/** Move a node before/after/inside another node (or to root). */
export function relocateNode(
  doc: VisualDocument,
  sourceId: string,
  targetId: string | null,
  placement: 'before' | 'after' | 'inside',
): VisualDocument {
  if (sourceId === targetId) return doc
  if (targetId) {
    const path = getNodePath(doc, targetId)
    if (path.some((n) => n.id === sourceId)) return doc // prevent drop into self/descendant
  }

  const extracted = extractNode(doc.nodes, sourceId)
  if (!extracted.extracted) return doc

  if (placement === 'inside' && targetId) {
    const target = findNode({ nodes: extracted.nodes }, targetId) || findNode(doc, targetId)
    if (target && !canAcceptChildren(target)) return doc
  }

  return {
    nodes: insertAt(extracted.nodes, targetId, placement, extracted.extracted),
  }
}

export function wrapInContainer(doc: VisualDocument, id: string): VisualDocument {
  const node = findNode(doc, id)
  if (!node) return doc
  const wrapper = createNodeFromKind('container')
  wrapper.children = [{ ...node }]
  wrapper.styles = {
    ...wrapper.styles,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
    minHeight: '48px',
  }

  const replace = (nodes: VisualNode[]): VisualNode[] =>
    nodes.map((n) => {
      if (n.id === id) return wrapper
      return { ...n, children: replace(n.children) }
    })

  return { nodes: replace(doc.nodes) }
}

export function unwrapContainer(doc: VisualDocument, id: string): VisualDocument {
  const node = findNode(doc, id)
  if (!node || !canAcceptChildren(node) || node.children.length === 0) return doc

  const replace = (nodes: VisualNode[]): VisualNode[] => {
    const out: VisualNode[] = []
    for (const n of nodes) {
      if (n.id === id) {
        out.push(...n.children)
      } else {
        out.push({ ...n, children: replace(n.children) })
      }
    }
    return out
  }

  return { nodes: replace(doc.nodes) }
}

export function flattenTree(doc: VisualDocument): { node: VisualNode; depth: number }[] {
  const rows: { node: VisualNode; depth: number }[] = []
  const walk = (nodes: VisualNode[], depth: number) => {
    for (const node of nodes) {
      rows.push({ node, depth })
      walk(node.children, depth + 1)
    }
  }
  walk(doc.nodes, 0)
  return rows
}
