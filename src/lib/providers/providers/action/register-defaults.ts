import { register } from '../../registry'
import type { ProviderDefinition } from '../../types'

const ACTION_PROVIDERS: ProviderDefinition[] = [
  {
    providerId: 'action.github',
    category: 'action',
    displayName: 'GitHub Actions',
    capabilityJson: { syscalls: ['action.github.create-issue', 'action.github.create-comment'] },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: ['api.github.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'action.slack',
    category: 'action',
    displayName: 'Slack',
    capabilityJson: { syscalls: ['action.slack.send-message'] },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: ['slack.com', 'hooks.slack.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'action.notion',
    category: 'action',
    displayName: 'Notion Actions',
    capabilityJson: { syscalls: ['action.notion.create-page'] },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: ['api.notion.com'],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
  {
    providerId: 'action.email',
    category: 'action',
    displayName: 'Email',
    capabilityJson: { syscalls: ['action.email.send'] },
    costModelJson: { kind: 'request', perCallUsd: 0 },
    outboundDomains: [],
    isEnabled: false,
    createdAt: 0,
    updatedAt: 0,
  },
]

export function registerDefaultActionProviders(): void {
  for (const provider of ACTION_PROVIDERS) {
    register(provider)
  }
}
