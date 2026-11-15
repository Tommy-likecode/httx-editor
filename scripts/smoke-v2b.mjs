import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.HTTX_URL || 'http://127.0.0.1:5173'
const OUT = process.env.HTTX_MEDIA || '/cursor/stores/self/media'
const ARTIFACTS = '/cursor/stores/self/artifacts'
fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(ARTIFACTS, { recursive: true })

async function save(page, name) {
  const file = path.join(OUT, name)
  await page.screenshot({ path: file, fullPage: true })
  fs.copyFileSync(file, path.join(ARTIFACTS, name))
  console.log('saved', file)
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.evaluate(() => localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.getByTestId('mode-visual').click()
await page.waitForSelector('[data-testid="visual-workbench"]')

// nested: add container then heading into it via click+relocate simulation through UI buttons
await page.getByTestId('palette-container').click()
await page.waitForTimeout(300)
await page.getByTestId('palette-heading').click()
await page.waitForTimeout(300)
await page.getByTestId('palette-button').click()
await page.waitForTimeout(400)

// select via hierarchy
const tree = page.getByTestId('hierarchy-tree')
await tree.locator('.hierarchy-row').nth(1).click()
await page.waitForTimeout(300)
await save(page, 'v2b_nested_hierarchy.png')

// wrap/group
await page.getByRole('button', { name: '成组' }).click()
await page.waitForTimeout(400)

// free move handle
const move = page.getByTestId('free-move-handle')
if (await move.count()) {
  const box = await move.boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + 80, box.y + 40, { steps: 8 })
    await page.mouse.up()
  }
}
await page.waitForTimeout(400)
await save(page, 'v2b_move_element.png')

// variables
await page.getByTestId('variables-panel').locator('input').first().fill('heroTitle')
await page.getByTestId('variables-panel').getByRole('button', { name: '添加' }).click()
await page.waitForTimeout(200)
// set value
const varInputs = page.getByTestId('variables-panel').locator('.variable-row input')
await varInputs.last().fill('变量驱动标题')
await page.waitForTimeout(200)

// select a text/heading and insert variable
await tree.locator('.hierarchy-row').filter({ hasText: '标题' }).first().click()
await page.waitForTimeout(200)
const insertBtn = page.getByTestId('variables-panel').getByRole('button', { name: '插入' }).last()
if (await insertBtn.count()) await insertBtn.click()
await page.waitForTimeout(500)
await save(page, 'v2b_variables_bound.png')

await page.getByTestId('mode-code').click()
await page.waitForTimeout(500)
await save(page, 'v2b_code_sync.png')

console.log('SMOKE_V2B_OK')
await browser.close()
