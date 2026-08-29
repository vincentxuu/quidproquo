export type SessionStatus = 'pending' | 'running' | 'waiting_approval' | 'done' | 'failed' | 'cancelled' | 'archived'

export interface SessionRecord {
  id: string
  agent_id: string
  trigger: string
  status: SessionStatus
  name: string | null
  model: string | null
  mode: string
  repo: string | null
  runner_provider: string
  pinned: boolean
  archived: boolean
  share_token: string | null
  routine_id: string | null
  total_tokens: number
  total_cost_usd: number
  summary_category: string | null
  summary_detail: string | null
  needs_action: boolean
  git_ref: string | null
  created_at: number
  updated_at: number
  finished_at: number | null
}

export interface CreateSessionInput {
  id?: string
  instruction: string
  name?: string
  model?: string
  mode?: 'auto' | 'default' | 'plan'
  repo?: string
  runnerProvider?: string
  routineId?: string
  trigger?: string
}

export interface PostTurnSummary {
  status_category: string
  status_detail: string
  needs_action: boolean
}

export interface ListSessionsOpts {
  status?: SessionStatus
  pinned?: boolean
  archived?: boolean
  limit?: number
  offset?: number
}

function sessionFromRow(row: Record<string, unknown>): SessionRecord {
  return {
    id: String(row.id),
    agent_id: String(row.agent_id ?? ''),
    trigger: String(row.trigger ?? 'manual'),
    status: (row.status ?? 'pending') as SessionStatus,
    name: row.name != null ? String(row.name) : null,
    model: row.model != null ? String(row.model) : null,
    mode: String(row.mode ?? 'auto'),
    repo: row.repo != null ? String(row.repo) : null,
    runner_provider: String(row.runner_provider ?? 'sandbox'),
    pinned: Number(row.pinned ?? 0) === 1,
    archived: Number(row.archived ?? 0) === 1,
    share_token: row.share_token != null ? String(row.share_token) : null,
    routine_id: row.routine_id != null ? String(row.routine_id) : null,
    total_tokens: Number(row.total_tokens ?? 0),
    total_cost_usd: Number(row.total_cost_usd ?? 0),
    summary_category: row.summary_category != null ? String(row.summary_category) : null,
    summary_detail: row.summary_detail != null ? String(row.summary_detail) : null,
    needs_action: Number(row.needs_action ?? 0) === 1,
    git_ref: row.git_ref != null ? String(row.git_ref) : null,
    created_at: Number(row.created_at),
    updated_at: Number(row.updated_at ?? row.created_at),
    finished_at: row.finished_at != null ? Number(row.finished_at) : null,
  }
}

export function createSessionManager(db: D1Database) {
  return {
    async list(opts: ListSessionsOpts = {}): Promise<SessionRecord[]> {
      const clauses: string[] = []
      const values: unknown[] = []

      if (opts.status) {
        clauses.push('status = ?')
        values.push(opts.status)
      }
      if (opts.pinned !== undefined) {
        clauses.push('pinned = ?')
        values.push(opts.pinned ? 1 : 0)
      }
      if (opts.archived !== undefined) {
        clauses.push('archived = ?')
        values.push(opts.archived ? 1 : 0)
      }

      const limit = Math.min(opts.limit ?? 50, 200)
      const offset = opts.offset ?? 0
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''

      const result = await db
        .prepare(`SELECT * FROM agent_sessions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
        .bind(...values, limit, offset)
        .all<Record<string, unknown>>()

      return (result.results ?? []).map(sessionFromRow)
    },

    async get(id: string): Promise<SessionRecord | null> {
      const row = await db
        .prepare('SELECT * FROM agent_sessions WHERE id = ?')
        .bind(id)
        .first<Record<string, unknown>>()
      return row ? sessionFromRow(row) : null
    },

    async create(input: CreateSessionInput): Promise<SessionRecord> {
      const now = Date.now()
      const id = input.id ?? `sess_${now}_${Math.random().toString(36).slice(2, 6)}`
      const name = input.name ?? input.instruction.slice(0, 80)

      await db
        .prepare(`
          INSERT INTO agent_sessions
            (id, agent_id, trigger, status, name, model, mode, repo, runner_provider, routine_id, created_at, updated_at)
          VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          id,
          'default',
          input.trigger ?? 'manual',
          name,
          input.model ?? null,
          input.mode ?? 'auto',
          input.repo ?? null,
          input.runnerProvider ?? 'sandbox',
          input.routineId ?? null,
          now,
          now,
        )
        .run()

      return (await this.get(id))!
    },

    async stop(id: string): Promise<void> {
      await db
        .prepare(`UPDATE agent_sessions SET status = 'cancelled', finished_at = ?, updated_at = ? WHERE id = ? AND status IN ('running', 'pending', 'waiting_approval')`)
        .bind(Date.now(), Date.now(), id)
        .run()
    },

    async resume(id: string, _message: string): Promise<void> {
      await db
        .prepare(`UPDATE agent_sessions SET status = 'running', updated_at = ? WHERE id = ? AND status IN ('done', 'cancelled', 'failed')`)
        .bind(Date.now(), id)
        .run()
    },

    async rename(id: string, name: string): Promise<void> {
      await db
        .prepare('UPDATE agent_sessions SET name = ?, updated_at = ? WHERE id = ?')
        .bind(name, Date.now(), id)
        .run()
    },

    async archive(id: string): Promise<void> {
      await db
        .prepare('UPDATE agent_sessions SET archived = 1, updated_at = ? WHERE id = ?')
        .bind(Date.now(), id)
        .run()
    },

    async unarchive(id: string): Promise<void> {
      await db
        .prepare('UPDATE agent_sessions SET archived = 0, updated_at = ? WHERE id = ?')
        .bind(Date.now(), id)
        .run()
    },

    async pin(id: string): Promise<void> {
      await db
        .prepare('UPDATE agent_sessions SET pinned = 1, updated_at = ? WHERE id = ?')
        .bind(Date.now(), id)
        .run()
    },

    async unpin(id: string): Promise<void> {
      await db
        .prepare('UPDATE agent_sessions SET pinned = 0, updated_at = ? WHERE id = ?')
        .bind(Date.now(), id)
        .run()
    },

    async delete(id: string): Promise<void> {
      await db.prepare('DELETE FROM agent_sessions WHERE id = ?').bind(id).run()
    },

    async share(id: string): Promise<{ token: string; url: string }> {
      const token = crypto.randomUUID()
      await db
        .prepare('UPDATE agent_sessions SET share_token = ?, updated_at = ? WHERE id = ?')
        .bind(token, Date.now(), id)
        .run()
      return { token, url: `/shared/${token}` }
    },

    async unshare(id: string): Promise<void> {
      await db
        .prepare('UPDATE agent_sessions SET share_token = NULL, updated_at = ? WHERE id = ?')
        .bind(Date.now(), id)
        .run()
    },

    async updateSummary(id: string, summary: PostTurnSummary): Promise<void> {
      await db
        .prepare(`
          UPDATE agent_sessions
          SET summary_category = ?, summary_detail = ?, needs_action = ?, updated_at = ?
          WHERE id = ?
        `)
        .bind(summary.status_category, summary.status_detail, summary.needs_action ? 1 : 0, Date.now(), id)
        .run()
    },

    async incrementCounters(id: string, tokens: number, costUsd: number): Promise<void> {
      await db
        .prepare('UPDATE agent_sessions SET total_tokens = total_tokens + ?, total_cost_usd = total_cost_usd + ?, updated_at = ? WHERE id = ?')
        .bind(tokens, costUsd, Date.now(), id)
        .run()
    },

    async transition(id: string, status: SessionStatus): Promise<void> {
      const finished = ['done', 'failed', 'cancelled'].includes(status) ? Date.now() : null
      await db
        .prepare('UPDATE agent_sessions SET status = ?, finished_at = COALESCE(?, finished_at), updated_at = ? WHERE id = ?')
        .bind(status, finished, Date.now(), id)
        .run()
    },
  }
}

export type SessionManagerInstance = ReturnType<typeof createSessionManager>
