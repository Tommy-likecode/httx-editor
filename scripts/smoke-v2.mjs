import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.HTTX_URL || 'http://127.0.0.1:5173'
const OUT = process.env.HTTX_MEDIA || '/cursor/stores/self/media'
const ARTIFACTS = '/cursor/stores/self/artifacts'
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(ARTIFACTS, { recursive: true })

function save(page, name) {
  const file = path.join(OUT, name)
  return page.screenshot({ path: file, fullPage: true }).then(() => {
    fs.copyFileSync(file, path.join(ARTIFACTS, name))
    console.log('saved', file)
  })
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })

await page.getByTestId('mode-visual').click()
await page.waitForSelector('[data-testid="visual-workbench"]')
await save(page, 'v2_visual_mode.png')

await page.getByTestId('palette-button').click()
await page.waitForTimeout(400)
await page.getByTestId('palette-heading').click()
await page.waitForTimeout(400)
await save(page, 'v2_after_add_components.png')

// Select first canvas node via property-affecting click
await page.locator('.canvas-node').first().click()
await page.waitForSelector('[data-testid="property-panel"] textarea, [data-testid="property-panel"] input')
const textBox = page.locator('[data-testid="property-panel"] textarea').first()
if (await textBox.count()) {
  await textBox.fill('V2 属性已更新')
  await page.waitForTimeout(500)
}
await save(page, 'v2_props_edited.png')

await page.getByTestId('nl-input').fill('登录表单')
await page.getByTestId('nl-generate').click()
await page.waitForTimeout(700)
await save(page, 'v2_nl_login_form.png')

await page.getByTestId('mode-code').click()
await page.waitForSelector('.code-editor')
await save(page, 'v2_code_mode_sync.png')

await page.getByTestId('mode-visual').click()
await page.getByRole('button', { name: '手机' }).click()
await page.waitForTimeout(400)
await save(page, 'v2_device_mobile.png')

console.log('SMOKE_V2_OK')
await browser.close()
