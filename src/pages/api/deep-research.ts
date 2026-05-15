import type { APIRoute } from 'astro'
import { verifySession } from '../../lib/auth/session'
import { plannerNode } from '../../lib/rag/agents/planner'
import { researchNode } from '../../lib/rag/agents/research'
import { writerNode } from '../../lib/rag/agents/writer'
import { criticNode } from '../../lib/rag/agents/critic'

interface Env {
  URL: string
  SESSION?: KVNamespace
  DEEP_RESEARCH_KV?: KVNamespace
}

export const POST: APIRoute = async ({ request, env, cookies }) => {
  try {
    // 1. Verify session
    const sessionToken = cookies.get('session')?.value
    const authSuccess = sessionToken ? await verifySession(sessionToken) : false
    if (!authSuccess) {
      return new Response('Unauthorized', { status: 401 })
    }

    // 2. Parse request body
    const payload = await request.json()
    const brief = payload.brief
    const userConfig = payload.config || {}

    if (!brief || typeof brief !== 'string') {
      return new Response('Brief is required and must be a string', { status: 400 })
    }

    // 3. Generate unique run ID
    const hash = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const reportId = `dr_report_${hash}`
    const costKey = `dr_cost_${hash}`

    // 4. Load configuration
    const maxQueries = userConfig.maxQueries ?? 3
    const maxTokens = userConfig.maxTokens ?? 256
    const providerPref = userConfig.providerPref ?? 'groq'

    const kv = (env as unknown as Env).DEEP_RESEARCH_KV ?? (env as unknown as Env).SESSION
    if (!kv) {
      return new Response(
        JSON.stringify({ error: 'Deep research KV namespace is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    // 5. Execute planning phase
    const plan = await plannerNode.invoke({ brief, maxAttempts: maxQueries });
    
    // 6. Execute research loop
    const researchResult = await runResearchLoop({
      subQuestions: plan.subtasks || [],
      provider: providerPref,
      maxSearchCalls: userConfig.maxSearchCalls ?? 3,
      maxTokens,
      hash,
    });

    // 7. Generate final report
    const finalReport = await writerNode.invoke({
      brief,
      notes: researchResult,
      provider: providerPref,
      maxTokens,
    });

    // 8. Store report in KV
    await kv.put(reportId, finalReport);
    const reportUrl = `${env.URL}/api/deep-research/${reportId}`;

    // 9. Update cost counter
    const currentCostStr = await kv.get(costKey);
    const currentCost = currentCostStr ? parseFloat(currentCostStr) : 0;
    const estimatedCost = 0.5
    await kv.put(costKey, (currentCost + estimatedCost).toString());

    // 10. Return result
    return new Response(JSON.stringify({
      runId: hash,
      reportUrl,
      status: 'completed',
      summary: finalReport.slice(0, 200) + '…',
    }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Deep research API error:', error)
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Research loop helper function
async function runResearchLoop(opts: {
  subQuestions: string[];
  provider: string;
  maxSearchCalls: number;
  maxTokens: number;
  hash: string;
}) {
  const { subQuestions, provider, maxSearchCalls, hash } = opts;
  const allNotes: Record<string, any> = {};

  for (const sq of subQuestions) {
    // Perform search
    const searchResult = await researchNode.invoke({
      query: sq,
      provider,
      maxAttempts: maxSearchCalls,
      cacheKey: hash + ':' + sq,
    })

    allNotes[sq] = searchResult.notes || [];

    // Early exit check if citations are sufficient
    const citeScore = await criticNode.invoke({
      claim: sq,
      notes: searchResult.notes || [],
      threshold: 0.85,
    })
    if (citeScore.confidence >= 0.85) continue;
  }

  return allNotes;
}
