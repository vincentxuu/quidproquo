import { register } from '../../registry'
import type { ProviderDefinition } from '../../types'

const READER_PROVIDERS: ProviderDefinition[] = [
  {
    providerId: 'reader.jina',
    category: 'reader',
    displayName: 'Jina Reader',
    capabilityJson: {
      supportsMarkdown: true,
      supportsScreenshot: false,
      maxBytes: 500000,
      timeoutMs: 30000,
    },
    costModelJson: { kind: 'request', perCallUsd: 0.0001 },
    outboundDomains: ['r.jina.ai'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'reader.firecrawl',
    category: 'reader',
    displayName: 'Firecrawl',
    capabilityJson: {
      supportsMarkdown: true,
      supportsScreenshot: true,
      maxBytes: 1000000,
      timeoutMs: 60000,
    },
    costModelJson: { kind: 'request', perCallUsd: 0.002 },
    outboundDomains: ['api.firecrawl.dev'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'reader.browser',
    category: 'reader',
    displayName: 'Cloudflare Browser',
    capabilityJson: {
      supportsMarkdown: false,
      supportsScreenshot: true,
      maxBytes: 5000000,
      timeoutMs: 60000,
      requiresBinding: true,
    },
    costModelJson: { kind: 'request', perCallUsd: 0.0005 },
    outboundDomains: [],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'reader.directFetch',
    category: 'reader',
    displayName: 'Direct Fetch',
    capabilityJson: {
      supportsMarkdown: false,
      supportsScreenshot: false,
      maxBytes: 256000,
      timeoutMs: 15000,
      noCredentials: true,
    },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: [],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
]

export function registerDefaultReaderProviders(): void {
  for (const provider of READER_PROVIDERS) {
    register(provider)
  }
}
