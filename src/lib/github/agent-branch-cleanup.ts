import type { Env } from '../config/env'
import { createInstallationToken, listStoredGitHubRepositories } from './app'

/** Agent runs push to `agent/<sessionId>`; see SandboxProvider.provision. */
export const AGENT_BRANCH_PREFIX = 'agent/'

/** A run's branch is kept this long so unfinished work can still be picked up. */
export const AGENT_BRANCH_MAX_AGE_DAYS = 14

export interface AgentBranch {
  name: string
  committedAt: string
  openPullRequests: number
}

/**
 * Branches safe to delete: older than the retention window, without an open pull
 * request, and not the latest run of any routine (its result may still be unread).
 */
export function selectStaleAgentBranches(
  branches: AgentBranch[],
  options: { now: number; maxAgeDays: number; keep: Set<string> },
): string[] {
  const cutoff = options.now - options.maxAgeDays * 24 * 3600_000
  return branches
    .filter((b) => b.name.startsWith(AGENT_BRANCH_PREFIX))
    .filter((b) => b.openPullRequests === 0 && !options.keep.has(b.name))
    .filter((b) => {
      const committed = Date.parse(b.committedAt)
      return Number.isFinite(committed) && committed < cutoff
    })
    .map((b) => b.name)
}

const AGENT_REFS_QUERY = `
query($owner: String!, $name: String!, $after: String) {
  repository(owner: $owner, name: $name) {
    refs(refPrefix: "refs/heads/${AGENT_BRANCH_PREFIX}", first: 100, after: $after) {
      pageInfo { hasNextPage endCursor }
      nodes {
        name
        target { ... on Commit { committedDate } }
        associatedPullRequests(states: OPEN) { totalCount }
      }
    }
  }
}`

interface RefsResponse {
  data?: {
    repository?: {
      refs: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null }
        nodes: Array<{ name: string; target: { committedDate?: string } | null; associatedPullRequests: { totalCount: number } }>
      }
    }
  }
  errors?: Array<{ message: string }>
}

const githubHeaders = (token: string) => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'User-Agent': 'quidproquo-admin-agent',
  'X-GitHub-Api-Version': '2022-11-28',
})

async function listAgentBranches(token: string, fullName: string): Promise<AgentBranch[]> {
  const [owner, name] = fullName.split('/')
  const branches: AgentBranch[] = []
  let after: string | null = null
  do {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...githubHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: AGENT_REFS_QUERY, variables: { owner, name, after } }),
    })
    if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}: ${await res.text().catch(() => '')}`)
    const body = (await res.json()) as RefsResponse
    if (body.errors?.length) throw new Error(`GitHub GraphQL: ${body.errors.map((e) => e.message).join('; ')}`)
    const refs = body.data?.repository?.refs
    if (!refs) break
    for (const node of refs.nodes) {
      branches.push({
        // refs under a prefix are returned without it
        name: `${AGENT_BRANCH_PREFIX}${node.name}`,
        committedAt: node.target?.committedDate ?? '',
        openPullRequests: node.associatedPullRequests.totalCount,
      })
    }
    after = refs.pageInfo.hasNextPage ? refs.pageInfo.endCursor : null
  } while (after)
  return branches
}

async function deleteBranch(token: string, fullName: string, branch: string): Promise<void> {
  const ref = branch.split('/').map(encodeURIComponent).join('/')
  const res = await fetch(`https://api.github.com/repos/${fullName}/git/refs/heads/${ref}`, {
    method: 'DELETE',
    headers: githubHeaders(token),
  })
  // 422: already gone
  if (!res.ok && res.status !== 422) throw new Error(`delete ${branch}: GitHub ${res.status}`)
}

/** Deletes stale agent run branches in every repository installed through the GitHub App. */
export async function cleanupAgentBranches(env: Env, now = Date.now()): Promise<{ deleted: string[]; failed: string[] }> {
  const latestRuns = await env.DB
    .prepare('SELECT last_run_id FROM routines WHERE last_run_id IS NOT NULL')
    .all<{ last_run_id: string }>()
  const keep = new Set((latestRuns.results ?? []).map((r) => `${AGENT_BRANCH_PREFIX}${r.last_run_id}`))

  const repos = (await listStoredGitHubRepositories(env.DB)).filter((r) => r.installationId)
  const tokens = new Map<string, string>()
  const deleted: string[] = []
  const failed: string[] = []

  for (const repo of repos) {
    try {
      let token = tokens.get(repo.installationId)
      if (!token) {
        token = await createInstallationToken(env, repo.installationId)
        tokens.set(repo.installationId, token)
      }
      const stale = selectStaleAgentBranches(await listAgentBranches(token, repo.fullName), {
        now,
        maxAgeDays: AGENT_BRANCH_MAX_AGE_DAYS,
        keep,
      })
      for (const branch of stale) {
        try {
          await deleteBranch(token, repo.fullName, branch)
          deleted.push(`${repo.fullName}:${branch}`)
        } catch (error) {
          failed.push(`${repo.fullName}:${branch}: ${error instanceof Error ? error.message : error}`)
        }
      }
    } catch (error) {
      failed.push(`${repo.fullName}: ${error instanceof Error ? error.message : error}`)
    }
  }

  console.log('[agent-branch-cleanup]', JSON.stringify({ deleted: deleted.length, failed }))
  return { deleted, failed }
}
