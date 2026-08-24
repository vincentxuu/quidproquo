---
title: "Grok Build: xAI's Rust Coding Agent That Uploaded Your Repo Before Going Open Source"
date: 2026-08-24
category: tech
type: deep-dive
tags: [grok-build, coding-agent, cli, xai, rust, ai-tools, harness-engineering, privacy]
lang: en
series:
  name: "Agent CLI 選型指南"
  order: 29
tldr: "Grok Build is xAI's Rust coding agent — 845K LOC, 8 parallel sub-agents, Arena Mode. May 2026 beta, July open-sourced (Apache 2.0) — but the direct trigger for open-sourcing was a privacy incident: it silently uploaded entire repos (including SSH keys, .env files) to Google Cloud Storage at a 27,800x traffic ratio. The exfiltration code remains in the binary, disabled only by a server-side flag."
description: "xAI Grok Build's Rust architecture, Arena Mode, 8 parallel sub-agents, and the privacy incident that led to open-sourcing: silent repo uploads, community response, and trust implications."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-24-grok-build-xai-privacy-incident)

On May 14, 2026, xAI (SpaceXAI) released [Grok Build](https://github.com/xai-org/grok-build) in beta, limited to SuperGrok Heavy subscribers ($299/mo). On May 25, it expanded to all SuperGrok and X Premium+ users.

On July 15, it was open-sourced under Apache 2.0.

The timing of the open-sourcing was not coincidental. Three days earlier, security researcher Cereblab published wire-level network captures proving Grok Build was silently uploading entire repos to Google Cloud Storage without user knowledge.

## The Privacy Incident

### Discovery

On July 12, 2026, Cereblab published their research report with complete network traffic captures.

### What Was Uploaded

**Entire Git repositories**, including:
- Full commit history
- `.env` files (API keys, database passwords)
- SSH keys
- Webhook secrets
- Even credentials that had been deleted but remained in Git history

On a 12 GB test repo, Grok Build uploaded **5.10 GiB** of data (all HTTP 200), while the model conversation in the same session used only **192 KB**. Upload traffic was **27,800 times** the conversation traffic.

### Privacy Toggle Didn't Work

Grok Build's settings included an "Improve the model" toggle. Disabling it did not stop uploads.

### The Fix

Around July 13, xAI stopped uploads via a **server-side configuration change**. No client update required.

The problem: security researchers confirmed the **exfiltration code remains in the open-sourced binary**, only disabled by a server-side flag. xAI can re-enable uploads without a client update.

### xAI's Response

- Claimed ZDR (zero data retention) was "always respected"
- Andrew Milich (project lead) cited his privacy credentials (Skiff, an E2EE app)
- Musk promised deletion of all previously uploaded data
- Acknowledged data retention was enabled by default for non-ZDR users during early beta
- Open-sourced on July 15, framed as letting developers "audit exactly what the tool does"

## Technical Architecture

Setting the privacy incident aside, Grok Build has several technically noteworthy design choices.

### Rust, 845K Lines

Grok Build is a Cargo workspace with the main binary crate `xai-grok-pager-bin`. 845,000 lines of Rust (GitHub language stats: 51M+ bytes).

Why so large? Because it's a periodic extract from SpaceXAI's internal monorepo, not purpose-built for open source. This means:

- Large LOC doesn't necessarily mean high architectural complexity — some is monorepo baggage
- **No external contributions accepted** — the README explicitly states "periodically synced from SpaceXAI monorepo"; the community can fork but not upstream

This contrasts with [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en)'s Rust choice. OMP 2's ~41 crates are a ground-up modular architecture; Grok Build's 845K lines are a corporate monorepo slice.

### 8 Parallel Sub-Agents

Grok Build supports up to 8 concurrent sub-agents, each in its own git worktree. The workflow has three stages: plan → search → build.

### Arena Mode

Arena Mode is Grok Build's unique feature: it spawns **competing agent outputs** displayed side-by-side with a context usage tracker. A dedicated adjudication session ranks the results.

The design assumption: a single call may not be good enough, so let multiple agents compete and pick the best. The cost is token consumption — Arena Mode uses at least 2x the inference cost.

### Fullscreen TUI

Grok Build's TUI is fullscreen with mouse support and browser-style tabs (edit/files/plans/search). By comparison, most coding agent CLIs are line-based REPL interfaces.

### Model Support

- Default: `grok-build-0.1` (purpose-built coding model, 256K context)
- Complex reasoning: Grok 4.3 (2M context)
- Current default (since Aug 12): Grok 4.6 (500K context)
- Supports routing through OpenRouter to any model, with in-session `/model` switching

## Installation

```bash
# macOS / Linux
curl -fsSL https://x.ai/cli/install.sh | bash

# From source
git clone https://github.com/xai-org/grok-build
cargo build -p xai-grok-pager-bin --release
```

First launch requires browser-based authentication.

## Current Status

Public beta. Approximately 24,500 stars (hit 12,100 within 20 hours of open-sourcing). Apache 2.0 but does not accept external PRs.

## Comparison with Other Coding Agents

| | Grok Build | OMP 2 | Claude Code | dsh |
|---|---|---|---|---|
| Language | Rust (845K LOC) | Rust (~41 crates) | TypeScript | TypeScript |
| Open source | Apache 2.0 (read-only) | MIT | Closed | MIT |
| Parallel agents | 8 + Arena Mode | Unknown | Single session | Cordis plugin |
| Privacy incident | Yes (repo upload) | No | No | No |
| Rust architecture | Monorepo extract | Ground-up design | N/A | N/A |
| External contributions | Not accepted | Accepted | N/A | Accepted |

## Overall

Grok Build has several technical highlights — Arena Mode is a unique quality assurance mechanism, 8 parallel sub-agents is the highest concurrency currently available, and the fullscreen TUI's interactivity beats line-based REPLs.

But the privacy incident is inescapable. Not because the bug was fixed — the exfiltration code **remains in the binary**, disabled only by a server-side flag. This means when using Grok Build, you're trusting not the code, but xAI's policy decisions.

Open source is usually the foundation of trust. But Grok Build's open source has two limitations: it doesn't accept external contributions (so the community can't modify behavior), and the motivation for open-sourcing was responding to a privacy incident (making the open-sourcing itself part of crisis PR).

In the [H2 2026 harness competition](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en), Grok Build's privacy incident is a warning for all coding agents: **users hand over full codebase access to the agent, and the agent must deserve that trust**.

## References

- [xai-org/grok-build (GitHub)](https://github.com/xai-org/grok-build)
- [Cereblab privacy research report](https://cereblab.com/research/grok-build-privacy)
- [Simon Willison's analysis](https://simonwillison.net/)
- Internal: [OMP 2: From Pi Fork to Full Rust Rewrite](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) (in Chinese)
- Internal: [DeepSeek Harness (dsh): Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) (in Chinese)
- Internal: [The H2 2026 Harness War](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en) (in Chinese)
