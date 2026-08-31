---
title: "pi-mono Deep Dive Series: From Zero to Understanding This Minimal Coding Agent's Complete Architecture"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, monorepo, architecture, agent-loop, session-management]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 0
tldr: "This 17-part series takes you from CLI user perspective through pi-mono's Agent Loop, Session Tree, Tool System, Extension System, TUI Architecture, Remote Session, Telemetry, Compaction, and Release process. Ideal for developers wanting to self-host agents, research agent architecture, or contribute to pi."
description: "pi-mono (renamed to earendil-works/pi) is a minimal coding agent monorepo by Mario Zechner (TypeScript, MIT, @earendil-works scope). This article serves as the series overview, covering 7 core packages, dependency relationships, design philosophy, and the complete 17-part reading map."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-series-overview)

## TL;DR

- **Project**: pi-mono → renamed to [earendil-works/pi](https://github.com/earendil-works/pi), npm scope `@earendil-works`
- **Core**: 7-package monorepo, "minimal core + infinite extensibility"
- **Positioning**: Not a batteries-included agent, but primitives for developers to "build their own"
- **Series**: 17 parts, from CLI usage → architecture overview → Agent Loop → Session/Compaction → Tools → Extensions → TUI → Remote/Telemetry/Release
- **Prerequisites**: TypeScript basics, CLI familiarity, basic LLM concepts; no Rust, C++, or distributed systems experience needed

---

## Who This Series Is For

| Reader Persona | What You'll Get |
|---|---|
| Engineers wanting to self-host/customize coding agents | Complete architecture map, directly applicable design patterns |
| Researchers/students studying AI Agent architecture | Layer-by-layer teardown of production-grade code with design rationale |
| Developers wanting to contribute to pi / build Extensions | Complete Extension API mechanics, hook points, best practices |
| Curious how "minimalism" works in engineering | How 4 tools support full coding workflow, why no MCP/Sub-agents |

**Not for**: Users wanting "batteries-included, most features out of the box" → use [Claude Code](https://claude.ai/code), [Codex CLI](https://codex.cli), [OpenCode](https://opencode.ai), or [oh-my-pi](https://github.com/can1357/oh-my-pi) directly.

---

## Project Overview: 7 Core Packages

```
pi-mono (earendil-works/pi)
├── packages/ai              # pi-ai: Unified multi-provider LLM API
├── packages/agent           # pi-agent-core: Agent Runtime + Loop + Harness
├── packages/coding-agent    # pi-coding-agent: CLI Entry + Session + SDK
├── packages/tui             # pi-tui: Terminal UI Library (Differential Rendering)
├── packages/telemetry       # pi-telemetry: Vendor-neutral Telemetry Contracts
├── packages/client          # pi-client: Remote Session Client
├── packages/server          # pi-server: Remote Session Server
├── packages/protocol        # pi-protocol: JSON-RPC/WebSocket Protocol
└── packages/session-backends/*  # Session Storage Backends
```

### Package Dependencies (Simplified)

```
pi-tui (zero deps)
    ↑
pi-telemetry (zero deps)
    ↑
pi-ai ─────────────────────→ 15+ providers (OpenAI, Anthropic, Google, Azure, Bedrock, Mistral, Groq, Cerebras, xAI, HF, Ollama, OpenRouter...)
    ↑
pi-agent-core ←────────────── pi-telemetry, pi-ai
    ↑
pi-coding-agent ←──────────── pi-agent-core, pi-ai, pi-tui, pi-telemetry
    ↑                    ↑
pi-client ──────────────→ pi-protocol ←────────── pi-server
    ↑
session-backends/sqlite-node
```

### Key Design Decisions at a Glance

| Decision | Content | Rationale |
|---|---|---|
| **Language** | TypeScript (ESM, Node ≥ 22.19) | Type safety, rich ecosystem, shared types across frontend/backend |
| **Monorepo Tool** | npm workspaces + hand-written build order | Full control, zero config deps, auditable supply chain |
| **Versioning** | Lockstep versioning (all packages same version) | Avoids diamond deps, single version publish |
| **Dependency Locking** | Exact versions + `npm-shrinkwrap.json` + `min-release-age=2` | Supply-chain hardening, reproducible builds |
| **Testing** | Vitest (unit) + Faux Provider (e2e no API keys) + Browser smoke | Fast CI, no external deps, runnable locally |
| **Code Quality** | Biome (lint/format) + tsgo (type check) + pinned deps check | Single toolchain, blazing fast, no compromise |
| **Release** | Local smoke → `release:patch/minor` → CI trusted publishing → R2 marker | Zero manual intervention, npm OIDC, verifiable on publish |

---

## Core Abstraction Layers (Outside-In)

```
┌─────────────────────────────────────────────────────────────┐
│ User Interface Layer                                         │
│  ├── CLI (Interactive / Print / JSON / RPC / SDK)           │
│  ├── TUI Components (Markdown, Editor, Selector, Diff...)   │
│  └── Extension UI (Widgets, Dialogs, Custom Renderers)      │
├─────────────────────────────────────────────────────────────┤
│ Application Logic Layer                                      │
│  ├── Session Manager (Tree, Branching, Compaction, Fork)    │
│  ├── Model Registry / Resolver / Runtime (15+ providers)    │
│  ├── Extension Runtime (Hooks, Tools, Commands, Keys, UI)   │
│  └── Settings / Trust / Package Manager                     │
├─────────────────────────────────────────────────────────────┤
│ Agent Core Layer                                             │
│  ├── Agent Loop (Double While: Inner tool calls, Outer follow-up) │
│  ├── Harness (System Prompt, Skills, Compaction, Branch Summary) │
│  ├── Tool Execution (Parallel/Sequential, Before/After Hooks)    │
│  └── Telemetry (Schema-defined, Vendor-neutral)                │
├─────────────────────────────────────────────────────────────┤
│ LLM Integration Layer                                        │
│  ├── Unified API (Messages, Tools, Streaming, Thinking)     │
│  ├── Provider Factories (Lazy-loaded, Tree-shakable)        │
│  ├── Model Catalog (Auto-generated, Versioned)              │
│  └── Auth (API Key, OAuth, Credential Store, Sync)          │
├─────────────────────────────────────────────────────────────┤
│ Infrastructure Layer                                         │
│  ├── TUI Engine (Virtual DOM Diff, CSI 2026, Kitty Images)  │
│  ├── Session Storage (JSONL, Append-only, Tree Index)       │
│  ├── Protocol (JSON-RPC 2.0, WebSocket, Reconnection)       │
│  └── Telemetry Contracts (Schema, Conformance Tests)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Series Reading Map (17 Parts)

| Order | Title | Focus Question | Status | Est. Length |
|---|---|---|---|---|
| 0 | **Series Overview & Project Tour** (this post) | What is this project? How to read the series? | ✅ Published | — |
| 1 | **pi from a CLI User's Perspective** | How to install/use? 4 modes? How sessions persist? | 🔄 Writing | ~2500 words |
| 2 | **Monorepo Architecture & Core Abstractions** | How do 7 packages divide work? Why one-way deps? | ⏳ Planned | ~3000 words |
| 3 | **pi-ai: Unified Multi-Provider LLM API** | 15+ providers under one interface? Lazy loading? Unified streaming? | ⏳ Planned | ~3500 words |
| 4 | **Agent Loop: Double-Loop & Event Flow** | Why double while? Steering vs Follow-up? Interrupt handling? | ⏳ Planned | ~4000 words |
| 5 | **Session Tree: Append-only, Branching, Compaction** | Tree storage? Branching without history mutation? Compaction triggers? | ⏳ Planned | ~3500 words |
| 6 | **Tool System: Definition, Execution, Parallel/Sequential, Hooks** | Tool definition shape? Before/After hook interception? | ⏳ Planned | ~3000 words |
| 7 | **Extension System: Hooks, Custom Tools, UI Components, Lifecycle** | What can extensions do? How loaded? How access TUI? | ⏳ Planned | ~4000 words |
| 8 | **TUI Architecture: Differential Rendering, Component Tree, Layout Engine** | Flicker-free how? Virtual DOM Diff? What is CSI 2026? | ⏳ Planned | ~3500 words |
| 9 | **Model Catalog, Provider Factory, OAuth & Credential Sync** | Model data generation? Provider lazy loading? OAuth flow? | ⏳ Planned | ~3000 words |
| 10 | **Remote Session: Client/Server, Protocol, RPC, WebSocket** | Remote session sync? JSON-RPC definition? Reconnection? | ⏳ Planned | ~3000 words |
| 11 | **Telemetry: Vendor-neutral Contracts, Schema, Conformance** | Why not OpenTelemetry? Schema definition? Conformance tests? | ⏳ Planned | ~2500 words |
| 12 | **Compaction Deep Dive: Strategy, Token Estimation, Branch Summary, Structured Compaction** | Token estimation? Cut point finding? Extension customization? | ⏳ Planned | ~3500 words |
| 13 | **Agent Harness, Skills, System Prompt Assembly** | System prompt composition? Skills loading? Prompt templates? | ⏳ Planned | ~2500 words |
| 14 | **Testing, Quality Gates, Supply-chain Hardening** | Faux provider? Browser smoke? Pinned deps? Shrinkwrap? | ⏳ Planned | ~3000 words |
| 15 | **Containerization, Sandbox, Permission Model** | Gondolin? Docker? OpenShell? Why no built-in permission? | ⏳ Planned | ~2500 words |
| 16 | **Release Process, Lockstep Versioning, Binary Build, Trusted Publishing** | Single version publish? Binary build? npm OIDC flow? | ⏳ Planned | ~3000 words |

### Suggested Reading Orders

```
Beginner/User perspective: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7
Architect/Contributor perspective: 0 → 2 → 4 → 5 → 6 → 7 → 8 → 3 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16
Topic-driven: Each part notes `Prerequisite: read order X first`, jump as needed
```

---

## Cliff Handling: Bridging Cognitive Jumps

| Position | Cognitive Jump | Bridge Strategy |
|---|---|---|
| 1→2 | From "how to use" to "why architected this way" | Part 1 ends with "Architecture Preview", Part 2 opens by revisiting user pain points |
| 3→4 | From LLM API to Agent Loop | Part 3 ends showing `streamFunction` signature, Part 4 continues with how `runLoop` calls it |
| 5→6 | From Session to Tool | Part 5 mentions `toolResult` entering session, Part 6 starts from `executeToolCalls` |
| 7→8 | From Extension API to TUI internals | Part 7 shows `ExtensionUIDialogOptions`, Part 8 dissects `DialogComponent` implementation |
| 10→11 | From network protocol to Telemetry | Part 10 ends mentioning `telemetry` binding, Part 11 explains why custom Schema |
| 12→13 | From Compaction details to Harness assembly | Part 12 ends "Harness decides when to trigger", Part 13 continues with `shouldCompact`, `prepareCompaction` |

---

## On-Site Prerequisite Links (Reference When Needed)

| Topic | On-Site Guide |
|---|---|
| LLM Basics, Token, Context Window | [LLM Glossary](/search?q=LLM&mode=rag) |
| RAG / Embedding / Vector Search | [Complete Guide to RAG System Patterns](/posts/ai/2026-03-14-rag-patterns-complete-guide-en) |
| AI Agent Architecture Patterns | [Complete Guide to AI Agent Architecture](/posts/ai/2026-03-18-ai-agent-patterns-guide-en) |
| MCP Protocol | [MCP Protocol Complete Introduction](/posts/ai/2026-03-22-mcp-model-context-protocol-en) |
| Cloudflare Workers / D1 / Vectorize | [Cloudflare Workers Complete Introduction](/posts/tech/2026-03-27-cloudflare-workers-edge-compute-en) |
| TypeScript / ESM / tsgo | [TypeScript 7 Native Compiler](/posts/tech/2026-08-22-typescript-7-native-en) |
| Differential Rendering / Virtual DOM | [Rivumi TUI Architecture](/posts/tech/2026-08-23-rivumi-tui-cli-ergonomics-en) |

---

## How to Follow Along Hands-On

Each part ends with **actionable steps**:

```bash
# Example: Part 1 ending
# 1. Install and run
npm install -g @earendil-works/pi-coding-agent
pi --help

# 2. Run local model via Ollama
ollama pull qwen3:1.7b
pi -p "Say hello world in traditional Chinese" --model ollama:qwen3:1.7b

# 3. Inspect session file
cat ~/.pi/agent/sessions/--your-cwd--/latest.jsonl
```

Recommended setup:
- Node.js ≥ 22.19
- `pi` CLI installed (or `./pi-test.sh` from source)
- A Git repo project directory (for session, tools, git integration testing)
- Optional: Ollama / API Keys (Anthropic, OpenAI, etc.)

---

## References

- [Pi Official Website pi.dev — coding agent architecture & docs](https://pi.dev/)
- [GitHub - earendil-works/pi — pi-mono monorepo source code](https://github.com/earendil-works/pi)
- [Pi Author Blog: Building a Minimal Coding Agent — Mario Zechner design philosophy](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- [Mario Zechner Talk: Building pi in a World of Slop (AI Engineer) — minimalist agent design](https://www.youtube.com/watch?v=RjfbvDXpFls)
- [npm - @earendil-works/pi-coding-agent — package publish page](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)
- [Previous Pi Introduction: Pi Coding Agent: Minimalist Open-Source Terminal Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) — includes OpenClaw/omp relationship

---

## Next Up

> **Part 1: pi from a CLI User's Perspective**
>
> Install, run, switch modes, persist sessions, view tree, export HTML, interject messages. Turn the "black box" into a "glass box" to build intuition for the architecture parts that follow.