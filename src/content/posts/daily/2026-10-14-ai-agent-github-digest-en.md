---
title: "AI Agent GitHub Digest — 2026-10-14"
date: 2026-10-14
category: daily
tags: [ai-agent, github, open-source, daily, mcp, coding-agent, hardware-agent, local-search]
lang: en
description: "A $7 ESP32 board lets an AI drive a real iPhone; opencode-rust rewrites a TypeScript coding agent in Rust to cut memory use; Mastra 1.76.0 and DSPy 3.4.1 both ship with explicit breaking changes today"
tldr: "onehumanbeing/esp32-iphone-agent uses a $7 ESP32 board plus AirPlay to let a vision model operate a real iPhone with no Mac, developer account, or jailbreak. TedHaley/pensieve turns local files, git history, and past AI agent sessions into one searchable MCP server. vakandi/opencode-rust rewrites OpenCode from TypeScript into Rust specifically because the original engine eats too much memory and CPU. Mastra 1.76.0 adds durable agent run ownership to stop multiple replicas from racing on the same run, and DSPy 3.4.1 switches GEPA's reflection step to structured output by default — both releases list explicit breaking changes."
series:
  name: "AI Agent GitHub Digest"
  order: 60
---

> 🌏 [中文版](/posts/daily/2026-10-14-ai-agent-github-digest)

## Today's Highlight

No single repo exploded to the top of trending today. Instead, three projects converge on the same idea from different angles — agents reaching further into the physical and historical world: esp32-iphone-agent gives an agent a real iPhone to touch, pensieve gives an agent its own past session history to search, and opencode-rust rewrites the tool an agent runs on in a different language purely to save resources. Meanwhile Mastra and DSPy both shipped releases today with explicit breaking changes — the part worth reading closely if either is already in your production stack.

## Trending Repos

### onehumanbeing/esp32-iphone-agent ⭐ 1,400 (+1,400)

[GitHub](https://github.com/onehumanbeing/esp32-iphone-agent)　·　Python + C++　·　MIT

- **What it is**: A roughly $7 Seeed XIAO ESP32-S3 board plugs into an iPhone's USB port and acts as a USB HID keyboard/mouse. The phone's screen mirrors to a computer over AirPlay, and a vision model watches the feed and decides the next move — no Mac, no developer account, no jailbreak required.
- **Why it matters**: Most "agent controls a phone" setups are locked into Appium, emulators, or enterprise-signed automation frameworks. This project goes around all of that with a cheap board and USB HID instead. It also splits planning and acting across two models, checks whether the screen actually changed after each action, and re-plans when it gets stuck — not blind tapping.
- **Stack**: Python + FastAPI (server), C++/Arduino (firmware), UxPlay + GStreamer (AirPlay capture), any OpenAI-compatible vision model
- **Getting started**: Medium — you need to wire up the ESP32 board yourself and flash firmware with arduino-cli; the software side is straightforward.

---

### TedHaley/pensieve ⭐ 63 (+63)

[GitHub](https://github.com/TedHaley/pensieve)　·　Python　·　MIT

- **What it is**: Indexes your local files, git commit history, and past AI agent sessions on macOS into one searchable store, with both keyword and semantic search. An MCP server hands agents like Claude Code, Codex, or Cursor the most relevant files or passages directly, instead of making them grep the whole disk.
- **Why it matters**: Most "agent context" tools solve memory within a single session. This one widens the scope to everything every agent session on this machine has ever touched, plus git-blame analysis that surfaces knowledge gaps in the codebase — a different angle from being just another vector-DB wrapper, aimed at people who run multiple coding agents on the same machine over time.
- **Stack**: Qwen3-Embedding-0.6B (MLX on Apple Silicon, sentence-transformers elsewhere) + SQLite trigram full-text index + turbovec vector index + MCP server
- **Getting started**: Medium — macOS only for now, Python managed with uv, and a separate Mac app that needs the Xcode toolchain to build.

---

### vakandi/opencode-rust ⭐ 51 (+51)

[GitHub](https://github.com/vakandi/opencode-rust)　·　Rust　·　MIT

- **What it is**: A full Rust rewrite of the open-source coding agent OpenCode, offering a CLI, a terminal UI, and an HTTP server, with the core split across 21 crates (session, agent, tools, providers, MCP, LSP, and more).
- **Why it matters**: The README names the original TypeScript engine's high memory and CPU use as the direct motivation — this isn't a feature race, it's a resource-use fix for coding agents meant to run in the background for long stretches. MCP, LSP, and the TypeScript plugin bridge (launched via Node.js) are all kept, not cut.
- **Stack**: Rust (21 crates) + Node.js 18+ (plugin bridge / launching MCP servers via npx) + SQLite storage
- **Getting started**: Low — prebuilt binaries and Homebrew/npm installs are available, though MCP or plugin use still needs a separate Node.js install.

## Notable Releases

### Mastra 1.76.0

[Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0)

- **Key changes**: Adds durable agent run ownership — each run is claimed by the process actually executing it, so crash recovery on other replicas skips runs that are still live, and storage adapters can fence off writes from a process that lost ownership, preventing state corruption when multiple replicas race on the same run. Working memory on PostgreSQL now does row-locked, atomic merges. `nestUnderParent()`/`nestUnderRun()` let a run attach as a child span of another run. Interrupted workflow runs now restart in parallel (up to 5 by default).
- **Breaking changes**: `@mastra/playground-ui` removed the old Metrics card views; `MetricsCardGroup` no longer accepts `variant`, and `MetricsLineChart` dropped `xAxisInterval`/`xAxisMinTickGap`. `@mastra/memory`'s Observational Memory now defaults to `model: 'auto'` instead of the fixed `google/gemini-2.5-flash`, which can silently switch providers or models.
- **What it means for you**: If you customized the Metrics dashboard, update to the new component API. If you relied on Observational Memory pinned to a specific model (say, Gemini Flash to control cost), pin it explicitly after upgrading or it will follow whatever your main model is.

---

### DSPy 3.4.1

[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)

- **Key changes**: GEPA's reflection step now defaults to `dspy.Predict` with a `JSONAdapter`, so chat history, tool trajectories, and images reach the reflection LM as structured content instead of plain text. `dspy.RLM`'s REPL can now build `dspy.Predict`, `dspy.ChainOfThought`, `dspy.ReActV2`, and even nested `dspy.RLM` sub-agents on the fly, all sharing one `max_llm_calls` budget. Adds Python 3.15 support.
- **Breaking changes**: `reflection_lm` must now be a `dspy.LM` that returns parseable JSON — plain-function or plain-text setups break, and results can differ from 3.4.0 even with the same seed. Every RLM prompt now includes an extra sub-agent section, so 3.4.0 caches and recorded responses no longer match. Constants under `dspy.predict.flex.bridge` moved to `dspy.primitives.facade`, breaking old imports with `ImportError`. `Score` objects saved with a null level under 3.4.0 fail to load.
- **What it means for you**: If you use GEPA for prompt optimization, re-run optimization rather than reusing old results. If you have custom RLM flows or saved caches/recorded responses from 3.4.0, confirm they need rebuilding before upgrading.

## Today's Takeaway

I used to think "agents touching the real world" meant browser or desktop automation. esp32-iphone-agent is a reminder that the boundary goes lower than that — down to "bypass the official API with $7 of hardware." When an interface has no open API, the community doesn't wait for one; it finds the cheapest side-channel hardware and wires it in.

## References

- [onehumanbeing/esp32-iphone-agent](https://github.com/onehumanbeing/esp32-iphone-agent)
- [GitHub Search — created:>2026-10-06 stars:>100 topic:ai-agent](https://github.com/search?q=created%3A%3E2026-10-06+stars%3A%3E100+topic%3Aai-agent&type=repositories&s=stars&o=desc)
- [TedHaley/pensieve](https://github.com/TedHaley/pensieve)
- [vakandi/opencode-rust](https://github.com/vakandi/opencode-rust)
- [Mastra 1.76.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0)
- [DSPy 3.4.1 Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)
