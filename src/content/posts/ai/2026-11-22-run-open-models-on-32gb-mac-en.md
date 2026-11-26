---
title: "Running Four Popular Open Models on a 32GB Mac: Which Tools Work for Qwen3.8, Muse Glimmer, Nemotron 3.5 Bolt, and Inkling 2 Mini"
date: 2026-11-22
type: guide
category: ai
tags: [apple-silicon, local-inference, gguf, llama-cpp, ollama, mlx, coding-agent, quantization]
lang: en
series:
  name: "Running Models Locally"
  order: 4
tldr: "As of 2026-11-22, all four models have a working path on a 32–36 GB Apple Silicon Mac, but tool support varies a lot: Qwen3.8-27B runs on all six tools; Muse Glimmer runs everywhere except Splash; Inkling 2 Mini, two days old, needs llama.cpp b12600+ from the official install script (Homebrew is still on the Nov 13 1.0.0 release, which can't run it) and is not yet merged into mlx-lm; Nemotron 3.5 Bolt's 22 GB file is officially unsupported on Apple Silicon in Ollama, and llama.cpp runs it with some weights falling back to the CPU."
description: "A compatibility matrix for Qwen3.8-27B, Muse Glimmer, Nemotron 3.5 Bolt 74B-A9B, and Inkling 2 Mini across mlx-lm, oMLX, Splash, llama.cpp, Ollama, and LM Studio, with one quant per model that fits in 32GB, download and launch commands, Claude Code hookup, and how to raise the macOS GPU memory limit."
draft: false
glossary:
  - term: "wired memory limit"
    aliases: ["iogpu.wired_limit_mb", "recommendedMaxWorkingSetSize", "wired limit"]
    definition: "The amount of memory macOS lets the GPU lock (keep out of swap). By default it is only part of total RAM; if model weights plus KV cache exceed it, inference slows down or fails to load."
    context: "On a 36 GB Mac, Nemotron 3.5 Bolt's 22 GB of weights sit close to the default limit."
  - term: "mmproj"
    aliases: ["multimodal projector", "vision projector"]
    definition: "In the llama.cpp ecosystem, a model's vision encoder is stored as a separate GGUF file called the mmproj. You only need it for image input; skipping it saves memory for text-only use."
    context: "All four models are vision-language models with a 0.6–1.7 GB mmproj each."
  - term: "NVFP4"
    aliases: ["nvfp4"]
    definition: "NVIDIA's 4-bit floating-point format, with one scale per 16 values. Blackwell GPUs compute it in hardware; Apple GPUs have no FP4 hardware and must decode it with software kernels."
    context: "Inkling 2 Mini's original weights and some layers of the Nemotron 3.5 Bolt GGUF use this format, which directly affects which tools can run them on a Mac."
---

> :globe: [中文版](/posts/ai/2026-11-22-run-open-models-on-32gb-mac)

This is part four of the [Running Models Locally](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en) series. The first three covered three tools: [MLX and mlx-lm](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en), [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en), and [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en). This one starts from the models instead. Say you have an Apple Silicon Mac with 32–36 GB of memory (an M3 Pro 36 GB, for example) and want to run four popular open-weight models: which tool should you use for each, which file should you download, and what do you type?

The four models:

- **Qwen3.8-27B**: Alibaba Qwen's 27B dense vision-language model, 262K context, Apache 2.0 ([Hugging Face](https://huggingface.co/Qwen/Qwen3.8-27B)). For the MoE preview in the same family, see the [Qwen3.8-Flash-Next model card](/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next-en).
- **Muse Glimmer**: Meta's 29.6B on-device agent model, Apache 2.0 ([model card](/posts/daily/2026-08-17-model-meta-muse-glimmer-en)).
- **Nemotron 3.5 Bolt 74B-A9B-24GB**: NVIDIA's hybrid Mamba2/Transformer MoE, compressed from Super VL with experts trained in 2-bit, 256K context ([family overview](/posts/tech/2026-10-10-ai-model-family-nemotron-en)).
- **Inkling 2 Mini**: Thinking Machines Lab's looped transformer released 2026-11-20, 26.4B total and 3.4B active parameters, 1M context ([model card](/posts/daily/2026-11-21-model-thinking-machines-inkling-2-mini-en)).

The six tools: [mlx-lm](https://github.com/ml-explore/mlx-lm) (`mlx_lm.server`), [oMLX](https://github.com/jundot/omlx), [Splash](https://github.com/incoai/splash), [llama.cpp](https://github.com/ggml-org/llama.cpp) (`llama-server`), [Ollama](https://ollama.com/), and [LM Studio](https://lmstudio.ai/).

Every support status below was checked on 2026-11-22 against source code, model pages, and release notes. Commands follow the official docs and **were not executed on a Mac**. Inkling 2 Mini in particular is moving fast; check each tool's latest version before following along.

## Compatibility matrix

✓ works　:warning: works with limits　✗ unsupported — the evidence for every cell is listed below the table.

| Model | mlx-lm | oMLX | Splash | llama.cpp | Ollama | LM Studio |
|---|---|---|---|---|---|---|
| [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | :warning: text only | ✓ | ✓ | ✓ | ✓ | ✓ |
| [Muse Glimmer](https://huggingface.co/meta-models/Muse-Glimmer-30B) | :warning: text only | ✓ | ✗ | ✓ | ✓ | ✓ |
| [Nemotron 3.5 Bolt](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF) | ✗ | :warning: community file, author suggests 48 GB | ✗ | :warning: some weights fall back to CPU | ✗ not on Mac | Unconfirmed |
| [Inkling 2 Mini](https://huggingface.co/thinkingmachines/Inkling-2-Mini) | ✗ PR not merged | ✓ from 0.8.1 | ✗ | ✓ from b12600 | ✓ from 0.40.17 | ✓ |

**Evidence for each cell:**

- **mlx-lm**: [`mlx_lm/models/`](https://github.com/ml-explore/mlx-lm/tree/main/mlx_lm/models) has `qwen3_5` and `muse_glimmer`; both drop the vision weights at load time (`checkpoint.py` filters keys starting with `vision_tower`), so they are text only. Bolt's language model uses the `nemotron_h_puzzle` architecture, which is not there; [PR #1982](https://github.com/ml-explore/mlx-lm/pull/1982) to add it has been open since October. The Inkling 2 Mini [PR #2086](https://github.com/ml-explore/mlx-lm/pull/2086) is not merged either.
- **oMLX**: Qwen3.8 goes through mlx-lm's `qwen3_5`; Muse Glimmer has its own `omlx/adapter/muse_glimmer.py`; Inkling 2 Mini is listed as new in the [v0.8.1 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.1). Bolt has no official support. The community repo [txgsync/…-24GB-MLX](https://huggingface.co/txgsync/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-MLX) ships a custom Metal kernel file that oMLX loads with Trust Remote Code enabled. The author says "You need an Apple Silicon Mac with 48 GB of memory or more. We did not test smaller Macs."
- **Splash**: The 1.7.0 support list in the [README](https://github.com/incoai/splash#quick-start) and [docs/models.md](https://github.com/incoai/splash/blob/main/docs/models.md) is Qwen3.8-27B, Qwen3.6-35B-A3B, Ornith-1.5-122B, Qwen3.8-Flash-Next, Flint, and Ternary Bonsai 2. The other three models are not on it, and Splash has no generic fallback path.
- **llama.cpp**: [`src/llama-arch.cpp`](https://github.com/ggml-org/llama.cpp/blob/master/src/llama-arch.cpp) has all four architectures (`qwen35`, `muse-glimmer`, `nemotron_h_moe`, `inkling2_loop`), and `tools/mtmd/models/` has a vision module for each. Inkling 2 Mini landed in [PR #32694](https://github.com/ggml-org/llama.cpp/pull/32694) on 2026-11-20; the first release containing it is [b12600](https://github.com/ggml-org/llama.cpp/releases/tag/b12600). Bolt's limitation is covered in the Bolt section below.
- **Ollama**: [qwen3.8](https://ollama.com/library/qwen3.8), [muse-glimmer](https://ollama.com/library/muse-glimmer), and [inkling-2-mini](https://ollama.com/library/inkling-2-mini) all have official tags. The [nemotron-3.5-bolt](https://ollama.com/library/nemotron-3.5-bolt) page states "Apple Silicon / Metal is not currently supported for 74B-A9B."
- **LM Studio**: [qwen3.8](https://lmstudio.ai/models/qwen3.8), [muse-glimmer](https://lmstudio.ai/models/muse-glimmer), and [inkling-2-mini](https://lmstudio.ai/models/inkling-2-mini) are in the official catalog. Bolt has only a community [lmstudio-community GGUF](https://huggingface.co/lmstudio-community/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-GGUF) and no catalog page. LM Studio runs GGUF on a Mac through its llama.cpp engine, so it presumably hits the same CPU fallback as llama.cpp, but we found no LM Studio documentation on it, so the cell stays unconfirmed.

## Memory first: macOS gives the GPU only part of it

Apple Silicon shares memory between CPU and GPU, but macOS by default lets the GPU lock only part of it. llama.cpp prints this limit as `recommendedMaxWorkingSetSize` at startup. The discussion in [llama.cpp issue #1870](https://github.com/ggml-org/llama.cpp/issues/1870) cites an Apple tech talk: about 75% on a 64 GB machine and about 65% at 32 GB and below. A 36 GB machine lands somewhere between 23 and 27 GB; check your own startup log for the exact number.

The quants used in this guide:

| Model | File | Weights | Add for images |
|---|---|---|---|
| Qwen3.8-27B | `UD-Q4_K_M` from `unsloth/Qwen3.8-27B-GGUF` | 16.56 GB | mmproj 0.93 GB |
| Muse Glimmer | `KQuant-17GB-Q4_K_M` from `meta-models/Muse-Glimmer-30B-GGUF` | 16.76 GB | mmproj 1.40 GB |
| Nemotron 3.5 Bolt | `nvidia/…-Bolt-74B-A9B-24GB-GGUF` | 22.02 GB | mmproj 1.73 GB |
| Inkling 2 Mini | `IQ4_NL` from `ggml-org/Inkling-2-Mini-GGUF` | 17.63 GB | mmproj 0.64 GB |

File sizes are sums of LFS file sizes from the Hugging Face API. The first three, at around 17 GB, leave a few GB of KV cache headroom under the default limit on a 36 GB Mac. Bolt's 22 GB plus its mmproj sits right at the limit, and that is when you need to change a system setting. The [mlx-lm README](https://github.com/ml-explore/mlx-lm#large-models) gives the method:

```bash
sysctl iogpu.wired_limit_mb            # check current value; 0 means system default
sudo sysctl iogpu.wired_limit_mb=28672 # example for a 36 GB machine: let the GPU use 28 GB
```

The README's rule is that N should be larger than the model's size in MB and smaller than the machine's total memory. Set it too high and macOS, your browser, and your editor run out of memory, so leave 6–8 GB for the system. On a 32 GB machine, scale the number down.

A cheaper saving that needs no system change: for text-only use, don't load the mmproj, and start with a context of around 32K, raising it only if you need more.

## Qwen3.8-27B: all six tools work

This is the best-supported of the four. Qwen3.8 reuses the Qwen3.5 architecture (its config's `model_type` is `qwen3_5`), so every existing tool already knows it.

**Splash (first choice on M3 or newer)**. It supports only a handful of models, Qwen3.8-27B is one of them, and it comes with a dedicated DFlash 2 draft model:

```bash
brew install incoai/tap/splash
splash serve --model unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M
# in another terminal:
splash claude      # or splash opencode / splash codex
```

Note that the [Splash announcement](https://inco.ai/blog/splash/) lists 36 GB as the minimum and 48 GB as recommended, so a 32 GB machine is below the minimum. Splash's [performance.md](https://github.com/incoai/splash/blob/main/docs/performance.md#smaller-ggufs-on-24-gb-macs) advises smaller machines to use a smaller GGUF (for example the 27B `UD-IQ3_XXS`, 10.93 GB) with `--language-only`. More detail in [part three](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en).

If you use Splash inside LM Studio, know that the two are not in sync. The Splash runtime bundled with LM Studio Bionic 1.2.2 is 1.3.0 (identical to Splash's 1.3.0 tag, verified 2026-11-22) and still loads `incoai/*-Splash` packaged models. The Splash CLI stopped loading those packages in 1.3.1. Download models for LM Studio and for the Homebrew CLI by their own instructions; they cannot share files.

**llama.cpp**:

```bash
curl -LsSf https://llama.app/install.sh | sh     # installs b12607 as of 2026-11-22
llama serve -hf unsloth/Qwen3.8-27B-GGUF:UD-Q4_K_M --jinja -c 32768
```

`llama serve` is the unified command introduced in v1.0, equivalent to the old `llama-server`. `-hf` downloads the mmproj automatically; add `--no-mmproj` for text only ([multimodal docs](https://github.com/ggml-org/llama.cpp/blob/master/docs/multimodal.md)). Note that the server's default port is now **9931** ([`common/common.h`](https://github.com/ggml-org/llama.cpp/blob/master/common/common.h)); older tutorials that say 8080 need an explicit `--port`.

**Ollama**: `ollama run qwen3.8`. `latest` points to `27b` (18 GB), and `27b-mlx` uses Ollama's MLX engine ([tag list](https://ollama.com/library/qwen3.8/tags)).

**mlx-lm** (text only):

```bash
pip install mlx-lm
mlx_lm.server --model mlx-community/Qwen3.8-27B-4bit   # 16.07 GB, listens on 127.0.0.1:8080
```

**oMLX**: download the same `mlx-community/Qwen3.8-27B-4bit` under `~/models` and `omlx serve --model-dir ~/models` will pick it up, with image input supported.

**LM Studio**: `lms get qwen3.8`, or search in the app. The catalog page lists both GGUF and MLX formats.

## Muse Glimmer: everything except Splash

Muse Glimmer is a 29.6B dense model including a 1.8B vision encoder. Meta publishes its own GGUF, and the model card states the version requirement plainly: llama.cpp **b10353** or newer.

**llama.cpp** (following [Meta's GGUF model card](https://huggingface.co/meta-models/Muse-Glimmer-30B-GGUF)):

```bash
hf download meta-models/Muse-Glimmer-30B-GGUF \
  --include "Muse-Glimmer-30B-KQuant-17GB-Q4_K_M.gguf" \
  --include "mmproj-Muse-Glimmer-30B-Q4_K_M.gguf" \
  --local-dir Muse-Glimmer-30B-GGUF

llama-server \
  -m Muse-Glimmer-30B-GGUF/Muse-Glimmer-30B-KQuant-17GB-Q4_K_M.gguf \
  --mmproj Muse-Glimmer-30B-GGUF/mmproj-Muse-Glimmer-30B-Q4_K_M.gguf \
  -a muse-glimmer-30B -ngl 99 -c 32768 --jinja \
  --temp 1.0 --top-p 0.95 --top-k 64 --port 8080
```

Meta's example uses `-c 131072 -np 4`; this shrinks context to 32K with one slot, which suits 36 GB better. The model card estimates total memory at about 17 GB for text, 19 GB with vision, and 20 GB with the DFlash draft model added. To try speculative decoding, also download `dflash-Muse-Glimmer-30B-Q4_K_M.gguf` (1.63 GB) and add `-md <file> -ngld 99`.

**Ollama**: `ollama run muse-glimmer` (18 GB). The model page says the MLX engine supports DFlash and image input; that tag is `muse-glimmer:30b-mlx` (19 GB).

**mlx-lm** (text only): `mlx_lm.server --model mlx-community/Muse-Glimmer-30B-4bit` (19.44 GB).

**oMLX**: use the same mlx-community file, or [`Jundot/Muse-Glimmer-30B-oQ4e`](https://huggingface.co/Jundot/Muse-Glimmer-30B-oQ4e) (20.59 GB), quantized by oMLX's author. One oMLX issue is still open, [#4599](https://github.com/jundot/omlx/issues/4599): on 0.7.1rc1, Muse Glimmer with DFlash fails on the first request, so check your version before enabling DFlash.

**LM Studio**: the catalog entry `meta/muse-glimmer` is listed at 25.77 GB with a 26 GB memory minimum, which is tight on 36 GB. Run `lms get muse-glimmer -a` to see all quantization options and pick the [lmstudio-community Q4_K_M](https://huggingface.co/lmstudio-community/Muse-Glimmer-30B-GGUF) (16.76 GB).

## Nemotron 3.5 Bolt: llama.cpp is the only route, and it has a cost

Bolt is NVIDIA's build for 24 GB machines: 74B total parameters, 9B active per token, with experts trained into IQ2_XXS through quantization-aware distillation, which the model card calls "native 2-bit." Its parent, Super VL 120B-A12B, does not fit in 32 GB: the smallest quants are rapid-mlx's MLX 3-bit (42.76 GB) and unsloth's `UD-IQ1_M` (46.1 GB). NVIDIA's official NVFP4 build is 75 GB, and NVFP4 is a Blackwell-native format with no FP4 hardware on Apple GPUs. Bolt is NVIDIA's answer for smaller machines.

The trouble is the Mac. [NVIDIA's GGUF model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF) only gives recipes for RTX, DGX Spark, and RTX discrete GPUs, with no mention of Apple Silicon. Ollama states outright that the Mac is unsupported. llama.cpp loads it (the GGUF header's architecture is `nemotron_h_moe`); the problem is the format. In this file the Mamba layers' input and output projections are NVFP4, and llama.cpp's Metal backend excludes NVFP4 from matrix multiplication (`ggml_metal_supports_mul_mat_op` in [`ggml-metal-device.m`](https://github.com/ggml-org/llama.cpp/blob/master/ggml/src/ggml-metal/ggml-metal-device.m) returns false for `GGML_TYPE_NVFP4`), so those tensors are computed on the CPU.

The llama.cpp command (adapted from NVIDIA's recipe: the RTX DFlash draft model removed, context reduced, vision off for now):

```bash
hf download nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF \
  NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB.gguf --local-dir models/bolt

sudo sysctl iogpu.wired_limit_mb=28672   # 36 GB machine, see the memory section

llama-server --model models/bolt/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB.gguf \
  --ctx-size 32768 --parallel 1 -ngl 999 \
  --cache-type-k q8_0 --cache-type-v q8_0 \
  --flash-attn on --jinja --temp 1.0 --top-p 0.95 --port 8080
```

For image input, add `mmproj-NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB.gguf` (1.73 GB) with `--mmproj`, bringing the total to 23.75 GB.

A community build targets the CPU fallback: [UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF](https://huggingface.co/UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF) converts only those 80 NVFP4 tensors to Q8_0, which Metal can run. Every other weight is copied as is, and the file grows to 24.21 GB. Its own test on a 64 GB M5 Pro shows decode going from 12.8 to 24.6 tok/s. Those are third-party numbers on a machine with twice your memory, and 24.21 GB on a 36 GB Mac requires raising the wired limit and staying text-only.

On the MLX side: mlx-lm has no `nemotron_h_puzzle` yet; oMLX can run it through the txgsync community file mentioned above, but the author only tested on a 128 GB machine.

**Bottom line**: to try Bolt on a 36 GB Mac, use llama.cpp, text only, starting at 32K context, and accept that it is slower than the other models of similar size. On a 32 GB machine, even with a raised limit, only a few GB remain for the system; not recommended.

## Inkling 2 Mini: four tools caught up within two days

Inkling 2 Mini's architecture is new: the middle 12 of its 24 layers run three times, each pass with its own cache. Every runtime has to implement this separately, so support on launch day was patchy. As of 2026-11-22:

- **Ollama**: the [v0.40.17 release notes](https://github.com/ollama/ollama/releases/tag/v0.40.17) say this release supports it on Apple Silicon only. All three tags point to the same 20 GB MLX NVFP4 file, which is the original release precision.
- **llama.cpp**: needs b12600 or newer. Homebrew's `llama.cpp` is v1.0.0 (November 13), which predates the Inkling merge, so **a brew install cannot run it**. Use the llama.app install script (which serves b12607 today) or download the `macos-arm64` archive from [releases](https://github.com/ggml-org/llama.cpp/releases).
- **oMLX**: supported from 0.8.1, including image input and DSpark speculative decoding.
- **LM Studio**: the catalog entry `thinkingmachines/inkling-2-mini` is a 17.50 GB GGUF with an 18 GB memory minimum. The page doesn't say which llama.cpp runtime version is required; if loading fails, update it under "Settings > Runtime" first.
- **mlx-lm**: not yet; [PR #2086](https://github.com/ml-explore/mlx-lm/pull/2086) is open. [mlx-vlm](https://github.com/Blaizzy/mlx-vlm) has merged Inkling 2 Mini on its main branch, but the latest PyPI release, 0.8.0 (November 16), does not include it, so you would install from git.

**Ollama is the least effort**:

```bash
ollama run inkling-2-mini            # 20 GB, image input included
ollama launch claude --model inkling-2-mini
```

**llama.cpp**:

```bash
llama serve -hf ggml-org/Inkling-2-Mini-GGUF:IQ4_NL --jinja -c 32768
```

One easy trap: the GGUFs at the root of [unsloth/Inkling-2-Mini-GGUF](https://huggingface.co/unsloth/Inkling-2-Mini-GGUF) declare the architecture `inkling2` and are meant for Unsloth Desktop. The files for upstream llama.cpp sit in the `Mainline_Support/` folder with a `.gguf_file` extension, which `-hf` won't pick up. That is why this guide uses the ggml-org file.

**oMLX**:

```bash
hf download mlx-community/Inkling-2-Mini-oQ4e-mtp --local-dir ~/models/Inkling-2-Mini-oQ4e-mtp
omlx serve --model-dir ~/models
```

This 16.87 GB file is oMLX's own oQ mixed-precision quant with a bundled DSpark draft model; its model card says it needs oMLX 0.8.1 or later.

The official model card adds two warnings. Support for looped models in local runtimes "is new, and speed varies by runtime and hardware." The model sometimes gets stuck in repetitive reasoning while debugging code, so set limits on output tokens and agent turns. 1M context is the model's ceiling; how much you can actually open on a 32 GB machine depends on how much memory you leave for the KV cache.

## Connecting the API and Claude Code

All six tools expose an OpenAI-compatible API. They differ in default port and in whether they have an Anthropic endpoint:

| Tool | Default address | Anthropic `/v1/messages` | Claude Code |
|---|---|---|---|
| mlx-lm | `127.0.0.1:8080` | No | Needs your own adapter |
| oMLX | `localhost:8000` | Yes | `omlx launch claude --model <ID>` |
| Splash | `127.0.0.1:8000` | Yes | `splash claude` |
| llama.cpp | `127.0.0.1:9931` | Yes (tool use needs `--jinja`) | Set `ANTHROPIC_BASE_URL` |
| Ollama | `localhost:11434` | — | `ollama launch claude --model <name>` |
| LM Studio | `localhost:1234` (`lms server start --port 1234`) | Yes | Set `ANTHROPIC_BASE_URL` |

oMLX and Splash both default to 8000; move one of them if you run both. For llama.cpp's Anthropic endpoint, see the [server README](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md). For LM Studio, follow its [Anthropic compatibility docs](https://lmstudio.ai/docs/developer/anthropic-compat):

```bash
export ANTHROPIC_BASE_URL=http://localhost:1234
export ANTHROPIC_AUTH_TOKEN=lmstudio
claude --model <model ID in LM Studio>
```

A minimal OpenAI-format test, using llama.cpp:

```bash
curl http://127.0.0.1:9931/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","content":"Explain KV cache in one sentence."}]}'
```

Claude Code's system prompt alone is about 33K tokens (per Splash's performance.md), so open at least 64K of context for a coding agent. That costs memory, and Bolt on a 36 GB machine has almost none to spare for it.

## How to choose

- **You want the one that just works**: Qwen3.8-27B. All six tools support it; on an M3-or-newer 36 GB machine try Splash first, otherwise use Ollama or llama.cpp.
- **Tool-calling-heavy agent work**: Muse Glimmer on Ollama or llama.cpp. Meta ships an official GGUF and DFlash draft model, with the clearest version requirements of the four.
- **You want to try the new Inkling 2 Mini**: tonight, run `ollama run inkling-2-mini`. For llama.cpp, first confirm `llama --version` reports b12600 or newer, and don't use the brew build.
- **Bolt**: below 36 GB, don't make it your daily driver. If you want to try it, use the llama.cpp command above, text only, and set the wired limit first.

## References

- [Qwen/Qwen3.8-27B (Hugging Face)](https://huggingface.co/Qwen/Qwen3.8-27B)
- [unsloth/Qwen3.8-27B-GGUF](https://huggingface.co/unsloth/Qwen3.8-27B-GGUF)
- [mlx-community/Qwen3.8-27B-4bit](https://huggingface.co/mlx-community/Qwen3.8-27B-4bit)
- [meta-models/Muse-Glimmer-30B-GGUF model card](https://huggingface.co/meta-models/Muse-Glimmer-30B-GGUF)
- [mlx-community/Muse-Glimmer-30B-4bit](https://huggingface.co/mlx-community/Muse-Glimmer-30B-4bit)
- [nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-GGUF)
- [UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF](https://huggingface.co/UraionLabs/Nemotron-3.5-Bolt-74B-A9B-24GB-Metal-GGUF)
- [txgsync/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-MLX](https://huggingface.co/txgsync/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-24GB-MLX)
- [rapid-mlx/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-MLX-3bit](https://huggingface.co/rapid-mlx/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-MLX-3bit)
- [unsloth/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-GGUF](https://huggingface.co/unsloth/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-GGUF)
- [nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-NVFP4](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-NVFP4)
- [thinkingmachines/Inkling-2-Mini model card](https://huggingface.co/thinkingmachines/Inkling-2-Mini)
- [ggml-org/Inkling-2-Mini-GGUF](https://huggingface.co/ggml-org/Inkling-2-Mini-GGUF)
- [unsloth/Inkling-2-Mini-GGUF](https://huggingface.co/unsloth/Inkling-2-Mini-GGUF)
- [mlx-community/Inkling-2-Mini-oQ4e-mtp](https://huggingface.co/mlx-community/Inkling-2-Mini-oQ4e-mtp)
- [mlx-lm README (Large Models section)](https://github.com/ml-explore/mlx-lm#large-models)
- [mlx-lm PR #1982: Nemotron 3.5 Bolt](https://github.com/ml-explore/mlx-lm/pull/1982)
- [mlx-lm PR #2086: Inkling 2 Mini](https://github.com/ml-explore/mlx-lm/pull/2086)
- [oMLX v0.8.1 release notes](https://github.com/jundot/omlx/releases/tag/v0.8.1)
- [oMLX issue #4599: Muse Glimmer + DFlash](https://github.com/jundot/omlx/issues/4599)
- [Splash README](https://github.com/incoai/splash) and [docs/models.md](https://github.com/incoai/splash/blob/main/docs/models.md)
- [Splash: A local engine built around the model (Inco AI)](https://inco.ai/blog/splash/)
- [llama.cpp PR #32694: Inkling 2 Mini](https://github.com/ggml-org/llama.cpp/pull/32694)
- [llama.cpp release b12600](https://github.com/ggml-org/llama.cpp/releases/tag/b12600)
- [llama.cpp server README](https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md)
- [llama.cpp issue #1870: GPU memory limit on Apple Silicon](https://github.com/ggml-org/llama.cpp/issues/1870)
- [Homebrew llama.cpp formula](https://github.com/Homebrew/homebrew-core/blob/main/Formula/l/llama.cpp.rb)
- [Ollama: qwen3.8](https://ollama.com/library/qwen3.8), [muse-glimmer](https://ollama.com/library/muse-glimmer), [nemotron-3.5-bolt](https://ollama.com/library/nemotron-3.5-bolt), [inkling-2-mini](https://ollama.com/library/inkling-2-mini)
- [Ollama v0.40.17 release notes](https://github.com/ollama/ollama/releases/tag/v0.40.17)
- [LM Studio: Inkling 2 Mini model page](https://lmstudio.ai/models/inkling-2-mini)
- [LM Studio: lms get](https://lmstudio.ai/docs/cli/local-models/get)
- [LM Studio: Anthropic-compatible API](https://lmstudio.ai/docs/developer/anthropic-compat)
- [LM Studio Bionic changelog](https://lmstudio.ai/changelog)
- [MLX: Apple Silicon's array framework](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework-en)
- [oMLX: an inference server on MLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en)
- [Splash: a model-specific inference engine](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en)
- [Ollama local LLM guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en)
- [llama.cpp local LLM inference](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en)
