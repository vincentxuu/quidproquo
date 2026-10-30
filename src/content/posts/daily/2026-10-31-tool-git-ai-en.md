---
title: "Tool of the Day｜gitai (git-ai) — let hundreds of coding agents land at once without queuing for a merge queue"
date: 2026-10-31
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source reimplementation of the design Anthropic publicly described for its internal version control system, Scion: compare-and-swap instead of a merge queue, so many coding agents can land changes on the same repo at once"
tldr: "gitai (the repo is called git-ai) is an MIT-licensed open-source CLI and server that independently reimplements the design Anthropic publicly described, but never open-sourced, for its internal version control system Scion: each agent's change is a changeset, landing happens through compare-and-swap instead of a merge queue, and conflicts can be auto-resolved by an LLM or a rule-based resolver — but only after your configured verify.command passes on the exact tree that would land. Install: `git clone`, then `make build` (needs Go 1.26, a C toolchain, Meson, and Ninja). A benchmark with 50 agents landing at once shows roughly 5x the throughput of a classic setup."
series:
  name: "AI Tool of the Day"
  order: 69
---

> 🌏 [中文版](/posts/daily/2026-10-31-tool-git-ai)

## Tool info

| Item | Value |
|---|---|
| Name | gitai (repo name: git-ai) |
| Type | CLI + self-hosted server (ships a Go SDK, compatible with standard Git repos underneath) |
| GitHub | [feder-cr/git-ai](https://github.com/feder-cr/git-ai) |
| Stars | 1,000+ (GitHub shows 1k, released 2026-10-23) |
| Language | Go |
| License | MIT |
| Install | `git clone https://github.com/feder-cr/git-ai.git && cd git-ai && make build` |

## What problem it solves

Anthropic says it merged around 2,500 changes a day in May this year, and that grew to over 30,000 a day by September — behind that number, almost every client became a coding agent or CI job that's online around the clock. Classic git hosting, including GitHub's merge queue, was built for humans: clone once, work for hours, push once, and it's fine if a conflict means waiting in line for revalidation. But once dozens or hundreds of short-lived tasks all want to land on the same branch within seconds, the queue itself becomes the bottleneck — GitHub's own docs describe a merge queue as revalidating a pull request together with the changes ahead of it in line, and kicking the whole group out to be requeued the moment any one of them fails. The more agents you add, the more that waiting and retrying stacks up linearly.

Anthropic's own answer was to build an in-house system called Scion and publish the design on its engineering blog, while stating plainly that Scion "isn't a suitable replacement for git for general use" outside Anthropic. gitai turns those publicly described ideas into something anyone can self-host, and its README is explicit that it's an independent project, unaffiliated with and not endorsed by Anthropic. The core mechanism: each agent's change is a changeset, and landing it means a compare-and-swap directly on that branch's ref instead of entering a queue; multiple lands on the same branch get batched into a single ref update. On a conflict, you can configure a resolver — rule-based or LLM-driven, both separate programs you choose yourself, since the gitai server itself never calls a language model — but whatever the resolver returns is only a proposal: it only lands if the `verify.command` you configured actually passes on the exact tree that would land; otherwise the conflict is handed back to the agent as a conflict package. In the official benchmark, 50 agents each land 5 changes on one branch, with 20% deliberately set up to conflict and no resolver enabled: the classic setup (the same server with batching turned off, where each agent rebases and retries its own compare-and-swap) needed 26.5–28.7 retries on average per landed change, with p99 latency of 4.4–5.2 seconds; gitai needed about 1 retry on average, with p99 latency of 1.9–2.7 seconds.

It fits teams already running many parallel coding agents against the same repo — automated CI fixes, multiple agents collaborating on one codebase — or anyone who's curious what the design in Anthropic's blog post actually looks like in practice. If you're running one or two agents that push occasionally, merge-queue queuing was never going to be your bottleneck, and this tool won't help. The build is also heavier than a typical git tool: `make build` compiles a bundled copy of Git, so it needs Go 1.26, a C toolchain, Meson, and Ninja — a plain `go install` won't get you there.

```diagram
title: 50 agents landing at once: classic git vs. gitai, lands per minute
desc: 50 agents each land 5 changes, 20% deliberately set up to conflict, no conflict resolver enabled. Classic (same server, batching off, each agent rebases and retries on its own) lands about 325 changes per minute on average; gitai (compare-and-swap, batched landing) lands about 1,716 — roughly a 5x increase.
caption: Data from git-ai's own benchmark (acceptance-phase4.sh, see doc/graft/BENCH.md), midpoint of the range across two test runs. Conversion: baseline y=300, 120 units per 1,000 lands/minute (y = 300 − value × 0.12), axis starts at 0.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">lands / minute</text>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">2000</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">1000</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="220" y="261" width="64" height="39"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="360" y="94" width="64" height="206"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="252" y="251" text-anchor="middle" dominant-baseline="central">≈325</text>
  <text class="dg-label dg-text--accent" x="392" y="84" text-anchor="middle" dominant-baseline="central">≈1,716</text>

  <text class="dg-sub" x="252" y="320" text-anchor="middle" dominant-baseline="central">classic</text>
  <text class="dg-label dg-text--accent" x="392" y="320" text-anchor="middle" dominant-baseline="central">gitai</text>
</svg>
```

## Getting started

### Install

```bash
git clone https://github.com/feder-cr/git-ai.git
cd git-ai
make build                       # builds Gitaly/graft/graft-cache into _build/bin (needs Go 1.26, a C toolchain, Meson, Ninja; also bundles and builds Git itself)
examples/graft/quickstart.sh     # spins up a server, a cache daemon, and two agents in a temp dir, runs the whole flow non-interactively
./_build/bin/graft               # the CLI entry point
```

### Basic usage

```bash
# Two agents each hold a token; policy decides who can write which branch (here, planner can write main)
export GRAFT_ADDRESS=unix:/var/lib/graft/run/cache.sock
export GRAFT_TOKEN="$(cat /etc/graft/tokens/planner)"
export GRAFT_USER=planner
export GRAFT_AUTHOR="planner <planner@example.com>"

graft clone "$GRAFT_ADDRESS" demo.git ./demo --branch main
cd ./demo
printf 'hello graft\n' > README.md
graft commit -m "Add README" --land main   # commits and tries to land on main via compare-and-swap

graft log                                   # the changeset log: who did what, and when
graft blame README.md                       # computed by the server, no full local history needed
```

### Advanced usage (optional)

```toml
# /etc/graft/config.toml: enable automatic conflict resolution, with an allowlist and a timeout
[graft.land.resolver]
enabled = true
command = ["/var/lib/graft/bin/graft-resolve", "--config", "/etc/graft/resolve.toml"]
timeout = "30s"
paths_allow = ["**"]
paths_deny = ["deploy/**", "*.lock"]   # conflicts under these paths never reach the resolver
actors = ["planner", "builder"]         # only these agents may request an AI-generated resolution
```

```bash
# Whatever the resolver returns is just a proposal — it only lands once your verify.command passes
graft land --resolve --conflicts-dir ./conflict   # on failure, writes the conflict package and both sides to a local directory for a human or another agent to pick up
```

The Graft server itself never calls a language model and never imports a vendor SDK — AI-based conflict resolution is off by default. Wiring in an LLM means configuring the separate `graft-resolve` module's `llm` strategy; it never happens automatically just because you installed the tool. Whether to use AI at all stays entirely the operator's own setting.

## Comparison with existing tools

Most teams facing "many agents changing one repo at once" today either lean on a platform's built-in serial queue, or just queue manually:

| | gitai | GitHub merge queue / Mergify | No tool, manual queuing |
|---|---|---|---|
| Many agents land at once, without a serial queue | ✅ one compare-and-swap per ref, batched retries on conflict | ❌ sequential revalidation; one failure kicks the whole group out to be requeued | ❌ |
| Client doesn't need a full clone; history is computed server-side | ✅ `ObjectService` serves only the objects/sparse tree you ask for | ❌ still a standard git clone | ❌ |
| Conflicts auto-resolved by LLM/rules, only land after verification | ✅ resolver + `verify.command`, AI off by default | ❌ every conflict goes back to a human | ❌ |
| Auto-tests after landing, bisects and reverts the culprit | ✅ `graft-verify` | Partial (CI can do this, but no built-in bisect/revert) | ❌ |
| License | MIT, self-hosted | Platform feature / commercial SaaS | — |

## Things to watch out for

- **Unofficial, independent reimplementation**: the README states plainly that gitai is an independent open-source build based on a publicly described design, unaffiliated with and not endorsed by Anthropic.
- **Still at 0.4.0**: interfaces may still change before 1.0, and known gaps (such as garbage collection of packs in the storage core) are listed in the project's own LIMITATIONS.md.
- **A heavier build than most git tools**: `make build` compiles a bundled copy of Git, so it needs Go 1.26, a C toolchain, Meson, and Ninja. The quickstart script is a quick way to try it in a temp directory, but wiring it up to a real database and object storage for production means following the shadow-to-authoritative migration steps in STORAGE.md.
- **A resolver's output is a proposal, not automatic trust**: a merged result from a resolver only lands after it passes your configured `verify.command` — but that command is only as good as the coverage you give it. Set it too loosely, and it's effectively no check at all.
- **Just released, no large-scale production feedback yet**: made public on 2026-10-23, with roughly 1,000 stars, 20 watchers, and 102 forks so far. That shows the community is paying attention, but it isn't the same as having been validated at scale in production.

## Today's takeaway

Anthropic's own blog post is blunt about it: Scion itself "isn't a suitable replacement for git for general use" outside the company, so they chose to publish the design rather than the code. Less than two weeks later, an independent developer rebuilt the core of it under the MIT license — compare-and-swap landing, server-side history, sparse workspaces — and even filled in a gap Anthropic admits it hasn't solved: Anthropic says it hasn't been able to replicate a global merge-queue lock, so it relies on Claude fixing conflicts after the fact; gitai instead treats a resolver's output as a proposal that only counts once your own verification passes. An engineering blog post turning into something runnable, with readable source, inside two weeks — that speed of the open-source ecosystem's response is worth noting on its own, independent of any single feature.

## References

- [feder-cr/git-ai — GitHub](https://github.com/feder-cr/git-ai)
- [git-ai README (raw)](https://raw.githubusercontent.com/feder-cr/git-ai/main/README.md)
- [git-ai QUICKSTART.md (raw)](https://raw.githubusercontent.com/feder-cr/git-ai/main/doc/graft/QUICKSTART.md)
- [git-ai RESOLVE.md (raw, conflict-resolution config)](https://raw.githubusercontent.com/feder-cr/git-ai/main/doc/graft/RESOLVE.md)
- [git-ai BENCH.md (benchmark details)](https://github.com/feder-cr/git-ai/blob/main/doc/graft/BENCH.md)
- [Redesigning source control at Anthropic](https://www.anthropic.com/research/redesigning-source-control)
- [Managing a merge queue — GitHub Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
