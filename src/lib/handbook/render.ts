// 手冊與設計頁共用的 Markdown 渲染：build 時轉 HTML，並把文件裡的相對連結改指到站內或 GitHub。
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { DOCS, REPO_BLOB } from './sources';

let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | undefined;

const bySlugPath = new Map(DOCS.map((d) => [d.path, d.slug]));

function normalize(parts: string[]): string {
  const out: string[] = [];
  for (const p of parts) {
    if (!p || p === '.') continue;
    if (p === '..') out.pop();
    else out.push(p);
  }
  return out.join('/');
}

/** 文件內的相對連結：手冊收錄的 .md → /handbook/<slug>；其他 repo 檔 → GitHub 原始檔。 */
export function resolveHref(href: string, fromPath: string): string {
  if (/^([a-z]+:|#|\/)/i.test(href)) return href;
  const [target, hash] = href.split('#');
  const decoded = decodeURIComponent(target);
  const dir = fromPath.split('/').slice(0, -1);
  const relative = normalize([...dir, ...decoded.split('/')]);
  const rootish = normalize(decoded.split('/'));
  // 有些文件用 repo 根目錄相對的寫法（docs/…、src/…），兩種解讀都試。
  for (const candidate of [relative, rootish]) {
    const slug = bySlugPath.get(candidate);
    if (slug) return `/handbook/${slug}/${hash ? `#${hash}` : ''}`;
  }
  const repoPath = /^(docs|src|scripts|tests|\.agents|\.github|public)\//.test(rootish) ? rootish : relative;
  return `${REPO_BLOB}${repoPath.split('/').map(encodeURIComponent).join('/')}${hash ? `#${hash}` : ''}`;
}

export async function renderMarkdown(markdown: string, fromPath: string): Promise<string> {
  processor ??= await createMarkdownProcessor();
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const { code } = await processor.render(body);
  return code.replace(/href="([^"]+)"/g, (_, href: string) => {
    const resolved = resolveHref(href.replace(/&amp;/g, '&'), fromPath);
    const external = /^https?:/.test(resolved);
    return `href="${resolved.replace(/&/g, '&amp;')}"${external ? ' target="_blank" rel="noopener"' : ''}`;
  });
}
