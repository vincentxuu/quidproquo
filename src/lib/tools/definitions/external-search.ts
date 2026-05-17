import type { SearchResult } from '../../rag/state'
import { searchBlogPosts } from '../../rag/tools/search-posts'
import { searchDocs } from '../../rag/tools/search-docs'
import { defineSyscall } from '../../agent-os/tools/define'

const JINA_SEARCH_BASE = 'https://s.jina.ai/'
const CLOUDFLARE_RENDER_BASE = 'https://api.cloudflare.com/client/v4/accounts'
const TAVILY_SEARCH_URL = 'https://api.tavily.com/search'
const FIRECRAWL_SEARCH_URL = 'https://api.firecrawl.dev/v1/search'
const EXA_SEARCH_URL = 'https://api.exa.ai/search'
const BRAVE_SEARCH_URL = 'https://api.search.brave.com/res/v1/web/search'
const SERPER_SEARCH_URL = 'https://google.serper.dev/search'
const SERPAPI_SEARCH_URL = 'https://serpapi.com/search'
const LINKUP_SEARCH_URL = 'https://api.linkup.ai/search'
const BOCHA_SEARCH_URL = 'https://api.bochaai.com/search'
const BRIGHTDATA_SEARCH_URL = 'https://api.brightdata.com/search'
const DEFAULT_MAX_RESULTS = 5
const DEFAULT_TIMEOUT_MS = 8000

type SearchApiKeys = Partial<Record<string, string>>

export interface ExternalSearchInput {
  query: string
  limit?: number
  timeoutMs?: number
  providers?: string[]
  apiKeys?: SearchApiKeys
}

interface ParsedSearchResult {
  source_url: string
  title: string
  claim: string
  evidence_excerpt: string
  score?: number
}

export async function searchExternalTools({
  query,
  limit = DEFAULT_MAX_RESULTS,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  providers = ['jina'],
  apiKeys = {},
}: ExternalSearchInput): Promise<SearchResult[]> {
  const cleanQuery = query.trim()
  if (!cleanQuery) return []
  const providerSet = new Set(
    providers
      .map((provider) => String(provider ?? '').trim().toLowerCase())
      .filter(Boolean)
  )
  if (providerSet.size === 0) return []
  const providerBudget = Math.max(1, Math.floor(limit / providerSet.size))

  const tasks: Promise<ParsedSearchResult[]>[] = []
  if (providerSet.has('jina')) {
    tasks.push(searchWithJina({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('cloudflare')) {
    tasks.push(searchWithCloudflareBrowserRun({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('posts')) {
    tasks.push(searchBlogPosts({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      shortCircuit: false,
    }).then((results) => results.map((result) => ({
      source_url: result.source_url,
      title: result.title ?? result.source_url,
      claim: result.claim,
      evidence_excerpt: result.evidence_excerpt,
      score: result.relevance_score,
    }))))
  }

  if (providerSet.has('docs')) {
    tasks.push(searchDocs({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      shortCircuit: false,
    }).then((results) => results.map((result) => ({
      source_url: result.source_url,
      title: result.title ?? result.source_url,
      claim: result.claim,
      evidence_excerpt: result.evidence_excerpt,
      score: result.relevance_score,
    }))))
  }

  if (providerSet.has('tavily')) {
    tasks.push(searchWithTavily({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('firecrawl')) {
    tasks.push(searchWithFirecrawl({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('exa')) {
    tasks.push(searchWithExa({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('linkup')) {
    tasks.push(searchWithLinkup({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('brave')) {
    tasks.push(searchWithBrave({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('bocha')) {
    tasks.push(searchWithBocha({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('brightdata')) {
    tasks.push(searchWithBrightData({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('serper')) {
    tasks.push(searchWithSerper({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  if (providerSet.has('serpapi')) {
    tasks.push(searchWithSerpApi({
      query: cleanQuery,
      limit: Math.max(providerBudget, limit),
      timeoutMs,
      apiKeys,
    }))
  }

  const settled = await Promise.allSettled(tasks)
  const merged = settled.flatMap((entry) => (entry.status === 'fulfilled' ? entry.value : []))
  const dedup = dedupeByUrl(merged)
  return mergedWithScore(dedup)
    .slice(0, limit)
    .map((result, index) => normalizeSearchResult(result, index))
}

export const searchExternalSyscall = defineSyscall<ExternalSearchInput, { results: SearchResult[] }>({
  name: 'search.external',
  description: 'Search external and internal sources through configured search providers.',
  inputSchema: {
    type: 'object',
    required: ['query'],
    properties: {
      query: { type: 'string' },
      limit: { type: 'number', default: DEFAULT_MAX_RESULTS },
      timeoutMs: { type: 'number', default: DEFAULT_TIMEOUT_MS },
      providers: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['jina', 'cloudflare', 'posts', 'docs', 'tavily', 'firecrawl', 'exa', 'linkup', 'brave', 'bocha', 'brightdata', 'serper', 'serpapi'],
        },
      },
      apiKeys: { type: 'object', additionalProperties: { type: 'string' } },
    },
  },
  outputSchema: {
    type: 'object',
    required: ['results'],
    properties: {
      results: { type: 'array', items: { type: 'object', additionalProperties: true } },
    },
  },
  costModel: { kind: 'request', perCallUsd: 0 },
  outboundDomains: [
    's.jina.ai',
    'api.cloudflare.com',
    'api.tavily.com',
    'api.firecrawl.dev',
    'api.exa.ai',
    'api.linkup.ai',
    'api.search.brave.com',
    'api.bochaai.com',
    'api.brightdata.com',
    'google.serper.dev',
    'serpapi.com',
  ],
  async handler(_ctx, input) {
    return { results: await searchExternalTools(input) }
  },
})

function mergedWithScore(results: ParsedSearchResult[]): ParsedSearchResult[] {
  return results.map((result, index) => ({
    ...result,
    score: result.score ?? (1 - index / Math.max(results.length, 1)),
  }))
}

function normalizeSearchResult(result: ParsedSearchResult, index: number): SearchResult {
  const date = new Date().toISOString().split('T')[0]
  const chunkId = buildChunkId(result.source_url, index)
  const evidence = result.evidence_excerpt.trim()
  const claimText = result.claim.trim() || (evidence ? evidence.split(/[。.!?]\s*/)[0] : `相關網頁：${result.title}`)

  return {
    claim: claimText,
    evidence_excerpt: evidence,
    source_url: result.source_url,
    chunk_id: chunkId,
    date,
    relevance_score: result.score ?? (1 / (index + 1)),
    images: [],
    links: [],
    type: 'custom',
    title: result.title,
  }
}

async function searchWithJina({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.JINA_SEARCH_API_KEY || apiKeys.JINA_API_KEY
  const url = `${JINA_SEARCH_BASE}?q=${encodeURIComponent(query)}`
  const headers: HeadersInit = { Accept: 'application/json' }
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`
  }

  const response = await fetchWithTimeout(url, { headers }, timeoutMs)
  if (!response.ok) return []

  const raw = await response.text()
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return parseJinaJson(raw, limit)
  }
  return parseJinaText(raw, limit)
}

async function searchWithCloudflareBrowserRun({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const accountId = apiKeys.CLOUDFLARE_ACCOUNT_ID
  const token = apiKeys.CLOUDFLARE_API_TOKEN
  if (!accountId || !token) return []

  const seedUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`
  const seedResponse = await fetchWithTimeout(seedUrl, {}, timeoutMs)
  if (!seedResponse.ok) return []

  const seedHtml = await seedResponse.text()
  const matches = parseDuckDuckGoCandidates(seedHtml)
  const limited = matches.slice(0, Math.min(limit, matches.length))

  if (limited.length === 0) return []

  const details = await Promise.allSettled(
    limited.map((match) => crawlWithCloudflare({
      url: match.url,
      title: match.title,
      snippet: match.snippet,
      accountId,
      token,
      timeoutMs,
    }))
  )

  const raw = details.flatMap((entry) => {
    if (entry.status !== 'fulfilled') return []
    return entry.value ? [entry.value] : []
  })

  if (raw.length > 0) return raw

  return limited.map((match, index) => ({
    source_url: match.url,
    title: match.title,
    claim: match.snippet || match.title,
    evidence_excerpt: match.snippet || `Cloudflare 瀏覽結果：${match.title}`,
    score: 0.8 - (index * 0.05),
  }))
}

async function crawlWithCloudflare({
  url,
  title,
  snippet,
  accountId,
  token,
  timeoutMs,
}: {
  url: string
  title: string
  snippet: string
  accountId: string
  token: string
  timeoutMs: number
}): Promise<ParsedSearchResult | null> {
  const endpoint = `${CLOUDFLARE_RENDER_BASE}/${encodeURIComponent(accountId)}/browser-rendering/content`
  const response = await fetchWithTimeout(
    endpoint,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        gotoOptions: { waitUntil: 'networkidle2' },
      }),
    },
    timeoutMs
  )

  if (!response.ok) return null

  const raw = await response.text()
  let bodyText = raw
  try {
    const payload = JSON.parse(raw) as { result?: { content?: unknown; markdown?: unknown; html?: unknown } | string }
    const result = payload.result
    if (typeof result === 'string') bodyText = result
    else if (result && typeof result === 'object') {
      bodyText = String(
        result.markdown ??
        result.content ??
        result.html ??
        ''
      )
    }
  } catch {
    // keep plain text
  }

  const plain = stripHtml(bodyText)
  const evidence = plain
    ? `${snippet ? `${snippet}\n\n` : ''}${plain.slice(0, 1200)}`
    : snippet

  if (!evidence) return null
  return {
    source_url: url,
    title: title || domainFromUrl(url),
    claim: evidence.split('\n')[0]?.slice(0, 200) || title,
    evidence_excerpt: evidence.slice(0, 2000),
    score: 0.9,
  }
}

async function searchWithTavily({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.TAVILY_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    TAVILY_SEARCH_URL,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        max_results: limit,
        include_answer: false,
        include_raw_content: false,
      }),
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { results?: unknown[] } | null
  const items = Array.isArray(payload?.results) ? payload.results : []
  return items
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.url || item.link || item.source || '')),
      title: String(item.title || item.url || '').trim(),
      claim: String(item.content || item.raw_content || item.snippet || '').trim(),
      evidence_excerpt: String(item.content || item.description || item.snippet || '').trim(),
      score: typeof item.score === 'number' ? item.score : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithFirecrawl({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.FIRECRAWL_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    FIRECRAWL_SEARCH_URL,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        limit,
        timeout: Math.floor(timeoutMs / 1000),
      }),
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { data?: unknown[] } | null
  const items = Array.isArray(payload?.data) ? payload.data : []
  return items
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.url || item.source || '')),
      title: String(item.title || item.url || '').trim(),
      claim: String(item.content || item.markdown || item.text || '').trim(),
      evidence_excerpt: String(item.content || item.markdown || item.text || '').trim(),
      score: typeof item.score === 'number' ? item.score : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithExa({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.EXA_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    EXA_SEARCH_URL,
    {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        numResults: limit,
        useAutoprompt: true,
        type: 'keyword',
      }),
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { results?: unknown[] } | null
  const items = Array.isArray(payload?.results) ? payload.results : []
  return items
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.url || '')),
      title: String(item.title || item.url || '').trim(),
      claim: String(item.text || item.highlights || item.snippet || '').trim(),
      evidence_excerpt: String(item.text || item.snippet || '').trim(),
      score: typeof item.score === 'number' ? item.score : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithBrave({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.BRAVE_SEARCH_API_KEY || apiKeys.BRAVE_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    `${BRAVE_SEARCH_URL}?q=${encodeURIComponent(query)}&count=${Math.min(limit, 20)}`,
    {
      headers: {
        'X-Subscription-Token': apiKey,
      },
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { web?: { results?: unknown[] } } | null
  const results = Array.isArray(payload?.web?.results) ? payload.web.results : []
  return results
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.url || item.link || '')),
      title: String(item.title || item.url || '').trim(),
      claim: String(item.description || item.name || '').trim(),
      evidence_excerpt: String(item.description || item.snippet || '').trim(),
      score: typeof item.rank === 'number' ? 1 - item.rank / 100 : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithLinkup({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.LINKUP_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    LINKUP_SEARCH_URL,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        k: Math.min(limit, 20),
        format: 'json',
      }),
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as {
    results?: unknown[]
    data?: unknown[]
    hits?: { web?: unknown[] }
  } | null
  const rawItems = Array.isArray(payload?.results)
    ? payload.results
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.hits?.web)
        ? payload.hits.web
        : []
  return rawItems
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.url || item.link || '')),
      title: String(item.title || item.url || '').trim(),
      claim: String(item.description || item.snippet || '').trim(),
      evidence_excerpt: String(item.description || item.snippet || '').trim(),
      score: typeof item.score === 'number' ? item.score : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithBocha({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.BOCHA_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    BOCHA_SEARCH_URL,
    {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        size: Math.min(limit, 20),
      }),
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { data?: unknown[]; results?: unknown[] } | null
  const rawItems = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.results)
      ? payload.results
      : []
  return rawItems
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.url || item.link || '')),
      title: String(item.title || item.url || '').trim(),
      claim: String(item.summary || item.snippet || item.description || '').trim(),
      evidence_excerpt: String(item.summary || item.snippet || item.description || '').trim(),
      score: typeof item.score === 'number' ? item.score : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithBrightData({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.BRIGHT_DATA_API_KEY || apiKeys.BRIGHTDATA_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    `${BRIGHTDATA_SEARCH_URL}?q=${encodeURIComponent(query)}&size=${Math.min(limit, 20)}`,
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { results?: unknown[]; data?: unknown[] } | null
  const rawItems = Array.isArray(payload?.results) ? payload.results : Array.isArray(payload?.data) ? payload.data : []
  return rawItems
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.url || item.link || '')),
      title: String(item.title || item.url || '').trim(),
      claim: String(item.description || item.snippet || '').trim(),
      evidence_excerpt: String(item.description || item.snippet || '').trim(),
      score: typeof item.score === 'number' ? item.score : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithSerper({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.SERPER_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    SERPER_SEARCH_URL,
    {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: Math.min(limit, 20),
      }),
    },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { organic?: unknown[] } | null
  const results = Array.isArray(payload?.organic) ? payload.organic : []
  return results
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.link || item.url || '')),
      title: String(item.title || item.link || '').trim(),
      claim: String(item.snippet || '').trim(),
      evidence_excerpt: String(item.snippet || '').trim(),
      score: typeof item.position === 'number' ? 1 - item.position / 100 : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

async function searchWithSerpApi({
  query,
  limit,
  timeoutMs,
  apiKeys,
}: {
  query: string
  limit: number
  timeoutMs: number
  apiKeys: SearchApiKeys
}): Promise<ParsedSearchResult[]> {
  const apiKey = apiKeys.SERPAPI_API_KEY
  if (!apiKey) return []

  const response = await fetchWithTimeout(
    `${SERPAPI_SEARCH_URL}?engine=google&query=${encodeURIComponent(query)}&num=${Math.min(limit, 20)}&api_key=${encodeURIComponent(apiKey)}`,
    { },
    timeoutMs
  )
  if (!response.ok) return []

  const payload = await response.json().catch(() => null) as { organic_results?: unknown[] } | null
  const results = Array.isArray(payload?.organic_results) ? payload.organic_results : []
  return results
    .map((item) => asRecord(item))
    .map((item) => ({
      source_url: sanitizeUrl(String(item.link || '')),
      title: String(item.title || item.link || '').trim(),
      claim: String(item.snippet || '').trim(),
      evidence_excerpt: String(item.snippet || '').trim(),
      score: typeof item.position === 'number' ? 1 - item.position / 100 : undefined,
    }))
    .filter((item) => item.source_url)
    .slice(0, limit)
}

function parseJinaJson(raw: string, limit: number): ParsedSearchResult[] {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return []
  }

  const results = extractItemsFromObject(data)
  return results
    .map((entry) => ({
      source_url: sanitizeUrl(entry.source_url),
      title: entry.title,
      claim: entry.claim,
      evidence_excerpt: entry.evidence_excerpt,
      score: entry.score,
    }))
    .filter((result) => result.source_url)
    .slice(0, limit)
}

function extractItemsFromObject(data: unknown): ParsedSearchResult[] {
  const root = asRecord(data)
  const items = toArray(root.data ?? root.results ?? root.items ?? root.entries)
    .concat(toArray(root.matches))
    .concat(toArray(root.documents))
    .concat(toArray(root.top_k_results))

  if (items.length > 0) {
    return items
      .map((item) => asRecord(item))
      .map((entry) => ({
        source_url: String(entry.url || entry.link || entry.href || ''),
        title: String(entry.title || entry.site || entry.url || '').trim(),
        claim: String(
          entry.description ||
          entry.snippet ||
          entry.summary ||
          entry.content ||
          ''
        ).trim(),
        evidence_excerpt: String(
          entry.content ||
          entry.text ||
          entry.description ||
          entry.snippet ||
          ''
        ).trim(),
        score: typeof entry.score === 'number' ? entry.score : undefined,
      }))
      .filter((item) => item.source_url)
  }

  if (typeof rawDataAsText(data) === 'string') {
    return parseJinaText(rawDataAsText(data), DEFAULT_MAX_RESULTS)
  }

  return []
}

function parseJinaText(raw: string, limit: number): ParsedSearchResult[] {
  const blocks = raw.split(/\n{2,}/)
  const output: ParsedSearchResult[] = []

  for (const block of blocks) {
    const url = extractFirstUrl(block)
    if (!url) continue

    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    const title = lines[0]?.replace(/^#+\s*/, '') || url
    const evidence = block.replace(/\n+/g, ' ').slice(0, 1200)

    output.push({
      source_url: sanitizeUrl(url),
      title,
      claim: evidence.split(/[。.!?]\s*/)[0]?.trim() || title,
      evidence_excerpt: evidence,
      score: 0.8,
    })
    if (output.length >= limit) break
  }

  if (output.length === 0 && raw.trim()) {
    return [{
      source_url: '',
      title: 'Jina search raw output',
      claim: raw.slice(0, 120),
      evidence_excerpt: raw.slice(0, 2000),
      score: 0.2,
    }].filter((result) => result.source_url)
  }

  return output
}

function parseDuckDuckGoCandidates(html: string): Array<{ title: string; url: string; snippet: string }> {
  const candidates: Array<{ title: string; url: string; snippet: string }> = []
  const linkRegex = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi

  const urls = new Set<string>()
  let match: RegExpExecArray | null
  const titles = []
  while ((match = linkRegex.exec(html)) && titles.length < 12) {
    const href = decodeHtmlEntities(stripQuotes(match[1]))
    const title = stripHtmlTags(match[2] || '').trim()
    if (!href.startsWith('http')) continue
    titles.push({ href: sanitizeUrl(href), title })
  }

  const snippets = extractSnippetList(html)
  const snippetByUrl = new Map<string, string>()
  for (const snippet of snippets) {
    if (!snippet.url || !snippet.text) continue
    snippetByUrl.set(snippet.url, snippet.text)
  }

  for (const item of titles) {
    if (urls.has(item.href)) continue
    urls.add(item.href)
    candidates.push({
      title: item.title,
      url: item.href,
      snippet: snippetByUrl.get(item.href) ?? '',
    })
  }

  return candidates
}

function extractSnippetList(html: string): Array<{ url: string; text: string }> {
  const list: Array<{ url: string; text: string }> = []
  const pattern = /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>[\s\S]*?<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi
  let found: RegExpExecArray | null

  while ((found = pattern.exec(html)) !== null) {
    const href = sanitizeUrl(decodeHtmlEntities(stripQuotes(found[1] || '')))
    const snippet = stripHtmlTags(found[2] || '').trim()
    if (!href || !href.startsWith('http') || !snippet) continue
    list.push({ url: href, text: snippet })
  }

  return list
}

function dedupeByUrl(results: ParsedSearchResult[]): ParsedSearchResult[] {
  const seen = new Set<string>()
  return results.filter((result) => {
    if (!result.source_url) return false
    const key = normalizeUrl(result.source_url)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function sanitizeUrl(value: string): string {
  try {
    const normalized = new URL(value)
    return normalized.toString()
  } catch {
    const cleaned = value.trim().replace(/^\/\//, 'https://')
    if (!cleaned) return ''
    try {
      return new URL(cleaned).toString()
    } catch {
      return cleaned
    }
  }
}

function normalizeUrl(value: string): string {
  return sanitizeUrl(value).replace(/[#?].*$/, '').replace(/\/+$/, '')
}

function domainFromUrl(value: string): string {
  try {
    return new URL(value).hostname
  } catch {
    return value
  }
}

function extractFirstUrl(text: string): string {
  const match = text.match(/https?:\/\/[^\s\]<>"]+/)
  return match ? sanitizeUrl(match[0]) : ''
}

function stripHtmlTags(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stripHtml(value: string): string {
  return stripHtmlTags(value)
}

function stripQuotes(value: string): string {
  return value.replace(/^['"]|['"]$/g, '')
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function buildChunkId(url: string, index: number): string {
  const text = `${url}#${index}`
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return `web-${hash.toString(36)}`
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

function toArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function rawDataAsText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer))
}
