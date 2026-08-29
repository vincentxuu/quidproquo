// scripts/sync-to-d1.ts
// 把 src/content/posts/ 的 .md 同步到 D1
// Usage: pnpm sync (本地) | pnpm sync:prod (production)

import { readdir, readFile } from 'node:fs/promises';
import { writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { chunkMarkdown } from '../src/lib/crawl/chunker';
import { isSearchIndexEligiblePostData } from '../src/utils/publishing';

const POSTS_DIR = 'src/content/posts';
const DB_NAME = 'quidproquo-db';
const IS_PROD = process.argv.includes('--prod');
const INCLUDE_FUTURE = process.argv.includes('--include-future');
const PRUNE_STALE = !process.argv.includes('--no-prune');

function generateId(slug: string): string {
  return createHash('sha256').update(slug).digest('hex').slice(0, 16);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}

function escape(str: string): string {
  return str.replace(/'/g, "''");
}

async function collectMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function generateChunkId(slug: string, chunkIndex: number): string {
  return createHash('sha256').update(`${slug}::${chunkIndex}`).digest('hex').slice(0, 16);
}

export function buildPostChunkSyncStatements(
  postId: string,
  slug: string,
  chunks: Array<{ chunk_index: number; content: string }>,
): string[] {
  const statements = [
    `DELETE FROM chunks_fts WHERE source_type='post' AND chunk_id IN (SELECT id FROM post_chunks WHERE post_id='${postId}');`,
    `DELETE FROM post_chunks WHERE post_id='${postId}';`,
  ];

  for (const chunk of chunks) {
    const chunkId = generateChunkId(slug, chunk.chunk_index);
    statements.push(
      `INSERT INTO post_chunks (id, post_id, chunk_index, content)\nVALUES ('${chunkId}', '${postId}', ${chunk.chunk_index}, '${escape(chunk.content)}')\nON CONFLICT(id) DO UPDATE SET content=excluded.content;`,
      `INSERT INTO chunks_fts (content, chunk_id, source_type)\nVALUES ('${escape(chunk.content)}', '${chunkId}', 'post');`,
    );
  }

  return statements;
}

export function buildStalePostPruneStatements(eligibleSlugs: string[]): string[] {
  if (eligibleSlugs.length === 0) {
    throw new Error('Refusing to prune posts with an empty eligible slug manifest');
  }

  const slugList = [...new Set(eligibleSlugs)].sort().map(slug => `'${escape(slug)}'`).join(', ');

  return [
    `DELETE FROM chunks_fts
WHERE source_type='post'
  AND chunk_id IN (
    SELECT pc.id
    FROM post_chunks pc
    JOIN posts p ON p.id = pc.post_id
    WHERE p.slug NOT IN (${slugList})
  );`,
    `DELETE FROM post_chunks
WHERE post_id IN (
  SELECT p.id
  FROM posts p
  WHERE p.slug NOT IN (${slugList})
);`,
    `DELETE FROM posts
WHERE slug NOT IN (${slugList});`,
  ];
}

function execSql(sql: string, flag: string) {
  const tmpFile = join(tmpdir(), `d1-sync-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql, 'utf-8');
  try {
    execSync(`npx wrangler d1 execute ${DB_NAME} ${flag} --file="${tmpFile}"`, { stdio: 'inherit' });
  } finally {
    unlinkSync(tmpFile);
  }
}

async function syncPosts() {
  const files = await collectMarkdownFiles(POSTS_DIR);
  console.log(`Found ${files.length} post(s) to sync`);

  const postStatements: string[] = [];
  const chunkStatements: string[] = [];
  const eligibleSlugs: string[] = [];

  for (const filepath of files) {
    const raw = await readFile(filepath, 'utf-8');
    const { data, content } = matter(raw);

    const publishAt = new Date(data.date as string);
    if (data.draft) {
      console.log(`  Skip draft: ${filepath}`);
      continue;
    }

    if (data.search === false) {
      console.log(`  Skip search:false: ${filepath}`);
      continue;
    }

    const eligible = isSearchIndexEligiblePostData({
      date: publishAt,
      draft: false,
      search: true,
    });

    if (!INCLUDE_FUTURE && !eligible) {
      console.log(`  Skip unpublished: ${filepath}`);
      continue;
    }

    const slug = filepath.replace(POSTS_DIR + '/', '').replace(/\.md$/, '');
    eligibleSlugs.push(slug);
    const id = generateId(slug);
    const now = new Date().toISOString();
    const createdAt = publishAt.toISOString();
    const lang = (data.lang as string) || 'zh-TW';

    postStatements.push(`
INSERT INTO posts (id, slug, title, category, lang, description, tldr, content, tags, created_at, updated_at)
VALUES (
  '${id}', '${escape(slug)}', '${escape(data.title as string)}',
  '${escape(data.category as string)}', '${escape(lang)}',
  ${data.description ? `'${escape(data.description as string)}'` : 'NULL'},
  ${data.tldr ? `'${escape(data.tldr as string)}'` : 'NULL'},
  '${escape(content)}', '${JSON.stringify(data.tags || [])}',
  '${createdAt}', '${now}'
)
ON CONFLICT(slug) DO UPDATE SET
  title=excluded.title, category=excluded.category, lang=excluded.lang,
  description=excluded.description, tldr=excluded.tldr, content=excluded.content,
  tags=excluded.tags, updated_at=excluded.updated_at;`.trim());

    // chunk the content for RAG
    const docChunks = chunkMarkdown(content, slug, data.title as string);
    chunkStatements.push(...buildPostChunkSyncStatements(id, slug, docChunks));

    console.log(`  Prepared: ${slug} (${docChunks.length} chunks)`);
  }

  if (postStatements.length === 0) {
    console.log('No posts to sync.');
    return;
  }

  const flag = IS_PROD ? '--remote' : '--local';

  console.log('\nSyncing posts...');
  for (const batch of chunkArray(postStatements, 50)) {
    execSql(batch.join('\n'), flag);
  }

  console.log('Syncing post_chunks...');
  for (const batch of chunkArray(chunkStatements, 200)) {
    execSql(batch.join('\n'), flag);
  }

  if (PRUNE_STALE) {
    console.log('Pruning stale posts...');
    execSql(buildStalePostPruneStatements(eligibleSlugs).join('\n'), flag);
  }

  console.log(`\n✅ Synced ${postStatements.length} post(s) to D1`);
  console.log(`✅ Synced ${chunkStatements.filter(s => s.startsWith('INSERT INTO post_chunks')).length} chunk(s) to post_chunks`);
  if (PRUNE_STALE) console.log('✅ Pruned stale D1 post rows/chunks/FTS entries');
}

const isDirectExecution = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectExecution) {
  syncPosts().catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
}
