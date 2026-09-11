import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineAgent } from '../agent/access'
import { createInstallationToken, findStoredGitHubRepository } from '../github/app'

const TRACKED_REPOS = [
  'langchain-ai/langgraph',
  'crewAIInc/crewAI',
  'modelcontextprotocol/specification',
  'mastra-ai/mastra',
  'pydantic/pydantic-ai',
  'agno-agi/agno',
  'anthropics/claude-code',
  'composioHQ/composio',
  'deepset-ai/haystack',
  'stanfordnlp/dspy',
  'huggingface/smolagents',
  'run-llama/llama_index',
]

interface GitHubRelease {
  tag_name: string
  name: string
  body: string
  html_url: string
  published_at: string
  prerelease: boolean
  draft: boolean
}

interface DetectedRelease {
  repo: string
  release: GitHubRelease
  stars: number
  previousTag: string | null
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

export function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

export function isSignificantRelease(release: GitHubRelease): boolean {
  if (release.prerelease || release.draft) return false
  const tag = release.tag_name.replace(/^v/, '')
  if (/alpha|beta|rc|dev|preview|canary/i.test(tag)) return false
  const body = (release.body ?? '').toLowerCase()
  if (body.includes('breaking change') || body.includes('breaking:')) return true
  const parts = tag.split('.')
  if (parts.length >= 2) {
    const minor = parseInt(parts[1], 10)
    if (parts[0] !== '0' && minor === 0) return true
  }
  if (/\bnew\b.*\b(feature|api|module)\b/i.test(body)) return true
  const patchOnly = parts.length >= 3 && /^\d+$/.test(parts[2]) && !body.includes('feat')
  return !patchOnly
}

async function fetchLatestRelease(token: string, repo: string): Promise<{ release: GitHubRelease; previousTag: string | null; stars: number } | null> {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'quidproquo-digest-agent',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const releasesRes = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=2`, { headers })
  if (!releasesRes.ok) return null
  const releases = await releasesRes.json() as GitHubRelease[]
  if (!releases.length) return null

  const repoRes = await fetch(`https://api.github.com/repos/${repo}`, { headers })
  const repoData = repoRes.ok ? await repoRes.json() as { stargazers_count: number } : { stargazers_count: 0 }

  return {
    release: releases[0],
    previousTag: releases[1]?.tag_name ?? null,
    stars: repoData.stargazers_count,
  }
}

export function buildFrontmatter(r: DetectedRelease, today: string, seriesOrder: number): string {
  const name = r.repo.split('/')[1]
  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const tag = r.release.tag_name
  return `---
title: "框架更新｜${name} ${tag}"
date: ${today}
category: daily
tags: [ai-agent, framework, daily, ${slug}]
lang: zh-TW
description: "${r.release.name || `${name} ${tag} release`}"
tldr: ""
series:
  name: "AI Framework Changelog"
  order: ${seriesOrder}
---`
}

function buildPrompt(r: DetectedRelease, today: string): string {
  return `你是 quidproquo.cc 的技術作者。請根據以下 Release Notes 撰寫一篇框架更新文章。

框架：${r.repo}
版本：${r.release.tag_name}
前一版：${r.previousTag ?? '未知'}
發布日：${today}
Stars：${r.stars}
Release URL：${r.release.html_url}

Release Notes：
${(r.release.body ?? '').slice(0, 3000)}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 版本資訊（表格）
2. ## 這個版本為什麼重要（2-3 句）
3. ## 重要變更（列表，每項有「做了什麼 → 影響」）
4. ## Breaking Changes（有就列，沒有就寫「本版本無 breaking changes」）
5. ## 遷移指南（有 breaking change 就寫步驟，沒有就寫「直接升級即可」）
6. ## 與其他框架的對比觀察（1-2 句）
7. ## 今日收穫（認知差：之前以為 X → 現在知道 Y）
8. ## 參考資料（附連結）

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。`
}

export interface FrameworkDigestInput {
  date?: string
}

export interface FrameworkDigestOutput {
  detected: number
  published: number
  skipped: string[]
  commits: Array<{ repo: string; sha: string; url: string }>
}

export const frameworkDigestAgent = defineAgent<FrameworkDigestInput, FrameworkDigestOutput>({
  id: 'daily-digest-framework',
  version: 1,
  displayName: 'Framework Digest',
  description: 'Detect AI Agent framework releases and publish changelog posts.',
  syscalls: ['model.invoke', 'knowledge.github.read', 'knowledge.github.write'],
  memoryScopes: ['agent'],
  secrets: [],
  outboundDomains: ['api.github.com'],
  toolCallLimit: 30,
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

    const detected: DetectedRelease[] = []
    const skipped: string[] = []

    for (const repo of TRACKED_REPOS) {
      const result = await fetchLatestRelease(token, repo).catch(() => null)
      if (!result) { skipped.push(`${repo}: fetch failed`); continue }
      if (result.release.published_at < yesterday) { skipped.push(`${repo}: no new release`); continue }
      if (!isSignificantRelease(result.release)) { skipped.push(`${repo}: patch/pre-release skipped`); continue }
      detected.push({ repo, release: result.release, stars: result.stars, previousTag: result.previousTag })
    }

    if (detected.length === 0) {
      return { detected: 0, published: 0, skipped, commits: [] }
    }

    const existingOrder = await getMaxSeriesOrder(e.DB)
    const commits: FrameworkDigestOutput['commits'] = []

    for (const [i, r] of detected.entries()) {
      const seriesOrder = existingOrder + i + 1
      const frontmatter = buildFrontmatter(r, today, seriesOrder)
      const prompt = buildPrompt(r, today)

      const llmResult = await syscall(syscallContext, 'model.invoke', {
        config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
        stage: 'digest-framework',
        messages: [
          { role: 'system', content: 'You are a technical writer for quidproquo.cc.' },
          { role: 'user', content: prompt },
        ],
        maxTokens: 2000,
      }) as { response: { content: string } }

      const body = String(llmResult.response.content ?? '')
      const name = r.repo.split('/')[1].toLowerCase().replace(/[^a-z0-9-]/g, '-')
      const version = r.release.tag_name.replace(/^v/, '').replace(/[^a-z0-9.-]/gi, '-')
      const zhPath = `src/content/posts/daily/${today}-framework-${name}-${version}.md`
      const zhContent = `${frontmatter}\n\n${body}\n`

      const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
        sub: 'repo.tree.commit',
        owner: 'vincentxuu',
        repo: 'quidproquo',
        message: `post(daily): framework update ${name} ${r.release.tag_name}`,
        files: [{ path: zhPath, content: zhContent }],
      }) as { url: string; sha: string }

      commits.push({ repo: r.repo, sha: commitResult.sha, url: commitResult.url })
    }

    return { detected: detected.length, published: commits.length, skipped, commits }
  },
})

async function getMaxSeriesOrder(db: D1Database): Promise<number> {
  const row = await db.prepare(`
    SELECT MAX(CAST(json_extract(series_json, '$.order') AS INTEGER)) AS max_order
    FROM posts
    WHERE json_extract(series_json, '$.name') = 'AI Framework Changelog'
  `).first<{ max_order: number | null }>().catch(() => null)
  return row?.max_order ?? 0
}
