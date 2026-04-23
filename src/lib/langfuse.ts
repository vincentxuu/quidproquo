import { env } from 'cloudflare:workers'

interface LangfuseEnv {
  LANGFUSE_PUBLIC_KEY?: string
  LANGFUSE_SECRET_KEY?: string
  LANGFUSE_HOST?: string
}

function getConfig() {
  const e = env as unknown as LangfuseEnv
  return {
    publicKey: e.LANGFUSE_PUBLIC_KEY ?? '',
    secretKey: e.LANGFUSE_SECRET_KEY ?? '',
    host: e.LANGFUSE_HOST ?? 'https://cloud.langfuse.com',
  }
}

async function post(path: string, body: unknown): Promise<void> {
  const { publicKey, secretKey, host } = getConfig()
  if (!publicKey || !secretKey) return

  await fetch(`${host}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${publicKey}:${secretKey}`)}`,
    },
    body: JSON.stringify(body),
  }).catch(() => {})
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
