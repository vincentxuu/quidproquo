import type { RagRuntimeConfig } from './state'

export type RagPipelineEngine = RagRuntimeConfig['pipelineEngine']
export interface RagSmokeCase {
  id: string
  query: string
  category?: string
}

export interface RagSmokeResult {
  engine: string
  query: string
  id?: string
  category?: string
  answer: string
  sources: { source_url: string }[]
  sourceCount: number
  usage?: {
    input: number
    output: number
  }
  durationMs: number
  threadId?: string
  error?: string
}

export type RagTraceScope = 'production' | 'admin' | 'eval'

export interface RagEvalCaseResult extends RagSmokeResult {
  faithfulness: number
  answerRelevance: number
  contextRecall: number
  passed: boolean
}

export interface RagEvalSummary {
  count: number
  faithfulness: number
  answerRelevance: number
  contextRecall: number
  passed: number
}

const CHUNK_RE = /[\p{L}\p{N}][\p{L}\p{N}-]*/gu

function tokenize(text: string): string[] {
  return (text.match(CHUNK_RE) ?? []).map((token) => token.toLowerCase())
}

function jaccard(a: string, b: string): number {
  const setA = new Set(tokenize(a))
  const setB = new Set(tokenize(b))
  const intersection = [...setA].filter((token) => setB.has(token)).length
  const union = new Set([...setA, ...setB]).size
  return union === 0 ? 0 : intersection / union
}

function scoreCase(
  item: Pick<RagSmokeCase, 'id' | 'query' | 'category'>,
  answer: string,
  sources: unknown[]
): Pick<RagEvalCaseResult, 'id' | 'category' | 'faithfulness' | 'answerRelevance' | 'contextRecall' | 'passed'> {
  const answerRelevance = jaccard(item.query, answer)
  const faithfulness = sources.length > 0
    ? Math.min(1, (answer.match(/\]\(https?:\/\/[^)]+\)/g) ?? []).length / Math.max(1, sources.length))
    : 0
  const contextRecall = item.category === 'not-in-kb'
    ? (sources.length === 0 ? 1 : 0)
    : Math.min(1, sources.length / 3)

  return {
    id: item.id,
    category: item.category,
    faithfulness,
    answerRelevance,
    contextRecall,
    passed: faithfulness >= 0.8 && answerRelevance >= 0.75 && contextRecall >= 0.7,
  }
}

function parseSseEvents(responseBody: ReadableStream<Uint8Array>): Promise<{
  answer: string
  sources: Array<{ source_url: string }>
  usage?: { input: number; output: number }
  threadId?: string
  error?: { type: string; message: string }
}> {
  const reader = responseBody.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let answer = ''
  const sources: Array<{ source_url: string }> = []
  let usage: { input: number; output: number } | undefined
  let threadId: string | undefined
  let errorPayload: { type: string; message: string } | undefined

  const parseBlock = (block: string) => {
    const lines = block.split('\n')
    let eventType = 'token'
    let dataStr = ''

    for (const line of lines) {
      if (!line.trim()) continue
      if (line.startsWith('event:')) eventType = line.slice(6).trim()
      else if (line.startsWith('data:')) dataStr = line.slice(5).trim()
    }
    if (!dataStr) return

    try {
      const data = JSON.parse(dataStr)
      if (eventType === 'token') answer += data.text ?? ''
      if (eventType === 'sources') {
        if (Array.isArray(data)) {
          sources.length = 0
          for (const item of data) {
            if (item && typeof item.url === 'string' && item.url) {
              sources.push({ source_url: item.url })
            }
            if (item && typeof item.source_url === 'string' && item.source_url) {
              sources.push({ source_url: item.source_url })
            }
          }
        }
      }
      if (eventType === 'done') {
        if (typeof data.thread_id === 'string') threadId = data.thread_id
        if (data.usage) usage = data.usage as { input: number; output: number }
      }
      if (eventType === 'error') errorPayload = { type: 'chat-error', message: data.message ?? 'chat error' }
    } catch {
      // ignore malformed event payload
    }
  }

  return (async () => {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() ?? ''
      for (const block of blocks) {
        if (block.trim()) parseBlock(block)
      }
    }

    if (buffer.trim()) parseBlock(buffer)
    return { answer, sources: [...sources], usage, threadId, error: errorPayload }
  })()
}

export async function runChatSmoke(
  origin: string,
  query: string,
  engine: RagPipelineEngine,
  traceScope: RagTraceScope = 'production',
): Promise<RagSmokeResult> {
  const start = Date.now()
  const response = await fetch(`${origin}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: query, pipelineEngine: engine, traceScope }),
  })

  if (!response.ok || !response.body) {
    return {
      engine,
      query,
      answer: '',
      sources: [],
      sourceCount: 0,
      durationMs: Date.now() - start,
      error: `Chat request failed (${response.status})`,
    }
  }

  try {
    const parsed = await parseSseEvents(response.body)
    return {
      engine,
      query,
      answer: parsed.answer,
      sources: parsed.sources,
      sourceCount: parsed.sources.length,
      usage: parsed.usage,
      threadId: parsed.threadId,
      durationMs: Date.now() - start,
      error: parsed.error?.message,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'chat stream parse failed'
    return {
      engine,
      query,
      answer: '',
      sources: [],
      sourceCount: 0,
      durationMs: Date.now() - start,
      error: message,
    }
  }
}

export async function runEvalBatch(
  origin: string,
  cases: RagSmokeCase[],
  engines: RagPipelineEngine[],
): Promise<{
  results: RagEvalCaseResult[]
  perEngine: Record<string, RagEvalSummary>
}> {
  const results: RagEvalCaseResult[] = []
  const perEngine = new Map<string, RagEvalSummary>()

  for (const engine of engines) {
    const aggregate = {
      count: 0,
      faithfulness: 0,
      answerRelevance: 0,
      contextRecall: 0,
      passed: 0,
    }
    for (const testCase of cases) {
      const smoke = await runChatSmoke(origin, testCase.query, engine, 'eval')
      const score = scoreCase(testCase, smoke.answer, smoke.sources)
      const row: RagEvalCaseResult = {
        ...score,
        id: testCase.id,
        category: testCase.category,
        engine,
        query: testCase.query,
        answer: smoke.answer,
        sourceCount: smoke.sourceCount,
        sources: smoke.sources,
        durationMs: smoke.durationMs,
        threadId: smoke.threadId,
      }
      if (smoke.usage) {
        row.usage = smoke.usage
      }
      if (smoke.error) {
        row.passed = false
        row.faithfulness = 0
        row.answerRelevance = 0
        row.contextRecall = 0
      }
      results.push(row)

      aggregate.count += 1
      aggregate.faithfulness += row.faithfulness
      aggregate.answerRelevance += row.answerRelevance
      aggregate.contextRecall += row.contextRecall
      aggregate.passed += row.passed ? 1 : 0
    }

    perEngine.set(engine, {
      count: aggregate.count,
      faithfulness: aggregate.count > 0 ? aggregate.faithfulness / aggregate.count : 0,
      answerRelevance: aggregate.count > 0 ? aggregate.answerRelevance / aggregate.count : 0,
      contextRecall: aggregate.count > 0 ? aggregate.contextRecall / aggregate.count : 0,
      passed: aggregate.passed,
    })
  }

  const normalizedSummaries: Record<string, RagEvalSummary> = {}
  for (const [engine, summary] of perEngine) {
    normalizedSummaries[engine] = summary
  }

  return {
    results,
    perEngine: normalizedSummaries,
  }
}

export const DEFAULT_EVAL_CASES: RagSmokeCase[] = [
  { id: 'q01', query: '你寫過哪些 AI Agent 相關的文章？', category: 'precise-query' },
  { id: 'q02', query: 'Context Engineering 跟 Prompt Engineering 差在哪？', category: 'concept' },
  { id: 'q03', query: 'Cloudflare D1 batch timeout 要怎麼解？', category: 'precise-query' },
  { id: 'q04', query: 'LangGraph 適合什麼情境？', category: 'concept' },
  { id: 'q05', query: 'RAG failure modes 你提過哪些？', category: 'cross-post' },
  { id: 'q06', query: 'How do you compare HyDE and reranking?', category: 'cross-post' },
  { id: 'q07', query: '請幫我整理 multi-agent RAG 的核心設計模式', category: 'cross-post' },
  { id: 'q08', query: '用中文解釋 answer relevance 為什麼重要', category: 'concept' },
  { id: 'q09', query: '請總結你有提過 semantic cache threshold 的取捨', category: 'precise-query' },
  { id: 'q10', query: '你有提過 OpenAI realtime API pricing 嗎？', category: 'not-in-kb' },
]
