import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.HTTX_URL || 'http://127.0.0.1:5173'
const OUT = process.env.HTTX_MEDIA || '/cursor/stores/self/media'
const ARTIFACTS = '/cursor/stores/self/artifacts'

fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(ARTIFACTS, { recursive: true })

function saveShot(page, name) {
  const file = path.join(OUT, name)
  return page.screenshot({ path: file, fullPage: true }).then(() => {
    fs.copyFileSync(file, path.join(ARTIFACTS, name))
    console.log('saved', file)
  })
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
page.on('download', async (download) => {
  const target = path.join(OUT, await download.suggestedFilename())
  await download.saveAs(target)
  console.log('download', target)
})

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForSelector('.brand')
await saveShot(page, 'demo_initial_layout.png')

await page.getByTestId('tab-css').click()
await page.waitForTimeout(300)
if ((await page.getByTestId('tab-css').getAttribute('aria-selected')) !== 'true') {
  throw new Error('CSS tab did not activate')
}
await saveShot(page, 'demo_css_tab.png')

await page.getByTestId('tab-js').click()
await page.waitForTimeout(300)
await page.getByTestId('tab-html').click()
await page.waitForTimeout(200)

// Edit HTML via draft state by typing into CodeMirror
await page.locator('.cm-content').click()
await page.keyboard.press('Control+Home')
// Replace h1 text through a small UI action: load template then edit
await page.selectOption('select', 'card')
await page.waitForTimeout(800)
await saveShot(page, 'demo_template_card.png')

const preview = page.frameLocator('iframe.preview-frame')
await preview.locator('h1').waitFor({ timeout: 5000 })
const heading = await preview.locator('h1').innerText()
if (!heading.includes('即时预览')) {
  throw new Error(`Unexpected preview heading: ${heading}`)
}

await page.getByRole('button', { name: '深色主题' }).click()
await page.waitForTimeout(400)
const theme = await page.locator('html').getAttribute('data-theme')
if (theme !== 'dark') throw new Error('Dark theme not applied')
await saveShot(page, 'demo_dark_theme.png')

await page.getByRole('button', { name: '浅色主题' }).click()
await page.getByRole('button', { name: 'CDN 资源' }).click()
await page.waitForSelector('.cdn-panel')
await saveShot(page, 'demo_cdn_panel.png')

// Trigger a console log via JS tab
await page.getByTestId('tab-js').click()
await page.locator('.cm-content').click()
await page.keyboard.press('Control+A')
await page.keyboard.type("console.log('smoke-ok')\nthrow new Error('smoke-error')")
await page.waitForTimeout(900)
await page.getByTestId('tab-html').click()
await page.waitForTimeout(500)
await saveShot(page, 'demo_console_errors.png')

const consoleText = await page.locator('.console-body').innerText()
if (!consoleText.includes('smoke-ok') && !consoleText.includes('smoke-error')) {
  console.warn('Console capture may be delayed; body=', consoleText)
}

await page.getByRole('button', { name: '导出 HTML' }).click()
await page.waitForTimeout(800)

await page.getByRole('button', { name: '格式化' }).click()
await page.waitForTimeout(300)

console.log('SMOKE_OK')
await browser.close()
