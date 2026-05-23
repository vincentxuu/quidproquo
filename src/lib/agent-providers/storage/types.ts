import type { ProviderDefinition, ProviderCredential, HealthSnapshot, ProviderCategory } from '../types'

export interface ProviderDefinitionStoreBackend {
  upsert(def: ProviderDefinition): Promise<void>
  getById(id: string): Promise<ProviderDefinition | null>
  listByCategory(category: ProviderCategory): Promise<ProviderDefinition[]>
  setEnabled(id: string, enabled: boolean): Promise<void>
}

export interface ProviderCredentialStoreBackend {
  insert(opts: {
    credentialId: string
    providerId: string
    agentId: string | null
    credentialType: string
    valueEncrypted: string
    scopeJson: string[]
    expiresAt: number | null
    createdAt: number
    updatedAt: number
  }): Promise<string>
  getForProvider(providerId: string, agentId?: string): Promise<ProviderCredential | null>
  delete(credentialId: string): Promise<void>
}

export interface ProviderHealthStoreBackend {
  append(snapshot: HealthSnapshot): Promise<void>
  queryRecent(opts: { providerId: string; windowMs: number }): Promise<HealthSnapshot[]>
}

export interface ProviderBackends {
  definitions: ProviderDefinitionStoreBackend
  credentials: ProviderCredentialStoreBackend
  health: ProviderHealthStoreBackend
}
