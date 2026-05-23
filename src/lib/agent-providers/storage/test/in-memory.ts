import type { ProviderDefinition, ProviderCredential, HealthSnapshot, ProviderCategory } from '../../types'
import type {
  ProviderDefinitionStoreBackend,
  ProviderCredentialStoreBackend,
  ProviderHealthStoreBackend,
  ProviderBackends,
} from '../types'

class InMemoryProviderDefinitionStore implements ProviderDefinitionStoreBackend {
  private readonly store = new Map<string, ProviderDefinition>()

  async upsert(def: ProviderDefinition): Promise<void> {
    this.store.set(def.providerId, def)
  }

  async getById(id: string): Promise<ProviderDefinition | null> {
    return this.store.get(id) ?? null
  }

  async listByCategory(category: ProviderCategory): Promise<ProviderDefinition[]> {
    return Array.from(this.store.values()).filter((d) => d.category === category)
  }

  async setEnabled(id: string, enabled: boolean): Promise<void> {
    const def = this.store.get(id)
    if (def) {
      this.store.set(id, { ...def, isEnabled: enabled })
    }
  }
}

class InMemoryProviderCredentialStore implements ProviderCredentialStoreBackend {
  private readonly store = new Map<string, ProviderCredential>()

  async insert(opts: {
    credentialId: string
    providerId: string
    agentId: string | null
    credentialType: string
    valueEncrypted: string
    scopeJson: string[]
    expiresAt: number | null
    createdAt: number
    updatedAt: number
  }): Promise<string> {
    const credential: ProviderCredential = {
      credentialId: opts.credentialId,
      providerId: opts.providerId,
      agentId: opts.agentId,
      credentialType: opts.credentialType,
      valueEncrypted: opts.valueEncrypted,
      scopeJson: opts.scopeJson,
      expiresAt: opts.expiresAt,
      createdAt: opts.createdAt,
      updatedAt: opts.updatedAt,
    }
    this.store.set(opts.credentialId, credential)
    return opts.credentialId
  }

  async getForProvider(providerId: string, agentId?: string): Promise<ProviderCredential | null> {
    // Check agent-scoped first
    if (agentId) {
      for (const cred of this.store.values()) {
        if (cred.providerId === providerId && cred.agentId === agentId) {
          return cred
        }
      }
    }

    // Fall back to org-wide
    for (const cred of this.store.values()) {
      if (cred.providerId === providerId && cred.agentId === null) {
        return cred
      }
    }

    return null
  }

  async delete(credentialId: string): Promise<void> {
    this.store.delete(credentialId)
  }
}

class InMemoryProviderHealthStore implements ProviderHealthStoreBackend {
  private readonly snapshots: HealthSnapshot[] = []

  async append(snapshot: HealthSnapshot): Promise<void> {
    this.snapshots.push(snapshot)
  }

  async queryRecent(opts: { providerId: string; windowMs: number }): Promise<HealthSnapshot[]> {
    const cutoff = Date.now() - opts.windowMs
    return this.snapshots
      .filter((s) => s.providerId === opts.providerId && s.observedAt > cutoff)
      .sort((a, b) => b.observedAt - a.observedAt)
  }
}

export function createInMemoryProviderBackends(): ProviderBackends {
  return {
    definitions: new InMemoryProviderDefinitionStore(),
    credentials: new InMemoryProviderCredentialStore(),
    health: new InMemoryProviderHealthStore(),
  }
}
