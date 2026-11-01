---
title: "Tool of the Day｜Agent Cockpit — makes every research claim traceable back to the code that produced it"
date: 2026-11-02
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "A local whiteboard plus MCP server that catches a silently invalidated 'verified' claim with content hashes instead of trusting an agent's self-report"
tldr: "Agent Cockpit is an AGPL-3.0 local whiteboard and MCP server: any MCP-capable agent (Claude Code, Codex, Cursor, Gemini CLI) draws its research work onto the same board. Install: `git clone https://github.com/chutingyean/Agent-Cockpit.git && cd Agent-Cockpit && npm install && npm run demo`. It solves the problem of an agent quietly editing a helper function and nobody noticing that a previously 'verified' claim no longer holds — by hashing every experiment run, every file it depends on, and every function it actually reaches. When a hash changes, the claim is flagged. No LLM calls, zero tokens."
series:
  name: "AI Tool of the Day"
  order: 71
---

> 🌏 [中文版](/posts/daily/2026-11-02-tool-agent-cockpit)

## Tool info

| Item | Value |
|---|---|
| Name | Agent Cockpit |
| Type | Local whiteboard + MCP server (any MCP-capable agent: Claude Code, Codex, Cursor, Gemini CLI) |
| GitHub | [chutingyean/Agent-Cockpit](https://github.com/chutingyean/Agent-Cockpit) |
| Stars | 132 (created 2026-10-26, climbed up in just over a week) |
| Language | JavaScript (Node.js; the web board is framework-free, no build step) |
| License | AGPL-3.0-or-later |
| Install | `git clone https://github.com/chutingyean/Agent-Cockpit.git && cd Agent-Cockpit && npm install && npm run demo` |

## What problem it solves

Let an AI agent run research for a few days and the same thing keeps happening: it edits a grader, a data pipeline, or a shared statistics helper, and a claim that was "verified" quietly stops holding — nobody notices. The change itself goes unreported, or the agent reports only part of what it touched. Decisions meant for a human pile up unanswered, untested assumptions harden into foundations, and the agent keeps tweaking a hyperparameter "one more time." The codebase grows faster than anyone can actually read it.

Agent Cockpit turns these failure modes into rules a machine can check, all shown on one board. The core idea is an evidence chain: a claim has to cite a value that some recorded run actually wrote — it can't just assert something. Every run records the hash of its own script, the hash of every file it depends on, and the hash of every function it actually reaches. If any of those hashes change, the run is marked stale, and every claim built on it gets flagged for a recheck. Revert the change and the hashes line up again — the claim recovers automatically, no human has to track it by hand. Every write — from MCP, the CLI, or the board itself — passes through the same validation gate; a non-compliant write is rejected with a reason, so the agent can't claim it didn't know the rule, and rejections are logged too. All of this is hash comparisons and fixed rules — no LLM call, zero token cost.

```diagram
title: How a claim goes from valid to stale
desc: A claim must cite a value a run actually wrote; afterward, whether reported or not, if a file hash involved changes, the claim is flagged stale pending recheck.
caption: Simplified from Agent Cockpit's README, "content hashes, not timestamps." Reverting the change makes the hashes match again and the claim recovers automatically — that path is left out here for simplicity.
step: cockpit_run executes an experiment, hashing the script, its dependency files, and the functions it reaches
step: the agent registers a claim with cockpit_claim, citing a field this run actually wrote
step: a file changes later, whether reported or not
step: compare the current hash against the one on record
step: hashes match — the claim stays valid
step: hashes don't match — the claim is flagged stale, queued for recheck
---
<svg viewBox="0 0 700 496">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 108V136" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 188V216" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M280 268V296" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M420 344H460" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 388V416" marker-end="url(#arrow-warn)" data-step="6"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="124" y="60" width="312" height="48" rx="6"/>
    <text class="dg-label" x="280" y="76" text-anchor="middle" dominant-baseline="central">cockpit_run runs experiment</text>
    <text class="dg-sub" x="280" y="96" text-anchor="middle" dominant-baseline="central">hashes script/files/functions</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="124" y="140" width="312" height="48" rx="6"/>
    <text class="dg-label" x="280" y="156" text-anchor="middle" dominant-baseline="central">cockpit_claim registers claim</text>
    <text class="dg-sub" x="280" y="176" text-anchor="middle" dominant-baseline="central">evidence cites this run's output</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="156" y="220" width="248" height="48" rx="6"/>
    <text class="dg-label" x="280" y="236" text-anchor="middle" dominant-baseline="central">a file changes later</text>
    <text class="dg-sub" x="280" y="256" text-anchor="middle" dominant-baseline="central">whether reported or not</text>
  </g>

  <g data-step="4">
    <path class="dg-box" d="M280 300L420 344L280 388L140 344Z"/>
    <text class="dg-label" x="280" y="334" text-anchor="middle" dominant-baseline="central">hash still match?</text>
    <text class="dg-sub" x="280" y="356" text-anchor="middle" dominant-baseline="central">script/deps/functions</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="464" y="320" width="196" height="48" rx="6"/>
    <text class="dg-label" x="562" y="344" text-anchor="middle" dominant-baseline="central">claim stays valid</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--warn" x="116" y="420" width="328" height="56" rx="6"/>
    <text class="dg-label" x="280" y="438" text-anchor="middle" dominant-baseline="central">claim flagged stale</text>
    <text class="dg-sub" x="280" y="458" text-anchor="middle" dominant-baseline="central">revert it and hashes match again</text>
  </g>

  <text class="dg-edge" x="440" y="332" text-anchor="middle" dominant-baseline="central" data-step="5">yes</text>
  <text class="dg-edge dg-text--warn" x="292" y="402" text-anchor="start" dominant-baseline="central" data-step="6">no</text>
</svg>
```

Good fit: a research project where several agents hand off work in turn (say, Claude Code lays the groundwork and Codex picks it up); a setting where certain decisions genuinely need to stop and wait for a human instead of letting the agent plow ahead on its own; and anywhere you want to be able to replay the whole event sequence after something breaks, instead of guessing from memory where it went wrong.

## Quick start

### Install

```bash
git clone https://github.com/chutingyean/Agent-Cockpit.git
cd Agent-Cockpit
npm install
npm run demo                                       # builds a demo research repo: 6 real runs, 6 claims
node bin/cockpit.mjs serve --repo demo/research    # open http://127.0.0.1:4180
```

### Basic usage

```bash
# switch to your own research repo (must already be a git repo)
cd /path/to/your-research
node /path/to/Agent-Cockpit/bin/cockpit.mjs init     # writes MCP configs, AGENTS.md, Stop hook, pre-commit
node /path/to/Agent-Cockpit/bin/cockpit.mjs serve    # opens the board
node /path/to/Agent-Cockpit/bin/cockpit.mjs run -- python3 train.py --lr 1e-3   # records this experiment
```

`init` only writes inside your own repo. Any agent that opens the repo picks up `AGENTS.md` and the MCP config, and gets tools including:

```text
cockpit_overview   # call this first: pending decisions, claims needing recheck, unreported changes
cockpit_claim      # register a claim; evidence must be a file and field a recorded run actually wrote
cockpit_run        # run an experiment and record it
cockpit_decide     # ask a human, and wait for the answer before continuing
cockpit_report     # report which files changed
```

### Advanced usage

```bash
node bin/cockpit.mjs demo --break      # quietly loosens the grader's matching rule, unreported
node bin/cockpit.mjs demo --restore    # put it back: hashes line up again, the claim recovers
```

This pair demonstrates the whole point: an unreported change still gets caught, because what's being checked is a hash, not a promise that the agent will mention everything it touched.

## Compared to existing approaches

| | Agent Cockpit | Manually tracking git log/diff | Just asking the agent "what did you change" |
|---|---|---|---|
| Detects unreported file changes | ✅ content-hash comparison catches it even when unreported | Someone has to remember to diff it — easy to miss | ❌ if the agent says it didn't, that's taken at face value |
| Stale claims auto-flag and propagate downstream | ✅ | Have to manually track which claim depends on which file | ❌ |
| Needs an LLM call to check | ❌ zero tokens, pure rule evaluation | — | The check itself is an LLM call — not reliable |
| Handing off between agents on the same project | ✅ identity comes from the MCP handshake, board is shared | Relies on verbal handoff or docs, easy to drop | Easy to drop |
| Can replay the whole event sequence afterward | ✅ append-only event log, scrubbable | Guess the order from git log | ❌ |

## Caveats

- **AGPL-3.0-or-later**: if you distribute a modified version to others over a network (say, running a shared board as a service for your team), the license requires you to offer the source for your version. Running it locally for yourself or your own team usually doesn't trigger that, but check your actual use case before relying on it in a commercial product.
- The project is young (created 2026-10-26, version 0.1.0). The README, tutorial, and demo are thorough, but there's no track record yet at production scale. Run the demo and get a feel for how it decides "stale" before trusting it with a claim that actually matters.
- The built-in code graph and code review are lightweight fallbacks for when nothing else is installed; install the real [graphify](https://github.com/Graphify-Labs/graphify) or [open-code-review](https://github.com/alibaba/open-code-review) and Agent Cockpit switches to them automatically — behavior may differ slightly.
- The board binds to 127.0.0.1 by default; it's designed as a local tool, not something meant to be exposed as a service. Sharing it across people means figuring that out yourself (same machine, or your own reverse proxy — which brings back the AGPL network clause above).

## Takeaway

Until now, the question of whether a research agent quietly changed something has mostly relied on manual review or on trusting the agent's own report. Agent Cockpit turns that trust problem into a plain engineering one: content hashing makes "does this claim still hold" a question a machine can answer directly, without anyone's honesty required. It's basically the security principle "don't trust input, verify it" — except this time the input being verified is the agent's own account of its work.

## References

- [chutingyean/Agent-Cockpit — GitHub](https://github.com/chutingyean/Agent-Cockpit)
- [Agent Cockpit tutorial](https://github.com/chutingyean/Agent-Cockpit/blob/main/docs/tutorial.md)
- [Agent Cockpit README](https://github.com/chutingyean/Agent-Cockpit/blob/main/README.md)
- [LICENSE (AGPL-3.0-or-later)](https://github.com/chutingyean/Agent-Cockpit/blob/main/LICENSE)
- [THIRD_PARTY_NOTICES.md](https://github.com/chutingyean/Agent-Cockpit/blob/main/THIRD_PARTY_NOTICES.md)
