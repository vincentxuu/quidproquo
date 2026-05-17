## ADDED Requirements

### Requirement: Typed registry per provider category

The provider registry SHALL maintain five typed sub-registries keyed by category: `llm`, `search`, `reader`, `knowledge`, `action`. Each sub-registry SHALL enforce a category-specific `ProviderDefinition<TCategory>` contract so that registering a provider into the wrong category is a compile-time error. Categories MUST be declared as a `const` union and exported from `src/lib/agent-providers/types.ts`.

#### Scenario: Register an LLM provider

- **WHEN** a caller invokes `registry.register('llm', { id: 'openai', models: [...], invoke: fn, ...})`
- **THEN** the provider SHALL be stored under the `llm` sub-registry and subsequent `registry.get('llm', 'openai')` SHALL return the same definition reference

#### Scenario: Mismatched category rejected at compile time

- **WHEN** a caller attempts `registry.register('search', { id: 'openai', models: [...], invoke: fn })` where the object satisfies `LLMProvider` not `SearchProvider`
- **THEN** the TypeScript compiler SHALL emit a type error at the call site and the call SHALL NOT compile

### Requirement: Provider exposure via MCP-compatible syscalls

Every registered provider SHALL be projected into the kernel `agent-tools` registry as one or more MCP-compatible syscalls. Syscall names MUST follow the pattern `<category>.<verb>` (e.g. `llm.complete`, `search.query`, `reader.fetch`, `knowledge.read`, `action.invoke`) and SHALL share a single `inputSchema` per category so that providers are interchangeable from the agent's perspective. The registry MUST call `defineSyscall(...)` from `agent-tools` exactly once per category-verb pair, with the handler dispatching to the routed provider.

#### Scenario: LLM provider exposed as syscall

- **WHEN** `openai`, `anthropic`, and `gemini` are registered under `llm`
- **THEN** the kernel SHALL expose a single `llm.complete` syscall whose handler routes to one of the three based on routing rules, and the syscall's `inputSchema` SHALL be the same regardless of which provider is selected

#### Scenario: Agent uses category-level syscall not provider-level

- **WHEN** an agent issues `syscall('search.query', { q: 'rag' })`
- **THEN** the kernel SHALL NOT require the agent to name a provider (e.g. `tavily.query`) and SHALL delegate provider selection to the routing layer

### Requirement: Provider capability declaration

Every `ProviderDefinition` SHALL include a `capabilities` field whose shape is fixed per category: `LLMProvider.capabilities` MUST list `{ models: ModelDescriptor[], maxContextTokens, supportsTools, supportsVision, supportsJsonMode }`; `SearchProvider.capabilities` MUST list `{ supportedQueryKinds: ('web'|'news'|'academic')[], maxResults, supportsDateFilter }`; `ReaderProvider.capabilities` MUST list `{ supportedSchemes: ('http'|'https'|'pdf'|'youtube')[], rendersJavaScript }`; `KnowledgeProvider.capabilities` MUST list `{ scopes: ('read'|'write')[], surfaces: string[] }`; `ActionProvider.capabilities` MUST list `{ effects: string[], requiresApproval: boolean }`. Consumers SHALL rely on these fields for discovery and SHALL NOT introspect the handler.

#### Scenario: LLM provider declares models

- **WHEN** `openai` is registered with `capabilities.models = [{ id: 'gpt-5', contextTokens: 200000 }, { id: 'gpt-5-mini', contextTokens: 128000 }]`
- **THEN** `registry.get('llm', 'openai').capabilities.models` SHALL return both descriptors and `registry.discoverByCapability({ category: 'llm', model: 'gpt-5' })` SHALL include `openai`

#### Scenario: Action provider declares effects

- **WHEN** a `slack.message` action provider is registered with `capabilities.effects = ['send_message']` and `capabilities.requiresApproval = true`
- **THEN** the kernel SHALL refuse to dispatch the syscall unless the agent's `agent-access` grant includes both the provider id and the listed effect

### Requirement: Registry surface API

`src/lib/agent-providers/registry.ts` SHALL export exactly four functions: `register<C extends Category>(category: C, provider: ProviderDefinition<C>): void`, `get<C extends Category>(category: C, id: string): ProviderDefinition<C> | undefined`, `list<C extends Category>(category: C): ProviderDefinition<C>[]`, and `discoverByCapability(criteria: DiscoveryCriteria): ProviderDefinition<Category>[]`. Registration MUST be idempotent per `(category, id, version)` triple; a duplicate registration with the same triple SHALL throw `ProviderRegistrationError`.

#### Scenario: list returns only providers in the requested category

- **WHEN** `openai` is registered under `llm` and `tavily` is registered under `search`
- **THEN** `registry.list('llm')` SHALL return an array containing `openai` and SHALL NOT contain `tavily`

#### Scenario: discoverByCapability matches across providers

- **WHEN** `registry.discoverByCapability({ category: 'search', supportsDateFilter: true })` is called and only `exa` declares `supportsDateFilter: true`
- **THEN** the result SHALL be `[exa]`

### Requirement: Provider versioning and deprecation

Every `ProviderDefinition` SHALL include `version: string` (semver) and an optional `deprecatedAt?: Date` with optional `replacedBy?: { id: string; version: string }`. The registry MUST allow multiple versions of the same provider id to coexist; `registry.get(category, id)` without an explicit version SHALL return the highest non-deprecated version. Deprecated providers SHALL still be invokable but SHALL emit a `provider_deprecated_used` event on every syscall.

#### Scenario: Highest non-deprecated version wins

- **WHEN** `openai@1.0.0` is registered and later `openai@2.0.0` is registered, with neither deprecated
- **THEN** `registry.get('llm', 'openai')` SHALL return the `2.0.0` definition

#### Scenario: Deprecated version emits event when used

- **WHEN** `openai@1.0.0` is marked `deprecatedAt: <date>` and an agent's pinned config still routes to it
- **THEN** the syscall SHALL succeed and the kernel SHALL emit one `provider_deprecated_used` event per call with `payload_json={category:'llm', id:'openai', version:'1.0.0', replacedBy:{...}}`

### Requirement: Version conflict on duplicate registration

When two `register` calls occur with the same `(category, id, version)` triple, the second call SHALL throw `ProviderRegistrationError` with `code='duplicate_version'`. Registry state SHALL be unchanged by the failed call.

#### Scenario: Duplicate triple rejected

- **WHEN** `register('llm', { id: 'openai', version: '1.0.0', ... })` is called twice
- **THEN** the second call SHALL throw `ProviderRegistrationError` with `code='duplicate_version'` and `registry.get('llm', 'openai')` SHALL still return the first definition

#### Scenario: Same id, different version, both retained

- **WHEN** `register('llm', { id: 'openai', version: '1.0.0', ... })` and `register('llm', { id: 'openai', version: '2.0.0', ... })` are called in order
- **THEN** both calls SHALL succeed and `registry.list('llm').filter(p => p.id === 'openai').map(p => p.version)` SHALL equal `['1.0.0', '2.0.0']` in some order
