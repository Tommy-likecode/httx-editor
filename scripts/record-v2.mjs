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
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(600)

await page.getByTestId('mode-visual').click()
await page.waitForTimeout(500)
await page.getByTestId('palette-card').click()
await page.waitForTimeout(700)
await page.locator('.canvas-node').first().click()
await page.waitForTimeout(400)
const textBox = page.locator('[data-testid="property-panel"] textarea').first()
if (await textBox.count()) {
  await textBox.fill('可视化属性同步')
}
await page.waitForTimeout(700)
await page.getByTestId('nl-input').fill('登录表单')
await page.getByTestId('nl-generate').click()
await page.waitForTimeout(900)
await page.getByTestId('mode-code').click()
await page.waitForTimeout(900)
await page.getByTestId('mode-visual').click()
await page.waitForTimeout(600)
await page.selectOption('select', 'nav')
await page.waitForTimeout(1000)

const video = page.video()
await context.close()
await browser.close()
if (video) {
  const raw = await video.path()
  const target = path.join(OUT, 'v2_walkthrough_visual_props_sync_template.webm')
  fs.renameSync(raw, target)
  fs.copyFileSync(target, path.join(ARTIFACTS, 'v2_walkthrough_visual_props_sync_template.webm'))
  console.log('video', target)
}
console.log('RECORD_V2_OK')
