import type { DraftDocument } from '../types'

const HISTORY_KEY = 'httx.history.v1'
const MAX_ENTRIES = 20

export interface HistoryEntry {
  id: string
  label: string
  createdAt: number
  draft: DraftDocument
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as HistoryEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function pushHistory(draft: DraftDocument, label = '自动快照'): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    label,
    createdAt: Date.now(),
    draft: structuredClone(draft),
  }
  const next = [entry, ...loadHistory()].slice(0, MAX_ENTRIES)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return next
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}
