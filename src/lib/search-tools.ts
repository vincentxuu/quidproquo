export const SUPPORTED_SEARCH_TOOL_PROVIDERS = [
  'jina',
  'cloudflare',
  'posts',
  'docs',
  'tavily',
  'firecrawl',
  'exa',
  'linkup',
  'brave',
  'bocha',
  'brightdata',
  'serper',
  'serpapi',
] as const

export type SearchToolProvider = (typeof SUPPORTED_SEARCH_TOOL_PROVIDERS)[number]
