## ADDED Requirements

### Requirement: MCP-compatible tool definition

Every tool SHALL be declared via `defineSyscall({ name, description, inputSchema, outputSchema, handler, costModel?, requiresApproval? })` where `inputSchema` and `outputSchema` are JSON Schema 7 documents compatible with the MCP Tool spec. The kernel SHALL validate inputs against `inputSchema` before invoking the handler.

#### Scenario: Input validation passes

- **WHEN** an agent calls `syscall('search.external', { q: 'rag' })` and the registered `inputSchema` requires `q: string`
- **THEN** the handler SHALL be invoked with the validated input

#### Scenario: Input validation fails

- **WHEN** an agent calls `syscall('search.external', { q: 42 })` and `q` is required to be a string
- **THEN** the kernel SHALL throw `SyscallInputInvalid` with the JSON Schema validation error and SHALL NOT invoke the handler

### Requirement: Typed syscall helper

The kernel SHALL expose a generic `syscall<TName>(name, input)` helper whose TypeScript types resolve to the registered tool's input and output types. Calling an unregistered tool name SHALL be a compile-time type error and a runtime `SyscallNotFound` error.

#### Scenario: Registered tool resolves type

- **WHEN** TypeScript compiles `const out = await syscall('search.external', { q: 'x' })`
- **THEN** `out` SHALL be inferred as the `outputSchema`-derived type for `search.external`

#### Scenario: Unregistered tool at runtime

- **WHEN** an agent calls `syscall('nonexistent', {})` (bypassing types)
- **THEN** the kernel SHALL throw `SyscallNotFound` and SHALL emit a `denied` event with `payload_json.reason='unknown_syscall'`

### Requirement: Permission check at syscall boundary

Before invoking a tool handler, the kernel SHALL verify that the calling agent's `permissions.syscalls` array includes the requested tool name. Failed checks SHALL throw `AgentAccessDenied` and SHALL emit a `denied` event.

#### Scenario: Syscall not in grants

- **WHEN** an agent with `syscalls: ['memory.read']` calls `syscall('search.external', ...)`
- **THEN** the kernel SHALL throw `AgentAccessDenied` and SHALL emit an event with `kind='denied'`, `payload_json={reason:'syscall_not_granted', syscall:'search.external'}`

### Requirement: Outbound domain enforcement

When a tool's input includes a URL, the kernel SHALL verify that the URL's host matches one of the agent's `permissions.outboundDomains` globs before invoking the handler.

#### Scenario: URL passes domain check

- **WHEN** an agent with `outboundDomains: ['*.tavily.com']` calls a tool with `url: 'https://api.tavily.com/search'`
- **THEN** the kernel SHALL invoke the handler

#### Scenario: URL fails domain check

- **WHEN** the same agent passes `url: 'https://evil.example.com'`
- **THEN** the kernel SHALL throw `AgentAccessDenied` with `reason='outbound_domain_not_granted'`

### Requirement: Per-run tool-call ceiling

The kernel SHALL increment `agent_runs.total_tool_calls` on each syscall. When the counter would exceed `agent_processes.tool_call_limit`, the kernel SHALL reject the syscall with `SyscallLimitExceeded` and SHALL NOT invoke the handler.

#### Scenario: Limit reached mid-run

- **WHEN** an agent with `tool_call_limit=20` has issued 20 syscalls and attempts a 21st
- **THEN** the 21st call SHALL throw `SyscallLimitExceeded` and the run SHALL continue; the agent decides whether to terminate or recover

### Requirement: Cost telemetry write

After every successful syscall, the kernel SHALL evaluate `definition.costModel` against the input and output, compute `cost_usd`, and write one `agent_tool_calls` row containing `tokens_in`, `tokens_out`, `cost_usd`, `latency_ms`. If `costModel` is absent, `cost_usd` and tokens SHALL be `0`.

#### Scenario: Token cost model

- **WHEN** a tool with `costModel = { kind: 'token', inputPerKToken: 0.001, outputPerKToken: 0.003 }` returns `{tokens_in: 1000, tokens_out: 500}`
- **THEN** the `cost_usd` written SHALL equal `0.001 * 1 + 0.003 * 0.5 = 0.0025`

#### Scenario: Request cost model

- **WHEN** a tool with `costModel = { kind: 'request', perCallUsd: 0.01 }` completes
- **THEN** `cost_usd` SHALL equal `0.01` regardless of input or output

### Requirement: AbortSignal propagation

The kernel SHALL pass the run's `AbortSignal` to every tool handler via `SyscallContext.signal`. Handlers SHALL be expected (but not enforced) to honor it; the kernel SHALL still mark the run `cancelled` even if the handler ignores the signal.

#### Scenario: Handler respects signal

- **WHEN** the cancellation signal fires while a `fetch`-based tool is mid-request and the handler passes `ctx.signal` to `fetch`
- **THEN** the fetch SHALL abort, the handler SHALL throw, and the kernel SHALL transition the run to `cancelled`
