import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import { verifySession } from '../../lib/auth/session'
import { checkAndIncrementRateLimit } from '../../lib/auth/rate-limit'
import { runPipeline } from '../../lib/rag/pipeline'
import { createSpan, createTrace, scoreTrace, updateTrace } from '../../lib/langfuse'
import { loadRagSettings, buildShadowBaselineConfig } from '../../lib/rag/settings'
import { loadLatestCheckpoint, maybeSaveCheckpoint } from '../../lib/rag/checkpoints'
import { lookupSemanticCache, storeSemanticCache } from '../../lib/rag/cache'
import type { GraphState, RagRuntimeConfig } from '../../lib/rag/state'

interface Env { DB: D1Database }
type PipelineEngineOverride = RagRuntimeConfig['pipelineEngine']
type TraceScope = 'production' | 'admin' | 'eval'

type ChatBody = {
  message: string
  thread_id?: string
  pipelineEngine?: PipelineEngineOverride
  traceScope?: TraceScope
}

type StepEvent = {
  agent: string
  at: string
  extra?: Record<string, unknown>
}

type SpanCandidate = {
  step: GraphState['trace_steps'][number]
  index: number
}

type SpanMappingMode = 'mapped' | 'fallback' | 'unobserved'

type BuiltStepSpan = {
  span: {
    id: string
    traceId: string
    name: string
    input?: unknown
    output?: unknown
    startTime?: string
    endTime?: string
    metadata?: Record<string, unknown>
  }
  stepIndex: number
  mappingMode: SpanMappingMode
}

async function getVisitorLimit(): Promise<number> {
  const { DB } = env as unknown as Env
  const row = await DB.prepare('SELECT value FROM settings WHERE key = ?')
    .bind('visitor_daily_limit').first<{ value: string }>()
  return parseInt(row?.value ?? '5', 10)
}

function sseEvent(type: string, data: unknown): string {
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`
}

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const sessionToken = cookies.get('session')?.value
  const isAdmin = sessionToken ? await verifySession(sessionToken) : false
  const startedAt = Date.now()

  if (!isAdmin) {
    const ip = clientAddress ?? request.headers.get('CF-Connecting-IP') ?? 'unknown'
    const limit = await getVisitorLimit()
    const rateResult = await checkAndIncrementRateLimit(ip, limit)
    if (!rateResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'rate_limit', message: `Daily limit reached. Resets at ${rateResult.resetAt}` }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  const body = await request.json() as ChatBody
  const { message, thread_id = crypto.randomUUID() } = body
  const traceScope = normalizeTraceScope(body.traceScope, isAdmin)

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: 'Empty message' }), { status: 400 })
  }

  const traceId = crypto.randomUUID()
  const ip = clientAddress ?? request.headers.get('CF-Connecting-IP') ?? 'unknown'
  const ragConfig = await loadRagSettings()
  const requestedEngine = body.pipelineEngine
  if (requestedEngine && ['langgraph', 'manual', 'llamaindex'].includes(requestedEngine)) {
    ragConfig.pipelineEngine = requestedEngine
  }
  const checkpointSummary = await loadLatestCheckpoint(thread_id)
  const enqueueTraceOp = (op: Promise<void>) => {
    void op.catch((error) => {
      console.error('[langfuse] trace op failed', error)
    })
  }
  const traceStepEvents: StepEvent[] = []

  const cached = await lookupSemanticCache(message, ragConfig.semanticCacheThreshold).catch(() => null)
  if (cached) {
    return new Response(new ReadableStream({
      start(controller) {
        const send = (type: string, data: unknown) => {
          controller.enqueue(new TextEncoder().encode(sseEvent(type, data)))
        }
        send('token', { text: cached.response })
        send('done', {
          usage: { input: 0, output: 0 },
          confidence: cached.confidence,
          thread_id,
          cached: true,
        })
        controller.close()
      },
    }), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }

  enqueueTraceOp(createTrace({
    id: traceId,
    name: 'blog-rag',
    userId: isAdmin ? 'owner' : ip,
    input: { message },
    metadata: {
      request_path: '/api/chat',
      trace_scope: traceScope,
      pipeline_engine: ragConfig.pipelineEngine,
      thread_id,
      started_at: new Date(startedAt).toISOString(),
      request_user: isAdmin ? 'owner' : ip,
    },
  }))

  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, data: unknown) => {
        controller.enqueue(new TextEncoder().encode(sseEvent(type, data)))
      }

      try {
        const state = await runPipeline(
          { message, traceId, threadId: thread_id, conversationSummary: checkpointSummary, config: ragConfig },
          {
            onStep: (agent, extra) => {
              traceStepEvents.push({
                agent,
                at: new Date().toISOString(),
                extra,
              })
              send('agent_step', { agent, status: 'completed', ...extra })
            },
            onToken: (text) => send('token', { text }),
            onRelated: (posts) => send('related', posts),
          }
        )

        if (ragConfig.shadowModeEnabled) {
          const shadowState = await runPipeline(
            {
              message,
              traceId: `${traceId}:shadow`,
              threadId: thread_id,
              conversationSummary: checkpointSummary,
              config: buildShadowBaselineConfig(ragConfig),
            },
            {
              onStep: () => {},
              onToken: () => {},
              onRelated: () => {},
            }
          )

          const { DB } = env as unknown as Env
          await DB.prepare(
            `INSERT INTO shadow_runs (
              id, trace_id, thread_id, query, primary_response, primary_confidence,
              shadow_response, shadow_confidence, config_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            crypto.randomUUID(),
            traceId,
            thread_id,
            message,
            state.final_response ?? '',
            state.critique?.confidence ?? 1,
            shadowState.final_response ?? '',
            shadowState.critique?.confidence ?? 1,
            JSON.stringify(ragConfig)
          ).run().catch(() => {})
        }

        const seenUrls = new Set<string>()
        const sources = state.search_results
          .filter(r => { if (seenUrls.has(r.source_url)) return false; seenUrls.add(r.source_url); return true })
          .map(r => ({ title: r.title ?? r.source_url, url: r.source_url, slug: r.slug }))
        if (sources.length > 0) send('sources', sources)

        const remainingQuota = !isAdmin
          ? await (async () => {
              const limit2 = await getVisitorLimit()
              const key = `rate:${ip}:${new Date().toISOString().slice(0, 10)}`
              const used = parseInt((await (env as unknown as { RATE: KVNamespace }).RATE.get(key)) ?? '0', 10)
              return Math.max(0, limit2 - used)
            })()
          : null

        send('done', {
          usage: state.token_usage,
          confidence: state.critique?.confidence ?? 1,
          thread_id,
          ...(remainingQuota !== null ? { remaining: remainingQuota } : {}),
        })
        const builtSpans = buildStepSpans({
          traceId,
          state,
          events: traceStepEvents,
          traceScope,
          pipelineEngine: ragConfig.pipelineEngine,
          threadId: thread_id,
        })
        const stepSpanMapping = new Map<number, SpanMappingMode>()
        for (const built of builtSpans) {
          stepSpanMapping.set(built.stepIndex, built.mappingMode)
          enqueueTraceOp(createSpan(built.span))
        }

        const { DB } = env as unknown as Env
        await DB.prepare(
          'INSERT INTO chat_logs (id, thread_id, ip, is_admin, query, response, confidence, langfuse_trace_id) VALUES (?,?,?,?,?,?,?,?)'
        ).bind(
          crypto.randomUUID(), thread_id, ip, isAdmin ? 1 : 0,
          message, state.final_response ?? '',
          state.critique?.confidence ?? 1, traceId
        ).run()

        enqueueTraceOp(updateTrace(traceId, {
          output: { response: state.final_response },
          metadata: {
            confidence: state.critique?.confidence,
            status: 'success',
            request_path: '/api/chat',
            duration_ms: Date.now() - startedAt,
            trace_scope: traceScope,
            answer_relevance: state.critique?.answer_relevance,
            intent_alignment: state.critique?.intent_alignment,
            drift_detected: state.critique?.drift_detected,
            chunks: state.search_results.length,
            thread_id,
            config: ragConfig,
            pipeline_engine: ragConfig.pipelineEngine,
            model_usage: state.model_usage,
            trace_steps: state.trace_steps,
          },
        }))
        const confidenceScore = clampTraceScore(state.critique?.confidence, 'confidence', traceId)
        const answerRelevanceScore = clampTraceScore(state.critique?.answer_relevance, 'answer_relevance', traceId)
        const intentAlignmentScore = clampTraceScore(state.critique?.intent_alignment, 'intent_alignment', traceId)

        if (confidenceScore !== null) {
          enqueueTraceOp(scoreTrace(traceId, 'confidence', confidenceScore))
        }
        if (answerRelevanceScore !== null) {
          enqueueTraceOp(scoreTrace(traceId, 'answer_relevance', answerRelevanceScore))
        }
        if (intentAlignmentScore !== null) {
          enqueueTraceOp(scoreTrace(traceId, 'intent_alignment', intentAlignmentScore))
        }
        await storeSemanticCache(message, state.final_response ?? '', state.critique?.confidence ?? 0).catch(() => {})
        await maybeSaveCheckpoint(state, ragConfig.checkpointThresholdRatio).catch(() => {})
        await persistTraceSteps(traceId, thread_id, state, traceScope, stepSpanMapping).catch(() => {})

      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Internal error'
        enqueueTraceOp(updateTrace(traceId, {
          output: { error: msg },
          metadata: {
            status: 'error',
            request_path: '/api/chat',
            error_summary: msg,
            duration_ms: Date.now() - startedAt,
            trace_scope: traceScope,
          },
        }))
        send('error', { type: 'internal', message: msg })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

async function persistTraceSteps(
  traceId: string,
  threadId: string,
  state: Awaited<ReturnType<typeof runPipeline>>,
  traceScope: TraceScope,
  stepSpanMapping: Map<number, SpanMappingMode> = new Map()
): Promise<void> {
  const { DB } = env as unknown as Env
  const nativeTrace = state.native_trace
  const pipelineEngine = nativeTrace?.engine ?? state.config.pipelineEngine
  const nativeTraceSummary = nativeTrace
    ? {
      event_count: nativeTrace.events.length,
      engine: nativeTrace.engine,
      version: nativeTrace.version,
      metadata: nativeTrace.metadata,
    }
    : undefined

  for (const [index, step] of state.trace_steps.entries()) {
    const spanMappingMode = stepSpanMapping.get(index) ?? 'unobserved'
    const isLastStep = index === state.trace_steps.length - 1
    await DB.prepare(
      `INSERT INTO rag_trace_steps (
        id, trace_id, thread_id, stage, started_at, duration_ms,
        input_summary, output_summary, token_input, token_output, metadata_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      crypto.randomUUID(),
      traceId,
      threadId,
      step.stage,
      step.started_at,
      step.duration_ms,
      step.input_summary,
      step.output_summary,
      step.tokens?.input ?? null,
      step.tokens?.output ?? null,
      JSON.stringify({
        ...step.metadata,
        model_usage: state.model_usage.filter(item => item.stage === step.stage),
        pipeline_engine: pipelineEngine,
        span_mapping_mode: spanMappingMode,
        span_observed: spanMappingMode !== 'unobserved',
        trace_scope: traceScope,
        ...(isLastStep && nativeTraceSummary ? { native_trace: nativeTrace } : { native_trace_summary: nativeTraceSummary }),
      })
    ).run()
  }

  if (!nativeTrace) return
  await DB.prepare(
    `INSERT INTO rag_trace_steps (
      id, trace_id, thread_id, stage, started_at, duration_ms,
      input_summary, output_summary, token_input, token_output, metadata_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    crypto.randomUUID(),
    traceId,
    threadId,
    'native_trace',
    new Date().toISOString(),
    0,
    'Native trace summary',
    'Native trace persisted',
    0,
    0,
    JSON.stringify({
      native_trace: nativeTrace,
      pipeline_engine: pipelineEngine,
      trace_scope: traceScope,
      native_trace_summary: nativeTraceSummary,
    })
  ).run()
}

function normalizeStepName(stage: string): string {
  return stage.toLowerCase().replace(/[^a-z0-9]+/g, '_')
}

function mapAgentToStep(agent: string): string {
  const normalized = agent.startsWith('eval:') ? agent.slice(5) : agent
  if (normalized === 'Planner') return 'planner'
  if (normalized === 'Research') return 'research'
  if (normalized === 'Normalize') return 'normalize_results'
  if (normalized === 'Writer') return 'writer'
  if (normalized === 'Validation') return 'deterministic_validation'
  if (normalized === 'Critic') return 'critic'
  if (normalized === 'Fallback') return 'fallback'
  if (normalized === 'Related') return 'related'
  if (normalized === 'Retriever') return 'llamaindex_retriever'
  return normalizeStepName(normalized)
}

function safeSpanMetadata(extra?: Record<string, unknown>): Record<string, unknown> {
  return extra ?? {}
}

function clampTraceScore(value: unknown, metric: string, traceId: string): number | null {
  if (typeof value !== 'number') {
    if (typeof value !== 'undefined') {
      console.warn('[langfuse] invalid score type', { traceId, metric, valueType: typeof value })
    }
    return null
  }

  if (!Number.isFinite(value)) {
    console.warn('[langfuse] invalid score', { traceId, metric, reason: 'not finite number', value })
    return null
  }

  if (value < 0 || value > 1) {
    console.warn('[langfuse] score out of range', { traceId, metric, value })
    return null
  }

  return value
}

function buildStepSpans({
  traceId,
  state,
  events,
  traceScope,
  pipelineEngine,
  threadId,
}: {
  traceId: string
  state: Awaited<ReturnType<typeof runPipeline>>
  events: StepEvent[]
  traceScope: TraceScope
  pipelineEngine: RagRuntimeConfig['pipelineEngine']
  threadId: string
}): BuiltStepSpan[] {
  const stepBuckets = new Map<string, SpanCandidate[]>()
  const consumed = new Set<number>()
  const allCandidates = state.trace_steps.map((step, index) => ({ step, index }))

  state.trace_steps.forEach((step, index) => {
    const key = normalizeStepName(step.stage)
    const list = stepBuckets.get(key) ?? []
    list.push({ step, index })
    stepBuckets.set(key, list)
  })

  return events.flatMap((event, eventIndex) => {
    const target = normalizeStepName(mapAgentToStep(event.agent))
    const mappedCandidates = (stepBuckets.get(target) ?? [])
    const chosen = mappedCandidates.find((candidate) => !consumed.has(candidate.index))
      ?? allCandidates.find((candidate) => !consumed.has(candidate.index))

    if (!chosen) return []

    const usedMapped = mappedCandidates.some((candidate) => candidate.index === chosen.index)
    const startedAt = new Date(chosen.step.started_at)
    const endAt = new Date(startedAt.getTime() + chosen.step.duration_ms).toISOString()
    const normalizedAgent = event.agent.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const stepSummary = {
      stage_input: chosen.step.input_summary,
      trace_scope: traceScope,
      pipeline_engine: pipelineEngine,
      event: safeSpanMetadata(event.extra),
      event_index: eventIndex,
      thread_id: threadId,
    }
    const stepOutput = {
      stage_output: chosen.step.output_summary,
      step_index: chosen.index,
      step_metadata: chosen.step.metadata,
      token_usage: chosen.step.tokens,
    }

    consumed.add(chosen.index)

    return [{
      span: {
        id: `${traceId}:${normalizedAgent}:${chosen.index + 1}`,
        traceId,
        name: usedMapped ? `rag.${event.agent}` : 'rag.trace_step',
        input: stepSummary,
        output: stepOutput,
        startTime: startedAt.toISOString(),
        endTime: endAt,
        metadata: {
          ...chosen.step.metadata,
          ...safeSpanMetadata(event.extra),
          step_stage: chosen.step.stage,
          step_duration_ms: chosen.step.duration_ms,
          step_index: chosen.index,
          event_agent: event.agent,
          event_index: eventIndex,
          event_at: event.at,
          mapped_step: target,
          step_mapping_mode: usedMapped ? 'mapped' : 'fallback',
          trace_scope: traceScope,
          pipeline_engine: pipelineEngine,
          request_path: '/api/chat',
        },
      },
      stepIndex: chosen.index,
      mappingMode: usedMapped ? 'mapped' : 'fallback',
    }]
  })
}

function normalizeTraceScope(requestedScope: string | undefined, isAdminUser: boolean): TraceScope {
  if (requestedScope === 'admin' || requestedScope === 'eval' || requestedScope === 'production') {
    return requestedScope
  }
  return isAdminUser ? 'admin' : 'production'
}
