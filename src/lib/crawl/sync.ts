import { env } from 'cloudflare:workers';
import { CRAWL_TARGETS } from './config';
import { crawlTarget } from './browser-rendering';
import { chunkMarkdown, type DocChunk } from './chunker';

interface EnvConfig {
  CF_ACCOUNT_ID?: string;
  CF_API_TOKEN?: string;
  CRAWL_SECRET?: string;
}

function getEnvConfig(): EnvConfig {
  return env as unknown as EnvConfig;
}

function getDB(): D1Database {
  return (env as unknown as { DB: D1Database }).DB;
}

function ensureCrawlSecret(expectedSecret: string | undefined, providedSecret: string | undefined): void {
  if (!expectedSecret) {
    throw new Error('CRAWL_SECRET secret not set')
  }
  if (!providedSecret) {
    throw new Error('crawl secret is required');
  }
  if (providedSecret !== expectedSecret) {
    throw new Error('invalid crawl secret');
  }
}

function getEnvVars(): { accountId: string; apiToken: string } {
  const e = getEnvConfig();
  if (!e.CF_ACCOUNT_ID) throw new Error('CF_ACCOUNT_ID secret not set');
  if (!e.CF_API_TOKEN) throw new Error('CF_API_TOKEN secret not set');
  return { accountId: e.CF_ACCOUNT_ID, apiToken: e.CF_API_TOKEN };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

async function replacePageChunks(db: D1Database, sourceUrl: string, chunks: DocChunk[]): Promise<void> {
  const deleteFts = db.prepare(
    `DELETE FROM chunks_fts
     WHERE source_type = 'doc'
       AND chunk_id IN (SELECT id FROM doc_chunks WHERE source_url = ?)`
  );
  const deleteChunks = db.prepare('DELETE FROM doc_chunks WHERE source_url = ?');
  const insertChunk = db.prepare(
    `INSERT INTO doc_chunks (id, source_url, source_name, chunk_index, content)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       content = excluded.content,
       source_name = excluded.source_name,
       updated_at = datetime('now')`
  );
  const insertFts = db.prepare(
    `INSERT INTO chunks_fts (content, chunk_id, source_type)
     VALUES (?, ?, 'doc')`
  );

  const statements = [
    deleteFts.bind(sourceUrl),
    deleteChunks.bind(sourceUrl),
    ...chunks.flatMap(chunk => [
      insertChunk.bind(chunk.id, chunk.source_url, chunk.source_name, chunk.chunk_index, chunk.content),
      insertFts.bind(chunk.content, chunk.id),
    ]),
  ];

  for (const batch of chunkArray(statements, 100)) {
    await db.batch(batch);
  }
}

async function replacePagesChunks(db: D1Database, pages: Array<{ sourceUrl: string; chunks: DocChunk[] }>): Promise<void> {
  for (const page of pages) {
    await replacePageChunks(db, page.sourceUrl, page.chunks);
  }
}

function checkpointKey(targetName: string): string {
  return `crawl:last_success:${targetName}`;
}

async function getTargetCheckpoint(db: D1Database, targetName: string): Promise<number | undefined> {
  const key = checkpointKey(targetName);
  try {
    const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>();
    if (row?.value) return Number(row.value);
  } catch (err) {
    console.warn(`[crawl] Could not read settings checkpoint for ${targetName}:`, err instanceof Error ? err.message : String(err));
  }

  const row = await db.prepare(
    'SELECT MAX(strftime(\'%s\', updated_at)) AS updated_at_unix FROM doc_chunks WHERE source_name = ?'
  ).bind(targetName).first<{ updated_at_unix: string | number | null }>();
  const timestamp = Number(row?.updated_at_unix);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : undefined;
}

async function setTargetCheckpoint(db: D1Database, targetName: string, timestamp: number): Promise<void> {
  try {
    await db.prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    ).bind(checkpointKey(targetName), String(timestamp)).run();
  } catch (err) {
    console.warn(`[crawl] Could not write settings checkpoint for ${targetName}:`, err instanceof Error ? err.message : String(err));
  }
}

export interface SyncResult {
  target: string;
  jobId?: string;
  pages: number;
  chunks: number;
  skippedPages?: number;
  statusCounts?: Record<string, number>;
  modifiedSince?: number;
  durationMs: number;
  error?: string;
}

export interface CrawlSyncOptions {
  full?: boolean;
  modifiedSince?: number;
  secret?: string;
}

export async function runCrawlSync(options: CrawlSyncOptions = {}): Promise<SyncResult[]> {
  const envConfig = getEnvConfig();
  ensureCrawlSecret(envConfig.CRAWL_SECRET, options.secret);

  const db = getDB();
  const { accountId, apiToken } = getEnvVars();
  const results: SyncResult[] = [];

  for (const target of CRAWL_TARGETS) {
    const startedAt = Date.now();
    const checkpoint = options.full
      ? undefined
      : options.modifiedSince ?? await getTargetCheckpoint(db, target.name);

    try {
      console.log(`[crawl] Starting: ${target.name} (${target.url})`);

      const crawlResult = await crawlTarget(target, accountId, apiToken, { modifiedSince: checkpoint });
      console.log(`[crawl] Got ${crawlResult.pages.length} pages from ${target.name}`);

      const pageChunks: Array<{ sourceUrl: string; chunks: DocChunk[] }> = [];
      for (const page of crawlResult.pages) {
        const chunks = chunkMarkdown(page.markdown, page.url, target.name);
        pageChunks.push({ sourceUrl: page.url, chunks });
      }

      const allChunks = pageChunks.flatMap(page => page.chunks);
      await replacePagesChunks(db, pageChunks);
      await setTargetCheckpoint(db, target.name, Math.floor(startedAt / 1000));
      console.log(`[crawl] Upserted ${allChunks.length} chunks for ${target.name}`);

      results.push({
        target: target.name,
        jobId: crawlResult.jobId,
        pages: crawlResult.pages.length,
        chunks: allChunks.length,
        skippedPages: crawlResult.skippedPages,
        statusCounts: crawlResult.statusCounts,
        modifiedSince: checkpoint,
        durationMs: Date.now() - startedAt,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[crawl] Error for ${target.name}:`, message);
      results.push({
        target: target.name,
        pages: 0,
        chunks: 0,
        modifiedSince: checkpoint,
        durationMs: Date.now() - startedAt,
        error: message,
      });
    }
  }

  return results;
}
