import type { Env } from '@/lib/config/env'

export interface GitHubAppInstallation {
  installationId: string
  accountLogin: string
  accountType: string | null
  targetType: string | null
  repositorySelection: string | null
  permissions: Record<string, unknown>
  suspendedAt: string | null
}

export interface GitHubRepository {
  id: string
  installationId: string
  fullName: string
  private: boolean
  defaultBranch: string | null
  htmlUrl: string | null
  cloneUrl: string | null
}

type GitHubInstallationApi = {
  id: number
  account?: { login?: string; type?: string }
  target_type?: string
  repository_selection?: string
  permissions?: Record<string, unknown>
  suspended_at?: string | null
}

type GitHubRepositoryApi = {
  id: number
  full_name?: string
  private?: boolean
  default_branch?: string
  html_url?: string
  clone_url?: string
}

const GITHUB_API = 'https://api.github.com'
const DEFAULT_REPOS = ['vincentxuu/quidproquo']

function base64UrlEncode(input: string | ArrayBuffer): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function normalizePrivateKey(raw: string): string {
  return raw.includes('\\n') ? raw.replace(/\\n/g, '\n') : raw
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.length)
  copy.set(bytes)
  return copy.buffer
}

function decodePemBody(pem: string, label: string): Uint8Array {
  const normalized = normalizePrivateKey(pem)
  const begin = `-----BEGIN ${label}-----`
  const end = `-----END ${label}-----`
  if (!normalized.includes(begin) || !normalized.includes(end)) {
    throw new Error(`GitHub App private key must include ${begin} and ${end}`)
  }

  const body = normalized
    .slice(normalized.indexOf(begin) + begin.length, normalized.indexOf(end))
    .replace(/\s+/g, '')

  try {
    const binary = atob(body)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  } catch (error) {
    throw new Error(`GitHub App private key has invalid base64 payload: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function encodeDerLength(length: number): Uint8Array {
  if (length < 0x80) return new Uint8Array([length])
  const bytes: number[] = []
  let value = length
  while (value > 0) {
    bytes.unshift(value & 0xff)
    value >>= 8
  }
  return new Uint8Array([0x80 | bytes.length, ...bytes])
}

function concatDer(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

function der(tag: number, value: Uint8Array): Uint8Array {
  return concatDer(new Uint8Array([tag]), encodeDerLength(value.length), value)
}

function wrapPkcs1RsaPrivateKey(pkcs1: Uint8Array): Uint8Array {
  const version = der(0x02, new Uint8Array([0x00]))
  const rsaEncryptionOid = new Uint8Array([0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01])
  const nullParam = new Uint8Array([0x05, 0x00])
  const algorithmIdentifier = der(0x30, concatDer(rsaEncryptionOid, nullParam))
  const privateKey = der(0x04, pkcs1)
  return der(0x30, concatDer(version, algorithmIdentifier, privateKey))
}

export function privateKeyPemToPkcs8Der(pem: string): ArrayBuffer {
  const normalized = normalizePrivateKey(pem)
  if (normalized.includes('-----BEGIN PRIVATE KEY-----')) {
    return toArrayBuffer(decodePemBody(normalized, 'PRIVATE KEY'))
  }
  if (normalized.includes('-----BEGIN RSA PRIVATE KEY-----')) {
    return toArrayBuffer(wrapPkcs1RsaPrivateKey(decodePemBody(normalized, 'RSA PRIVATE KEY')))
  }
  throw new Error('GitHub App private key must be a PEM PKCS#8 PRIVATE KEY or PKCS#1 RSA PRIVATE KEY')
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  return privateKeyPemToPkcs8Der(pem)
}

async function createAppJwt(env: Env): Promise<string> {
  if (!env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY) {
    throw new Error('GitHub App is not configured')
  }
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const payload = {
    iat: now - 60,
    exp: now + 540,
    iss: env.GITHUB_APP_ID,
  }
  const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(env.GITHUB_APP_PRIVATE_KEY),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(signingInput))
  return `${signingInput}.${base64UrlEncode(signature)}`
}

async function githubFetch<T>(url: string, token: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'quidproquo-admin-agent',
      'X-GitHub-Api-Version': '2022-11-28',
      ...init.headers,
    },
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`GitHub API ${res.status}: ${detail || res.statusText}`)
  }
  return await res.json() as T
}

export function isGitHubAppConfigured(env: Env): boolean {
  return Boolean(env.GITHUB_APP_ID && env.GITHUB_APP_PRIVATE_KEY)
}

export function getGitHubInstallUrl(env: Env): string | null {
  if (!env.GITHUB_APP_SLUG) return null
  return `https://github.com/apps/${encodeURIComponent(env.GITHUB_APP_SLUG)}/installations/new`
}

export async function listGitHubAppInstallations(env: Env): Promise<GitHubAppInstallation[]> {
  const jwt = await createAppJwt(env)
  const installations = await githubFetch<GitHubInstallationApi[]>(`${GITHUB_API}/app/installations`, jwt)
  return installations.map((item) => ({
    installationId: String(item.id),
    accountLogin: item.account?.login ?? String(item.id),
    accountType: item.account?.type ?? null,
    targetType: item.target_type ?? null,
    repositorySelection: item.repository_selection ?? null,
    permissions: item.permissions ?? {},
    suspendedAt: item.suspended_at ?? null,
  }))
}

export async function createInstallationToken(env: Env, installationId: string): Promise<string> {
  const jwt = await createAppJwt(env)
  const data = await githubFetch<{ token: string }>(
    `${GITHUB_API}/app/installations/${encodeURIComponent(installationId)}/access_tokens`,
    jwt,
    { method: 'POST' },
  )
  return data.token
}

export async function listInstallationRepositories(env: Env, installationId: string): Promise<GitHubRepository[]> {
  const token = await createInstallationToken(env, installationId)
  const repos: GitHubRepository[] = []
  let page = 1
  while (page <= 10) {
    const data = await githubFetch<{ repositories?: GitHubRepositoryApi[] }>(
      `${GITHUB_API}/installation/repositories?per_page=100&page=${page}`,
      token,
    )
    const batch = data.repositories ?? []
    for (const repo of batch) {
      if (!repo.full_name) continue
      repos.push({
        id: String(repo.id),
        installationId,
        fullName: repo.full_name,
        private: Boolean(repo.private),
        defaultBranch: repo.default_branch ?? null,
        htmlUrl: repo.html_url ?? null,
        cloneUrl: repo.clone_url ?? null,
      })
    }
    if (batch.length < 100) break
    page++
  }
  return repos
}

export async function saveGitHubInstallation(db: D1Database, installation: GitHubAppInstallation): Promise<void> {
  const now = Date.now()
  await db.prepare(`
    INSERT INTO github_app_installations
      (installation_id, account_login, account_type, target_type, repository_selection, permissions_json, suspended_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(installation_id) DO UPDATE SET
      account_login = excluded.account_login,
      account_type = excluded.account_type,
      target_type = excluded.target_type,
      repository_selection = excluded.repository_selection,
      permissions_json = excluded.permissions_json,
      suspended_at = excluded.suspended_at,
      updated_at = excluded.updated_at
  `)
    .bind(
      installation.installationId,
      installation.accountLogin,
      installation.accountType,
      installation.targetType,
      installation.repositorySelection,
      JSON.stringify(installation.permissions),
      installation.suspendedAt,
      now,
      now,
    )
    .run()
}

export async function saveGitHubRepositories(db: D1Database, repos: GitHubRepository[]): Promise<void> {
  const now = Date.now()
  const stmt = db.prepare(`
    INSERT INTO github_repositories
      (repository_id, installation_id, full_name, private, default_branch, html_url, clone_url, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(repository_id) DO UPDATE SET
      installation_id = excluded.installation_id,
      full_name = excluded.full_name,
      private = excluded.private,
      default_branch = excluded.default_branch,
      html_url = excluded.html_url,
      clone_url = excluded.clone_url,
      updated_at = excluded.updated_at
  `)
  if (repos.length > 0) {
    await db.batch(repos.map((repo) => stmt.bind(
      repo.id,
      repo.installationId,
      repo.fullName,
      repo.private ? 1 : 0,
      repo.defaultBranch,
      repo.htmlUrl,
      repo.cloneUrl,
      now,
    )))
  }
}

export async function listStoredGitHubRepositories(db: D1Database): Promise<GitHubRepository[]> {
  const rows = await db.prepare(`
    SELECT repository_id, installation_id, full_name, private, default_branch, html_url, clone_url
    FROM github_repositories
    ORDER BY full_name ASC
  `).all<{
    repository_id: string
    installation_id: string
    full_name: string
    private: number
    default_branch: string | null
    html_url: string | null
    clone_url: string | null
  }>()
  return (rows.results ?? []).map((row) => ({
    id: String(row.repository_id),
    installationId: String(row.installation_id),
    fullName: String(row.full_name),
    private: Number(row.private) === 1,
    defaultBranch: row.default_branch,
    htmlUrl: row.html_url,
    cloneUrl: row.clone_url,
  }))
}

export async function findStoredGitHubRepository(db: D1Database, repoName: string): Promise<GitHubRepository | null> {
  const row = await db.prepare(`
    SELECT repository_id, installation_id, full_name, private, default_branch, html_url, clone_url
    FROM github_repositories
    WHERE full_name = ?
    LIMIT 1
  `).bind(repoName).first<{
    repository_id: string
    installation_id: string
    full_name: string
    private: number
    default_branch: string | null
    html_url: string | null
    clone_url: string | null
  }>()
  if (!row) return null
  return {
    id: String(row.repository_id),
    installationId: String(row.installation_id),
    fullName: String(row.full_name),
    private: Number(row.private) === 1,
    defaultBranch: row.default_branch,
    htmlUrl: row.html_url,
    cloneUrl: row.clone_url,
  }
}

export function normalizeGitHubRepoInput(repo: string): string {
  const trimmed = repo.trim()
  const githubMatch = trimmed.match(/^https:\/\/github\.com\/([^/]+\/[^/.]+)(?:\.git)?\/?$/)
  if (githubMatch) return githubMatch[1]
  return trimmed.replace(/\.git$/, '')
}

export function publicCloneUrl(repo: string): string {
  const normalized = normalizeGitHubRepoInput(repo)
  if (repo.startsWith('https://')) return repo
  return `https://github.com/${normalized}.git`
}

export async function resolveCloneUrl(env: Env, repo: string): Promise<string> {
  const normalized = normalizeGitHubRepoInput(repo)
  const stored = await findStoredGitHubRepository(env.DB, normalized).catch(() => null)
  if (!stored || !stored.private) return publicCloneUrl(repo)
  const token = await createInstallationToken(env, stored.installationId)
  return `https://x-access-token:${encodeURIComponent(token)}@github.com/${stored.fullName}.git`
}

export function defaultRepositories(): GitHubRepository[] {
  return DEFAULT_REPOS.map((fullName) => ({
    id: fullName,
    installationId: '',
    fullName,
    private: false,
    defaultBranch: null,
    htmlUrl: `https://github.com/${fullName}`,
    cloneUrl: `https://github.com/${fullName}.git`,
  }))
}
