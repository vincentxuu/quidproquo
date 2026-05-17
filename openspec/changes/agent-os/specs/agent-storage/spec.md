## ADDED Requirements

### Requirement: D1 schema migration

The change SHALL ship a single D1 migration file `migrations/0011_agent_os.sql` that creates exactly seven tables — `agent_processes`, `agent_runs`, `agent_run_events`, `agent_tool_calls`, `agent_permissions`, `agent_approval_requests`, `agent_memory_items` — plus the FTS5 virtual table `agent_memory_fts` and the indexes documented in the design.

#### Scenario: Migration applied

- **WHEN** `pnpm sync` (or production equivalent) runs migration `0011_agent_os.sql` against a database that has only migrations `0001`–`0010`
- **THEN** all seven tables and `agent_memory_fts` SHALL exist after the migration completes and the migration SHALL be idempotent (re-running it MUST be a no-op)

#### Scenario: Schema introspection matches design

- **WHEN** a test queries `sqlite_master` for the seven table names
- **THEN** each table SHALL exist with the columns and constraints listed in design.md D3

### Requirement: Storage backend interface

Every kernel module that reads or writes D1, KV, R2, Vectorize, or Workers AI embeddings SHALL depend on a backend interface defined in `src/lib/agent-os/storage/types.ts`. Production code uses bindings; test code uses in-memory implementations.

#### Scenario: Memory backend abstraction

- **WHEN** the memory module is instantiated in production
- **THEN** it SHALL receive a `D1MemoryBackend` constructed from the `DB` binding; in test it SHALL receive an `InMemoryMemoryBackend`

#### Scenario: Cancel signal backend abstraction

- **WHEN** the scheduler writes a cancel signal in production
- **THEN** it SHALL use `KvCancelBackend` writing to the KV namespace; in test it SHALL use `InMemoryCancelBackend`

#### Scenario: Embedding backend abstraction

- **WHEN** the memory module needs a semantic vector for recall or write indexing
- **THEN** it SHALL call `EmbeddingBackend.embed()`; in production this backend SHALL wrap Workers AI, and in test it SHALL use a deterministic in-memory implementation

### Requirement: KV namespace usage

The kernel SHALL use KV only for hot ephemeral data — cancellation signals (`agent:cancel:{runId}`, TTL 600s) and hot per-agent procedural memory cache (`agent:proc:{scope_key}`, TTL 3600s). KV SHALL NOT be used as the source of truth for any persistent state; D1 is authoritative.

#### Scenario: Cancel signal in KV expires

- **WHEN** a cancel signal is written for a run that completes before reading it
- **THEN** the KV key SHALL expire within 10 minutes regardless of the run's final state

### Requirement: R2 bucket binding

The change SHALL add an R2 binding `R2_AGENT_MEMORY` to `wrangler.jsonc` for large memory blobs. The bucket SHALL be unused until `AGENT_OS_MEMORY_R2=true`; the binding declaration alone SHALL NOT incur object writes.

#### Scenario: Binding present, flag off

- **WHEN** the Worker is deployed with the new binding and `AGENT_OS_MEMORY_R2=false`
- **THEN** no R2 reads or writes SHALL occur from any kernel module

### Requirement: D1 write batching

When the kernel records a syscall, it SHALL combine the `agent_tool_calls` insert and the `agent_runs` counter update (`total_tokens`, `total_cost_usd`, `total_tool_calls`) into a single D1 batch to stay within the per-second write rate limit.

#### Scenario: Single batch per syscall

- **WHEN** any syscall completes
- **THEN** the kernel SHALL issue exactly one `DB.batch([...])` call covering both the insert and the counter update; SHALL NOT issue them as two separate statements
