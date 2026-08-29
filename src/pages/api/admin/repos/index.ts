export const prerender = false

import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { requireAdmin } from '@/lib/auth/admin'
import { json } from '@/lib/api/response'
import { defaultRepositories, listStoredGitHubRepositories } from '@/lib/github/app'

async function addReposFromQuery(db: D1Database, repos: Set<string>, sql: string): Promise<void> {
  const result = await db.prepare(sql).all<{ repo: string }>().catch(() => ({ results: [] }))
  for (const row of result.results ?? []) {
    const repo = String(row.repo ?? '').trim()
    if (repo) repos.add(repo)
  }
}

export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireAdmin(cookies)
  if (!auth.ok) return auth.response

  const e = env as unknown as Env
  const repos = new Map<string, { fullName: string; private: boolean; defaultBranch: string | null; source: string }>()

  for (const repo of defaultRepositories()) {
    repos.set(repo.fullName, {
      fullName: repo.fullName,
      private: repo.private,
      defaultBranch: repo.defaultBranch,
      source: 'default',
    })
  }

  for (const repo of await listStoredGitHubRepositories(e.DB).catch(() => [])) {
    repos.set(repo.fullName, {
      fullName: repo.fullName,
      private: repo.private,
      defaultBranch: repo.defaultBranch,
      source: 'github_app',
    })
  }

  const known = new Set<string>()
  await addReposFromQuery(
    e.DB,
    known,
    "SELECT DISTINCT repo FROM routines WHERE repo IS NOT NULL AND TRIM(repo) <> ''",
  )
  await addReposFromQuery(
    e.DB,
    known,
    "SELECT DISTINCT repo FROM github_webhooks WHERE active = 1 AND repo IS NOT NULL AND TRIM(repo) <> ''",
  )
  for (const fullName of known) {
    if (!repos.has(fullName)) {
      repos.set(fullName, { fullName, private: false, defaultBranch: null, source: 'known' })
    }
  }

  return json({
    repos: Array.from(repos.values()).sort((a, b) => a.fullName.localeCompare(b.fullName)),
  })
}
