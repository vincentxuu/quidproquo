export const prerender = false

import type { APIRoute } from 'astro'
import { requireAdmin } from '@/lib/auth/admin'
import {
  DEFAULT_EVAL_CASES,
  runEvalBatch,
  type RagPipelineEngine,
} from '../../../lib/rag/admin-eval'
import { json } from '@/lib/api/response'
import { nowIso } from '@/lib/utils/dates'

const SUPPORTED_ENGINES: RagPipelineEngine[] = ['manual', 'langgraph', 'llamaindex']
const MAX_CASES = 12

interface EvalRequestBody {
  engines?: Array<string>
  cases?: number
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const body = await request.json().catch(() => ({})) as EvalRequestBody
  const engines = (body.engines || SUPPORTED_ENGINES)
    .filter((engine): engine is RagPipelineEngine => SUPPORTED_ENGINES.includes(engine as RagPipelineEngine))
    .slice(0)

  if (engines.length === 0) {
    return json({ error: 'No valid engine selected.' }, 400)
  }

  const caseCount = Math.max(1, Math.min(MAX_CASES, Number(body.cases) || DEFAULT_EVAL_CASES.length))
  const testCases = DEFAULT_EVAL_CASES.slice(0, caseCount)
  const origin = new URL(request.url).origin
  const startedAt = nowIso()

  try {
    const result = await runEvalBatch(origin, testCases, engines)
    return json({
      startedAt,
      completedAt: nowIso(),
      cases: caseCount,
      engines: engines.length === 1 ? engines[0] : engines,
      perEngine: result.perEngine,
      rows: result.results.map((row) => ({
        engine: row.engine,
        id: row.id,
        query: row.query,
        category: row.category,
        sourceCount: row.sourceCount,
        passed: row.passed,
        faithfulness: row.faithfulness,
        answerRelevance: row.answerRelevance,
        contextRecall: row.contextRecall,
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to run eval matrix'
    return json({ error: message }, 500)
  }
}


