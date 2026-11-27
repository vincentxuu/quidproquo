// 專案手冊（/handbook/）的資料來源：全部在 build 時從 repo 正本讀進來，不手抄。
// 正本改了，手冊下次 build 就跟著變；這裡只負責「讀哪些檔、怎麼分區、怎麼抽摘要」。

export const REPO_BLOB = 'https://github.com/vincentxuu/quidproquo/blob/main/';

export type SectionId = 'governance' | 'adr' | 'product' | 'dev' | 'skills';

export interface HandbookDoc {
  slug: string; // /handbook/<slug>
  path: string; // repo 相對路徑
  section: SectionId;
  title: string;
  summary: string;
  raw: string;
  /** skills 專用：frontmatter description */
  description?: string;
  /** ADR 專用：編號 */
  number?: string;
}

export const SECTIONS: { id: SectionId; label: string; desc: string }[] = [
  { id: 'governance', label: '治理', desc: '行動分級、什麼要先問、commit 流程、待人決定的事。' },
  { id: 'adr', label: '決策紀錄', desc: '做過的重要決定與理由；只追加，舊決定標記取代，不改寫。' },
  { id: 'product', label: '業務規格', desc: '功能的 PRD 與規格：要解決什麼、範圍、驗收方式。' },
  { id: 'dev', label: '開發規範', desc: '給人與 agent 的開發規則：技術棧、指令、命名、commit、worktree、設計。' },
  { id: 'skills', label: 'Agent skills', desc: 'agent 的工作流程定義（.agents/skills）；觸發條件寫在 description。' },
];

const raw = (mods: Record<string, unknown>) => mods as Record<string, string>;

// 路徑以 repo 根目錄為準（Vite 的 / 開頭 glob）。.agents 是點開頭目錄，要 exhaustive 才掃得到。
const governance = raw(import.meta.glob('/docs/governance/*.md', { query: '?raw', import: 'default', eager: true }));
const adr = raw(import.meta.glob('/docs/adr/*.md', { query: '?raw', import: 'default', eager: true }));
const product = raw(import.meta.glob('/docs/product/**/*.md', { query: '?raw', import: 'default', eager: true }));
const dev = raw(import.meta.glob(['/CLAUDE.md', '/AGENTS.md', '/docs/worktree-runbook.md', '/docs/design-system.md'], { query: '?raw', import: 'default', eager: true }));
const skills = raw(import.meta.glob('/.agents/skills/*/SKILL.md', { query: '?raw', import: 'default', eager: true, exhaustive: true }));

export const progressRaw = Object.values(raw(import.meta.glob('/progress.txt', { query: '?raw', import: 'default', eager: true })))[0] ?? '';
export const verifyRaw = Object.values(raw(import.meta.glob('/scripts/verify.mjs', { query: '?raw', import: 'default', eager: true })))[0] ?? '';
export const packageRaw = Object.values(raw(import.meta.glob('/package.json', { query: '?raw', import: 'default', eager: true })))[0] ?? '{}';
const scriptSources = raw(import.meta.glob(['/scripts/*.{mjs,ts}', '/.agents/skills/*/scripts/*.mjs'], { query: '?raw', import: 'default', eager: true, exhaustive: true }));

function frontmatter(text: string): { data: Record<string, string>; body: string } {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: text };
  const data: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return { data, body: text.slice(m[0].length) };
}

function firstHeading(body: string): string | undefined {
  return body.match(/^#\s+(.+)$/m)?.[1].trim();
}

/** 第一段非標題、非引言、非表格、非清單的文字，去掉 Markdown 記號，截 120 字。 */
function firstParagraph(body: string): string {
  for (const block of body.split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || /^(#|\||-{3}|```|<)/.test(t)) continue;
    const text = t
      .replace(/^>\s?/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[`*_]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) return text.length > 120 ? `${text.slice(0, 120)}…` : text;
  }
  return '';
}

const toSlug = (p: string) =>
  p.replace(/^\//, '').replace(/\.md$/, '').replace(/^\.agents\/skills\/([^/]+)\/SKILL$/, 'skills/$1').replace(/\s+/g, '-');

function build(section: SectionId, mods: Record<string, string>): HandbookDoc[] {
  return Object.entries(mods)
    .map(([key, text]) => {
      const path = key.replace(/^\//, '');
      const { data, body } = frontmatter(text);
      const file = path.split('/').pop()!.replace(/\.md$/, '');
      const name = section === 'skills' ? path.split('/')[2] : file;
      return {
        slug: toSlug(key),
        path,
        section,
        title: section === 'skills' ? name : firstHeading(body) ?? name,
        summary: section === 'skills' ? data.description ?? '' : firstParagraph(body),
        raw: text,
        description: data.description,
        number: section === 'adr' ? file.match(/^(\d+)/)?.[1] : undefined,
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

export const DOCS: HandbookDoc[] = [
  ...build('governance', governance),
  ...build('adr', adr),
  ...build('product', product),
  ...build('dev', dev),
  ...build('skills', skills),
];

export const docsBySection = (id: SectionId) => DOCS.filter((d) => d.section === id);

// ── 檢查：pnpm verify 跑哪些步驟、各自擋什麼 ──────────────────────────────────

export interface CheckStep {
  label: string;
  command: string;
  /** verify.mjs 裡寫在這一步上面的註解 */
  note: string;
  /** 對應腳本開頭的說明註解 */
  purpose: string;
  script?: string;
  selfTest: boolean;
}

function scriptHeader(text: string): string {
  const lines: string[] = [];
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (t.startsWith('#!') || (lines.length === 0 && t === '')) continue;
    const m = t.match(/^(?:\/\/|\/\*\*?|\*(?!\/))\s?(.*)$/);
    if (!m) break;
    if (t.startsWith('*/')) break;
    lines.push(m[1]);
  }
  return lines.join(' ').replace(/\s+/g, ' ').replace(/\*\/$/, '').trim();
}

export function parseChecks(): CheckStep[] {
  const pkgScripts: Record<string, string> = JSON.parse(packageRaw).scripts ?? {};
  const start = verifyRaw.indexOf('const FULL_STEPS = [');
  if (start < 0) return [];
  const end = verifyRaw.indexOf('\n];', start);
  const body = verifyRaw.slice(start, end);
  const steps: CheckStep[] = [];
  let pending: string[] = [];
  for (const line of body.split('\n').slice(1)) {
    const t = line.trim();
    const c = t.match(/^\/\/\s?(.*)$/);
    if (c) { pending.push(c[1]); continue; }
    const s = t.match(/^\[\s*'([^']+)'\s*,\s*'([^']+)'\s*\]/);
    if (!s) { pending = []; continue; }
    const [, label, command] = s;
    let target = command;
    const pnpm = command.match(/^pnpm\s+([\w:-]+)/);
    if (pnpm && pkgScripts[pnpm[1]]) target = pkgScripts[pnpm[1]];
    const file = target.match(/((?:\.agents\/skills\/[\w-]+\/)?scripts\/[\w.-]+\.(?:mjs|ts))/)?.[1];
    const src = file ? scriptSources[`/${file}`] : undefined;
    steps.push({
      label,
      command,
      note: pending.join(' '),
      purpose: src ? scriptHeader(src) : '',
      script: file,
      selfTest: /--self-test|regression tests/.test(command + label),
    });
    pending = [];
  }
  return steps;
}

// ── 目前進度：progress.txt 的頂層條目 ───────────────────────────────────────

export function parseProgress(): { updated: string; items: string[] } {
  const updated = progressRaw.match(/^Last updated:\s*(.+)$/m)?.[1] ?? '';
  const items = progressRaw.split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2));
  return { updated, items };
}

/** 粗估 token：CJK 一字約 1 token，其他約 4 字元 1 token。只用來比大小，不是精確計數。 */
export function estimateTokens(text: string): number {
  const cjk = (text.match(/[　-鿿＀-￯]/g) ?? []).length;
  return Math.round(cjk + (text.length - cjk) / 4);
}
