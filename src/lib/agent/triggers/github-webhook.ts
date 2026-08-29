import { createSessionManager } from '../session-manager'

interface GitHubWebhookRow {
  webhook_id: string
  repo: string
  secret: string
  events: string
  filter_expression: string | null
  active: number
}

interface RoutineWithGitHub {
  id: string
  name: string
  instructions: string
  model: string | null
  repo: string | null
  trigger_github_webhook_id: string
  trigger_github_events: string | null
  trigger_github_filter: string | null
  enabled: number
}

export async function verifyGitHubSignature(
  payload: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const computed = 'sha256=' + Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
  return computed === signature
}

export async function handleGitHubWebhook(
  db: D1Database,
  eventType: string,
  payload: string,
  signature: string,
): Promise<{ matched: number; sessions: string[] }> {
  const body = JSON.parse(payload) as { repository?: { full_name?: string } }
  const repo = body.repository?.full_name
  if (!repo) return { matched: 0, sessions: [] }

  const webhooks = await db
    .prepare('SELECT * FROM github_webhooks WHERE repo = ? AND active = 1')
    .bind(repo)
    .all<GitHubWebhookRow>()

  const sessions: string[] = []

  for (const wh of webhooks.results) {
    const valid = await verifyGitHubSignature(payload, signature, wh.secret)
    if (!valid) continue

    const subscribedEvents: string[] = JSON.parse(wh.events)
    if (subscribedEvents.length > 0 && !subscribedEvents.includes(eventType)) continue

    if (wh.filter_expression) {
      if (!matchesFilter(body, wh.filter_expression)) continue
    }

    const routines = await db
      .prepare(
        `SELECT r.* FROM routines r
         WHERE r.trigger_github_webhook_id = ? AND r.enabled = 1`,
      )
      .bind(wh.webhook_id)
      .all<RoutineWithGitHub>()

    const sm = createSessionManager(db)
    for (const routine of routines.results) {
      const session = await sm.create({
        instruction: `[GitHub ${eventType}] ${routine.instructions}`,
        model: routine.model ?? undefined,
        repo: routine.repo ?? undefined,
      })
      await db
        .prepare('UPDATE routines SET last_run_id = ?, last_run_at = ?, last_run_status = ? WHERE id = ?')
        .bind(session.id, Date.now(), 'running', routine.id)
        .run()
      sessions.push(session.id)
    }
  }

  return { matched: sessions.length, sessions }
}

function matchesFilter(payload: unknown, expression: string): boolean {
  try {
    const filter = JSON.parse(expression) as Record<string, unknown>
    return Object.entries(filter).every(([key, expected]) => {
      const value = getNestedValue(payload, key)
      return value === expected
    })
  } catch {
    return true
  }
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((curr: unknown, key) => {
    if (curr != null && typeof curr === 'object') return (curr as Record<string, unknown>)[key]
    return undefined
  }, obj)
}
