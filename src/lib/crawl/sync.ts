import { env } from 'cloudflare:workers';
import { CRAWL_TARGETS } from './config';
import { crawlTarget } from './browser-rendering';
import { chunkMarkdown, type DocChunk } from './chunker';

function getDB(): D1Database {
  return (env as unknown as { DB: D1Database }).DB;
}

function getEnvVars(): { accountId: string; apiToken: string } {
  const e = env as unknown as { CF_ACCOUNT_ID?: string; CF_API_TOKEN?: string };
  if (!e.CF_ACCOUNT_ID) throw new Error('CF_ACCOUNT_ID secret not set');
  if (!e.CF_API_TOKEN) throw new Error('CF_API_TOKEN secret not set');
  return { accountId: e.CF_ACCOUNT_ID, apiToken: e.CF_API_TOKEN };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

async function upsertChunks(db: D1Database, chunks: DocChunk[]): Promise<void> {
  const stmt = db.prepare(
    `INSERT INTO doc_chunks (id, source_url, source_name, chunk_index, content)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       content = excluded.content,
       source_name = excluded.source_name,
       updated_at = datetime('now')`
  );

  const batches = chunkArray(chunks, 100);
  for (const batch of batches) {
    await db.batch(batch.map(c =>
      stmt.bind(c.id, c.source_url, c.source_name, c.chunk_index, c.content)
    ));
  }
}

export interface SyncResult {
  target: string;
  pages: number;
  chunks: number;
  error?: string;
}

export async function runCrawlSync(): Promise<SyncResult[]> {
  const db = getDB();
  const { accountId, apiToken } = getEnvVars();
  const results: SyncResult[] = [];

  for (const target of CRAWL_TARGETS) {
    try {
      console.log(`[crawl] Starting: ${target.name} (${target.url})`);

      const pages = await crawlTarget(target, accountId, apiToken);
      console.log(`[crawl] Got ${pages.length} pages from ${target.name}`);

      const allChunks: DocChunk[] = [];
      for (const page of pages) {
        const chunks = chunkMarkdown(page.markdown, page.url, target.name);
        allChunks.push(...chunks);
      }

      await upsertChunks(db, allChunks);
      console.log(`[crawl] Upserted ${allChunks.length} chunks for ${target.name}`);

      results.push({ target: target.name, pages: pages.length, chunks: allChunks.length });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[crawl] Error for ${target.name}:`, message);
      results.push({ target: target.name, pages: 0, chunks: 0, error: message });
    }
  }

  return results;
}
