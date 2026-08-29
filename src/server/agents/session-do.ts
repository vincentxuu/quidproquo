import { DurableObject } from 'cloudflare:workers'
import type { Env } from '../../lib/config/env'
import { runLoop, type LoopMessage } from '../../lib/agent/durable-agent'
import { createKernel } from '../../lib/agent/kernel'
import { createSessionManager } from '../../lib/agent/session-manager'
import type { SessionEvent } from '../../lib/agent/events'
import { fromSessionEvent } from '../../lib/agent/events'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { invokeModel } from '../../lib/retrieval/model'
import { resolveProviderApiKeys } from '../../lib/retrieval/provider-key-store'
import { initialState, type RagRuntimeConfig } from '../../lib/retrieval/state'
import { SandboxProvider } from '../../lib/agent/runner/sandbox'
import type { RunnerHandle } from '../../lib/agent/runner/types'
import { resolveCloneUrl } from '../../lib/github/app'

type StartRunOptions = {
  skill?: string
  mode?: 'auto' | 'default' | 'plan'
  model?: string
  repo?: string
  branch?: string
  runnerProvider?: string
  trigger?: string
}

type ModelProvider = RagRuntimeConfig['defaultProvider']

const DEFAULT_PROVIDER: ModelProvider = 'groq'
const DEFAULT_MODEL = 'openai/gpt-oss-120b'
const PROVIDER_ALIASES: Record<string, ModelProvider> = {
  'llm.groq': 'groq',
  'llm.openai': 'openai',
  'llm.anthropic': 'anthropic',
  'llm.gemini': 'gemini',
  'llm.openrouter': 'openrouter',
  groq: 'groq',
  openai: 'openai',
  anthropic: 'anthropic',
  google: 'google',
  gemini: 'gemini',
  cloudflare: 'cloudflare',
  openrouter: 'openrouter',
  opencode: 'opencode',
  nvidia: 'nvidia',
  cerebras: 'cerebras',
  ollama_cloud: 'ollama_cloud',
  ollama: 'ollama',
}

function defaultModelForProvider(provider: ModelProvider): string {
  const defaults: Partial<Record<ModelProvider, string>> = {
    groq: DEFAULT_MODEL,
    openai: 'gpt-4.1-mini',
    google: 'gemini-3.7-flash',
    gemini: 'gemini-3.7-flash',
    openrouter: 'openrouter/auto',
    opencode: 'deepseek-v4-flash',
    nvidia: 'deepseek-ai/deepseek-r1',
    cerebras: 'gpt-oss-120b',
    cloudflare: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  }
  return defaults[provider] ?? DEFAULT_MODEL
}

function resolveModelConfig(raw: string | undefined): RagRuntimeConfig {
  const base = initialState().config
  if (!raw) {
    return { ...base, defaultProvider: DEFAULT_PROVIDER, defaultModel: DEFAULT_MODEL }
  }

  const trimmed = raw.trim()
  const providerOnly = PROVIDER_ALIASES[trimmed]
  if (providerOnly) {
    return {
      ...base,
      defaultProvider: providerOnly,
      defaultModel: defaultModelForProvider(providerOnly),
    }
  }

  const separator = trimmed.indexOf(':')
  if (separator > 0) {
    const providerRaw = trimmed.slice(0, separator)
    const model = trimmed.slice(separator + 1).trim()
    const provider = PROVIDER_ALIASES[providerRaw]
    if (provider && model) {
      return { ...base, defaultProvider: provider, defaultModel: model }
    }
  }

  return { ...base, defaultProvider: DEFAULT_PROVIDER, defaultModel: trimmed }
}

function stringifyModelContent(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (typeof part === 'string') return part
      if (part && typeof part === 'object' && 'text' in part) {
        return String((part as { text?: unknown }).text ?? '')
      }
      return JSON.stringify(part)
    }).filter(Boolean).join('\n')
  }
  return content == null ? '' : JSON.stringify(content)
}

function truncateForPrompt(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}\n...[truncated]`
}

function shellSingleQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`
}

async function buildRepoContext(runner: RunnerHandle, repo: string, branch?: string): Promise<string> {
  const overviewScript = [
    'cd /workspace',
    'printf "Repository: "',
    'printf "%s\\n" ' + shellSingleQuote(repo),
    branch ? 'printf "Requested branch: "' : '',
    branch ? 'printf "%s\\n" ' + shellSingleQuote(branch) : '',
    'printf "Current branch: "',
    'git rev-parse --abbrev-ref HEAD 2>/dev/null || true',
    'printf "Latest commit: "',
    'git log -1 --oneline 2>/dev/null || true',
    'echo ""',
    'echo "Top-level files:"',
    'find . -maxdepth 2 -type f | sed "s#^./##" | sort | head -120',
  ].filter(Boolean).join('\n')

  const docsScript = [
    'cd /workspace',
    'for file in README.md readme.md README package.json pnpm-workspace.yaml pyproject.toml Cargo.toml go.mod deno.json deno.jsonc wrangler.toml wrangler.jsonc; do',
    '  if [ -f "$file" ]; then',
    '    echo ""',
    '    echo "----- $file -----"',
    '    sed -n "1,120p" "$file"',
    '  fi',
    'done',
  ].join('\n')

  const [overview, docs] = await Promise.all([
    runner.exec(['sh', '-lc', overviewScript]).catch((error) => ({ exitCode: 1, stdout: '', stderr: String(error) })),
    runner.exec(['sh', '-lc', docsScript]).catch((error) => ({ exitCode: 1, stdout: '', stderr: String(error) })),
  ])

  const overviewText = overview.stdout || overview.stderr
  const docsText = docs.stdout || docs.stderr
  return truncateForPrompt([
    'A GitHub repository is already cloned at /workspace for this session.',
    'Use this repository context when answering. If the request needs details not shown here, say which file or command is needed instead of claiming no repository context exists.',
    '',
    '--- Repository overview ---',
    overviewText,
    '',
    '--- Entry files ---',
    docsText || 'No common entry files found.',
  ].join('\n'), 18_000)
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
        branch?: string
        runner_provider?: string
      }
      const sessionId = body.sessionId ?? url.searchParams.get('sessionId') ?? `sess_${Date.now()}`
      const prompt = body.prompt ?? 'hello'
      await this.startRun(sessionId, prompt, {
        skill: body.skill,
        mode: body.mode,
        model: body.model,
        repo: body.repo,
        branch: body.branch,
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
        branch?: string
        runner_provider?: string
      }
      if (data.type === 'prompt' && data.prompt) {
        const sessionId = data.sessionId ?? `sess_${Date.now()}`
        await this.startRun(sessionId, data.prompt, {
          skill: data.skill,
          mode: data.mode,
          model: data.model,
          repo: data.repo,
          branch: data.branch,
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
    const modelConfig = resolveModelConfig(options.model)
    const apiKeys = await resolveProviderApiKeys(this.env.DB)
    const toBaseMessage = (m: LoopMessage) =>
      m.role === 'user' ? new HumanMessage(m.content) : new SystemMessage(m.content)
    let runner: RunnerHandle | undefined
    let repoContext = ''

    if (options.repo && (options.runnerProvider ?? session.runner_provider) === 'sandbox' && this.env.SANDBOX) {
      const cloneUrl = await resolveCloneUrl(this.env, options.repo)
      const sandbox = new SandboxProvider(this.env.SANDBOX)
      runner = await sandbox.provision(
        { ...session, repo: cloneUrl },
        {
          runnerProvider: 'sandbox',
          networkMode: 'trusted',
        },
        options.branch,
      )
      repoContext = await buildRepoContext(runner, options.repo, options.branch)
    }

    try {
      await runLoop(
        [userMsg],
        {
          sessionId: session.id,
          db: this.env.DB,
          kv: this.env.SESSION,
          runner,
          modelInvoke: async (msgs) => {
            try {
              const lcMessages = [
                ...(skillContext ? [new SystemMessage(`Skill ${options.skill}:\n${skillContext}`)] : []),
                ...(repoContext ? [new SystemMessage(repoContext)] : []),
                ...msgs.map(toBaseMessage),
              ]
              const res = await invokeModel(modelConfig, 'console', lcMessages, 512, apiKeys)
              return { content: stringifyModelContent(res.response.content), stopReason: 'stop' }
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
    } finally {
      if (runner) await runner.stop().catch(() => {})
    }

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
