// 從 tokens.css 原文解析出設計頁（/design/）的 token 清單。
// 頁面不手抄 token：tokens.css 加一個 token，設計頁就會自動多一列，兩邊不會各說各話。

export type TokenKind = 'color' | 'corner' | 'font-size' | 'space' | 'shadow' | 'other';

export interface Token {
  name: string;
  light: string;
  dark?: string;
  note?: string;
}

export interface TokenGroup {
  id: string;
  label: string;
  kind: TokenKind;
  tokens: Token[];
}

// 由上往下比對，先中先贏；沒中的進「其他」。
const GROUPS: { id: string; label: string; kind: TokenKind; test: RegExp }[] = [
  { id: 'brand', label: '強調色', kind: 'color', test: /^--brand-/ },
  { id: 'text', label: '文字', kind: 'color', test: /^--(text-|heading-accent$)/ },
  { id: 'bg', label: '背景', kind: 'color', test: /^--bg-(page|subtle|card|muted)$/ },
  { id: 'border', label: '邊框', kind: 'color', test: /^--border/ },
  { id: 'status', label: '狀態', kind: 'color', test: /^--(info|success|warning|danger)/ },
  { id: 'badge', label: '徽章與標記', kind: 'color', test: /^--(cat-|type-|mark-)/ },
  { id: 'corner', label: '圓角', kind: 'corner', test: /^--corner-/ },
  { id: 'fs', label: '字級', kind: 'font-size', test: /^--fs-/ },
  { id: 'space', label: '間距', kind: 'space', test: /^--space-/ },
  { id: 'shadow', label: '陰影、遮罩、focus', kind: 'shadow', test: /^--(shadow-|focus-ring$)/ },
  { id: 'media', label: '程式碼、影片、投影片', kind: 'color', test: /^--(code-|bg-code$|bg-video$|on-video$|video-|slide-|shine$|scrim$)/ },
  { id: 'diagram', label: '圖表', kind: 'color', test: /^--diagram-/ },
];

function parseBlock(css: string, selector: string): Map<string, { value: string; note?: string }> {
  const out = new Map<string, { value: string; note?: string }>();
  const start = css.indexOf(`${selector} {`);
  if (start < 0) return out;
  const end = css.indexOf('\n}', start);
  const body = css.slice(start, end);
  for (const line of body.split('\n')) {
    const m = line.match(/^\s*(--[\w-]+)\s*:\s*([^;]+);\s*(?:\/\*\s*(.*?)\s*\*\/)?/);
    if (m) out.set(m[1], { value: m[2].trim(), note: m[3] || undefined });
  }
  return out;
}

export function parseTokens(css: string): TokenGroup[] {
  const light = parseBlock(css, ':root');
  const dark = parseBlock(css, '[data-theme="dark"]');
  const groups: TokenGroup[] = [...GROUPS.map((g) => ({ id: g.id, label: g.label, kind: g.kind, tokens: [] as Token[] })),
    { id: 'other', label: '其他', kind: 'other' as TokenKind, tokens: [] as Token[] }];
  for (const [name, { value, note }] of light) {
    const idx = GROUPS.findIndex((g) => g.test.test(name));
    const group = groups[idx < 0 ? groups.length - 1 : idx];
    group.tokens.push({ name, light: value, dark: dark.get(name)?.value, note: note ?? dark.get(name)?.note });
  }
  return groups.filter((g) => g.tokens.length > 0);
}
