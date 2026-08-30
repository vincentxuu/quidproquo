import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const POSTS_ROOT = path.resolve('src/content/posts');

const TRANSLATION_REQUIRED_CATEGORIES = new Set([
  'ai',
  'tech',
  'learning',
  'education',
  'policy',
  'design',
  'marketing',
  'product',
  'daily',
]);

// Legacy published zh-TW posts that predate the bilingual hard gate.
// New published structured posts should ship with an adjacent -en.md file.
const LEGACY_ZH_ONLY_POSTS = new Set([
  'src/content/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark.md',
  'src/content/posts/ai/2026-08-22-coding-agent-native-conversation-tui.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2021-cv.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2021-ml.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2021-nlp.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2021-topics.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2022-cv.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2022-ml.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2022-nlp.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2022-topics.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2023-cv.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2023-ml.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2023-nlp.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2023-topics.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2024-cv.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2024-ml.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2024-nlp.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2024-topics.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2025-cv.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2025-ml.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2025-nlp.md',
  'src/content/posts/ai/2026-08-24-ai-conference-2025-topics.md',
  'src/content/posts/ai/2026-08-24-ai-conference-independent-researcher.md',
  'src/content/posts/ai/2026-08-24-ai-conference-submission-to-publication.md',
  'src/content/posts/ai/2026-08-24-ai-conference-tracks-main-findings-db.md',
  'src/content/posts/ai/2026-08-24-ai-conference-who-submits.md',
  'src/content/posts/ai/2026-08-25-apple-pcc-free-afm3.md',
  'src/content/posts/ai/2026-08-25-byteplus-modelark-coding-plan.md',
  'src/content/posts/design/2026-06-05-design-system-color-palettes.md',
  'src/content/posts/learning/2026-08-20-taste-as-amplifier.md',
  'src/content/posts/learning/2026-08-21-cmu-ai-degree.md',
  'src/content/posts/learning/2026-08-21-conference-content-machine.md',
  'src/content/posts/tech/2026-08-23-agent-platform-cloudflare-deployment.md',
  'src/content/posts/tech/2026-08-23-agent-platform-evaluation.md',
  'src/content/posts/tech/2026-08-23-agent-platform-flow-runtime.md',
  'src/content/posts/tech/2026-08-23-agent-platform-observability.md',
  'src/content/posts/tech/2026-08-23-agent-platform-overview.md',
  'src/content/posts/tech/2026-08-23-agent-platform-policy-engine.md',
  'src/content/posts/tech/2026-08-23-agent-platform-provider-router.md',
  'src/content/posts/tech/2026-08-23-agent-platform-skill-system.md',
  'src/content/posts/tech/2026-08-23-stock-agent-1-why-taiwan.md',
  'src/content/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture.md',
  'src/content/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback.md',
  'src/content/posts/tech/2026-08-23-stock-agent-4-backtest-accountability.md',
  'src/content/posts/tech/2026-08-23-stock-agent-5-walkforward-eval.md',
  'src/content/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations.md',
  'src/content/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop.md',
  'src/content/posts/tech/2026-08-23-stock-agent-8-execution-contracts.md',
  'src/content/posts/tech/2026-08-23-stock-agent-9-cloudflare-deployment.md',
  'src/content/posts/tech/2026-08-24-ai-model-evaluation-sources.md',
  'src/content/posts/tech/2026-08-24-ai-model-family-deepseek.md',
  'src/content/posts/tech/2026-08-24-ai-model-landscape-overview.md',
  'src/content/posts/tech/2026-08-25-ai-model-family-apple.md',
  'src/content/posts/tech/2026-08-26-ai-model-family-flux.md',
  'src/content/posts/tech/2026-08-26-ai-model-family-speech-audio.md',
  'src/content/posts/tech/2026-08-26-ai-model-family-video-generation.md',
  'src/content/posts/tech/2026-08-28-rag-chinese-query-empty-search-results-debug.md',
  // 'daily' category added to the hard gate on 2026-08-30 (Q: check-lang-parity had no
  // enforcement for 'daily', so daily-digest routines silently stopped shipping English
  // versions for several days without pnpm verify catching it). These pre-existing gaps
  // are grandfathered; any new zh-TW daily post from here on must ship with an -en.md sibling.
  'src/content/posts/daily/2026-08-27-ai-agent-arxiv-digest.md',
  'src/content/posts/daily/2026-08-27-ai-agent-daily.md',
  'src/content/posts/daily/2026-08-27-ai-agent-github-digest.md',
  'src/content/posts/daily/2026-08-27-framework-mastra-1.62.0.md',
  'src/content/posts/daily/2026-08-27-product-builder-interview-daily.md',
  'src/content/posts/daily/2026-08-27-tool-pgbot.md',
  'src/content/posts/daily/2026-08-28-ai-agent-arxiv-digest.md',
  'src/content/posts/daily/2026-08-28-ai-agent-daily.md',
  'src/content/posts/daily/2026-08-28-ai-agent-github-digest.md',
  'src/content/posts/daily/2026-08-28-tool-vercel-run-sdk.md',
  'src/content/posts/daily/2026-08-28-weekly-review.md',
  'src/content/posts/daily/2026-08-29-ai-agent-daily.md',
  'src/content/posts/daily/2026-08-29-ai-agent-github-digest.md',
  'src/content/posts/daily/2026-08-29-ai-interview-daily.md',
  'src/content/posts/daily/2026-08-29-framework-mastra-1.63.0.md',
  'src/content/posts/daily/2026-08-29-product-builder-interview-daily.md',
  'src/content/posts/daily/2026-08-29-tool-localagents-mcp.md',
]);

// Also checks existing pairs for drift: changed one language, forgot the other.
const STRUCTURE_DRIFT_RATIO = 0.25;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const next = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(next) : next.endsWith('.md') ? [next] : [];
  });
}

function readPost(file) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const body = content.replace(/```[\s\S]*?```/g, '');
  return {
    data,
    headings: (body.match(/^#{1,3} .+$/gm) ?? []).length,
    changelog: (body.match(/^- \d{4}-\d{2}-\d{2}/gm) ?? []).length,
  };
}

function shouldRequireEnglishVersion(file, post) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  return (
    post.data.lang === 'zh-TW' &&
    post.data.draft !== true &&
    TRANSLATION_REQUIRED_CATEGORIES.has(post.data.category) &&
    !LEGACY_ZH_ONLY_POSTS.has(rel)
  );
}

function main() {
  const problems = [];
  let pairs = 0;

  for (const zhFile of walk(POSTS_ROOT)) {
    if (zhFile.endsWith('-en.md')) continue;
    const enFile = zhFile.replace(/\.md$/, '-en.md');
    pairs += 1;
    const rel = path.relative(process.cwd(), zhFile);
    const zh = readPost(zhFile);

    if (!fs.existsSync(enFile)) {
      if (shouldRequireEnglishVersion(zhFile, zh)) {
        problems.push(`${rel}\n  已發布的 ${zh.data.category} / zh-TW 文章缺少英文版：${path.relative(process.cwd(), enFile)}`);
      }
      continue;
    }

    const en = readPost(enFile);

    if (en.data.lang !== 'en') {
      problems.push(`${rel}\n  英文版的 lang 不是 en（是 ${JSON.stringify(en.data.lang)}）`);
    }
    if (String(zh.data.date) !== String(en.data.date)) {
      problems.push(`${rel}\n  date 不一致：zh ${zh.data.date} / en ${en.data.date}——同一篇的兩個語面應該同日`);
    }

    const zhSeries = zh.data.series?.order;
    const enSeries = en.data.series?.order;
    if (zhSeries !== enSeries) {
      problems.push(`${rel}\n  series.order 不一致：zh ${zhSeries} / en ${enSeries}`);
    }

    const max = Math.max(zh.headings, en.headings);
    if (max > 0 && Math.abs(zh.headings - en.headings) / max > STRUCTURE_DRIFT_RATIO) {
      problems.push(
        `${rel}\n  章節數差太多：zh ${zh.headings} 個標題 / en ${en.headings} 個——通常是只改了一邊`,
      );
    }

    if (zh.changelog !== en.changelog) {
      problems.push(
        `${rel}\n  更新紀錄筆數不一致：zh ${zh.changelog} / en ${en.changelog}——一邊更新了，另一邊沒跟上`,
      );
    }
  }

  if (problems.length === 0) {
    console.log(`OK: checked ${pairs} zh/en pair(s), no parity issues found.`);
    return;
  }

  for (const problem of problems) {
    console.log(`\n${problem}`);
  }
  console.log(`\nSummary: ${problems.length} parity issue(s) across ${pairs} pair(s).`);
  process.exitCode = 1;
}

main();
