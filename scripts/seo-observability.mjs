#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {
  loadSeoObservabilityConfig,
  publicConfigSnapshot,
  resolveDateRange,
} from './config/seo-observability.config.mjs';

const ROOT = path.resolve('.');

function printHelp() {
  console.log(`Usage: pnpm seo:observe -- [options]

Options:
  --content-ops <path>  Content ops report JSON (default: docs/content-ops-report.json)
  --queries <path>      AEO probe config JSON (default: docs/seo-observability-queries.json)
  --gsc <path>          Google Search Console export JSON
  --bing <path>         Bing Webmaster export JSON
  --llm <path>          LLM/AEO probe result JSON
  --report <path>       Output report JSON (default: docs/seo-observability-report.json)
  --fetch-gsc           Fetch Google Search Console data with GSC_SITE_URL and GSC_ACCESS_TOKEN
  --fetch-ga4           Fetch GA4 data with GA4_PROPERTY_ID and GA4_ACCESS_TOKEN
`);
}

function readJsonIfExists(file) {
  if (!file || !fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function normalizeSearchRows(source) {
  if (!source) return [];
  const rows = Array.isArray(source) ? source : Array.isArray(source.rows) ? source.rows : Array.isArray(source.data) ? source.data : [];

  return rows.map((row) => {
    const keys = Array.isArray(row.keys) ? row.keys : [];
    const query = row.query ?? row.searchQuery ?? keys[0] ?? null;
    const page = row.page ?? row.url ?? row.landingPage ?? keys[1] ?? null;
    const clicks = Number(row.clicks ?? row.click ?? 0);
    const impressions = Number(row.impressions ?? row.impression ?? 0);
    const ctr = row.ctr == null ? (impressions > 0 ? clicks / impressions : 0) : Number(row.ctr);
    const position = row.position == null ? null : Number(row.position);
    return { query, page, clicks, impressions, ctr, position };
  }).filter((row) => row.query || row.page || row.clicks || row.impressions);
}

function normalizeProbeRows(source) {
  if (!source) return [];
  const rows = Array.isArray(source) ? source : Array.isArray(source.probes) ? source.probes : Array.isArray(source.rows) ? source.rows : [];
  return rows.map((row) => ({
    id: row.id ?? row.probe_id ?? null,
    engine: row.engine ?? row.provider ?? 'unknown',
    checked_at: row.checked_at ?? row.checkedAt ?? null,
    cited: Boolean(row.cited ?? row.hasCitation ?? (Array.isArray(row.urls) && row.urls.length > 0)),
    urls: Array.isArray(row.urls) ? row.urls : row.url ? [row.url] : [],
    notes: row.notes ?? '',
  }));
}

async function fetchJson(url, { token, body }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 500)}`);
  }
  return text ? JSON.parse(text) : {};
}

async function fetchGscRows(config) {
  const { siteUrl, accessToken, dimensions, type, rowLimit } = config.searchConsole;
  const token = accessToken;
  if (!siteUrl || !token) {
    return { rows: [], warning: 'Set GSC_SITE_URL and GSC_ACCESS_TOKEN to fetch Google Search Console data.' };
  }

  const { startDate, endDate } = resolveDateRange(config);
  const encodedSite = encodeURIComponent(siteUrl);
  const data = await fetchJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
    {
      token,
      body: {
        startDate,
        endDate,
        dimensions,
        type,
        rowLimit,
      },
    }
  );
  return { rows: normalizeSearchRows(data), warning: null };
}

function normalizeGa4Rows(source) {
  if (!source) return [];
  const dimensionHeaders = source.dimensionHeaders?.map((item) => item.name) ?? [];
  const metricHeaders = source.metricHeaders?.map((item) => item.name) ?? [];
  return (source.rows ?? []).map((row) => {
    const dimensions = Object.fromEntries(
      (row.dimensionValues ?? []).map((item, index) => [dimensionHeaders[index] ?? `dimension_${index}`, item.value])
    );
    const metrics = Object.fromEntries(
      (row.metricValues ?? []).map((item, index) => [metricHeaders[index] ?? `metric_${index}`, Number(item.value)])
    );
    return { dimensions, metrics };
  });
}

async function fetchGa4Rows(config) {
  const { propertyId, accessToken, dimensions, metrics, rowLimit } = config.ga4;
  const token = accessToken;
  if (!propertyId || !token) {
    return { rows: [], warning: 'Set GA4_PROPERTY_ID and GA4_ACCESS_TOKEN to fetch Google Analytics Data API data.' };
  }

  const { startDate, endDate } = resolveDateRange(config);
  const data = await fetchJson(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      token,
      body: {
        dateRanges: [{ startDate, endDate }],
        dimensions: dimensions.map((name) => ({ name })),
        metrics: metrics.map((name) => ({ name })),
        limit: String(rowLimit),
      },
    }
  );
  return { rows: normalizeGa4Rows(data), warning: null };
}

function summarizeSearch(rows) {
  const totals = rows.reduce((acc, row) => {
    acc.clicks += row.clicks;
    acc.impressions += row.impressions;
    return acc;
  }, { clicks: 0, impressions: 0 });

  const pageMap = new Map();
  for (const row of rows) {
    if (!row.page) continue;
    const item = pageMap.get(row.page) ?? { page: row.page, clicks: 0, impressions: 0 };
    item.clicks += row.clicks;
    item.impressions += row.impressions;
    pageMap.set(row.page, item);
  }

  return {
    rows: rows.length,
    clicks: totals.clicks,
    impressions: totals.impressions,
    ctr: totals.impressions > 0 ? Number((totals.clicks / totals.impressions).toFixed(4)) : 0,
    top_pages: [...pageMap.values()]
      .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
      .slice(0, 10),
    low_ctr_opportunities: rows
      .filter((row) => row.impressions >= 50 && row.ctr < 0.02)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 20),
  };
}

function summarizeProbes(probes, expectedProbes) {
  const byId = new Map();
  for (const probe of probes) {
    const key = probe.id ?? 'unmapped';
    const item = byId.get(key) ?? { id: key, runs: 0, cited_runs: 0, engines: new Set(), urls: new Set() };
    item.runs += 1;
    if (probe.cited) item.cited_runs += 1;
    item.engines.add(probe.engine);
    for (const url of probe.urls) item.urls.add(url);
    byId.set(key, item);
  }

  const coverage = [...byId.values()].map((item) => ({
    id: item.id,
    runs: item.runs,
    cited_runs: item.cited_runs,
    citation_rate: Number((item.cited_runs / item.runs).toFixed(3)),
    engines: [...item.engines].sort(),
    urls: [...item.urls].sort(),
  }));

  const expectedIds = new Set(expectedProbes.map((probe) => probe.id));
  const observedIds = new Set(coverage.map((item) => item.id));

  return {
    configured_probes: expectedProbes.length,
    observed_probes: coverage.filter((item) => expectedIds.has(item.id)).length,
    runs: probes.length,
    cited_runs: probes.filter((probe) => probe.cited).length,
    missing_probe_results: [...expectedIds].filter((id) => !observedIds.has(id)),
    coverage,
  };
}

function summarizeAnalytics(rows) {
  const totals = rows.reduce((acc, row) => {
    acc.activeUsers += row.metrics.activeUsers ?? 0;
    acc.screenPageViews += row.metrics.screenPageViews ?? 0;
    acc.sessions += row.metrics.sessions ?? 0;
    return acc;
  }, { activeUsers: 0, screenPageViews: 0, sessions: 0 });

  return {
    rows: rows.length,
    totals,
    top_pages: rows
      .map((row) => ({
        page: row.dimensions.pagePath ?? null,
        active_users: row.metrics.activeUsers ?? 0,
        views: row.metrics.screenPageViews ?? 0,
        sessions: row.metrics.sessions ?? 0,
      }))
      .sort((a, b) => b.views - a.views || b.active_users - a.active_users)
      .slice(0, 20),
  };
}

function inspectBuiltArtifacts() {
  const sitemapPath = path.resolve(ROOT, 'dist/client/sitemap-0.xml');
  const homePath = path.resolve(ROOT, 'dist/client/index.html');
  const postPath = path.resolve(ROOT, 'dist/client/posts/tech/2026-08-21-llms-txt/index.html');
  const result = { checked: false };

  if (!fs.existsSync(sitemapPath) || !fs.existsSync(homePath) || !fs.existsSync(postPath)) return result;

  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const home = fs.readFileSync(homePath, 'utf8');
  const post = fs.readFileSync(postPath, 'utf8');

  return {
    checked: true,
    sitemap_admin_urls: (sitemap.match(/https:\/\/quidproquo\.cc\/admin\/?/g) ?? []).length,
    home_has_website_jsonld: home.includes('application/ld+json') && home.includes('"@type":"WebSite"'),
    post_has_blogposting_jsonld: post.includes('application/ld+json') && post.includes('"@type":"BlogPosting"'),
    post_has_double_slash_og: post.includes('https://quidproquo.cc//og/'),
  };
}

function buildPriorities({ contentOps, gscSummary, bingSummary, analyticsSummary, probeSummary, builtArtifacts }) {
  const priorities = [];

  if (!builtArtifacts.checked) {
    priorities.push('Run pnpm build before release-level SEO validation so built sitemap and HTML can be inspected.');
  } else {
    if (builtArtifacts.sitemap_admin_urls > 0) priorities.push('Remove /admin URLs from built sitemap output.');
    if (!builtArtifacts.home_has_website_jsonld) priorities.push('Restore WebSite JSON-LD on the home page.');
    if (!builtArtifacts.post_has_blogposting_jsonld) priorities.push('Restore BlogPosting JSON-LD on post pages.');
    if (builtArtifacts.post_has_double_slash_og) priorities.push('Fix double-slash Open Graph image URLs.');
  }

  if (contentOps?.summary?.missing_description > 0) {
    priorities.push(`Fill ${contentOps.summary.missing_description} missing meta descriptions.`);
  }
  if (contentOps?.summary?.missing_tldr > 0) {
    priorities.push(`Fill ${contentOps.summary.missing_tldr} missing TLDR fields for answer extraction.`);
  }
  if (contentOps?.summary?.freshness_candidates > 0) {
    priorities.push(`Review ${contentOps.summary.freshness_candidates} freshness candidates before optimizing stale pages.`);
  }
  if (gscSummary.rows === 0) priorities.push('Add Google Search Console export to observe impressions, CTR, and indexed query/page pairs.');
  if (bingSummary.rows === 0) priorities.push('Add Bing Webmaster export to observe Bing/Copilot-side search visibility.');
  if (analyticsSummary.rows === 0) priorities.push('Add GA4 export or env-gated fetch to observe page engagement after search clicks.');
  if (probeSummary.runs === 0) priorities.push('Run fixed AEO probes across answer engines and store public citation results.');
  if (probeSummary.missing_probe_results.length > 0) {
    priorities.push(`Run missing AEO probes: ${probeSummary.missing_probe_results.join(', ')}.`);
  }

  return priorities;
}

async function main() {
  const config = loadSeoObservabilityConfig({ argv: process.argv.slice(2) });
  if (config.help) {
    printHelp();
    return;
  }

  const contentOps = readJsonIfExists(config.paths.contentOps);
  const queries = readJsonIfExists(config.paths.queries) ?? { aeo_probes: [] };
  const liveWarnings = [];
  let gscRows = normalizeSearchRows(readJsonIfExists(config.inputs.gsc));
  if (config.liveFetch.gsc) {
    try {
      const fetched = await fetchGscRows(config);
      gscRows = fetched.rows;
      if (fetched.warning) liveWarnings.push(fetched.warning);
    } catch (error) {
      liveWarnings.push(`Google Search Console fetch failed: ${error.message}`);
    }
  }
  const bingRows = normalizeSearchRows(readJsonIfExists(config.inputs.bing));
  const probes = normalizeProbeRows(readJsonIfExists(config.inputs.llm));
  let ga4Rows = [];
  if (config.liveFetch.ga4) {
    try {
      const fetched = await fetchGa4Rows(config);
      ga4Rows = fetched.rows;
      if (fetched.warning) liveWarnings.push(fetched.warning);
    } catch (error) {
      liveWarnings.push(`Google Analytics Data API fetch failed: ${error.message}`);
    }
  }
  const builtArtifacts = inspectBuiltArtifacts();
  const gscSummary = summarizeSearch(gscRows);
  const bingSummary = summarizeSearch(bingRows);
  const analyticsSummary = summarizeAnalytics(ga4Rows);
  const probeSummary = summarizeProbes(probes, queries.aeo_probes ?? []);

  const report = {
    generated_at: new Date().toISOString(),
    config: publicConfigSnapshot(config),
    inputs: {
      content_ops: path.relative(ROOT, config.paths.contentOps),
      queries: path.relative(ROOT, config.paths.queries),
      gsc: config.inputs.gsc ? path.relative(ROOT, config.inputs.gsc) : null,
      bing: config.inputs.bing ? path.relative(ROOT, config.inputs.bing) : null,
      llm: config.inputs.llm ? path.relative(ROOT, config.inputs.llm) : null,
      live_fetch: {
        gsc: config.liveFetch.gsc,
        ga4: config.liveFetch.ga4,
      },
    },
    technical: {
      built_artifacts: builtArtifacts,
    },
    content: {
      generated_at: contentOps?.generated_at ?? null,
      summary: contentOps?.summary ?? null,
    },
    search: {
      google_search_console: gscSummary,
      bing_webmaster: bingSummary,
    },
    analytics: {
      ga4: analyticsSummary,
    },
    aeo: probeSummary,
    live_warnings: liveWarnings,
    priorities: buildPriorities({ contentOps, gscSummary, bingSummary, analyticsSummary, probeSummary, builtArtifacts }),
  };

  fs.mkdirSync(path.dirname(config.paths.report), { recursive: true });
  fs.writeFileSync(config.paths.report, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`SEO observability report written to ${path.relative(ROOT, config.paths.report)}`);
}

main();
