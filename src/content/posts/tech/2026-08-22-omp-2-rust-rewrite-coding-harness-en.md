---
title: "OMP 2 (Oh My Pi 2): From Pi Fork to Full Rust Rewrite as an Independent Coding Harness"
date: 2026-08-22
category: tech
type: deep-dive
tags: [omp, rust, coding-agent, cli, open-source, ai-tools, harness-engineering]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 23
tldr: "OMP 2 is no longer a Pi fork. The entire codebase has been rewritten from scratch in Rust, with ~41 crates covering a custom bash engine, GPU-accelerated GUI, embedded CPython 3.14t, gRPC transport, and Kokoro-82M TTS. Currently in pre-release with no stable version yet."
description: "OMP 2 evolved from a Pi fork into a fully independent Rust codebase. This article analyzes its crate architecture, substantive differences from v1, design trade-offs, and pre-release risks."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness)

The [previous OMP article](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) covered v1 — Pi's batteries-included fork, with a TypeScript core plus six Rust crates as an acceleration layer. The conclusion then was "the difference isn't whether you can stack things on, it's whether you want to decide what gets stacked."

OMP 2 tears that premise apart. It's no longer a Pi fork, no longer has a TypeScript core — it's a ground-up Rust codebase. The [omp2 branch](https://github.com/can1357/oh-my-pi/tree/omp2) currently has ~41 crates, all under `crates/*`, compiled with a pinned nightly toolchain, edition 2024, hard-tab formatting.

This article breaks down its architecture layers, flags substantive differences from v1, and addresses what to watch out for in the pre-release stage.

## Why Go from Fork to Independent Codebase

v1's six Rust crates (`pi-shell`, `pi-natives`, `pi-walker`, `pi-iso`, `pi-ast`, `pi-voice`) were an **acceleration layer** — they bypassed fork/exec by bringing grep, shell, and AST matching into the process, but the agentic loop on top was still Pi's TypeScript. Upgrading to a new Pi upstream required merging TypeScript changes while ensuring Rust bindings still worked.

OMP 2 chose to remove TypeScript almost entirely and write the agentic loop itself in Rust. This means it's no longer bound by upstream Pi's design decisions, but it also no longer benefits from upstream progress for free. The README tagline is direct:

> A coding agent with the IDE wired in — rewritten in Rust.

Looking back at [Pi's philosophy](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) — deliberately offering only four tools, explicitly rejecting MCP, sub-agents, plan mode — OMP 2 is saying: we don't want to add things to that framework, we want to redesign the framework itself.

## Crate Architecture: Five Layers

The 41 crates are organized into five layers by responsibility. Rather than an exhaustive listing, this section highlights the design choices at each layer.

### Core Primitives

| Crate | Purpose |
|---|---|
| `core` | Compact strings (`Str`), sparse collections, binary/text encoding conversions |
| `ar` | Bounded lazy ZIP/TAR/TAR.GZ reading, deterministic archive writing |
| `walker` | Filesystem traversal, filtering, file-candidate discovery |
| `slopjson` | Tolerant JSON parsing — handles malformed, partial, and streaming documents |
| `hashline` | Disk-free hashline patch parsing/application over immutable byte snapshots |
| `ast` | tree-sitter source analysis, structural search, AST-aware editing |
| `grep` | Built-in search implementation |

`slopjson` deserves extra attention. JSON streamed back by LLMs frequently arrives broken mid-stream — unclosed brackets, extra commas — and a standard JSON parser rejects it outright. Tolerant parsing means the agent loop can start processing structured output while tokens are still flowing in, rather than waiting for the entire payload.

`hashline` has been omp's signature feature since v1. The v1 benchmark already showed it outperforming the `apply_patch` format on 14 of 16 models, with Grok Code Fast 1 showing a +64.6 point improvement. v2 turns it from an N-API binding into a standalone crate running over immutable byte snapshots, which means patch application is fully decoupled from the filesystem — it can patch anything in memory, not just files on disk.

### Inference

| Crate | Purpose |
|---|---|
| `llm-catalog` | Offline provider/route/model/capability catalog (embedded snapshot, no runtime heuristics) |
| `llm-inference` | Typed request/response contracts, Client over Tower service stack (routing, auth, retries, budgets) |

v1's 60+ provider support used TypeScript packages like `@anthropic-ai/sdk` and `openai`. v2's `llm-catalog` embeds model information as a compile-time snapshot — no need to guess at runtime whether a model supports function calling or how large its context window is. Just look it up.

`llm-inference` is built on the [Tower](https://docs.rs/tower/latest/tower/) service stack, the standard Rust abstraction for middleware (retries, timeouts, rate limits, load balancing). Choosing Tower means OMP 2's inference client shares middleware with the broader Rust HTTP/gRPC ecosystem instead of rolling its own.

### Services

| Crate | Purpose |
|---|---|
| `proto` | Generated Protobuf messages and gRPC bindings |
| `rpc` | gRPC transport, handshake, health checks, TLS, Unix-socket plumbing |
| `storage` | Append-only session transcripts and content-addressed blob storage |
| `docserver` | Local document authority: filesystem, revisions, transactions, watch, LSP ops |
| `telemetry` | OpenTelemetry instrumentation, metrics, export, redaction |
| `env` | Typed client boundary for environment services |

The gRPC + Protobuf choice is unusual for coding agents. Most agents (Claude Code, Codex CLI, Gemini CLI) use JSON-RPC or HTTP REST for IPC. gRPC offers binary serialization (smaller and faster than JSON), strongly-typed contracts (`.proto` files are the schema), and bidirectional streaming. The trade-off is you can't just `curl` it for debugging.

`storage` uses content-addressed blobs — content is keyed by its hash, so identical content is stored only once. This is practical in agent sessions: when the model reads the same file repeatedly, each read's result stored in the session transcript doesn't duplicate storage.

`docserver` serves as the "local document authority" — it manages file versions, transactions, change notifications, and provides LSP operations. v1's 14 LSP ops are not plugins in v2 but native capabilities of this crate.

### Agent

| Crate | Purpose |
|---|---|
| `tool` / `tools` | Typed, versioned tool contracts and registry, plus resource-owning built-in executors |
| `agent` | Durable, interruptible agent-loop foundations |
| `app` | Production CLI application and daemon |
| `e2e` | Cross-crate acceptance proofs |
| `macros` | Procedural macros |
| `memory` | Mnemopi — cross-session memory |
| `collab` | Collaborative sessions |
| `sdk` | SDK for external integrations |
| `sandbox` | Sandbox isolation |
| `campaign` | Batch execution engine |
| `oauth` / `secrets` / `settings` | Authentication, secrets management, settings |

Several items worth expanding:

**Versioned tool contracts** (`tool` crate). v1's 31 tools were TypeScript functions with JSON Schema descriptions. v2 uses "typed revisioned tool contracts" — each tool has a version number, and schemas are checked at compile time. Tool descriptions the model sees are auto-generated from Rust types rather than hand-written JSON. If you change a tool's input/output format, the compiler tells you what broke.

**Agent loop durability** (`agent` crate). The README uses the words "durable, interruptible." In v1, interrupting an agent session required TypeScript-level handling. v2 builds pause and resume into the loop itself — sessions can halt at any tool-call boundary and continue from the same point later.

**Campaign engine** (`campaign` crate). Completely absent in v1. Campaigns let you define a batch of tasks that OMP 2 schedules, handles failure retries, and aggregates results. Practical use: split a 100-file refactoring into a campaign instead of manually prompting 100 times.

**Mnemopi** (`memory` crate). A cross-session long-term memory system. v1 had nothing like this — every session started from zero (unless you relied on external `docs/` or AGENTS.md files).

### Shell

| Crate | Purpose |
|---|---|
| `shell-engine` | Standalone Bash parser and execution engine |
| `shell-builtins` | In-process coreutils and process builtins (no fork/exec) |
| `shell` | Facade combining engine and builtins |

v1 vendored [brush](https://github.com/reubeno/brush) (a Rust-based bash implementation). v2's `shell-engine` is a custom, standalone Bash parser. The difference: brush aims to be a "sufficiently compatible bash replacement," while OMP 2 needs an "agent-friendly shell with full control over parsing and execution flow" — inserting breakpoints at every command boundary, intercepting specific output patterns, counting tokens within the shell itself. That requires writing the parser from scratch.

`shell-builtins` brings `ls`, `cat`, `grep`, and other commands into the process. v1 already did this (38,000 lines in the `pi-shell` crate), but v2 splits it into a separate crate so the shell engine and builtins can be tested and updated independently.

### Interface

| Crate | Purpose |
|---|---|
| `tui` | Retained-mode terminal UI: components, rendering, input, terminal integration |
| `tui-macros` | `dom!` procedural markup macro for component trees |
| `gui` | GPU-accelerated native window host for omp-tui apps |
| `py` | Embedded free-threaded CPython 3.14t runtime with frozen stdlib |
| `voice-kokoro` | Kokoro-82M text-to-speech on candle with Metal acceleration |
| `chat-ui` / `webview` / `desktop` | Chat interface, webview, and desktop application |
| `exthost` | Extension host |

This layer is v2's most ambitious part.

**GPU-accelerated GUI**. v1 was pure TUI. v2 adds a GPU-accelerated native window — not Electron, not Tauri, but a window rendered directly by the GPU from Rust. `tui-macros` provides a `dom!` macro with syntax close to HTML/JSX:

```rust
dom! {
    <panel title="Session">
        <message role={role} content={text} />
    </panel>
}
```

**Embedded CPython 3.14t**. The `py` crate embeds an entire CPython 3.14t (free-threaded version) into the binary, with a frozen standard library. This means the agent can run Python code without Python being installed on the system — the binary brings its own. Free-threaded (the `-t` suffix) removes the GIL for better performance in multi-threaded scenarios.

**Kokoro-82M TTS**. An 82M-parameter text-to-speech model running on [candle](https://github.com/huggingface/candle) (Hugging Face's Rust ML framework) with Metal acceleration. Voice feedback has real utility in long coding sessions — you can know what the agent is doing without watching the screen. But 82M quality won't match commercial TTS; this is more of a technology demonstration.

## Substantive Differences from v1 to v2

| | v1 | v2 |
|---|---|---|
| Identity | Pi's batteries-included fork | Independent Rust codebase |
| Primary language | TypeScript (+ 80k lines of Rust crates) | Rust (~41 crates) |
| Upstream relationship | Tracks Pi upstream, merges changes | No Pi dependency; npm shim still exists |
| Shell | Vendored brush bash fork | Custom shell-engine + shell-builtins |
| Tool system | 31 TypeScript tools + JSON Schema | Typed revisioned tool contracts (Rust compile-time verification) |
| LSP / DAP | 14 LSP ops + 28 DAP ops (binding layer) | Natively provided by docserver crate |
| IPC | stdio + JSON | gRPC + Protobuf + Unix-socket |
| Storage | Filesystem | Content-addressed blobs + append-only transcripts |
| Memory | No cross-session memory | Mnemopi (memory crate) |
| Interface | TUI | TUI + GPU-accelerated GUI + webview + desktop |
| Python | Depends on system installation | Embedded CPython 3.14t |
| TTS | pi-voice (audio capture/playback) | Kokoro-82M on candle |
| Observability | No native support | OpenTelemetry (telemetry crate) |
| Batch execution | None | Campaign crate |
| Collaboration | `/collab` relay | Collab crate (native) |

The most notable change isn't any individual feature addition — it's the **shift in system boundaries**. v1's boundary sat between TypeScript and Rust — N-API bindings handled cross-language calls, with each side having its own type system and error handling. v2 puts the entire system in one language, with boundaries becoming trait and type constraints between crates.

## Development Discipline: Three Iron Rules in AGENTS.md

OMP 2's [AGENTS.md](https://github.com/can1357/oh-my-pi/blob/omp2/AGENTS.md) defines three inviolable rules for contributors (including AI agents):

1. **No heap allocation**: Core paths use zero heap allocation; all allocation goes through arenas or pools
2. **All I/O must be async**: Synchronous I/O blocking the agent loop is a bug
3. **No direct stdout writes for TUI rendering**: All output goes through the tui crate's retained-mode renderer

These three rules correspond to three v1 pain points: TypeScript's GC pauses interfering with TUI rendering during long sessions, synchronous shell exec freezing the entire agent loop, and multiple components writing to stdout causing interleaved output.

## E2E Tests: P1 through P8

OMP 2's `e2e` crate defines eight priority levels of acceptance tests:

- **P1**: Basic conversation, tool calls, context management
- **P2**: File read/write, hashline application
- **P3**: Shell command execution, in-process builtins
- **P4**: LSP operations, code navigation
- **P5**: Multi-session and sub-agents
- **P6**: Campaign batch execution
- **P7**: Collaboration and relay
- **P8**: Voice, GUI, desktop integration

This list also indirectly reveals the completion order — P1-P3 are foundational, P7-P8 stabilize last.

## Pre-release: Current Risks

OMP 2 is currently on the `omp2` branch with no official version number or release. Several practical risks:

**Unstable APIs**. None of the 41 crates' public APIs have stability guarantees. If you build integrations against OMP 2's SDK today, they may break on the next pull.

**Ecosystem fragmentation**. v1 users use the npm package (`@oh-my-pi/pi-coding-agent`); v2 is a Rust binary. The migration path is unclear. The README has an `npm/pi-coding-agent` shim, but its role (thin wrapper vs. compatibility layer) isn't documented.

**Compilation requirements**. Pinned nightly Rust toolchain, edition 2024 — stable `rustc` won't compile this. Nightly ABI and language features can themselves change on any given day.

**Hardware acceleration coverage**. The GPU GUI and Metal-accelerated TTS should work on macOS, but Linux GPU support (Vulkan? CUDA?) and Windows situations lack documentation.

**Single-maintainer risk**. OMP's primary developer is Can Bölük ([Stencil Labs, Inc.](https://github.com/can1357)). v1 accumulated 18,392 commits in 8 months. High-output single-person projects mean maintenance depth concentrates in one individual.

## Position in the Harness Competition

In the second half of 2026, several coding harnesses are making major version upgrades simultaneously: [Pi shipped the AgentHarness v2 API](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en), [opencode migrated from Bun to Node.js and rewrote its desktop app](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en), and DeepSeek released its official coding agent.

OMP 2's full Rust rewrite is the most radical in this batch — others are changing runtimes, API layers, or UIs, while OMP 2 is changing the entire language and architecture. This bet succeeds only if Rust's performance and memory control in agent scenarios is worth giving up TypeScript ecosystem flexibility and contributor accessibility.

The [evolution of harness engineering](/posts/ai/2026-03-28-harness-engineering-evolution-en) has always had two paths: stacking higher on existing frameworks, or starting over. OMP v1 was the extreme of the first path — adding 80,000 lines of Rust on top of Pi. OMP 2 is the second path in practice. From the perspective of ["the model is a component, the harness is the system"](/posts/ai/2026-08-10-model-component-harness-system-en), OMP 2's choice to rewrite the harness rather than swap models is itself a footnote to that thesis.

## Overall

OMP 2 is a highly ambitious project — rewriting from scratch in Rust everything a coding agent needs: shell, LSP, storage, TUI, GUI, TTS, memory, collaboration, sandbox, and observability. It's no longer a Pi fork but an independent system carrying its own complete vision of what a coding harness should look like.

But it's also pre-release. No stable version, no migration guide, no community validation yet. The maintenance burden of 41 crates concentrates in one person. If you're choosing tools today, v1 remains usable — 26,400 stars, MIT license, npm install. v2 is worth tracking, but at this stage it's better read as a "reference implementation for coding harness design" than as a production tool to switch to today.

The most valuable takeaway from OMP 2 may not be any single crate, but something it demonstrates: **when you feel the framework's limitations can't be solved by adding more, rewriting is a reasonable option — provided you truly understand what you're rewriting.** OMP 2's list of 41 crates at least proves Can Bölük does.

## References

- [can1357/oh-my-pi — omp2 branch (GitHub)](https://github.com/can1357/oh-my-pi/tree/omp2)
- [omp2 README](https://github.com/can1357/oh-my-pi/blob/omp2/README.md)
- [omp.sh official website](https://omp.sh)
- [The Harness Problem (Can Bölük, 2026-02-12)](https://blog.can.ac/2026/02/12/the-harness-problem/)
- [Tower — Rust middleware abstraction (docs.rs)](https://docs.rs/tower/latest/tower/)
- [candle — Hugging Face's Rust ML framework (GitHub)](https://github.com/huggingface/candle)
- [brush-shell — Rust bash implementation vendored in v1 (GitHub)](https://github.com/reubeno/brush)
- Related: [omp (Oh My Pi): The batteries-included fork that flips Pi's minimalism](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en)
- Related: [Pi Coding Agent: A Minimalist Open-Source Terminal Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en)
- Related: [From Prompt to Harness: Three Evolutions in AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution-en)
- Related: [The Model Is Just a Component; the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
