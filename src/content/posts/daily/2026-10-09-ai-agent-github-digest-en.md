---
title: "AI Agent GitHub Digest — 2026-10-09"
date: 2026-10-09
category: daily
tags: [ai-agent, github, open-source, daily, agent-harness, mobile-testing]
lang: en
description: "Three tools tackling what happens after a coding agent writes the code — a runtime that handles the plumbing of running an agent, a way for agents to actually open and verify an app, and a whole agent session shrunk down to fit in your pocket; plus Claude Code closing a gap where plain-language hooks didn't block what they were supposed to"
tldr: "**trueforge** (6,083★) is an open-source agent harness runtime that packages the chores of running an agent well — model calls, MCP tools, sandboxing, approvals, session state — behind a chat UI, an HTTP API, and an embeddable UI SDK. **agent-device** (4,937★) lets coding agents open an app on an iOS/Android simulator or real device, tap through the UI, and read accessibility snapshots to verify their own changes actually work; Expensify and Shopify already use it. **pi-pocket** (274★, 4 days old) ports an entire session of Pi — the open-source, deliberately minimal coding agent — into a mobile web app you can steer, watch with others, and schedule from your phone. Claude Code v2.1.294 fixed a bug where plain-language hooks (written as instructions like \"Block commands that...\") sometimes failed to block what they should; browser-use 0.13.11 previews a Claude-native browser toolset that can't actually run yet — it's waiting on an Anthropic SDK release that hasn't shipped."
series:
  name: "AI Agent GitHub Digest"
  order: 55
---

> 🌏 [中文版](/posts/daily/2026-10-09-ai-agent-github-digest)

## Today's Highlight

None of today's three tools touch the model itself — they all tackle what happens after a coding agent writes the code. trueforge packages the chores of running an agent (sessions, sandboxing, approvals) into a reusable runtime. agent-device lets an agent stop guessing whether its change works from reading the diff alone and actually open the app to check. pi-pocket shrinks an entire agent session down to fit in your pocket, so you can check on it from anywhere. The same day, Claude Code patched a security gap where a hook written in plain language didn't reliably block what it was supposed to.

## Trending Repos

### trueforge ⭐ 6,083

[GitHub](https://github.com/truefoundry/trueforge) · TypeScript · MIT

- **What it is**: An open-source "agent harness" runtime — it runs the agent execution loop for you (model calls, MCP tools, skills, sandboxed execution, human approvals, context management, session state) and exposes it three ways: a bundled chat UI, an HTTP API with a TypeScript SDK, and an embeddable UI SDK.
- **Why it matters**: Writing agent logic is easy; running it well is the hard part — streaming, session persistence, tool servers, sandbox isolation. trueforge ships that as out-of-the-box infrastructure: models, tools, and skills come from preconfigured catalogs, sandboxes (Daytona today) spin up only when needed, and secrets never leave the harness. The project publishes a benchmark comparing itself against Claude Managed Agents and deepagents, claiming comparable accuracy at lower cost.
- **Tech stack**: TypeScript + MCP + SQLite (local mode) / Postgres + Redis (hosted mode) + Daytona sandboxing
- **Getting started**: Low to try, medium to run in production — `npx @truefoundry/trueforge@latest` gets it running locally in one command; multi-replica or shared deployments need Docker Compose, Helm, or Railway.

---

### agent-device ⭐ 4,937

[GitHub](https://github.com/callstack/agent-device) · TypeScript · MIT

- **What it is**: A mobile-app automation tool built for AI coding agents. Through a CLI, a built-in MCP server, or a typed Node.js API, an agent can open an app on an iOS/Android/HarmonyOS simulator, emulator, or physical device, tap through the UI, fill in forms, take screenshots, and read logs — to verify the change it just made actually works.
- **Why it matters**: Most coding agents can only judge correctness by re-reading their own source code. agent-device instead feeds the agent accessibility-tree snapshots (far cheaper in tokens than screenshots), lets it act through refs and selectors, and can save the run as evidence or replay it as a CI script. It works with Claude Code, Codex, Cursor, Windsurf, Cline, Goose, and anything that can run a CLI or speak MCP; Expensify and Shopify are already using it in production. It also coordinates device access across parallel agent worktrees and can hand off to remote device clouds like BrowserStack or AWS Device Farm.
- **Tech stack**: TypeScript CLI + MCP server + native per-platform bridges (XCTest on iOS, ADB on Android, HDC/ArkUI uitest on HarmonyOS, AT-SPI on Linux)
- **Getting started**: Medium — `npm install -g agent-device` and `agent-device doctor` get the CLI running, but you need the platform SDKs and simulators (Xcode, Android Studio, etc.) already set up to actually drive a device.

---

### pi-pocket ⭐ 274 (4 days old)

[GitHub](https://github.com/TannerMidd/pi-pocket) · TypeScript · MIT

- **What it is**: A mobile web app that ports an entire session of Pi — the open-source, deliberately minimal coding agent with only four built-in tools (read, edit, write, bash), a system prompt under a thousand tokens, and extensibility through TypeScript extensions — onto your phone. Multiple people can watch the same session, chat on the side, steer the agent mid-task, or schedule recurring work (e.g. "every weekday at 8am, summarize CI").
- **Why it matters**: Most "control your coding agent from your phone" setups stream the desktop screen over. pi-pocket instead makes the session itself durable — every model call and tool call is persisted as it happens, so restarting the server picks the work back up, and only a cut-off tool call reruns, and only when that's safe. On the phone you get diffs, review of uncommitted changes, and branch switching — effectively the desktop Pi experience, minus any cloud VM.
- **Tech stack**: Node.js web app (PWA) + the Pi agent runtime (Pi Durable)
- **Getting started**: Medium — you need Pi itself installed and signed in first; then `git clone` this repo, `npm install && npm start`. Runs on Linux, macOS, Windows, and Android (Termux); the author notes Linux is the most tested.

## Notable Releases

### Claude Code v2.1.294

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.294)

- **What changed**: Fixed `prompt` and `agent` hooks written as plain-language instructions (such as "Block commands that...") sometimes allowing what they were supposed to block. Improved how plain-language `Stop` and `SubagentStop` hooks (such as "Carry on if the build is broken") are judged, so Claude is less likely to stop early.
- **Breaking Changes**: None
- **Impact for you**: If you rely on a plain-English instruction — rather than a scripted check — as a hook to block dangerous commands, this release closes exactly the gap where that could quietly fail to fire; worth upgrading. If you use Stop/SubagentStop hooks to control when a run wraps up, expect it to be less eager to stop early than before.

---

### browser-use 0.13.11

[Release Notes](https://github.com/browser-use/browser-use/releases/tag/0.13.11)

- **What changed**: Added `browser_use.integrations.toolsets_for_claude`, previewing a browser toolset integration for Claude. The release notes are explicit that this requires an Anthropic SDK release containing `anthropic.tools.browser` that hasn't been published yet.
- **Breaking Changes**: None
- **Impact for you**: Installing this version today doesn't get you a working feature yet — browser-use has the interface ready ahead of time, and it's worth watching for when Anthropic ships the corresponding native browser tool in its public SDK, but there's nothing to wire up yet.

## Today's Takeaway

I assumed the bottleneck for coding agents was still "did it write the right code." trueforge and agent-device landing the same day pointed at a bigger gap: once an agent is running, how do you know it actually did the job? One tool makes the agent run reliably (sessions, sandboxing, approvals you don't have to rebuild every time); the other makes the agent check its own work by actually opening the app, instead of just re-reading the diff and hoping.

## References

- [truefoundry/trueforge](https://github.com/truefoundry/trueforge)
- [callstack/agent-device](https://github.com/callstack/agent-device)
- [TannerMidd/pi-pocket](https://github.com/TannerMidd/pi-pocket)
- [Claude Code v2.1.294 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.294)
- [browser-use 0.13.11 Release Notes](https://github.com/browser-use/browser-use/releases/tag/0.13.11)
