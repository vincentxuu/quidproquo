export interface PostSyncManifestRow {
  slug: string
  sourceHash: string | null
}

export interface PostSyncChunk {
  id: string
  chunkIndex: number
  content: string
  desiredEmbeddingHash: string
}

export interface PostSyncPost {
  id: string
  slug: string
  title: string
  category: string
  lang: string
  description: string | null
  tldr: string | null
  content: string
  tags: string
  createdAt: string
  updatedAt: string
  sourceHash: string
}

export type PostSyncOperation =
  | { type: 'upsert'; post: PostSyncPost; chunks: PostSyncChunk[] }
  | { type: 'delete'; slug: string }

const MAX_OPERATIONS = 10
const MAX_CHUNKS_PER_POST = 250
const MAX_STATEMENTS_PER_REQUEST = 800

export async function listPostSyncManifest(db: D1Database): Promise<PostSyncManifestRow[]> {
  const result = await db.prepare(
    'SELECT slug, source_hash AS sourceHash FROM posts ORDER BY slug',
  ).all<PostSyncManifestRow>()
  return result.results
}

export function parsePostSyncOperations(value: unknown): PostSyncOperation[] {
  if (!isRecord(value) || !Array.isArray(value.operations)) {
    throw new Error('Expected an operations array')
  }
  if (value.operations.length === 0 || value.operations.length > MAX_OPERATIONS) {
    throw new Error(`operations must contain 1-${MAX_OPERATIONS} items`)
  }

  const operations = value.operations.map((operation, index) => parseOperation(operation, index))
  const statementCount = operations.reduce((total, operation) =>
    total + (operation.type === 'upsert' ? 4 + operation.chunks.length * 3 : 4), 0)
  if (statementCount > MAX_STATEMENTS_PER_REQUEST) {
    throw new Error(`operations exceed ${MAX_STATEMENTS_PER_REQUEST} D1 statements`)
  }
  return operations
}

export async function applyPostSyncOperation(
  db: D1Database,
  operation: PostSyncOperation,
): Promise<void> {
  if (operation.type === 'delete') {
    await deletePost(db, operation.slug)
    return
  }
  await upsertPost(db, operation.post, operation.chunks)
}

async function deletePost(db: D1Database, slug: string): Promise<void> {
  await db.batch([
    db.prepare(`INSERT OR IGNORE INTO vector_delete_queue (chunk_id)
      SELECT pc.id FROM post_chunks pc JOIN posts p ON p.id = pc.post_id WHERE p.slug = ?`).bind(slug),
    db.prepare(`DELETE FROM chunks_fts WHERE source_type = 'post' AND chunk_id IN (
      SELECT pc.id FROM post_chunks pc JOIN posts p ON p.id = pc.post_id WHERE p.slug = ?
    )`).bind(slug),
    db.prepare('DELETE FROM post_chunks WHERE post_id IN (SELECT id FROM posts WHERE slug = ?)').bind(slug),
    db.prepare('DELETE FROM posts WHERE slug = ?').bind(slug),
  ])
}

async function upsertPost(
  db: D1Database,
  post: PostSyncPost,
  chunks: PostSyncChunk[],
): Promise<void> {
  const statements: D1PreparedStatement[] = [
    db.prepare(`INSERT OR IGNORE INTO vector_delete_queue (chunk_id)
      SELECT id FROM post_chunks WHERE post_id = ?`).bind(post.id),
    db.prepare(`DELETE FROM chunks_fts WHERE source_type = 'post'
      AND chunk_id IN (SELECT id FROM post_chunks WHERE post_id = ?)`).bind(post.id),
    db.prepare('DELETE FROM post_chunks WHERE post_id = ?').bind(post.id),
    db.prepare(`INSERT INTO posts (
      id, slug, title, category, lang, description, tldr, content, tags,
      created_at, updated_at, source_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      lang = excluded.lang,
      description = excluded.description,
      tldr = excluded.tldr,
      content = excluded.content,
      tags = excluded.tags,
      updated_at = excluded.updated_at,
      source_hash = excluded.source_hash`).bind(
      post.id,
      post.slug,
      post.title,
      post.category,
      post.lang,
      post.description,
      post.tldr,
      post.content,
      post.tags,
      post.createdAt,
      post.updatedAt,
      post.sourceHash,
    ),
  ]

  for (const chunk of chunks) {
    statements.push(
      db.prepare(`INSERT INTO post_chunks (
        id, post_id, chunk_index, content, desired_embedding_hash, embedded_hash
      ) VALUES (?, ?, ?, ?, ?, NULL)`).bind(
        chunk.id,
        post.id,
        chunk.chunkIndex,
        chunk.content,
        chunk.desiredEmbeddingHash,
      ),
      db.prepare(`DELETE FROM vector_delete_queue WHERE chunk_id = ?`).bind(chunk.id),
      db.prepare(`INSERT INTO chunks_fts (content, chunk_id, source_type)
        VALUES (?, ?, 'post')`).bind(chunk.content, chunk.id),
    )
  }

  await db.batch(statements)
}

function parseOperation(value: unknown, index: number): PostSyncOperation {
  if (!isRecord(value) || (value.type !== 'upsert' && value.type !== 'delete')) {
    throw new Error(`Invalid operation at index ${index}`)
  }
  if (value.type === 'delete') {
    return { type: 'delete', slug: requiredString(value.slug, `operations[${index}].slug`) }
  }

  if (!isRecord(value.post) || !Array.isArray(value.chunks)) {
    throw new Error(`Invalid upsert operation at index ${index}`)
  }
  if (value.chunks.length > MAX_CHUNKS_PER_POST) {
    throw new Error(`operations[${index}].chunks exceeds ${MAX_CHUNKS_PER_POST}`)
  }

  const post = value.post
  return {
    type: 'upsert',
    post: {
      id: requiredString(post.id, 'post.id'),
      slug: requiredString(post.slug, 'post.slug'),
      title: requiredString(post.title, 'post.title'),
      category: requiredString(post.category, 'post.category'),
      lang: requiredString(post.lang, 'post.lang'),
      description: nullableString(post.description, 'post.description'),
      tldr: nullableString(post.tldr, 'post.tldr'),
      content: requiredString(post.content, 'post.content', true),
      tags: requiredString(post.tags, 'post.tags', true),
      createdAt: requiredString(post.createdAt, 'post.createdAt'),
      updatedAt: requiredString(post.updatedAt, 'post.updatedAt'),
      sourceHash: requiredString(post.sourceHash, 'post.sourceHash'),
    },
    chunks: value.chunks.map((chunk, chunkIndex) => {
      if (!isRecord(chunk) || !Number.isInteger(chunk.chunkIndex)) {
        throw new Error(`Invalid chunk at operations[${index}].chunks[${chunkIndex}]`)
      }
      return {
        id: requiredString(chunk.id, 'chunk.id'),
        chunkIndex: chunk.chunkIndex as number,
        content: requiredString(chunk.content, 'chunk.content', true),
        desiredEmbeddingHash: requiredString(chunk.desiredEmbeddingHash, 'chunk.desiredEmbeddingHash'),
      }
    }),
  }
}

function requiredString(value: unknown, path: string, allowEmpty = false): string {
  if (typeof value !== 'string' || (!allowEmpty && value.length === 0)) {
    throw new Error(`${path} must be a string`)
  }
  return value
}

function nullableString(value: unknown, path: string): string | null {
  if (value === null) return null
  return requiredString(value, path, true)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
