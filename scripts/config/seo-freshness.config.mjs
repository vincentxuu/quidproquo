import path from 'node:path';

const ROOT = path.resolve('.');

export const DEFAULT_SEO_FRESHNESS_CONFIG = {
  paths: {
    contentOps: path.resolve(ROOT, 'docs/content-ops-report.json'),
    queries: path.resolve(ROOT, 'docs/seo-observability-queries.json'),
    jsonReport: path.resolve(ROOT, 'docs/seo-freshness-priorities.json'),
    markdownReport: path.resolve(ROOT, 'docs/seo-freshness-priorities.md'),
  },
  limits: {
    topPages: 20,
    topPerTarget: 5,
  },
  targets: [
    {
      id: 'llms-txt',
      label: 'llms.txt / AEO',
      weight: 6,
      keywords: ['llms.txt', 'llms-full.txt', 'aeo', 'geo', 'answer engine', 'citation', 'structured data'],
    },
    {
      id: 'agent-frameworks',
      label: 'Agent framework selection',
      weight: 5,
      keywords: ['agent framework', 'langgraph', 'crewai', 'mastra', 'pydantic ai', 'dspy', 'autogen'],
    },
    {
      id: 'rag-vector',
      label: 'RAG / Vector retrieval',
      weight: 5,
      keywords: ['rag', 'vectorize', 'vector database', 'pinecone', 'weaviate', 'qdrant', 'hybrid search', 'bm25'],
    },
    {
      id: 'cloudflare-ai',
      label: 'Cloudflare AI infrastructure',
      weight: 4,
      keywords: ['cloudflare', 'workers ai', 'd1', 'vectorize', 'durable objects', 'workers'],
    },
    {
      id: 'model-provider',
      label: 'Model/provider freshness',
      weight: 3,
      keywords: ['openai', 'anthropic', 'google', 'qwen', 'deepseek', 'ollama', 'vllm', 'llm api', 'inference'],
    },
  ],
};

export function loadSeoFreshnessConfig({ argv = [] } = {}) {
  const cli = parseArgs(argv);
  const config = structuredClone(DEFAULT_SEO_FRESHNESS_CONFIG);

  config.paths.contentOps = cli.contentOps ?? config.paths.contentOps;
  config.paths.queries = cli.queries ?? config.paths.queries;
  config.paths.jsonReport = cli.jsonReport ?? config.paths.jsonReport;
  config.paths.markdownReport = cli.markdownReport ?? config.paths.markdownReport;
  config.limits.topPages = cli.topPages ?? config.limits.topPages;

  return config;
}

function parseArgs(argv) {
  const args = {
    contentOps: null,
    queries: null,
    jsonReport: null,
    markdownReport: null,
    topPages: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    const next = argv[index + 1];
    if (key === '--content-ops') args.contentOps = path.resolve(next), index += 1;
    else if (key === '--queries') args.queries = path.resolve(next), index += 1;
    else if (key === '--json') args.jsonReport = path.resolve(next), index += 1;
    else if (key === '--markdown') args.markdownReport = path.resolve(next), index += 1;
    else if (key === '--top') args.topPages = Number.parseInt(next, 10), index += 1;
  }

  if (!Number.isInteger(args.topPages) || args.topPages <= 0) args.topPages = null;

  return args;
}
