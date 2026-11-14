import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.HTTX_URL || 'http://127.0.0.1:5173'
const OUT = process.env.HTTX_MEDIA || '/cursor/stores/self/media'
const ARTIFACTS = '/cursor/stores/self/artifacts'
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(ARTIFACTS, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
})
const page = await context.newPage()

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForSelector('.brand')
await page.waitForTimeout(800)

await page.getByTestId('tab-css').click()
await page.waitForTimeout(600)
await page.getByTestId('tab-js').click()
await page.waitForTimeout(600)
await page.getByTestId('tab-html').click()
await page.waitForTimeout(400)

await page.selectOption('select', 'card')
await page.waitForTimeout(1200)

await page.getByRole('button', { name: '深色主题' }).click()
await page.waitForTimeout(900)
await page.getByRole('button', { name: '浅色主题' }).click()
await page.waitForTimeout(600)

await page.getByRole('button', { name: 'CDN 资源' }).click()
await page.waitForTimeout(700)
await page.getByRole('button', { name: 'CDN 资源' }).click()
await page.waitForTimeout(400)

await page.getByTestId('tab-js').click()
await page.locator('.cm-content').click()
await page.keyboard.press('Control+A')
await page.keyboard.type("console.log('demo walkthrough')\nconsole.error('demo runtime note')")
await page.waitForTimeout(1200)

await page.getByRole('button', { name: '导出 HTML' }).click()
await page.waitForTimeout(800)

await page.selectOption('select', 'landing')
await page.waitForTimeout(1400)

const video = page.video()
await context.close()
await browser.close()

if (video) {
  const raw = await video.path()
  const target = path.join(OUT, 'walkthrough_edit_tabs_theme_template_export.webm')
  fs.renameSync(raw, target)
  fs.copyFileSync(target, path.join(ARTIFACTS, 'walkthrough_edit_tabs_theme_template_export.webm'))
  console.log('video', target)
}

console.log('RECORD_OK')
