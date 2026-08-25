---
title: "Governance Deep Dive: Policies, Omnibox, Spend Controls and Credential Brokering"
date: 2026-08-26
category: ai
type: deep-dive
tags: [agent-governance, omnigent, policy, sandbox, mcp]
lang: en
tldr: "Omnigent moves governance off prompts into a Server-side Policy engine: Python functions returning allow/deny/ask, a three-layer stack with cost budgets and tool caps, plus Omnibox OS-native isolation via bwrap/seatbelt and egress credential brokering — compared with five peer governance stacks."
description: "Deep dive into Omnigent's contextual Policies, three-layer stacking, spend and tool caps, and Omnibox bwrap/seatbelt isolation with egress credential brokering, compared with FailproofAI, DashClaw, custodian-kernel, Microsoft agent-governance-toolkit and herdr — with YAML examples and a selection table."
series:
  name: "Meta-Harness 與 Agent 治理"
  order: 4
glossary:
  - term: "Policy"
    aliases: ["policy engine", "governance policy"]
    definition: "在 harness 之外、以程式攔截工具呼叫的治理規則，依上下文回傳 allow、deny 或 ask。"
    definition_en: "A governance rule outside the harness that intercepts tool calls and returns allow, deny, or ask based on context."
    advanced: "Omnigent 的 Policy 是 Python 函式，能讀取完整 session 上下文，較嚴格的規則優先，並可組合 cost budget 與 tool caps。"
    advanced_en: "In Omnigent, a Policy is a Python function with full session context; stricter rules win and can compose cost budgets and tool caps."
    links:
      - label: "Omnigent Policies"
        url: "https://omnigent.ai/docs/policies/overview"
  - term: "Omnibox"
    definition: "Omnigent 的 OS 層沙盒，以 Linux bwrap、macOS seatbelt 與 Windows Job Object 提供檔案與網路隔離，並透過 egress proxy 代理憑證。"
    definition_en: "Omnigent's OS-level sandbox using Linux bwrap, macOS seatbelt and Windows Job Objects for filesystem and network isolation with egress-proxy credential brokering."
    links:
      - label: "Omnibox docs"
        url: "https://omnigent.ai/docs/policies/os-sandbox"
  - term: "憑證代理"
    aliases: ["credential brokering", "secretless"]
    definition: "憑證不進 agent 記憶體，只在 egress proxy 上對允許的請求臨時注入，降低外洩與提示詞竊取風險。"
    definition_en: "Credentials never enter the agent's memory; the egress proxy injects them only for allowed requests, reducing exfiltration and prompt-stealing risk."
---

> 🌏 [中文版](/posts/ai/2026-08-26-agent-governance-policies)

The last two posts positioned [Omnigent](https://github.com/omnigent-ai/omnigent): [part 1 covered Runner/Server/Omnibox and the Polly example](/posts/ai/2026-08-26-omnigent-meta-harness-en), [part 2 mapped four layers with ACP, HarnessAgent and Flue](/posts/ai/2026-08-27-meta-harness-layers-en). This one drills into the layer most often hand-waved as "just add an allowlist" — why [Omnigent](https://omnigent.ai/) models governance as Python functions, how spend and call caps work, why [Omnibox](https://omnigent.ai/docs/policies/os-sandbox) avoids Docker, and how five peers compare: [FailproofAI](https://github.com/FailproofAI/failproofai), [DashClaw](https://github.com/dashclaw/dashclaw), [custodian-kernel](https://github.com/custodian-kernel/custodian-kernel), [Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) and [herdr](https://github.com/herdrdev/herdr).

## Why governance cannot live in the prompt

Prompt-level rules like "never run `rm -rf`" or "don't read secrets" have three structural flaws: the model can be persuaded around them, there is no auditable proof of what was blocked when, and every harness needs its own copy. [Omnigent](https://omnigent.ai/) pulls governance out to [Server-side tool hooks](https://omnigent.ai/docs/policies/overview): regardless of whether the underlying harness is [Claude Code](https://code.claude.com/), [Codex](https://developers.openai.com/codex) or [Pi](https://github.com/badlogic/pi-mono), every tool call is intercepted on the same Policy path returning `allow` / `deny` / `ask`. Governance becomes testable, version-controlled code rather than natural-language reminders scattered across prompts.

The key difference is **context**: a Policy function sees the full session — which files were read, which tools were just called, which path is about to be written. Compared with a static allowlist that only checks the current tool name, this contextual judgment enables rules like "reading `src/` is fine, reading `secrets/` needs approval" or "pushing to `origin/main` is blocked, pushing to `feat/*` is allowed."

## Omnigent Policies: Python functions and a three-layer stack

A Policy is a Python function, roughly `def policy(ctx) -> Decision`, executed on the [Server](https://omnigent.ai/docs/policies/overview). `ctx` carries session history, the current tool call and the Policy's own config; `Decision` is one of three values. The built-in [safety and cost families](https://github.com/omnigent-ai/omnigent/tree/main/src/omnigent/policies/builtins) cover common cases; the rest is a custom function you plug in.

### What the YAML looks like

```yaml
# omnigent.yaml — three-layer Policy stack
policies:
  # Ask before any shell / OS tool
  approve_shell:
    type: function
    handler: omnigent.policies.builtins.safety.ask_on_os_tools

  # Cap tool calls per session at 50 — deny beyond
  cap_calls:
    type: function
    handler: omnigent.policies.builtins.safety.max_tool_calls_per_session
    factory_params: { limit: 50 }

  # Soft ask at $3, hard stop at $5
  budget:
    type: function
    handler: omnigent.policies.builtins.cost.cost_budget
    factory_params: { max_cost_usd: 5.00, ask_thresholds_usd: [3.00] }

  # Only block the high-risk read, allow the rest
  guard_secrets:
    type: function
    handler: policies.custom.deny_read_secrets
```

Custom functions just return a string or structured Decision:

```python
# policies/custom.py
def deny_read_secrets(ctx):
    tool = ctx.tool_call
    if tool.name in ("read", "read_file") and "/secrets" in str(tool.args.get("path", "")):
        return "deny"  # or {"decision": "deny", "reason": "secrets path needs human approval"}
    return "allow"
```

In practice you can toggle Policies in the [Web UI session panel](https://omnigent.ai/docs/policies/overview) or just tell the agent "add a policy that asks before shell execution." For teams this matters: governance converges during the conversation, not only at deploy time.

### The three-layer stack: who wins

Layers stack as `server-wide (admin)` → `per-agent (developer)` → `per-session (user)`, with **stricter wins**. If an admin sets `max_cost_usd: 20` and a developer sets `5` in the agent YAML, the effective limit is `5`; a `deny` from any layer cannot be overridden by a more permissive `allow`. This lets platform baselines coexist with task-level flexibility — the organization sets the floor, tasks tighten within it.

## Spend and tool caps

When many agents run in parallel, the pain is not the price of a single call but **not knowing when to stop**. [Omnigent](https://omnigent.ai/)'s [cost budget](https://github.com/omnigent-ai/omnigent/tree/main/src/omnigent/policies/builtins) uses a soft/hard split: `ask_thresholds_usd` yields `ask` (let the user decide), `max_cost_usd` yields `deny` (hard stop). Because the Policy sees cumulative spend for the session, the budget is shared across harnesses — switch between [Claude Code](https://code.claude.com/) and [Codex](https://developers.openai.com/codex) in the same session and the ledger stays unified.

Tool call caps (`max_tool_calls_per_session`) guard against "loop blowups": when an agent enters a retry loop or keeps listing files, the count cap triggers before the dollar cap. Use them together — budgets control external cost, caps control internal runaway.

| What | Parameter | Trigger | When it helps most |
|---|---|---|---|
| Spend | `max_cost_usd` / `ask_thresholds_usd` | `ask` → `deny` | Shared team budgets, long-running tasks |
| Calls | `limit` (per-session) | `deny` | Debugging loops, weaker-model retries |
| Scope | Custom function (path, domain, command) | `allow/deny/ask` | Secrets paths, dangerous commands |

## Omnibox: why not just use Docker

[Omnibox](https://omnigent.ai/docs/policies/os-sandbox) is Omnigent's OS-level sandbox, deliberately choosing **OS-native primitives** over full container virtualization: [bubblewrap (`bwrap`)](https://github.com/containers/bubblewrap) on Linux, [seatbelt](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/mac/sandbox.md) on macOS, and a degraded [Job Object](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects) mode on Windows. Per-session sandbox startup is near zero, and it runs on the developer's own machine without building an image first.

### Sandbox config

```yaml
# omnigent.yaml — Omnibox restrictions
sandbox:
  mode: omnibox  # or cloud (Modal/Daytona/E2B etc.)
  omnibox:
    write_paths: ["./work", "/tmp"]      # only these are writable
    read_paths: ["./work", "./docs"]     # only these are readable
    allow_network: false                  # offline by default
    env_passthrough: ["PATH", "HOME"]    # only these env vars pass through
    egress_rules:                         # exceptions
      - host: "api.github.com"
        methods: ["GET", "POST"]
      - host: "registry.npmjs.org"
        methods: ["GET"]
```

`egress_rules` is the key: deny by default, allow only listed host/method pairs. This follows least privilege more cleanly than "allow all then block," and complements Policies — Policies control whether a tool may be called, Omnibox controls whether the call can actually reach the network.

### Credential brokering: the agent never sees plaintext

The conventional approach puts `GITHUB_TOKEN` in the environment where any `env` call can exfiltrate it. [Omnibox](https://omnigent.ai/docs/policies/os-sandbox)'s [credential proxy](https://omnigent.ai/docs/policies/os-sandbox#credential-proxy) reverses this: credentials stay on the host, the agent only sees a proxy address, and the egress proxy injects the `Authorization` header at the edge when a request truly targets `api.github.com`. Benefits: prompt exfiltration cannot steal plaintext, and audit logs can record which session used which credential against which host and when.

Windows remains degraded: Job Objects can constrain the process tree and resources but provide no filesystem or network isolation; the docs recommend [WSL](https://learn.microsoft.com/en-us/windows/wsl/) instead. Flag this early when evaluating cross-platform teams.

## Five peers, five positions

All five appear under [agent-governance](https://github.com/topics/agent-governance) and related topics, but they cover different slices:

### [FailproofAI](https://github.com/FailproofAI/failproofai) — 40 ready-made policies, lightweight baseline

[FailproofAI](https://github.com/FailproofAI/failproofai) (~1.5k stars) optimizes for "works out of the box": ~40 built-in policies, a local dashboard and observability for single-machine or small-team use. Compared with [Omnigent](https://omnigent.ai/)'s Python functions and three-layer stack, FailproofAI rules are more declarative and readable but shallower in context — harder to make a decision that depends on the full session.

### [DashClaw](https://github.com/dashclaw/dashclaw) — approval proxy model

[DashClaw](https://github.com/dashclaw/dashclaw) frames governance as a **proxy**: every tool call flows through it, mapped to `allow/ask/deny`, with `ask` surfacing as an approval UI (who approves, how long it lasts, batch approvals). This is close to Omnigent's tool hooks, but DashClaw specializes in the approval workflow itself, while Omnigent treats approval as just one return value alongside audit and spend in the same engine.

### [custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) — kernel-level isolation

[custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) pushes the boundary down to the kernel/hypervisor: strong isolation and resource control for multi-tenant or high-risk execution. Omnibox stays in OS userspace (`bwrap`/`seatbelt`); custodian-kernel trades heavier deployment for a deeper trust boundary.

### [Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) — enterprise playbook

[Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) is a documentation, assessment and template kit for enterprise adoption — risk classification, audit requirements, compliance mapping. Compared with Omnigent's executable Policy engine ("how to enforce"), the toolkit is "how to define what should be enforced." They stack: define principles with the toolkit, enforce them with Omnigent.

### [herdr](https://github.com/herdrdev/herdr) — team and collective governance

[herdr](https://github.com/herdrdev/herdr) (~2k stars) focuses on team collaboration and collective guardrails — shared sessions and group decisions. Where Omnigent governs many harnesses within one session, herdr emphasizes how a group of people governs a group of agents. Complementary: let Omnigent run the engine, herdr own the collaboration surface.

## How to choose: decision table

| Scenario | First pick | Why | When to layer Omnigent on top |
|---|---|---|---|
| Already on Omnigent / mixed harnesses, need contextual decisions | [Omnigent](https://omnigent.ai/) | Three-layer Policies + spend/caps + Omnibox brokering on one path | — |
| Single machine, want 40 ready-made rules fast | [FailproofAI](https://github.com/FailproofAI/failproofai) | Out-of-the-box dashboard | When the team grows and needs cross-device + audit |
| Approval workflow is the bottleneck (who/batch/how long) | [DashClaw](https://github.com/dashclaw/dashclaw) | Proxy model treats approval as first-class | Wire DashClaw approvals into Omnigent `ask` |
| Multi-tenant / high-risk code needs kernel boundary | [custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) | Kernel boundary, deepest isolation | Keep Omnigent for Policies and budgets above it |
| Enterprise audit / compliance framework needed | [Microsoft agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit) | Methodology and templates | Enforce toolkit principles with Omnigent |
| Team co-editing, collective guardrails | [herdr](https://github.com/herdrdev/herdr) | Collaboration-first | Let Omnigent own the engine, herdr the surface |

Practical tip: **run one week with `ask_on_os_tools` + `cost_budget` + `egress_rules`** and converge on the allow/ask list before adding anything else. Many teams find those three rules prevent ~80% of incidents; the rest can be filled in from the table above.

## Overall

Governance is rarely about whether rules exist, but whether they travel with the session, see context, and survive a harness switch. [Omnigent](https://omnigent.ai/) answers by making governance Server-side code: Policies are testable Python functions, the three-layer stack lets org baselines coexist with task flexibility, and [Omnibox](https://omnigent.ai/docs/policies/os-sandbox) separates "can see" from "can reach" with OS-native primitives and credential brokering. Peers each excel at a slice — [FailproofAI](https://github.com/FailproofAI/failproofai) for lightweight start, [DashClaw](https://github.com/dashclaw/dashclaw) for approvals, [custodian-kernel](https://github.com/custodian-kernel/custodian-kernel) for kernel depth, the [Microsoft toolkit](https://github.com/microsoft/agent-governance-toolkit) for compliance, [herdr](https://github.com/herdrdev/herdr) for collaboration — but if your pain is "many harnesses, many devices, must audit," Omnigent is the most complete single answer today.

Next in the series: the same task (parallel worktrees + cross-vendor review in Polly mode) implemented four ways — Omnigent YAML vs LangGraph vs CrewAI vs Goose — and what each costs to run and maintain.

## References

- [Omnigent — a meta-harness for building and running AI agents](https://omnigent.ai/)
- [omnigent-ai/omnigent](https://github.com/omnigent-ai/omnigent)
- [Omnigent Policies — overview & builtins](https://omnigent.ai/docs/policies/overview) / [Omnibox OS Sandbox](https://omnigent.ai/docs/policies/os-sandbox) / [Agent YAML Spec](https://github.com/omnigent-ai/omnigent/blob/main/docs/AGENT_YAML_SPEC.md)
- [Introducing Omnigent: A Meta-Harness to Combine, Control and Share Your Agents — Databricks Blog](https://www.databricks.com/blog/introducing-omnigent-meta-harness-combine-control-and-share-your-agents)
- [FailproofAI — 40 policies + observability](https://github.com/FailproofAI/failproofai)
- [DashClaw — approval proxy for agent tool calls](https://github.com/dashclaw/dashclaw)
- [custodian-kernel — kernel-level isolation for agents](https://github.com/custodian-kernel/custodian-kernel)
- [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [herdrdev/herdr](https://github.com/herdrdev/herdr)
- [What Is a Meta-Harness? A 2026 Buyer's Guide — codepick.dev](https://codepick.dev/en/guides/meta-harness-2026/)
