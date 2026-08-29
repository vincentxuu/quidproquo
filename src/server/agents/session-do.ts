import { DurableObject } from 'cloudflare:workers'
import type { Env } from '../../lib/config/env'
import { runLoop, type LoopMessage } from '../../lib/agent/durable-agent'
import { createKernel } from '../../lib/agent/kernel'
import { createSessionManager } from '../../lib/agent/session-manager'
import type { SessionEvent } from '../../lib/agent/events'
import { fromSessionEvent } from '../../lib/agent/events'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

type StartRunOptions = {
  skill?: string
  mode?: 'auto' | 'default' | 'plan'
  model?: string
  repo?: string
  runnerProvider?: string
  trigger?: string
}

export class AgentSessionDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(
        'CREATE TABLE IF NOT EXISTS pending (requestId TEXT PRIMARY KEY, payload TEXT)',
      )
    })
  }

  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair()
      const [client, server] = Object.values(pair) as [WebSocket, WebSocket]
      this.ctx.acceptWebSocket(server)
      return new Response(null, { status: 101, webSocket: client })
    }
    if (url.pathname.endsWith('/run') && request.method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        prompt?: string
        skill?: string
        sessionId?: string
        mode?: 'auto' | 'default' | 'plan'
        model?: string
        repo?: string
        runner_provider?: string
      }
      const sessionId = body.sessionId ?? url.searchParams.get('sessionId') ?? `sess_${Date.now()}`
      const prompt = body.prompt ?? 'hello'
      await this.startRun(sessionId, prompt, {
        skill: body.skill,
        mode: body.mode,
        model: body.model,
        repo: body.repo,
        runnerProvider: body.runner_provider,
        trigger: 'manual',
      })
      return Response.json({ sessionId })
    }
    if (url.pathname.endsWith('/approve') && request.method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { requestId?: string; decision?: string }
      if (body.requestId) {
        this.ctx.storage.sql.exec('DELETE FROM pending WHERE requestId = ?', body.requestId)
        const responseEvent: SessionEvent = {
          type: 'control_response',
          requestId: body.requestId,
          behavior: (body.decision ?? 'allow') as 'allow' | 'deny',
        }
        this.broadcast(responseEvent)
        await this.ctx.storage.setAlarm(Date.now() + 100)
      }
      return Response.json({ ok: true })
    }
    if (url.pathname.endsWith('/stop') && request.method === 'POST') {
      const sessionId = url.searchParams.get('sessionId')
      if (sessionId) {
        const mgr = createSessionManager(this.env.DB)
        await mgr.stop(sessionId)
        await this.env.SESSION.put(`session:${sessionId}:cancel`, '1', { expirationTtl: 300 })
        this.broadcast({ type: 'result', content: 'Session cancelled', totalTokens: 0, totalCostUsd: 0 } satisfies SessionEvent)
      }
      return Response.json({ ok: true })
    }
    return new Response('AgentSessionDO ok', { status: 200 })
  }

  override async webSocketMessage(_ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const text = typeof message === 'string' ? message : new TextDecoder().decode(message)
    try {
      const data = JSON.parse(text) as {
        type?: string
        prompt?: string
        skill?: string
        sessionId?: string
        mode?: 'auto' | 'default' | 'plan'
        model?: string
        repo?: string
        runner_provider?: string
      }
      if (data.type === 'prompt' && data.prompt) {
        const sessionId = data.sessionId ?? `sess_${Date.now()}`
        await this.startRun(sessionId, data.prompt, {
          skill: data.skill,
          mode: data.mode,
          model: data.model,
          repo: data.repo,
          runnerProvider: data.runner_provider,
          trigger: 'ws',
        })
      } else if (data.type === 'approve' && (data as unknown as { requestId?: string }).requestId) {
        const reqId = (data as unknown as { requestId: string }).requestId
        this.ctx.storage.sql.exec('DELETE FROM pending WHERE requestId = ?', reqId)
        this.broadcast({ type: 'control_response', requestId: reqId, behavior: 'allow' } satisfies SessionEvent)
        await this.ctx.storage.setAlarm(Date.now() + 100)
      }
    } catch {
      // ignore malformed
    }
  }

  override async webSocketClose(_ws: WebSocket): Promise<void> {
    // hibernation keeps state; nothing to do
  }

  override async alarm(): Promise<void> {
    const row = this.ctx.storage.sql.exec<{ payload: string }>('SELECT payload FROM pending LIMIT 1').toArray()[0]
    if (row) {
      this.broadcast({ type: 'tool_progress', toolCallId: '', toolName: 'resume', progress: row.payload } satisfies SessionEvent)
    }
  }

  private broadcast(event: SessionEvent | unknown): void {
    const msg = JSON.stringify(event)
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(msg)
      } catch {
        // ignore closed
      }
    }
  }

  private async persistEventToD1(sessionId: string, event: SessionEvent): Promise<void> {
    const seqRow = await this.env.DB.prepare('SELECT COALESCE(MAX(seq), -1) + 1 AS n FROM agent_events WHERE session_id = ?')
      .bind(sessionId)
      .first<{ n: number }>()
    const seq = seqRow?.n ?? 0
    const row = fromSessionEvent(sessionId, seq, event)

    const result = await this.env.DB.prepare(
      'INSERT INTO agent_events (session_id, seq, type, payload_json, created_at, event_id) VALUES (?, ?, ?, ?, ?, NULL)',
    )
      .bind(row.session_id, row.seq, row.type, row.payload_json, row.created_at)
      .run()

    const eventId = result.meta?.last_row_id
    if (eventId) {
      await this.env.DB.prepare('UPDATE agent_events SET event_id = ? WHERE session_id = ? AND seq = ?')
        .bind(eventId, sessionId, seq)
        .run()
      await this.env.SESSION.put(`session:${sessionId}:last_event`, String(eventId))
    }
  }

  private async startRun(sessionId: string, prompt: string, options: StartRunOptions = {}): Promise<void> {
    const mgr = createSessionManager(this.env.DB)
    let session = await mgr.get(sessionId)
    if (!session) {
      session = await mgr.create({
        id: sessionId,
        instruction: prompt,
        model: options.model,
        mode: options.mode,
        repo: options.repo,
        runnerProvider: options.runnerProvider,
        trigger: options.trigger ?? 'manual',
      })
    }
    await mgr.transition(session.id, 'running')

    const initEvent: SessionEvent = {
      type: 'system/init',
      sessionId: session.id,
      model: options.model ?? session.model ?? 'default',
      mode: options.mode ?? (session.mode as 'auto' | 'default' | 'plan') ?? 'auto',
      tools: [],
    }
    await this.persistEventToD1(session.id, initEvent)
    this.broadcast(initEvent)

    const userEvent: SessionEvent = { type: 'user', content: prompt }
    await this.persistEventToD1(session.id, userEvent)

    const userMsg: LoopMessage = { role: 'user', content: prompt }
    await this.persistMessage(session.id, userMsg)

    let skillContext = ''
    if (options.skill) {
      const row = await this.env.DB.prepare('SELECT content FROM user_skills WHERE name = ?')
        .bind(options.skill)
        .first<{ content: string }>()
      if (row?.content) skillContext = row.content.slice(0, 8000)
    }

    const kernel = createKernel(this.env)
    const toBaseMessage = (m: LoopMessage) =>
      m.role === 'user' ? new HumanMessage(m.content) : new SystemMessage(m.content)

    await runLoop(
      [userMsg],
      {
        sessionId: session.id,
        db: this.env.DB,
        kv: this.env.SESSION,
        modelInvoke: async (msgs) => {
          try {
            const lcMessages = [
              ...(skillContext ? [new SystemMessage(`Skill ${options.skill}:\n${skillContext}`)] : []),
              ...msgs.map(toBaseMessage),
            ]
            const res = (await kernel.tools.syscall(
              // @ts-expect-error syscall helper typed with run context
              { agentId: 'console', runId: session.id } as unknown as Parameters<typeof kernel.tools.syscall>[1],
              'model.invoke',
              {
                config: { model: options.model ?? 'groq/llama-3.3-70b-versatile', temperature: 0.3 } as unknown as never,
                stage: 'console',
                messages: lcMessages,
              } as never,
            )) as unknown as { response?: { content?: string }; content?: string }
            const content = res?.response?.content ?? res?.content ?? JSON.stringify(res)
            return { content: String(content), stopReason: 'stop' }
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            return { content: `model error: ${msg} (skill: ${options.skill ?? 'none'})`, stopReason: 'stop' }
          }
        },
        syscall: async (name, input) => {
          try {
            const r = await kernel.tools.syscall(
              { agentId: 'console', runId: session.id } as unknown as never,
              name as never,
              input as never,
            )
            return r
          } catch (e) {
            return `tool:${name} error ${e instanceof Error ? e.message : String(e)}`
          }
        },
        persistMessage: (m) => this.persistMessage(session.id, m),
        persistEvent: (type, payload) => this.persistLegacyEvent(session.id, type, payload),
        broadcast: (e) => this.broadcast(e as SessionEvent),
      },
    )

    await mgr.transition(session.id, 'done')

    const resultEvent: SessionEvent = { type: 'result', content: 'Session complete', totalTokens: 0, totalCostUsd: 0 }
    await this.persistEventToD1(session.id, resultEvent)
    this.broadcast(resultEvent)
  }

  private async persistMessage(sessionId: string, msg: LoopMessage): Promise<void> {
    const seqRow = await this.env.DB.prepare('SELECT COALESCE(MAX(seq), -1) + 1 AS n FROM agent_messages WHERE session_id = ?')
      .bind(sessionId)
      .first<{ n: number }>()
    const seq = seqRow?.n ?? 0
    await this.env.DB.prepare(
      'INSERT INTO agent_messages (session_id, seq, role, content_json, tool_call_id, tool_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
      .bind(sessionId, seq, msg.role, JSON.stringify(msg.content), msg.toolCallId ?? null, msg.toolName ?? null, Date.now())
      .run()
  }

  private async persistLegacyEvent(sessionId: string, type: string, payload: unknown): Promise<void> {
    const seqRow = await this.env.DB.prepare('SELECT COALESCE(MAX(seq), -1) + 1 AS n FROM agent_events WHERE session_id = ?')
      .bind(sessionId)
      .first<{ n: number }>()
    const seq = seqRow?.n ?? 0
    await this.env.DB.prepare(
      'INSERT INTO agent_events (session_id, seq, type, payload_json, created_at) VALUES (?, ?, ?, ?, ?)',
    )
      .bind(sessionId, seq, type, JSON.stringify(payload), Date.now())
      .run()
  }
}
