/**
 * Rewrites emoji in Markdown posts into what renders the same way without one (see emojiToSource in
 * src/plugins/rehypeNoEmoji.ts): `🌏` → `:globe:`, `✅` → `✓`, `⭐` → `★`, `🥇` → `1`, decorative emoji dropped.
 *
 * Fenced code blocks and inline code are left alone (the site shows them verbatim). Frontmatter strings
 * become plain text, since titles and descriptions are also shown in places that do not expand shortcodes.
 *
 *   node_modules/.bin/tsx scripts/convert-emoji-to-source.ts [--write] [files...]
 *
 * Without files it scans src/content. Without --write it only reports what would change.
 */
import { readFileSync, writeFileSync, globSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { emojiToSource, stripEmojiText, SOURCE_EMOJI_RE } from '../src/plugins/rehypeNoEmoji.ts';

const hasEmoji = (s: string) => {
  SOURCE_EMOJI_RE.lastIndex = 0;
  return SOURCE_EMOJI_RE.test(s);
};

/** Frontmatter: plain text. ⚠ has no text form that passes the check, so the marker is dropped. */
function convertFrontmatter(fm: string): string {
  return fm
    .split('\n')
    .map((line) => {
      if (!hasEmoji(line)) return line;
      const m = /^(\s*(?:-\s+)?(?:[\w-]+:\s*)?)(.*)$/.exec(line)!;
      const [, prefix, value] = m;
      const q = /^(["'])(.*)\1(\s*)$/.exec(value);
      const fix = (v: string) => stripEmojiText(v).replace(/⚠︎?\s?/g, '');
      return q ? `${prefix}${q[1]}${fix(q[2])}${q[1]}${q[3]}` : `${prefix}${fix(value)}`;
    })
    .join('\n');
}

/** Text outside code: convert, and put the renderer's fallback back where a cell or line went blank. */
function convertText(text: string): string {
  if (!hasEmoji(text) && !/[⭐🌟]/u.test(text)) return text;
  return emojiToSource(text).text;
}

/** One line outside fences: inline code spans stay as they are. */
function convertInline(line: string): string {
  let out = '';
  let i = 0;
  while (i < line.length) {
    const tick = line.indexOf('`', i);
    if (tick === -1) {
      out += convertText(line.slice(i));
      break;
    }
    out += convertText(line.slice(i, tick));
    const run = /^`+/.exec(line.slice(tick))![0];
    const close = line.indexOf(run, tick + run.length);
    if (close === -1) {
      out += line.slice(tick);
      break;
    }
    out += line.slice(tick, close + run.length);
    i = close + run.length;
  }
  return out;
}

/** A blank result where there was content keeps a visible mark, as the renderer does. */
function withFallback(before: string, after: string): string {
  if (/\S/.test(before) && !/\S/.test(after)) {
    const r = emojiToSource(before);
    return after.replace(/^(\s*)/, `$1${r.fallback ?? '•'}`);
  }
  return after;
}

/** Leading block markers (quote, list, heading) are kept apart so an emptied item still gets a mark. */
const PREFIX_RE = /^(\s*(?:>\s*)*(?:[-*+]\s+(?:\[[ xX]\]\s+)?|\d+[.)]\s+|#{1,6}\s+)?)(.*)$/;

function convertLine(line: string, startsBlock: boolean): string {
  if (!hasEmoji(line) && !/[⭐🌟]/u.test(line)) return line;
  if (/^\s*\|/.test(line)) {
    // Table row: each cell on its own, so a cell that held only a decorative emoji keeps a mark.
    const cells = line.split(/(?<!\\)\|/);
    return cells
      .map((cell, i) => (i === 0 || i === cells.length - 1 ? convertInline(cell) : withFallback(cell, convertInline(cell))))
      .join('|');
  }
  const [, prefix, rest] = PREFIX_RE.exec(line)!;
  let converted = convertInline(rest);
  // Bold left with nothing inside (`**🚀** 發布` → `**** 發布`) is removed, and an opening `**` left
  // before a space (`**🧑‍✈️ Polly**` → `** Polly**`) closes up again; only where the rewrite made them.
  const emptyBold = /\*\*\s*\*\*|__\s*__/g;
  if ((converted.match(emptyBold) ?? []).length > (rest.match(emptyBold) ?? []).length) {
    converted = converted.replace(emptyBold, '').replace(/^ +/, '');
  }
  const openBold = /(^|[\s(（「『【])(\*\*|__) +(?=[^\s*_])/g;
  if ((converted.match(openBold) ?? []).length > (rest.match(openBold) ?? []).length) {
    converted = converted.replace(openBold, '$1$2');
  }
  // A line that continues a paragraph or list item is not its own element: no fallback mark there.
  return prefix + (startsBlock || prefix.trim() ? withFallback(rest, converted) : converted);
}

function convertBody(body: string): string {
  const lines = body.split('\n');
  let fence: string | null = null;
  return lines
    .map((line, i) => {
      const f = /^\s*(`{3,}|~{3,})/.exec(line);
      if (fence) {
        if (f && f[1][0] === fence[0] && f[1].length >= fence.length && /^\s*[`~]+\s*$/.test(line)) fence = null;
        return line;
      }
      if (f) {
        fence = f[1];
        return line;
      }
      const out = convertLine(line, i === 0 || !/\S/.test(lines[i - 1]));
      // A continuation line that held only emoji goes away; leaving it blank would end the paragraph.
      return /\S/.test(line) && !/\S/.test(out) ? null : out;
    })
    .filter((l): l is string => l !== null)
    .join('\n');
}

/** The whole file: frontmatter to plain text, body to emoji-free Markdown. */
export function convertSource(src: string): string {
  if (!hasEmoji(src) && !/[⭐🌟]/u.test(src)) return src;
  let fm = '';
  let body = src;
  if (src.startsWith('---\n')) {
    const end = src.indexOf('\n---', 4);
    fm = src.slice(0, end);
    body = src.slice(end);
  }
  return convertFrontmatter(fm) + convertBody(body);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const files = args.filter((a) => !a.startsWith('--'));
  const targets = files.length > 0 ? files : globSync('src/content/**/*.md');
  let changedFiles = 0;
  let leftInCode = 0;
  for (const file of targets) {
    const src = readFileSync(file, 'utf8');
    if (!hasEmoji(src) && !/[⭐🌟]/u.test(src)) continue;
    const out = convertSource(src);
    if (out === src) {
      leftInCode++;
      continue;
    }
    changedFiles++;
    if (write) writeFileSync(file, out);
  }
  console.log(`${write ? 'converted' : 'would convert'} ${changedFiles} file(s); ${leftInCode} file(s) only have emoji inside code`);
}
