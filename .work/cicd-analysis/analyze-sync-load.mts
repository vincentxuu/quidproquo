import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';
import { chunkMarkdown } from '../../src/lib/crawl/chunker';
import { isSearchIndexEligiblePostData } from '../../src/utils/publishing';

const postsDir = 'src/content/posts';

async function markdownFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.name.endsWith('.md') ? [path] : [];
  }));
  return nested.flat();
}

const files = await markdownFiles(postsDir);
let eligiblePosts = 0;
let totalChunks = 0;
let contentBytes = 0;
let chunkContentBytes = 0;

for (const file of files) {
  const raw = await readFile(file, 'utf8');
  const { data, content } = matter(raw);
  if (data.draft || data.search === false) continue;
  if (!isSearchIndexEligiblePostData({
    date: new Date(data.date as string),
    draft: false,
    search: true,
  })) continue;

  eligiblePosts += 1;
  contentBytes += Buffer.byteLength(content);
  const slug = file.replace(`${postsDir}/`, '').replace(/\.md$/, '');
  const chunks = chunkMarkdown(content, slug, data.title as string);
  totalChunks += chunks.length;
  chunkContentBytes += chunks.reduce((sum, chunk) => sum + Buffer.byteLength(chunk.content), 0);
}

const postBatches = Math.ceil(eligiblePosts / 50);
const chunkStatements = eligiblePosts * 2 + totalChunks * 2;
const chunkBatches = Math.ceil(chunkStatements / 200);
const pruneBatches = 1;

console.log(JSON.stringify({
  allMarkdownFiles: files.length,
  eligiblePosts,
  totalChunks,
  contentMiB: Number((contentBytes / 1024 / 1024).toFixed(2)),
  chunkContentMiB: Number((chunkContentBytes / 1024 / 1024).toFixed(2)),
  remoteWranglerCalls: {
    postBatches,
    chunkBatches,
    pruneBatches,
    total: postBatches + chunkBatches + pruneBatches,
  },
}, null, 2));
