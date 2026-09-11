import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

const SEARCH_QUERIES = [
  'AI agent news announcement launch',
  'AI model release new benchmark',
  'AI startup funding Series raise',
  'AI agent security vulnerability CVE',
  'AI agent framework SDK update release',
  'AI agent tool MCP server open source',
  'AI agent enterprise deployment case study',
  'AI regulation policy government',
]

const SIGNAL_CATEGORIES = [
  'vendor-update', 'model-release', 'pricing-change', 'benchmark-shift',
  'framework-release', 'funding', 'acquisition', 'security-incident',
  'regulation', 'tool-launch', 'open-source', 'enterprise-deployment',
  'region-news', 'community-signal',
] as const

type SignalCategory = (typeof SIGNAL_CATEGORIES)[number]

interface DailySignal {
  id: string
  title: string
  source: string
  sourceUrl: string
  publishedDate: string
  dateConfidence: 'verified' | 'unverified'
  category: SignalCategory
  companies: string[]
  section: string
  ring: 1 | 2 | 3 | 4
  summary: string
  relevance: number
  crossValidated: boolean
  tags: string[]
}

interface SearchResultItem {
  title?: string
  url?: string
  snippet?: string
}

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function dedupeByUrl(results: SearchResultItem[]): SearchResultItem[] {
  const seen = new Set<string>()
  return results.filter(r => {
    if (!r.url || seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })
}

function classifySignal(title: string, snippet: string): SignalCategory {
  const text = `${title} ${snippet}`.toLowerCase()
  if (/funding|series [a-z]|raise|valuation/i.test(text)) return 'funding'
  if (/acqui|merger|buyout/i.test(text)) return 'acquisition'
  if (/security|vulnerab|cve|exploit|breach/i.test(text)) return 'security-incident'
  if (/pricing|price|cost|deprecat|sunset/i.test(text)) return 'pricing-change'
  if (/benchmark|leaderboard|eval|score/i.test(text)) return 'benchmark-shift'
  if (/model.*release|launch.*model|new.*model|parameter/i.test(text)) return 'model-release'
  if (/framework|sdk|library.*release|update.*version/i.test(text)) return 'framework-release'
  if (/regulat|policy|govern|legislat|eu ai act/i.test(text)) return 'regulation'
  if (/open.?source|github.*release|mcp.*server/i.test(text)) return 'open-source'
  if (/tool|plugin|extension|cli/i.test(text)) return 'tool-launch'
  if (/enterprise|deploy|production|case study/i.test(text)) return 'enterprise-deployment'
  return 'vendor-update'
}

function generateSignalId(date: string, index: number): string {
  return `${date}-${String(index + 1).padStart(3, '0')}`
}

async function loadStageOneTitles(
  syscallContext: unknown,
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>,
  today: string
): Promise<string[]> {
  const contentsResult = await syscall(syscallContext, 'knowledge.github.read', {
    sub: 'repo.contents',
    owner: 'vincentxuu',
    repo: 'quidproquo',
    path: 'src/content/posts/daily',
  }).catch(() => ({ items: [] })) as { items: Array<{ name: string }> }

  return (contentsResult.items ?? [])
    .filter(item => item.name.startsWith(`${today}-`) && item.name.endsWith('.md') && !item.name.endsWith('-en.md'))
    .map(item => item.name.replace(/\.md$/, '').replace(`${today}-`, '').replace(/-/g, ' ').toLowerCase())
}

export interface SignalsDigestInput {
  date?: string
}

export interface SignalsDigestOutput {
  date: string
  signalCount: number
  stored: boolean
  skipped: boolean
}

export const signalsDigestAgent = defineAgent<SignalsDigestInput, SignalsDigestOutput>({
  id: 'daily-digest-signals',
  version: 1,
  displayName: 'Signals Scanner',
  description: 'Stage 2: scan news sources, produce intermediate signals JSON for Stage 3 daily report.',
  syscalls: ['model.invoke', 'knowledge.github.read', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['*.tavily.com', '*.exa.ai', '*.jina.ai'],
  toolCallLimit: 40,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()

    const existing = await e.DB.prepare(
      'SELECT 1 FROM daily_signals WHERE date = ? LIMIT 1'
    ).bind(today).first().catch(() => null)
    if (existing) {
      return { date: today, signalCount: 0, stored: false, skipped: true }
    }

    const stageOneTitles = await loadStageOneTitles(syscallContext, syscall, today)

    const allResults: SearchResultItem[] = []
    for (const query of SEARCH_QUERIES) {
      const searchResult = await syscall(syscallContext, 'search.external', {
        query,
        limit: 10,
        timeoutMs: 8000,
        providers: ['tavily', 'exa'],
      }).catch(() => ({ results: [] })) as { results: SearchResultItem[] }
      allResults.push(...(searchResult.results ?? []))
    }

    const unique = dedupeByUrl(allResults).filter(r => r.title && r.url)
    const signals: DailySignal[] = unique.slice(0, 50).map((r, i) => {
      const category = classifySignal(r.title ?? '', r.snippet ?? '')
      const matchesStageOne = stageOneTitles.some(t =>
        r.title?.toLowerCase().includes(t) || (r.snippet ?? '').toLowerCase().includes(t)
      )
      return {
        id: generateSignalId(today, i),
        title: r.title ?? '',
        source: new URL(r.url ?? 'https://unknown').hostname,
        sourceUrl: r.url ?? '',
        publishedDate: today,
        dateConfidence: 'unverified' as const,
        category,
        companies: [],
        section: '',
        ring: 2 as const,
        summary: (r.snippet ?? '').slice(0, 300),
        relevance: matchesStageOne ? 0.8 : 0.5,
        crossValidated: matchesStageOne,
        tags: [],
      }
    })

    const signalsJson = JSON.stringify({
      date: today,
      generatedAt: new Date().toISOString(),
      routineId: 'daily-digest-signals',
      signalCount: signals.length,
      signals,
    }, null, 2)

    await e.DB.prepare(
      'INSERT INTO daily_signals (date, signals_json, created_at) VALUES (?, ?, ?)'
    ).bind(today, signalsJson, Date.now()).run().catch(() => {})

    await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `chore(daily): signals ${today}`,
      files: [{ path: `src/data/daily-signals/${today}.json`, content: signalsJson }],
    }).catch(() => {})

    return { date: today, signalCount: signals.length, stored: true, skipped: false }
  },
})
