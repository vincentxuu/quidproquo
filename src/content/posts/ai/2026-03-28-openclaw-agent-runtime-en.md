---
title: "OpenClaw Agent Runtime: The System Prompt Is Assembled, and a Cache Boundary Cuts It in Half"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, system-prompt, workspace, bootstrap, prompt-cache, sub-agents]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 10
tldr: "OpenClaw builds its own system prompt for every run; there is no runtime default prompt. What it builds is split by an internal cache boundary — the stable workspace prefix above, the per-turn channel context below — so backends with prefix caches can reuse the same prefix across channels."
description: "The three-layer assembly of OpenClaw's system prompt, the three named sections providers may contribute plus the cache boundary, the prompt's fixed structure, guidance for long-running work and sub-agent delegation, and the line that prompt guardrails are advisory rather than enforcement."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-agent-runtime)

The previous article covered multi-agent boundaries. This one covers **what the model actually sees on a single agent's run**.

The opening line is worth memorizing: **OpenClaw builds its own system prompt for every agent run; there is no runtime default prompt.**

## Three layers of assembly

| Layer | Responsibility |
|---|---|
| `buildAgentSystemPrompt` | Renders the prompt from explicit inputs. **It stays a pure renderer and does not read global config directly** |
| `resolveAgentSystemPromptConfig` | Resolves config-backed knobs (owner display, TTS hints, model aliases, memory citation mode, sub-agent delegation mode) |
| Runtime adapters | Gather live facts (tools, sandbox state, channel capabilities, context files, provider contributions) and call the configured prompt facade |

The reason for three layers is practical: **it keeps exported and debug prompt surfaces aligned with live runs** without collapsing every runtime detail into one monolithic builder. The prompt you see while debugging comes off the same assembly path as the real thing.

## Providers may contribute, not replace

Provider plugins can add cache-aware guidance **without replacing the OpenClaw-owned prompt**, in three ways:

- Replace one of three named core sections: `interaction_style`, `tool_call_style`, `execution_bias`
- Inject a **stable prefix** above the prompt cache boundary
- Inject a **dynamic suffix** below it

The docs are explicit: **use provider-owned contributions for model-family tuning, and reserve the legacy `before_prompt_build` hook for compatibility or truly global changes.**

The built-in GPT-5 family contribution works exactly this way: a `stablePrefix` behavior contract (execution policy, tool discipline, output contract, completion contract) plus an optional `interaction_style` override for a friendlier tone. `plugins.entries.openai.config.personality` governs that tone layer — `"friendly"` is the default and `"off"` **removes only the friendly override, leaving the behavior contract intact**.

## The cache boundary is the point

The prompt is split by an **internal cache boundary**, and the split is deliberate:

**Above (stable)**: large stable content, including **Project Context**.

**Below (volatile per turn)**: Control UI embed guidance, **Messaging**, Collapsible Details, **Voice**, **Group Chat Context**, Reactions, **Heartbeats**, **Runtime**.

The goal is letting local backends with prefix caches **reuse the same stable workspace prefix across channel turns** — talk on Telegram and on Slack and the prefix is identical, with only the tail differing.

There is a related implementation note: **tool descriptions should not hardcode the current channel name**, since the accepted schema already carries that runtime detail. Embedding it turns something stable into something that changes every turn.

One clarification: **the boundary is internal transport metadata** — every section is still system-prompt guidance as far as CLI backends are concerned.

## The prompt's fixed structure

| Section | Content |
|---|---|
| Tooling | Structured tools as source of truth, plus runtime tool-use guidance |
| Execution Bias | Act in-turn on actionable requests, continue until done or blocked, recover from weak tool results, check mutable state live, verify before finalizing |
| **Promised Work** | Promising future, background, delegated, or continued work **creates follow-through ownership**: arrange a push-based completion or watch path before ending the turn, proactively return with the result or a concrete blocker, and **never treat progress (like `running`) as completion** |
| Safety | A short guardrail reminder against power-seeking or bypassing oversight |
| Skills | How to load skill instructions on demand |
| OpenClaw Control | Prefer the `gateway` tool for config and restart work; **do not invent CLI commands** |
| OpenClaw Self-Update | Inspect with `config.schema.lookup`, patch with `config.patch`, replace with `config.apply`, run `update.run` only on explicit request. **The agent-facing `gateway` tool refuses to rewrite `tools.exec.mode`** |
| Workspace / Documentation | Working directory, local docs and source paths |
| Sandbox | When enabled: sandboxed runtime, sandbox paths, elevated-exec availability |
| Temporal Context | Local date and time zone (below the boundary); **exact time comes from `session_status`** |
| Runtime / Reasoning | Host, OS, node, model, repo root, thinking level; current reasoning visibility and the `/reasoning` hint |

"Promised Work" is the design I would steal. It addresses one of the most common agent failure modes — **saying "I'll report back" and then vanishing**. Writing "a promise creates ownership" into the system prompt, and explicitly forbidding treating `running` as done, beats scolding the model afterward.

## Guidance for long-running work

The Tooling section carries a concrete set of rules, effectively the official answer to "how should an agent wait":

- **Use cron for future follow-up** ("check back later", reminders, recurring work) — **not `exec` sleep loops, `yieldMs` delay tricks, or repeated `process` polling**
- Use `exec` / `process` only for commands that **start now and continue in the background**
- With automatic completion wake enabled, **start the command once** and rely on the push-based wake path
- Use `process` for logs, status, input, or intervention on a running command
- **For larger tasks prefer `sessions_spawn`** — sub-agent completion is push-based and auto-announces back to the requester
- **Do not poll `subagents list` / `sessions_list` in a loop just to wait**

Together these say one thing: **polling is an agent anti-pattern**, because it turns waiting into token spend.

## Delegation mode and ultra-level orchestration

`agents.defaults.subagents.delegationMode` defaults to `"suggest"`. Setting `"prefer"` adds a dedicated **Sub-Agent Delegation** section telling the main agent to act as a responsive coordinator and **push anything more involved than a direct reply through `sessions_spawn`**.

An important line here: **this is prompt-only — tool policy still controls whether `sessions_spawn` is available at all.**

And at the **`ultra` thinking level** with `sessions_spawn` available, a **Proactive Sub-Agent Orchestration** section is added: parallelize independent investigation, implementation, and verification; keep simple or tightly coupled work local; **give each sub-agent a bounded objective**; synthesize before replying.

## Guardrails are advisory, not enforcement

The docs state this without hedging, and it is worth quoting as written:

> Safety guardrails in the system prompt are **advisory, not enforcement**. Use tool policy, exec approvals, sandboxing, and channel allowlists for hard enforcement; **operators can disable prompt guardrails by design.**

That is the same posture as the threat model article — keep "persuading the model" and "blocking it mechanically" separate, and never let the former masquerade as the latter.

## The big picture

Three takeaways: **the prompt is assembled** (so what you see while debugging is real), **it is split by a cache boundary into stable and volatile halves** (so don't hardcode channel names into tool descriptions), and **the guardrails written into it are only advisory** (so real limits live in tool policy and sandboxing).

If I could keep only one design from this page it would be "Promised Work" — it turns "don't say it if you won't do it" into an explicit contract in the prompt, rather than a habit you hope the model has.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **the three-layer prompt assembly** (pure renderer / config resolution / runtime adapters) and why it keeps debug surfaces aligned with live runs, **the three named sections providers may contribute plus stable-prefix and dynamic-suffix injection** (including the GPT-5 family contribution and `personality` affecting only the tone layer), **how the cache boundary splits the prompt** and the advice against hardcoding channel names into tool descriptions, the full section structure (including **Promised Work**'s follow-through contract and the `gateway` tool refusing to rewrite `tools.exec.mode`), **the long-running-work guidance** (cron instead of sleep loops, no polling to wait), `delegationMode` and the ultra-level Proactive Sub-Agent Orchestration section, and the explicit line that prompt guardrails are advisory rather than enforcement.

## References

This article draws on the following official OpenClaw documentation:

- [System prompt](https://docs.openclaw.ai/concepts/system-prompt) — assembly, structure, cache boundary, delegation guidance
- [Agent loop](https://docs.openclaw.ai/concepts/agent-loop) — when bootstrap and skills are injected
- [Multi-agent routing](https://docs.openclaw.ai/concepts/multi-agent) — workspace and agentDir paths
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — the sandbox section and elevated exec
- [Skills](https://docs.openclaw.ai/tools/skills) — on-demand skill instructions
