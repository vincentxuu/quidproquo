import type { PolicyDefinitionRegistry } from '../definition'
import { RESEARCH_QUICK } from './research-quick'
import { RESEARCH_STANDARD } from './research-standard'
import { RESEARCH_ENTERPRISE } from './research-enterprise'

const seeds = [
  { key: 'research-quick', label: 'Research Quick', body: RESEARCH_QUICK },
  { key: 'research-standard', label: 'Research Standard', body: RESEARCH_STANDARD },
  { key: 'research-enterprise', label: 'Research Enterprise', body: RESEARCH_ENTERPRISE },
]

export async function seedReferencePolicies(registry: PolicyDefinitionRegistry): Promise<void> {
  for (const { key, label, body } of seeds) {
    const existing = await registry.getByKey(key).catch(() => null)
    if (!existing) {
      await registry.register({ policyKey: key, label, body, createdBy: 'seed' })
    }
  }
}
