export type VisualKind =
  | 'section'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'link'
  | 'nav'
  | 'form'
  | 'input'
  | 'card'
  | 'container'

export interface VisualStyles {
  color?: string
  backgroundColor?: string
  fontSize?: string
  padding?: string
  margin?: string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  borderRadius?: string
  width?: string
  height?: string
  minHeight?: string
  fontFamily?: string
  fontWeight?: string
  display?: string
  gap?: string
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  position?: string
  left?: string
  top?: string
  zIndex?: string
}

export interface VisualNode {
  id: string
  kind: VisualKind
  tag: string
  text?: string
  attrs: Record<string, string>
  styles: VisualStyles
  children: VisualNode[]
}

export interface VisualDocument {
  nodes: VisualNode[]
}

export interface PaletteItem {
  kind: VisualKind
  label: string
  hint: string
}

export type EditorMode = 'visual' | 'code'
export type DevicePreset = 'desktop' | 'tablet' | 'mobile'

export type VariableType = 'text' | 'color' | 'number' | 'url'

export interface DesignVariable {
  id: string
  name: string
  type: VariableType
  value: string
}

export type DropPlacement = 'before' | 'after' | 'inside'
