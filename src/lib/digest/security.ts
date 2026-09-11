import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'

const SEARCH_QUERIES = [
  '"prompt injection" OR "jailbreak" AI agent attack vulnerability 2026',
  '"MCP" OR "model context protocol" security vulnerability exploit',
  '"AI agent" security incident breach "supply chain" malicious',
  'site:thehackernews.com AI OR LLM OR agent security',
]

const SEVERITY_LEVELS = ['Critical', 'High', 'Medium', 'Low'] as const

interface SecurityIncident {
  title: string
  slug: string
  severity: (typeof SEVERITY_LEVELS)[number]
  attackType: string
  sources: Array<{ title: string; url: string }>
  summary: string
  singleSource: boolean
}

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

interface SearchResultItem {
  title?: string
  url?: string
  snippet?: string
  content?: string
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/-$/, '')
}

function dedupeByUrl(results: SearchResultItem[]): SearchResultItem[] {
  const seen = new Set<string>()
  return results.filter(r => {
    if (!r.url || seen.has(r.url)) return false
    seen.add(r.url)
    return true
  })
}

function isSecurityRelevant(item: SearchResultItem): boolean {
  const text = `${item.title ?? ''} ${item.snippet ?? ''} ${item.content ?? ''}`.toLowerCase()
  const signals = [
    'cve-', 'vulnerability', 'exploit', 'attack', 'injection', 'jailbreak',
    'supply chain', 'malicious', 'breach', 'security advisory', 'poc',
    'prompt injection', 'data exfiltration', 'privilege escalation',
  ]
  return signals.some(s => text.includes(s))
}

function classifyAttackType(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('prompt injection')) return 'prompt-injection'
  if (lower.includes('jailbreak')) return 'jailbreak'
  if (lower.includes('supply chain') || lower.includes('malicious package')) return 'supply-chain'
  if (lower.includes('data exfiltration') || lower.includes('data leak')) return 'data-exfiltration'
  if (lower.includes('privilege escalation')) return 'privilege-escalation'
  return 'security'
}

function estimateSeverity(text: string): (typeof SEVERITY_LEVELS)[number] {
  const lower = text.toLowerCase()
  if (lower.includes('critical') || lower.includes('rce') || lower.includes('remote code execution')) return 'Critical'
  if (lower.includes('high') || lower.includes('exploit') || lower.includes('breach')) return 'High'
  if (lower.includes('medium') || lower.includes('moderate')) return 'Medium'
  return 'Low'
}

function groupIncidents(results: SearchResultItem[]): SecurityIncident[] {
  const groups = new Map<string, SearchResultItem[]>()

  for (const item of results) {
    const text = `${item.title ?? ''} ${item.snippet ?? ''}`
    const attackType = classifyAttackType(text)
    const key = attackType
    const group = groups.get(key) ?? []
    group.push(item)
    groups.set(key, group)
  }

  const incidents: SecurityIncident[] = []
  for (const [, items] of groups) {
    if (items.length === 0) continue
    const primary = items[0]
    const title = primary.title ?? 'Unknown Security Incident'
    const allText = items.map(i => `${i.title ?? ''} ${i.snippet ?? ''}`).join(' ')

    incidents.push({
      title,
      slug: toSlug(title),
      severity: estimateSeverity(allText),
      attackType: classifyAttackType(allText),
      sources: items
        .filter((i): i is SearchResultItem & { url: string } => Boolean(i.url))
        .map(i => ({ title: i.title ?? i.url, url: i.url })),
      summary: (primary.snippet ?? primary.content ?? '').slice(0, 500),
      singleSource: items.length < 2,
    })
  }

  return incidents.filter(i => i.sources.length > 0)
}

function buildFrontmatter(incident: SecurityIncident, today: string, seriesOrder: number): string {
  return `---
title: "資安警報｜${incident.title}"
date: ${today}
category: daily
tags: [ai-agent, security, daily, ${incident.attackType}]
lang: zh-TW
description: "${incident.title}"
tldr: ""
series:
  name: "AI Security Alert"
  order: ${seriesOrder}
---`
}

function buildPrompt(incident: SecurityIncident): string {
  const sourceList = incident.sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.url}`).join('\n')
  const singleSourceWarning = incident.singleSource
    ? '\n⚠️ 這個事件只有單一來源，請在文中標注「⚠️ 單一來源，待驗證」。'
    : ''

  return `你是 quidproquo.cc 的資安技術作者。請根據以下資安事件撰寫警報文章。

事件標題：${incident.title}
事件類型：${incident.attackType}
嚴重程度：${incident.severity}
${singleSourceWarning}

來源：
${sourceList}

事件摘要：
${incident.summary}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 事件概述（3-5 句 + 基本資訊表格：事件類型/影響範圍/嚴重程度/CVE/來源）
2. ## 攻擊面分析（攻擊路徑 + 根本原因 + 對應 OWASP LLM Top 10 哪一項。不寫可直接利用的 payload）
3. ## 防禦做法（「立即動作」列表 + 「長期架構」列表）
4. ## 影響範圍（受影響規模 + 修補 timeline）
5. ## 今日收穫（認知差：之前以為 X → 現在知道 Y）
6. ## 參考資料（附連結）

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。
攻擊面分析不可包含可直接利用的 payload 或完整的攻擊程式碼。`
}

export interface SecurityDigestInput {
  date?: string
}

export interface SecurityDigestOutput {
  incidents: number
  published: number
  skipped: string[]
  commits: Array<{ incident: string; sha: string; url: string }>
}

export const securityDigestAgent = defineAgent<SecurityDigestInput, SecurityDigestOutput>({
  id: 'daily-digest-security',
  version: 1,
  displayName: 'Security Digest',
  description: 'Detect AI security incidents and publish alert posts.',
  syscalls: ['model.invoke', 'knowledge.github.write', 'search.external'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com', '*.tavily.com', '*.exa.ai', '*.jina.ai'],
  toolCallLimit: 40,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()
    const skipped: string[] = []

    const allResults: SearchResultItem[] = []
    for (const query of SEARCH_QUERIES) {
      const searchResult = await syscall(syscallContext, 'search.external', {
        query,
        limit: 10,
        timeoutMs: 8000,
        providers: ['tavily', 'exa', 'jina'],
      }).catch(() => ({ results: [] })) as { results: SearchResultItem[] }
      allResults.push(...(searchResult.results ?? []))
    }

    const deduped = dedupeByUrl(allResults)
    const relevant = deduped.filter(isSecurityRelevant)

    if (relevant.length === 0) {
      return { incidents: 0, published: 0, skipped: ['no security incidents detected'], commits: [] }
    }

    const incidents = groupIncidents(relevant)
    if (incidents.length === 0) {
      return { incidents: 0, published: 0, skipped: ['no actionable incidents after grouping'], commits: [] }
    }

    const existingOrder = await getMaxSeriesOrder(e.DB)
    const commits: SecurityDigestOutput['commits'] = []

    for (const [i, incident] of incidents.entries()) {
      const seriesOrder = existingOrder + i + 1
      const frontmatter = buildFrontmatter(incident, today, seriesOrder)
      const prompt = buildPrompt(incident)

      const llmResult = await syscall(syscallContext, 'model.invoke', {
        config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
        stage: 'digest-security',
        messages: [
          { role: 'system', content: 'You are a security-focused technical writer for quidproquo.cc. Never include exploitable payloads or full attack code.' },
          { role: 'user', content: prompt },
        ],
        maxTokens: 2500,
      }) as { response: { content: string } }

      const body = String(llmResult.response.content ?? '')
      const zhPath = `src/content/posts/daily/${today}-security-${incident.slug}.md`
      const zhContent = `${frontmatter}\n\n${body}\n`

      const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
        sub: 'repo.tree.commit',
        owner: 'vincentxuu',
        repo: 'quidproquo',
        message: `post(daily): security alert ${incident.slug}`,
        files: [{ path: zhPath, content: zhContent }],
      }) as { url: string; sha: string }

      commits.push({ incident: incident.title, sha: commitResult.sha, url: commitResult.url })
    }

    return { incidents: incidents.length, published: commits.length, skipped, commits }
  },
})

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Security Alert'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}
