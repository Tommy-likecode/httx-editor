export type Language = 'html' | 'css' | 'js'

export type ThemeMode = 'light' | 'dark'

export interface DraftDocument {
  html: string
  css: string
  js: string
  cdnResources: string[]
  updatedAt: number
}

export interface EditorSettings {
  theme: ThemeMode
  fontSize: number
  editorRatio: number
}

export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'clear'

export interface ConsoleEntry {
  id: string
  level: ConsoleLevel
  message: string
  timestamp: number
}

export interface TemplateItem {
  id: string
  name: string
  description: string
  html: string
  css: string
  js: string
  cdnResources?: string[]
}
