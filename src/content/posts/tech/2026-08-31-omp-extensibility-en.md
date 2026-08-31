---
title: "OMP Internals #10: hooks/skills/MCP/marketplace — The Four Extensibility Surfaces"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, oh-my-pi, hooks, skills, mcp, marketplace, extensibility, agent-architecture]
lang: en
description: "Deep dive into OMP's four extensibility mechanisms: why hooks moved behind the extension runner, how skill frontmatter description drives model triggering, MCP server lifecycle with dynamic tool registration, and marketplace's Claude Code format compatibility."
tldr: "OMP unifies hooks, skills, MCP, and marketplace into a cohesive extensibility layer: hooks merge into extension runner's event bus, skills use description for semantic triggering, MCP adopts a 250ms fast-start gate with deferred fallback, marketplace supports dual scopes with Claude Code catalog compatibility."
series:
  name: "OMP Internals Deep Dive"
  order: 10
---

## TL;DR

OMP's four extensibility surfaces live in `packages/coding-agent/src/extensibility/`:

| Surface | Core Mechanism | Key Design Decision |
|---------|----------------|---------------------|
| **hooks** | Merged into `ExtensionRunner`, unified event bus | `hookCapability` discovery → loaded as extension modules → `pi.on(...)` binds to runner |
| **skills** | `description` frontmatter drives model triggering | 3-pass discovery (capability → custom dir → managed), `hide` doesn't disable availability |
| **MCP** | 250ms startup gate + `DeferredMCPTool` async backfill | `MCPManager` multi-registry state machine, auto-reconnect with circuit breaker |
| **marketplace** | Dual scope (user/project) + Claude Code catalog compat | `marketplace.json` at `.omp-plugin/` and `.claude-plugin/`, symlinked into `node_modules` |

---

## Context

OMP (oh-my-pi) as a coding agent runtime faces an extensibility challenge: **how to let users, plugin authors, and third-party CLIs (Claude/Codex/Gemini/opencode) coexist in the same runtime without stepping on each other?**

This yields four core extensibility surfaces:

1. **hooks** — event-driven runtime interception (pre/post tool calls, session lifecycle)
2. **skills** — static knowledge packs, semantically triggered by the model (`skill://`, `/skill:`)
3. **MCP** — dynamic discovery, connection, and tool registration of external tool servers
4. **marketplace** — install plugins from Git/local/direct catalogs, supporting user/project dual scope

This article dissects each surface's implementation details and design trade-offs.

---

## Problems

### 1. Why did hooks "move behind" the extension runner?

Early OMP had a standalone `HookRunner` + `HookToolWrapper` (`packages/coding-agent/src/extensibility/hooks/runner.ts`, `tool-wrapper.ts`). But the current startup flow:

```ts
// src/extensibility/extensions/loader.ts:693-705
if (options.includeAmbientHooks !== false) {
  const hooks = await loadCapability<Hook>(hookCapability.id, loadOptions);
  for (const hookPath of hooks.items
    .map(hook => hook.path)
    .filter(hookPath => isExtensionFile(path.basename(hookPath)))) {
    addPath(hookPath);  // added to extensions load list
  }
}
```

`--hook` is treated as an alias for `--extension` (`hooks.md:9`). JS/TS hook factories discovered via `hookCapability` are **loaded as extension modules**, their `pi.on(...)` handlers binding to **the same extension runner's event bus**.

**Rationale**:
- Single event bus eliminates duplicate handler registries across hooks and extensions
- `ExtensionRunner` provides richer context (`invokeTool`, `setInterval`, `fileWriteFallback`, etc.)
- Hook modules retain their factory signature (`export default function(pi: HookAPI)`), preserving backward compatibility

### 2. How does skill frontmatter `description` decide triggering?

`skills.md:65-69` states explicitly:

> `description` is required for:
> - native `.omp` provider skill discovery (`requireDescription: true`)
> - `omp-plugins` extension-package skills and the `github` provider... also pass `requireDescription: true`

In `skills.ts:18-37`, the `Skill` interface only requires `name` and `path`, **but `description` is what the model uses to decide whether to invoke a skill**:

```ts
// src/extensibility/skills.ts:131-136
// System prompt construction uses discovered skills as follows:
// - if `read` tool is available:
//   - include discovered skills list in prompt, excluding skills with `hide: true`
```

The model sees a skill list (name + description) in the system prompt, semantically judges if the task needs that skill, then reads `skill://<name>` via the `read` tool, or the user manually types `/skill:<name>`.

**vs. Claude Code/Codex**:
- Claude Code's `.claude/skills/` also triggers via `description`
- Codex's `.codex/skills/` same
- Difference lies in **provider precedence**: `native` (100) > `omp-plugins` (90) > `claude` (80) > `claude-plugins`/`agents`/`codex` (70) > `opencode` (55) > `github` (30) > `omp-managed` (5) — `skills.md:87-96`

### 3. Why MCP's 250ms fast-start gate + deferred fallback?

`mcp-runtime-lifecycle.md:105-119`:

```text
connectServers() waits on a race between:
- all connect/tool-load tasks settled, and
- STARTUP_TIMEOUT_MS = 250

After 250ms:
- fulfilled tasks become live MCPTools
- rejected tasks produce per-server errors
- still-pending tasks:
  - use cached tool definitions if available to create DeferredMCPTools
  - otherwise contribute no tools at startup; they stay in flight
```

`MCPManager` (`src/mcp/manager.ts`) maintains **seven parallel registries**:

```ts
#connections: Map<string, MCPServerConnection>
#pendingConnections: Map<string, Promise<MCPServerConnection>>
#pendingToolLoads: Map<string, Promise<{ connection, serverTools }>>
#tools: CustomTool[]
#sources: Map<string, SourceMeta>
#pendingReconnections: Map<string, Promise<MCPServerConnection | null>>
#serverConfigs: Map<string, MCPServerConfig>
```

**Design drivers**:
- Prevent a single slow MCP server from blocking entire agent startup (issue #2100)
- `MCPToolCache` (`src/mcp/tool-bridge.ts`) caches tool definitions; next startup emits `DeferredMCPTool` immediately, hot-swaps when connection completes
- Auto-reconnect uses **exponential backoff** (500/1000/2000/4000ms) + **circuit breaker** (>5 reconnects in 30s suspends auto-reconnect; manual `/mcp reconnect` resets) — `mcp-runtime-lifecycle.md:187`

### 4. Why is marketplace compatible with Claude Code format?

`marketplace.md:96-97`:

> When omp is the only intended consumer, prefer this path [`.omp-plugin/marketplace.json`]. To remain Claude Code-compatible, publish at `.claude-plugin/marketplace.json` instead — omp uses it as a fallback when `.omp-plugin/marketplace.json` is absent.

**Catalog format is identical** (`marketplace.md:98-120`):

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "my-marketplace",
  "owner": { "name": "Your Name", "email": "you@example.com" },
  "metadata": { "description": "...", "version": "1.0.0", "pluginRoot": "plugins" },
  "plugins": [{ "name": "my-plugin", "source": "./my-plugin", ... }]
}
```

**Plugin sources support four formats** (`marketplace.md:160-207`):
- Relative path `"./my-plugin"` (within monorepo)
- GitHub shorthand `{ "source": "github", "repo": "org/repo", "ref": "main" }`
- Git subdir (monorepo subdirectory)
- npm package (parsed but installer rejects, not yet supported)

**Install mechanism** (`src/extensibility/plugins/marketplace/manager.ts:241-369`):
1. Resolve plugin source → get local directory
2. Version resolution priority: catalog version > plugin manifest > git SHA > `0.0.0`
3. `cachePlugin` copies to `~/.omp/plugins/cache/plugins/<marketplace>___<plugin>___<version>/`
4. **Symlink into scope's `node_modules/<packageName>/`** (`manager.ts:834-837`)
5. Write `omp-plugins.lock.json` recording version and enabled state

**Dual scope shadowing** (`marketplace.md:20-25`):
- Project scope install **shadows** same-named user scope (only when project is enabled)
- Disabled project install does **not** shadow user install

---

## Attempted Solutions

### Attempt 1: Standalone hooks vs. merged into extension runner

Early `HookRunner.emitToolCall` (`hooks/runner.ts:326-349`) directly intercepted tool calls:

```ts
async emitToolCall(event: ToolCallEvent): Promise<ToolCallEventResult | undefined> {
  for (const hook of this.hooks) {
    const handlers = hook.handlers.get("tool_call");
    for (const handler of handlers) {
      const handlerResult = await handler(event, ctx);
      if (handlerResult?.block) return result;  // first block wins
    }
  }
}
```

Later `ExtensionRunner` introduced `ExtensionToolWrapper` (`extensions/wrapper.ts`). Hook factories discovered via `hookCapability` are loaded as extensions, `pi.on("tool_call", ...)` binds to the same event bus. **Benefits of unification**:
- Extensions can also register `tool_call` handlers; order determined by extension load order
- Shared `ExtensionContext` capabilities (`invokeTool`, `setTimeout`, etc.)
- Eliminated duplicate `HookToolWrapper` implementation

### Attempt 2: Optional vs. required skill description

`skills.ts:91-118` `loadSkillsFromDir` enforces `requireDescription: true`. But `claude`/`codex`/`agents`/`opencode`/`claude-plugins` providers **don't enforce** (`skills.md:69`).

**Trade-off**:
- Required → high-quality skill list in system prompt, accurate model triggering
- Optional → backward compat with existing third-party skills (may lack description)
- Resolution: native/omp-plugins/github enforce; third-party CLIs lenient

### Attempt 3: Synchronous MCP startup vs. async deferred

Initially `discoverAndLoadMCPTools` awaited all server connections. But some HTTP/SSE servers have high latency, blocking startup for 10+ seconds.

**Evolution**:
1. Added 250ms timeout
2. Introduced `MCPToolCache` local tool definition cache
3. `DeferredMCPTool`: return stub first, `waitForConnection()` on invocation
4. Background continuation: connection completes → `#onToolsChanged` → `session.refreshMCPTools` hot-swap

### Attempt 4: Proprietary marketplace format vs. Claude Code compat

If OMP defined its own `marketplace.json` schema, plugin authors would maintain dual catalogs. Instead: **same JSON, dual read paths**:

```ts
// src/extensibility/plugins/marketplace/fetcher.ts (inferred logic)
// Try .omp-plugin/marketplace.json first, fallback to .claude-plugin/marketplace.json
```

This lets plugin authors **publish once**, both OMP and Claude Code can consume.

---

## Solution

### Unified Extension Loading Pipeline: `discoverExtensionPaths` → `loadExtensions` → `ExtensionRunner`

```ts
// src/extensibility/extensions/loader.ts:648-746
export async function discoverExtensionPaths(
  configuredPaths: string[],
  cwd: string,
  disabledExtensionIds?: string[],
  options: DiscoverExtensionPathOptions = {},
): Promise<string[]> {
  // 1. native extension modules (.omp/.pi)
  // 2. JS/TS hook factories via hookCapability
  // 3. installed plugin extension entry points (symlinked in node_modules)
  // 4. explicit configured paths
}
```

**Load order determines precedence**: later-loaded extensions win on commands, tools, flags, shortcuts (**last-wins**, `extensions/runner.ts:901-907`, `getCommand` iterates in reverse).

### Hook Modules Retain Independent API Surface

```ts
// src/extensibility/hooks/types.ts:476-588
export interface HookAPI {
  on(event: "tool_call", handler: HookHandler<ToolCallEvent, ToolCallEventResult>): void;
  on(event: "tool_result", handler: HookHandler<ToolResultEvent, ToolResultEventResult>): void;
  sendMessage(...): void;
  appendEntry(...): void;
  registerCommand(...): void;
  exec(...): Promise<ExecResult>;
  logger, typebox, arktype, zod, pi: typeof PiCodingAgent
}
```

`HookAPI` is **intentionally narrower than `ExtensionAPI`** (`types.ts:56-59`, `168-172`):
- No `setModel`, `setActiveTools`, `registerProvider` — methods that could deadlock the agent loop
- UI context only has `select`/`confirm`/`input`/`notify`/`setStatus`/`custom`/`editor`, no `onTerminalInput`/`setEditorComponent`

### Skill Discovery: 3-Pass + Real-time Deduplication

```ts
// src/extensibility/skills.ts:135-412
// Pass 1: capability providers (priority sorted, dedup by name)
// Pass 2: custom directories (override same-named default provider skills)
// Pass 3: managed (auto-learn) skills (dead-last, defer to any authored skill)
```

**Real-time deduplication**:
- `realPathSet` via `fs.realpath` (symlink-safe)
- `seenAuthoredSkillNames` first-wins per name
- Custom dir skills can override default-path provider skills (issue #7190)

### MCP Manager: State Machine + Background Backfill

```ts
// src/mcp/manager.ts (core state)
// getConnectionStatus(name) derives:
// - "connected" if in #connections
// - "connecting" if pending connect/tool-load/reconnect
// - "disconnected" otherwise
```

**Key async paths**:
- `session.refreshMCPTools()` removes all `mcp__` tools → re-wraps latest MCP tools → reactivates (`mcp-runtime-lifecycle.md:166`)
- `/mcp reload`: `disconnectAll()` → `discoverAndConnect()` → `refreshMCPTools()`
- Notification bridge: `MCPManager.addNotificationListener` → `sdk.ts` registers listener → `ExtensionRunner.emitMcpNotification` (`mcp-runtime-lifecycle.md:179`)

### Marketplace Install = Cache + Symlink + Lock File

```ts
// src/extensibility/plugins/marketplace/manager.ts:306-363
const cachePath = await cachePlugin(sourcePath, pluginsCacheDir, marketplace, name, version);
// symlink into node_modules
await fs.symlink(cachePath, linkPath, process.platform === "win32" ? "junction" : "dir");
// write omp-plugins.lock.json
config.plugins[packageName] = { version, enabledFeatures: null, enabled: true };
```

**Claude Code Compatibility**:
- `InstalledPluginsRegistry.version = 2` (number not string, `types.ts:160`)
- Passes `parseClaudePluginsRegistry()` validation
- Both share `~/.omp/plugins/installed_plugins.json` (user) and `<project>/.omp/plugins/installed_plugins.json` (project)

---

## Why It Works This Way

| Design Decision | Underlying Motivation |
|-----------------|----------------------|
| Hooks merged into extension runner | Eliminate dual event buses, share full `ExtensionContext`, reduce maintenance surface |
| Skill `description` required (native/omp-plugins) | Ensure system prompt skill list is semantically matchable by the model, improve trigger precision |
| MCP 250ms gate + deferred | Prevent slow servers from blocking startup; cache tool defs for "instant-on" feel |
| MCP circuit breaker (5/30s) | Prevent reconnect storms from dragging down the session |
| Marketplace dual catalog paths (`.omp-plugin/` + `.claude-plugin/`) | Single publish for plugin authors, dual consumption by OMP and Claude Code |
| Dual scope + project shadows user | Project-level overrides for team sharing; user-level for personal prefs; disabled doesn't shadow avoids silent breakage |
| Symlink into `node_modules` | Existing extension loader (`getAllPluginExtensionPaths`) loads marketplace plugins transparently |

---

## Lessons Learned

1. **Unified event bus beats isolated subsystems**: After hooks merged into extension runner, tool interception, session events, and MCP notifications all flow through `ExtensionRunner.emit()`. Order is deterministic by load order, eliminating "who intercepts first" ambiguity.

2. **Frontmatter fields are contracts**: A skill's `description` isn't just documentation — it's the **semantic contract for model triggering**. Poor description = skill never invoked.

3. **Cache-first, backfill-later**: MCP's `DeferredMCPTool` pattern applies to any "slow external dependency, stable interface" scenario — return a stub, hot-swap when ready.

4. **Compatibility over reinvention**: Marketplace directly adopts Claude Code's catalog schema and installed registry format. Plugin ecosystem interoperates immediately, avoiding chicken-and-egg cold start.

5. **Scope shadowing needs an "enabled" gate**: Project scope only shadows user scope when `enabled !== false`. Otherwise user settings "mysteriously stop working" — a classic footgun.

---

## References

- [OMP hooks documentation](https://github.com/can1357/oh-my-pi/blob/main/docs/hooks.md) — hook subsystem architecture, event types, execution model
- [OMP skills documentation](https://github.com/can1357/oh-my-pi/blob/main/docs/skills.md) — skill discovery pipeline, provider precedence, system prompt integration
- [OMP MCP runtime lifecycle](https://github.com/can1357/oh-my-pi/blob/main/docs/mcp-runtime-lifecycle.md) — MCP manager state machine, startup gate, reconnect mechanics
- [OMP marketplace documentation](https://github.com/can1357/oh-my-pi/blob/main/docs/marketplace.md) — catalog format, install mechanism, dual scope, Claude Code compat
- [extensions/loader.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/extensions/loader.ts#L648) — `discoverExtensionPaths` unified discovery logic
- [hooks/types.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/hooks/types.ts#L476) — `HookAPI` interface definition
- [skills.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/skills.ts#L135) — `loadSkills` three-pass discovery
- [mcp/manager.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/mcp/manager.ts) — `MCPManager` seven-registry state machine
- [plugins/marketplace/manager.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/plugins/marketplace/manager.ts#L241) — `installPlugin` cache+symlink+lock flow