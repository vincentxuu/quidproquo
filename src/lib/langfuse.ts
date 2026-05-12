import { env } from 'cloudflare:workers'

interface LangfuseEnv {
  LANGFUSE_PUBLIC_KEY?: string
  LANGFUSE_SECRET_KEY?: string
  LANGFUSE_HOST?: string
  LANGFUSE_BASE_URL?: string
}

const DEFAULT_HOST = 'https://cloud.langfuse.com'
const REQUEST_TIMEOUT_MS = 4000
const MAX_RETRIES = 3

function normalizeHost(raw: string): string {
  if (!raw) return DEFAULT_HOST
  return raw.endsWith('/') ? raw.slice(0, -1) : raw
}

function getConfig() {
  const e = env as unknown as LangfuseEnv
  return {
    publicKey: e.LANGFUSE_PUBLIC_KEY ?? '',
    secretKey: e.LANGFUSE_SECRET_KEY ?? '',
    host: normalizeHost(e.LANGFUSE_HOST ?? e.LANGFUSE_BASE_URL ?? DEFAULT_HOST),
  }
}

export function getLangfuseHost(): string {
  return getConfig().host
}

export function buildLangfuseTraceUrl(traceId: string): string {
  if (!traceId.trim()) return ''
  const base = getLangfuseHost().replace(/\/$/, '')
  return `${base}/traces/${encodeURIComponent(traceId)}`
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function shouldRetry(status: number): boolean {
  return status >= 500 || status === 408 || status === 429
}

async function post(path: string, body: unknown): Promise<void> {
  const { publicKey, secretKey, host } = getConfig()
  if (!publicKey || !secretKey) return

  const url = `${host}${path}`
  const auth = `Basic ${btoa(`${publicKey}:${secretKey}`)}`
  let lastError = 'unknown'

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      controller.abort('langfuse request timeout')
    }, REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (response.ok) return

      const text = await response.text().catch(() => '')
      lastError = `status ${response.status}: ${text || 'request failed'}`

      if (!shouldRetry(response.status)) {
        console.error(`[langfuse] ${path} non-retriable`, response.status)
        return
      }
    } catch (err) {
      clearTimeout(timeout)
      lastError = err instanceof Error ? err.message : 'network error'
      if (attempt + 1 >= MAX_RETRIES) {
        console.error('[langfuse] request failed after retries', lastError)
        return
      }
    }

    if (attempt + 1 < MAX_RETRIES) {
      await sleep(200 * (attempt + 1))
    }
  }

  console.error('[langfuse] request failed', lastError)
}

export interface TraceOptions {
  id: string
  name: string
  userId?: string
  input?: unknown
  metadata?: Record<string, unknown>
}

export async function createTrace(opts: TraceOptions): Promise<void> {
  await post('/api/public/traces', {
    id: opts.id,
    name: opts.name,
    userId: opts.userId,
    input: opts.input,
    metadata: opts.metadata,
    timestamp: new Date().toISOString(),
  })
}

export interface SpanOptions {
  id: string
  traceId: string
  name: string
  input?: unknown
  output?: unknown
  startTime?: string
  endTime?: string
  metadata?: Record<string, unknown>
}

export async function createSpan(opts: SpanOptions): Promise<void> {
  await post('/api/public/spans', {
    id: opts.id,
    traceId: opts.traceId,
    name: opts.name,
    input: opts.input,
    output: opts.output,
    startTime: opts.startTime ?? new Date().toISOString(),
    endTime: opts.endTime,
    metadata: opts.metadata,
  })
}

export async function updateTrace(id: string, updates: { output?: unknown; metadata?: Record<string, unknown> }): Promise<void> {
  await post('/api/public/traces', { id, ...updates })
}

export async function scoreTrace(traceId: string, name: string, value: number): Promise<void> {
  await post('/api/public/scores', {
    traceId,
    name,
    value,
    dataType: 'NUMERIC',
  })
}
