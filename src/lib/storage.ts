import type { DraftDocument, EditorSettings } from '../types'

const DRAFT_KEY = 'httx.draft.v1'
const SETTINGS_KEY = 'httx.settings.v1'

export const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>Httx 预览</title>
</head>
<body>
  <main class="hero">
    <h1>你好，Httx</h1>
    <p>在左侧编辑 HTML / CSS / JS，右侧即时预览。</p>
    <button id="btn">点我计数</button>
    <p id="count">0</p>
  </main>
</body>
</html>`

export const DEFAULT_CSS = `* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  background:
    radial-gradient(circle at top left, #ccfbf1 0%, transparent 45%),
    linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%);
  color: #0f172a;
  display: grid;
  place-items: center;
}

.hero {
  width: min(420px, 92vw);
  padding: 2rem;
  border: 1px solid #99f6e4;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
}

p {
  margin: 0 0 1rem;
  line-height: 1.6;
  color: #334155;
}

button {
  appearance: none;
  border: 0;
  background: #0f766e;
  color: #ecfdf5;
  padding: 0.65rem 1.1rem;
  font: inherit;
  cursor: pointer;
}

button:hover {
  background: #115e59;
}

#count {
  margin-top: 1rem;
  font-family: "IBM Plex Mono", monospace;
  font-size: 1.5rem;
  color: #0f766e;
}`

export const DEFAULT_JS = `const btn = document.getElementById('btn')
const count = document.getElementById('count')
let n = 0

btn?.addEventListener('click', () => {
  n += 1
  count.textContent = String(n)
  console.log('计数更新:', n)
})`

export const DEFAULT_DRAFT: DraftDocument = {
  html: DEFAULT_HTML,
  css: DEFAULT_CSS,
  js: DEFAULT_JS,
  cdnResources: [],
  updatedAt: Date.now(),
}

export const DEFAULT_SETTINGS: EditorSettings = {
  theme: 'light',
  fontSize: 14,
  editorRatio: 0.5,
}

export function loadDraft(): DraftDocument {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return { ...DEFAULT_DRAFT, updatedAt: Date.now() }
    const parsed = JSON.parse(raw) as Partial<DraftDocument>
    return {
      html: typeof parsed.html === 'string' ? parsed.html : DEFAULT_HTML,
      css: typeof parsed.css === 'string' ? parsed.css : DEFAULT_CSS,
      js: typeof parsed.js === 'string' ? parsed.js : DEFAULT_JS,
      cdnResources: Array.isArray(parsed.cdnResources)
        ? parsed.cdnResources.filter((item): item is string => typeof item === 'string')
        : [],
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
    }
  } catch {
    return { ...DEFAULT_DRAFT, updatedAt: Date.now() }
  }
}

export function saveDraft(draft: DraftDocument): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY)
}

export function loadSettings(): EditorSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<EditorSettings>
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      fontSize:
        typeof parsed.fontSize === 'number' && parsed.fontSize >= 12 && parsed.fontSize <= 22
          ? parsed.fontSize
          : DEFAULT_SETTINGS.fontSize,
      editorRatio:
        typeof parsed.editorRatio === 'number' &&
        parsed.editorRatio >= 0.25 &&
        parsed.editorRatio <= 0.75
          ? parsed.editorRatio
          : DEFAULT_SETTINGS.editorRatio,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: EditorSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
