---
title: "How oMLX Keeps Coding Agents Fast on a Mac: Continuous Batching, SSD KV Cache, and Claude Code"
date: 2026-11-22
category: ai
type: deep-dive
tags: [apple-silicon, local-inference, llm-inference, kv-cache, coding-agent, claude-code]
lang: en
tldr: "oMLX is a menu-bar LLM server for Apple Silicon built on MLX (v0.8.2, ~23.8k stars on 2026-11-22). It splits the KV cache into a RAM hot tier and an SSD cold tier, so when a coding agent circles back to an old prefix it restores from disk instead of recomputing, and it speaks both the OpenAI and Anthropic APIs."
description: "An introduction to oMLX: how it relates to MLX and mlx-lm, what continuous batching and tiered KV caching each solve, install and first run, wiring up Claude Code, Codex and other agents, and the trade-offs against Ollama, LM Studio, mlx-lm server and llama.cpp — including when not to use it."
draft: false
series:
  name: "Running Models Locally"
  order: 2
glossary:
  - term: "Prefill"
    aliases: ["prompt processing"]
    definition: "The phase where the model runs over the whole input and builds the KV cache before emitting its first token."
    advanced: "Prefill cost grows with input length; on a Mac, waiting on long prompts is mostly prefill, not token-by-token generation."
    context: "oMLX's SSD cache exists so that repeated prefixes don't have to be prefilled again."
  - term: "TTFT"
    aliases: ["Time To First Token"]
    definition: "The time from sending a request to receiving the first output token."
    context: "Coding agents resend the whole conversation every turn, so TTFT is dominated by prefill."
  - term: "Prefix Cache"
    aliases: ["prompt cache"]
    definition: "Storing the KV cache for an input prefix that has already been computed, so a later request with the same beginning can reuse it."
    advanced: "oMLX manages prefixes as fixed-size blocks shared across requests, with copy-on-write for branches."
    context: "oMLX extends this cache to SSD, so it still hits after a server restart."
---

> :globe: [中文版](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server)

Run a coding agent like [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) against a local model on a Mac, and the first wall you hit usually isn't generation speed. It's the long wait before the first token on every turn. Each agent call resends the system prompt, tool definitions and the whole conversation — easily tens of thousands of tokens — and as soon as something in the middle changes, many servers prefill from scratch.

[oMLX](https://github.com/jundot/omlx) is built around that problem. It's an LLM inference server for Apple Silicon, managed from the macOS menu bar, running on Apple's [MLX](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en). Its two headline features are **continuous batching** (decoding several requests together) and a **tiered KV cache** (hot data in RAM, cold data on SSD, surviving restarts). It's Apache-2.0, this post targets the latest release, [v0.8.2](https://github.com/jundot/omlx/releases/tag/v0.8.2), and the repo had about 23.8k stars on the day of writing (2026-11-22).

This is part two of the "Running Models Locally" series. Part one covers [the MLX framework](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en); part three covers another Mac inference engine, [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en); part four [compares how each tool runs four open models on a 32 GB Mac](/posts/ai/2026-11-22-run-open-models-on-32gb-mac-en). This post answers three questions: what oMLX adds on top of plain mlx-lm, how to install it and point an agent at it, and when you shouldn't use it.

## Where oMLX sits in the stack

oMLX isn't a new inference engine. It's a server-plus-management layer:

```
coding agent (Claude Code / Codex / OpenCode …)
        │  OpenAI /v1/chat/completions or Anthropic /v1/messages
        ▼
oMLX (FastAPI server)
  ├─ EnginePool: multi-model, LRU eviction, TTL, manual load/unload
  ├─ Scheduler: FCFS, hands off to mlx-lm's BatchGenerator
  └─ Cache Stack: GPU paged cache → RAM hot tier → SSD cold tier (safetensors)
        ▼
mlx-lm / mlx-vlm / mlx-embeddings
        ▼
MLX (Metal, unified memory)
```

The layout comes from the [README's Architecture section](https://github.com/jundot/omlx#readme). v0.8.2's `pyproject.toml` pins `mlx==0.32.4` and a specific commit of [mlx-lm](https://github.com/ml-explore/mlx-lm). The project started from [vllm-mlx](https://github.com/waybarrios/vllm-mlx) v0.1.0 and added multi-model serving, tiered caching, an admin UI and a menu-bar app.

One thing to settle up front (expanded at the end): **whether a model runs, and how fast, is mostly up to MLX and mlx-lm.** What oMLX changes is how long you wait when an agent keeps resending long prompts on the same Mac, and who manages model loading and memory.

## Continuous batching: it matters when requests overlap

Continuous batching lets the server advance several requests in one GPU forward pass, so a new request doesn't queue behind one that's still talking. oMLX uses mlx-lm's `BatchGenerator` directly, handles up to 8 concurrent requests by default, and exposes `--max-concurrent-requests` to change that.

The project site, [omlx.ai](https://omlx.ai), reports that on an M3 Ultra 512GB, at pp1024/tg128 with no cache reuse, 8 concurrent requests reach 4.14× the total generation throughput of a single request for one of its tested models. These are the project's own numbers; other machines and models will differ.

For a single person using Claude Code, batching helps less than you'd think: the main agent has one request in flight at a time. It pays off when subagents run in parallel, or when you have an agent and a chat window going at once.

## Tiered KV cache: designed for agents that circle back

This is where oMLX differs most from other Mac servers. The [README](https://github.com/jundot/omlx#tiered-kv-cache-hot--cold) describes a block-based KV cache inspired by vLLM, with prefix sharing and copy-on-write, across two tiers:

- **Hot tier (RAM)**: frequently used blocks stay in memory.
- **Cold tier (SSD)**: when the hot tier fills, blocks are written to SSD in safetensors format. When a later request's prefix matches, they're read back from disk instead of recomputed — even after a server restart.

Why does that matter for coding agents? Because an agent's prompt grows like a tree. The system prompt and tool definitions are the shared trunk; every subagent, every context compaction, every time you hit Esc and redirect, is a new branch. A memory-only cache has to drop old branches when space runs out, and when the agent comes back to one, it prefills from scratch again. oMLX writes all those branches to SSD. The site's FAQ claims second-turn-onward TTFT on long contexts drops from 30–90 seconds to under 5 seconds — again, the project's own measurement.

Defaults worth knowing (per v0.8.2 source and README):

| Setting | Default | Notes |
|---|---|---|
| SSD cache | On, at `~/.omlx/cache` | `--no-cache` turns it off |
| SSD cache limit | `auto` | Half of free disk space plus existing cache files; `--paged-ssd-cache-max-size 20GB` for a fixed cap |
| RAM hot tier | `0` (off) | `--hot-cache-max-size 20%` or `8GB` to enable |
| Process memory limit | System RAM minus 8GB | Prevents system-wide OOM |

Note what `auto` means: with 200GB free on a 512GB SSD, the cache can grow to roughly 100GB. If your laptop disk is tight, set a fixed cap first.

## Install and first run

You need macOS 15 (Sequoia) or later and Apple Silicon (M1 through M5). Three ways to install:

**macOS app (easiest)**: download the `.dmg` from [Releases](https://github.com/jundot/omlx/releases); v0.8.2 ships separate builds for macOS 15 and macOS 26/27. Drag it into Applications, and the Welcome screen walks you through picking a model directory, starting the server and downloading a first model. The app also installs an `~/.omlx/bin/omlx` CLI shim.

**Homebrew**:

```bash
brew tap jundot/omlx https://github.com/jundot/omlx
brew install jundot/omlx/omlx            # no full Xcode needed
# add --with-custom-kernel to build native kernels (needs full Xcode)
omlx start                               # background service, auto-restarts on crash
```

**From source**: `git clone`, then `make install` (with native kernels, needs full Xcode) or `make install-no-kernels`. Python 3.11–3.13.

The native kernels aren't optional for some models: the README notes that GLM-5.2, MiniMax M3 and Qwen3.5 silently fall back to much slower paths without them. If you don't have Xcode, the DMG is the safe choice because it ships them precompiled.

Start in the foreground with a model directory:

```bash
omlx serve --model-dir ~/models
```

The server auto-discovers MLX models in subdirectories — LLMs, VLMs, embedding models and rerankers. Per the site's FAQ, it also reads the standard Hugging Face cache at `~/.cache/huggingface/hub` and your LM Studio model folder, so you don't re-download. The API is at `http://localhost:8000/v1`, a built-in chat UI at `http://localhost:8000/admin/chat`, and the admin dashboard at `/admin`, where you can search and download Hugging Face models and run benchmarks.

Check the server is up:

```bash
curl http://localhost:8000/v1/models
```

## Connecting coding agents

oMLX exposes both OpenAI-compatible `/v1/chat/completions` and Anthropic-compatible `/v1/messages`, so clients on either side can point straight at it.

**Claude Code**: the simplest route is to let oMLX set the environment and launch it:

```bash
omlx launch claude --model <model-id>
```

Per [`omlx/integrations/claude.py`](https://github.com/jundot/omlx/blob/main/omlx/integrations/claude.py), this sets `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`, points the Opus/Sonnet/Haiku tiers at the same local model, raises `API_TIMEOUT_MS` to 3,000,000 ms, and turns off non-essential outbound traffic. `--opus`, `--sonnet` and `--haiku` let you map tiers to different models — a small model for subagents, for example. It also refuses models with less than 48K context, because Claude Code's system prompt alone is long.

Or set it up yourself:

```bash
export ANTHROPIC_BASE_URL=http://localhost:8000
export ANTHROPIC_AUTH_TOKEN=<your oMLX API key, or anything if none is set>
claude --model <model-id>
```

**Other agents**: `omlx launch` currently supports `claude`, `claude_desktop`, `codex`, `codex_app`, `copilot`, `opencode`, `openclaw`, `hermes`, `pi`, `vibe` and `dsh`; `omlx launch list` prints them. The admin dashboard's Integrations page generates configs with one click. Per the README, Codex needs 0.148+ and Copilot CLI needs 1.0.83+.

**Any OpenAI client**: set the base URL to `http://localhost:8000/v1`.

**Exposing it on your LAN**: oMLX refuses to start on a non-loopback address without an API key, which is the right default:

```bash
OMLX_API_KEY=replace-with-your-key omlx serve --model-dir ~/models --host 0.0.0.0
```

## Choosing among Mac options

| Tool | Engine | Anthropic API | Cache | Good for |
|---|---|---|---|---|
| [oMLX](https://github.com/jundot/omlx) | MLX (Splash as external engine) | Yes | RAM + SSD tiers, survives restart | Long coding-agent sessions, several resident models |
| [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide-en) | GGML; [MLX preview on Apple Silicon since 0.19](https://ollama.com/blog/mlx) | Yes (`ollama launch claude`) | In memory; 0.19 reuses it across conversations | One command and go, cross-platform |
| [LM Studio](https://lmstudio.ai/blog/claudecode) | llama.cpp + MLX | `/v1/messages` since 0.4.1 | In memory | Browsing and trying models in a GUI |
| [mlx-lm server](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md) | MLX | No, OpenAI format only | In-memory LRU | Scripts and tests, minimal dependencies |
| [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en) | GGML/Metal | Not verified for this post | In memory, slots can be saved manually | GGUF ecosystem, Mac/Linux/Windows |

A few decision points:

- **You already use Ollama and it's fast enough**: don't switch yet. Ollama's March 2026 MLX preview also started reusing cache across conversations, and it has `ollama launch claude` too. oMLX's difference is that the cache persists to SSD and there are far more knobs.
- **mlx-lm server vs oMLX**: same foundation — they even batch with the same `BatchGenerator`. mlx-lm's [SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md) says plainly it is "not recommended for production as it only implements basic security checks", and it has no Anthropic endpoint. For Claude Code, oMLX saves you writing an adapter.
- **You want GGUF**: oMLX's own MLX engines don't load GGUF; GGUF runs on the external [Splash](https://github.com/incoai/splash) engine (see [docs/Splash.md](https://github.com/jundot/omlx/blob/main/docs/Splash.md)). If GGUF is all you need, llama.cpp or Ollama is simpler.

For server choices beyond the Mac, see [the self-hosted inference server guide](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en).

## The increment: what you can do without oMLX

Take oMLX away and these still exist:

- **Running models with MLX on a Mac**: mlx-lm already does it.
- **Continuous batching**: mlx-lm server already batches with `BatchGenerator`.
- **In-memory prefix caching**: mlx-lm server, Ollama, LM Studio and llama.cpp all have some form of it.
- **Pointing Claude Code at a local model**: Ollama and LM Studio both have Anthropic-compatible endpoints.

What oMLX actually adds:

1. **An SSD cold tier**: the cache still hits when RAM can't hold it or after a restart. This is the core increment.
2. **Managing multiple resident models**: LRU eviction, pinning, per-model idle TTL, an overall memory cap, plus the menu-bar app.
3. **Agent integration details**: reporting the model's real context window to Claude Code so auto-compaction fires at the right time, SSE keep-alive during long prefills to avoid timeouts, and one-command `omlx launch`.

## When not to use oMLX

- **Not Apple Silicon, or macOS 14 or older**: it won't install.
- **32GB of memory or less**: the site lists 16GB as the minimum and 64GB+ as comfortable. Claude Code's 48K context plus model weights leaves few model choices on small machines — that's not a server problem.
- **Tight SSD space**: `auto` takes up to half of your free space. `--no-cache` turns it off, but then you lose oMLX's main advantage.
- **Stable production serving**: the project was created in February 2026 and has shipped many rc and dev builds on the way to v0.8.2, with model support changing almost weekly. For a shared team service, a [server like vLLM](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en) on a GPU box is steadier.
- **Occasional Q&A**: one short question at a time uses neither caching nor batching; Ollama or LM Studio is easier to start with.

## Bottom line

oMLX's trade-off is explicit: SSD space and more settings in exchange for shorter waits during long coding-agent sessions. If your day looks like "Claude Code open all day, subagents everywhere, lots of branching", it targets exactly the painful part. Something you can do tonight: install the DMG, download an MLX model with at least 48K context from `/admin`, run `omlx launch claude`, and watch cache hits and TTFT from the second turn on in the dashboard. If the numbers don't improve noticeably, going back is just quitting the menu-bar app.

## References

- [jundot/omlx — GitHub](https://github.com/jundot/omlx) (README, `omlx/cli.py`, `omlx/settings.py`, `omlx/integrations/claude.py`, v0.8.2, read 2026-11-22)
- [oMLX v0.8.2 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.2)
- [oMLX v0.8.0 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.0)
- [oMLX website and benchmarks](https://omlx.ai)
- [oMLX docs/Splash.md: Splash as an external engine](https://github.com/jundot/omlx/blob/main/docs/Splash.md)
- [mlx-lm SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md)
- [Ollama is now powered by MLX on Apple Silicon in preview](https://ollama.com/blog/mlx)
- [Use your LM Studio Models in Claude Code (LM Studio 0.4.1)](https://lmstudio.ai/blog/claudecode)
- [vllm-mlx — GitHub](https://github.com/waybarrios/vllm-mlx)
- [MLX: the array framework for Apple Silicon](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en)
- [Splash: an Apple Silicon inference engine](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en)
- [Ollama local LLM guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en)
- [llama.cpp local inference](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en)
- [Choosing a self-hosted inference server](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en)
