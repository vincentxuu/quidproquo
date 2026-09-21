import { HumanMessage } from '@langchain/core/messages'
import {
  initialState,
  type GraphState,
  type NativeTraceEvent,
  type PipelineCallbacks,
  type RagMessage,
  type SearchResult,
} from '../../../retrieval/state'
import { createRawModel, extractReasoningText, resolveModelRoute, type ChatModelResponse, type ProviderApiKeys } from '../../../retrieval/model'
import { plannerNode } from '../../../retrieval/agents/planner'
import { criticNode } from '../../../retrieval/agents/critic'
import { relatedPostsNode } from '../../../retrieval/agents/related-posts'
import { normalizeCitationUrl, validateDraft, validateSourceUrls } from '../../../retrieval/agents/validation'
import { searchBlogPosts } from '../../../retrieval/tools/search-posts'
import { getPostDetailMarkdown } from '../../../tool-registry/definitions/get-post-detail'
import { countUniquePostResults, dedupePostResultsByDocument, formatSearchExcerpt } from '../../../retrieval/search-result-format'
import { normalizeAnswerLanguage } from '../../../retrieval/language'
import { runLangGraphQuery } from '../langgraph/query'
import type { RagLifecycleInput, RagLifecycleOutput } from '../contract'
import { runAgentLoop, type AgentModelResponse, type AgentToolHandler, type AgentToolResult } from './loop'
import { buildAgentSystemPrompt } from './prompt'

/**
 * Ask AI 的 agent 引擎：Planner 做意圖／語言／離題把關（程式控制），
 * 之後由單一 agent 自己決定搜幾次、讀哪篇全文、何時作答；
 * 程式負責步數、時間、引用檢查與備援。硬失敗（模型不支援工具、
 * 迴圈丟例外、收尾仍無文字）就退回 langgraph 固定 pipeline。
 */

export const AGENT_LIMITS = {
  maxToolCalls: 8,
  maxTurns: 7,
  deadlineMs: 60_000,
  invokeTimeoutMs: 45_000,
  searchLimit: 6,
  postDetailMaxChars: 6_000,
  excerptChars: 320,
} as const

const SITE_ORIGIN = 'https://quidproquo.cc'

const TOOL_SCHEMAS = [
  {
    type: 'function',
    function: {
      name: 'search_posts',
      description: 'Hybrid search over the blog posts. Returns matching posts with title, url, slug and an excerpt. Use a different, more specific query if the first search misses.',
      parameters: {
        type: 'object',
        required: ['query'],
        properties: { query: { type: 'string', description: 'Search query in the language of the blog post you expect to find' } },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_post_detail',
      description: 'Full Markdown of one blog post, by slug (as returned by search_posts). Use when excerpts are not enough to answer faithfully.',
      parameters: {
        type: 'object',
        required: ['slug'],
        properties: { slug: { type: 'string', description: 'Post slug, e.g. "ai/2024-01-15-rag-intro"' } },
      },
    },
  },
] as const

type RawToolCall = { id?: string; name: string; args?: Record<string, unknown> }
type RawAiMessage = ChatModelResponse & { tool_calls?: RawToolCall[] }
type BoundModel = { invoke: (messages: RagMessage[]) => Promise<unknown> }

export class AgentEngineUnsupported extends Error {}

function contentToText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : typeof part === 'object' && part && 'text' in part ? String((part as { text: unknown }).text ?? '') : ''))
      .join('')
  }
  return ''
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, describe: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Agent model call timed out after ${timeoutMs}ms (${describe})`)), timeoutMs)
    promise.then((v) => { clearTimeout(timer); resolve(v) }, (e) => { clearTimeout(timer); reject(e) })
  })
}

function postUrl(slug: string): string {
  return `${SITE_ORIGIN}/posts/${slug}`
}

/** 把不在工具結果內的引用降級成純文字，讓答案不會帶著幻覺連結出去。 */
export function stripDisallowedLinks(markdown: string, allowedUrls: Set<string>): string {
  const allowed = new Set([...allowedUrls].map(normalizeCitationUrl))
  return markdown.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label: string, url: string) =>
    allowed.has(normalizeCitationUrl(url)) ? match : label,
  )
}

export async function runAgentQuery(input: RagLifecycleInput, callbacks: PipelineCallbacks): Promise<RagLifecycleOutput> {
  const startedAt = Date.now()
  const events: NativeTraceEvent[] = []
  const apiKeys: ProviderApiKeys = input.providerApiKeys ?? {}
  const config = { ...input.config, pipelineEngine: 'agent' as const }
  const state: GraphState = {
    ...initialState(),
    thread_id: input.threadId ?? crypto.randomUUID(),
    conversation_summary: input.conversationSummary,
    page_context: input.pageContext,
    config,
    messages: [new HumanMessage(input.message)] as RagMessage[],
    langfuse_trace_id: input.traceId,
  }
  const record = (stage: string, stageStartedAt: number, summary: string, metadata?: Record<string, unknown>) => {
    const duration_ms = Math.max(0, Date.now() - stageStartedAt)
    events.push({ stage, at: new Date(stageStartedAt).toISOString(), duration_ms, metadata })
    state.trace_steps.push({ stage, started_at: new Date(stageStartedAt).toISOString(), duration_ms, input_summary: input.message.slice(0, 240), output_summary: summary, metadata })
  }
  const forwardReasoning = (stage: string, text: string | undefined) => {
    if (text) callbacks.onReasoning?.({ stage, text })
  }

  // ---- 1. Planner：意圖、語言、離題／需澄清的把關（程式控制，不交給 agent）----
  if (config.plannerEnabled) {
    const plannerStartedAt = Date.now()
    const update = await plannerNode(state, { apiKeys })
    Object.assign(state, update)
    record('planner', plannerStartedAt, `${state.plan.intent} / ${state.plan.complexity}`, { intent: state.plan.intent, language: state.language })
    callbacks.onStep('Planner', { intent: state.plan.intent, search_keywords: state.plan.search_keywords })
    forwardReasoning('planner', update.model_usage?.at(-1)?.reasoning)
    if (state.plan.intent === 'off-topic' || state.plan.needs_clarification) {
      return { ...state, native_trace: { engine: 'agent', version: '1', events } }
    }
  }

  // ---- 2. Agent 迴圈 ----
  const collected = new Map<string, SearchResult>()
  const lang = state.language === 'en' ? 'en' : 'zh-TW'

  const tools: Record<string, AgentToolHandler> = {
    async search_posts(args): Promise<AgentToolResult> {
      const query = String(args.query ?? '').trim()
      if (!query) throw new Error('query is required')
      const results = await searchBlogPosts({ query, lang, limit: AGENT_LIMITS.searchLimit })
      for (const r of results) collected.set(r.chunk_id, r)
      const unique = dedupePostResultsByDocument(results)
      const forModel = unique.map((r) => ({
        title: r.title ?? r.slug ?? r.source_url,
        url: r.source_url,
        slug: r.slug,
        excerpt: formatSearchExcerpt(r.evidence_excerpt, AGENT_LIMITS.excerptChars),
      }))
      return {
        content: JSON.stringify(forModel),
        summary: {
          query,
          search_keywords: [query],
          sources_found: countUniquePostResults(results),
          results: unique.map((r) => ({ title: r.title ?? r.source_url, url: r.source_url, type: 'post' })),
        },
      }
    },
    async get_post_detail(args): Promise<AgentToolResult> {
      const slug = String(args.slug ?? '').trim().replace(/^\/?posts\//, '')
      if (!/^[a-z0-9-/]+$/i.test(slug)) throw new Error('invalid slug')
      const markdown = await getPostDetailMarkdown(slug)
      const found = !markdown.startsWith(`Post "${slug}" not found.`)
      const title = found ? (markdown.match(/^# (.+)$/m)?.[1] ?? slug) : slug
      if (found) {
        const chunkId = `post:${slug}`
        if (!collected.has(chunkId)) {
          collected.set(chunkId, {
            claim: title,
            evidence_excerpt: markdown.slice(0, 1_500),
            source_url: postUrl(slug),
            chunk_id: chunkId,
            date: '',
            relevance_score: 1,
            images: [],
            links: [],
            type: 'post',
            slug,
            title,
          })
        }
      }
      const truncated = markdown.length > AGENT_LIMITS.postDetailMaxChars
        ? `${markdown.slice(0, AGENT_LIMITS.postDetailMaxChars)}\n\n[... truncated ...]`
        : markdown
      return {
        content: found ? JSON.stringify({ url: postUrl(slug), markdown: truncated }) : JSON.stringify({ error: `not found: ${slug}` }),
        summary: { slug, title, found, results: found ? [{ title, url: postUrl(slug), type: 'post' }] : [] },
      }
    },
  }

  const route = resolveModelRoute(config, 'agent')
  const rawModel = createRawModel(2_048, { config, stage: 'agent', apiKeys })
  if (typeof rawModel.bindTools !== 'function') {
    throw new AgentEngineUnsupported(`${route.provider}/${route.model} does not support tool calling`)
  }
  const withTools = rawModel.bindTools(TOOL_SCHEMAS) as BoundModel
  const withoutTools = rawModel as unknown as BoundModel

  const invoke = async (messages: RagMessage[], options: { allowTools: boolean; turn: number }): Promise<AgentModelResponse> => {
    const model = options.allowTools ? withTools : withoutTools
    const raw = (await withTimeout(model.invoke(messages), AGENT_LIMITS.invokeTimeoutMs, `agent turn ${options.turn}`)) as RawAiMessage
    const toolCalls = (raw.tool_calls ?? []).map((c, i) => ({ id: c.id ?? `call_${options.turn}_${i}`, name: c.name, args: c.args ?? {} }))
    return {
      text: contentToText(raw.content),
      toolCalls,
      usage: { input: raw.usage_metadata?.input_tokens ?? 0, output: raw.usage_metadata?.output_tokens ?? 0 },
      reasoning: extractReasoningText(raw) || undefined,
    }
  }

  const loopStartedAt = Date.now()
  const loop = await runAgentLoop(
    {
      invoke,
      tools,
      limits: AGENT_LIMITS,
      onTurn: ({ turn, response, durationMs, final }) => {
        const stage = final ? 'writer' : 'agent_turn'
        state.model_usage.push({ stage: 'agent', provider: route.provider, model: route.model, fallback: false, ...(response.reasoning ? { reasoning: response.reasoning } : {}) })
        forwardReasoning(final ? 'writer' : 'agent', response.reasoning)
        record(stage, Date.now() - durationMs, final ? `${response.text.length} chars` : `${response.toolCalls.length} tool calls`, { turn })
        if (!final) callbacks.onStep('Agent', { turn, tool_calls: response.toolCalls.map((c) => c.name) })
      },
      onToolCall: ({ call, result, error, durationMs }) => {
        const agent = call.name === 'search_posts' ? 'Research' : call.name === 'get_post_detail' ? 'ReadPost' : 'Tool'
        record(`tool:${call.name}`, Date.now() - durationMs, error ?? 'ok', { args: call.args, ...result?.summary })
        callbacks.onStep(agent, { ...result?.summary, ...(error ? { error } : {}) })
      },
    },
    { systemPrompt: buildAgentSystemPrompt(state, AGENT_LIMITS), question: input.message, conversationSummary: input.conversationSummary },
  )
  state.token_usage = { input: state.token_usage.input + loop.usage.input, output: state.token_usage.output + loop.usage.output }
  state.search_results = [...collected.values()]
  state.iteration = loop.turns
  record('agent_loop', loopStartedAt, `${loop.turns} turns, ${loop.toolCallCount} tool calls${loop.forcedFinish ? ', forced finish' : ''}`, {
    turns: loop.turns,
    tool_calls: loop.toolCallCount,
    forced_finish: loop.forcedFinish,
    unique_posts: countUniquePostResults(state.search_results),
  })

  if (loop.empty) {
    throw new Error('agent loop produced no answer')
  }
  callbacks.onStep('Writer')

  // ---- 3. 引用檢查：只准引用工具結果內的 URL；先讓模型修一次，再不行就把壞連結降級成文字 ----
  let draft = normalizeAnswerLanguage(loop.answer, state.language)
  const validationStartedAt = Date.now()
  let sourceErrors = validateSourceUrls(draft, state)
  if (sourceErrors.length > 0) {
    const allowed = [...new Set(state.search_results.map((r) => r.source_url))]
    const repair = await invoke(
      [
        ...loop.messages,
        new HumanMessage(
          `Your answer cites URLs that were not returned by the tools:\n${sourceErrors.join('\n')}\n\nRewrite the complete answer. Cite only these URLs, exactly as written:\n${allowed.join('\n')}\nIf a claim has no matching URL, keep it uncited or drop it.`,
        ),
      ],
      { allowTools: false, turn: loop.turns + 1 },
    )
    state.token_usage = { input: state.token_usage.input + (repair.usage?.input ?? 0), output: state.token_usage.output + (repair.usage?.output ?? 0) }
    const repaired = normalizeAnswerLanguage(repair.text, state.language).trim()
    if (repaired) draft = repaired
    sourceErrors = validateSourceUrls(draft, state)
    if (sourceErrors.length > 0) {
      draft = stripDisallowedLinks(draft, new Set(state.search_results.map((r) => r.source_url)))
    }
  }
  state.draft = draft
  state.validation = validateDraft(state)
  record('deterministic_validation', validationStartedAt, state.validation.passed ? 'passed' : `failed: ${state.validation.errors.join('; ')}`, { errors: state.validation.errors, repaired: sourceErrors.length > 0 })
  callbacks.onStep('Validation', { passed: state.validation.passed })

  // ---- 4. Critic 只打分數（信心／相關性），不再觸發重試迴圈 ----
  if (config.criticEnabled && state.draft.trim()) {
    const criticStartedAt = Date.now()
    try {
      const update = await criticNode(state, { apiKeys })
      Object.assign(state, update)
      record('critic', criticStartedAt, `confidence=${state.critique.confidence}`, { confidence: state.critique.confidence })
      forwardReasoning('critic', update.model_usage?.at(-1)?.reasoning)
    } catch (err) {
      record('critic', criticStartedAt, `skipped: ${err instanceof Error ? err.message : String(err)}`)
    }
    callbacks.onStep('Critic')
  }

  state.final_response = state.draft

  // ---- 5. 延伸閱讀 ----
  const relatedStartedAt = Date.now()
  try {
    const update = await relatedPostsNode(state)
    Object.assign(state, update)
  } catch {
    state.related_posts = []
  }
  record('related', relatedStartedAt, `${state.related_posts.length} posts`)
  if (state.related_posts.length > 0) callbacks.onRelated(state.related_posts)

  return {
    ...state,
    native_trace: { engine: 'agent', version: '1', events, metadata: { total_ms: Date.now() - startedAt, route: `${route.provider}/${route.model}` } },
  }
}

/** 對外入口：agent 引擎硬失敗時退回 langgraph 固定 pipeline，不回空答案。 */
export async function runAgentQueryWithFallback(input: RagLifecycleInput, callbacks: PipelineCallbacks): Promise<RagLifecycleOutput> {
  try {
    return await runAgentQuery(input, callbacks)
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    console.warn('[agent-engine] falling back to langgraph:', reason)
    callbacks.onStep('Fallback', { reason, engine: 'langgraph' })
    const output = await runLangGraphQuery({ ...input, config: { ...input.config, pipelineEngine: 'langgraph' } }, callbacks)
    return {
      ...output,
      config: { ...output.config, pipelineEngine: 'agent' },
      native_trace: { engine: 'agent', version: '1', events: [{ stage: 'fallback', at: new Date().toISOString(), metadata: { reason } }, ...(output.native_trace?.events ?? [])] },
    }
  }
}
