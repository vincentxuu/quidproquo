import { DurableObject } from 'cloudflare:workers'
import type { Env } from '../../lib/config/env'
import { runLoop, type LoopMessage } from '../../lib/agent-os/durable-agent'
import { createKernel } from '../../lib/agent-os/kernel'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'

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
      const body = (await request.json().catch(() => ({}))) as { prompt?: string; skill?: string }
      const sessionId = url.searchParams.get('sessionId') ?? `sess_${Date.now()}`
      const prompt = body.prompt ?? 'hello'
      await this.startRun(sessionId, prompt, body.skill)
      return Response.json({ sessionId })
    }
    if (url.pathname.endsWith('/approve') && request.method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as { requestId?: string; decision?: string }
      if (body.requestId) {
        this.ctx.storage.sql.exec('DELETE FROM pending WHERE requestId = ?', body.requestId)
        this.broadcast({ type: 'control_response', requestId: body.requestId, decision: body.decision ?? 'allow' })
        await this.ctx.storage.setAlarm(Date.now() + 100)
      }
      return Response.json({ ok: true })
    }
    return new Response('AgentSessionDO ok', { status: 200 })
  }

  override async webSocketMessage(_ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const text = typeof message === 'string' ? message : new TextDecoder().decode(message)
    try {
      const data = JSON.parse(text) as { type?: string; prompt?: string; skill?: string }
      if (data.type === 'prompt' && data.prompt) {
        const sessionId = `sess_${Date.now()}`
        await this.startRun(sessionId, data.prompt, data.skill)
      } else if (data.type === 'approve' && (data as unknown as { requestId?: string }).requestId) {
        const reqId = (data as unknown as { requestId: string }).requestId
        this.ctx.storage.sql.exec('DELETE FROM pending WHERE requestId = ?', reqId)
        this.broadcast({ type: 'control_response', requestId: reqId, decision: 'allow' })
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
    // resume next turn — runLoop will be re-entered via stored sessionId in storage
    const row = this.ctx.storage.sql.exec<{ payload: string }>('SELECT payload FROM pending LIMIT 1').toArray()[0]
    if (row) {
      this.broadcast({ type: 'resume', pending: row.payload })
    }
  }

  private broadcast(event: unknown): void {
    const msg = JSON.stringify(event)
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(msg)
      } catch {
        // ignore closed
      }
    }
  }

  private async startRun(sessionId: string, prompt: string, skill?: string): Promise<void> {
    const now = Date.now()
    await this.env.DB.prepare(
      'INSERT OR IGNORE INTO agent_sessions (id, agent_id, trigger, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    )
      .bind(sessionId, 'console', 'ws', 'running', now, now)
      .run()

    const userMsg: LoopMessage = { role: 'user', content: prompt }
    await this.persistMessage(sessionId, userMsg)

    let skillContext = ''
    if (skill) {
      const row = await this.env.DB.prepare('SELECT content FROM user_skills WHERE name = ?')
        .bind(skill)
        .first<{ content: string }>()
      if (row?.content) skillContext = row.content.slice(0, 8000)
    }

    const kernel = createKernel(this.env)
    const toBaseMessage = (m: LoopMessage) =>
      m.role === 'user' ? new HumanMessage(m.content) : new SystemMessage(m.content)

    await runLoop(
      [userMsg],
      {
        modelInvoke: async (msgs) => {
          try {
            const lcMessages = [
              ...(skillContext ? [new SystemMessage(`Skill ${skill}:\n${skillContext}`)] : []),
              ...msgs.map(toBaseMessage),
            ]
            // minimal RagRuntimeConfig stub — reuse env provider routing via kernel syscall
            const res = (await kernel.tools.syscall(
              // @ts-expect-error syscall helper typed with run context; call underlying invoke via registry
              { agentId: 'console', runId: sessionId } as unknown as Parameters<typeof kernel.tools.syscall>[1],
              'model.invoke',
              {
                config: { model: 'groq/llama-3.3-70b-versatile', temperature: 0.3 } as unknown as never,
                stage: 'console',
                messages: lcMessages,
              } as never,
            )) as unknown as { response?: { content?: string }; content?: string }
            const content = res?.response?.content ?? res?.content ?? JSON.stringify(res)
            return { content: String(content), stopReason: 'stop' }
          } catch (e) {
            const msg = e instanceof Error ? e.message : String(e)
            return { content: `model error: ${msg} (skill: ${skill ?? 'none'})`, stopReason: 'stop' }
          }
        },
        syscall: async (name, input) => {
          try {
            const r = await kernel.tools.syscall(
              { agentId: 'console', runId: sessionId } as unknown as never,
              name as never,
              input as never,
            )
            return r
          } catch (e) {
            return `tool:${name} error ${e instanceof Error ? e.message : String(e)}`
          }
        },
        persistMessage: (m) => this.persistMessage(sessionId, m),
        persistEvent: (type, payload) => this.persistEvent(sessionId, type, payload),
        broadcast: (e) => this.broadcast(e),
      },
    )

    await this.env.DB.prepare('UPDATE agent_sessions SET status = ?, updated_at = ? WHERE id = ?')
      .bind('done', Date.now(), sessionId)
      .run()
    this.broadcast({ type: 'done', sessionId })
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

  private async persistEvent(sessionId: string, type: string, payload: unknown): Promise<void> {
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
