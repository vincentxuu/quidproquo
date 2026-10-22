---
title: "Tool Pick｜landmine — Tell Your Coding Agent About the Bug Your Exact Version Already Has"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source CLI scans your lockfile for each package's exact pinned version, matches it against open GitHub issues filed on that version, and gets the known bug and workaround into the agent's context before it makes the mistake"
tldr: "landmine is a CLI, pre-edit hook and MCP server rolled into one. It scans your lockfile for each direct dependency's exact pinned version, matches it against open GitHub issues filed against that version, and writes the known bugs and community workarounds into AGENTS.md/CLAUDE.md, or blocks the agent once when it's about to hit one. Install: `npx landmines scan && npx landmines install --rules`. It solves the problem of an agent writing code that trips a known bug in the exact version you have pinned."
series:
  name: "AI Tool of the Day"
  order: 62
---

> 🌏 [中文版](/posts/daily/2026-10-23-tool-landmine)

## Tool Info

| Item | Value |
|---|---|
| Name | landmine |
| Type | CLI + pre-edit hook + MCP server |
| GitHub | [devanshranjan10/landmines](https://github.com/devanshranjan10/landmines) |
| Stars | 7 |
| Language | TypeScript |
| License | MIT |
| Install | `npx landmines scan && npx landmines install --rules` |

## What Problem It Solves

Your project pins `drizzle-orm@0.36.0` in `package-lock.json`. Asked to close a database connection pool, an agent naturally writes `await db.$client.end()` — that's what the official docs teach, and the model has probably seen it in training too. But that exact version of drizzle-orm has a known bug on that call: someone filed a GitHub issue about it back in 2024, and the comments include a working patch. The agent has no way to know this. It's not a missing API or a syntax error — it's a trap that only exists at this one pinned version, and type checking and linting won't catch it either.

landmine's job is straightforward: read your lockfile (npm, pnpm, yarn, bun, uv, and poetry are all supported), and for every direct dependency's exact pinned version, search GitHub for open issues that actually name that version in the title or a comment. It verifies each hit really applies (filtering out reverse mentions like "fixed in" or "works after upgrading to"), extracts the code symbols the issue is talking about, and picks the most-upvoted workaround from the thread — all into `.landmine/index.json`. From there it hands that "known landmines" list to the agent three ways: a passive "known open bugs" section written into AGENTS.md/CLAUDE.md that the agent reads before it starts; a pre-edit hook that blocks a risky edit once, the moment the agent is about to write code that trips the bug, handing it the issue and the workaround; or an MCP server the agent can query on demand when it hits an error it can't explain.

Good fit: teams that pin exact dependency versions and lean on coding agents (Claude Code, Codex, Cursor, and the rest) — especially for packages whose bugs surfaced after the model's training cutoff, which is exactly the blind spot an agent has no reason to think to check.

```diagram
title: How landmine hands known bugs to the agent
desc: landmine scans the lockfile, matches it against GitHub issues, and builds an index — then delivers it to the agent three ways: writing it into CLAUDE.md, installing a pre-edit hook, or letting the agent query it over MCP.
caption: Simplified; omits version verification and trigger-card generation.
---
<svg viewBox="0 0 800 340">
  <path class="dg-line" d="M120 172H136" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M284 172H300" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 172H444Q452 172 452 164V56Q452 48 460 48H464" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 172H464" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 172H444Q452 172 452 180V280Q452 288 460 288H464" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 48H616Q620 48 620 56V164Q620 172 624 172H628" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 172H628" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M612 288H616Q620 288 620 280V180Q620 172 624 172H628" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="20" y="140" width="100" height="64" rx="6"/>
  <text class="dg-label" x="70" y="163" text-anchor="middle" dominant-baseline="central">Lockfile</text>
  <text class="dg-sub" x="70" y="183" text-anchor="middle" dominant-baseline="central">pinned versions</text>

  <rect class="dg-box dg-box--accent" x="136" y="140" width="148" height="64" rx="6"/>
  <text class="dg-label" x="210" y="163" text-anchor="middle" dominant-baseline="central">landmine scan</text>
  <text class="dg-sub" x="210" y="183" text-anchor="middle" dominant-baseline="central">queries GitHub</text>

  <rect class="dg-box dg-box--store" x="300" y="140" width="140" height="64" rx="6"/>
  <text class="dg-label" x="370" y="163" text-anchor="middle" dominant-baseline="central">index.json</text>
  <text class="dg-sub" x="370" y="183" text-anchor="middle" dominant-baseline="central">known-bug list</text>

  <rect class="dg-box" x="464" y="20" width="148" height="56" rx="6"/>
  <text class="dg-label" x="538" y="39" text-anchor="middle" dominant-baseline="central">CLAUDE.md</text>
  <text class="dg-sub" x="538" y="59" text-anchor="middle" dominant-baseline="central">rules section</text>

  <rect class="dg-box" x="464" y="140" width="148" height="64" rx="6"/>
  <text class="dg-label" x="538" y="163" text-anchor="middle" dominant-baseline="central">pre-edit hook</text>
  <text class="dg-sub" x="538" y="183" text-anchor="middle" dominant-baseline="central">blocks once</text>

  <rect class="dg-box" x="464" y="260" width="148" height="56" rx="6"/>
  <text class="dg-label" x="538" y="279" text-anchor="middle" dominant-baseline="central">MCP server</text>
  <text class="dg-sub" x="538" y="299" text-anchor="middle" dominant-baseline="central">agent queries it</text>

  <rect class="dg-box dg-box--accent" x="628" y="140" width="148" height="64" rx="6"/>
  <text class="dg-label" x="702" y="163" text-anchor="middle" dominant-baseline="central">Coding Agent</text>
  <text class="dg-sub" x="702" y="183" text-anchor="middle" dominant-baseline="central">Claude Code, etc.</text>
</svg>
```

## Quick Start

### Install

```bash
# One-off trial
npx landmines scan                 # find the open issues filed against your pinned versions
npx landmines install --rules      # writes into AGENTS.md / CLAUDE.md, plus a pre-edit hook

# For a team: install as a dev dependency so everyone shares one index
npm i -D landmines
npx landmines scan && npx landmines install --rules
```

`scan` needs a `GITHUB_TOKEN` (or `GH_TOKEN`, or `gh auth token`) to call GitHub search — an unscoped token is enough for public repos. The installed hook itself never touches the network.

### Basic Usage

The README documents a real headless Claude Code run: the project pins `drizzle-orm@0.36.0`, and the prompt only asked for "add an exported `closeDb()` function to `src/db.ts` that closes the underlying Postgres connection pool" — no mention of any bug. Claude's first edit was `db.$client.end()`, and landmine's hook blocked it:

```
landmine: this edit uses `$client.end` from drizzle-orm@0.36.0, and an open
GitHub issue filed against exactly that version describes a bug there.

drizzle-team/drizzle-orm#3402 · [BUG]: node-postgres client doesn't have end function
Workaround from @cluah (1 reaction):
> const pool = new pg.Pool(…); const db = drizzle(pool);
```

Claude then switched to building its own `pg.Pool` and closing it with `pool.end()`, explaining in its reply: "My first attempt used `$client.end()`, but landmine flagged a known bug in drizzle-orm 0.36.0 (#3402), so I avoided it by creating my own connection pool."

### Advanced Usage

With the MCP server installed, the agent can query it proactively whenever something doesn't add up — no need to wait for the hook to fire:

```bash
npx landmines install --mcp        # writes into .mcp.json
```

```
User: "Comparing two pydantic RootModel instances with == gives inconsistent
results — check whether this is a known open bug in the exact pydantic
version we pin."
Agent calls landmine_search → reports pydantic#10544, filed against the
pinned 2.9.2.
```

CI or pre-commit can check only the lines that actually changed:

```bash
npx landmines check --staged --exit-code   # checks staged lines only, exits 1 on a hit
```

## Comparison with Existing Tools

The author's own benchmark (21 tasks built from GitHub issues filed after the model's training cutoff, run against Claude Sonnet 5.5):

| Intervention | Pass rate |
|---|---|
| Nothing | 35/42 |
| Web search (WebSearch + WebFetch) | 36/42 |
| Context7 docs MCP | 35/42 |
| landmine's rules section in CLAUDE.md | **42/42** |

Across those same tasks, in the 84 runs where web search or Context7 was available, the agent never once reached for either tool — nobody told it there might be a known bug worth checking, so it had no reason to look. That's precisely the gap landmine is trying to close: the issue isn't a shortage of tools, it's that the agent doesn't know which direction to be suspicious in.

| | landmine | Context7 (docs MCP) | GitHub's official MCP issue search |
|---|---|---|---|
| Reads your lockfile and matches exact pinned versions | ✅ | ❌ | ❌ (manual search only) |
| Proactively injects known bugs into context (no need for the agent to think to look) | ✅ (rules mode) | ❌ | ❌ |
| Intercepts the agent once when it writes code that would trip the bug | ✅ (hook mode) | ❌ | ❌ |
| Coverage | Open issues on pinned versions only | Official docs (no bug discussions) | Depends on the agent proactively searching |

## Things to Watch For

- **Exact versions only.** Issues that say "broken since 2.5" or "on 3.x" with no version named, or name none at all, won't match. Closed issues for bugs already fixed in a release you haven't upgraded to are excluded too.
- **The pre-edit hook rarely fires in practice.** The author is candid about this in the Accuracy section: across 180 real source files, unverified symbol matches alone were wrong 25 times out of 28; after cross-verification, only 1 of 60 held-out files got blocked, and even that was a near-miss (right API and option, wrong calling form). The CLAUDE.md rules section is where the actual gain comes from — not the hook.
- **GitHub comments are untrusted text.** The "workaround" quoted from an issue thread was posted by a stranger. landmine delimits it and flags suspicious links, but the project itself warns against letting an agent run a quoted command without reading it first.
- **`scan` talks to three external services.** npm registry, PyPI, and the GitHub API all receive your direct dependency names and versions. The optional `cards` feature additionally sends each issue's full thread to whichever model provider you configure.

## Today's Takeaway

There's a counterintuitive result buried in this benchmark: the pre-edit hook — the part that took the most engineering effort (symbol matching, trigger cards, offline heuristics) — performed about the same as doing nothing at all (86% vs. 86%). What actually pushed the pass rate from 86% to 99% was the simplest possible move: writing the known-bug list as plain text into CLAUDE.md, so the agent reads it passively before it starts coding. Worth remembering if you're building agent tooling: the gap is rarely "the model lacks the ability" or "it doesn't have the right tool" — it's "it had no reason to think to look." Putting the clue somewhere the agent is guaranteed to read often beats building a cleverer interception mechanism.

## References

- [landmine official site](https://landmine.tech)
- [devanshranjan10/landmines — GitHub](https://github.com/devanshranjan10/landmines)
- [README — Benchmark／Accuracy／How it works](https://raw.githubusercontent.com/devanshranjan10/landmines/main/README.md)
- [drizzle-team/drizzle-orm#3402 — the issue quoted in the example](https://github.com/drizzle-team/drizzle-orm/issues/3402)
- [Model Context Protocol](https://modelcontextprotocol.io)
