---
title: "Antigravity CLI: Google Replaces a 100K-Star Open-Source Tool with a Closed-Source Go Binary"
date: 2026-08-24
category: tech
type: deep-dive
tags: [antigravity-cli, coding-agent, cli, google, ai-tools, harness-engineering, gemini]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 27
tldr: "At Google I/O 2026, Antigravity CLI (agy) replaced Apache 2.0 Gemini CLI with a closed-source Go binary. Technical upgrades — multi-agent orchestration, native sandbox, millisecond startup — but free tier cut 98%, open-to-closed source, 28-day transition window. Community reaction was sharp."
description: "Antigravity CLI replacing Gemini CLI: Go rewrite, multi-agent orchestration, native sandbox architecture, and the open-to-closed source controversy with 98% free tier reduction."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google)

Gemini CLI was Google's open-source coding agent, launched in 2025 under Apache 2.0. It accumulated over 100,000 stars and 6,000+ merged community PRs. On May 19, 2026, Google I/O announced its replacement: [Antigravity CLI](https://antigravity.google) (binary name `agy`), a closed-source Go binary.

On June 18, Gemini CLI stopped serving requests for free, Pro, and Ultra users. From announcement to shutdown: 28 days.

## From Gemini CLI to Antigravity CLI

Timeline:

- **2026-05-19**: Google I/O 2026 announces the Antigravity 2.0 platform; agy is the terminal component
- **2026-05-20**: Official blog post: "An important update: Transitioning Gemini CLI to Antigravity CLI"
- **2026-06-18**: Gemini CLI stops responding for free / Pro / Ultra users
- **Exception**: Gemini Code Assist Standard/Enterprise licenses and paid Gemini API keys continue working

Antigravity CLI isn't an incremental upgrade of Gemini CLI. It's a full rewrite — TypeScript/Node.js to Go, open-source to closed-source, community-driven to Google-controlled.

## Technical Architecture

### Go Replaces TypeScript

Gemini CLI ran on Node.js, with startup time and memory constrained by V8. Antigravity CLI compiles to a single Go binary with millisecond startup and single-digit MB memory footprint.

The cost of this choice is community participation. TypeScript Gemini CLI had 6,000+ community PRs; the Go binary has no public source code and accepts no external contributions.

### Multi-Agent Orchestration

agy has a built-in asynchronous sub-agent orchestrator. The main conversation isn't blocked by background tasks — documentation lookup, builds, and validation can be handled by parallel sub-agents.

This is a different approach from [dsh](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en)'s plugin-style sub-agents and [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en)'s typed tool registry. dsh lets you swap every layer of the agent loop; OMP 2 compiles all tools into one binary; agy makes multi-agent a built-in platform capability that users don't need to configure.

### Native Sandbox

agy uses OS-native sandbox mechanisms for isolation with zero startup overhead. By comparison, most coding agents' sandboxes rely on Docker or VMs with second-level startup costs.

### Model Support

Default model is Gemini 3.5 Flash. Paid plans additionally support Gemini 3.1 Pro, Claude Sonnet 4.6, Claude Opus 4.6, and GPT-OSS 120B. A Google CLI tool supporting Anthropic and OpenAI models — this didn't exist in the Gemini CLI era.

## 121 Commands

agy ships with 121 commands (subcommands, flags, slash commands, plugins, shortcuts, settings). It preserves Gemini CLI's core concepts — Agent Skills, Hooks, Subagents, MCP servers — and renames Extensions to Plugins.

Migration from Gemini CLI has a dedicated command:

```bash
agy plugin import gemini
```

This converts old Gemini CLI extensions to Antigravity plugin format. However, not all Gemini CLI features had counterparts at launch — some integration modes were missing, and one MCP config field fails silently.

## Pricing and Quotas

| Plan | Monthly | Daily Requests | Models |
|---|---|---|---|
| Free | $0 | ~20 | Gemini Flash |
| Pro | ~$20 | More (5-hour refresh cycle) | Multi-model |
| Ultra | $100 | More | All models |
| Ultra Max | $200 | Highest | All models |
| Credits | $0.01 each | Overflow usage | Per plan |

Gemini CLI's free tier allowed roughly 1,000 requests per day. Antigravity CLI cut this to ~20, a 98% reduction. Community reports hitting limits after 6-7 prompts.

## The Open-Source Controversy

This is Antigravity CLI's biggest controversy.

Gemini CLI was Apache 2.0 with an active community. Contributor Andrea Alberti had a 27-commit PR merged the day of the policy turn and publicly asked whether contributors were doing "unpaid labor for a corporate codebase."

The [google-antigravity/antigravity-cli](https://github.com/google-antigravity/antigravity-cli) GitHub repo exists but contains only documentation and an issue tracker, not source code.

The New Stack ran pieces titled "Google pushes Pro, Ultra, and free users from open-source Gemini CLI to closed-source Antigravity CLI."

Technically, the Go rewrite and multi-agent orchestration are genuine improvements. But the licensing and pricing changes overshadow the technical discussion.

## Comparison with Other Coding Agents

| | Antigravity CLI | Claude Code | Pi v2 | dsh |
|---|---|---|---|---|
| Language | Go | TypeScript | TypeScript | TypeScript |
| Open source | Closed | Closed | MIT | MIT |
| Multi-agent | Built-in orchestrator | Single session | Single session | Cordis plugin |
| Sandbox | Native OS | Docker | None | None |
| Free tier | ~20/day | No free tier | Unlimited (bring API key) | Unlimited (bring API key) |
| Models | Multi-model | Claude only | Bring your own | Bring your own |

agy's positioning is as a Google ecosystem entry point — if your workflow is already on Google Cloud, agy's integration will be the smoothest. But if you want open-source, controllable, quota-free tools, [Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en) or [Opencode 2](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en) are entirely different choices.

## Overall

Antigravity CLI is technically a comprehensive upgrade over Gemini CLI — the Go binary is faster and lighter, multi-agent orchestration is a real capability jump, native sandbox solves startup costs.

But the way it launched damaged trust. A 100,000-star open-source project, 6,000 community PRs, a 28-day transition window, 98% quota reduction — these numbers don't describe technical problems, they describe a relationship problem.

In the [H2 2026 harness competition](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en), agy represents one approach: **platform vendors absorbing coding agents into their closed-source ecosystems**. Google isn't the only one doing this — Meta's [Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent-en) is also closed-source. The question is whether this approach can retain developers who are already accustomed to open-source tools.

## References

- [Antigravity CLI official website](https://antigravity.google)
- [google-antigravity/antigravity-cli (GitHub)](https://github.com/google-antigravity/antigravity-cli)
- [Google I/O 2026 Keynote](https://io.google/2026/)
- Internal: [OMP 2: From Pi Fork to Full Rust Rewrite](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) (in Chinese)
- Internal: [Pi v2: AgentHarness API Goes Stable](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en) (in Chinese)
- Internal: [Opencode 2: Bun to Node, Tauri to Electron](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en) (in Chinese)
- Internal: [DeepSeek Harness (dsh): Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) (in Chinese)
- Internal: [The H2 2026 Harness War](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en) (in Chinese)
