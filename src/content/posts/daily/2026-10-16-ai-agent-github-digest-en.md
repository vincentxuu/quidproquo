---
title: "AI Agent GitHub Digest — 2026-10-16"
date: 2026-10-16
category: daily
tags: [ai-agent, github, open-source, daily]
lang: en
description: "Today's trending list and today's releases are both saying the same thing — how to make agents burn fewer tokens: caveman 4.0, xerj replacing grep with an index, and fresh moves from Haystack and DSPy"
tldr: "caveman (112,360★, +530 today) ships 4.0 with Auto and Blocks, claiming 54% lower cost at the same score; VoiceStudio (68,575★, +3,027) is a fully local ElevenLabs alternative covering 646 languages; xerj (5,432★, +725) replaces grep with a Rust-built index, cutting output tokens 2.7x by having agents reference existing open-source solutions; TokenSpeed (2,405★, +25) is an agentic inference engine maintained by a non-profit foundation. Releases: DSPy 3.4.1 (GEPA now defaults to a structured proposer, and RLM can spawn sub-agents) and Haystack v3.4.0 (a new ToolResultOffloadCompactor replaces summarization with an external store)."
series:
  name: "AI Agent GitHub Digest"
  order: 62
---

> 🌏 [繁體中文版](/posts/daily/2026-10-16-ai-agent-github-digest)

## Today's Highlight

Today, trending repos and new releases are saying the same thing: how to make agents burn fewer tokens. caveman cuts word count by talking (and reading) less, xerj skips reading files line by line in favor of an index, and Haystack moves old tool results into an external store instead of summarizing them away. Different paths, same destination — but each solution is cleaner than the last.

## Trending Repos

### JuliusBrussee/caveman ⭐ 112,360 (+530)
[GitHub](https://github.com/JuliusBrussee/caveman)　·　Go　·　Apache-2.0

- **What it is**: A skill-plus-proxy combo that makes coding agents "talk like a caveman" and compresses logs, JSON and test output before the agent reads them, without touching the code itself.
- **Why it matters**: Version 4.0 splits the project into six parts, adding **Auto** (picks the model and reasoning effort automatically, 54% cheaper at the same score) and **Blocks** (the agent keeps the scripts it wrote and reruns them — one test run dropped from 397 tokens to 76). A paper from Adobe Research cites this repo, and JetBrains and Elastic Labs have each run independent A/B tests that corroborate the results.
- **Stack**: Go CLI plus an npm package, supporting 30+ agents including Claude Code, Codex, Gemini CLI and OpenCode
- **Getting started**: Low — `npx @caveman-ai/cli@latest` installs it in one line, using your own Claude Pro/Max login and keys

---

### debpalash/VoiceStudio ⭐ 68,575 (+3,027)
[GitHub](https://github.com/debpalash/VoiceStudio)　·　Python　·　Open source

- **What it is**: An open-source, fully local ElevenLabs alternative covering voice cloning, voice design, video dubbing, dictation, transcription and audiobook creation, in 646 languages.
- **Why it matters**: It gained 3,027 stars today alone — the fastest climb of today's candidates. Running fully locally means voice data never leaves the machine, which matters for privacy-sensitive use cases like dubbing or recorded customer-service calls, and it fills a long-standing "local-only" gap in the open-source voice AI space.
- **Stack**: Python
- **Getting started**: Medium — running voice models locally usually needs a GPU; no public data yet on a hosted option

---

### xerj-org/xerj ⭐ 5,432 (+725)
[GitHub](https://github.com/xerj-org/xerj)　·　Rust　·　Apache-2.0

- **What it is**: A local AI search index written in Rust. One command indexes an entire folder — code, docs, logs, PDFs — so agents search instead of reading files line by line; its interface is Elasticsearch-compatible, so existing clients work unchanged.
- **Why it matters**: Its flagship use case is "reference coding" — have the agent find the open-source implementation closest to the task at hand, index it, and reuse how that project solved the problem before writing new code. The author's controlled study cut output tokens 2.7x at the same 16/16 solve rate; community reports put everyday savings closer to 5x.
- **Stack**: Rust, a single static binary, wires into Claude Code/Cursor via MCP plus a skill in one command
- **Getting started**: Medium — it binds only to `127.0.0.1` by default, but `--insecure` mode turns off TLS and API-key auth entirely; that's meant for one user on one dev machine, and production use needs to follow the documented trust boundary

---

### lightseekorg/tokenspeed ⭐ 2,405 (+25)
[GitHub](https://github.com/lightseekorg/tokenspeed)　·　Python　·　Apache-2.0

- **What it is**: An LLM inference engine maintained by the non-profit LightSeek Foundation, with hardware and engineering support credited to NVIDIA and AMD, built for agentic workloads.
- **Why it matters**: Its architecture splits the control plane (a C++ finite-state machine that enforces safe KV-cache resource management at compile time) from the execution plane (Python, for fast iteration) — a design the PyTorch Foundation's ecosystem blog specifically called out. It isn't backed by any single commercial vendor, which is unusual in a field of vendor-driven inference engines.
- **Stack**: C++ control plane plus a Python execution plane, with a custom MLA kernel
- **Getting started**: Medium — built for production inference clusters, not a single-machine toy

## Notable Releases

### DSPy 3.4.1
[Release Notes](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)

- **Key changes**: `dspy.GEPA` now defaults to a structured `InstructionProposer` that calls the reflection LM through a `JSONAdapter`, keeping inputs like `dspy.History`, tool trajectories and `dspy.Image` structured instead of flattened into text; `dspy.RLM`'s REPL can now `import dspy` itself and build sub-agents (`Predict`, `ChainOfThought`, `ReActV2`, or a nested `RLM`) that share the parent's `max_llm_calls` budget.
- **Breaking changes**: GEPA's reflection LM must now return JSON; `dspy.ReActV2` signatures can no longer use `history` or `tools` as input field names; progress files saved on 3.4.0 with a null `Score` no longer load.
- **What it means for you**: if you've optimized with GEPA, results may differ from 3.4.0 even with the same seed after upgrading — rerun your evaluation baseline before comparing.

---

### Haystack v3.4.0
[Release Notes](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0)

- **Key changes**: A new `ToolResultOffloadCompactor` — when context compaction triggers, it doesn't summarize or drop old tool results; it writes them to an external `ToolResultStore` and leaves a reference in their place, which the agent can read back in full with a dedicated read tool when needed. Haystack also adds official Python 3.15 support and drops Python 3.10, which is now past end-of-life.
- **Breaking changes**: Several splitters changed how `page_number` is computed — a chunk spanning a page break now reports the page it *starts* on rather than the page it *ends* on, so documents containing form feeds need re-indexing to get correct page numbers; `ChatMessage.from_openai_dict_format` now raises a `ValueError` on image content referenced by URL or files referenced by `file_id`, instead of silently dropping them.
- **What it means for you**: if you display or store `page_number` anywhere, re-index documents with page breaks after upgrading; anywhere you forward OpenAI-format messages with URL-referenced images, switch to downloading and inlining them as base64 first.

## Today's Takeaway

I used to think "saving tokens" meant shortening output or switching to a cheaper model. Watching xerj replace line-by-line grep with an index, and Haystack replace summarization with an external store, made it click: the cleaner move is to keep unnecessary things out of context in the first place, rather than cramming it full and then figuring out how to compress it back down.

## References

- [JuliusBrussee/caveman — GitHub](https://github.com/JuliusBrussee/caveman)
- [debpalash/VoiceStudio — GitHub](https://github.com/debpalash/VoiceStudio)
- [xerj-org/xerj — GitHub](https://github.com/xerj-org/xerj)
- [lightseekorg/tokenspeed — GitHub](https://github.com/lightseekorg/tokenspeed)
- [GitHub Trending (daily)](https://github.com/trending?since=daily)
- [DSPy 3.4.1 — GitHub Releases](https://github.com/stanfordnlp/dspy/releases/tag/3.4.1)
- [Haystack v3.4.0 — GitHub Releases](https://github.com/deepset-ai/haystack/releases/tag/v3.4.0)
