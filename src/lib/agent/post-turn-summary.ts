import { listByCategory } from '../providers/registry'
import { routeWithFallback } from '../providers/routing-fallback'
import { createInMemoryProviderBackends } from '../providers/storage/test/in-memory'
import { invokeModel, type ProviderApiKeys } from '../retrieval/model'
import { createSessionManager, type PostTurnSummary } from './session-manager'
import type { Flags } from '../config/flags'

const VALID_CATEGORIES = new Set(['working', 'waiting_input', 'completed', 'failed', 'needs_review'])

const SYSTEM_PROMPT = `You are a concise status summarizer for an AI agent session. Given the conversation so far, produce a JSON object with exactly three fields:

{
  "status_category": one of "working" | "waiting_input" | "completed" | "failed" | "needs_review",
  "status_detail": a single sentence (under 80 chars) describing what happened or is happening,
  "needs_action": true if the session needs human attention, false otherwise
}

Rules:
- "working": agent is still executing
- "waiting_input": agent asked a question or needs approval
- "completed": task finished successfully
- "failed": task encountered an error
- "needs_review": task finished but results should be reviewed
- Reply with ONLY the JSON object, no markdown fences, no extra text.`

export interface SummaryDeps {
  db: D1Database
  sessionId: string
  messages: Array<{ role: string; content: string }>
  apiKeys?: ProviderApiKeys
  flags?: Flags
}

export async function generatePostTurnSummary(deps: SummaryDeps): Promise<PostTurnSummary> {
  const { db, sessionId, messages, apiKeys = {}, flags } = deps

  const lastMessages = messages.slice(-6).map((m) => [m.role, m.content] as [string, string])

  let rawContent: string | undefined

  const registeredLlm = listByCategory('llm').filter((p) => p.isEnabled)
  if (flags?.providers?.enabled && registeredLlm.length > 0) {
    try {
      const backends = createInMemoryProviderBackends()
      const result = (await routeWithFallback({
        category: 'llm',
        input: { messages: lastMessages, apiKeys },
        policy: { order: registeredLlm.map((p) => p.providerId) },
        backends,
        dispatch: async (_providerId, inp) => {
          const i = inp as { messages: [string, string][]; apiKeys: ProviderApiKeys }
          const llmMessages: Array<[string, string]> = [['system', SYSTEM_PROMPT], ...i.messages]
          const { response } = await invokeModel(
            { provider: 'groq', model: 'llama-3.1-8b-instant' } as never,
            'post_turn_summary',
            llmMessages,
            256,
            i.apiKeys,
          )
          const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content)
          return content
        },
        flags,
      })) as string
      rawContent = result
    } catch {
      // fall through to fallback
    }
  }

  if (!rawContent) {
    try {
      const llmMessages: Array<[string, string]> = [['system', SYSTEM_PROMPT], ...lastMessages]
      const { response } = await invokeModel(
        { provider: 'groq', model: 'llama-3.1-8b-instant' } as never,
        'post_turn_summary',
        llmMessages,
        256,
        apiKeys,
      )
      rawContent = typeof response.content === 'string' ? response.content : JSON.stringify(response.content)
    } catch {
      // LLM unavailable — return a safe default
    }
  }

  const summary = parseSummary(rawContent)

  const mgr = createSessionManager(db)
  await mgr.updateSummary(sessionId, summary)

  return summary
}

function parseSummary(raw: string | undefined): PostTurnSummary {
  if (!raw) return { status_category: 'working', status_detail: 'Status unavailable', needs_action: false }

  try {
    const cleaned = raw.replace(/```json\s*|```\s*/g, '').trim()
    const parsed = JSON.parse(cleaned) as Record<string, unknown>

    const category = typeof parsed.status_category === 'string' && VALID_CATEGORIES.has(parsed.status_category)
      ? parsed.status_category
      : 'working'
    const detail = typeof parsed.status_detail === 'string'
      ? parsed.status_detail.slice(0, 120)
      : 'Status unavailable'
    const needsAction = typeof parsed.needs_action === 'boolean' ? parsed.needs_action : false

    return { status_category: category, status_detail: detail, needs_action: needsAction }
  } catch {
    return { status_category: 'working', status_detail: 'Status unavailable', needs_action: false }
  }
}
