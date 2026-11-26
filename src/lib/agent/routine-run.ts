import type { Env } from '../config/env'
import { createSessionManager } from './session-manager'

export type WaitUntil = (promise: Promise<unknown>) => void

export type RoutineRunStatus = 'running' | 'done' | 'failed'

export interface RoutineRunSource {
  id: string
  instructions: string
  model?: string | null
  repo?: string | null
}

export interface StartRoutineRunOptions {
  trigger: 'routine' | 'api' | 'github' | 'manual'
  /** Overrides the saved instructions, e.g. to prepend the triggering event. */
  instruction?: string
}

export function getWaitUntil(locals: unknown): WaitUntil | undefined {
  const typedLocals = locals as {
    cfContext?: { waitUntil?: WaitUntil }
    runtime?: { ctx?: { waitUntil?: WaitUntil } }
  }
  const cfContext = typedLocals.cfContext
  if (cfContext?.waitUntil) return cfContext.waitUntil.bind(cfContext)
  const runtimeCtx = typedLocals.runtime?.ctx
  return runtimeCtx?.waitUntil?.bind(runtimeCtx)
}

/**
 * Records a routine's latest run outcome. Only the routine whose latest run is
 * this session is updated, so a slow older run cannot overwrite a newer one.
 */
export async function recordRoutineRunStatus(db: D1Database, sessionId: string, status: RoutineRunStatus): Promise<void> {
  await db
    .prepare('UPDATE routines SET last_run_status = ?, updated_at = ? WHERE last_run_id = ?')
    .bind(status, Date.now(), sessionId)
    .run()
}

/**
 * A routine run is a session linked to the routine and executed by AgentSessionDO,
 * the same executor as an interactive session. The returned promise settles when
 * the DO request ends; callers hand it to waitUntil.
 */
export async function startRoutineRun(
  env: Env,
  routine: RoutineRunSource,
  options: StartRoutineRunOptions,
): Promise<{ sessionId: string; run: Promise<void> }> {
  const sessions = createSessionManager(env.DB)
  const instruction = options.instruction ?? routine.instructions
  const session = await sessions.create({
    instruction,
    model: routine.model ?? undefined,
    repo: routine.repo ?? undefined,
    trigger: options.trigger,
    routineId: routine.id,
  })

  const now = Date.now()
  await env.DB
    .prepare('UPDATE routines SET last_run_id = ?, last_run_at = ?, last_run_status = ?, updated_at = ? WHERE id = ?')
    .bind(session.id, now, 'running', now, routine.id)
    .run()

  const stub = env.AGENT_SESSION_DO.get(env.AGENT_SESSION_DO.idFromName(session.id))
  const run = stub
    .fetch(
      new Request(`https://do/run?sessionId=${session.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          prompt: instruction,
          model: session.model ?? undefined,
          repo: session.repo ?? undefined,
          runner_provider: session.runner_provider,
        }),
      }),
    )
    .then(async (res) => {
      if (!res.ok) {
        const detail = await res.text().catch(() => '')
        throw new Error(detail || `AgentSessionDO returned ${res.status}`)
      }
    })
    .catch(async (error) => {
      console.error('[routine-run] session failed', session.id, error instanceof Error ? error.message : error)
      await sessions.transition(session.id, 'failed').catch(() => {})
      await recordRoutineRunStatus(env.DB, session.id, 'failed').catch(() => {})
    })

  return { sessionId: session.id, run }
}
