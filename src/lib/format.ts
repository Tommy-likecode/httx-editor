import { html as beautifyHtml, css as beautifyCss, js as beautifyJs } from 'js-beautify'
import type { Language } from '../types'

export function formatCode(language: Language, code: string): string {
  switch (language) {
    case 'html':
      return beautifyHtml(code, {
        indent_size: 2,
        wrap_line_length: 100,
        preserve_newlines: true,
        max_preserve_newlines: 2,
        end_with_newline: true,
      })
    case 'css':
      return beautifyCss(code, {
        indent_size: 2,
        end_with_newline: true,
      })
    case 'js':
      return beautifyJs(code, {
        indent_size: 2,
        end_with_newline: true,
      })
  }
}
