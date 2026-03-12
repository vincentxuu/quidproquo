// scripts/sync-to-d1.ts
// 把 src/content/posts/ 的 .md 同步到 D1
// Usage: pnpm sync (本地) | pnpm sync:prod (production)

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const POSTS_DIR = 'src/content/posts';
const IS_PROD = process.argv.includes('--prod');

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

async function syncPosts() {
  const files = await collectMarkdownFiles(POSTS_DIR);
  console.log(`Found ${files.length} post(s) to sync`);

  const statements: string[] = [];

  for (const filepath of files) {
    const raw = await readFile(filepath, 'utf-8');
    const { data, content } = matter(raw);

    if (data.draft) {
      console.log(`  Skip draft: ${filepath}`);
      continue;
    }

    // slug = category/YYYY-MM-DD-filename (relative to POSTS_DIR, without .md)
    const slug = filepath.replace(POSTS_DIR + '/', '').replace(/\.md$/, '');
    const id = generateId(slug);
    const now = new Date().toISOString();
    const createdAt = new Date(data.date).toISOString();
    const lang = (data.lang as string) || 'zh-TW';

    const sql = `
INSERT INTO posts (id, slug, title, category, lang, description, tldr, content, tags, created_at, updated_at)
VALUES (
  '${id}', '${escape(slug)}', '${escape(data.title as string)}',
  '${escape(data.category as string)}',
  '${escape(lang)}',
  ${data.description ? `'${escape(data.description as string)}'` : 'NULL'},
  ${data.tldr ? `'${escape(data.tldr as string)}'` : 'NULL'},
  '${escape(content)}',
  '${JSON.stringify(data.tags || [])}',
  '${createdAt}', '${now}'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  category = excluded.category,
  lang = excluded.lang,
  description = excluded.description,
  tldr = excluded.tldr,
  content = excluded.content,
  tags = excluded.tags,
  updated_at = excluded.updated_at;`.trim();

    statements.push(sql);
    console.log(`  Prepared: ${slug}`);
  }

  if (statements.length === 0) {
    console.log('No posts to sync.');
    return;
  }

  const chunks = chunkArray(statements, 100);
  const flag = IS_PROD ? '--remote' : '--local';

  for (const chunk of chunks) {
    const combined = chunk.join('\n');
    execSync(
      `npx wrangler d1 execute quidproquo-db ${flag} --command="${combined.replace(/"/g, '\\"')}"`,
      { stdio: 'inherit' }
    );
  }

  console.log(`\n✅ Synced ${statements.length} post(s) to D1`);
}

syncPosts().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
