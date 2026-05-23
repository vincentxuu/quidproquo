import { register } from '../../registry'
import type { ProviderDefinition } from '../../types'

const SEARCH_PROVIDERS: ProviderDefinition[] = [
  {
    providerId: 'search.tavily',
    category: 'search',
    displayName: 'Tavily',
    capabilityJson: {
      maxResultsPerQuery: 20,
      supportsImages: false,
      supportsRawContent: true,
      supportsNewsSources: true,
    },
    costModelJson: { kind: 'request', perCallUsd: 0.001 },
    outboundDomains: ['api.tavily.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'search.exa',
    category: 'search',
    displayName: 'Exa',
    capabilityJson: {
      maxResultsPerQuery: 25,
      supportsImages: false,
      supportsRawContent: true,
      supportsNewsSources: false,
      supportsNeuralSearch: true,
    },
    costModelJson: { kind: 'request', perCallUsd: 0.001 },
    outboundDomains: ['api.exa.ai'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'search.jina',
    category: 'search',
    displayName: 'Jina Search',
    capabilityJson: {
      maxResultsPerQuery: 10,
      supportsImages: false,
      supportsRawContent: false,
      supportsNeuralSearch: true,
    },
    costModelJson: { kind: 'request', perCallUsd: 0.0002 },
    outboundDomains: ['s.jina.ai'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
]

export function registerDefaultSearchProviders(): void {
  for (const provider of SEARCH_PROVIDERS) {
    register(provider)
  }
}
