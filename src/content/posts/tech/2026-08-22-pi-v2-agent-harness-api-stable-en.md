---
title: "Pi v2: AgentHarness API Goes Stable, Earendil Incorporates — Minimalism Enters Its Next Chapter"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pi, coding-agent, cli, open-source, ai-tools, harness-engineering, typescript]
lang: en
series:
  name: "Agent CLI 選型指南"
  order: 24
tldr: "Pi v0.84.0 (2026-08-06) promotes the AgentHarness v2 API to stable. Lane-based v4 Session model makes operations durable and interruptible. CBOR replaces JSON, Unix sockets replace HTTP. Earendil Inc. (Armin Ronacher's PBC) behind it has secured initial funding. 95.4K stars, still MIT, still minimal."
description: "Pi v2's AgentHarness v2 API, lane-based v4 Session, CBOR protocol, Unix socket transport, RemoteSession, Earendil incorporation, and how these changes affect the minimalist positioning."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable)

The [March article](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) concluded that Pi was a deliberately small harness — 4 tools, an ultra-short system prompt, explicit refusal to build MCP or sub-agents. Five months later, Pi reached v0.84.0. On the surface, it's still the same Pi. Under the hood, the engine has been replaced.

On August 6, 2026, the [AgentHarness v2 API was promoted to stable](https://github.com/earendil-works/pi/releases/tag/v0.84.0). Disclosed at the same time: [Earendil Inc.](https://earendil.works/) — Armin Ronacher's Public Benefit Corporation behind Pi — has secured its initial round of funding. Repo stars reached 95,400, and the npm scope has stabilized at `@earendil-works`.

This article won't repeat the design philosophy from [the original piece](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en). It covers only what v2 actually changed.

## AgentHarness v2 API: What's Different

The v1 AgentHarness API was a thin wrapper — sessions were in-memory objects, tool returns were untyped JSON, error handling was inconsistent. It worked, but you wouldn't want to build on it.

v2 does three things:

### Lane-based v4 Session Model

Sessions are no longer flat message arrays — they're **lane-based** structures. Each lane is an independent sequence of operations; a session is a collection of lanes.

The problem this solves is **durability**. v1 sessions lived in memory and disappeared when the process exited; v2 operations are durable — once written, they're guaranteed to persist, and interrupted sessions can resume from the breakpoint. Combined with the `Result<T, E>` return pattern (every tool call returns a typed success or failure instead of `any`), every step of a session has an explicit state.

Lanes can have dependencies between them. A typical session might have a main conversation lane, a tool execution lane, and a background task lane. The lane model lets these sequences advance independently without requiring a single global event stream.

### CBOR Replaces JSON

The v2 wire protocol switches from JSON to [CBOR (RFC 8949)](https://www.rfc-editor.org/rfc/rfc8949.html). CBOR is binary JSON — the same data structures, but without string encoding/decoding overhead, supporting zero-copy binary blob transfer.

Paired with **incremental length-prefixed framing**: each message sends its length first, then the body. The receiver doesn't need to scan for delimiters and can allocate buffers precisely.

Why the switch? Because v2 sessions can be large — tool returns carrying large code blocks, full state across multiple lanes — and JSON's UTF-8 encoding/escaping becomes a performance bottleneck at that scale. CBOR is 2-5x faster than JSON in this scenario (depending on binary content ratio), and Pi doesn't need a human-readable wire format — debugging can convert back to JSON at the application layer.

### Unix Socket Transport

v2's transport switches from HTTP to **Unix domain sockets**. The reasons are straightforward:

- No need to occupy a TCP port
- Lower latency than loopback TCP (no TCP handshake, no Nagle issues)
- File system permissions provide access control without an extra auth layer

This is also why Pi v2's headless mode can run so lean — a Unix socket plus CBOR, no HTTP server overhead needed.

## RemoteSession: Letting Someone Else Take Over Your Agent

v2 introduces `RemoteSession`, a controller that can connect to a running Pi instance and take over or observe its session.

Key components:

- **Session leases**: consumers acquire a lease on a session; other consumers can't write to it until the lease expires. This prevents conflicts from multiple clients operating on the same session simultaneously.
- **Transcript reducers**: compress the session's full transcript into a summary, so remote clients don't need to load the entire history to understand the current state.

Practical use cases: you're running Pi locally, switch to another machine mid-task, and connect via RemoteSession to continue. Or a monitoring system observes agent behavior through RemoteSession and injects commands when necessary.

## Earendil Inc.

Pi is no longer a pure personal project. [Earendil Inc.](https://earendil.works/) is a Public Benefit Corporation founded by Armin Ronacher (creator of Flask, co-founder of Sentry). The PBC legal structure requires the company to consider public benefit alongside profit.

What's publicly known:

- Initial funding round is closed (amount undisclosed)
- Team has expanded from Mario Zechner alone to several people
- Repo and npm ownership transferred to `earendil-works`
- MIT license unchanged

Incorporation's impact on users cuts both ways. The upside: with funding and team, Pi's maintenance and development velocity increases — bug fixes no longer depend on one person. The concern: a PBC is still a company, and commercial pressure may push Pi toward complexity — exactly contradicting its core "deliberately small" positioning.

From v0.84.0's actual changes, the current direction is "swap the engine underneath, leave the surface untouched" — the API is stronger but the tool count hasn't grown, the protocol changed but the system prompt is still short. How long this can hold is an open question.

## Still the Same Pi?

v2's core bet hasn't changed: **give the model the minimum, let users decide what to stack on top.**

Still 4 core tools. The explicit no-build list (MCP, sub-agents, plan mode, permission popups) is still in the README. Extensions and Skills are still the primary extension paths.

What changed is foundational quality:

| | v1 | v2 |
|---|---|---|
| Session model | In-memory objects | Lane-based v4, durable |
| Error handling | Untyped | `Result<T, E>` |
| Wire protocol | JSON / HTTP | CBOR / Unix socket |
| Remote control | None | RemoteSession + leases |
| Organization | Personal project | Earendil Inc. (PBC) |

Put differently: v1 Pi was a good knife with a grip that got slippery after extended use; v2 replaced the grip while keeping the blade unchanged.

## Risks

**v2 API just went stable.** v0.84.0 is the first release to mark AgentHarness v2 as stable; real-world adoption is still limited. CBOR + Unix socket is an uncommon combination in the Node.js ecosystem, and reference cases are scarce when things go wrong.

**PBC trajectory.** What will Earendil do with its funding? If the answer is "add a paid cloud hosting layer for Pi," the minimalist open-source core may stay unaffected. If the answer is "Pi becomes a platform," the core positioning shifts. Not enough information to judge yet.

**omp fork pressure.** [omp (Oh My Pi)](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) forked from Pi to build a batteries-included path, and v2's changes haven't brought the two closer — [omp 2 rewrote the entire codebase in Rust](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en). The Pi ecosystem has effectively split into two directions that will not reconverge.

## Comparison with Other Coding Agents

v2's changes bring Pi closer to other harnesses technically, but the positioning gap hasn't narrowed:

| | Pi v2 | Claude Code | dsh |
|---|---|---|---|
| Core tools | 4 | 20+ | Everything is a plugin |
| Extension model | Extensions / Skills | Hooks / Extension API | Cordis plugins |
| Wire protocol | CBOR / Unix socket | JSONL / stdio | Internal |
| Durability | Lane-based v4 Session | Yes | Session plugin |
| Organization | Earendil Inc. (PBC) | Anthropic | DeepSeek |

Pi remains the top choice when you want "an agent harness whose entire codebase you can read." Its foundation is just sturdier now.

## Overall

Pi v2 does something difficult: **upgrading the foundation without changing the positioning.** Lane-based sessions, CBOR protocol, Unix sockets, RemoteSession — these are infrastructure for building on top of, not features for using an agent. The message to developers: Pi is small enough to read completely, and solid enough to build on.

Earendil's incorporation gives this path more resources but also adds a variable. From the perspective of [harness evolution](/posts/ai/2026-03-28-harness-engineering-evolution), Pi takes another extreme — not making the harness "everything-swappable" (that's [dsh](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en)'s path), nor rewriting the entire stack in Rust (that's [omp 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en)'s path), but making minimalism itself production-ready.

## References

- [earendil-works/pi (GitHub)](https://github.com/earendil-works/pi)
- [Pi v0.84.0 Release Notes](https://github.com/earendil-works/pi/releases/tag/v0.84.0)
- [Earendil Inc. official website](https://earendil.works/)
- [CBOR — RFC 8949](https://www.rfc-editor.org/rfc/rfc8949.html)
- [pi.dev official website](https://pi.dev)
- Internal: [Pi Coding Agent: A Minimalist Open-Source Terminal Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) (in Chinese)
- Internal: [omp (Oh My Pi): The Batteries-Included Fork](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) (in Chinese)
- Internal: [OMP 2: Full Rust Rewrite as an Independent Coding Harness](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) (in Chinese)
- Internal: [DeepSeek Harness (dsh): Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) (in Chinese)
- Internal: [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) (in Chinese)
