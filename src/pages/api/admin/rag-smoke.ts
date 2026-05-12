export const prerender = false

import type { APIRoute } from 'astro'
import { verifySession } from '../../../lib/auth/session'
import { runChatSmoke, type RagPipelineEngine } from '../../../lib/rag/admin-eval'
import { initialState } from '../../../lib/rag/state'
import { resolveRagEngine } from '../../../lib/rag/engines/registry'

const SUPPORTED_ENGINES: RagPipelineEngine[] = ['manual', 'langgraph', 'llamaindex']
const DEFAULT_QUERY = 'RAG 的核心步驟是什麼？'

interface SmokeRequestBody {
  engine?: RagPipelineEngine
  query?: string
  mode?: 'query' | 'index'
  indexProfile?: {
    sourceFilters?: Array<'posts' | 'docs'>
    offset?: number
    limit?: number
  }
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!await isAdmin(cookies)) return unauthorized()

  const body = await request.json().catch(() => ({})) as SmokeRequestBody
  const engine = SUPPORTED_ENGINES.includes(body.engine ?? 'langgraph') ? body.engine ?? 'langgraph' : 'langgraph'
  const query = (body.query ?? '').trim() || DEFAULT_QUERY
  const mode = body.mode === 'index' ? 'index' : 'query'
  const origin = new URL(request.url).origin

  if (mode === 'index') {
    return runEngineIndex(engine, {
      mode,
      query,
      indexProfile: body.indexProfile,
    })
  }

  const result = await runChatSmoke(origin, query, engine, 'eval')
  return json({
    mode,
    ...result,
  })
}

async function runEngineIndex(
  engine: RagPipelineEngine,
  options: {
    mode: 'index'
    query: string
    indexProfile?: {
      sourceFilters?: Array<'posts' | 'docs'>
      offset?: number
      limit?: number
    }
  }
) {
  const engineRunner = resolveRagEngine(engine)
  if (!engineRunner.index) {
    return json({ error: `Engine ${engine} has no index method.` }, 400)
  }

  const startedAt = Date.now()
  const config = {
    ...initialState().config,
    pipelineEngine: engine,
  }

  try {
    const result = await engineRunner.index({
      message: options.query,
      traceId: 'admin-index-smoke',
      threadId: crypto.randomUUID(),
      config,
      indexProfile: options.indexProfile,
      conversationSummary: undefined,
    }, {
      onStep: () => {},
      onToken: () => {},
      onRelated: () => {},
    })

    return json({
      mode: 'index',
      engine,
      query: options.query,
      answer: `Index run via ${engine}`,
      sourceCount: result.search_results?.length ?? 0,
      sources: [],
      durationMs: Date.now() - startedAt,
      threadId: 'admin-index-smoke',
      config,
      nativeTrace: result.native_trace,
      traceSteps: result.trace_steps,
      usage: result.token_usage,
      models: result.model_usage,
    })
  } catch (error) {
    return json({ mode: 'index', engine, query: options.query, answer: '', sourceCount: 0, sources: [], durationMs: Date.now() - startedAt, error: error instanceof Error ? error.message : 'index failed' }, 500)
  }
}

async function isAdmin(cookies: Parameters<APIRoute>[0]['cookies']): Promise<boolean> {
  const token = cookies.get('session')?.value
  return token ? verifySession(token) : false
}

function unauthorized(): Response {
  return json({ error: 'unauthorized' }, 401)
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
