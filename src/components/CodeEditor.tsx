import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView } from '@codemirror/view'
import { closeBrackets } from '@codemirror/autocomplete'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { keymap } from '@codemirror/view'
import type { Language, ThemeMode } from '../types'

interface CodeEditorProps {
  language: Language
  value: string
  onChange: (value: string) => void
  theme: ThemeMode
  fontSize: number
}

function languageExtension(language: Language) {
  switch (language) {
    case 'html':
      return html()
    case 'css':
      return css()
    case 'js':
      return javascript()
  }
}

export function CodeEditor({ language, value, onChange, theme, fontSize }: CodeEditorProps) {
  return (
    <div className="code-editor" style={{ fontSize }}>
      <CodeMirror
        value={value}
        height="100%"
        theme={theme}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
        }}
        extensions={[
          languageExtension(language),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          EditorView.lineWrapping,
        ]}
        onChange={onChange}
      />
    </div>
  )
}
