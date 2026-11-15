---
title: "Tool of the Day｜0 — an open-source AI security harness that runs web pentesting through binary reverse engineering in one pipeline"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "0 is an open-source AI security harness that unifies web pentesting, code review, package scanning and binary reverse engineering into one agent workflow, cuts false positives by re-verifying candidates in a fresh session, and ships as a CLI, an MCP server and a local browser console"
tldr: "0 is an open-source AI security harness from 0sec Labs (Y Combinator-backed), MIT OR Apache-2.0 licensed. Install: curl -fsSL https://raw.githubusercontent.com/0sec-labs/0/main/install.sh | bash. It splits a vulnerability investigation into Plan, Discover, Attack, Triage, Verify and Report, and the Verify step opens a fresh session with no memory of the prior steps to re-run each candidate finding for up to 5 turns — a structural answer to the high false-positive rate that plagues automated security scanning."
series:
  name: "AI Tool of the Day"
  order: 77
---

> 🌏 [中文版](/posts/daily/2026-11-13-tool-0security)

## Tool info

| Item | Value |
|---|---|
| Name | 0 (0sec Labs) |
| Type | CLI / local web UI / MCP server |
| GitHub | [0sec-labs/0](https://github.com/0sec-labs/0) |
| Stars | 1,323 (at review time; repo created 2026-08-19) |
| Language | TypeScript |
| License | MIT OR Apache-2.0 (dual-licensed; see the repo's LICENSE, LICENSE-MIT and NOTICE) |
| Install | `curl -fsSL https://raw.githubusercontent.com/0sec-labs/0/main/install.sh \| bash` |

## What problem it solves

Try to get an AI agent to help with a security assessment and you quickly run into a tooling split by target type: one AI pentest agent for web apps, a separate static analyzer for source code, and yet another workflow — usually a human opening Ghidra or angr by hand — for a compiled binary. Each tool speaks its own output format, so stitching findings together into one coherent picture is still your job. And the bigger failure mode for automated scanning usually isn't "it missed something" — it's "it reported too much." When an agent claims it found a vulnerability, nothing stops that claim from being its own misread of a string, with no independent check before it lands in a report.

0 folds all of those target types into a single pipeline. It isn't a model itself — it's a control plane that runs on top of whichever LLM you bring (the docs list 14 providers, plus Claude, Codex and Gemini CLI subscriptions), walking through six stages: Plan, Discover, Attack, Triage, Verify, Report. The first three run inside one continuous research-agent session: it picks candidate vulnerability classes, maps the target's endpoints, then tests those hypotheses. Web pentesting is shell-first — the agent drives bash with curl, python3 and sqlmap directly instead of calling a fixed set of wrapped HTTP tools. Triage then discards whatever doesn't have complete evidence. The part that actually matters is Verify: rather than letting the same conversation talk itself into a finding, 0 opens a brand-new session with no memory of how the candidate was found, and gives it up to 5 turns to reproduce the issue from scratch. The project's own framing is "reproduce before trusting." For compiled targets, a separate sub-engine called 0verse wraps Ghidra, angr and AFL++ and runs a local MCP server exposing 9 tools for scanning, triage, proof-of-vulnerability generation and reporting.

```diagram
title: 0's six-stage pipeline — Verify runs in a session with no memory of what came before
desc: Plan, Discover and Attack run inside one continuous research-agent session; Triage drops weak-evidence candidates; Verify reproduces each survivor from a fresh session before anything reaches the report
---
<svg viewBox="0 0 740 280">
  <rect class="dg-zone" x="10" y="58" width="365" height="114" rx="8"/>
  <text class="dg-tag" x="26" y="76" dominant-baseline="central">one continuous agent</text>

  <path class="dg-line" d="M115 122H140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M235 122H260" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M355 122H380" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M475 122H500" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M595 122H620" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M427 154V210" marker-end="url(#arrow-warn)"/>

  <rect class="dg-box" x="20" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="67" y="112" text-anchor="middle" dominant-baseline="central">Plan</text>
  <text class="dg-sub" x="67" y="134" text-anchor="middle" dominant-baseline="central">pick classes</text>

  <rect class="dg-box" x="140" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="187" y="112" text-anchor="middle" dominant-baseline="central">Discover</text>
  <text class="dg-sub" x="187" y="134" text-anchor="middle" dominant-baseline="central">map endpoints</text>

  <rect class="dg-box" x="260" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="307" y="112" text-anchor="middle" dominant-baseline="central">Attack</text>
  <text class="dg-sub" x="307" y="134" text-anchor="middle" dominant-baseline="central">test hypotheses</text>

  <rect class="dg-box" x="380" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="427" y="112" text-anchor="middle" dominant-baseline="central">Triage</text>
  <text class="dg-sub" x="427" y="134" text-anchor="middle" dominant-baseline="central">filter weak</text>

  <rect class="dg-box dg-box--accent" x="500" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="547" y="112" text-anchor="middle" dominant-baseline="central">Verify</text>
  <text class="dg-sub" x="547" y="134" text-anchor="middle" dominant-baseline="central">fresh session</text>

  <rect class="dg-box" x="620" y="90" width="95" height="64" rx="6"/>
  <text class="dg-label" x="667" y="112" text-anchor="middle" dominant-baseline="central">Report</text>
  <text class="dg-sub" x="667" y="134" text-anchor="middle" dominant-baseline="central">multi-format</text>

  <rect class="dg-box dg-box--warn" x="380" y="210" width="95" height="50" rx="6"/>
  <text class="dg-label" x="427" y="235" text-anchor="middle" dominant-baseline="central">discarded</text>

  <text class="dg-edge dg-text--warn" x="470" y="186" dominant-baseline="central">weak evidence</text>
</svg>
```

It fits teams that want a PR security gate in CI (0sec Labs runs a hosted version, 0cloud, that connects straight to a GitHub repo), anyone who wants a coding agent to do a security pass on its own changes, or someone handed a binary who wants an agent to do a first-pass triage before digging in by hand.

## Getting started

### Install

```bash
curl -fsSL https://raw.githubusercontent.com/0sec-labs/0/main/install.sh | bash
export PATH="$HOME/.0/bin:$PATH"

# first run opens a local browser console, no account needed
0
```

Add your own model provider (OpenAI, Anthropic, DeepSeek, OpenRouter, …) under Connections in the browser console and you're ready to go. It only supports Apple Silicon macOS or x64/ARM64 Linux (the docs also cover npm, Docker and source installs) and needs no GPU — inference runs wherever your model provider runs it.

### Basic usage

```bash
# list the built-in workflow templates
0 workflow list --templates

# run the security-research template against a local repo
0 workflow run --template security-research \
  --target /absolute/path/to/repo --workspace /absolute/path/to/repo

# see every run so far
0 runs list

# or just ask in plain language
0 chat --prompt "scan this repo for common web vulnerabilities"
```

### Advanced usage

```bash
# let Claude Code, Codex or another coding agent connect to 0's workflow engine over MCP
0 mcp-server --workflows --workspace /absolute/path/to/repo
```

Local MCP requires explicitly selecting a host-local execution profile; the "Connect an external agent" option in the browser console hands you the exact setup prompt to paste.

## How it compares

| | 0 (0sec Labs) | Strix | Shannon | CAI (Alias Robotics) |
|---|---|---|---|---|
| Stars | 1,323 | 75,158 | 51,782 | 9,859 (archived) |
| License | MIT OR Apache-2.0 | Apache-2.0 | AGPL-3.0 | MIT + partly research-only |
| Language | TypeScript | Python | TypeScript | Python |
| Interfaces | Web console / CLI / MCP | CLI / local web viewer / agent skills | CLI / CI actions | CLI / REPL, with MCP support |
| Scope | Web / LLM / MCP / source / packages / binaries / kernel | Code / web apps / APIs | Web apps and APIs (source required) | General-purpose offense/defense automation |
| Binary reverse engineering | ✅ 0verse (Ghidra / angr / AFL++) | Not documented | Not documented | Not documented |
| Status | Research preview | Active | Active | Archived 2026-08-28 |

Strix and Shannon both have far more stars than 0, but right now 0 is the only one of the four that publicly documents binary reverse engineering and kernel-level coverage — the clearest difference between it and the two more popular alternatives.

## Things to watch out for

- **The numbers are self-measured, and the vendor has already publicly walked one of them back.** The 93/95 (97.9%) headline is an "any retained success counts" aggregate score on XBOW web CTFs, not an established pass@1 rate; 0's own benchmark docs state outright that it's a dated snapshot from 2026-05-06, not a live leaderboard. More tellingly, a 2026-05-17 methodology post from the team admits that the same 104-challenge web benchmark, run cold with no prior warm-up, once scored only 45/104 (43.3%) — and that 39 of those challenges never even started (broken package sources, a Java startup failure, a port collision — infrastructure problems, not the agent failing to break in). An earlier version of their own blog had cited "103/104" as a general performance claim without spelling out those conditions, and that post has since retracted the framing. Publicly correcting your own inflated number is unusual, and it's also a reminder to ask, for any automated security tool's score, which environment, which run, and whether retries were allowed.
- **Authorized targets only, and the default shell runs on your own machine.** The README's "Status and safety" section is explicit that 0 is meant for systems you're authorized to assess, and recommends turning on the built-in scope plugin to bound what it can target. The default execution shell is the machine you're running 0 on — the docs recommend an isolated executor for anything you don't fully trust, rather than pointing it at your daily work machine.
- **It's a research preview, and results ride on whatever model you bring.** 0 ships no model of its own — the headline scores were all run on gpt-5.4 — and every scan bills your own provider account. The team's recorded cost is roughly $5.20 per solved XBOW challenge.

## Today's takeaway

Most AI security tool marketing pages stop at "found N vulnerabilities." 0 instead treats "found" and "trustworthy" as two separate steps: Triage drops whatever lacks complete evidence, then Verify hands each survivor to a fresh session with no memory of how it was found, and only keeps what actually reproduces. That's a meaningfully different bar than a single conversation talking itself into a finding — and it's why 0 is worth a look even with a fraction of the stars Strix and Shannon have: it answers automated security scanning's biggest trust problem with architecture (an independent verification session) rather than better prompting. The team publicly owning the fact that an earlier score claim wasn't properly qualified is, in its own way, another piece of that same honesty.

## References

- [0sec-labs/0 — GitHub](https://github.com/0sec-labs/0)
- [0 docs: Benchmark](https://docs.0.security/benchmark/)
- [0 blog: Before comparing scores, check what ran (2026-05-17, self-correcting the earlier "103/104" claim)](https://0.security/blog/xbow-benchmark-methodology-and-verification/)
- [0 docs: Integrations (CLI / MCP setup)](https://docs.0.security/integrations/)
- [MarkTechPost: 0sec Labs Open-Sources 0, an AI Security Harness With Web UI, CLI and MCP](https://www.marktechpost.com/2026/11/08/0sec-labs-open-sources-0-ai-security-harness/)
- [usestrix/strix — GitHub](https://github.com/usestrix/strix)
- [KeygraphHQ/shannon — GitHub](https://github.com/KeygraphHQ/shannon)
- [aliasrobotics/cai — GitHub (archived)](https://github.com/aliasrobotics/cai)
- [LICENSE-MIT (0sec-labs/0)](https://github.com/0sec-labs/0/blob/main/LICENSE-MIT)
