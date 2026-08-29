import path from 'node:path';

const ROOT = path.resolve('.');

export const DEFAULT_SEO_OBSERVABILITY_CONFIG = {
  paths: {
    contentOps: path.resolve(ROOT, 'docs/content-ops-report.json'),
    queries: path.resolve(ROOT, 'docs/seo-observability-queries.json'),
    report: path.resolve(ROOT, 'docs/seo-observability-report.json'),
  },
  searchConsole: {
    siteUrl: 'sc-domain:quidproquo.cc',
    dimensions: ['query', 'page'],
    type: 'web',
    rowLimit: 1000,
    tokenEnv: 'GSC_ACCESS_TOKEN',
  },
  ga4: {
    propertyId: '',
    dimensions: ['pagePath'],
    metrics: ['activeUsers', 'screenPageViews', 'sessions'],
    rowLimit: 1000,
    tokenEnv: 'GA4_ACCESS_TOKEN',
  },
  dateRange: {
    lagDays: 2,
    windowDays: 28,
    startDate: '',
    endDate: '',
  },
};

export function loadSeoObservabilityConfig({ argv = [], env = process.env } = {}) {
  const cli = parseArgs(argv);
  const config = structuredClone(DEFAULT_SEO_OBSERVABILITY_CONFIG);

  config.paths.contentOps = cli.contentOps ?? config.paths.contentOps;
  config.paths.queries = cli.queries ?? config.paths.queries;
  config.paths.report = cli.report ?? config.paths.report;

  config.searchConsole.siteUrl = env.GSC_SITE_URL ?? config.searchConsole.siteUrl;
  config.searchConsole.rowLimit = toPositiveInteger(env.GSC_ROW_LIMIT, config.searchConsole.rowLimit);
  config.searchConsole.accessToken = env[config.searchConsole.tokenEnv] ?? '';

  config.ga4.propertyId = env.GA4_PROPERTY_ID ?? config.ga4.propertyId;
  config.ga4.rowLimit = toPositiveInteger(env.GA4_ROW_LIMIT, config.ga4.rowLimit);
  config.ga4.accessToken = env[config.ga4.tokenEnv] ?? '';

  config.dateRange.startDate = env.SEO_OBSERVE_START_DATE ?? config.dateRange.startDate;
  config.dateRange.endDate = env.SEO_OBSERVE_END_DATE ?? config.dateRange.endDate;

  return {
    ...config,
    inputs: {
      gsc: cli.gsc,
      bing: cli.bing,
      llm: cli.llm,
    },
    liveFetch: {
      gsc: cli.fetchGsc,
      ga4: cli.fetchGa4,
    },
    help: cli.help,
  };
}

export function resolveDateRange(config, now = new Date()) {
  if (config.dateRange.startDate && config.dateRange.endDate) {
    return {
      startDate: config.dateRange.startDate,
      endDate: config.dateRange.endDate,
    };
  }

  const end = new Date(now);
  end.setUTCDate(end.getUTCDate() - config.dateRange.lagDays);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (config.dateRange.windowDays - 1));

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

export function publicConfigSnapshot(config) {
  return {
    paths: {
      contentOps: path.relative(ROOT, config.paths.contentOps),
      queries: path.relative(ROOT, config.paths.queries),
      report: path.relative(ROOT, config.paths.report),
    },
    searchConsole: {
      siteUrl: config.searchConsole.siteUrl,
      dimensions: config.searchConsole.dimensions,
      type: config.searchConsole.type,
      rowLimit: config.searchConsole.rowLimit,
      tokenEnv: config.searchConsole.tokenEnv,
      configured: Boolean(config.searchConsole.accessToken),
    },
    ga4: {
      propertyId: config.ga4.propertyId ? '(configured)' : '',
      dimensions: config.ga4.dimensions,
      metrics: config.ga4.metrics,
      rowLimit: config.ga4.rowLimit,
      tokenEnv: config.ga4.tokenEnv,
      configured: Boolean(config.ga4.propertyId && config.ga4.accessToken),
    },
    dateRange: resolveDateRange(config),
  };
}

function parseArgs(argv) {
  const args = {
    contentOps: null,
    queries: null,
    gsc: null,
    bing: null,
    llm: null,
    report: null,
    fetchGsc: false,
    fetchGa4: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const next = argv[index + 1];
    if (key === '--content-ops') args.contentOps = path.resolve(next), index += 1;
    else if (key === '--queries') args.queries = path.resolve(next), index += 1;
    else if (key === '--gsc') args.gsc = path.resolve(next), index += 1;
    else if (key === '--bing') args.bing = path.resolve(next), index += 1;
    else if (key === '--llm') args.llm = path.resolve(next), index += 1;
    else if (key === '--report') args.report = path.resolve(next), index += 1;
    else if (key === '--fetch-gsc') args.fetchGsc = true;
    else if (key === '--fetch-ga4') args.fetchGa4 = true;
    else if (key === '--help' || key === '-h') args.help = true;
  }

  return args;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function toPositiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
