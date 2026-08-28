import type { CredentialResolution } from './types'
import type { ProviderBackends } from './storage/types'
import { CredentialNotFound, CredentialExpired } from './errors'

export async function resolveCredential(opts: {
  providerId: string
  agentId?: string
  backends: ProviderBackends
}): Promise<CredentialResolution> {
  const { providerId, agentId, backends } = opts

  const cred = await backends.credentials.getForProvider(providerId, agentId)

  if (!cred) {
    throw new CredentialNotFound(providerId)
  }

  if (cred.expiresAt !== null && cred.expiresAt < Date.now()) {
    throw new CredentialExpired(providerId)
  }

  const source = cred.agentId !== null ? 'agent_scoped' : 'org_wide'

  return {
    value: cred.valueEncrypted,
    source,
    expiresAt: cred.expiresAt,
  }
}
