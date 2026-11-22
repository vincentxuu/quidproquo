---
title: "What Is Splash: a Model-Specific Inference Engine for Apple Silicon, DFlash 2, and Coding Agents"
date: 2026-11-22
type: deep-dive
category: ai
tags: [splash, apple-silicon, local-inference, speculative-decoding, coding-agent, gguf, llm-inference]
lang: en
series:
  name: "Running Models Locally"
  order: 3
tldr: "Splash is Inco AI's open-source Mac inference engine (Apache-2.0, v1.7.0). It supports only five model families, but each ships with a trained DFlash 2 draft model and its own Metal kernels; Inco measured Qwen3.8-27B decoding at 74 tok/s on an M5 Pro versus 16 for llama.cpp on the same weights. Requires an M3 or newer on macOS 26.4+."
description: "What Splash is and why it is built around the model, how DFlash 2 speculative decoding works, installation and first run, hooking up Claude Code / Codex / OpenCode, hardware requirements, and the trade-offs against llama.cpp, oMLX, and Ollama, including when not to use it."
draft: false
glossary:
  - term: "DFlash 2"
    aliases: ["DFlash", "DFlash2"]
    definition: "Inco AI's speculative-decoding drafter design: the draft model predicts a whole block of tokens in one parallel pass, and the target model verifies the block in one pass. Version 2 adds a path selector and a short convolution, keeping about a fifth more tokens per verification."
    context: "Every model Splash supports is paired with a DFlash 2 draft, and decoding always goes through it."
    links:
      - label: "DFlash 2 blog post"
        url: "https://inco.ai/blog/dflash2/"
  - term: "Draft model"
    aliases: ["drafter", "draft"]
    definition: "The small model in speculative decoding that guesses ahead. The target model verifies its guesses; correct ones are kept, wrong ones discarded, so the output does not change."
    context: "Splash downloads the matching draft automatically for the target you pick."
  - term: "Acceptance length"
    aliases: ["acceptance length"]
    definition: "The average number of tokens kept per verification pass, including the target's own next token. Higher means more output per forward pass."
    context: "The DFlash 2 post uses it to compare drafters."
  - term: "Prefill"
    aliases: ["prefill"]
    definition: "The phase before generation in which the model reads the whole input prompt and builds its KV cache. Longer prompts mean a longer wait for the first token."
    context: "A coding agent's first read of a repository is dominated by prefill speed."
  - term: "Prefix caching"
    aliases: ["prefix cache"]
    definition: "Keeping the KV cache of an already-processed prompt prefix (system prompt, earlier turns) so a later request that starts the same way reuses it instead of recomputing."
    context: "Agents resend the full history every turn, so this matters most for them."
  - term: "Unified memory"
    aliases: ["unified memory"]
    definition: "On Apple Silicon the CPU and GPU share one pool of memory, so the Mac's RAM is the ceiling on how large a model fits."
    context: "Splash sizes its memory plan from Metal's recommended working-set limit."
---

> :globe: [中文版](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine)

[Splash](https://github.com/incoai/splash) is an open-source local inference engine from [Inco AI](https://inco.ai/). It runs only on Apple Silicon, is written in C++ and Metal, and is licensed Apache-2.0. It launched in September 2026; as of 2026-11-22 the latest release is 1.7.0. Its job is the same as an [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide-en) or [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en) server: expose an OpenAI- and Anthropic-compatible API on your Mac so coding agents and other apps can connect.

The difference is the direction of the trade-off. Most engines try to run any model. Splash does the opposite: it supports a handful of model families and builds kernels, a trained draft model, and a memory budget for each one. The README's tagline says it directly: "built around the model."

This is part three of the [Running Models Locally](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en) series. Parts one and two covered the [MLX](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en) framework and the [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en) server built on it. This one covers what Splash is, how DFlash speculative decoding works, how to install it, how to connect agents like Claude Code, and when not to pick it. Part four [compares how each tool runs four open models on a 32 GB Mac](/posts/ai/2026-11-22-run-open-models-on-32gb-mac-en).

## What "built around the model" means

The [Splash launch post](https://inco.ai/blog/splash/) splits the engine into two layers. The runtime, scheduler, cache, and API are shared; everything else is built per model:

```
          built per model                       shared by all models
┌──────────────────────────────┐   ┌──────────────────────────────────┐
│ Metal kernels for its shapes │   │ scheduling: batching, prefill/decode│
│ a DFlash 2 draft trained for │ → │ paged KV cache + prefix caching   │
│ it; a memory plan from known │   │ OpenAI / Anthropic-compatible API │
│ weight sizes                 │   │                                   │
└──────────────────────────────┘   └──────────────────────────────────┘
```

Three practical consequences:

- **The supported list is short.** As of 1.7.0 the README lists five families: Qwen3.8-27B, Qwen3.6-35B-A3B, Ornith-1.5-122B, Qwen3.8-Flash-Next, and Flint, plus the 2-bit Ternary Bonsai 2 variant. Anything else does not run; there is no generic fallback path.
- **Weights come in community formats.** You point it at a Hugging Face GGUF (for example Unsloth's `UD-Q4_K_M`) or an MLX 4-bit checkpoint, and it converts the weights into its kernels' layouts as they load, with no extra copy on disk. Kernels ship precompiled, so you do not need Xcode.
- **There is almost nothing to tune.** Per the launch post, the only settings are ceilings such as `--max-memory` and `--max-context`, which leave room for the editor and browser you have open.

That is the core difference from llama.cpp. llama.cpp's GGUF path covers most mainstream open architectures and runs them all through the same general kernels. Splash gives up breadth for peak speed on each model it supports.

## DFlash speculative decoding, in plain terms

Generating each token means reading the whole model once. On a Mac the bottleneck is usually memory bandwidth, and GPU compute sits idle. Speculative decoding puts that idle compute to work:

1. A small **draft model** guesses the next block of tokens.
2. The large **target model** checks the whole block in one forward pass.
3. Matching from the start, correct guesses are kept, everything after the first wrong guess is discarded, and the target supplies the correct next token.

Every token that is kept has been approved by the target, so the output matches decoding without speculation. Only the speed changes: good guesses turn one pass into several tokens. The metric is **acceptance length**, the average number of tokens kept per verification.

Classic draft models guess one token at a time, so eight guesses take eight passes. The [DFlash paper](https://arxiv.org/abs/2602.06036) (arXiv:2602.06036), published by the Inco team in January 2026, predicts the whole block in parallel in one pass. The catch is that each position guesses independently, so neighbors may not fit together.

[DFlash 2](https://inco.ai/blog/dflash2/) (August 2026) adds two parts:

- **A path selector.** Each position keeps its top 16 candidates, adjacent pairs are scored, and a coherent path is picked through them. Inco's analysis found the right token for the first position sits in the top 16 99.5% of the time even when the top pick is wrong, so choosing is cheaper than re-predicting.
- **A short convolution.** A small convolution that looks one position back is added to every draft layer, easing the drop in accuracy toward the end of the block.

Together, per the DFlash 2 post, they raise mean acceptance length by 21% over the original DFlash across five benchmarks on Qwen3.5-4B, while adding 1.3% to cycle latency.

```
target has confirmed:  def add(a, b):
draft guesses 8:       ⏎  ␣␣  return  ␣a  ␣+  ␣b  ⏎  ⏎
target verifies once:  ✓  ✓    ✓       ✓   ✓   ✓   ✗
kept:                  first 6 + the target's own 7th token
```

In Splash, speculative decoding is the only decode path, not an option. The launch post names three places where the engine is built around the draft. First, drafting, verification, acceptance, and state updates are submitted to the GPU as one unit. Second, each request carries its own draft state, so speculation coexists with batching. Third, the draft uses sliding-window attention, so its memory stays bounded on long contexts. Version 1.7.0 moved verification from a single chain to a tree of up to 16 rows and added prompt lookup, which proposes continuations from repeated text in the prompt (see the [1.7.0 release notes](https://github.com/incoai/splash/blob/main/docs/release-notes/1.7.0.md)).

## Hardware and OS requirements

| Item | Requirement | Source |
|---|---|---|
| Chip | Apple M3 or newer | [README](https://github.com/incoai/splash#quick-start) |
| OS | macOS 26.4 or later | README |
| Memory | Qwen3.8-27B 4-bit needs at least 36 GB; 48 GB recommended | [Splash launch post](https://inco.ai/blog/splash/) |
| Smaller Macs | 24 GB runs smaller GGUF variants (e.g. 27B `UD-IQ3_XXS`) | [performance.md](https://github.com/incoai/splash/blob/main/docs/performance.md#smaller-ggufs-on-24-gb-macs) |
| Disk | About 21 GB for the 27B 4-bit examples with draft, 24 GB for 35B-A3B | [server.md](https://github.com/incoai/splash/blob/main/docs/server.md#model-storage) |

M1 and M2 are not supported. As for why 48 GB: per the launch post, Qwen3.8-27B's weights alone take 15 GiB, plus the draft, and what is left goes to the KV cache and to the editor and browser you have open.

## Installation and first run

There are two routes. For a GUI, download [Splash.dmg](https://github.com/incoai/splash/releases/latest/download/Splash.dmg) and drag it into Applications. For the command line you need [Homebrew](https://brew.sh):

```bash
brew install incoai/tap/splash
splash serve --model unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M
```

The first run downloads the target and its matching draft (into the Hugging Face cache, by default `~/.cache/huggingface/hub`) and starts serving on `127.0.0.1:8000`. The first start after an upgrade also prepares GPU programs, which [server.md](https://github.com/incoai/splash/blob/main/docs/server.md#build-and-run) says takes a couple of minutes.

Once it prints `Ready`, leave that terminal open. Open <http://127.0.0.1:8000> in a browser for the built-in chat page, or call the API from another terminal:

```bash
curl http://127.0.0.1:8000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M",
    "messages": [{"role": "user", "content": "Explain speculative decoding in one sentence."}]
  }'
```

The API covers OpenAI Chat Completions, Responses, and Completions, plus Anthropic Messages (`/v1/messages`), with streaming, tool calls, JSON Schema output, and base64 images and PDFs. Press Ctrl+C in the server terminal to stop.

If the model is already on disk, point at the files directly without contacting the Hub:

```bash
splash serve --model local/qwen \
  --model-dir /models/Qwen3.8-27B-GGUF/Qwen3.8-27B-UD-Q4_K_M.gguf \
  --draft-model /models/Qwen3.8-27B-DFlash2
```

If you use [LM Studio](https://lmstudio.ai/), follow [LM Studio's Splash guide](https://lmstudio.ai/blog/splash-engine): download the Splash (Metal) backend under Settings > Runtime in LM Studio Bionic 1.1.5 or newer, then download a prepackaged model such as `incoai/Qwen3.8-27B-Splash`. Note that the Splash inside LM Studio is not the same version as the command-line build from Homebrew. When we downloaded the backend in Bionic 1.2.2 on November 22, 2026, its `release.json` said 1.3.0, its source commit was identical to Splash's [1.3.0 tag](https://github.com/incoai/splash/releases/tag/1.3.0), and it still takes packaged models laid out as `target/` and `draft/`. The command-line build [stopped loading those packages](https://github.com/incoai/splash/blob/main/docs/models.md#splash-packages) in [1.3.1](https://github.com/incoai/splash/releases/tag/1.3.1) and wants `mlx-community/Qwen3.8-27B-4bit` instead. Both guides are right for their own setup; you just can't share one model download between the two.

## Connecting coding agents

This is the use Splash leads with. With the server running, in another terminal:

```bash
splash opencode    # or: splash claude / splash codex / splash hermes / splash pi
```

These subcommands launch your already-installed [OpenCode](https://github.com/anomalyco/opencode), [Claude Code](https://github.com/anthropics/claude-code), [Codex](https://github.com/openai/codex), [Hermes](https://github.com/NousResearch/hermes-agent), or [Pi](https://github.com/earendil-works/pi) and point them at local Splash. Splash does not install the agents. Extra arguments pass through, for example `splash codex resume --last`.

Per [server.md's agent launchers section](https://github.com/incoai/splash/blob/main/docs/server.md#agent-launchers), `splash claude`, `codex`, and `opencode` pass their settings at launch and write no files; `splash pi` adds a `splash` provider to Pi's `models.json`, and `splash hermes` creates a Hermes profile named `splash`. If the server uses another `--port`, pass the same `--port` to the agent.

Two practical notes:

- **Leave enough context.** [performance.md](https://github.com/incoai/splash/blob/main/docs/performance.md#smaller-ggufs-on-24-gb-macs) says coding agents need about 100K tokens of context; Claude Code's own prompt is about 33K. On a 24 GB Mac running the 27B, the docs recommend `--language-only` to skip vision and give that memory to context.
- **Idle release unloads the model.** By default the model leaves memory after 10 idle minutes, and the next request reloads it. If you keep an agent going all day, start with `--idle-release off`.

Agent traffic maps onto what Splash optimizes. Each turn resends an ever-longer history, and prefix caching skips the repeated part. When subagents send requests at once, automatic batching lets them share one GPU.

## Common settings

Memory and context are sized automatically up to the model's native window (256K for every supported family today). To set your own ceilings, add these to `splash serve`:

| Option | Purpose |
|---|---|
| `--max-memory 28G` | Cap Metal memory to leave room for other apps |
| `--max-context 100K` | Set the context limit |
| `--idle-release off` | Keep the model loaded while idle (default: release after 10m) |
| `--language-only` | Skip vision; serve text only |
| `--max-cache-disk 16G` | Cap the SSD cache (default auto, up to 32 GiB; `0` turns it off) |
| `--persistent-cache` | Keep the SSD cache across restarts (off by default) |

By default it listens on localhost with no authentication. For LAN access, [server.md](https://github.com/incoai/splash/blob/main/docs/server.md#network-and-authentication) uses `--host 0.0.0.0` together with `--api-key`.

## Splash vs llama.cpp, oMLX, and Ollama

First, where Splash's increment actually is. Speculative decoding is not unique to Splash. The DFlash 2 post gives recipes for llama.cpp (`--spec-type draft-dflash`), vLLM, and SGLang, offers an oMLX fork with DFlash 2, and points to an unmerged Ollama PR. You can use DFlash 2 drafts on a Mac without Splash. What Splash adds is a draft that is always on and pre-paired, kernels specialized to each model's shapes, a memory plan computed from known weight sizes, and one-line agent launchers.

| | Splash | [llama.cpp](https://github.com/ggml-org/llama.cpp) | [oMLX](https://github.com/jundot/omlx) | [Ollama](https://github.com/ollama/ollama) |
|---|---|---|---|---|
| Model range | Five families | Most mainstream open architectures (GGUF) | Models in the MLX ecosystem | Official library + GGUF |
| Speculative decoding | Always on, draft auto-paired | You specify a draft | DFlash 2 in a fork | DFlash 2 in an unmerged PR |
| Hardware | M3+ Macs only | CPU / Metal / CUDA / Vulkan, etc. | Apple Silicon | macOS / Linux / Windows |
| Interface | CLI, desktop app, chat page | CLI, server | Menu bar app | CLI, desktop app |
| Agent hookup | `splash claude` etc. | Set the base URL yourself | Set the base URL yourself | Set the base URL yourself |

All speed numbers so far come from Inco's own tests. The methodology is published, but I have not seen a third-party reproduction:

- [The README's GGUF comparison](https://github.com/incoai/splash#gguf-against-llamacpp) uses the same Unsloth `UD-Q4_K_M` weights on an M5 Pro (20-core GPU): Qwen3.8-27B decodes at 74 tok/s on Splash and 16 tok/s on llama.cpp. The same section compares outputs: on the 27B, Splash and llama.cpp agree on the next token over 99% of the time, closer than llama.cpp's own CPU and GPU builds agree with each other.
- [The Splash launch post](https://inco.ai/blog/splash/) compares short-prompt Qwen3.8-27B decode on a 48 GB M5 Pro: Splash 74, oMLX 38, Ollama 24 tok/s. Each engine ran at its own recommended settings, so this is an end-to-end comparison, not an isolated test of one technique.

For someone running coding agents on a Mac, the choice roughly goes:

- Your model is on Splash's list and your Mac is M3 or newer → try Splash first; the gap shows most in long agent sessions.
- You switch among many models, or need a model not on the list → [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en) or llama.cpp.
- You want the simplest one-liner, cross-platform, with a big model library → [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide-en).

## When not to use Splash

- **M1 / M2, or macOS before 26.4.** Not supported, and there is no degraded mode.
- **Your model is not on the list.** Llama, Gemma, Mistral, or whatever model ships tomorrow will not run. Whole-BF16/F16 GGUFs are refused too.
- **Linux or NVIDIA GPUs.** Splash is Mac-only. On those platforms, use DFlash 2 drafts with vLLM, SGLang, or llama.cpp.
- **You need a toolchain that holds still.** 1.0 to 1.7.0 took two months, and in that time the model format changed (the command-line build retired Splash packages in 1.3.1) and Hermes's settings moved. For a long-lived setup, pin both the version and `--revision`.
- **Your SSD is small or you care about write volume.** The SSD cache is on by default, uses up to 32 GiB under `$TMPDIR`, and macOS counts it as System Data. performance.md records one heavy-load test writing about 50 GB an hour; turn it off with `--max-cache-disk 0` or set a daily budget with `--max-cache-disk-writes`.
- **You only trust third-party numbers.** Every speed comparison so far is Inco's. Run the local benchmarks in [validate.md](https://github.com/incoai/splash/blob/main/docs/validate.md#local-benchmarks) on your own Mac before deciding.

## The takeaway

Splash trades model breadth for per-model speed. Its bet is that people running coding agents on a Mac really use only a few models, and making those few as fast as possible beats making everything merely adequate. If you have an M3 or newer with around 48 GB and want Qwen3.8-27B or Qwen3.6-35B-A3B, here is what to try tonight: `brew install incoai/tap/splash`, start the server, open another terminal and run `splash claude` or `splash opencode`, give it a small task in a repo you have, and compare the wait with the engine you use now.

## References

- [incoai/splash (GitHub)](https://github.com/incoai/splash)
- [Splash docs: Server](https://github.com/incoai/splash/blob/main/docs/server.md)
- [Splash docs: Models](https://github.com/incoai/splash/blob/main/docs/models.md)
- [Splash docs: Performance](https://github.com/incoai/splash/blob/main/docs/performance.md)
- [Splash 1.7.0 release notes](https://github.com/incoai/splash/blob/main/docs/release-notes/1.7.0.md)
- [Splash: A local engine built around the model (Inco AI, 2026-09-17)](https://inco.ai/blog/splash/)
- [DFlash 2: Keep drafting parallel (Inco AI, 2026-08-18)](https://inco.ai/blog/dflash2/)
- [Splash Engine in LM Studio Bionic (LM Studio, 2026-09-18)](https://lmstudio.ai/blog/splash-engine)
- [MLX: Apple Silicon's array framework](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en)
- [oMLX: an inference server on MLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en)
- [llama.cpp for local LLM inference](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en)
- [Ollama local LLM guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en)
