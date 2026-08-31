---
title: "pi-mono Deep Dive 2: Monorepo Architecture & Core Abstractions — How 7 Packages Divide Work & Why Dependencies Flow One Way"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, monorepo, architecture, dependency-inversion]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 2
tldr: "From user-visible features into architecture: 7 npm packages with clear boundaries, one-way dependency flow, why pi-tui/pi-telemetry have zero deps, how pi-ai encapsulates provider details, lockstep versioning avoiding diamond deps. Builds an 'outside-in' mental model."
description: "Deep dive into pi-mono monorepo structure: packages/ai, agent, coding-agent, tui, telemetry, client, server, protocol — responsibilities, dependency direction, versioning strategy, build order, supply-chain hardening. For engineers wanting to understand architectural decisions in a large TypeScript monorepo."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-monorepo-architecture)

## TL;DR

- **7 Core Packages**: `pi-ai`, `pi-agent-core`, `pi-coding-agent`, `pi-tui`, `pi-telemetry`, `pi-client`, `pi-server` + `pi-protocol`, `session-backends`
- **One-Way Dependency Flow**: `pi-tui`/`pi-telemetry` (leaves) → `pi-ai` → `pi-agent-core` → `pi-coding-agent` (root)
- **Key Design**: Zero-dep leaf packages, provider details encapsulated in `pi-ai/api/*`, lockstep versioning unifies version numbers
- **Build Order**: Hand-written topo sort, zero config, fully auditable
- **Supply Chain**: Exact versions + shrinkwrap + min-release-age=2 + npm OIDC trusted publishing

---

## Project Landscape: What the CLI User Doesn't See

Part 1 treated pi as a "black box". Now open the box — how do 7 npm packages divide and conquer:

```
pi-mono (earendil-works/pi)
├── packages/ai              # pi-ai: Unified Multi-Provider LLM API
├── packages/agent           # pi-agent-core: Agent Runtime + Loop + Harness
├── packages/coding-agent    # pi-coding-agent: CLI Entry + Session + SDK
├── packages/tui             # pi-tui: Terminal UI Library (Differential Rendering)
├── packages/telemetry       # pi-telemetry: Vendor-neutral Telemetry Contracts
├── packages/client          # pi-client: Remote Session Client
├── packages/server          # pi-server: Remote Session Server
├── packages/protocol        # pi-protocol: JSON-RPC/WebSocket Protocol Definitions
└── packages/session-backends/
    └── sqlite-node          # Session Storage Backend (pluggable)
```

### Package Responsibilities at a Glance

| Package | NPM Scope | Core Responsibility | Key Exports |
|---|---|---|---|
| **pi-ai** | `@earendil-works/pi-ai` | Unified LLM interface, Provider Factory, Model Catalog, Auth, Streaming | `Message`, `Tool`, `Context`, `streamFunction`, OAuth helpers |
| **pi-agent-core** | `@earendil-works/pi-agent-core` | Agent Loop, Harness, Tool Execution, Compaction, Branch Summary, Telemetry Schema | `agentLoop`, `AgentHarness`, `executeToolCalls`, `compact`, `TelemetrySchema` |
| **pi-coding-agent** | `@earendil-works/pi-coding-agent` | CLI, Session Manager, Extension Runtime, Model Registry, SDK, TUI Components | `main`, `SessionManager`, `ExtensionRunner`, `createAgentSession`, `InteractiveMode` |
| **pi-tui** | `@earendil-works/pi-tui` | Virtual DOM Diff, CSI 2026, Component Tree, Layout Engine, Keybindings | `TUI`, `Component`, `LayoutNode`, `EditorComponent`, `MarkdownComponent` |
| **pi-telemetry** | `@earendil-works/pi-telemetry` | Schema-defined Telemetry, Conformance Tests, NOOP/InMemory implementations | `TelemetrySchema`, `defineTelemetrySchema`, `InMemoryTelemetryContext` |
| **pi-protocol** | `@earendil-works/pi-protocol` | JSON-RPC 2.0 Types, WebSocket Framing, Reconnection Logic | `ProtocolMessage`, `ClientMessage`, `ServerMessage`, `WebSocketTransport` |
| **pi-client** | `@earendil-works/pi-client` | Remote Session Client, Auto-reconnect, Event Stream | `Client`, `RemoteSession`, `Connection` |
| **pi-server** | `@earendil-works/pi-server` | Remote Session Server, Session Registry, Auth Middleware | `Server`, `SessionManager`, `ProtocolHandler` |

---

## Dependency Graph: Why One-Way Flow?

```
┌─────────────────────────────────────────────────────────────────┐
│                        pi-coding-agent (CLI Entry)               │
│  Depends: pi-agent-core, pi-ai, pi-tui, pi-telemetry, pi-client │
└─────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────┐
│                      pi-agent-core (Agent Core)                  │
│  Depends: pi-ai, pi-telemetry                                    │
└─────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────┐
│                         pi-ai (LLM Integration)                  │
│  Depends: pi-telemetry (optional, for AI spans)                  │
└─────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────┐
│              pi-tui (zero deps)    │    pi-telemetry (zero deps) │
│  Pure TypeScript, no external deps │  Pure TypeScript, no deps   │
└─────────────────────────────────────────────────────────────────┘

Remote Layer (parallel):
  pi-client ← pi-protocol → pi-server
  ↑                              ↑
  └────────── pi-telemetry ──────┘
```

### Dependency Direction Iron Laws

| Rule | Rationale | Violation Consequence |
|---|---|---|
| **Leaf packages zero external deps** | `pi-tui`, `pi-telemetry` usable by any project independently | Circular deps, bundle bloat, purity loss |
| **Core logic doesn't depend on CLI** | `pi-agent-core`, `pi-ai` have no `pi-coding-agent` dep | SDK/Embed users don't install CLI code |
| **Provider details encapsulated** | `pi-ai` exports only interfaces + Factories; impl in `api/*`, `providers/*` | Effective tree-shaking, users never see internals |
| **Protocol independent** | `pi-protocol` defines types + framing only, no business logic | Client/Server evolve independently, multi-lang friendly |

---

## Core Abstraction Layers (Outside-In, Matching Dependency Depth)

### Layer 0: Infrastructure — Zero Deps, Independently Distributable

#### pi-tui: Terminal UI Engine

```typescript
// packages/tui/src/index.ts - main exports
export { TUI } from "./tui.ts";
export { Component, LayoutNode, VStack, HStack, Box, Text, MarkdownComponent, EditorComponent } from "./components/index.ts";
export { KeybindingsManager, DEFAULT_EDITOR_KEYBINDINGS, DEFAULT_APP_KEYBINDINGS } from "./keybindings.ts";
export { Terminal, AltScreen } from "./terminal.ts";
```

**Core Capabilities**:
- **Differential Rendering**: Virtual DOM diff → minimal ANSI output → flicker-free
- **CSI 2026 Synchronized Output**: Batched output, avoids partial frame tearing
- **Layout Engine**: Flex-like layout (VStack/HStack/Box), dynamic sizing
- **Component Tree**: `Component` base class, `render(context)`, `diff(prev, next)`, `mount/unmount`
- **Keyboard System**: `KeybindingsManager`, chord support (`ctrl+shift+p`), platform-normalized keys

> **Why zero deps?** TUI is the bottom rendering engine. Any TypeScript project (not just pi) should be able to `import { TUI } from '@earendil-works/pi-tui'` directly.

#### pi-telemetry: Vendor-neutral Contracts

```typescript
// packages/telemetry/src/index.ts
export { defineTelemetrySchema, createTypedSpanStarter, InMemoryTelemetryContext, NOOP_TELEMETRY_CONTEXT } from "./index.ts";
export type { TelemetrySchema, TelemetrySpan, TelemetryContext, SpanAttributes, TelemetryAttributeDefinition } from "./index.ts";
```

**Core Capabilities**:
- **Schema-defined**: Define Schema first (span names, attributes, events), then generate typed starters
- **Vendor-neutral**: Not tied to OpenTelemetry, Datadog, Honeycomb; adapter provided by user
- **Conformance Tests**: `testing/conformance.ts` verifies adapter correctness
- **Zero-overhead NOOP**: `NOOP_TELEMETRY_CONTEXT` for paths that don't need telemetry

> **Why not OpenTelemetry directly?** OTel API complex, large bundle, enforces specific data model. pi wants: "define own schema, choose any backend, testable".

---

### Layer 1: LLM Integration — Encapsulating All Provider Differences

#### pi-ai: Unified Interface, Lazy Loading, Model Catalog

```
packages/ai/
├── src/
│   ├── index.ts                    # Public API (only types + core utilities)
│   ├── types.ts                    # Message, Tool, Context, StreamEvent core types
│   ├── models.ts                   # Model Registry, Resolver, Catalog
│   ├── models.generated.ts         # Auto-generated model data (do not hand-edit)
│   ├── models-store.ts             # Model data storage & query
│   ├── providers/
│   │   ├── index.ts                # Provider Factory Registry
│   │   ├── faux.ts                 # Test Faux Provider
│   │   ├── anthropic/              # Anthropic Provider impl
│   │   ├── openai/                 # OpenAI Provider impl
│   │   ├── google/                 # Google Provider impl
│   │   └── ...                     # 15+ providers
│   ├── api/                        # Concrete API implementations (lazy-loaded)
│   │   ├── anthropic-messages.ts
│   │   ├── openai-responses.ts
│   │   ├── google-generative-ai.ts
│   │   └── ...
│   ├── auth/                       # OAuth, API Key, Credential Store
│   └── utils/                      # Streaming, JSON Parse, Retry, Validation
```

**Key Abstractions**:

```typescript
// Unified Streaming interface (all providers implement this)
export interface StreamFunction {
  (model: ModelConfig, context: Context, options: StreamOptions): AsyncIterable<StreamEvent>;
}

// Unified StreamEvent types
export type StreamEvent =
  | { type: "start"; partial: AssistantMessage }
  | { type: "text_delta"; partial: AssistantMessage }
  | { type: "toolcall_delta"; partial: AssistantMessage }
  | { type: "done"; result: () => Promise<AssistantMessage> }
  | { type: "error"; error: Error };
```

**Lazy Loading Mechanism**:

```typescript
// packages/ai/src/api/lazy.ts
export const anthropicMessages = lazy(() => import("./anthropic-messages.ts").then(m => m.streamAnthropicMessages));
export const openaiResponses = lazy(() => import("./openai-responses.ts").then(m => m.streamOpenAIResponses));
// ...

// Dynamic import on use; tree-shaking removes unused provider code
```

**Model Catalog Auto-Generation**:

```bash
# Generate model data (fetch from provider official APIs)
npm run generate:models

# Output: packages/ai/src/models.generated.ts (~50KB, all model metadata)
# Contains: model id, display name, context window, max output, pricing, capabilities, thinking support
```

> **Architecture Insight**: `pi-ai` is the "anti-corruption layer" — upper layers only see `Message`, `Tool`, `Context`, `streamFunction`; lower layer 15+ providers each implement `streamFunction`, details fully isolated.

---

### Layer 2: Agent Core — Loop, Harness, Tool Execution

#### pi-agent-core: Agent Runtime

```
packages/agent/
├── src/
│   ├── index.ts                    # Public API
│   ├── types.ts                    # AgentMessage, AgentTool, AgentContext, AgentEvent, AgentLoopConfig
│   ├── agent-loop.ts               # Core double-while loop (~800 lines)
│   ├── stream-fn.ts                # Default streamFunction wrapper
│   ├── harness/
│   │   ├── agent-harness.ts        # Harness assembly: system prompt, tools, skills, compaction
│   │   ├── compaction/             # Compaction logic (token estimation, cut point, summary gen)
│   │   ├── branch-summarization.ts # Branch Summary generation
│   │   ├── messages.ts             # System/User/Assistant message builders
│   │   ├── prompt-templates.ts     # Prompt Template system
│   │   ├── result.ts               # AgentResult, TurnResult
│   │   ├── session/                # Session interface (for harness use)
│   │   ├── skills.ts               # Skills loading & formatting
│   │   ├── system-prompt.ts        # System Prompt assembly
│   │   ├── telemetry.ts            # Telemetry Schema definitions
│   │   ├── tools/                  # Built-in tool definitions (bash, read, write, edit, grep, find, ls)
│   │   └── types.ts                # Harness core types
│   ├── proxy.ts                    # Agent Proxy (for RPC mode)
│   └── search/                     # Search-related tools
```

**Agent Loop Core Signature**:

```typescript
// packages/agent/src/agent-loop.ts
export function agentLoop(
  prompts: AgentMessage[],
  context: AgentContext,
  config: AgentLoopConfig,
  signal: AbortSignal | undefined,
  streamFn: StreamFn,
): EventStream<AgentEvent, AgentMessage[]>;

// Key AgentLoopConfig fields
export interface AgentLoopConfig {
  model: ModelConfig;
  tools: AgentTool[];
  systemPrompt: string;
  convertToLlm: (messages: AgentMessage[]) => Promise<Message[]>;
  transformContext?: (messages: AgentMessage[], signal) => Promise<AgentMessage[]>;
  getApiKey?: (provider: string) => Promise<string | undefined>;
  apiKey?: string;
  reasoning?: "low" | "medium" | "high" | "off";
  toolExecution: "parallel" | "sequential";
  beforeToolCall?: (ctx, signal) => Promise<{ block?: boolean; reason?: string; terminate?: boolean }>;
  afterToolCall?: (ctx, signal) => Promise<ToolResultPatch>;
  shouldStopAfterTurn?: (turn: PrepareNextTurnContext) => Promise<boolean>;
  getSteeringMessages?: () => Promise<AgentMessage[]>;      // Steering (Enter)
  getFollowUpMessages?: () => Promise<AgentMessage[]>;      // Follow-up (Alt+Enter)
  prepareNextTurn?: (turn: PrepareNextTurnContext) => Promise<NextTurnSnapshot>; // Compaction, Model Switch
}
```

**Double-Loop Architecture** (Part 4 deep dive):

```
Outer Loop (while true):
  ├─ Prepare next turn (prepareNextTurn: compaction, model switch, collect steering)
  ├─ Inner Loop (while hasMoreToolCalls || pendingMessages):
  │   ├─ Process pending messages (steering/follow-up injection)
  │   ├─ streamAssistantResponse() → LLM call
  │   ├─ Parse tool calls
  │   ├─ executeToolCalls() (parallel/sequential + before/after hooks)
  │   ├─ Emit turn_end event
  │   ├─ shouldStopAfterTurn() check if done
  │   └─ Collect follow-up messages
  └─ If follow-up → continue outer loop; else break
```

---

### Layer 3: Application Layer — CLI, Session, Extension, SDK

#### pi-coding-agent: User-Facing Complete Application

```
packages/coding-agent/
├── src/
│   ├── index.ts                    # Unified export (huge, ~400 lines)
│   ├── main.ts                     # CLI entry, arg parsing, mode dispatch
│   ├── cli.ts                      # Arg definitions, subcommands
│   ├── config.ts                   # Path constants, version info
│   ├── core/
│   │   ├── agent-session.ts        # AgentSession class (Interactive mode core)
│   │   ├── session-manager.ts      # SessionManager (Tree, Branching, Compaction, Persist)
│   │   ├── session-manager.test.ts # Tests
│   │   ├── compaction/             # Compaction integration (uses pi-agent-core logic)
│   │   ├── extensions/             # Extension Runtime, Hooks, API definitions
│   │   ├── model-registry.ts       # ModelRegistry (Scope, Diagnostics, Resolver)
│   │   ├── model-resolver.ts       # CLI model string → ModelConfig resolution
│   │   ├── model-runtime.ts        # ModelRuntime (Credential Sync, Auth Overrides)
│   │   ├── sdk.ts                  # Programmatic API: createAgentSession, createCodingTools
│   │   ├── settings-manager.ts     # Settings persistence, Schema validation
│   │   ├── trust-manager.ts        # Project Trust (allow/deny tool execution)
│   │   ├── tools/                  # 8 core tool implementations (bash, read, write, edit, grep, find, ls, powershell)
│   │   └── messages.ts             # Session Entry → Context Messages conversion
│   ├── modes/
│   │   ├── index.ts                # Mode exports
│   │   ├── interactive/            # InteractiveMode class, Components, Theme
│   │   ├── rpc/                    # RpcMode, RpcClient, JSONL Transport
│   │   └── print/                  # PrintMode, JSONMode
│   └── utils/                      # Many utilities (git, clipboard, image, shell, diff, etc.)
```

**SessionManager Core** (Part 5 deep dive):

```typescript
// packages/coding-agent/src/core/session-manager.ts
export class SessionManager {
  // Tree structure: append-only, id/parentId
  appendMessage(message): string;
  appendThinkingLevelChange(level): string;
  appendModelChange(provider, modelId): string;
  appendCompaction(summary, firstKeptEntryId, tokensBefore): string;
  branch(branchFromId): void;                    // Move leaf pointer
  branchWithSummary(branchFromId, summary): string; // Branch + summarize old path
  buildSessionContext(): SessionContext;          // Context for LLM (handles compaction)
  buildContextEntries(): SessionEntry[];          // Entries for TUI rendering
  createBranchedSession(leafId): string | undefined; // Fork to new file
  getTree(): SessionTreeNode[];                   // Visual tree structure
}
```

**Extension System** (Part 7 deep dive):

```typescript
// Extension definition
export interface Extension {
  name: string;
  version: string;
  // Lifecycle
  onLoad?(api: ExtensionAPI): Promise<void> | void;
  onUnload?(api: ExtensionAPI): Promise<void> | void;
  // Hooks
  onAgentStart?(event): Promise<BeforeAgentStartEventResult>;
  onBeforeToolCall?(ctx): Promise<{ block?: boolean; reason?: string; terminate?: boolean }>;
  onAfterToolCall?(ctx): Promise<ToolResultPatch>;
  onTurnEnd?(event): Promise<void>;
  // Extension points
  tools?: RegisteredTool[];
  commands?: RegisteredCommand[];
  keybindings?: AppKeybinding[];
  ui?: { components?: EntryRenderer[]; widgets?: WidgetDefinition[] };
  settings?: SettingsConfig;
}
```

---

### Layer 4: Remote Layer — Parallel to Main Flow

#### pi-protocol / pi-client / pi-server

```
packages/protocol/src/
├── index.ts           # Type definitions
├── protocol.ts        # JSON-RPC 2.0 message structure
├── client.ts          # Client-side message handling
├── server.ts          # Server-side message handling
└── types.ts           # Shared types

packages/client/src/
├── client.ts          # Client class, connection management, reconnection
├── connection.ts      # WebSocket connection, heartbeat, event stream
├── session-handle.ts  # Remote Session Handle
└── transport.ts       # Transport abstraction (WebSocket, future-swappable)

packages/server/src/
├── server.ts          # Server class, Session Registry
├── sessions.ts        # Session management, Auth Middleware
├── protocol.ts        # Protocol handler
└── snapshots.ts       # Session snapshots (checkpoint/resume)
```

**Remote Session Flow**:

```
Client (pi --rpc or IDE)                    Server (pi server)
     │                                          │
     ├── WebSocket Connect ──────────────────→ │
     │                                          │
     ├── JSON-RPC: prompt ──────────────────→ │
     │                                          ├── Create/restore SessionManager
     │                                          ├── Execute Agent Loop
     │                                          │
     │ ←────────── Streaming Events ────────── │  (message_start, tool_execution, turn_end...)
     │                                          │
     ├── JSON-RPC: steering/follow-up ──────→ │  (mid-stream interjection)
     │                                          │
     ├── Disconnect ────────────────────────→ │
```

---

## Monorepo Mechanics

### Version Strategy: Lockstep Versioning

```json
// Root package.json
{
  "version": "0.12.3",
  "workspaces": ["packages/*", "packages/session-backends/*", ...],
  "scripts": {
    "version:patch": "npm version patch --workspaces --no-git-tag-version --no-workspaces-update && node scripts/sync-versions.js && npm install --package-lock-only --ignore-scripts",
    "release:patch": "node scripts/release.mjs patch",
    "release:minor": "node scripts/release.mjs minor"
  }
}
```

- **All packages share one version** (`0.12.3`)
- **Patch** = fixes + additions, **Minor** = breaking changes, **No Major**
- `scripts/sync-versions.js` syncs all workspace versions
- Release script: bump version → update CHANGELOGs → regenerate artifacts → `npm run check` → commit → tag → push → CI publishes

### Build Order: Hand-Written Topo Sort

```json
// Root package.json scripts.build
"build": "cd packages/tui && npm run build && \
          cd ../telemetry && npm run build && \
          cd ../ai && npm run build && \
          cd ../agent && npm run build && \
          cd ../session-backends/sqlite-node && npm run build && \
          cd ../../protocol && npm run build && \
          cd ../client && npm run build && \
          cd ../server && npm run build && \
          cd ../coding-agent && npm run build"
```

**Why not `npm run build --workspaces`?**
- Precise order control (tui → telemetry → ai → agent → ...)
- Avoids parallel build race conditions
- Fully auditable, zero hidden deps

### Supply Chain Hardening

| Mechanism | Implementation | Purpose |
|---|---|---|
| **Exact versions** | All external deps pinned | Reproducible builds |
| **npm-shrinkwrap.json** | `scripts/generate-coding-agent-shrinkwrap.mjs` from root lockfile | Published npm users get locked transitive deps too |
| **min-release-age=2** | `.npmrc` setting | Prevent same-day malicious package resolution |
| **PI_ALLOW_LOCKFILE_CHANGE=1** | Pre-commit blocks lockfile changes | Forces dependency change review |
| **Lifecycle script allowlist** | Shrinkwrap script validates | New lifecycle scripts require explicit review |
| **npm ci --ignore-scripts** | CI install | No arbitrary install scripts |
| **Trusted Publishing** | GitHub Actions OIDC → npm | No local npm token, OTP, WebAuthn needed |

---

## Key Design Decisions Review

| Decision Point | Choice | Alternative | Why This One |
|---|---|---|---|
| Monorepo tool | npm workspaces + hand-written build | Turborepo, Nx, pnpm workspaces | Zero config, native, full control, no extra deps |
| Versioning | Lockstep | Independent versioning | Avoids diamond deps, single version publish, low cognitive load |
| Dependency dir | Strict one-way, leaf zero-deps | Allow bidirectional, shared utils | Independent distribution, tree-shaking, clear architecture |
| Provider encapsulation | `pi-ai/api/*` lazy-loaded | All providers static import | Bundle size, startup speed, tree-shaking |
| Telemetry | Custom Schema + Conformance | OpenTelemetry | Lightweight, custom data model, test-friendly |
| Remote protocol | JSON-RPC 2.0 over WebSocket | gRPC, custom binary | Human-readable, browser-native, multi-lang easy |
| Session storage | JSONL append-only tree | SQLite, Redis, CRDT | Simple, human-inspectable, Git-friendly, no migration pain |

---

## References

- [Pi Official Website pi.dev — Architecture Overview](https://pi.dev/docs/latest/architecture)
- [GitHub - earendil-works/pi — Monorepo Structure](https://github.com/earendil-works/pi/tree/main/packages)
- [npm workspaces Official Docs](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [TypeScript ESM + Node 22 Native Support](https://nodejs.org/docs/latest-v22.x/api/esm.html)
- [Supply-chain Hardening: npm shrinkwrap & trusted publishing](https://docs.npmjs.com/cli/v10/commands/npm-shrinkwrap)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [CSI 2026 Synchronized Output Standard](https://github.com/microsoft/terminal/blob/main/doc/synchronized-output.md)

---

## Next Up

> **Part 3: pi-ai: Unified Multi-Provider LLM API**
>
> How do 15+ providers work under one interface? What does `streamFunction` signature look like? How does lazy loading achieve tree-shaking? How is Model Catalog auto-generated? How are OAuth and API Keys unified? Credential Sync mechanism?