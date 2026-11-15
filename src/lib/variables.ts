import { createNodeId } from './visual/id'
import type { DesignVariable, VariableType } from './visual/types'

export const DEFAULT_VARIABLES: DesignVariable[] = [
  { id: 'var_brand', name: 'brandName', type: 'text', value: 'Httx' },
  { id: 'var_primary', name: 'primaryColor', type: 'color', value: '#0f766e' },
  { id: 'var_title', name: 'pageTitle', type: 'text', value: '可视化工作台' },
]

export function createVariable(
  name: string,
  type: VariableType = 'text',
  value = '',
): DesignVariable {
  const safe = name.replace(/[^\w\u4e00-\u9fff]/g, '_') || 'var'
  return {
    id: createNodeId('var'),
    name: safe,
    type,
    value:
      value ||
      (type === 'color' ? '#0f766e' : type === 'number' ? '16' : type === 'url' ? 'https://' : '新变量'),
  }
}

export function varToken(name: string): string {
  return `{{${name}}}`
}

/** Replace {{name}} tokens using defined variables. Unknown tokens left as-is. */
export function resolveVariables(input: string, variables: DesignVariable[]): string {
  if (!input || !variables.length) return input
  const map = new Map(variables.map((v) => [v.name, v.value]))
  return input.replace(/\{\{\s*([a-zA-Z_][\w]*)\s*\}\}/g, (full, name: string) => {
    return map.has(name) ? String(map.get(name)) : full
  })
}

export function buildCssVars(variables: DesignVariable[]): string {
  const lines = variables
    .filter((v) => v.type === 'color' || v.type === 'number')
    .map((v) => `  --httx-${v.name}: ${v.value};`)
  if (!lines.length) return ''
  return `:root {\n${lines.join('\n')}\n}\n`
}

export function isValidVarName(name: string): boolean {
  return /^[a-zA-Z_][\w]*$/.test(name)
}
