/**
 * Markdown sources hold no emoji. Write a shortcode (`:globe:`, `:warning:`; list in SHORTCODES,
 * src/plugins/rehypeNoEmoji.ts) or a text mark (✓ ✗ ★ ☆) instead; the site draws them as koboyo icons.
 * Emoji inside fenced code blocks and inline code are allowed: those show what a program prints.
 *
 *   pnpm exec tsx scripts/check-no-emoji.ts [files...]   # default: tracked src/content/**\/*.md minus
 *                                                       # scripts/config/no-emoji-baseline.json
 *   pnpm exec tsx scripts/check-no-emoji.ts --self-test
 *
 * Fix: pnpm emoji:fix <files...>  (scripts/convert-emoji-to-source.ts --write)
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { SOURCE_EMOJI_RE } from '../src/plugins/rehypeNoEmoji.ts';

/** Emoji outside code, as `line:column  emoji  context` strings. */
export function findEmoji(src: string): string[] {
  const hits: string[] = [];
  let fence: string | null = null;
  src.split('\n').forEach((line, i) => {
    const f = /^\s*(`{3,}|~{3,})/.exec(line);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length && /^\s*[`~]+\s*$/.test(line)) fence = null;
      return;
    }
    if (f) {
      fence = f[1];
      return;
    }
    // Blank out inline code spans so their contents are not checked.
    const text = line.replace(/(`+)(?:(?!\1).)+?\1/g, (m) => ' '.repeat(m.length));
    for (const m of text.matchAll(SOURCE_EMOJI_RE)) {
      const col = m.index!;
      hits.push(`${i + 1}:${col + 1}  ${m[0]}  ${line.slice(Math.max(0, col - 20), col + 20).trim()}`);
    }
  });
  return hits;
}

function selfTest() {
  const cases: [string, number][] = [
    ['> :globe: [English version](/x)', 0],
    ['| ✓ | ✗ | ★★☆ |', 0],
    ['> 🌏 [English version](/x)', 1],
    ['⚠️ 注意 ✅ 完成', 2],
    ['程式輸出 `print("🚀")` 不算', 0],
    ['```\n🚀 in code\n```\n正文 🎯', 1],
    ['~~~text\n✅\n~~~', 0],
    ['🥇 第一 1️⃣', 2],
  ];
  let failed = 0;
  for (const [src, want] of cases) {
    const got = findEmoji(src).length;
    if (got !== want) {
      failed++;
      console.error(`self-test: ${JSON.stringify(src)} → ${got} hit(s), want ${want}`);
    }
  }
  if (failed) process.exit(1);
  console.log(`check-no-emoji self-test: ${cases.length} cases OK`);
}

if (process.argv.includes('--self-test')) {
  selfTest();
} else {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  // Full mode: tracked files only (another session's untracked draft is not this commit's business),
  // minus the grandfathered posts. Files named on the command line (pre-commit --staged) are always checked.
  const baseline = new Set<string>(JSON.parse(readFileSync('scripts/config/no-emoji-baseline.json', 'utf8')).grandfathered);
  const tracked = execSync('git ls-files src/content', { encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n');
  const files = args.length > 0
    ? args.filter((f) => f.endsWith('.md'))
    : tracked.filter((f) => f.endsWith('.md') && !baseline.has(f));
  let bad = 0;
  const lines: string[] = [];
  for (const file of files) {
    const hits = findEmoji(readFileSync(file, 'utf8'));
    if (hits.length === 0) continue;
    bad++;
    lines.push(`${file}`, ...hits.slice(0, 5).map((h) => `  ${h}`), ...(hits.length > 5 ? [`  … ${hits.length - 5} more`] : []));
  }
  if (bad > 0) {
    console.error(lines.slice(0, 200).join('\n'));
    console.error(`\ncheck-no-emoji: ${bad} file(s) contain emoji outside code. Write a shortcode (:globe:, :warning:) or ✓ ✗ ★ instead; to convert: pnpm emoji:fix <files>`);
    process.exit(1);
  }
  console.log(`check-no-emoji: ${files.length} file(s), no emoji outside code`);
}
