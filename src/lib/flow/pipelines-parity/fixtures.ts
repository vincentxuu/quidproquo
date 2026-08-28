export interface ParityFixture {
  input: Record<string, unknown>
  stubs: Record<string, unknown>
}

export function loadParityFixture(pipelineId: string): ParityFixture {
  // Phase 1: return minimal fixture per pipeline
  const defaults: Record<string, ParityFixture> = {
    'content-ops': { input: {}, stubs: {} },
    'post-quality': { input: { slug: '' }, stubs: {} },
    'embed-sync': { input: { sources: ['posts'], offset: 0, limit: 10 }, stubs: {} },
    'crawl-sync': { input: { full: false, modifiedSince: 0 }, stubs: {} },
    'translation': { input: { slug: 'ai/example' }, stubs: {} },
    'research-brief': { input: { topic: 'test', language: 'zh-TW', researchDepth: 'quick', includeExternalSources: false }, stubs: {} },
    'youtube-brief': { input: { videoUrl: 'https://www.youtube.com/watch?v=test', language: 'zh-TW', includeTranscript: false }, stubs: {} },
    'glossary-gap': { input: { days: 14, minLookupCount: 3, topTerms: 20, topPostsPerTerm: 5 }, stubs: {} },
    'freshness-review': { input: { maxAgeDays: 365, riskThreshold: 40, categoryFilter: '', languageFilter: '' }, stubs: {} },
    'series-suggestions': { input: { topSeriesCount: 12, minPostsPerSeries: 2, maxPostsPerSeries: 8, minSignalLength: 2 }, stubs: {} },
    'knowledge-graph-prototype': { input: { minEntityFrequency: 2, topNodes: 80, minCoOccurrence: 2, topEdges: 180 }, stubs: {} },
    'metadata-suggestions': { input: { slug: 'ai/example' }, stubs: {} },
    'internal-links': { input: { slug: 'ai/example' }, stubs: {} },
  }
  return defaults[pipelineId] ?? { input: {}, stubs: {} }
}
