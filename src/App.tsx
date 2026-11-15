import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CodeEditor } from './components/CodeEditor'
import { ComponentPalette } from './components/ComponentPalette'
import { ConsolePanel } from './components/ConsolePanel'
import { CdnPanel } from './components/CdnPanel'
import { GenerateBar } from './components/GenerateBar'
import { GuideBanner } from './components/GuideBanner'
import { HistoryPanel } from './components/HistoryPanel'
import { LanguageTabs } from './components/LanguageTabs'
import { PreviewPane } from './components/PreviewPane'
import { PropertyPanel } from './components/PropertyPanel'
import { ResizableSplit } from './components/ResizableSplit'
import { Toolbar } from './components/Toolbar'
import { VisualCanvas } from './components/VisualCanvas'
import { useDebouncedValue } from './hooks/useDebouncedValue'
import { explainJsError } from './lib/errors-zh'
import { clearHistory, loadHistory, pushHistory, type HistoryEntry } from './lib/history'
import { buildExportDocument, buildPreviewDocument, downloadHtmlFile } from './lib/document'
import { formatCode } from './lib/format'
import { generateFromPrompt } from './lib/nl'
import {
  clearDraft,
  DEFAULT_DRAFT,
  loadDraft,
  loadSettings,
  saveDraft,
  saveSettings,
} from './lib/storage'
import { TEMPLATES } from './lib/templates'
import {
  appendNode,
  createNodeFromKind,
  deleteNode,
  duplicateNode,
  findNode,
  moveNode,
  relocateNode,
  updateNode,
  wrapInContainer,
  unwrapContainer,
} from './lib/visual/ops'
import { parseHtmlToVisual } from './lib/visual/parse'
import { serializeVisualToHtml } from './lib/visual/serialize'
import type {
  DropPlacement,
  EditorMode,
  VisualDocument,
  VisualKind,
  VisualNode,
} from './lib/visual/types'
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
  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [fullscreenPreview, setFullscreenPreview] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [visualDoc, setVisualDoc] = useState<VisualDocument>(() => parseHtmlToVisual(loadDraft().html))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const lastVisualHtml = useRef<string>('')

  const debouncedDraft = useDebouncedValue(draft, 300)
  const srcdoc = useMemo(() => buildPreviewDocument(debouncedDraft), [debouncedDraft])
  const selectedNode = selectedId ? findNode(visualDoc, selectedId) : null

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
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  // Code → Visual sync when HTML changes outside visual ops
  useEffect(() => {
    if (draft.html === lastVisualHtml.current) return
    setVisualDoc(parseHtmlToVisual(draft.html))
  }, [draft.html])

  const applyVisualDoc = useCallback((nextDoc: VisualDocument, toastMsg?: string) => {
    setVisualDoc(nextDoc)
    setDraft((prev) => {
      const html = serializeVisualToHtml(prev.html, nextDoc)
      lastVisualHtml.current = html
      return { ...prev, html }
    })
    if (toastMsg) setToast(toastMsg)
  }, [])

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
    setHistory(pushHistory(next, '手动保存'))
    setToast('草稿已保存，并写入版本历史')
  }, [draft])

  const handleClearDraft = useCallback(() => {
    const confirmed = window.confirm('确定清空本地草稿并恢复默认示例？')
    if (!confirmed) return
    clearDraft()
    const fresh = { ...DEFAULT_DRAFT, updatedAt: Date.now() }
    setDraft(fresh)
    saveDraft(fresh)
    setSavedAt(fresh.updatedAt)
    setVisualDoc(parseHtmlToVisual(fresh.html))
    setSelectedId(null)
    setConsoleEntries([])
    setToast('草稿已清空')
  }, [])

  const handleExport = useCallback(() => {
    downloadHtmlFile('httx-export.html', buildExportDocument(draft))
    setToast('已导出 HTML 文件')
  }, [draft])

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || '')
      setDraft((prev) => ({
        ...prev,
        html: text,
        updatedAt: Date.now(),
      }))
      setSettings((prev) => ({ ...prev, mode: 'visual' }))
      setToast(`已导入：${file.name}`)
    }
    reader.readAsText(file)
  }, [])

  const handleLoadTemplate = useCallback((id: string) => {
    const template = TEMPLATES.find((item) => item.id === id)
    if (!template) return
    const next: DraftDocument = {
      html: template.html,
      css: template.css,
      js: template.js,
      cdnResources: template.cdnResources ?? [],
      variables: draft.variables,
      updatedAt: Date.now(),
    }
    setDraft(next)
    setLanguage('html')
    setSelectedId(null)
    setHistory(pushHistory(next, `模板：${template.name}`))
    setToast(`已加载模板：${template.name}`)
  }, [draft.variables])

  const handleConsole = useCallback((entry: { level: ConsoleLevel; message: string }) => {
    setConsoleEntries((prev) => [
      ...prev.slice(-199),
      {
        id: createConsoleId(),
        level: entry.level,
        message: entry.message,
        hint: entry.level === 'error' ? explainJsError(entry.message) : undefined,
        timestamp: Date.now(),
      },
    ])
    if (entry.level === 'error') setConsoleOpen(true)
  }, [])

  const clearConsole = useCallback(() => setConsoleEntries([]), [])

  const handleAddKind = useCallback(
    (kind: VisualKind, targetId: string | null = null, placement: DropPlacement = 'after') => {
      const node = createNodeFromKind(kind)
      if (!targetId) {
        applyVisualDoc(appendNode(visualDoc, node), `已添加：${kind}`)
      } else if (placement === 'inside') {
        applyVisualDoc(appendNode(visualDoc, node, targetId), `已添加进容器：${kind}`)
      } else {
        applyVisualDoc(relocateNode(appendNode(visualDoc, node), node.id, targetId, placement), `已添加：${kind}`)
      }
      setSelectedId(node.id)
    },
    [applyVisualDoc, visualDoc],
  )

  const handleRelocate = useCallback(
    (sourceId: string, targetId: string | null, placement: DropPlacement) => {
      applyVisualDoc(relocateNode(visualDoc, sourceId, targetId, placement), '已移动元素')
      setSelectedId(sourceId)
    },
    [applyVisualDoc, visualDoc],
  )

  const handleFreeMove = useCallback(
    (id: string, left: number, top: number) => {
      applyVisualDoc(
        updateNode(visualDoc, id, (node) => ({
          ...node,
          styles: {
            ...node.styles,
            position: node.styles.position || 'relative',
            left: `${left}px`,
            top: `${top}px`,
          },
        })),
      )
    },
    [applyVisualDoc, visualDoc],
  )

  const handleResize = useCallback(
    (id: string, width: number, height: number) => {
      applyVisualDoc(
        updateNode(visualDoc, id, (node) => ({
          ...node,
          styles: {
            ...node.styles,
            width: `${width}px`,
            height: `${height}px`,
          },
        })),
      )
    },
    [applyVisualDoc, visualDoc],
  )

  const handleInsertSnippet = useCallback(
    (html: string, name: string) => {
      const bodyMatch = draft.html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      const currentBody = bodyMatch?.[1]?.trim() ?? draft.html
      const nextBody = `${currentBody}\n${html}`
      const nextHtml = draft.html.replace(
        /<body([^>]*)>[\s\S]*?<\/body>/i,
        `<body$1>\n${nextBody}\n</body>`,
      )
      setDraft((prev) => ({ ...prev, html: nextHtml }))
      setToast(`已插入片段：${name}`)
    },
    [draft.html],
  )

  const handleGenerate = useCallback(
    (prompt: string) => {
      const result = generateFromPrompt(prompt)
      if (!result.matched) {
        setToast(result.tip)
        return
      }
      const generated = parseHtmlToVisual(`<body>${result.htmlSnippet}</body>`)
      const merged: VisualDocument = {
        nodes: [...visualDoc.nodes, ...generated.nodes],
      }
      applyVisualDoc(merged, result.tip)
      if (generated.nodes[0]) setSelectedId(generated.nodes[0].id)
      setSettings((prev) => ({ ...prev, mode: 'visual' }))
    },
    [applyVisualDoc, visualDoc.nodes],
  )

  const handleNodeChange = useCallback(
    (node: VisualNode) => {
      applyVisualDoc(updateNode(visualDoc, node.id, () => node))
    },
    [applyVisualDoc, visualDoc],
  )

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
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId && settings.mode === 'visual') {
        const target = event.target as HTMLElement | null
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return
        }
        event.preventDefault()
        applyVisualDoc(deleteNode(visualDoc, selectedId), '已删除选中元素')
        setSelectedId(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    applyVisualDoc,
    fullscreenPreview,
    handleFormat,
    handleSave,
    selectedId,
    settings.mode,
    visualDoc,
  ])

  const mode: EditorMode = settings.mode

  return (
    <div className="app-shell">
      <Toolbar
        mode={mode}
        theme={settings.theme}
        fontSize={settings.fontSize}
        savedAt={savedAt}
        resourcesOpen={resourcesOpen}
        historyOpen={historyOpen}
        onModeChange={(next) => setSettings((prev) => ({ ...prev, mode: next }))}
        onFormat={handleFormat}
        onSave={handleSave}
        onClearDraft={handleClearDraft}
        onExport={handleExport}
        onImport={handleImport}
        onThemeToggle={() =>
          setSettings((prev) => ({
            ...prev,
            theme: prev.theme === 'light' ? 'dark' : 'light',
          }))
        }
        onFontSizeChange={(fontSize) => setSettings((prev) => ({ ...prev, fontSize }))}
        onLoadTemplate={handleLoadTemplate}
        onToggleResources={() => setResourcesOpen((open) => !open)}
        onToggleHistory={() => setHistoryOpen((open) => !open)}
      />

      <GuideBanner
        visible={!settings.guideDismissed && mode === 'visual'}
        onDismiss={() => setSettings((prev) => ({ ...prev, guideDismissed: true }))}
      />

      <GenerateBar onGenerate={handleGenerate} />

      <CdnPanel
        open={resourcesOpen}
        resources={draft.cdnResources}
        onChange={(cdnResources) => setDraft((prev) => ({ ...prev, cdnResources }))}
      />

      <HistoryPanel
        open={historyOpen}
        entries={history}
        onRestore={(entry) => {
          setDraft(entry.draft)
          setSelectedId(null)
          setToast(`已恢复：${entry.label}`)
        }}
        onSnapshot={() => {
          setHistory(pushHistory(draft, '手动快照'))
          setToast('已创建版本快照')
        }}
        onClear={() => {
          clearHistory()
          setHistory([])
          setToast('版本历史已清空')
        }}
        onClose={() => setHistoryOpen(false)}
      />

      <ResizableSplit
        ratio={settings.editorRatio}
        onRatioChange={(editorRatio) => setSettings((prev) => ({ ...prev, editorRatio }))}
        left={
          mode === 'visual' ? (
            <section className="visual-workbench" data-testid="visual-workbench">
              <ComponentPalette
                onAdd={(kind) => handleAddKind(kind)}
                onInsertSnippet={handleInsertSnippet}
                variables={draft.variables}
                onVariablesChange={(variables) => setDraft((prev) => ({ ...prev, variables }))}
                onInsertVariableToken={(token) => {
                  if (!selectedNode || selectedNode.text === undefined) {
                    setToast('请先选中带文本的元素，再插入变量')
                    return
                  }
                  handleNodeChange({
                    ...selectedNode,
                    text: `${selectedNode.text || ''}${token}`,
                  })
                }}
              />
              <VisualCanvas
                doc={visualDoc}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onDropKind={(kind, targetId, placement) =>
                  handleAddKind(kind as VisualKind, targetId, placement)
                }
                onRelocate={handleRelocate}
                onFreeMove={handleFreeMove}
                onResize={handleResize}
              />
              <PropertyPanel
                node={selectedNode}
                variables={draft.variables}
                onChange={handleNodeChange}
                onDelete={() => {
                  if (!selectedId) return
                  applyVisualDoc(deleteNode(visualDoc, selectedId), '已删除选中元素')
                  setSelectedId(null)
                }}
                onDuplicate={() => {
                  if (!selectedId) return
                  applyVisualDoc(duplicateNode(visualDoc, selectedId), '已复制选中元素')
                }}
                onMove={(direction) => {
                  if (!selectedId) return
                  applyVisualDoc(moveNode(visualDoc, selectedId, direction))
                }}
                onWrap={() => {
                  if (!selectedId) return
                  const next = wrapInContainer(visualDoc, selectedId)
                  applyVisualDoc(next, '已成组为容器')
                }}
                onUnwrap={() => {
                  if (!selectedId) return
                  applyVisualDoc(unwrapContainer(visualDoc, selectedId), '已解组容器')
                }}
              />
            </section>
          ) : (
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
          )
        }
        right={
          <section className="preview-column">
            <PreviewPane
              srcdoc={srcdoc}
              device={settings.device}
              onDeviceChange={(device) => setSettings((prev) => ({ ...prev, device }))}
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
