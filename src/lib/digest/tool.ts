import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'
import { createInstallationToken, findStoredGitHubRepository } from '../github/app'

interface GitHubSearchResult {
  full_name: string
  description: string | null
  stargazers_count: number
  created_at: string
  html_url: string
  license: { spdx_id: string } | null
  language: string | null
}

interface CandidateTool {
  name: string
  fullName: string
  description: string
  url: string
  stars: number
  language: string
  license: string
  readme: string
  type: 'mcp-server' | 'cli-tool' | 'sdk' | 'vscode-extension' | 'framework-plugin'
}

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

function yesterdayIso(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

const SEARCH_QUERIES = [
  'MCP server',
  'model context protocol',
  'AI agent tool CLI SDK',
]

function classifyToolType(name: string, description: string, readme: string): CandidateTool['type'] {
  const combined = `${name} ${description} ${readme}`.toLowerCase()
  if (combined.includes('mcp') && (combined.includes('server') || combined.includes('model context protocol'))) return 'mcp-server'
  if (combined.includes('vscode') || combined.includes('vs code') || combined.includes('extension')) return 'vscode-extension'
  if (combined.includes('plugin') || combined.includes('integration')) return 'framework-plugin'
  if (combined.includes('sdk') || combined.includes('library') || combined.includes('client')) return 'sdk'
  return 'cli-tool'
}

function isWorthRecommending(repo: GitHubSearchResult, readme: string): boolean {
  if (repo.stargazers_count < 5) return false
  if (!readme || readme.length < 200) return false
  const lower = readme.toLowerCase()
  if (!lower.includes('install') && !lower.includes('usage') && !lower.includes('getting started') && !lower.includes('quick start')) return false
  return true
}

async function searchGitHub(token: string, query: string, yesterday: string): Promise<GitHubSearchResult[]> {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'quidproquo-digest-agent',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const q = encodeURIComponent(`${query} created:>${yesterday.slice(0, 10)}`)
  const res = await fetch(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=15`, { headers })
  if (!res.ok) return []
  const data = await res.json() as { items: GitHubSearchResult[] }
  return data.items ?? []
}

async function fetchReadme(token: string, fullName: string): Promise<string> {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'quidproquo-digest-agent',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, { headers })
  if (!res.ok) return ''
  const data = await res.json() as { content: string; encoding: string }
  if (data.encoding !== 'base64' || !data.content) return ''
  return atob(data.content.replace(/\n/g, '')).slice(0, 3000)
}

function buildFrontmatter(tool: CandidateTool, today: string, seriesOrder: number): string {
  return `---
title: "工具推薦｜${tool.name} — ${tool.description.slice(0, 60)}"
date: ${today}
category: daily
tags: [ai-agent, tool, daily, ${tool.type}]
lang: zh-TW
description: "${tool.description.slice(0, 120)}"
tldr: "${tool.name} 是 ${tool.description.slice(0, 80)}。GitHub：${tool.url}"
series:
  name: "AI Tool of the Day"
  order: ${seriesOrder}
---`
}

function buildPrompt(tool: CandidateTool): string {
  return `你是 quidproquo.cc 的技術作者。請根據以下工具資訊撰寫一篇工具推薦文章。

工具名稱：${tool.name}
GitHub：${tool.fullName}（${tool.url}）
Stars：${tool.stars}
語言：${tool.language}
授權：${tool.license}
類型：${tool.type}
描述：${tool.description}

README（前 3000 字元）：
${tool.readme}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 工具資訊（表格：名稱/類型/GitHub/Stars/語言/授權/安裝指令）
2. ## 解決什麼問題（2-3 段：痛點、解法、適合場景）
3. ## 快速上手（安裝 + 基本用法，可複製執行的程式碼）
4. ## 與現有工具的比較（表格或 bullet）
5. ## 注意事項（1-3 個使用陷阱）
6. ## 今日收穫（認知差：之前以為 X → 現在知道 Y）
7. ## 參考資料（附連結）

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。安裝指令從 README 中提取，不要猜。`
}

export interface ToolDigestInput {
  date?: string
}

export interface ToolDigestOutput {
  candidates: number
  published: number
  skipped: string[]
  commit: { name: string; sha: string; url: string } | null
}

export const toolDigestAgent = defineAgent<ToolDigestInput, ToolDigestOutput>({
  id: 'daily-digest-tool',
  version: 1,
  displayName: 'Tool Digest',
  description: 'Discover and recommend noteworthy AI tools and MCP servers.',
  syscalls: ['model.invoke', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com'],
  toolCallLimit: 20,
  timeoutSeconds: 300,
  irreversibleActionsRequireApproval: false,

  async run(input, runtime) {
    const { syscallContext, syscall } = runtime as AgentRuntime
    const e = env as unknown as Env
    const today = input.date ?? todayTaipei()
    const yesterday = yesterdayIso()

    const stored = await findStoredGitHubRepository(e.DB, 'vincentxuu/quidproquo')
    if (!stored) throw new Error('quidproquo repo not found in GitHub installations')
    const token = await createInstallationToken(e, stored.installationId)

    const seen = new Set<string>()
    const allResults: GitHubSearchResult[] = []
    for (const query of SEARCH_QUERIES) {
      const results = await searchGitHub(token, query, yesterday).catch(() => [])
      for (const r of results) {
        if (!seen.has(r.full_name)) {
          seen.add(r.full_name)
          allResults.push(r)
        }
      }
    }

    const skipped: string[] = []
    const candidates: CandidateTool[] = []

    for (const repo of allResults.slice(0, 20)) {
      const readme = await fetchReadme(token, repo.full_name).catch(() => '')
      if (!isWorthRecommending(repo, readme)) {
        skipped.push(`${repo.full_name}: failed quality filter`)
        continue
      }
      const name = repo.full_name.split('/')[1]
      candidates.push({
        name,
        fullName: repo.full_name,
        description: repo.description ?? name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language ?? 'Unknown',
        license: repo.license?.spdx_id ?? 'Not specified',
        readme,
        type: classifyToolType(name, repo.description ?? '', readme),
      })
    }

    candidates.sort((a, b) => {
      const typeOrder = { 'mcp-server': 0, 'sdk': 1, 'cli-tool': 2, 'framework-plugin': 3, 'vscode-extension': 4 }
      const typeDiff = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9)
      if (typeDiff !== 0) return typeDiff
      return b.stars - a.stars
    })

    const pick = candidates[0]
    if (!pick) {
      return { candidates: 0, published: 0, skipped, commit: null }
    }

    const existingOrder = await getMaxSeriesOrder(e.DB)
    const frontmatter = buildFrontmatter(pick, today, existingOrder + 1)
    const prompt = buildPrompt(pick)

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-tool',
      messages: [
        { role: 'system', content: 'You are a technical writer for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 2000,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const slug = pick.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const zhPath = `src/content/posts/daily/${today}-tool-${slug}.md`
    const zhContent = `${frontmatter}\n\n${body}\n`

    const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): tool recommendation ${pick.name}`,
      files: [{ path: zhPath, content: zhContent }],
    }) as { url: string; sha: string }

    return {
      candidates: candidates.length,
      published: 1,
      skipped,
      commit: { name: pick.name, sha: commitResult.sha, url: commitResult.url },
    }
  },
})

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Tool of the Day'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}
