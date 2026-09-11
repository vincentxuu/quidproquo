import { env } from 'cloudflare:workers'
import type { Env } from '@/lib/config/env'
import { defineSyscall } from '../../agent/tools/define'
import { createInstallationToken, findStoredGitHubRepository } from '../../github/app'

export interface KnowledgeGithubReadInput {
  sub: 'repo.contents' | 'repo.issues' | 'repo.pulls' | 'search.code'
  owner: string
  repo: string
  path?: string
  query?: string
  limit?: number
}

export interface KnowledgeGithubReadOutput {
  items: unknown[]
}

export interface KnowledgeGithubWriteInput {
  sub: 'repo.contents.put' | 'repo.tree.commit'
  owner: string
  repo: string
  path?: string
  content?: string
  message: string
  sha?: string
  branch?: string
  files?: Array<{ path: string; content: string }>
}

export interface KnowledgeGithubWriteOutput {
  url: string
  sha: string
}

const GITHUB_API = 'https://api.github.com'

async function resolveToken(e: Env, owner: string, repo: string): Promise<string> {
  const fullName = `${owner}/${repo}`
  const stored = await findStoredGitHubRepository(e.DB, fullName)
  if (!stored) throw new Error(`GitHub repository ${fullName} not found in stored installations`)
  return createInstallationToken(e, stored.installationId)
}

async function ghFetch<T>(url: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'quidproquo-agent-os',
      'X-GitHub-Api-Version': '2022-11-28',
      ...init.headers,
    },
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`GitHub API ${res.status}: ${detail.slice(0, 500)}`)
  }
  return await res.json() as T
}

async function putSingleFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha?: string,
  branch?: string,
): Promise<KnowledgeGithubWriteOutput> {
  const body: Record<string, unknown> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
  }
  if (sha) body.sha = sha
  if (branch) body.branch = branch

  const result = await ghFetch<{ content: { html_url: string; sha: string } }>(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`,
    token,
    { method: 'PUT', body: JSON.stringify(body) },
  )
  return { url: result.content.html_url, sha: result.content.sha }
}

async function commitMultipleFiles(
  token: string,
  owner: string,
  repo: string,
  files: Array<{ path: string; content: string }>,
  message: string,
  branch?: string,
): Promise<KnowledgeGithubWriteOutput> {
  const ref = branch ?? 'main'
  const refData = await ghFetch<{ object: { sha: string } }>(
    `${GITHUB_API}/repos/${owner}/${repo}/git/ref/heads/${ref}`,
    token,
  )
  const baseCommitSha = refData.object.sha

  const baseCommit = await ghFetch<{ tree: { sha: string } }>(
    `${GITHUB_API}/repos/${owner}/${repo}/git/commits/${baseCommitSha}`,
    token,
  )
  const baseTreeSha = baseCommit.tree.sha

  const blobs = await Promise.all(files.map(async (file) => {
    const blob = await ghFetch<{ sha: string }>(
      `${GITHUB_API}/repos/${owner}/${repo}/git/blobs`,
      token,
      { method: 'POST', body: JSON.stringify({ content: file.content, encoding: 'utf-8' }) },
    )
    return { path: file.path, mode: '100644' as const, type: 'blob' as const, sha: blob.sha }
  }))

  const tree = await ghFetch<{ sha: string }>(
    `${GITHUB_API}/repos/${owner}/${repo}/git/trees`,
    token,
    { method: 'POST', body: JSON.stringify({ base_tree: baseTreeSha, tree: blobs }) },
  )

  const commit = await ghFetch<{ sha: string; html_url: string }>(
    `${GITHUB_API}/repos/${owner}/${repo}/git/commits`,
    token,
    { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [baseCommitSha] }) },
  )

  await ghFetch<unknown>(
    `${GITHUB_API}/repos/${owner}/${repo}/git/refs/heads/${ref}`,
    token,
    { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) },
  )

  return { url: commit.html_url, sha: commit.sha }
}

export const knowledgeGithubReadSyscall = defineSyscall<KnowledgeGithubReadInput, KnowledgeGithubReadOutput>({
  name: 'knowledge.github.read',
  description: 'Read repository contents, issues, pull requests, or search code on GitHub.',
  inputSchema: {
    type: 'object',
    required: ['sub', 'owner', 'repo'],
    properties: {
      sub: {
        type: 'string',
        enum: ['repo.contents', 'repo.issues', 'repo.pulls', 'search.code'],
      },
      owner: { type: 'string' },
      repo: { type: 'string' },
      path: { type: 'string' },
      query: { type: 'string' },
      limit: { type: 'number', default: 10 },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['items'],
    properties: {
      items: { type: 'array', items: {} },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: false,
  outboundDomains: ['api.github.com'],
  async handler(_ctx, input) {
    const e = env as unknown as Env
    const token = await resolveToken(e, input.owner, input.repo)

    if (input.sub === 'repo.contents') {
      const path = input.path ?? ''
      const data = await ghFetch<unknown>(
        `${GITHUB_API}/repos/${input.owner}/${input.repo}/contents/${path}`,
        token,
      )
      return { items: Array.isArray(data) ? data : [data] }
    }

    if (input.sub === 'repo.issues') {
      const limit = Math.min(input.limit ?? 10, 100)
      const data = await ghFetch<unknown[]>(
        `${GITHUB_API}/repos/${input.owner}/${input.repo}/issues?per_page=${limit}&state=open`,
        token,
      )
      return { items: data }
    }

    if (input.sub === 'repo.pulls') {
      const limit = Math.min(input.limit ?? 10, 100)
      const data = await ghFetch<unknown[]>(
        `${GITHUB_API}/repos/${input.owner}/${input.repo}/pulls?per_page=${limit}&state=open`,
        token,
      )
      return { items: data }
    }

    if (input.sub === 'search.code' && input.query) {
      const data = await ghFetch<{ items: unknown[] }>(
        `${GITHUB_API}/search/code?q=${encodeURIComponent(input.query)}+repo:${input.owner}/${input.repo}&per_page=${Math.min(input.limit ?? 10, 100)}`,
        token,
      )
      return { items: data.items }
    }

    return { items: [] }
  },
})

export const knowledgeGithubWriteSyscall = defineSyscall<KnowledgeGithubWriteInput, KnowledgeGithubWriteOutput>({
  name: 'knowledge.github.write',
  description: 'Create or update files in a GitHub repository. Use repo.contents.put for single file, repo.tree.commit for multi-file atomic commit.',
  inputSchema: {
    type: 'object',
    required: ['sub', 'owner', 'repo', 'message'],
    properties: {
      sub: { type: 'string', enum: ['repo.contents.put', 'repo.tree.commit'] },
      owner: { type: 'string' },
      repo: { type: 'string' },
      path: { type: 'string' },
      content: { type: 'string' },
      message: { type: 'string' },
      sha: { type: 'string' },
      branch: { type: 'string' },
      files: {
        type: 'array',
        items: {
          type: 'object',
          required: ['path', 'content'],
          properties: {
            path: { type: 'string' },
            content: { type: 'string' },
          },
        },
      },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['url', 'sha'],
    properties: {
      url: { type: 'string' },
      sha: { type: 'string' },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  requiresApproval: true,
  outboundDomains: ['api.github.com'],
  async handler(_ctx, input) {
    const e = env as unknown as Env
    const token = await resolveToken(e, input.owner, input.repo)

    if (input.sub === 'repo.contents.put') {
      if (!input.path || !input.content) throw new Error('path and content are required for repo.contents.put')
      return putSingleFile(token, input.owner, input.repo, input.path, input.content, input.message, input.sha, input.branch)
    }

    if (input.sub === 'repo.tree.commit') {
      if (!input.files?.length) throw new Error('files array is required for repo.tree.commit')
      return commitMultipleFiles(token, input.owner, input.repo, input.files, input.message, input.branch)
    }

    throw new Error(`Unknown sub: ${input.sub}`)
  },
})
