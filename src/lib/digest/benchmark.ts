import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

interface BenchmarkEntry {
  rank: number
  model: string
  score: string
  previousScore?: string
  change?: string
}

interface BenchmarkSnapshot {
  id: string
  name: string
  url: string
  date: string
  entries: BenchmarkEntry[]
}

interface RankingChange {
  benchmark: string
  url: string
  type: 'new_leader' | 'new_top3' | 'score_jump' | 'new_entrant'
  model: string
  detail: string
  currentEntries: BenchmarkEntry[]
  previousEntries: BenchmarkEntry[]
}

const TRACKED_BENCHMARKS = [
  { id: 'lmsys', name: 'LMSYS Chatbot Arena', url: 'https://lmarena.ai/?leaderboard' },
  { id: 'swebench', name: 'SWE-bench Verified', url: 'https://www.swebench.com/' },
  { id: 'morphllm', name: 'MorphLLM Leaderboard', url: 'https://morphllm.com/leaderboard' },
  { id: 'open-llm', name: 'Open LLM Leaderboard', url: 'https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard' },
]

const SEARCH_QUERIES = [
  '"benchmark" "leaderboard" "new SOTA" OR "state of the art" AI agent coding 2026',
  '"SWE-bench" OR "Chatbot Arena" OR "LMSYS" new result score 2026',
]

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

interface SearchResult {
  title: string
  url: string
  snippet: string
}

async function searchBenchmarkNews(
  syscallContext: unknown,
  syscall: AgentRuntime['syscall'],
): Promise<SearchResult[]> {
  const allResults: SearchResult[] = []
  for (const query of SEARCH_QUERIES) {
    const result = await syscall(syscallContext, 'search.external', {
      query,
      limit: 8,
      timeoutMs: 10000,
      providers: ['tavily', 'exa'],
    }).catch(() => ({ results: [] })) as { results: SearchResult[] }
    allResults.push(...(result.results ?? []))
  }
  const seen = new Set<string>()
  return allResults.filter(r => {
    if (seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })
}

async function extractRankingsFromSearch(
  syscallContext: unknown,
  syscall: AgentRuntime['syscall'],
  searchResults: SearchResult[],
  benchmarks: typeof TRACKED_BENCHMARKS,
): Promise<Map<string, BenchmarkEntry[]>> {
  const snippetContext = searchResults
    .map(r => `[${r.title}](${r.url})\n${r.snippet}`)
    .join('\n\n')
    .slice(0, 4000)

  if (!snippetContext.trim()) return new Map()

  const benchmarkList = benchmarks.map(b => b.id).join(', ')
  const llmResult = await syscall(syscallContext, 'model.invoke', {
    config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
    stage: 'digest-benchmark-extract',
    messages: [
      { role: 'system', content: `Extract AI benchmark leaderboard rankings from search results. Return JSON only.` },
      { role: 'user', content: `From the following search results, extract the top 5 rankings for any of these benchmarks: ${benchmarkList}.

Search results:
${snippetContext}

Return JSON: {"benchmarks": {"<benchmark_id>": [{"rank": 1, "model": "...", "score": "..."}]}}
Only include benchmarks where you found concrete ranking data with model names and scores.` },
    ],
    maxTokens: 1000,
  }) as { response: { content: string } }

  try {
    const parsed = JSON.parse(String(llmResult.response.content ?? '{}'))
    const result = new Map<string, BenchmarkEntry[]>()
    if (parsed.benchmarks && typeof parsed.benchmarks === 'object') {
      for (const [id, entries] of Object.entries(parsed.benchmarks)) {
        if (Array.isArray(entries)) {
          result.set(id, entries.filter(
            (e): e is BenchmarkEntry => typeof e === 'object' && e !== null && 'rank' in e && 'model' in e && 'score' in e
          ))
        }
      }
    }
    return result
  } catch {
    return new Map()
  }
}

async function loadSnapshot(db: D1Database, benchmarkId: string): Promise<BenchmarkSnapshot | null> {
  const row = await db.prepare(
    `SELECT snapshot_json FROM admin_settings WHERE key = ?`
  ).bind(`benchmark_snapshot:${benchmarkId}`).first<{ snapshot_json: string }>().catch(() => null)
  if (!row?.snapshot_json) return null
  try { return JSON.parse(row.snapshot_json) } catch { return null }
}

async function saveSnapshot(db: D1Database, snapshot: BenchmarkSnapshot): Promise<void> {
  await db.prepare(
    `INSERT INTO admin_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
  ).bind(`benchmark_snapshot:${snapshot.id}`, JSON.stringify(snapshot)).run()
}

function detectChanges(
  benchmarkId: string,
  benchmarkName: string,
  benchmarkUrl: string,
  current: BenchmarkEntry[],
  previous: BenchmarkEntry[],
): RankingChange[] {
  if (current.length === 0) return []
  const changes: RankingChange[] = []
  const prevTop1 = previous[0]?.model
  const currTop1 = current[0]?.model

  if (prevTop1 && currTop1 && prevTop1 !== currTop1) {
    changes.push({
      benchmark: benchmarkName,
      url: benchmarkUrl,
      type: 'new_leader',
      model: currTop1,
      detail: `${currTop1} overtook ${prevTop1} for #1`,
      currentEntries: current,
      previousEntries: previous,
    })
  }

  const prevTop3Models = new Set(previous.slice(0, 3).map(e => e.model))
  for (const entry of current.slice(0, 3)) {
    if (!prevTop3Models.has(entry.model) && previous.length > 0) {
      changes.push({
        benchmark: benchmarkName,
        url: benchmarkUrl,
        type: 'new_top3',
        model: entry.model,
        detail: `${entry.model} entered top 3 at rank ${entry.rank}`,
        currentEntries: current,
        previousEntries: previous,
      })
    }
  }

  const prevModels = new Set(previous.map(e => e.model))
  for (const entry of current.slice(0, 10)) {
    if (!prevModels.has(entry.model) && previous.length > 0) {
      changes.push({
        benchmark: benchmarkName,
        url: benchmarkUrl,
        type: 'new_entrant',
        model: entry.model,
        detail: `${entry.model} new to top 10 at rank ${entry.rank} with ${entry.score}`,
        currentEntries: current,
        previousEntries: previous,
      })
    }
  }

  return changes
}

function buildPrompt(changes: RankingChange[], today: string): string {
  const changeSummary = changes.map(c =>
    `- [${c.benchmark}] ${c.type}: ${c.detail}\n  Current top 5: ${c.currentEntries.slice(0, 5).map(e => `${e.rank}. ${e.model} (${e.score})`).join(', ')}`
  ).join('\n')

  return `你是 quidproquo.cc 的技術作者。請根據以下 Benchmark 排名變動撰寫一篇異動報告。

日期：${today}

偵測到的排名變動：
${changeSummary}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 異動摘要（2-3 句：哪個 benchmark 變了？誰上來了？這代表什麼？）
2. ## 排名變化（表格：排名、模型/Agent、分數、前次分數、變化）
3. ## 分析：這次洗牌代表什麼（技術面、方法論面、產業面三層）
4. ## 今日收穫（認知差）
5. ## 參考資料

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。
⚠️ 標注自測結果 vs 獨立複現。`
}

export interface BenchmarkDigestInput {
  date?: string
}

export interface BenchmarkDigestOutput {
  scanned: number
  changes: number
  published: number
  skipped: string[]
  commits: Array<{ benchmark: string; sha: string; url: string }>
}

export const benchmarkDigestAgent = defineAgent<BenchmarkDigestInput, BenchmarkDigestOutput>({
  id: 'daily-digest-benchmark',
  version: 1,
  displayName: 'Benchmark Digest',
  description: 'Detect AI benchmark leaderboard shifts and publish ranking change reports.',
  syscalls: ['model.invoke', 'search.external', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.tavily.com', 'api.exa.ai'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()
    const skipped: string[] = []

    const searchResults = await searchBenchmarkNews(syscallContext, syscall)
    if (searchResults.length === 0) {
      skipped.push('no benchmark news found in search')
    }

    const extracted = await extractRankingsFromSearch(syscallContext, syscall, searchResults, TRACKED_BENCHMARKS)

    const allChanges: RankingChange[] = []
    for (const benchmark of TRACKED_BENCHMARKS) {
      const currentEntries = extracted.get(benchmark.id) ?? []
      if (currentEntries.length === 0) {
        skipped.push(`${benchmark.id}: no ranking data extracted`)
        continue
      }

      const previousSnapshot = await loadSnapshot(e.DB, benchmark.id)
      const previousEntries = previousSnapshot?.entries ?? []

      const changes = detectChanges(benchmark.id, benchmark.name, benchmark.url, currentEntries, previousEntries)
      allChanges.push(...changes)

      await saveSnapshot(e.DB, {
        id: benchmark.id,
        name: benchmark.name,
        url: benchmark.url,
        date: today,
        entries: currentEntries,
      })
    }

    if (allChanges.length === 0) {
      return { scanned: TRACKED_BENCHMARKS.length, changes: 0, published: 0, skipped, commits: [] }
    }

    const existingOrder = await getMaxSeriesOrder(e.DB)
    const prompt = buildPrompt(allChanges, today)

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-benchmark',
      messages: [
        { role: 'system', content: 'You are a technical writer for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 2500,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const benchmarkSlugs = [...new Set(allChanges.map(c => c.benchmark.toLowerCase().replace(/[^a-z0-9]+/g, '-')))]
    const slug = benchmarkSlugs.length === 1 ? benchmarkSlugs[0] : 'multi'
    const titleChange = allChanges[0].detail
    const seriesOrder = existingOrder + 1

    const frontmatter = `---
title: "Benchmark 異動｜${allChanges[0].benchmark}：${titleChange.slice(0, 60)}"
date: ${today}
category: daily
tags: [ai-agent, benchmark, daily, ${benchmarkSlugs.join(', ')}]
lang: zh-TW
description: "${titleChange}"
tldr: ""
series:
  name: "AI Benchmark Watch"
  order: ${seriesOrder}
---`

    const zhPath = `src/content/posts/daily/${today}-benchmark-${slug}.md`
    const zhContent = `${frontmatter}\n\n${body}\n`

    const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): benchmark ${slug} ${today}`,
      files: [{ path: zhPath, content: zhContent }],
    }) as { url: string; sha: string }

    return {
      scanned: TRACKED_BENCHMARKS.length,
      changes: allChanges.length,
      published: 1,
      skipped,
      commits: [{ benchmark: slug, sha: commitResult.sha, url: commitResult.url }],
    }
  },
})

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Benchmark Watch'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}
