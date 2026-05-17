## ADDED Requirements

### Requirement: Four memory types

The memory layer SHALL support exactly four memory types per the AIOS model: `working` (per-run, in-Worker), `episodic` (persistent run history with TTL), `semantic` (distilled long-term knowledge), `procedural` (tool-use habits and standard procedures). Each type has distinct lifetime, backing, and retrieval semantics.

#### Scenario: Working memory ends with the run

- **WHEN** a run completes (any terminal status)
- **THEN** all `working` memory entries SHALL be discarded; subsequent runs SHALL NOT be able to read them

#### Scenario: Episodic memory persists with TTL

- **WHEN** an agent writes an episodic entry with `ttlSeconds=2592000` (30 days)
- **THEN** the entry SHALL be readable from any run within 30 days and SHALL be deleted by the daily expiry sweep after that

#### Scenario: Type confusion rejected

- **WHEN** an agent attempts `memory.recall({ type: 'temporary' })`
- **THEN** the kernel SHALL throw `InvalidMemoryType` listing the four valid types

### Requirement: Four-dimensional scope

Memory entries SHALL be addressed by a composite scope key formed from `org_id` / `user_id` / `agent_id` / `session_id`. The scope key string format SHALL be `org:{org}|user:{user}|agent:{agent}|session:{session}`. Agents SHALL only be able to read or write within scopes their `permissions.memoryScopes` declaration grants.

#### Scenario: Agent reads its own agent-scope memory

- **WHEN** an agent with `memoryScopes: ['agent']` calls `memory.recall({ scope: { agentId: 'research' } })`
- **THEN** the kernel SHALL return entries with `scope_key` matching `org:{org}|user:*|agent:research|session:*` for the current org

#### Scenario: Cross-agent scope denied

- **WHEN** an agent with `memoryScopes: ['agent']` calls `memory.recall({ scope: { agentId: 'writer' } })` from inside `research`
- **THEN** the kernel SHALL throw `AgentAccessDenied` and SHALL emit an event with `kind='denied'` and `payload_json.reason='cross_agent_memory_scope'`

#### Scenario: Cron-triggered scope uses system user

- **WHEN** a cron-triggered run writes memory without specifying a user_id
- **THEN** the kernel SHALL substitute `user_id='system'` in the composite scope key

### Requirement: Multi-signal retrieval

`memory.recall()` SHALL combine three retrieval signals — semantic similarity (via Vectorize), BM25 keyword (via D1 FTS5), and entity match (via D1 LIKE on `entities_json`) — and fuse the three ranked lists using Reciprocal Rank Fusion (RRF, k=60). Ties SHALL be broken by `importance` descending then `written_at` descending.

#### Scenario: Fusion returns top-k

- **WHEN** an agent calls `memory.recall({ type: 'episodic', query: 'rag tuning', entities: ['Vectorize'], k: 5 })`
- **THEN** the kernel SHALL issue all three retrieval queries in parallel (each topK=20), fuse via RRF k=60, and return at most 5 items

#### Scenario: Single-signal fallback when one backend errors

- **WHEN** the Vectorize call errors but FTS5 and entity match succeed
- **THEN** the kernel SHALL fuse only the two successful signals, return the fused list, and emit an event with `kind='memory_partial'` recording the failed backend

### Requirement: Read updates last_read_at

The kernel SHALL update `last_read_at` for every memory item returned by `memory.recall()`. The update SHALL be issued asynchronously and SHALL NOT block the recall return value.

#### Scenario: Recall touches accessed rows

- **WHEN** `memory.recall()` returns 5 items
- **THEN** the kernel SHALL fire-and-forget a D1 batch updating `last_read_at = now()` for those 5 `item_id`s

### Requirement: Async writes

`memory.write()` SHALL return as soon as the entry is durably accepted by the kernel (queued for D1 + Vectorize). The kernel SHALL NOT block the calling agent on Vectorize indexing latency.

#### Scenario: Write returns before vector indexed

- **WHEN** an agent calls `await memory.write({ type: 'episodic', body: '...' })`
- **THEN** the promise SHALL resolve once the D1 row is inserted; the corresponding Vectorize insert MAY still be in flight at that moment

### Requirement: Episodic-to-semantic distillation

The kernel SHALL provide a `memory.distill({ scope })` operation that summarizes episodic entries within the scope into a smaller set of semantic entries and increments their `importance`. Distillation SHALL be invocable manually and SHALL run on a cron schedule (`0 4 * * SUN` weekly).

#### Scenario: Weekly distillation reduces episodic count

- **WHEN** the weekly distillation cron fires for scope `org:1|user:xiaoxu|agent:research|session:*`
- **THEN** the kernel SHALL group episodic entries by week and topic, write semantic entries summarizing each group, and SHALL NOT delete the source episodic entries (they age out via TTL)

### Requirement: R2 blob storage behind flag

When a memory write exceeds the configurable `inline_max_bytes` (default 256KB), the kernel SHALL offload the body to R2 (`R2_AGENT_MEMORY` bucket) and store the R2 key in `agent_memory_items.body_json.r2Key`. This behavior SHALL be gated by `AGENT_OS_MEMORY_R2`.

#### Scenario: Large write with R2 enabled

- **WHEN** `AGENT_OS_MEMORY_R2=true` and an agent writes a body >256KB
- **THEN** the kernel SHALL upload to R2 with key `memory/{scope_key}/{item_id}` and store only the key in D1

#### Scenario: Large write with R2 disabled

- **WHEN** `AGENT_OS_MEMORY_R2=false` and an agent writes a body >256KB
- **THEN** the kernel SHALL throw `MemoryBodyTooLarge` with the configured limit in the message
