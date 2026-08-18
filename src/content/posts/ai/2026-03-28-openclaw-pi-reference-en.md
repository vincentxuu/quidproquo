---
title: "OpenClaw Reference: Pi Has Been Absorbed — the Built-In Runtime Is Just Called openclaw Now"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, agent-runtime, architecture, pi, harness, plugin-sdk]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 32
tldr: "\"OpenClaw is a Gateway shell around Pi\" is obsolete. The docs now say the built-in runtime id is openclaw, that pi is a legacy alias which normalizes to it, and that no external agent framework packages remain. The only Pi-related third-party dependency left is a terminal component toolkit."
description: "OpenClaw's agent runtime architecture: the built-in runtime's module layout and boundaries, runtime selection rules, model runtime generations as atomic snapshots, and resource package manifests."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-pi-reference)

This article used to be about "Pi integration architecture" — OpenClaw embedding a coding agent runtime called Pi, with OpenClaw as its Gateway shell.

**That framing no longer holds.**

## The big change: Pi was absorbed into core

The page is now titled **"Agent runtime architecture"**, and its first line is: **OpenClaw owns the built-in agent runtime.**

The runtime selection section says it directly:

> The built-in runtime id is **`openclaw`**. **The legacy alias `pi` normalizes to `openclaw`**; `codex-app-server` normalizes to `codex`.

The boundaries section is even clearer:

> Core calls the built-in runtime through OpenClaw modules and SDK barrels; **no external agent framework packages remain.**

The only Pi-related third-party dependency still present is `@earendil-works/pi-tui` — **a terminal component toolkit** used by the local TUI and session tool renderers. The docs list internalizing it as a separate effort.

So the correct statement now is: **Pi is not a layer you need to understand.** If you see the `pi` runtime id in old config or old notes, it normalizes away — nothing breaks, but it does not mean something called Pi is still running in there.

## The built-in runtime's module layout

| Path | Owns |
|---|---|
| `src/agents/embedded-agent-runner/` | The built-in attempt loop, model selection and provider normalization, per-provider request params, compaction, transcript and session wiring |
| `src/agents/sessions/` | Session persistence, resource discovery, in-session `extensions` loading, prompt templates, skills, themes, TUI-backed tool renderers |
| `packages/agent-core/` | The reusable agent core (`@openclaw/agent-core`): agent loop, harness types, messages, compaction helpers, prompt templates, skills, session storage contracts |
| `src/agents/runtime/` | The facade wiring `@openclaw/agent-core` to the plugin SDK LLM runtime |
| `src/agents/agent-tools*.ts` | OpenClaw-owned tool definitions, parameter schemas, tool policy, before/after tool-call adapters, host and sandbox edit tools |
| `src/agents/agent-hooks/` | Built-in runtime hooks: compaction safeguard, compaction instructions, context pruning |
| `src/agents/harness/` | Harness registry, selection policy, lifecycle |
| `src/llm/` | Model and provider registry, transport helpers, provider-specific stream implementations |

One boundary rule worth knowing: **plugins use documented `openclaw/plugin-sdk/*` entrypoints and do not import `src/**` internals.** Standard practice, but writing it into the architecture doc suggests they actually enforce it.

## The full runtime selection rules

Fragments of this appeared in the models article; here is the complete set:

- The built-in runtime id is `openclaw`; plugin harnesses register additional ids (such as `codex`)
- Runtime policy is **model/provider-scoped `agentRuntime.id` config**, and **a model entry wins over a provider entry**
- Unset or `default` resolves to `auto`
- **`auto` selects a registered plugin harness supporting the effective provider route, otherwise the built-in OpenClaw runtime**
- **A provider or model prefix alone never selects a harness**
- OpenAI may select `codex` implicitly only for an exact official HTTPS Platform Responses or ChatGPT Responses route with no authored request override; Completions adapters, custom endpoints, and authored request behavior stay on `openclaw`, and **plaintext official HTTP endpoints are rejected**

## Model runtime generations: one atomic snapshot

The most engineering-interesting section on the page, and absent from the March version.

**Gateway startup — and config, plugin, or auth publication — builds one prepared model runtime generation per configured agent.** Each generation owns the discovered auth template, model registry, and projected model catalog **as one atomic snapshot**.

The effect splits two ways:

- **Agent runs fork mutable auth and registry stores from that snapshot**
- **Browse, status, cron, doctor, TUI, PDF, and image paths read the published catalog** instead of repeating filesystem discovery

Plus a consistency guarantee: **a failed or stale generation is never served alongside a newer partial generation** — the lifecycle owner must publish a complete replacement first.

This solves a very real problem: **during a config change, different parts of the system see inconsistent model catalogs.** Whole-snapshot replacement rather than incremental updates is an old distributed-systems move applied to single-host configuration.

## Resource package manifests

Resource packages declare OpenClaw resources in `package.json` metadata, as file paths or globs relative to the package root:

```json
{
  "openclaw": {
    "extensions": ["extensions/index.ts"],
    "skills": ["skills/*.md"],
    "prompts": ["prompts/*.md"],
    "themes": ["themes/*.json"]
  }
}
```

**Resource types not listed in a manifest fall back to discovery of the conventional directories** (`extensions/`, `skills/`, `prompts/`, `themes/`).

Relatedly, one install failure symptom from the plugins article ties in here: **`package.json missing openclaw.extensions`** means a package uses a shape OpenClaw no longer accepts, and needs `openclaw.extensions` pointing at built runtime files.

## The big picture

What to take away is not the architecture diagram but **the retirement of an old mental model**: stop thinking of OpenClaw as a shell around Pi. The built-in runtime is OpenClaw's own, and the Pi name survives only as a legacy id that normalizes away and a third-party terminal UI package.

This is also where reading the docs of a fast-moving project goes wrong most easily: **architectural nouns expire more quietly than APIs do**, because they never throw an error in your config — they just let your understanding drift from reality.

## Changelog

- 2026-08-18: **Substantially rewritten with a changed subject**, against the current official docs. The original's central framing — "Pi is OpenClaw's embedded coding agent runtime and OpenClaw is its Gateway shell" — is obsolete: the page is now "Agent runtime architecture", **the built-in runtime id is `openclaw`, `pi` is a legacy alias that normalizes away, and no external agent framework packages remain**, with only `@earendil-works/pi-tui` left as a third-party terminal component toolkit. Added: the built-in runtime's module layout and the rule that plugins do not import `src/**`, **the complete runtime selection rules** (model entries beating provider entries, how `auto` resolves, prefixes never selecting a harness), **model runtime generations as atomic snapshots** (forked mutable stores, other paths reading the published catalog, no stale-alongside-partial serving), and resource package manifests with the `openclaw.extensions` install symptom.

## References

This article draws on the following official OpenClaw documentation:

- [Agent runtime architecture](https://docs.openclaw.ai/pi) — module layout, runtime selection, model runtime generations
- [Agent runtimes](https://docs.openclaw.ai/concepts/agent-runtimes) — the provider/model/runtime layering
- [Plugin SDK](https://docs.openclaw.ai/plugins/sdk-overview) — legitimate plugin entrypoints
- [Plugin architecture](https://docs.openclaw.ai/plugins/architecture) — `openclaw.extensions` and the plugin execution model
- [Configuration reference](https://docs.openclaw.ai/gateway/configuration-reference) — the full field map
