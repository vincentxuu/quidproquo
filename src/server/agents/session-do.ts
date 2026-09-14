import { DurableObject } from 'cloudflare:workers'
import type { Env } from '../../lib/config/env'
import { runLoop, type LoopMessage } from '../../lib/agent/durable-agent'
import { createKernel } from '../../lib/agent/kernel'
import { createSessionManager } from '../../lib/agent/session-manager'
import type { SessionEvent } from '../../lib/agent/events'
import { fromSessionEvent } from '../../lib/agent/events'
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages'
import type { BaseMessageLike } from '@langchain/core/messages'
import { createRawModel, type ProviderApiKeys } from '../../lib/retrieval/model'
import { resolveProviderApiKeys } from '../../lib/retrieval/provider-key-store'
import { initialState, type RagRuntimeConfig } from '../../lib/retrieval/state'
import { listDefaultSyscalls } from '../../lib/agent/tools/register-defaults'
import { SandboxProvider } from '../../lib/agent/runner/sandbox'
import type { RunnerHandle } from '../../lib/agent/runner/types'
import { resolveCloneUrl } from '../../lib/github/app'
import { loadServers, discoverTools } from '../../lib/mcp-proxy/registry'
import { callTool as mcpCallTool } from '../../lib/mcp-proxy/client'
import type { McpServerConfig, McpToolDefinition } from '../../lib/mcp-proxy/types'

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

function loopMessageToLangChain(m: LoopMessage): BaseMessageLike {
  if (m.role === 'user') return new HumanMessage(m.content)
  if (m.role === 'tool_result' && m.toolCallId) return new ToolMessage({ content: m.content, tool_call_id: m.toolCallId })
  if (m.role === 'assistant') {
    if (m.toolCalls?.length) {
      return new AIMessage({
        content: m.content || '',
        tool_calls: m.toolCalls.map((tc) => ({
          id: tc.id,
          name: tc.name,
          args: (typeof tc.input === 'object' && tc.input !== null ? tc.input : {}) as Record<string, unknown>,
        })),
      })
    }
    return new AIMessage({ content: m.content })
  }
  return new SystemMessage(m.content)
}

type LangChainToolDef = { type: 'function'; function: { name: string; description: string; parameters: Record<string, unknown> } }

const SANDBOX_TOOL_DEFS: LangChainToolDef[] = [
  {
    type: 'function',
    function: {
      name: 'Bash',
      description: 'Execute a shell command in the sandbox and return stdout/stderr/exitCode.',
      parameters: {
        type: 'object',
        required: ['command'],
        properties: {
          command: { type: 'string', description: 'The shell command to execute' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'Read',
      description: 'Read the contents of a file at the given path.',
      parameters: {
        type: 'object',
        required: ['file_path'],
        properties: {
          file_path: { type: 'string', description: 'Absolute path to the file' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'Write',
      description: 'Write content to a file, creating or overwriting it.',
      parameters: {
        type: 'object',
        required: ['file_path', 'content'],
        properties: {
          file_path: { type: 'string', description: 'Absolute path to the file' },
          content: { type: 'string', description: 'Content to write' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'Glob',
      description: 'List files matching a glob pattern.',
      parameters: {
        type: 'object',
        required: ['pattern'],
        properties: {
          pattern: { type: 'string', description: 'Glob pattern (e.g. "src/**/*.ts")' },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'Grep',
      description: 'Search for a pattern in files.',
      parameters: {
        type: 'object',
        required: ['pattern'],
        properties: {
          pattern: { type: 'string', description: 'Search pattern (regex)' },
          path: { type: 'string', description: 'Directory or file to search in', default: '.' },
        },
      },
    },
  },
]

type McpToolEntry = { server: McpServerConfig; tool: McpToolDefinition }

function buildToolDefinitions(
  hasSandbox: boolean,
  mcpTools?: Map<string, McpToolEntry>,
): LangChainToolDef[] {
  const syscallDefs = listDefaultSyscalls().map((syscall) => ({
    type: 'function' as const,
    function: {
      name: syscall.name,
      description: syscall.description,
      parameters: syscall.inputSchema as Record<string, unknown>,
    },
  }))

  const mcpDefs: LangChainToolDef[] = []
  if (mcpTools) {
    for (const [qualifiedName, entry] of mcpTools) {
      mcpDefs.push({
        type: 'function',
        function: {
          name: qualifiedName,
          description: entry.tool.description || `MCP tool from ${entry.server.name}`,
          parameters: (entry.tool.inputSchema as Record<string, unknown>) || { type: 'object', properties: {} },
        },
      })
    }
  }

  return [
    ...syscallDefs,
    ...(hasSandbox ? SANDBOX_TOOL_DEFS : []),
    ...mcpDefs,
  ]
}

type ToolCallResult = { id: string; name: string; input: unknown }

interface ModelInvokeResult {
  content: string
  toolCalls?: ToolCallResult[]
  stopReason: string
}

async function invokeModelWithTools(
  modelConfig: RagRuntimeConfig,
  apiKeys: ProviderApiKeys,
  lcMessages: BaseMessageLike[],
  toolDefs: LangChainToolDef[],
): Promise<ModelInvokeResult> {
  const route = {
    provider: modelConfig.defaultProvider,
    model: modelConfig.defaultModel,
    fallback: false,
  }
  const rawModel = createRawModel(4096, { route, apiKeys })

  let model = rawModel
  if (toolDefs.length > 0 && typeof rawModel.bindTools === 'function') {
    model = rawModel.bindTools(toolDefs) as typeof rawModel
  }

  const response = await model.invoke(lcMessages as Parameters<typeof model.invoke>[0])
  const aiMsg = response as unknown as AIMessage

  const content = stringifyModelContent(aiMsg.content)
  const rawCalls = (aiMsg as unknown as { tool_calls?: Array<{ id?: string; name: string; args: Record<string, unknown> }> }).tool_calls
  if (rawCalls && rawCalls.length > 0) {
    return {
      content,
      toolCalls: rawCalls.map((tc) => ({
        id: tc.id || `call_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: tc.name,
        input: tc.args,
      })),
      stopReason: 'tool_use',
    }
  }
  return { content, stopReason: 'stop' }
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
    if (url.pathname.endsWith('/resume') && request.method === 'POST') {
      const body = (await request.json().catch(() => ({}))) as {
        sessionId?: string
        message?: string
      }
      const sessionId = body.sessionId ?? url.searchParams.get('sessionId')
      const message = body.message
      if (!sessionId || !message) {
        return Response.json({ error: 'sessionId and message required' }, { status: 400 })
      }
      await this.resumeRun(sessionId, message)
      return Response.json({ ok: true, sessionId })
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
      tools: listDefaultSyscalls().map((s) => s.name),
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
    const toBaseMessage = loopMessageToLangChain
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

    // MCP server discovery — load enabled servers, fetch their tool lists
    let mcpTools = new Map<string, McpToolEntry>()
    try {
      const servers = await loadServers(this.env.DB)
      if (servers.length) {
        mcpTools = await discoverTools(servers, apiKeys as Record<string, string>)
      }
    } catch { /* MCP discovery failure is non-fatal */ }

    const toolDefs = buildToolDefinitions(!!runner, mcpTools)

    // Build skill catalog system message for description-based routing
    let skillCatalog = ''
    try {
      const rows = await this.env.DB.prepare('SELECT name, description FROM user_skills ORDER BY name').all<{ name: string; description: string }>()
      if (rows.results?.length) {
        skillCatalog = 'Available skills (use the skill.read tool to load one by name):\n' +
          rows.results.map((r) => `- ${r.name}: ${r.description}`).join('\n')
      }
    } catch { /* skill catalog failure is non-fatal */ }

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
              const lcMessages: BaseMessageLike[] = [
                ...(skillContext ? [new SystemMessage(`Skill ${options.skill}:\n${skillContext}`)] : []),
                ...(repoContext ? [new SystemMessage(repoContext)] : []),
                ...(skillCatalog ? [new SystemMessage(skillCatalog)] : []),
                ...msgs.map(toBaseMessage),
              ]
              return await invokeModelWithTools(modelConfig, apiKeys, lcMessages, toolDefs)
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e)
              return { content: `model error: ${msg} (skill: ${options.skill ?? 'none'})`, stopReason: 'stop' }
            }
          },
          syscall: async (name, input) => {
            // Route MCP tool calls to the appropriate server
            const mcpEntry = mcpTools.get(name)
            if (mcpEntry && mcpEntry.server.url) {
              const headers: Record<string, string> = {}
              const cred = (apiKeys as Record<string, string>)[mcpEntry.server.name]
              if (cred) headers['Authorization'] = `Bearer ${cred}`
              const result = await mcpCallTool(
                { url: mcpEntry.server.url, headers },
                mcpEntry.tool.name,
                (input ?? {}) as Record<string, unknown>,
              )
              if (result.isError) return `mcp error: ${result.content}`
              return result.content
            }

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

  private async resumeRun(sessionId: string, message: string): Promise<void> {
    const mgr = createSessionManager(this.env.DB)
    const session = await mgr.get(sessionId)
    if (!session) throw new Error('session not found')

    await mgr.transition(session.id, 'running')

    const historyRows = await this.env.DB.prepare(
      'SELECT role, content_json, tool_call_id, tool_name FROM agent_messages WHERE session_id = ? ORDER BY seq',
    )
      .bind(sessionId)
      .all<{ role: string; content_json: string; tool_call_id: string | null; tool_name: string | null }>()

    const history: LoopMessage[] = (historyRows.results ?? []).map((row) => ({
      role: row.role as 'user' | 'assistant' | 'tool_result',
      content: (() => {
        try {
          const parsed = JSON.parse(row.content_json)
          return typeof parsed === 'string' ? parsed : (parsed.text ?? JSON.stringify(parsed))
        } catch {
          return row.content_json
        }
      })(),
      ...(row.tool_call_id ? { toolCallId: row.tool_call_id } : {}),
      ...(row.tool_name ? { toolName: row.tool_name } : {}),
    }))

    const userMsg: LoopMessage = { role: 'user', content: message }
    await this.persistMessage(sessionId, userMsg)
    history.push(userMsg)

    const userEvent: SessionEvent = { type: 'user', content: message }
    await this.persistEventToD1(sessionId, userEvent)
    this.broadcast(userEvent)

    const kernel = createKernel(this.env)
    const modelConfig = resolveModelConfig(session.model ?? undefined)
    const apiKeys = await resolveProviderApiKeys(this.env.DB)

    let mcpTools = new Map<string, McpToolEntry>()
    try {
      const servers = await loadServers(this.env.DB)
      if (servers.length) {
        mcpTools = await discoverTools(servers, apiKeys as Record<string, string>)
      }
    } catch { /* non-fatal */ }

    const toolDefs = buildToolDefinitions(false, mcpTools)

    try {
      await runLoop(
        history,
        {
          sessionId,
          db: this.env.DB,
          kv: this.env.SESSION,
          modelInvoke: async (msgs) => {
            try {
              const lcMessages: BaseMessageLike[] = msgs.map(loopMessageToLangChain)
              return await invokeModelWithTools(modelConfig, apiKeys, lcMessages, toolDefs)
            } catch (e) {
              const msg = e instanceof Error ? e.message : String(e)
              return { content: `model error: ${msg}`, stopReason: 'stop' }
            }
          },
          syscall: async (name, input) => {
            const mcpEntry = mcpTools.get(name)
            if (mcpEntry && mcpEntry.server.url) {
              const headers: Record<string, string> = {}
              const cred = (apiKeys as Record<string, string>)[mcpEntry.server.name]
              if (cred) headers['Authorization'] = `Bearer ${cred}`
              const result = await mcpCallTool(
                { url: mcpEntry.server.url, headers },
                mcpEntry.tool.name,
                (input ?? {}) as Record<string, unknown>,
              )
              if (result.isError) return `mcp error: ${result.content}`
              return result.content
            }

            try {
              return await kernel.tools.syscall(
                { agentId: 'console', runId: sessionId } as unknown as never,
                name as never,
                input as never,
              )
            } catch (e) {
              return `tool:${name} error ${e instanceof Error ? e.message : String(e)}`
            }
          },
          persistMessage: (m) => this.persistMessage(sessionId, m),
          persistEvent: (type, payload) => this.persistLegacyEvent(sessionId, type, payload),
          broadcast: (e) => this.broadcast(e as SessionEvent),
        },
      )
    } catch {
      // runLoop error handled by transition below
    }

    await mgr.transition(session.id, 'done')

    const resultEvent: SessionEvent = { type: 'result', content: 'Session complete', totalTokens: 0, totalCostUsd: 0 }
    await this.persistEventToD1(sessionId, resultEvent)
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
