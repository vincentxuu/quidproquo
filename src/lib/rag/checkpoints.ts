import { env } from 'cloudflare:workers'
import type { GraphState } from './state'

interface CheckpointEnv {
  DB: D1Database
}

function estimateTokenCount(state: Pick<GraphState, 'messages' | 'draft' | 'search_results' | 'conversation_summary'>): number {
  const text = [
    state.conversation_summary ?? '',
    ...state.messages.map(message => typeof message.content === 'string' ? message.content : ''),
    state.draft,
    ...state.search_results.map(result => result.evidence_excerpt),
  ].join('\n')

  return Math.ceil(text.length / 4)
}

export async function loadLatestCheckpoint(threadId: string): Promise<string | undefined> {
  const { DB } = env as unknown as CheckpointEnv
  try {
    const row = await DB.prepare(
      'SELECT summary FROM checkpoints WHERE thread_id = ? ORDER BY created_at DESC LIMIT 1'
    ).bind(threadId).first<{ summary: string }>()

    return row?.summary
  } catch {
    return undefined
  }
}

export async function maybeSaveCheckpoint(
  state: GraphState,
  thresholdRatio: number,
  modelContextWindow = 8192
): Promise<void> {
  const estimatedTokens = estimateTokenCount(state)
  if (estimatedTokens < modelContextWindow * thresholdRatio) return

  const { DB } = env as unknown as CheckpointEnv
  const summary = [
    state.conversation_summary,
    `Latest question: ${typeof state.messages[state.messages.length - 1]?.content === 'string' ? state.messages[state.messages.length - 1].content : ''}`,
    `Latest answer: ${state.final_response}`,
    state.coverage_gaps.length > 0 ? `Coverage gaps: ${state.coverage_gaps.join(', ')}` : '',
  ].filter(Boolean).join('\n')

  try {
    await DB.prepare(
      `INSERT INTO checkpoints (thread_id, checkpoint_id, summary, turn_count, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`
    )
      .bind(state.thread_id, crypto.randomUUID(), summary, state.iteration)
      .run()
  } catch {
    // Ignore checkpoint persistence failure to keep chat available in local/dev without migrations.
  }
}
