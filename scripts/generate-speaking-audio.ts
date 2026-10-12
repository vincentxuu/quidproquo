// Pre-generate the read-aloud clips for /english with Deepgram Aura-2 on Workers AI.
// Usage: pnpm speaking:audio [--dry-run] [--force]
//
// One mp3 per sentence per voice lands in public/audio/speaking/<voice>/<clipKey>.mp3, and the list of
// what exists is written to src/lib/english-speaking-clips.ts. Clips that already exist are skipped, and
// clips whose sentence is gone are removed. A sentence without a clip is read by the browser's own voice.
//
// Credentials: CLOUDFLARE_API_TOKEN (needs Workers AI) and optionally CLOUDFLARE_ACCOUNT_ID.
// Without the token, the OAuth token of a local `wrangler login` is used.

import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { clipKey, speakingSentences, speakingVoices } from '../src/lib/english-speaking'

const MODEL = '@cf/deepgram/aura-2-en'
const PRICE_PER_1K_CHARACTERS = 0.03
const OUT_DIR = 'public/audio/speaking'
const MANIFEST = 'src/lib/english-speaking-clips.ts'
const CONCURRENCY = 4
const DRY_RUN = process.argv.includes('--dry-run')
const FORCE = process.argv.includes('--force')

async function wranglerToken() {
  const candidates = [
    join(homedir(), 'Library/Preferences/.wrangler/config/default.toml'),
    join(process.env.XDG_CONFIG_HOME ?? join(homedir(), '.config'), '.wrangler/config/default.toml'),
    join(homedir(), '.wrangler/config/default.toml'),
  ]
  for (const path of candidates) {
    if (!existsSync(path)) continue
    const match = /^oauth_token\s*=\s*"([^"]+)"/m.exec(await readFile(path, 'utf8'))
    if (match) return match[1]
  }
  return ''
}

async function synthesize(endpoint: string, token: string, text: string, speaker: string) {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, speaker, encoding: 'mp3' }),
    })
    const type = response.headers.get('content-type') ?? ''
    if (response.ok && !type.includes('json')) {
      const audio = Buffer.from(await response.arrayBuffer())
      if (audio.length) return audio
      throw new Error('empty audio')
    }
    const detail = (await response.text()).slice(0, 300)
    const retryable = response.status === 429 || response.status >= 500
    if (!retryable || attempt >= 4) throw new Error(`HTTP ${response.status}: ${detail}`)
    await new Promise(resolve => setTimeout(resolve, attempt * 2000))
  }
}

const sentences = speakingSentences()
const keys = new Map(sentences.map(text => [clipKey(text), text]))
if (keys.size !== sentences.length) throw new Error('Two sentences share a clip key; change clipKey before generating.')

const jobs: { voice: string; key: string; text: string; path: string }[] = []
for (const voice of speakingVoices) {
  for (const [key, text] of keys) {
    const path = join(OUT_DIR, voice.id, `${key}.mp3`)
    if (FORCE || !existsSync(path)) jobs.push({ voice: voice.id, key, text, path })
  }
}
const characters = jobs.reduce((total, job) => total + job.text.length, 0)
console.log(`${sentences.length} sentences × ${speakingVoices.length} voices; ${jobs.length} clips to generate (${characters} characters, about $${(characters / 1000 * PRICE_PER_1K_CHARACTERS).toFixed(2)}).`)

const failures: string[] = []
if (jobs.length && !DRY_RUN) {
  const token = process.env.CLOUDFLARE_API_TOKEN || await wranglerToken()
  if (!token) throw new Error('No Cloudflare credentials: set CLOUDFLARE_API_TOKEN or run `wrangler login`.')
  let account = process.env.CLOUDFLARE_ACCOUNT_ID ?? ''
  if (!account) {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts', { headers: { Authorization: `Bearer ${token}` } })
    const body = await response.json() as { result?: { id: string }[] }
    account = body.result?.[0]?.id ?? ''
    if (!account) throw new Error(`Could not read the Cloudflare account (HTTP ${response.status}); set CLOUDFLARE_ACCOUNT_ID.`)
  }
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/${MODEL}`
  for (const voice of speakingVoices) await mkdir(join(OUT_DIR, voice.id), { recursive: true })
  let next = 0, done = 0
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < jobs.length) {
      const job = jobs[next++]
      try { await writeFile(job.path, await synthesize(endpoint, token, job.text, job.voice)) }
      catch (error) { failures.push(`${job.voice}/${job.key} (${job.text.slice(0, 40)}): ${error instanceof Error ? error.message : error}`) }
      if (++done % 100 === 0) console.log(`  ${done} / ${jobs.length}`)
    }
  }))
}

// The manifest lists what is really on disk, so a failed or skipped clip simply falls back to the browser voice.
const manifest: Record<string, string[]> = {}
let removed = 0, bytes = 0
for (const voice of speakingVoices) {
  const dir = join(OUT_DIR, voice.id)
  const files = existsSync(dir) ? (await readdir(dir)).filter(name => name.endsWith('.mp3')) : []
  manifest[voice.id] = []
  for (const name of files) {
    const key = name.slice(0, -4)
    if (keys.has(key)) { manifest[voice.id].push(key); continue }
    if (!DRY_RUN) await unlink(join(dir, name))
    removed++
  }
  manifest[voice.id].sort()
  for (const key of manifest[voice.id]) bytes += (await readFile(join(dir, `${key}.mp3`))).length
}
if (!DRY_RUN) {
  await writeFile(MANIFEST, `// Generated by \`pnpm speaking:audio\` (scripts/generate-speaking-audio.ts). Do not edit by hand.\nimport type { SpeakingClips } from './english-speaking';\nexport const speakingClips: SpeakingClips = ${JSON.stringify(manifest)};\n`)
}
for (const voice of speakingVoices) console.log(`${voice.id}: ${manifest[voice.id].length} / ${sentences.length} clips`)
console.log(`${(bytes / 1_048_576).toFixed(1)} MB on disk; ${removed} orphaned clip${removed === 1 ? '' : 's'} ${DRY_RUN ? 'would be removed' : 'removed'}.`)
if (failures.length) {
  console.error(`${failures.length} clips failed:\n${failures.slice(0, 20).join('\n')}`)
  process.exitCode = 1
}
