import { register } from '../../registry'
import type { ProviderDefinition } from '../../types'

const KNOWLEDGE_PROVIDERS: ProviderDefinition[] = [
  {
    providerId: 'knowledge.notion',
    category: 'knowledge',
    displayName: 'Notion',
    capabilityJson: { supportsRead: true, supportsWrite: true },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: ['api.notion.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'knowledge.github',
    category: 'knowledge',
    displayName: 'GitHub',
    capabilityJson: { supportsRead: true, supportsWrite: true },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: ['api.github.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'knowledge.drive',
    category: 'knowledge',
    displayName: 'Google Drive',
    capabilityJson: { supportsRead: true, supportsWrite: true },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: ['www.googleapis.com', 'drive.googleapis.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'knowledge.sql',
    category: 'knowledge',
    displayName: 'SQL',
    capabilityJson: { supportsRead: true, supportsWrite: true, supportsD1: true },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: [],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
]

export function registerDefaultKnowledgeProviders(): void {
  for (const provider of KNOWLEDGE_PROVIDERS) {
    register(provider)
  }
}
