import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import {
  applyPostSyncOperation,
  listPostSyncManifest,
  parsePostSyncOperations,
} from '../../../../lib/indexing/post-sync'
import type { Env } from '../../../../lib/config/env'

export const prerender = false

const SECRET_HEADER = 'X-Index-Sync-Secret'
const MAX_BODY_BYTES = 8 * 1024 * 1024

export const GET: APIRoute = async ({ request }) => {
  const bindings = env as unknown as Env
  if (!isAuthorized(request, bindings.INDEX_SYNC_SECRET)) return unauthorized()

  const posts = await listPostSyncManifest(bindings.DB)
  return json({ posts })
}

export const POST: APIRoute = async ({ request }) => {
  const bindings = env as unknown as Env
  if (!isAuthorized(request, bindings.INDEX_SYNC_SECRET)) return unauthorized()

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Request body too large' }, 413)

  let operations
  try {
    operations = parsePostSyncOperations(await request.json())
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid request'
    return json({ error: message }, 400)
  }

  for (const operation of operations) {
    await applyPostSyncOperation(bindings.DB, operation)
  }
  return json({ ok: true, applied: operations.length })
}

function isAuthorized(request: Request, secret: string | undefined): boolean {
  return Boolean(secret) && request.headers.get(SECRET_HEADER) === secret
}

function unauthorized(): Response {
  return json({ error: 'Unauthorized' }, 401)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
