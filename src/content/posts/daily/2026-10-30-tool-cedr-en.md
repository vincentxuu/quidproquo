---
title: "Tool of the Day｜cedr — Auto-routes work to your AI coding agents by remaining quota, then locks down your MCP servers"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source CLI that routes tasks across AI coding agents by remaining quota, merges multi-vendor code review into one pass/block decision, and pins approved skills and MCP servers into a lockfile so a silent swap fails CI"
tldr: "cedr is an open-source Rust CLI that does three things: pick which agent/model handles a task based on remaining Claude Code/Codex quota, merge multi-vendor code review into one pass/block decision, and lock approved skills and MCP servers into cedr.lock so CI fails if they're swapped. Install: download the release archive for your platform and put it on PATH, or `cargo install --locked --git https://github.com/Sheernox/cedr cedr`. It solves two problems that show up once you run several coding agents at once: who should do this task is pure guesswork, and nobody notices if an MCP server's tool list quietly changes."
series:
  name: "AI Tool of the Day"
  order: 68
---

> 🌏 [中文版](/posts/daily/2026-10-30-tool-cedr)

## Tool Info

| Item | Value |
|---|---|
| Name | cedr |
| Type | CLI (`cedr mcp` also exposes Route and Council as an MCP server for any MCP-speaking agent) |
| GitHub | [Sheernox/cedr](https://github.com/Sheernox/cedr) |
| Stars | 30 (created 2026-10-30, still in preview) |
| Language | Rust |
| License | Apache-2.0 |
| Install | `curl -fsSL https://github.com/Sheernox/cedr/releases/latest/download/cedr-x86_64-unknown-linux-gnu.tar.gz \| tar -xz` |

## What problem it solves

Run Claude Code, Codex and Cursor side by side and every new task forces the same manual call: which plan still has headroom, which agent actually fits this kind of work. Guess wrong and a plan runs out early, leaving you waiting out the reset with nothing to do. Review has the same shape — run two or three vendors' review bots and you end up reading every report yourself, deciding which findings are real, and merging them into one call each time, by hand, every time. The third problem is quieter: the skills and MCP servers you approved an agent to use typically get looked at once, on install day. Nobody checks afterward whether their tool list, descriptions, or the hosts they talk to have changed — which is the everyday version of the MCP "tool poisoning" risk Invariant Labs described in 2025.

cedr folds all three into one CLI. Route reads the rules in your `routes.toml` alongside each agent's own reported usage (point `cedr route statusline` at Claude Code's status line and it reads live usage); work that fits several candidates equally goes to whichever plan has the most headroom left, and plans close to their limit get skipped automatically. Council starts one reviewer per vendor, merges what comes back, groups findings that point at the same place, and decides whether the batch passes or blocks — any P0 or P1 blocks, and too few reports in never becomes a silent pass. Guard, still in preview, lints your agent setup and locks every skill and MCP server's tools, descriptions, and network hosts into `cedr.lock`; from then on, any mismatch fails `cedr verify` in CI. All three share one binary, and `cedr mcp` exposes Route and Council to any agent that speaks MCP directly.

It fits anyone already juggling several AI coding agent subscriptions who keeps guessing who should take the next task, or a team already running multi-vendor review bots that wants the judgment call collapsed into one gate decision. If you run a single agent on a single plan, Route and Council won't do much for you — but running Guard's `cedr lock` alone to pin your existing skill/MCP list is a few minutes' work for anyone.

```diagram
title: cedr folds three separate jobs into one CLI
desc: Route, Council and Guard share one binary — routing tasks, merging reviews, and locking the MCP list — and none depends on the others.
caption: Simplified from the cedr README; omits route sync, which needs a cedr.dev account.
---
<svg viewBox="0 0 640 332">
  <path class="dg-line" d="M250 84V108Q250 116 242 116H128Q120 116 120 124V144" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 84V144" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M390 84V108Q390 116 398 116H512Q520 116 520 124V144" marker-end="url(#arrow)"/>

  <path class="dg-line" d="M120 212V244" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 212V244" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 212V244" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="156" y="20" width="328" height="64" rx="6"/>
  <text class="dg-label" x="320" y="44" text-anchor="middle" dominant-baseline="central">cedr CLI</text>
  <text class="dg-sub" x="320" y="64" text-anchor="middle" dominant-baseline="central">Route / Council / Guard</text>

  <rect class="dg-box" x="40" y="148" width="160" height="64" rx="6"/>
  <text class="dg-label" x="120" y="170" text-anchor="middle" dominant-baseline="central">Route</text>
  <text class="dg-sub" x="120" y="190" text-anchor="middle" dominant-baseline="central">pick by quota</text>

  <rect class="dg-box" x="240" y="148" width="160" height="64" rx="6"/>
  <text class="dg-label" x="320" y="170" text-anchor="middle" dominant-baseline="central">Council</text>
  <text class="dg-sub" x="320" y="190" text-anchor="middle" dominant-baseline="central">merge reviews</text>

  <rect class="dg-box" x="440" y="148" width="160" height="64" rx="6"/>
  <text class="dg-label" x="520" y="170" text-anchor="middle" dominant-baseline="central">Guard</text>
  <text class="dg-sub" x="520" y="190" text-anchor="middle" dominant-baseline="central">lock MCP list</text>

  <rect class="dg-box" x="40" y="248" width="160" height="64" rx="6"/>
  <text class="dg-label" x="120" y="270" text-anchor="middle" dominant-baseline="central">picks one agent</text>
  <text class="dg-sub" x="120" y="290" text-anchor="middle" dominant-baseline="central">by headroom</text>

  <rect class="dg-box" x="240" y="248" width="160" height="64" rx="6"/>
  <text class="dg-label" x="320" y="270" text-anchor="middle" dominant-baseline="central">pass or block</text>
  <text class="dg-sub" x="320" y="290" text-anchor="middle" dominant-baseline="central">any P0/P1 blocks</text>

  <rect class="dg-box dg-box--store" x="440" y="248" width="160" height="64" rx="6"/>
  <text class="dg-label" x="520" y="270" text-anchor="middle" dominant-baseline="central">cedr.lock</text>
  <text class="dg-sub" x="520" y="290" text-anchor="middle" dominant-baseline="central">checked in CI</text>
</svg>
```

## Quick Start

### Install

```bash
# Linux x86_64 — swap the filename for your platform's archive
curl -fsSL https://github.com/Sheernox/cedr/releases/latest/download/cedr-x86_64-unknown-linux-gnu.tar.gz | tar -xz
install -m 755 cedr-x86_64-unknown-linux-gnu/cedr ~/.local/bin/cedr
cedr --version

# Or build from source (needs a current stable Rust toolchain)
cargo install --locked --git https://github.com/Sheernox/cedr cedr
```

### Basic usage

```toml
# ~/.config/cedr/routes.toml
version = 1

[orchestrator]       # the agent you work in; it keeps work no one else should take
harness = "claude"
model = "opus"

[harnesses.claude]
expect = ["five_hour", "seven_day"]
effort_option = "effort"

[[readings]]          # where plan usage comes from
kind = "claude-statusline"
harness = "claude"

[routes."review.code"]
work = "Independent review"
role = "review"
candidates = [
  { target = "codex/sol", effort = "high", tier = 1 },
  { target = "claude/sonnet", effort = "high", tier = 1 },
]
```

```bash
cedr route pick review.code        # pick a candidate based on each plan's current headroom
cedr route pools                   # see how much headroom each plan has left
cedr route verdict <id> accepted   # record how that pick went, for later stats
```

### Advanced usage (optional)

```bash
cedr lock    # pin the currently approved skills and MCP servers into cedr.lock (reading a live tool list needs --introspect, which warns first)
cedr verify  # compare the current setup against cedr.lock offline; exits non-zero on drift
cedr mcp     # expose Route and Council's tools as an MCP server to any MCP-speaking agent
```

Run `cedr verify` in CI and the pipeline fails the moment an MCP server's tool list or target host changes, before an agent ever gets to call a tampered-with tool.

## How it compares

Route and Council don't have a direct counterpart yet — multi-agent scheduling is still mostly manual judgment, and few tools specialize in merging multi-vendor review. The clearer comparison is Guard's "pin the MCP tool list" piece: mcp-warden (created 2026-06) specializes in exactly that, in the same ecosystem:

| | cedr (Guard) | mcp-warden | No tool, managed by hand |
|---|---|---|---|
| Pins MCP tools/descriptions/hosts, detects drift in CI | ✅ `cedr.lock` | ✅ signed `warden.lock`; CLI 2.0+ also locks annotations and output schemas | ❌ relies on remembering what it looked like last time |
| Blocks poisoned tool results at runtime (secret echo, ANSI escapes) | ❌ | ✅ `guard` proxy (stdio only) | ❌ |
| Zero-config scan of MCP configs already on the machine | ❌ | ✅ `mcp-warden doctor` (scans Claude Code/Desktop, Cursor, VS Code, Windsurf, Codex) | ❌ |
| Also handles multi-agent routing and multi-vendor review merge | ✅ | ❌ (MCP supply chain only) | ❌ |
| License | Apache-2.0 | MIT | — |

mcp-warden's own docs are explicit about the limit: it verifies the surface declared by `tools/list`/`resources/list`/`prompts/list`, it's not a full agent firewall, and it doesn't defend against behavioral attacks — the same caveat applies to cedr's Guard. Both can only tell you "this list changed since you approved it," not whether the new list is actually dangerous or whether you should re-approve it; that call still falls to a human. If the MCP supply chain is your only concern, mcp-warden's `guard` proxy adds runtime interception on top; if you also want multi-agent routing and multi-vendor review merged into the same CLI, cedr covers that extra ground.

## Things to watch

- **Still preview.** The README says commands and file formats may still change before 1.0 — `routes.toml` included.
- **Pins declarations, not behavior.** Like mcp-warden, `cedr lock`/`cedr verify` compares the tool list and descriptions an MCP server reports. An attack that leaves the tool list unchanged but tampers with what a call actually returns is outside what it detects.
- **`cedr lock` doesn't connect to MCP servers by default.** Reading a live tool list needs `--introspect`, and it warns before doing so, so you don't trigger an MCP connection without knowing it.
- **An account is only needed for cross-machine or team-shared routing history.** Route, Council and Guard all run locally with no account required; only `cedr route sync`, which pushes picks and route config to a cedr.dev team, needs an API key under a `[sync]` section.
- **Brand new, no outside track record yet.** The repo was created 2026-10-30, currently has 30 stars and 0 open issues; the README and docs are thorough, but there's no history of problems that only surface at scale.

## Today's takeaway

Once running several agents and several vendors' reviewers becomes routine, "who should take this task" and "do these three review reports mean pass or block" both used to be manual calls. cedr folds them into one config file and one CLI, following the same path upstream CI tooling already took: replace gut judgment with rules first, adjust the rules when they're wrong. MCP's tool-poisoning risk used to live mostly in researchers' write-ups; now independent teams are reaching for the same "lockfile" metaphor to build a check for it, which says the risk has moved from theoretical to something people think is worth a CLI to fix.

## References

- [Sheernox/cedr — GitHub](https://github.com/Sheernox/cedr)
- [cedr README (raw)](https://raw.githubusercontent.com/Sheernox/cedr/main/README.md)
- [cedr.dev official docs](https://cedr.dev/docs)
- [DataScience-EngineeringExperts/mcp-warden — GitHub (comparison)](https://github.com/DataScience-EngineeringExperts/mcp-warden)
- [mcp-warden README (raw, comparison)](https://raw.githubusercontent.com/DataScience-EngineeringExperts/mcp-warden/main/README.md)
- [Model Context Protocol — Wikipedia (MCP background and tool-poisoning context)](https://en.wikipedia.org/wiki/Model_Context_Protocol)
