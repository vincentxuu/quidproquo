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
  'huggingface/smolagents',
  'run-llama/llama_index',
  'stanfordnlp/dspy',
  'deepset-ai/haystack',
  'browser-use/browser-use',
]

const GITHUB_API = 'https://api.github.com'

interface GitHubRelease {
  tag_name: string
  name: string
  body: string
  html_url: string
  published_at: string
  prerelease: boolean
  draft: boolean
}

interface RepoCandidate {
  fullName: string
  description: string
  stars: number
  language: string | null
  url: string
  createdAt: string
  source: 'tracked-release' | 'trending-search' | 'new-repo-search'
}

interface ReleaseCandidate {
  repo: string
  release: GitHubRelease
  stars: number
  previousTag: string | null
}

interface AgentRuntime {
  syscallContext: unknown
  syscall: (ctx: unknown, name: string, input: unknown) => Promise<unknown>
}

function twoDaysAgoIso(): string {
  const d = new Date()
  d.setDate(d.getDate() - 2)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function sevenDaysAgoDate(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString().slice(0, 10)
}

function todayTaipei(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Taipei' })
}

function daysSince(base: string, today: string): number {
  const baseMs = new Date(base).getTime()
  const todayMs = new Date(today).getTime()
  return Math.max(1, Math.round((todayMs - baseMs) / 86_400_000) + 1)
}

async function ghFetch<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'quidproquo-digest-agent',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  return await res.json() as T
}

async function fetchTrackedReleases(token: string, cutoff: string): Promise<ReleaseCandidate[]> {
  const results: ReleaseCandidate[] = []
  for (const repo of TRACKED_REPOS) {
    try {
      const releases = await ghFetch<GitHubRelease[]>(`${GITHUB_API}/repos/${repo}/releases?per_page=2`, token)
      if (!releases.length || releases[0].published_at < cutoff) continue
      if (releases[0].prerelease || releases[0].draft) continue
      const repoData = await ghFetch<{ stargazers_count: number }>(`${GITHUB_API}/repos/${repo}`, token)
      results.push({
        repo,
        release: releases[0],
        stars: repoData.stargazers_count,
        previousTag: releases[1]?.tag_name ?? null,
      })
    } catch { /* skip failed fetches */ }
  }
  return results
}

async function searchNewRepos(token: string, since: string): Promise<RepoCandidate[]> {
  try {
    const data = await ghFetch<{ items: Array<{
      full_name: string
      description: string | null
      stargazers_count: number
      language: string | null
      html_url: string
      created_at: string
    }> }>(`${GITHUB_API}/search/repositories?q=created:>${since}+stars:>100+topic:ai-agent&sort=stars&per_page=10`, token)

    return (data.items ?? []).map(r => ({
      fullName: r.full_name,
      description: r.description ?? '',
      stars: r.stargazers_count,
      language: r.language,
      url: r.html_url,
      createdAt: r.created_at,
      source: 'new-repo-search' as const,
    }))
  } catch {
    return []
  }
}

function dedupeRepos(repos: RepoCandidate[]): RepoCandidate[] {
  const seen = new Map<string, RepoCandidate>()
  for (const r of repos) {
    const key = r.fullName.toLowerCase()
    const existing = seen.get(key)
    if (!existing || r.stars > existing.stars) seen.set(key, r)
  }
  return [...seen.values()]
}

function buildPrompt(
  repos: RepoCandidate[],
  releases: ReleaseCandidate[],
  today: string,
): string {
  const repoSection = repos.map(r =>
    `- ${r.fullName} (⭐${r.stars}, ${r.language ?? 'unknown'}): ${r.description}\n  URL: ${r.url}`
  ).join('\n')

  const releaseSection = releases.length > 0
    ? releases.map(r =>
      `- ${r.repo} ${r.release.tag_name} (⭐${r.stars})\n  URL: ${r.release.html_url}\n  Notes: ${(r.release.body ?? '').slice(0, 800)}`
    ).join('\n')
    : '今日無重要框架更新。'

  return `你是 quidproquo.cc 的技術作者。請根據以下 GitHub 趨勢資料撰寫一篇 AI Agent GitHub Digest。

日期：${today}

## Trending Repos（選 3-5 個最值得寫的）：
${repoSection}

## Notable Releases：
${releaseSection}

請嚴格按以下結構撰寫（zh-TW）：
1. ## 今日亮點（1-2 句，串起主旋律）
2. ## Trending Repos（每個 repo 包含：是什麼、為什麼值得看、技術組合、上手難度）
3. ## Notable Releases（每個有：重要變更、Breaking Changes、對你的影響）
4. ## 今日收穫（認知差：之前以為 X → 現在知道 Y）
5. ## 參考資料（附連結）

注意：用繁體中文（台灣用語），不要用「技術棧」「數據」等中國用語。用「技術組合」取代「技術棧」。`
}

export interface GithubDigestInput {
  date?: string
}

export interface GithubDigestOutput {
  repos: number
  releases: number
  published: boolean
  commit: { sha: string; url: string } | null
}

export const githubDigestAgent = defineAgent<GithubDigestInput, GithubDigestOutput>({
  id: 'daily-digest-github',
  version: 1,
  displayName: 'GitHub Digest',
  description: 'Scan GitHub trending AI/Agent repos and framework releases for a daily digest.',
  syscalls: ['model.invoke', 'knowledge.github.write'],
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
    const cutoff48h = twoDaysAgoIso()
    const since7d = sevenDaysAgoDate()

    const stored = await findStoredGitHubRepository(e.DB, 'vincentxuu/quidproquo')
    if (!stored) throw new Error('quidproquo repo not found in GitHub installations')
    const token = await createInstallationToken(e, stored.installationId)

    const [releases, newRepos] = await Promise.all([
      fetchTrackedReleases(token, cutoff48h),
      searchNewRepos(token, since7d),
    ])

    const allRepos = dedupeRepos(newRepos)
    if (allRepos.length === 0 && releases.length === 0) {
      return { repos: 0, releases: 0, published: false, commit: null }
    }

    const topRepos = allRepos
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 5)

    const topReleases = releases.slice(0, 2)
    const seriesOrder = daysSince('2026-08-16', today)
    const prompt = buildPrompt(topRepos, topReleases, today)

    const llmResult = await syscall(syscallContext, 'model.invoke', {
      config: { defaultProvider: 'groq', defaultModel: 'llama-3.3-70b-versatile' },
      stage: 'digest-github',
      messages: [
        { role: 'system', content: 'You are a technical writer for quidproquo.cc.' },
        { role: 'user', content: prompt },
      ],
      maxTokens: 2500,
    }) as { response: { content: string } }

    const body = String(llmResult.response.content ?? '')
    const frontmatter = `---
title: "AI Agent GitHub Digest — ${today}"
date: ${today}
category: daily
tags: [ai-agent, github, open-source, daily]
lang: zh-TW
description: "AI/Agent GitHub 趨勢掃描"
tldr: ""
series:
  name: "AI Agent GitHub Digest"
  order: ${seriesOrder}
---`

    const filePath = `src/content/posts/daily/${today}-ai-agent-github-digest.md`
    const content = `${frontmatter}\n\n${body}\n`

    const commitResult = await syscall(syscallContext, 'knowledge.github.write', {
      sub: 'repo.tree.commit',
      owner: 'vincentxuu',
      repo: 'quidproquo',
      message: `post(daily): github digest ${today}`,
      files: [{ path: filePath, content }],
    }) as { url: string; sha: string }

    return {
      repos: topRepos.length,
      releases: topReleases.length,
      published: true,
      commit: { sha: commitResult.sha, url: commitResult.url },
    }
  },
})
