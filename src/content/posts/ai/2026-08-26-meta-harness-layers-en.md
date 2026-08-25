---
title: "Same Name, Different Layer: meta-harness, ACP, HarnessAgent and Flue"
date: 2026-08-26
category: ai
type: deep-dive
tags: [meta-harness, acp, harness-engineering, ai-agent, agent-orchestration, mcp]
lang: en
tldr: "meta-harness means two things: Databricks' control plane and Stanford's outer-loop optimizer. This post uses a four-layer model (MCP/ACP/Runtime/meta-harness) to place Omnigent, Zed ACP, Vercel HarnessAgent and Cloudflare Flue."
description: "Disambiguating meta-harness in 2026: with Omnigent as anchor, compare Zed ACP, Vercel HarnessAgent and Cloudflare Flue across protocol/SDK/runtime layers, and separate Stanford's outer-loop optimizer."
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 2
glossary:
  - term: "ACP"
    aliases: ["Agent Client Protocol"]
    definition: "Zed 提出的 Agent Client Protocol，讓任何 agent 接任何 editor 的開放協議，定位類似 LSP。"
    definition_en: "Agent Client Protocol by Zed — an open protocol that lets any agent work with any editor, analogous to LSP."
    links:
      - label: "Zed ACP"
        url: "https://agentclientprotocol.com/"
  - term: "HarnessAgent"
    definition: "Vercel AI SDK 7 的 SDK 層抽象，讓你在 TypeScript 程式碼中以統一 API 切換不同 harness。"
    definition_en: "Vercel AI SDK 7's SDK-layer abstraction for swapping harnesses via a unified API in TypeScript."
    links:
      - label: "Vercel HarnessAgent"
        url: "https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer"
---

> 🌏 [中文版](/posts/ai/2026-08-26-meta-harness-layers)

The previous post on [Omnigent's meta-harness](/posts/ai/2026-08-26-omnigent-meta-harness-en) used "a layer above harnesses" repeatedly. The same week, Stanford published a paper also called [Meta-Harness](https://arxiv.org/abs/2603.28052) meaning "an outer loop that rewrites harness code". Meanwhile [Zed ACP](https://agentclientprotocol.com/), [Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) and [Cloudflare Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) all shipped. Easy to conflate four battles into one.

This post places them on a four-layer map and shows why most are complementary.

## Align the term: two meta-harnesses

| Usage | What it means | Examples |
|---|---|---|
| **Control plane** (Databricks) | Unified access, scheduling and governance above harnesses | [Omnigent](https://github.com/omnigent-ai/omnigent), [loopx](https://github.com/huangruiteng/loopx) |
| **Outer-loop optimizer** (Stanford) | Search for better harness code with an agent | [stanford-iris-lab/meta-harness](https://github.com/stanford-iris-lab/meta-harness), [SuperagenticAI/metaharness](https://github.com/SuperagenticAI/metaharness) |

"meta-harness" below means the first; the second is explicitly called "Stanford meta-harness (optimizer)".

## Four layers: MCP / ACP / Runtime / meta-harness

Borrowing [codepick's guide](https://codepick.dev/en/guides/meta-harness-2026/):

```
You
 │
 ├─ meta-harness  you ↔ many full agents (Omnigent, loopx, mission-control)
 ├─ ACP           agent ↔ editor (Zed ACP)
 ├─ Runtime       single agent execution/recovery/isolation (Cloudflare Agents SDK)
 └─ MCP           agent ↔ tools/data (Anthropic MCP)
```

- **MCP** = how an agent calls tools (inside each harness)
- **ACP** = how an editor connects to an agent (any agent ↔ any editor)
- **Runtime** = how a single agent runs reliably (durable execution, hibernation)
- **meta-harness** = how you manage many agents (swap harnesses, govern, share)

Mnemonic: **MCP owns tools, ACP owns access, Runtime owns execution, meta-harness owns you ↔ many agents**.

## Where each project sits

### Omnigent — reference control plane

Covered in depth in part 1: `Runner + Server + Omnibox`, common API `messages/files in → streams/tool calls out`, three-layer Policies, 10 cloud sandboxes. Value is composition + control + collaboration at once.

### Zed ACP — LSP for agents

[Zed ACP](https://agentclientprotocol.com/) standardizes the protocol — JSON-RPC over stdio, editors (Zed, JetBrains, Neovim, Emacs) and agents (Cline, Cursor, Gemini CLI, OpenCode, Goose) each implement an adapter, with an [ACP Registry](https://agentclientprotocol.com/) for `implement once, work everywhere`.

Complementary to Omnigent: ACP solves access, Omnigent solves scheduling/governance. Stack as `ACP → Omnigent → MCP`.

### Vercel HarnessAgent — swap harnesses in code

[Vercel AI SDK 7's HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) extends "swap models without rewriting" to harnesses:

```ts
import { HarnessAgent } from '@ai-sdk/harness/agent';
import { createClaudeCode } from '@ai-sdk/harness-claude-code';
const agent = new HarnessAgent({ harness: createClaudeCode() });
```

The new `@ai-sdk/harness-acp` is a meta-adapter over the ACP protocol so any ACP-compatible harness can be driven via `HarnessAgent`. Use direct adapters for Claude Code/Codex, ACP for the rest.

Difference to Omnigent: Vercel swaps **in code**, Omnigent swaps **in YAML + Server**. Former suits product embedding, latter suits team control plane.

### Cloudflare Flue + Dynamic Workflows — cloud scale

[Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) on [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/) (Durable Objects) plus ~300-line MIT [Dynamic Workflows](https://github.com/cloudflare/dynamic-workflows) argues for tens of millions of concurrent sessions with hibernation. Flue's model is "describe the context an agent needs, not the loop". Each Flue agent is a Durable Object with `runFiber`/`stash`/`onFiberRecovered`.

Omnigent can use Flue/Cloudflare as a host; Flue turns harnesses into horizontally scalable services.

### Conductor — desktop lightweight

[Conductor](https://www.conductor.build/) (Melty Labs, closed Mac app) gives each agent a git worktree and runs Claude Code/Codex in parallel on one dashboard — the single-machine simplified form of the meta-harness idea, ideal for validating "does parallelism actually help?" before adopting Omnigent.

## Common misjudgments

- **MCP vs meta-harness** — not a choice; MCP is inside the harness, meta-harness above it.
- **Omnigent vs ACP** — different layers; governance vs access.
- **Stanford meta-harness vs Omnigent** — same name, different meaning; one rewrites harness code, one governs many harnesses.

## Next

Four layers are stabilizing. The combination worth borrowing: **Omnigent's Runner/Server/Policy + ACP's protocol + Flue's hibernation + Vercel's in-code switch**. Next post implements the same task (Polly's `parallel worktree + cross-vendor review`) four ways: Omnigent YAML vs LangGraph vs CrewAI vs Goose.

## References

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [Introducing Omnigent — Databricks Blog](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
- [Zed Agent Client Protocol](https://agentclientprotocol.com/)
- [Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer)
- [Cloudflare Flue + Dynamic Workflows](https://blog.cloudflare.com/agents-platform-flue-sdk/)
- [Meta-Harness: End-to-End Optimization of Model Harnesses — arXiv:2603.28052](https://arxiv.org/abs/2603.28052)
