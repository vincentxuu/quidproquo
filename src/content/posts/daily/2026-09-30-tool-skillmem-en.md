---
title: "Tool Pick｜skillmem — Skills an Agent Learns That Can Both Strengthen and Fade"
date: 2026-09-30
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "skillmem is a local-first MCP memory server, but what it stores isn't facts — it's procedures that gain strength from outside evidence, decay on an Ebbinghaus schedule, and come with a built-in prompt-injection defense for imported memory"
tldr: "skillmem is an MCP server that gives Claude Code, Codex, and other coding agents a local skill memory that can both strengthen and forget. Install: pip install 'skillmem[semantic]', then skillmem init --claude-code. It solves the problem of existing memory tools storing everything indiscriminately and trusting whatever the agent itself claims was useful — skillmem only raises a skill's strength on evidence from outside the agent's own judgment (a passing test, an accepted diff), and any memory you haven't approved gets flagged as data, not instructions."
series:
  name: "AI Tool of the Day"
  order: 40
---

> 🌏 [中文版](/posts/daily/2026-09-30-tool-skillmem)

## Tool Info

| Item | Value |
|---|---|
| Name | skillmem |
| Type | MCP server (plus a CLI) |
| GitHub | [liza-studio/skillmem](https://github.com/liza-studio/skillmem) |
| Stars | 6 (created 2026-08-30, still an early-stage project) |
| Language | Python |
| License | Apache-2.0 |
| Install | `pip install 'skillmem[semantic]'` |

## What Problem It Solves

quidproquo has already covered three "local, no API key" agent memory tools in the past month — mcp-memory (Google's OKF Markdown format), localmem-mcp (recall never calls an LLM), and okf-agent-memory (Git-native, reviewable in a diff). All three solve the same layer of the problem: where memory lives and what format indexes it.

skillmem targets a different layer entirely: **what gets stored, when it should be trusted, and when it should be forgotten.** It doesn't store facts like user preferences — it stores reusable procedures: trigger, steps, outcome, lessons. The more important difference is how strength is earned. An agent claiming a skill "helped" never raises that skill's strength; only evidence outside the agent's own judgment counts — a test that passed, a diff that was accepted, or your own confirmation. Skills that go unused fade on an Ebbinghaus-style forgetting curve and eventually get archived (never deleted, always backed up), which is closer to how human memory actually works.

The third difference is that skillmem separates "memory" from "rule": every record carries a provenance tag (owner / agent / imported / derived), and only you, running `skillmem trust` at a terminal, can promote a memory into a rule the agent treats as authoritative. Anything unapproved is wrapped in an explicit marker telling the agent "this is data, not instructions" — a defense aimed squarely at the injection path where a document talks an agent into saving a rule, which then gets read back next session as if it were your own instruction. That's a genuinely different angle from the three memory posts before it, not just another storage backend.

Where this fits: teams running the same coding agent on repetitive maintenance or debugging work who want "how we fixed it last time" to surface automatically on the next similar task, without a memory layer that accepts whatever gets written to it with no trust boundary.

## Getting Started

### Install

```bash
# macOS / Linux
pip install 'skillmem[semantic]'   # or: uv tool install 'skillmem[semantic]'
skillmem doctor                     # downloads the embedding model once (~220 MB)
skillmem init --claude-code         # wires the MCP server and hooks into Claude Code
```

Windows uses `install.ps1` via PowerShell. It also supports `--codex`, `--cursor`, `--windsurf`, `--gemini`, and `--opencode` — combine multiple flags in one run to have several agents share the same database.

### Basic Usage

Once installed, Claude Code automatically gets 9 `mem_*` MCP tools, which the agent typically calls on its own:

```bash
# The agent calls this after finishing a task that took real debugging:
skillmem learn fix-flaky-ci -t "Intermittent CI failure" \
  --trigger "pytest times out sporadically in CI" \
  --steps "Increased the fixture timeout; confirmed the DB connection pool was exhausted" \
  --outcome success

# Before the next similar task, the agent (or you) recalls relevant procedures:
skillmem recall "how to fix intermittent CI timeouts"
```

### Advanced Usage

```bash
# Only outside evidence raises a skill's strength — e.g. a test actually passing
skillmem reinforce fix-flaky-ci --outcome success

# Promote a memory into a rule you trust (terminal-only; an agent calling it via Bash is refused)
skillmem trust fix-flaky-ci

# Import a skill pack someone else shared — it's untrusted by default, provenance tracked throughout
skillmem skills add DietrichGebert/ponytail
skillmem skills ls   # strength, confirmations, and failures per skill
```

## Compared to Existing Approaches

| | skillmem | mcp-memory / okf-agent-memory | localmem-mcp |
|---|---|---|---|
| What it stores | Procedures | Facts / decision records | Facts |
| What can raise strength | Outside evidence only (a test, a diff, your confirmation) | No reinforcement mechanism | No reinforcement mechanism |
| Active forgetting | Yes (Ebbinghaus schedule, restorable) | No | No |
| Trust boundary on imported content | Explicit tiers (owner/agent/imported/derived); unapproved content flagged as data | No distinction | No distinction |
| Tamper detection | SHA256 hash chain, `skillmem verify` | No | No |
| Shared memory across agents | Yes (Claude Code, Codex, plus 4 other agents) | Partial | Partial |

## Things to Watch

- **This is a very new project.** Created 2026-08-30, only 6 stars on GitHub, 2 open issues — essentially an early-stage personal project, usable but without large-scale production track record yet.
- **The owner-only commands aren't a real wall.** The README says so plainly: commands like `trust` and `rm` check whether they're running in a terminal, but forging a TTY with `script` gets past that; the deny rules are also just substring matches, so a backtick or a different quoting pattern in the command line can slip through. If you let an agent run Bash unattended, don't rely on this layer.
- **The semantic feature downloads a 220MB model.** You can skip it and use BM25 full-text search only, but you lose the cross-language capability (e.g. a Chinese query finding an English skill).
- **The `session-recap` hook calls `claude -p`.** Even rate-limited (once per 600 seconds by default) and stripped of every tool, this still adds one extra LLM call at the end of every session, with the corresponding latency and token cost.

## Today's Takeaway

Most agent memory tools so far have competed on retrieval speed and format compatibility. skillmem is a reminder of something more fundamental: the risk in a memory tool isn't failing to store something — it's **storing the wrong thing and then trusting it unconditionally**. An injected document that talks an agent into "learning" a fake rule gets executed as if you'd said it yourself next time. Splitting "who said this" from "how much should it be trusted" into two separate fields does more for a tool's safety than any retrieval algorithm.

## References

- [liza-studio/skillmem — GitHub](https://github.com/liza-studio/skillmem)
- [skillmem CHANGELOG (0.9.0–0.10.0 changes and known issues)](https://github.com/liza-studio/skillmem/blob/main/CHANGELOG.md)
- [skillmem INVARIANTS (specification behind the 16 tested invariants)](https://github.com/liza-studio/skillmem/blob/main/docs/INVARIANTS.md)
- [We wrote down 16 promises our MCP server makes, then two models spent ten days trying to break them — DEV Community](https://dev.to/sergey_petrukovich_c94a17/we-wrote-down-16-promises-our-mcp-server-makes-then-two-models-spent-ten-days-trying-to-break-them-42f9)
- [GitHub API: liza-studio/skillmem repository metadata](https://api.github.com/repos/liza-studio/skillmem)
