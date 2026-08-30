// Sync src/content/posts Markdown into D1.
// Usage: pnpm sync (local Wrangler) | pnpm sync:prod (incremental Worker API)

import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import { readdir, readFile, writeFile, unlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import matter from 'gray-matter'
import { chunkMarkdown } from '../src/lib/crawl/chunker'
import { buildContextualChunk } from '../src/lib/indexing/contextual'
import type {
  PostSyncManifestRow,
  PostSyncOperation,
  PostSyncPost,
} from '../src/lib/indexing/post-sync'
import {
  estimatePostSyncStatements,
  MAX_POST_SYNC_OPERATIONS,
  MAX_POST_SYNC_STATEMENTS,
} from '../src/lib/indexing/post-sync'
import { EMBEDDING_VERSION } from '../src/lib/retrieval/embedding'
import { isSearchIndexEligiblePostData } from '../src/utils/publishing'

const POSTS_DIR = 'src/content/posts'
const DB_NAME = 'quidproquo-db'
const SYNC_SCHEMA_VERSION = 'post-sync-v2'
const IS_PROD = process.argv.includes('--prod')
const FULL_REBUILD = process.argv.includes('--full')
const INCLUDE_FUTURE = process.argv.includes('--include-future')
const PRUNE_STALE = !process.argv.includes('--no-prune')

export interface PreparedPost {
  post: PostSyncPost
  chunks: Extract<PostSyncOperation, { type: 'upsert' }>['chunks']
}

function generateId(slug: string): string {
  return sha256(slug).slice(0, 16)
}

function chunkArray<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, index * size + size),
  )
}

function escapeSql(value: string): string {
  return value.replace(/'/g, "''")
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await collectMarkdownFiles(fullPath))
    else if (entry.name.endsWith('.md')) files.push(fullPath)
  }
  return files.sort()
}

function generateChunkId(slug: string, chunkIndex: number): string {
  return sha256(`${slug}::${chunkIndex}`).slice(0, 16)
}

export function buildPostChunkSyncStatements(
  postId: string,
  slug: string,
  chunks: Array<{ chunk_index: number; content: string }>,
): string[] {
  const statements = [
    `DELETE FROM chunks_fts WHERE source_type='post' AND chunk_id IN (SELECT id FROM post_chunks WHERE post_id='${postId}');`,
    `DELETE FROM post_chunks WHERE post_id='${postId}';`,
  ]
  for (const chunk of chunks) {
    const chunkId = generateChunkId(slug, chunk.chunk_index)
    statements.push(
      `INSERT INTO post_chunks (id, post_id, chunk_index, content)\nVALUES ('${chunkId}', '${postId}', ${chunk.chunk_index}, '${escapeSql(chunk.content)}')\nON CONFLICT(id) DO UPDATE SET content=excluded.content;`,
      `INSERT INTO chunks_fts (content, chunk_id, source_type)\nVALUES ('${escapeSql(chunk.content)}', '${chunkId}', 'post');`,
    )
  }
  return statements
}

export function buildStalePostPruneStatements(eligibleSlugs: string[]): string[] {
  if (eligibleSlugs.length === 0) {
    throw new Error('Refusing to prune posts with an empty eligible slug manifest')
  }
  const inserts = chunkArray([...new Set(eligibleSlugs)].sort(), 200).map((batch) => {
    const values = batch.map(slug => `('${escapeSql(slug)}')`).join(', ')
    return `INSERT OR IGNORE INTO _sync_eligible_post_slugs (slug) VALUES ${values};`
  })
  return [
    'DROP TABLE IF EXISTS _sync_eligible_post_slugs;',
    'CREATE TEMP TABLE _sync_eligible_post_slugs (slug TEXT PRIMARY KEY);',
    ...inserts,
    `DELETE FROM chunks_fts
WHERE source_type='post' AND chunk_id IN (
  SELECT pc.id FROM post_chunks pc JOIN posts p ON p.id = pc.post_id
  WHERE NOT EXISTS (SELECT 1 FROM _sync_eligible_post_slugs eligible WHERE eligible.slug = p.slug)
);`,
    `DELETE FROM post_chunks WHERE post_id IN (
  SELECT p.id FROM posts p
  WHERE NOT EXISTS (SELECT 1 FROM _sync_eligible_post_slugs eligible WHERE eligible.slug = p.slug)
);`,
    `DELETE FROM posts WHERE NOT EXISTS (
  SELECT 1 FROM _sync_eligible_post_slugs eligible WHERE eligible.slug = posts.slug
);`,
    'DROP TABLE IF EXISTS _sync_eligible_post_slugs;',
  ]
}

export function buildPostSyncPlan(
  localPosts: PreparedPost[],
  remotePosts: PostSyncManifestRow[],
  fullRebuild = false,
  pruneStale = true,
): PostSyncOperation[] {
  if (localPosts.length === 0 && pruneStale) {
    throw new Error('Refusing to sync with an empty eligible post manifest')
  }
  const remoteBySlug = new Map(remotePosts.map(post => [post.slug, post.sourceHash]))
  const localSlugs = new Set(localPosts.map(({ post }) => post.slug))
  const operations: PostSyncOperation[] = []

  for (const prepared of localPosts) {
    if (fullRebuild || remoteBySlug.get(prepared.post.slug) !== prepared.post.sourceHash) {
      operations.push({ type: 'upsert', ...prepared })
    }
  }
  if (pruneStale) {
    for (const slug of remoteBySlug.keys()) {
      if (!localSlugs.has(slug)) operations.push({ type: 'delete', slug })
    }
  }
  return operations
}

export function buildPostSyncApiBatches(
  operations: PostSyncOperation[],
  maxOperations = MAX_POST_SYNC_OPERATIONS,
  maxStatements = MAX_POST_SYNC_STATEMENTS,
): PostSyncOperation[][] {
  const batches: PostSyncOperation[][] = []
  let batch: PostSyncOperation[] = []
  let statementCount = 0

  for (const operation of operations) {
    const operationStatements = estimatePostSyncStatements(operation)
    if (operationStatements > maxStatements) {
      throw new Error(
        `Post sync operation for ${operation.type === 'delete' ? operation.slug : operation.post.slug} `
        + `requires ${operationStatements} statements; limit is ${maxStatements}`,
      )
    }

    if (batch.length > 0 && (
      batch.length >= maxOperations
      || statementCount + operationStatements > maxStatements
    )) {
      batches.push(batch)
      batch = []
      statementCount = 0
    }

    batch.push(operation)
    statementCount += operationStatements
  }

  if (batch.length > 0) batches.push(batch)
  return batches
}

export function computePostSourceHash(post: Omit<PostSyncPost, 'id' | 'updatedAt' | 'sourceHash'>): string {
  return sha256(JSON.stringify({ version: SYNC_SCHEMA_VERSION, ...post }))
}

export function computeDesiredEmbeddingHash(contextualContent: string): string {
  return sha256(`${EMBEDDING_VERSION}\0${contextualContent}`)
}

async function preparePosts(): Promise<PreparedPost[]> {
  const files = await collectMarkdownFiles(POSTS_DIR)
  const prepared: PreparedPost[] = []
  for (const filepath of files) {
    const raw = await readFile(filepath, 'utf8')
    const { data, content } = matter(raw)
    const publishAt = new Date(data.date as string)
    if (data.draft || data.search === false) continue
    if (!INCLUDE_FUTURE && !isSearchIndexEligiblePostData({ date: publishAt })) continue

    const slug = filepath.replace(`${POSTS_DIR}/`, '').replace(/\.md$/, '')
    const createdAt = publishAt.toISOString()
    const title = String(data.title ?? '')
    const category = String(data.category ?? '')
    const tags = JSON.stringify(data.tags ?? [])
    const base = {
      slug,
      title,
      category,
      lang: String(data.lang ?? 'zh-TW'),
      description: data.description ? String(data.description) : null,
      tldr: data.tldr ? String(data.tldr) : null,
      content,
      tags,
      createdAt,
    }
    const post: PostSyncPost = {
      id: generateId(slug),
      ...base,
      updatedAt: new Date().toISOString(),
      sourceHash: computePostSourceHash(base),
    }
    const chunks = chunkMarkdown(content, slug, title).map((chunk) => {
      const contextual = buildContextualChunk(chunk.content, {
        type: 'post',
        title,
        category,
        date: createdAt.slice(0, 10),
      })
      return {
        id: chunk.id,
        chunkIndex: chunk.chunk_index,
        content: chunk.content,
        desiredEmbeddingHash: computeDesiredEmbeddingHash(contextual),
      }
    })
    prepared.push({ post, chunks })
  }
  return prepared
}

async function syncProduction(posts: PreparedPost[]): Promise<void> {
  const secret = process.env.INDEX_SYNC_SECRET
  if (!secret) throw new Error('INDEX_SYNC_SECRET is required for production sync')
  const baseUrl = (process.env.INDEX_SYNC_URL ?? 'https://quidproquo.cc').replace(/\/$/, '')
  const endpoint = `${baseUrl}/api/index/posts/sync`
  const headers = { 'X-Index-Sync-Secret': secret }
  const manifestResponse = await fetchWithRetry(endpoint, { headers })
  if (!manifestResponse.ok) throw new Error(`Manifest request failed: ${await responseError(manifestResponse)}`)
  const manifest = await manifestResponse.json() as { posts?: PostSyncManifestRow[] }
  if (!Array.isArray(manifest.posts)) throw new Error('Manifest response did not contain posts')

  const operations = buildPostSyncPlan(posts, manifest.posts, FULL_REBUILD, PRUNE_STALE)
  const upserts = operations.filter(operation => operation.type === 'upsert').length
  const deletes = operations.length - upserts
  console.log(`Eligible ${posts.length}; changed ${upserts}; stale ${deletes}`)

  const batches = buildPostSyncApiBatches(operations)
  for (const [index, batch] of batches.entries()) {
    const response = await fetchWithRetry(endpoint, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ operations: batch }),
    })
    if (!response.ok) throw new Error(`Sync batch ${index + 1} failed: ${await responseError(response)}`)
    console.log(`Applied batch ${index + 1}/${batches.length}`)
  }
  console.log(`Synced ${upserts} post(s); deleted ${deletes} stale post(s)`)
}

async function syncLocal(posts: PreparedPost[]): Promise<void> {
  const postStatements: string[] = []
  const chunkStatements: string[] = []
  for (const { post, chunks } of posts) {
    postStatements.push(`INSERT INTO posts (id, slug, title, category, lang, description, tldr, content, tags, created_at, updated_at)
VALUES ('${post.id}', '${escapeSql(post.slug)}', '${escapeSql(post.title)}', '${escapeSql(post.category)}', '${escapeSql(post.lang)}', ${post.description ? `'${escapeSql(post.description)}'` : 'NULL'}, ${post.tldr ? `'${escapeSql(post.tldr)}'` : 'NULL'}, '${escapeSql(post.content)}', '${escapeSql(post.tags)}', '${post.createdAt}', '${post.updatedAt}')
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, category=excluded.category, lang=excluded.lang, description=excluded.description, tldr=excluded.tldr, content=excluded.content, tags=excluded.tags, updated_at=excluded.updated_at;`)
    chunkStatements.push(...buildPostChunkSyncStatements(
      post.id,
      post.slug,
      chunks.map(chunk => ({ chunk_index: chunk.chunkIndex, content: chunk.content })),
    ))
  }
  for (const batch of chunkArray(postStatements, 50)) await execLocalSql(batch.join('\n'))
  for (const batch of chunkArray(chunkStatements, 200)) await execLocalSql(batch.join('\n'))
  if (PRUNE_STALE) await execLocalSql(buildStalePostPruneStatements(posts.map(({ post }) => post.slug)).join('\n'))
  console.log(`Synced ${posts.length} post(s) to local D1`)
}

async function execLocalSql(sql: string): Promise<void> {
  const tmpFile = join(tmpdir(), `d1-sync-${process.pid}-${Date.now()}.sql`)
  await writeFile(tmpFile, sql, 'utf8')
  try {
    execSync(`npx wrangler d1 execute ${DB_NAME} --local --file="${tmpFile}"`, { stdio: 'inherit' })
  } finally {
    await unlink(tmpFile).catch(() => undefined)
  }
}

async function fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
  let lastError: unknown
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, init)
      if (response.status < 500 || attempt === 3) return response
      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
      if (attempt === 3) throw error
    }
    await new Promise(resolve => setTimeout(resolve, attempt * 500))
  }
  throw lastError
}

async function responseError(response: Response): Promise<string> {
  return `${response.status} ${await response.text()}`.trim()
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

async function syncPosts(): Promise<void> {
  const posts = await preparePosts()
  console.log(`Prepared ${posts.length} eligible post(s)`)
  if (IS_PROD) await syncProduction(posts)
  else await syncLocal(posts)
}

const isDirectExecution = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false

if (isDirectExecution) {
  syncPosts().catch((error) => {
    console.error('Sync failed:', error)
    process.exit(1)
  })
}
