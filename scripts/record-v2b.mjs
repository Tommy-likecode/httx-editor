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
await page.getByTestId('mode-visual').click()
await page.waitForTimeout(500)

await page.getByTestId('palette-card').click()
await page.waitForTimeout(600)
await page.getByTestId('palette-container').click()
await page.waitForTimeout(500)
await page.getByTestId('hierarchy-tree').locator('.hierarchy-row').first().click()
await page.waitForTimeout(400)
await page.getByRole('button', { name: '成组' }).click()
await page.waitForTimeout(500)

const move = page.getByTestId('free-move-handle')
if (await move.count()) {
  const box = await move.boundingBox()
  if (box) {
    await page.mouse.move(box.x + 10, box.y + 10)
    await page.mouse.down()
    await page.mouse.move(box.x + 70, box.y + 50, { steps: 10 })
    await page.mouse.up()
  }
}
await page.waitForTimeout(600)

await page.getByTestId('variables-panel').locator('input').first().fill('ctaLabel')
await page.getByTestId('variables-panel').getByRole('button', { name: '添加' }).click()
await page.waitForTimeout(300)
await page.getByTestId('hierarchy-tree').locator('.hierarchy-row').filter({ hasText: '按钮' }).first().click()
await page.waitForTimeout(300)
const insert = page.getByTestId('variables-panel').getByRole('button', { name: '插入' }).last()
if (await insert.count()) await insert.click()
await page.waitForTimeout(800)

await page.getByTestId('mode-code').click()
await page.waitForTimeout(800)
await page.getByTestId('mode-visual').click()
await page.waitForTimeout(700)

const video = page.video()
await context.close()
await browser.close()
if (video) {
  const raw = await video.path()
  const target = path.join(OUT, 'v2b_walkthrough_move_nested_variables.webm')
  fs.renameSync(raw, target)
  fs.copyFileSync(target, path.join(ARTIFACTS, 'v2b_walkthrough_move_nested_variables.webm'))
  console.log('video', target)
}
console.log('RECORD_V2B_OK')
