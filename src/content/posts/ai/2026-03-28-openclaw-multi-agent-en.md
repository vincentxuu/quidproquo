---
title: "OpenClaw Multi-Agent: An Agent Is a Whole Persona Boundary — and Agents Can Now Ask for New Agents"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, multi-agent, bindings, workspace, agent-isolation, persona]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 9
tldr: "An agent is a complete persona scope — its own workspace, auth profiles, model registry, and session store. But the isolation is not absolute: when a secondary agent's OAuth credential expires, OpenClaw reads through to the main agent's profile of the same id, and a workspace is only a default working directory, not a hard sandbox."
description: "OpenClaw multi-agent routing: what an agent boundary contains, how bindings map channel accounts to agents, why agentDir must never be shared, cross-agent OAuth read-through, the replace semantics of skills, and provenance for agent-created agents."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-multi-agent)

OpenClaw can run multiple isolated agents **inside one Gateway process**, each with its own workspace, state directory, and SQLite session history, plus multiple channel accounts (two WhatsApp numbers, say). Inbound messages route to the right agent through **bindings**.

Two terms to pin down first: an **agent** is the full per-persona scope; a **binding** maps one channel account (a Slack workspace, a WhatsApp number) to one of those agents.

## What one agent contains

- **Workspace**: files, `AGENTS.md` / `SOUL.md` / `USER.md`, local notes, persona rules
- **State directory (`agentDir`)**: auth profiles, model registry, per-agent config
- **Session store**: chat history and routing state in `~/.openclaw/agents/<agentId>/agent/openclaw-agent.sqlite`

Paths:

| What | Default | Override |
|---|---|---|
| Config | `~/.openclaw/openclaw.json` | `OPENCLAW_CONFIG_PATH` |
| State dir | `~/.openclaw` | `OPENCLAW_STATE_DIR` |
| Default agent workspace | `<state>/workspace` | `agents.entries.*.workspace` → `agents.defaults.workspace` → `OPENCLAW_WORKSPACE_DIR` |
| Other agents' workspace | `<state>/workspace-<id>` | `agents.entries.*.workspace` |
| Agent dir | `~/.openclaw/agents/<id>/agent` | `agents.entries.*.agentDir` |
| Sessions and transcripts | `~/.openclaw/agents/<id>/agent/openclaw-agent.sqlite` | — |

**Configure nothing and you get one agent**: `agentId` defaults to `main`, session keys are `agent:main:<mainKey>`.

## The isolation is weaker than you might assume

Two points matter here.

**1. The workspace is a default working directory, not a hard sandbox.** Relative paths resolve inside it, but **absolute paths can reach other host locations** unless sandboxing is enabled. So "each agent has its own workspace" does not mean agents cannot read each other's files.

**2. OAuth credentials read across agents.** When a secondary agent's local OAuth credential is expired or its refresh fails, **OpenClaw reads through to the default/main agent's credential for the same profile id** and adopts whichever token is freshest — without copying the refresh token into the secondary agent's store.

For a fully independent OAuth account, **sign in from that agent**. If you copy credentials by hand, copy only portable static `api_key` or `token` profiles — **OAuth refresh material is not portable by default** (`copyToAgents` can opt a profile in explicitly).

And one rule you must never break: **never reuse `agentDir` across agents** — it causes auth and session state collisions.

## Creating and binding

```bash
openclaw agents add work
```

Flags: `--workspace`, `--model`, `--agent-dir`, `--bind <channel[:accountId]>` (repeatable), `--non-interactive` (requires `--workspace`).

Then add `bindings` to route inbound messages (the wizard offers to do it), and verify:

```bash
openclaw agents list --bindings
```

The typical shape is one set of channel accounts per agent (one Discord bot, one BotFather bot, one WhatsApp number), agents under `agents.entries`, accounts under `channels.<channel>.accounts`, wired together by `bindings`, then `openclaw channels status --probe` after a restart.

## Agents can request new agents — with a human gate

Added after March, and the most notable change: **a configured agent can ask OpenClaw to create another agent through its `openclaw` tool.**

It was not built as silent self-replication. The system agent **files the typed operation, shows the requesting agent id to the operator, and creates the agent only after operator approval.**

OpenClaw therefore records **provenance** for every agent:

- `operator` — from the CLI, onboarding, or Gateway requests
- `agent` — requested by the system agent (retaining the requesting agent id)
- `claw` — added by a Claw install

Inspect the hierarchy:

```bash
openclaw agents list --tree
```

Deleted creators remain as historical provenance; if a creator is no longer in the configured roster, its children appear at the root.

This design is worth a moment's thought: **allow agents to spawn agents, but make "who asked" a permanent record and insert a human gate.** That is more practical than either a flat ban or unrestricted permission.

## Skills replace, they do not merge

The config semantic most likely to bite in a multi-agent setup:

Skills load from **each agent's workspace plus shared roots** (such as `~/.openclaw/skills`), then filter by that agent's effective skill allowlist.

- `agents.defaults.skills` is the shared baseline
- `agents.entries.*.skills` is a **per-agent replacement** — **explicit entries replace the default, they do not merge**

Assume merging and one agent's skill list will be far shorter than you expect.

## Plugin storage does not split automatically

Another easy misread: **adding a second agent does not automatically split every global plugin store.** Each plugin's own configuration decides.

The example upstream is Memory Wiki, which uses one global vault by default. To keep a support agent's compiled knowledge apart from a marketing agent's:

```json5
{
  plugins: {
    entries: {
      "memory-wiki": {
        enabled: true,
        config: { vault: { scope: "agent", path: "~/.openclaw/wiki" } },
      },
    },
  },
}
```

The configured path is the **parent directory**; OpenClaw appends the normalized agent id, producing `~/.openclaw/wiki/support` and `~/.openclaw/wiki/marketing`. And with multiple agents configured, **agent-scoped CLI and Gateway operations require an explicit agent.**

## The safer cross-session recall path

A related tool worth knowing: `sessions_history` is **the safer cross-session recall path**, because it returns **a bounded, redacted view rather than a raw transcript dump**.

It strips thinking-block signatures, tool-result payload details, scaffolding, tool-call XML tags (`<tool_call>`, `<function_call>`, and their plural/downgraded forms), and MiniMax tool-call XML, then truncates and caps output by byte size.

## The big picture

The right mental model for multi-agent: **it separates personas and state, not operating-system-level isolation.**

Workspaces, auth, sessions, and model registries are separate, which is enough for several people to share one Gateway while keeping their own conversations and personas. But absolute paths still lead to the same host, OAuth credentials still read across agents, and plugin storage is still shared by default — **for real isolation, go up to sandboxing or out to separate Gateways.**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **agents can request creation of another agent through the `openclaw` tool**, with the resulting provenance tracking (`operator`/`agent`/`claw`), `openclaw agents list --tree`, and the operator approval gate; **a secondary agent's expired OAuth credential reads through to the main agent's profile of the same id** and adopts the freshest token (refresh material is not portable by default, with `copyToAgents` as opt-in); **a workspace is only a default cwd, not a hard sandbox**, so absolute paths still reach the rest of the host; per-agent skills entries **replace rather than merge**; plugin storage does not split automatically with multiple agents (using Memory Wiki's `vault.scope: "agent"` as the example); `sessions_history` returns a bounded, redacted view; and the session store now lives in each agent's `openclaw-agent.sqlite`.

## References

This article draws on the following official OpenClaw documentation:

- [Multi-agent routing](https://docs.openclaw.ai/concepts/multi-agent) — agent boundaries, paths, provenance, per-agent vaults
- [Agent bindings](https://docs.openclaw.ai/concepts/agent-bindings) — binding setup and examples
- [Skills: per-agent vs shared](https://docs.openclaw.ai/tools/skills) — replace semantics and allowlists
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — real isolation beyond the workspace
- [Session management](https://docs.openclaw.ai/concepts/session) — session routing and scopes
