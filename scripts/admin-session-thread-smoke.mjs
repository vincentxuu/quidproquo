import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'

const PORT = Number(process.env.ADMIN_SESSION_THREAD_SMOKE_PORT || 4337)
const HOST = '127.0.0.1'
const BASE_URL = `http://${HOST}:${PORT}`
const OUTPUT_DIR = path.resolve('.work/admin-session-thread-screenshots')

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    let output = ''
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for Astro dev server.\n${output}`))
    }, 45_000)

    const onData = data => {
      output += data.toString()
      if (output.includes(`http://${HOST}:${PORT}`) || output.includes(`http://localhost:${PORT}`)) {
        clearTimeout(timeout)
        resolve()
      }
    }

    child.stdout.on('data', onData)
    child.stderr.on('data', onData)
    child.on('exit', code => {
      clearTimeout(timeout)
      reject(new Error(`Astro dev server exited with code ${code}.\n${output}`))
    })
  })
}

async function installRoutes(page, resumeRequests) {
  await page.route('**/api/admin/sessions/smoke-session/resume', async route => {
    const request = route.request()
    try {
      resumeRequests.push(request.postDataJSON())
    } catch {
      resumeRequests.push(null)
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    })
  })

  await page.route('**/api/admin/sessions/smoke-session/diff', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      available: true,
      summary: '2 files changed',
      files: [
        { name: 'src/components/assistant-ui/thread.tsx', additions: 48, deletions: 3 },
        { name: 'src/lib/admin/session-thread-adapter.ts', additions: 198, deletions: 0 },
      ],
    }),
  }))

  await page.route('**/api/admin/sessions/smoke-session/approve', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true }),
  }))
}

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true })

  const server = spawn('pnpm', ['exec', 'astro', 'dev', '--host', HOST, '--port', String(PORT)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NO_COLOR: '1' },
  })

  let browser
  try {
    await waitForServer(server)
    browser = await chromium.launch()

    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const resumeRequests = []
    await installRoutes(desktop, resumeRequests)
    await desktop.goto(`${BASE_URL}/dev/admin-session-thread-smoke`, { waitUntil: 'networkidle' })
    await desktop.getByRole('heading', { name: 'Thread smoke session' }).waitFor()
    await desktop.locator('p').filter({ hasText: 'Astro + Cloudflare Workers' }).waitFor()
    await desktop.getByRole('button', { name: '接受', exact: true }).waitFor()
    await desktop.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-thread.png'), fullPage: true })

    await desktop.getByRole('button', { name: 'Diff', exact: true }).click()
    await desktop.getByText('2 files changed').waitFor()
    await desktop.screenshot({ path: path.join(OUTPUT_DIR, 'desktop-diff.png'), fullPage: true })
    await desktop.getByRole('button', { name: '關閉', exact: true }).click()

    await desktop.locator('#resume-input').fill('請繼續修 UI 密度')
    await desktop.getByRole('button', { name: '送出' }).click()
    await desktop.waitForFunction(() => document.querySelector('#resume-input') === null)
    if (resumeRequests[0]?.message !== '請繼續修 UI 密度') {
      throw new Error(`Composer did not POST expected resume message: ${JSON.stringify(resumeRequests[0])}`)
    }

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true })
    await installRoutes(mobile, [])
    await mobile.goto(`${BASE_URL}/dev/admin-session-thread-smoke`, { waitUntil: 'networkidle' })
    await mobile.getByRole('heading', { name: 'Thread smoke session' }).waitFor()
    await mobile.screenshot({ path: path.join(OUTPUT_DIR, 'mobile-thread.png'), fullPage: true })

    console.log(`Admin session thread smoke passed. Screenshots: ${OUTPUT_DIR}`)
  } finally {
    await browser?.close().catch(() => undefined)
    server.kill('SIGTERM')
  }
}

run().catch(error => {
  console.error(error)
  process.exit(1)
})
