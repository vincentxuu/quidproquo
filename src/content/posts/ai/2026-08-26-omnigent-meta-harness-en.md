---
title: "Managing Multiple Agents Together: Omnigent's Meta-Harness, Policies, and Cross-Device Sessions"
date: 2026-08-26
category: ai
type: deep-dive
tags: [omnigent, ai-agent, multi-agent, claude-code, mcp, sandbox]
lang: en
tldr: "Databricks' open-source Omnigent wraps Claude Code, Codex, Cursor, Pi and custom agents in a Runner/Server + Omnibox sandbox, adding three-layer Policies and shareable persisted Sessions so you can swap models and harnesses with one-line changes — 9.3k stars, still alpha."
description: "Deep dive into Databricks' Omnigent meta-harness open-sourced on 2026-06-13: why a layer above harnesses is needed, Runner/Server/Omnibox architecture, YAML custom agents and Polly/Debby examples, contextual Policies, sandboxing and a GitHub landscape scan."
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 1
glossary:
  - term: "meta-harness"
    aliases: ["meta harness"]
    definition: "位於單一 agent harness 之上的共通治理層，統一多個 harness 的接入、排程、權限與協作。"
    definition_en: "A control plane above individual agent harnesses that unifies access, scheduling, permissions and collaboration across multiple harnesses."
    advanced: "Omnigent 的 meta-harness 以 Runner/Server 分離與共通 API 讓 Claude Code、Codex、Pi 等可在同一 session 中替換與協作。"
    advanced_en: "Omnigent's meta-harness uses a Runner/Server split and a common API to let Claude Code, Codex, Pi, etc. be swapped and composed in the same session."
    context: "本文以 Omnigent 作為 meta-harness 的參考實作，對照 ACP、HarnessAgent 等協議/SDK 層。"
    context_en: "This post uses Omnigent as the reference implementation of a meta-harness, contrasted with protocol/SDK layers like ACP and HarnessAgent."
    links:
      - label: "Omnigent website"
        url: "https://omnigent.ai/"
      - label: "Databricks Blog: Introducing Omnigent"
        url: "https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents"
  - term: "Omnibox"
    definition: "Omnigent 的 OS 層沙盒，以 Linux bwrap、macOS seatbelt 與 Windows Job Object 提供檔案與網路隔離，並透過 egress proxy 代理憑證。"
    definition_en: "Omnigent's OS-level sandbox using Linux bwrap, macOS seatbelt and Windows Job Objects for filesystem/network isolation with egress-proxy credential brokering."
    links:
      - label: "Omnibox docs"
        url: "https://omnigent.ai/docs/policies/os-sandbox"
---

> 🌏 [中文版](/posts/ai/2026-08-26-omnigent-meta-harness)

Running 4 or 5 agents at once is now normal: [Claude Code](https://code.claude.com/) editing code, [Codex](https://developers.openai.com/codex) running tests, [Cursor](https://cursor.com/) completing in the editor, plus a custom data-analysis agent. The pain is not whether the model is smart enough, but that every harness is an island — its own sessions, permissions and history. Switching tools means re-explaining context, resetting guardrails and copy-pasting again.

[Omnigent](https://github.com/omnigent-ai/omnigent) ([omnigent.ai](https://omnigent.ai/)) is the **meta-harness** Databricks open-sourced on 2026-06-13 at [Data + AI Summit](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents) under Apache 2.0. As of 2026-08-26 it has ~9.3k stars / 1.4k forks / 2,838 commits at `0.11.0.dev0` (alpha). It does not replace your harness — it sits above them so sessions, policies and skills travel with you. [Claude Code](https://code.claude.com/), [Codex](https://developers.openai.com/codex), [Cursor](https://cursor.com/), [OpenCode](https://opencode.ai/), [Hermes](https://github.com/NousResearch/hermes-agent), [Pi](https://github.com/badlogic/pi-mono) and your own YAML-defined agents can be swapped with one-line changes and live in the same shareable session.

This post covers the design rationale, architecture, hands-on usage and the GitHub landscape around it.

## What Omnigent solves: harness fragmentation

Databricks puts it bluntly:

> Each harness is its own silo, with its own context, its own controls, and its own way of running, and none of it carries over when you switch tools.

In practice that is three cross-harness problems:

1. **Composition**: one agent definition should run on Claude today and Codex tomorrow, or mix sub-agents from different harnesses without rewriting.
2. **Control**: guardrails like "can it `git push`?" or "stop after $X spent?" should be auditable and not live inside prompts.
3. **Collaboration**: a live agent session should be shareable via URL so teammates can watch, comment and even take over execution.

A single harness cannot solve all three, so the layer has to move up — the Kubernetes-for-containers analogy Databricks uses.

## Architecture: Runner for execution, Server for governance

```
[You] ── terminal / browser / phone / desktop app / REST API
          │
     ┌────▼────┐
     │ Server  │  persisted session history (Postgres/SQLite), MCP proxy,
     │         │  policy enforcement, auth/OIDC, skill/agent registry, WebSocket sync
     └────┬────┘
          │ WebSocket
     ┌────▼────┐
     │ Runner  │  actually runs harnesses & tools (inside bwrap/seatbelt),
     │ (host)  │  inference & credentials stay on the host
     └─────────┘
  laptop / devbox / K8s Pod / Modal / Daytona / E2B / Blaxel / Databricks sandbox
```

The key decision is **Runner / Server split without splitting brain and hands**. The Server only coordinates; the Runner on your chosen host runs harnesses and shells. Inference and API keys never go to the Server. Two immediate payoffs:

- **Resumable and shareable sessions**: close the laptop, the session stays on the Server; open `http://your-host` on your phone and continue the same chat, sub-agents, terminals and files.
- **Multi-surface sync**: terminal, web and desktop app see the same session, with messages and files synced in real time and comments fed back to the agent.

The common API is intentionally small: `messages/files in → text streams/tool calls out + cancel`. It wraps both "terminal harnesses" (Claude Code, Codex, Pi) and "SDK harnesses" (Claude Agent SDK, OpenAI Agents SDK). New harnesses are plugins — Atlassian's Robo harness is an external example.

## How to use it: an agent is a YAML file

Minimal custom agent ([Agent YAML spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)):

```yaml
name: my_agent
prompt: You are a helpful data analyst.

executor:
  harness: claude-sdk   # one-line switch: claude-native / codex / cursor-native / hermes / pi / opencode / openai-agents ...

tools:
  word_count:
    type: function
    callable: mypackage.mymodule.word_count

  docs:
    type: mcp
    url: https://example.com/mcp

  researcher:
    type: agent
    prompt: Search for relevant information and summarize it.
    tools:
      word_count: inherit
```

Three takeaways:

- **`tools` has three kinds**: `function` (local Python, schema auto-generated), `mcp` (MCP server), `agent` (another full agent as a tool, even on a different harness).
- **One-line harness switch**: `executor.harness` or `omnigent run path/to/agent.yaml --harness <harness>`.
- **Start**: locally `omnigent claude` / `omnigent codex` / `omnigent run examples/polly/`, or `omnigent start` then open `http://localhost:6767` and pick a host.

### The three shipped examples — copy the third

- **🐙 Polly**: multi-agent coding orchestrator that writes no code itself — it plans, delegates to Claude Code/Codex/Pi sub-agents in parallel git worktrees, then routes diffs to a reviewer from a different vendor than the author.
- **🟠🔵 Debby**: two-headed debate — same question to Claude and GPT side by side, with `/debate` for cross-critique.
- **🔎 Deep Research**: single agent + one MCP search server; plans sub-queries, fetches full pages and cross-checks claims. **Simplest to copy.**

### Models and hosts

```bash
omnigent setup
```

Four credential kinds are first-class: API key, Claude Pro/Max or ChatGPT subscription (via official CLI login), Gateway ([OpenRouter](https://openrouter.ai/), LiteLLM, Ollama, vLLM, Azure), and Databricks workspace (`databricks` extra). Per-harness defaults coexist and `/model` switches mid-session.

Deploy via `docker compose up` or one-click to Render/Railway/Fly.io/Hugging Face Spaces/Modal/Cloudflare/Databricks Apps, or expose your laptop via Cloudflare Tunnel / Tailscale. The Server can also provision a cloud sandbox per session (managed hosts).

## The real differentiator: Policies and Omnibox

Omnigent moves governance out of prompts and into **server-side tool-hook interception**. Policies are Python functions that see the whole session (what was already read + what is requested) and return `allow` / `deny` / `ask`.

```yaml
policies:
  approve_shell:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools
  cap_calls:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params: { limit: 50 }
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params: { max_cost_usd: 5.00, ask_thresholds_usd: [3.00] }
```

Three levels stack: `server-wide (admin)` / `per-agent (developer)` / `per-session (you)`, strictest wins. Cost budgets (soft warning + hard cap), tool-call caps and sandbox enforcement share the same path. Toggle in the web UI or just ask in chat: "add a policy that asks before shell commands."

Sandboxing is two-layered:

- **Omnibox OS layer**: Linux `bubblewrap` (`bwrap`), macOS `seatbelt`, with `write_paths`/`read_paths`, `allow_network`, `env_passthrough`, HTTP `egress_rules` and **credential proxy** that hides GitHub tokens and only injects them at the egress proxy for allowed requests.
- **Cloud sandbox layer**: Modal, Daytona, Blaxel, Islo, E2B, CoreWeave, Kubernetes, OpenShell, Boxlite, Databricks — one isolated env per session, stays alive after you close the laptop.

Windows is degraded (Job Objects for process-tree isolation only, no FS/network isolation — use WSL).

## Who Omnigent governs: a harness panorama

Omnigent governs **single harnesses**. A representative sample — shown together to avoid singling one out:

- [Block/Goose](https://github.com/aaif-goose/goose) (51k, Rust, AAIF) — most neutral, 40+ providers, ideal to illustrate why neutral governance matters.
- [OpenCode](https://opencode.ai/) — natively supported as `opencode` in Omnigent, lightweight BYOK, ideal for "one-line switch".
- [Pi (badlogic/pi-mono)](https://github.com/badlogic/pi-mono) — minimal harness and the base of Cloudflare Flue, showing how a small harness is amplified.
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`, preview 2026-08-25, MIT, 165k) — `Everything is a Plugin` ([Cordis](https://github.com/cordiverse/cordis)), even UI is a plugin, the extreme of single-harness plasticity.

All are peers to [Claude Code](https://code.claude.com/) / [Codex](https://developers.openai.com/codex) (model + harness = agent); Omnigent is the **meta-harness above**. Their models already work via Omnigent Gateways and they can be wrapped as `harness: goose/opencode/pi/deepseek`.

## ADE (Agentic Development Environment): control plane vs workspace

ADE is now a category, not a single product. The most representative is [arul28/ADE](https://github.com/arul28/ADE) (`Your workspace for every AI coding agent — macOS, Windows, iOS, and CLI all synced`), with siblings Kadro ADE, Orca, [per-simmons/damon-ade](https://github.com/per-simmons/damon-ade) and DCENT_ADE.

One-liner: **Omnigent = control plane**, `Runner + Server + Omnibox + Policy` turning many harnesses into swappable, governable services; **ADE = workspace**, `Brain + Desktop/Web/Mobile + Lane/worktree + PR` turning many agents into a parallel, viewable development environment.

| Dimension | Omnigent | ADE (arul28/ADE) |
|---|---|---|
| Architecture | Server (persisted sessions / Policy / MCP proxy / DB) + Runner (actually runs harnesses on laptop/K8s/Modal hosts) | Brain (persistent daemon owning project catalog + sync websocket) + 4 UIs (Desktop/Electron, Web, Terminal `ade code`, iOS) |
| Sync | WebSocket from Server to terminal/browser/phone/REST API | LAN → Tailscale → relay; account is only for discovery, LAN/SSH pairing works without account |
| Parallel unit | Session + git worktree (Polly fans out to sub-agents) | Lane (ADE's name for git worktree), one lane per task with isolated branch/PR review in-app |
| Governance | **Contextual Policy** (Python fn on full session → `allow/deny/ask`), three layers, cost budgets, credential proxy, Omnibox `bwrap/seatbelt` | Light: lane isolation + approval gate, no Policy engine / spend kernel / credential proxy |
| Customization | YAML agent with `tools: function/mcp/agent` cross-harness | Repo-scoped workspace via Brain + `.ade/` |
| Models/hosts | 4 credential kinds + 10 cloud sandboxes per session | Built-in Claude Code/Codex/Cursor/Factory Droid/OpenCode, model bar switch, host is the machine with Brain |
| Deploy | `docker compose` / Fly/Railway/Modal/Cloudflare/Databricks Apps | `curl -fsSL https://ade-app.dev/install.sh \| sh` + dmg/exe; Linux Brain only |

They stack: run Omnigent Runners on the same machine that hosts ADE's Brain, or treat ADE as one host UI for Omnigent.

## GitHub landscape: scanning three Topics

We scanned [agent-orchestration](https://github.com/topics/agent-orchestration) (2,895 repos), [agent-governance](https://github.com/topics/agent-governance) (677 repos) and [agent-framework](https://github.com/topics/agent-framework) (2,408 repos) cross-checked with `agent-harness`. The control-plane peers worth comparing:

### Control plane / governance (direct peers)

| Project | Stars | One-liner | vs Omnigent |
|---|---|---|---|
| [herdrdev/herdr](https://github.com/herdrdev/herdr) | 32.3k | `the runtime your coding agents live on` — Rust tmux multiplexer | Closest terminal/sandbox peer, highest stars among new finds |
| [superset-sh/superset](https://github.com/superset-sh/superset) | 13.3k | Agentic IDE orchestrating 100+ coding agents in parallel | IDE flavor vs Omnigent's Server flavor |
| [builderz-labs/mission-control](https://github.com/builderz-labs/mission-control) | 6.1k | Self-hosted control plane with dispatch/review/spend tracking | Lightweight open-source Omnigent |
| [huangruiteng/loopx](https://github.com/huangruiteng/loopx) | 5.1k | Long-horizon control plane for Codex/Claude Code | Long-running governance slice |
| [kungfu-systems/kungfu](https://github.com/kungfu-systems/kungfu) | 4.5k | Keeps the same Work moving across Codex, Claude, OpenCode | Focus on Work portability |
| [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot) | 2.8k | Each agent gets its own computer, AG-UI driven | Browser-automation leaning |
| [ucsandman/DashClaw](https://github.com/ucsandman/DashClaw) | 295 | Approval and policy layer with MCP + shell proxy | Purest "Omnigent Policy" peer |
| [KeyArgo/custodian-kernel](https://github.com/KeyArgo/custodian-kernel) | 118 | Kernel-enforced authority + spend platform | Cost-budget as a kernel |
| [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) | 6.1k | Covers 10/10 OWASP Agentic Top 10, zero-trust + sandbox | Enterprise governance reference |
| [holaboss-ai/holaOS](https://github.com/holaboss-ai/holaOS) | 10.8k | Agentic workspace with 100+ integrations | Productized workspace vs CLI/Server |
| [zhnt/loushang](https://github.com/zhnt/loushang) | 1.2k | Python multi-model harness with stateful sessions | Broader model coverage, no multi-harness swap |
| [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai) | 1.5k | 40 built-in policies + observability | Lightweight policy peer |
| [first-fluke/oh-my-agent](https://github.com/first-fluke/oh-my-agent) | 1.2k | Verifies after execution across 10+ runtimes | Omnigent gates before execution, this after |

### Protocol / SDK (complementary)

[Zed ACP](https://agentclientprotocol.com/) (LSP for agents), [Vercel HarnessAgent](https://vercel.com/changelog/use-acp-compatible-harnesses-with-the-ai-sdk-harness-layer) (swap harnesses in code) and [Cloudflare Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/) (durable execution at scale) solve "access", "SDK switch" and "cloud scale" respectively — all stackable under Omnigent.

### Often mistaken for the same layer

[HKUDS/nanobot](https://github.com/HKUDS/nanobot) (47.4k), [deepset-ai/haystack](https://github.com/deepset-ai/haystack) (26.3k), [microsoft/agent-framework](https://github.com/microsoft/agent-framework) (13.1k, AutoGen successor) and [strands-agents/harness-sdk](https://github.com/strands-agents/harness-sdk) (7k) are **frameworks being orchestrated**, not governance layers.

Three same-named `metaharness` projects ([ruvnet/metaharness](https://github.com/ruvnet/metaharness), [stanford-iris-lab/meta-harness](https://github.com/stanford-iris-lab/meta-harness), [SuperagenticAI/metaharness](https://github.com/SuperagenticAI/metaharness)) mean "outer-loop optimizer that rewrites harness code" ([arXiv:2603.28052](https://arxiv.org/abs/2603.28052)) — same name, different meaning.

## When to use Omnigent

**Good fit:**

- Teams already using multiple harnesses/models and wanting one-line swaps.
- Sharing a live session with teammates (comment, co-drive with `omnigent attach <session_id>`, fork with `omnigent run --fork <session_id>`).
- Cloud sandboxes that keep running after you close the laptop.
- Auditable cost and safety guardrails beyond prompt allowlists.

**Not a good fit:**

- Single-harness, single-machine personal use — native harness is lighter (Omnigent adds a server + `tmux`/`bwrap` deps).
- Windows-native with strong FS/network isolation needs — degraded mode.
- Low tolerance for alpha — `0.11.0.dev0` APIs still move (`omni upgrade`).

## Overall

Omnigent lifts "agent portability" one level up, trading a self-hosted Server for cross-harness reuse, stateful governance and real-time collaboration. If your pain is "too many tools, hard to collaborate, governance stuck in prompts", it is the most complete open-source answer today; if you live in one harness on one machine, the value is indirect.

Next steps worth exploring: a head-to-head on the same task across `loopx` / `loushang` / `mission-control` vs Omnigent (tokens / latency / governance granularity), or a deep dive into Omnibox egress policies and secretless credentials for enterprise deployment.

## References

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent)
- [Introducing Omnigent: A Meta-Harness to Combine, Control and Share Your Agents — Databricks Blog](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents)
- [Omnibox (OS Sandbox)](https://omnigent.ai/docs/policies/os-sandbox) / [Shared Server](https://omnigent.ai/docs/deploy/overview) / [Agent YAML Spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
- [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) / [DeepSeek Harness website](https://deepseek.com/harness/en/) / [Block/Goose](https://github.com/aaif-goose/goose) / [OpenCode](https://opencode.ai/) / [Pi](https://github.com/badlogic/pi-mono)
- [herdrdev/herdr](https://github.com/herdrdev/herdr) / [superset-sh/superset](https://github.com/superset-sh/superset) / [builderz-labs/mission-control](https://github.com/builderz-labs/mission-control)
- [huangruiteng/loopx](https://github.com/huangruiteng/loopx) / [zhnt/loushang](https://github.com/zhnt/loushang) / [holaboss-ai/holaOS](https://github.com/holaboss-ai/holaOS)
- [FailproofAI/failproofai](https://github.com/FailproofAI/failproofai) / [first-fluke/oh-my-agent](https://github.com/first-fluke/oh-my-agent) / [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [arul28/ADE](https://github.com/arul28/ADE) / [ade-app.dev](https://www.ade-app.dev/docs)
- [Meta-Harness: End-to-End Optimization of Model Harnesses — arXiv:2603.28052](https://arxiv.org/abs/2603.28052)
