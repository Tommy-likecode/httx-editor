import { useCallback, useEffect, useMemo, useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { ConsolePanel } from './components/ConsolePanel'
import { CdnPanel } from './components/CdnPanel'
import { LanguageTabs } from './components/LanguageTabs'
import { PreviewPane } from './components/PreviewPane'
import { ResizableSplit } from './components/ResizableSplit'
import { Toolbar } from './components/Toolbar'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { buildExportDocument, buildPreviewDocument, downloadHtmlFile } from './lib/document'
import { formatCode } from './lib/format'
import {
  clearDraft,
  DEFAULT_DRAFT,
  loadDraft,
  loadSettings,
  saveDraft,
  saveSettings,
} from './lib/storage'
import { TEMPLATES } from './lib/templates'
import type { ConsoleEntry, ConsoleLevel, DraftDocument, Language } from './types'

function createConsoleId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function App() {
  const [draft, setDraft] = useState<DraftDocument>(() => loadDraft())
  const [settings, setSettings] = useState(() => loadSettings())
  const [language, setLanguage] = useState<Language>('html')
  const [savedAt, setSavedAt] = useState<number | null>(() => loadDraft().updatedAt)
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([])
  const [consoleOpen, setConsoleOpen] = useState(true)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [fullscreenPreview, setFullscreenPreview] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const debouncedDraft = useDebouncedValue(draft, 300)
  const srcdoc = useMemo(() => buildPreviewDocument(debouncedDraft), [debouncedDraft])

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
  }, [settings.theme])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = { ...draft, updatedAt: Date.now() }
      saveDraft(next)
      setSavedAt(next.updatedAt)
    }, 800)
    return () => window.clearTimeout(timer)
  }, [draft])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const currentCode = draft[language === 'js' ? 'js' : language]

  const updateCode = useCallback(
    (value: string) => {
      setDraft((prev) => ({
        ...prev,
        [language === 'js' ? 'js' : language]: value,
      }))
    },
    [language],
  )

  const handleFormat = useCallback(() => {
    setDraft((prev) => {
      const key = language === 'js' ? 'js' : language
      return { ...prev, [key]: formatCode(language, prev[key]) }
    })
    setToast('已格式化当前标签')
  }, [language])

  const handleSave = useCallback(() => {
    const next = { ...draft, updatedAt: Date.now() }
    saveDraft(next)
    setSavedAt(next.updatedAt)
    setToast('草稿已保存到本地')
  }, [draft])

  const handleClearDraft = useCallback(() => {
    const confirmed = window.confirm('确定清空本地草稿并恢复默认示例？')
    if (!confirmed) return
    clearDraft()
    const fresh = { ...DEFAULT_DRAFT, updatedAt: Date.now() }
    setDraft(fresh)
    saveDraft(fresh)
    setSavedAt(fresh.updatedAt)
    setConsoleEntries([])
    setToast('草稿已清空')
  }, [])

  const handleExport = useCallback(() => {
    downloadHtmlFile('httx-export.html', buildExportDocument(draft))
    setToast('已导出 HTML 文件')
  }, [draft])

  const handleLoadTemplate = useCallback((id: string) => {
    const template = TEMPLATES.find((item) => item.id === id)
    if (!template) return
    setDraft({
      html: template.html,
      css: template.css,
      js: template.js,
      cdnResources: template.cdnResources ?? [],
      updatedAt: Date.now(),
    })
    setLanguage('html')
    setToast(`已加载模板：${template.name}`)
  }, [])

  const handleConsole = useCallback(
    (entry: { level: ConsoleLevel; message: string }) => {
      setConsoleEntries((prev) => [
        ...prev.slice(-199),
        {
          id: createConsoleId(),
          level: entry.level,
          message: entry.message,
          timestamp: Date.now(),
        },
      ])
      if (entry.level === 'error') setConsoleOpen(true)
    },
    [],
  )

  const clearConsole = useCallback(() => setConsoleEntries([]), [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey
      if (meta && event.key.toLowerCase() === 's') {
        event.preventDefault()
        handleSave()
      }
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        handleFormat()
      }
      if (event.key === 'Escape' && fullscreenPreview) {
        setFullscreenPreview(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [fullscreenPreview, handleFormat, handleSave])

  return (
    <div className="app-shell">
      <Toolbar
        theme={settings.theme}
        fontSize={settings.fontSize}
        savedAt={savedAt}
        onFormat={handleFormat}
        onSave={handleSave}
        onClearDraft={handleClearDraft}
        onExport={handleExport}
        onThemeToggle={() =>
          setSettings((prev) => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light',
          }))
        }
        onFontSizeChange={(fontSize) => setSettings((prev) => ({ ...prev, fontSize }))}
        onLoadTemplate={handleLoadTemplate}
        onToggleResources={() => setResourcesOpen((open) => !open)}
        resourcesOpen={resourcesOpen}
      />

      <CdnPanel
        open={resourcesOpen}
        resources={draft.cdnResources}
        onChange={(cdnResources) => setDraft((prev) => ({ ...prev, cdnResources }))}
      />

      <ResizableSplit
        ratio={settings.editorRatio}
        onRatioChange={(editorRatio) => setSettings((prev) => ({ ...prev, editorRatio }))}
        left={
          <section className="editor-pane">
            <div className="pane-header">
              <LanguageTabs active={language} onChange={setLanguage} />
              <span className="hint">Ctrl/Cmd+S 保存 · Shift+Alt+F 格式化</span>
            </div>
            <CodeEditor
              language={language}
              value={currentCode}
              onChange={updateCode}
              theme={settings.theme}
              fontSize={settings.fontSize}
            />
          </section>
        }
        right={
          <section className="preview-column">
            <PreviewPane
              srcdoc={srcdoc}
              fullscreen={fullscreenPreview}
              onToggleFullscreen={() => setFullscreenPreview((value) => !value)}
              onConsole={handleConsole}
              onClearConsole={clearConsole}
            />
            <ConsolePanel
              entries={consoleEntries}
              open={consoleOpen}
              onToggle={() => setConsoleOpen((open) => !open)}
              onClear={clearConsole}
            />
          </section>
        }
      />

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  )
}
