import fs from 'node:fs';
import path from 'node:path';
import { loadSeoFreshnessConfig } from './config/seo-freshness.config.mjs';

const ROOT = process.cwd();

function readJson(file, fallback = null) {
  if (!file || !fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function slugFromFile(file) {
  return file
    .replace(/^src\/content\/posts\//, '')
    .replace(/\.md$/, '');
}

function publicPathFromSlug(slug) {
  return `/posts/${slug}/`;
}

function normalizeText(value) {
  return String(value ?? '').toLowerCase();
}

function scorePost(post, config, aeoTargetPaths) {
  const title = normalizeText(post.title);
  const file = normalizeText(post.file);
  const slug = slugFromFile(post.file);
  const publicPath = publicPathFromSlug(slug);
  const haystack = `${title} ${file} ${(post.category ?? '').toLowerCase()}`;
  const freshness = post.freshness;
  const ageDays = freshness?.age_days ?? 0;
  let score = 0;
  const reasons = [];

  if (freshness) {
    score += Math.min(40, Math.ceil(ageDays / 30) * 4);
    reasons.push(freshness.reason);
  }

  for (const target of config.targets) {
    const hits = target.keywords.filter(keyword => haystack.includes(keyword.toLowerCase()));
    if (hits.length > 0) {
      score += target.weight * hits.length;
      reasons.push(`${target.label}: ${hits.join(', ')}`);
    }
  }

  if (aeoTargetPaths.has(publicPath)) {
    score += 24;
    reasons.push('AEO probe target page');
  }

  if (!post.suggestions?.tldr) score += 2;
  if (!post.suggestions?.description) score += 2;

  return {
    file: post.file,
    slug,
    path: publicPath,
    title: post.title,
    category: post.category,
    lang: post.lang,
    score,
    age_days: ageDays,
    reasons: [...new Set(reasons)].slice(0, 6),
  };
}

function getAeoTargetPaths(queries) {
  const probes = Array.isArray(queries?.aeo_probes) ? queries.aeo_probes : [];
  return new Set(
    probes
      .flatMap(probe => probe.target_paths ?? [])
      .filter(targetPath => targetPath.startsWith('/posts/'))
  );
}

function buildTargetSummary(priorities, config) {
  return config.targets.map((target) => {
    const keywords = target.keywords.map(keyword => keyword.toLowerCase());
    const pages = priorities
      .filter(page => keywords.some(keyword => `${page.title} ${page.file}`.toLowerCase().includes(keyword)))
      .slice(0, config.limits.topPerTarget);

    return {
      id: target.id,
      label: target.label,
      pages,
    };
  });
}

function writeMarkdown(report, file) {
  const lines = [
    '# SEO Freshness Priorities',
    '',
    `Generated: ${report.generated_at}`,
    '',
    '## Summary',
    '',
    `- Freshness candidates: ${report.summary.freshness_candidates}`,
    `- Prioritized pages: ${report.summary.prioritized_pages}`,
    `- AEO probe targeted pages: ${report.summary.aeo_probe_targeted_pages}`,
    '',
    '## Top Priority Pages',
    '',
    '| Score | Updated risk | Page | Reasons |',
    '| ---: | ---: | --- | --- |',
  ];

  for (const page of report.priorities) {
    lines.push(`| ${page.score} | ${page.age_days}d | [${escapePipe(page.title)}](${page.path}) | ${escapePipe(page.reasons.join('; '))} |`);
  }

  lines.push('', '## Target Buckets', '');
  for (const target of report.targets) {
    lines.push(`### ${target.label}`, '');
    if (target.pages.length === 0) {
      lines.push('- No current high-priority pages.', '');
      continue;
    }
    for (const page of target.pages) lines.push(`- ${page.score}: [${page.title}](${page.path})`);
    lines.push('');
  }

  lines.push('## Notes', '');
  lines.push('- Use this as a queue for manual refresh work; it does not claim search ranking impact without GSC/Bing/GA4 data.');

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${lines.join('\n')}\n`);
}

function escapePipe(value) {
  return String(value ?? '').replace(/\|/g, '\\|');
}

function main() {
  const config = loadSeoFreshnessConfig({ argv: process.argv.slice(2) });
  const contentOps = readJson(config.paths.contentOps, { posts: [], summary: {} });
  const queries = readJson(config.paths.queries, {});
  const aeoTargetPaths = getAeoTargetPaths(queries);

  const scored = (contentOps.posts ?? [])
    .map(post => scorePost(post, config, aeoTargetPaths))
    .filter(post => post.score > 0)
    .sort((a, b) => b.score - a.score || b.age_days - a.age_days || String(a.file).localeCompare(String(b.file)));

  const priorities = scored.slice(0, config.limits.topPages);
  const report = {
    generated_at: new Date().toISOString(),
    inputs: {
      content_ops: path.relative(ROOT, config.paths.contentOps),
      queries: path.relative(ROOT, config.paths.queries),
    },
    summary: {
      freshness_candidates: contentOps.summary?.freshness_candidates ?? 0,
      prioritized_pages: priorities.length,
      aeo_probe_targeted_pages: priorities.filter(page => aeoTargetPaths.has(page.path)).length,
    },
    priorities,
    targets: buildTargetSummary(scored, config),
  };

  fs.mkdirSync(path.dirname(config.paths.jsonReport), { recursive: true });
  fs.writeFileSync(config.paths.jsonReport, `${JSON.stringify(report, null, 2)}\n`);
  writeMarkdown(report, config.paths.markdownReport);
  console.log(`SEO freshness reports written to ${path.relative(ROOT, config.paths.jsonReport)} and ${path.relative(ROOT, config.paths.markdownReport)}`);
}

main();
