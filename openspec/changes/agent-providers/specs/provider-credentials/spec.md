## ADDED Requirements

### Requirement: Encrypted credential storage on kernel agent-storage

All provider credentials SHALL be persisted via the kernel `agent-storage` capability under the dedicated namespace `provider-credentials/`. Credential values MUST be encrypted at rest using the kernel-provided envelope encryption; raw secrets SHALL NEVER be written to logs, events, or telemetry. The credential record schema SHALL include `{ id, providerId, category, type, scope, expiresAt?, createdAt, lastUsedAt? }` plus the encrypted `secret` blob.

#### Scenario: Stored secret is encrypted at rest

- **WHEN** a caller invokes `credentials.store({ providerId: 'openai', type: 'api_key', secret: 'sk-...' })`
- **THEN** the underlying `agent-storage` row SHALL contain a ciphertext blob, not the literal `sk-...`, and a subsequent raw storage read by an unprivileged caller SHALL NOT be able to recover the plaintext

#### Scenario: Secret never appears in logs or events

- **WHEN** any credential lifecycle operation runs (store / retrieve / refresh / revoke)
- **THEN** no `agent_events`, `agent_tool_calls`, or stdout log line SHALL contain the plaintext `secret` value

### Requirement: Supported credential types

The credential store SHALL accept exactly three `type` values: `api_key`, `oauth`, and `service_account`. For `oauth`, the encrypted payload MUST include both `accessToken` and `refreshToken`, plus the `tokenUrl` and `clientId` needed for refresh. For `service_account`, the payload MUST include the full key file JSON. Unknown `type` values SHALL be rejected with `CredentialTypeUnsupported`.

#### Scenario: OAuth credential stores both tokens

- **WHEN** `credentials.store({ providerId: 'notion', type: 'oauth', secret: { accessToken: 'a', refreshToken: 'r', tokenUrl: 'https://...', clientId: 'c' } })` is called
- **THEN** the stored payload SHALL contain `accessToken`, `refreshToken`, `tokenUrl`, and `clientId` and a refresh flow SHALL be able to use them without further lookup

#### Scenario: Unknown type rejected

- **WHEN** a caller passes `type: 'jwt'`
- **THEN** `credentials.store` SHALL throw `CredentialTypeUnsupported` and SHALL NOT write any row

### Requirement: Per-credential scope and expiry

Every credential record SHALL declare `scope: { providers: string[] }` listing which `providerId` values it MAY back. A retrieval call requesting a credential for a `providerId` not in its `scope.providers` SHALL be denied with `CredentialScopeMismatch`. Records MAY also declare `expiresAt: Date`; retrievals after `expiresAt` SHALL be denied with `CredentialExpired` regardless of any other check.

#### Scenario: Scope mismatch denied

- **WHEN** a credential stored with `scope.providers = ['tavily']` is retrieved via `credentials.retrieve({ providerId: 'exa', ... })`
- **THEN** the call SHALL throw `CredentialScopeMismatch` and SHALL NOT return the secret

#### Scenario: Expiry blocks retrieval

- **WHEN** a credential with `expiresAt = 2026-01-01` is retrieved at any time after that timestamp
- **THEN** the call SHALL throw `CredentialExpired` and the credential SHALL be flagged for revocation

### Requirement: Integration with kernel agent-access grants

The credential layer SHALL refuse to return any secret unless the calling agent's `agent-access` grant list includes the requested `providerId`. The grant check MUST occur before any decryption, so an agent without the grant never causes the kernel to materialize plaintext. Bypassing this check (e.g. via direct storage read) SHALL constitute a security violation and SHALL be prevented by the storage namespace ACL.

#### Scenario: Agent with grant retrieves credential

- **WHEN** an agent whose grants include `providers: ['openai']` calls `credentials.retrieve({ providerId: 'openai' })` via the router
- **THEN** the call SHALL succeed and SHALL return a single-use plaintext handle scoped to the current syscall

#### Scenario: Agent without grant denied

- **WHEN** an agent whose grants do not include `openai` triggers a syscall that would require the openai credential
- **THEN** the kernel SHALL throw `AgentAccessDenied` with `reason='provider_credential_not_granted'` and SHALL NOT decrypt the credential

### Requirement: OAuth token refresh

For `oauth` credentials, the credential layer SHALL refresh the `accessToken` automatically (a) silently when `expiresAt` is within a configurable safety window (default 60 seconds) before a retrieval, and (b) on demand when a provider call returns HTTP 401. The refresh SHALL exchange the stored `refreshToken` at `tokenUrl` and SHALL write the new tokens back through the same encrypted path. Concurrent refresh requests for the same credential SHALL be deduplicated so that only one token exchange is in flight at a time.

#### Scenario: Silent refresh inside safety window

- **WHEN** a retrieval for an OAuth credential occurs and `expiresAt` is 30 seconds away (within the 60s window)
- **THEN** the layer SHALL perform a refresh exchange before returning, SHALL persist the new tokens, and SHALL return the new `accessToken`

#### Scenario: On-demand refresh after 401

- **WHEN** a provider call using a fresh-looking OAuth token returns HTTP 401 once
- **THEN** the router SHALL trigger a refresh, retry the call exactly once with the new token, and SHALL NOT loop on repeated 401s

### Requirement: Audit log on every credential read

Every successful credential retrieval SHALL append one row to the `agent_events` stream with `kind='credential_read'` and `payload_json={ credentialId, providerId, agentId, runId, syscall, atMs }`. The `secret` value MUST NOT appear in the payload. Failed retrievals SHALL append `kind='credential_denied'` with `payload_json` including a `reason` field (e.g. `'expired'`, `'scope_mismatch'`, `'access_denied'`).

#### Scenario: Successful read produces audit row

- **WHEN** an agent successfully retrieves the `openai` API key during a run
- **THEN** exactly one `agent_events` row SHALL be written with `kind='credential_read'` and the `payload_json` SHALL contain `credentialId`, `providerId='openai'`, the agent id, the run id, and the originating syscall name — and SHALL NOT contain the secret

#### Scenario: Denied read also audited

- **WHEN** an agent without the `notion` grant triggers a syscall that requires the notion credential
- **THEN** exactly one `agent_events` row SHALL be written with `kind='credential_denied'` and `payload_json.reason='access_denied'`
