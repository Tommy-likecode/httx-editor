import type { DraftDocument } from '../types'

const BRIDGE_SCRIPT = `
<script>
(function () {
  function serialize(value) {
    try {
      if (typeof value === 'string') return value;
      if (value instanceof Error) return value.stack || value.message;
      return JSON.stringify(value, null, 2);
    } catch (err) {
      return String(value);
    }
  }

  function post(level, args) {
    parent.postMessage({
      source: 'httx-preview',
      type: 'console',
      level: level,
      message: Array.from(args).map(serialize).join(' ')
    }, '*');
  }

  ;['log', 'info', 'warn', 'error'].forEach(function (level) {
    var original = console[level].bind(console);
    console[level] = function () {
      post(level, arguments);
      return original.apply(console, arguments);
    };
  });

  window.addEventListener('error', function (event) {
    parent.postMessage({
      source: 'httx-preview',
      type: 'runtime-error',
      message: event.message + (event.filename ? ' @ ' + event.filename + ':' + event.lineno : '')
    }, '*');
  });

  window.addEventListener('unhandledrejection', function (event) {
    parent.postMessage({
      source: 'httx-preview',
      type: 'runtime-error',
      message: 'Unhandled rejection: ' + serialize(event.reason)
    }, '*');
  });
})();
</script>`

function extractBodyInner(html: string): { headExtra: string; body: string } {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)

  if (bodyMatch) {
    return {
      headExtra: headMatch?.[1]?.trim() ?? '',
      body: bodyMatch[1].trim(),
    }
  }

  return { headExtra: '', body: html }
}

function buildCdnTags(resources: string[]): string {
  return resources
    .map((url) => url.trim())
    .filter(Boolean)
    .map((url) => {
      if (/\.css(\?|$)/i.test(url) || url.includes('fonts.googleapis.com')) {
        return `<link rel="stylesheet" href="${url}" />`
      }
      return `<script src="${url}"><\/script>`
    })
    .join('\n')
}

export function buildPreviewDocument(draft: DraftDocument): string {
  const { headExtra, body } = extractBodyInner(draft.html)
  const cdnTags = buildCdnTags(draft.cdnResources)

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
${cdnTags}
${headExtra}
<style>
${draft.css}
</style>
${BRIDGE_SCRIPT}
</head>
<body>
${body}
<script>
try {
${draft.js}
} catch (err) {
  console.error(err);
}
<\/script>
</body>
</html>`
}

export function buildExportDocument(draft: DraftDocument): string {
  const { headExtra, body } = extractBodyInner(draft.html)
  const cdnTags = buildCdnTags(draft.cdnResources)

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Httx Export</title>
${cdnTags}
${headExtra}
<style>
${draft.css}
</style>
</head>
<body>
${body}
<script>
${draft.js}
<\/script>
</body>
</html>
`
}

export function downloadHtmlFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
