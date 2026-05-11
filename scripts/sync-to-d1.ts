// scripts/sync-to-d1.ts
// 把 src/content/posts/ 的 .md 同步到 D1
// Usage: pnpm sync (本地) | pnpm sync:prod (production)

import { readdir, readFile } from 'node:fs/promises';
import { writeFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { chunkMarkdown } from '../src/lib/crawl/chunker';

const POSTS_DIR = 'src/content/posts';
const IS_PROD = process.argv.includes('--prod');
const INCLUDE_FUTURE = process.argv.includes('--include-future');

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

function execSql(sql: string, flag: string) {
  const tmpFile = join(tmpdir(), `d1-sync-${Date.now()}.sql`);
  writeFileSync(tmpFile, sql, 'utf-8');
  try {
    execSync(`npx wrangler d1 execute quidproquo-db ${flag} --file="${tmpFile}"`, { stdio: 'inherit' });
  } finally {
    unlinkSync(tmpFile);
  }
}

async function syncPosts() {
  const files = await collectMarkdownFiles(POSTS_DIR);
  console.log(`Found ${files.length} post(s) to sync`);

  const postStatements: string[] = [];
  const chunkStatements: string[] = [];

  for (const filepath of files) {
    const raw = await readFile(filepath, 'utf-8');
    const { data, content } = matter(raw);

    if (data.draft) {
      console.log(`  Skip draft: ${filepath}`);
      continue;
    }

    const publishAt = new Date(data.date as string);
    if (!INCLUDE_FUTURE && publishAt.getTime() > Date.now()) {
      console.log(`  Skip unpublished: ${filepath}`);
      continue;
    }

    const slug = filepath.replace(POSTS_DIR + '/', '').replace(/\.md$/, '');
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
    chunkStatements.push(`DELETE FROM post_chunks WHERE post_id='${id}';`);
    for (const c of docChunks) {
      const chunkId = generateChunkId(slug, c.chunk_index);
      chunkStatements.push(`
INSERT INTO post_chunks (id, post_id, chunk_index, content)
VALUES ('${chunkId}', '${id}', ${c.chunk_index}, '${escape(c.content)}')
ON CONFLICT(id) DO UPDATE SET content=excluded.content;`.trim());
    }

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

  console.log(`\n✅ Synced ${postStatements.length} post(s) to D1`);
  console.log(`✅ Synced ${chunkStatements.filter(s => s.startsWith('INSERT')).length} chunk(s) to post_chunks`);
}

syncPosts().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
