function normalizeLocator(value) {
  const raw = String(value ?? '').trim().toLowerCase()
  if (!raw) return ''
  try {
    const url = new URL(raw, 'https://quidproquo.cc')
    return url.pathname.replace(/^\/+|\/+$/g, '')
  } catch {
    return raw.replace(/^https?:\/\/[^/]+\//, '').replace(/^\/+|\/+$/g, '')
  }
}

function sourceLocators(metadata) {
  const sources = Array.isArray(metadata?.sources) ? metadata.sources : []
  return sources.flatMap((source) => {
    if (typeof source === 'string') return [normalizeLocator(source)]
    return [normalizeLocator(source?.slug), normalizeLocator(source?.url ?? source?.source_url)]
  }).filter(Boolean)
}

function sourceIdentities(metadata) {
  const sources = Array.isArray(metadata?.sources) ? metadata.sources : []
  return sources.map((source) => {
    if (typeof source === 'string') return normalizeLocator(source)
    return normalizeLocator(source?.slug) || normalizeLocator(source?.url ?? source?.source_url)
  }).filter(Boolean)
}

function matches(locators, expected) {
  const target = normalizeLocator(expected)
  return locators.some((locator) => locator === target || locator.endsWith(target) || locator.includes(target))
}

function answerMentions(output, expected) {
  const answer = String(output ?? '').toLowerCase().replace(/[-_/]+/g, ' ').replace(/\s+/g, ' ')
  const target = normalizeLocator(expected)
  const slugTail = target.split('/').pop() ?? target
  const semanticTail = slugTail.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/[-_]+/g, ' ')
  return semanticTail.length > 0 && answer.includes(semanticTail)
}

function component(pass, reason, metric) {
  return { pass, score: pass ? 1 : 0, reason, metric }
}

export default function retrievalContract(output, context = {}) {
  const config = context.config ?? {}
  const metadata = context.metadata ?? context.providerResponse?.metadata ?? {}
  const locators = sourceLocators(metadata)
  const identities = sourceIdentities(metadata)
  const requiredSources = Array.isArray(config.requiredSources) ? config.requiredSources : []
  const forbiddenSources = Array.isArray(config.forbiddenSources) ? config.forbiddenSources : []
  const missing = requiredSources.filter((expected) => !matches(locators, expected))
  const forbidden = forbiddenSources.filter((expected) => matches(locators, expected) || answerMentions(output, expected))
  const uniqueSources = new Set(identities)
  const minUniqueSources = Number(config.minUniqueSources ?? 0)
  const maxLatencyMs = Number(config.maxLatencyMs ?? Number.POSITIVE_INFINITY)
  const latencyMs = Number(metadata.latencyMs ?? Number.POSITIVE_INFINITY)
  const requireUncached = config.requireUncached !== false
  const components = [
    component(String(output ?? '').trim().length > 0, 'Answer must not be empty', 'answer_non_empty'),
    component(!metadata.error, metadata.error ? `Provider error: ${String(metadata.error)}` : 'No provider error', 'provider_error'),
    component(missing.length === 0, missing.length ? `Missing required sources: ${missing.join(', ')}` : 'All required sources found', 'required_sources'),
    component(forbidden.length === 0, forbidden.length ? `Forbidden sources found: ${forbidden.join(', ')}` : 'No forbidden sources found', 'forbidden_sources'),
    component(identities.length === uniqueSources.size, `Sources: ${identities.length}; unique: ${uniqueSources.size}`, 'unique_sources'),
    component(uniqueSources.size >= minUniqueSources, `Unique sources: ${uniqueSources.size}; required: ${minUniqueSources}`, 'minimum_sources'),
    component(latencyMs <= maxLatencyMs, `Latency: ${latencyMs}ms; maximum: ${maxLatencyMs}ms`, 'latency'),
    component(!requireUncached || metadata.cached !== true, metadata.cached ? 'Semantic-cache response cannot prove retrieval' : 'Response was not served from semantic cache', 'uncached_retrieval'),
  ]
  const passed = components.every((item) => item.pass)
  return {
    pass: passed,
    score: components.reduce((sum, item) => sum + item.score, 0) / components.length,
    reason: passed ? 'Retrieval contract passed' : components.filter((item) => !item.pass).map((item) => item.reason).join('; '),
    componentResults: components,
  }
}

export { answerMentions, normalizeLocator, sourceIdentities, sourceLocators }
