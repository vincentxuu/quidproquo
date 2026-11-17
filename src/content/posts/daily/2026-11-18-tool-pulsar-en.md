---
title: "Tool Pick｜pulsar — lets AI agents in different harnesses message each other"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "pulsar is an MCP server that lets agents running in Claude Code, Codex, OpenCode, Cursor, Gemini CLI and more see each other, send messages, and wake idle sessions"
tldr: "pulsar is an MCP server that lets AI coding agents across different harnesses (Claude Code, Codex, OpenCode, pi, omp, Cursor, Gemini CLI) on the same machine see each other, send messages, and request/reply. Install: npx pulsar setup. It solves the problem of agents in different harnesses having no way to see or coordinate with each other."
series:
  name: "AI Tool of the Day"
  order: 82
---

> 🌏 [中文版](/posts/daily/2026-11-18-tool-pulsar)

## Tool Info

| Item | Value |
|---|---|
| Name | pulsar |
| Type | MCP server |
| GitHub | [yocontra/pulsar](https://github.com/yocontra/pulsar) |
| Stars | 32 (at time of writing; repo created 2026-11-17) |
| Language | TypeScript |
| License | MIT |
| Install | `npx pulsar setup` |

## What Problem It Solves

Ever had Claude Code, Codex, and Cursor open at once on the same repo, each completely unaware the others exist? One session is editing the auth module while another touches the same file at the same time, and you only find out at the push conflict. You want to tell an agent "hold off on main until the release is tagged," but the only way is switching to that window and typing it yourself — there's no channel for agents to notify each other.

Claude Code already has `SendMessage` to wake other sessions within the same harness, but it only knows about Claude. pulsar builds the cross-harness version of that: a small daemon running on your machine keeps a registry of every live agent, regardless of whether it's running in Claude Code, Codex, OpenCode, pi, omp, Cursor, or Gemini CLI. Each agent automatically carries tags like `harness`, `model`, `project`, `branch`, and `pr`, and can add its own, like `role:reviewer`. Messages can target a name, a selector (`project=apparish`, `pr=1402`), a whole group, or `*` for everyone — and delivery is push, not polling, so an `urgent` message can wake an idle agent mid-session.

Good fit: multiple coding agents on one machine collaborating on the same repo, agents that need to hand off review work to each other, or turning "wait for the other agent to finish" from manual polling into a real event notification.

```diagram
title: How pulsar lets agents in different harnesses see each other
desc: Push-capable harnesses like Claude Code and Codex/OpenCode, plus pull-only clients like Cursor/Gemini CLI, all connect through MCP to one pulsar daemon on the same machine; the daemon keeps the registry, pushes messages, and logs them to a local SQLite file.
caption: Simplified — omits cross-machine messaging and remote control over Tailscale (listed in the README as not yet supported).
---
<svg viewBox="0 0 640 400">
  <rect class="dg-zone" x="20" y="16" width="600" height="358" rx="8"/>
  <text class="dg-tag" x="36" y="38" dominant-baseline="central">LOCAL MACHINE (ONE USER)</text>

  <path class="dg-line" d="M230 86H400" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M230 176H400" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--dashed" d="M230 266H400" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M490 282V302" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="40" y="54" width="190" height="64" rx="6"/>
  <text class="dg-label" x="135" y="77" text-anchor="middle" dominant-baseline="central">Claude Code</text>
  <text class="dg-sub" x="135" y="97" text-anchor="middle" dominant-baseline="central">push, wakes idle</text>

  <rect class="dg-box" x="40" y="144" width="190" height="64" rx="6"/>
  <text class="dg-label" x="135" y="167" text-anchor="middle" dominant-baseline="central">Codex／OpenCode</text>
  <text class="dg-sub" x="135" y="187" text-anchor="middle" dominant-baseline="central">plus pi, omp</text>

  <rect class="dg-box dg-box--ghost" x="40" y="234" width="190" height="64" rx="6"/>
  <text class="dg-label" x="135" y="257" text-anchor="middle" dominant-baseline="central">Cursor／Gemini CLI</text>
  <text class="dg-sub" x="135" y="277" text-anchor="middle" dominant-baseline="central">inbox only, no push</text>

  <rect class="dg-box dg-box--accent" x="400" y="70" width="180" height="212" rx="6"/>
  <text class="dg-label" x="490" y="167" text-anchor="middle" dominant-baseline="central">pulsar daemon</text>
  <text class="dg-sub" x="490" y="187" text-anchor="middle" dominant-baseline="central">registry + message bus</text>

  <rect class="dg-box dg-box--store" x="400" y="302" width="180" height="56" rx="6"/>
  <text class="dg-label" x="490" y="330" text-anchor="middle" dominant-baseline="central">SQLite message log</text>

  <text class="dg-edge" x="315" y="164" text-anchor="middle" dominant-baseline="central">push</text>
  <text class="dg-edge" x="315" y="254" text-anchor="middle" dominant-baseline="central">polls</text>
</svg>
```

## Quick Start

### Install

```bash
npx pulsar setup
```

Setup detects which agent harnesses are installed, shows exactly which files it will change before asking once, and backs up every file it touches. You can also scope it to specific harnesses:

```bash
npx pulsar setup --client claude,codex --dry-run   # show the plan, change nothing
npx pulsar setup --yes --all-detected               # no prompts, for scripts
```

No Node environment:

```bash
curl -fsSL https://raw.githubusercontent.com/yocontra/pulsar/main/install.sh | bash
```

### Basic Usage

```
> list agents on apparish

3 agents (project=apparish):
- apparish-auth   · [claude] · branch=main · busy · push · tags=workstream:auth
- codex@apparish  · [codex]  · branch=feat/billing · idle · push
- omp@apparish    · [omp]    · branch=main · idle · push

> tell everyone on apparish that main is frozen until the release is tagged

Sent m_mwk3jlo0 to 3 agents:
- apparish-auth: sent via claude-socket
- codex@apparish: sent via codex-queue
- omp@apparish: delivered via extension
```

Agents automatically get MCP tools like `list_agents`, `send`, `reply`, `ask` (send and block for the first reply), `wait` (block for a message, a reply, or an agent going idle), `inbox`, `set_identity`, and `whoami`. The CLI mirrors this with `pulsar ls`, `pulsar send`, `pulsar inbox`, and `pulsar tail` (a live feed of joins, leaves, and messages).

### Advanced Usage

```bash
# Query a group by selector and wait for a reply
pulsar send project=apparish --expect-reply "who owns the auth migration?"

# doctor: check the daemon and every harness's wiring
pulsar doctor
```

Each agent can also set its own `inbound` policy (accept, hold, or refuse messages). Every message is explicitly marked as coming from a peer agent, not the user, and can't be used to approve anything — a boundary the README spells out clearly.

## Comparison with Existing Tools

| | pulsar | Claude Code's built-in `SendMessage` | Manually switching windows |
|---|---|---|---|
| Cross-harness (Codex, OpenCode, Cursor…) | ✅ | ❌ (Claude only) | ✅ (but manual) |
| Find a group by tag/selector | ✅ | ❌ | ❌ |
| Broadcast to everyone (`*`) | ✅ | ❌ | ❌ |
| Push to wake idle agents | ✅ | ✅ | ❌ |
| Wait for a reply (`ask`/`wait`) | ✅ | ❌ | ❌ |
| Cross-machine | ❌ (v1 is single-machine; README previews Tailscale support) | ✅ (Remote Control) | — |

## Caveats

- **Single-machine only, for now.** The README is explicit that cross-machine messaging and remote control over Tailscale are "coming soon" — right now it only coordinates agents on one machine.
- **The trust boundary is the OS user, not agent identity.** The daemon identifies senders by a Unix socket (`0700` permissions), so any process running as you is trusted — the same trust level you already give your own files, not an extra sandbox.
- **Messages come from a peer, not the operator** — pulsar is explicit that incoming messages can't approve anything, but it's still a message-injection channel worth thinking through before wiring it to external or untrusted input. Limits: 64 KB per message, 60 sends/minute and 6 broadcasts/minute per agent, 50 unread per inbox.
- **Harnesses without a push path only get the inbox.** Only Claude Code, Codex, OpenCode, pi, and omp currently support waking an idle agent. Any other MCP client just gets messages queued in its inbox, surfaced as an "N unread" note the next time it calls any pulsar tool.

## Today's Takeaway

The thing that usually stalls multi-agent collaboration isn't model capability — it's that agents have no channel to know what each other are doing, so a human ends up relaying messages between windows by hand. pulsar narrows this down to a deliberately small interface: a machine-wide registry plus one message bus, and it doesn't try to solve the harder problem of how work gets divided — only how agents hear each other. The cross-harness design is worth noting too: it doesn't assume you'll move all your agent work into one harness, but accepts that most people already run several tools side by side.

## References

- [yocontra/pulsar — GitHub](https://github.com/yocontra/pulsar)
- [pulsar README (raw)](https://raw.githubusercontent.com/yocontra/pulsar/main/README.md)
- [pulsar — package.json](https://raw.githubusercontent.com/yocontra/pulsar/main/package.json)
- [pulsar — npm](https://www.npmjs.com/package/pulsar)
- [Model Context Protocol docs](https://modelcontextprotocol.io)
