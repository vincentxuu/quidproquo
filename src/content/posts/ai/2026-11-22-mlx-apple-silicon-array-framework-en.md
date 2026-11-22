---
title: "What Is MLX: Apple Silicon's Array Framework, mlx-lm, and When to Pick It Over llama.cpp"
date: 2026-11-22
category: ai
type: deep-dive
tags: [mlx, apple-silicon, local-llm, llm-inference, quantization, hugging-face]
lang: en
tldr: "MLX is an MIT-licensed array framework from Apple machine learning research, with about 29k GitHub stars and version 0.32.4 as of November 2026. To run LLMs you use mlx-lm on top of it: pip install mlx-lm, then mlx_lm.chat, with roughly 5,800 pre-converted models in the mlx-community org on Hugging Face."
description: "An introduction to Apple's MLX: the unified memory and lazy evaluation design, mlx-lm's generate / chat / server / convert commands, mlx-community models and learned quantization, and when a Mac user should pick MLX versus staying on llama.cpp / GGUF."
draft: false
series:
  name: "Running Models Locally"
  order: 1
glossary:
  - term: "unified memory"
    aliases: ["UMA"]
    definition: "On Apple silicon the CPU and GPU share one memory pool, so data does not need to be copied between them."
    context: "MLX arrays live in unified memory; you choose CPU or GPU when you run an operation."
    links:
      - label: "MLX docs: Unified Memory"
        url: "https://ml-explore.github.io/mlx/build/html/usage/unified_memory.html"
  - term: "lazy evaluation"
    aliases: ["lazy computation"]
    definition: "Writing an operation only records a compute graph; the work runs when the result is actually needed (eval or printing a value)."
    context: "Lazy evaluation lets MLX build a model and load fp16 weights without first allocating an fp32 copy."
    links:
      - label: "MLX docs: Lazy Evaluation"
        url: "https://ml-explore.github.io/mlx/build/html/usage/lazy_evaluation.html"
  - term: "wired memory"
    aliases: ["iogpu.wired_limit_mb"]
    definition: "Memory macOS will not page out to swap. The GPU's wired limit is controlled by the iogpu.wired_limit_mb sysctl."
    context: "When a model approaches the machine's total RAM, mlx-lm tries to wire its weights; if the limit is too low, generation slows down."
---

> :globe: [中文版](/posts/ai/2026-11-22-mlx-apple-silicon-array-framework)

If you have used [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide-en) or [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en) on a Mac, you have probably seen a pile of Hugging Face models under `mlx-community` with names ending in `-4bit`, and heard that "MLX is faster on a Mac." This post explains what [MLX](https://github.com/ml-explore/mlx) actually is, how it differs from the GGUF route, and how to get a model running on your own Mac tonight.

This is part 1 of the "Running Models Locally" series. The next three posts cover [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en), an inference server built on MLX, and [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en), a separate C++ engine with its own Metal kernels; the last post [compares how each tool runs four popular open models on a 32 GB Mac](/posts/ai/2026-11-22-run-open-models-on-32gb-mac-en).

## What MLX is

MLX is an open-source array framework from Apple's machine learning research team, under the MIT license. The README's first line says it plainly: "MLX is an array framework for machine learning on Apple silicon." Think of it as NumPy plus part of PyTorch, not as an app for running models:

- **A Python API that closely follows NumPy**, plus C++, [C](https://github.com/ml-explore/mlx-c), and [Swift](https://github.com/ml-explore/mlx-swift) APIs; `mlx.nn` and `mlx.optimizers` follow PyTorch
- **Composable function transformations**: automatic differentiation, automatic vectorization, graph optimization
- **Dynamic graph construction**: changing input shapes does not trigger slow recompilation
- **Multi-device**: CPU and GPU today; outside macOS there is a Linux CUDA backend and a CPU-only build

As of November 2026, [ml-explore/mlx](https://github.com/ml-explore/mlx) has about 29k stars, and the latest release is [v0.32.4](https://pypi.org/project/mlx/) from mid-October.

What Mac users actually use to run LLMs is [mlx-lm](https://github.com/ml-explore/mlx-lm), built on top of it (about 7,700 stars, latest v0.32.2). The ecosystem looks roughly like this:

```text
 mlx_lm CLI / Python     LM Studio          Ollama 0.19+
                         (mlx-engine)       (its own MLX engine)
        │                     │                  │
        └──── mlx-lm (text) / mlx-vlm (vision)   │
                       │                         │
                       └────────── MLX ──────────┘
                                    │
                             Metal GPU / CPU
                                    │
                       Apple silicon unified memory
```

Weights come from the [mlx-community](https://huggingface.co/mlx-community) organization on Hugging Face, which lists about 5,866 models at the time of writing, many of them 4-bit, 6-bit, and 8-bit variants of the same base model.

## Two design choices: unified memory and lazy evaluation

### Unified memory: no "move it to the GPU"

PyTorch habits say `tensor.to("cuda")`: data goes to a device first. On Apple silicon the CPU and GPU already share memory, and MLX turns that into the programming model. Per the [docs](https://ml-explore.github.io/mlx/build/html/usage/unified_memory.html), you don't give an array a location; you pick the device **when you run the operation**:

```python
import mlx.core as mx

a = mx.random.normal((100,))
b = mx.random.normal((100,))

mx.add(a, b, stream=mx.cpu)  # same a and b
mx.add(a, b, stream=mx.gpu)  # the GPU uses them without a copy
```

When operations depend on each other, the scheduler inserts the synchronization for you. The docs' example sends a large matmul to the GPU and a chain of tiny ops to the CPU, cutting time on an M1 Max from 2.8 ms (all GPU) to about 1.4 ms.

Be precise about what MLX adds here: **unified memory is a hardware property**, and llama.cpp's Metal backend also benefits from not copying over PCIe. What MLX adds is a programming model where you stop tracking where data lives, and CPU and GPU can interleave work on the same array.

### Lazy evaluation: writing an op is not running it

In MLX, `c = a + b` [does not compute anything yet](https://ml-explore.github.io/mlx/build/html/usage/lazy_evaluation.html); it records a compute graph that runs when you call `mx.eval()` or need a value. For LLM users the payoff is memory:

```python
model = Model()                                # no memory used yet
model.load_weights("weights_fp16.safetensors") # materialized directly as fp16
```

With eager execution, `Model()` would first initialize every weight in fp32 and then overwrite it with fp16; lazily, peak memory is half that. The cost is that in a hand-written training loop you need to think about when to `eval`: evaluating every step adds fixed overhead, while letting the graph grow too large eats memory. If you only use mlx-lm for inference, it handles this for you.

## Run it tonight: five mlx-lm commands

**Prerequisites** (from the [MLX install docs](https://ml-explore.github.io/mlx/build/html/install.html) and PyPI): an Apple silicon Mac, macOS 14 or newer, and a **native arm64** Python. MLX needs Python 3.10+, mlx-lm needs 3.11+. The most common trap is an x86 Python running under Rosetta, where pip says it can't find a matching distribution. Check first:

```bash
python3 -c "import platform; print(platform.processor())"   # should print arm
```

### 1. Install

```bash
python3 -m venv ~/.venvs/mlx && source ~/.venvs/mlx/bin/activate
pip install mlx-lm
```

If you'd rather skip the venv, Homebrew has a packaged build: `brew install mlx-lm` (also 0.32.2 right now).

### 2. Chat

```bash
mlx_lm.chat
```

With no arguments it downloads `mlx-community/Llama-3.2-3B-Instruct-4bit`, a small 3B 4-bit model that is fine for checking your setup works. Use `--model` to switch:

```bash
mlx_lm.chat --model mlx-community/Qwen3-4B-Instruct-2507-4bit
```

Models land in the Hugging Face cache (`~/.cache/huggingface/hub`), shared with `transformers`.

### 3. One-shot generation

```bash
mlx_lm.generate --model mlx-community/Qwen3-4B-Instruct-2507-4bit \
  --prompt "Explain unified memory in three sentences" --max-tokens 256
```

At the end it prints prompt and generation tokens-per-sec plus peak memory: your machine's real numbers.

### 4. Serve an OpenAI-compatible API

```bash
mlx_lm.server --model mlx-community/Qwen3-4B-Instruct-2507-4bit
```

Per [SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md), it listens on `127.0.0.1:8080` by default and exposes `/v1/chat/completions`, `/v1/completions`, and `/v1/models`:

```bash
curl localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Say this is a test!"}],"temperature":0.7}'
```

Any tool that takes an OpenAI base URL (editor extensions, agent frameworks) can point at `http://localhost:8080/v1`. The server batches batchable requests, decoding up to 32 and processing up to 8 prompts concurrently by default (`--decode-concurrency`, `--prompt-concurrency`). But the docs state it is "not recommended for production as it only implements basic security checks," so don't expose it to the public internet. A fuller serving layer is what the next post, [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en), is about.

### 5. Manage disk space

Models are several GB each, so clean up after experimenting:

```bash
mlx_lm.manage --scan                                   # list downloaded models
mlx_lm.manage --delete --pattern mlx-community/Llama-3.2-3B-Instruct-4bit
```

### Large models get slow: the wired memory limit

When a model approaches total RAM, mlx-lm (on macOS 15+) tries to wire the memory used by the model and cache. If you see `[WARNING] Generating with a model that requires ...`, the README suggests raising the system limit, where N is larger than the model size in MB but smaller than the machine's memory:

```bash
sudo sysctl iogpu.wired_limit_mb=N
```

Set it too high and macOS and your other apps run out of memory, so don't push N right up to the machine's total.

## Quantization: from `-q` to learned quants

If the model you want isn't on mlx-community yet, convert it yourself. The simplest path is one line of 4-bit quantization:

```bash
mlx_lm.convert --model mistralai/Mistral-7B-Instruct-v0.3 -q
```

Output goes to `mlx_model/` as safetensors plus config, not GGUF. Add `--upload-repo` to push it to Hugging Face, or use the [mlx-my-repo](https://huggingface.co/spaces/mlx-community/mlx-my-repo) Space to convert online.

How much quality do you lose? mlx-lm's [BENCHMARKS.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/BENCHMARKS.md) has official numbers for Qwen3-4B-Instruct-2507 on a 64 GB M4 Max. The headline: 4-bit uses under 40% of the memory and generates about 2.6x faster, at a cost of about 3 points on MMLU Pro:

| Precision | MMLU Pro | Generation tok/s | Memory |
|---|---|---|---|
| bf16 | 64.05 | 52.47 | 9.02 GB |
| 8-bit | 63.85 | 86.91 | 5.25 GB |
| 4-bit | 60.72 | 134.52 | 3.35 GB |

For the theory, see [this quantization primer](/posts/ai/2026-08-26-understanding-ai-models-quantization-en).

To claw back those points, mlx-lm offers four [learned quantization](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LEARNED_QUANTS.md) methods that use calibration data: DWQ (distillation with the original model as teacher), AWQ, dynamic quantization (more bits for sensitive layers), and GPTQ. The docs say dynamic quantization is the fastest to run, while DWQ takes longer but typically yields better results. Install `pip install "mlx-lm[train]"` first, then for example:

```bash
mlx_lm.dynamic_quant --model Qwen/Qwen3-0.6B
```

Models on mlx-community with `DWQ` in the name were made this way.

## Ecosystem: who builds on MLX

mlx-lm is no longer the only way in:

- **[LM Studio](https://github.com/lmstudio-ai/mlx-engine)**: the Mac app has bundled `mlx-engine` since 0.3.4, built on mlx-lm, so you can pick MLX-format models in the GUI.
- **[Ollama](https://ollama.com/blog/mlx)**: since 0.19 it previews an engine built on MLX on Apple silicon. A [June 2026 update](https://ollama.com/blog/mlx-performance) says fused kernels via MLX's JIT make output up to 20% faster; tags ending in `-mlx`, such as `ollama run gemma4:12b-mlx`, run on the MLX engine.
- **[mlx-vlm](https://github.com/Neywa-Labs/mlx-vlm)**: inference and fine-tuning for vision language models, for image input that mlx-lm doesn't cover.
- **Fine-tuning**: mlx-lm has built-in [LoRA and full fine-tuning](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md), including LoRA on quantized models.

On hardware, Apple's [M5 MLX post](https://machinelearning.apple.com/research/exploring-llms-mlx-m5) says MLX uses the GPU Neural Accelerators in M5 through Metal 4 TensorOps, making time to first token (TTFT) up to 4x faster than M4, provided you're on macOS 26.2 or later. Generation is bound by memory bandwidth, and the same post measured only about a 20% gain there. In other words, **long-prompt work (agents, RAG) benefits most on M5**; plain chat feels much less different.

## MLX or llama.cpp / GGUF: how to choose

Bottom line first: if you already use Ollama, a recent version may already be running MLX on your Mac, so you don't necessarily need to install anything. If you're picking the layer underneath yourself:

| Situation | Pick | Why |
|---|---|---|
| Mac only, want hackable Python and fine-tuning | [MLX / mlx-lm](https://github.com/ml-explore/mlx-lm) | Inference, quantization, and LoRA in one package, with readable Python source |
| A new architecture just dropped and you want it now | Check both | mlx-lm converts original Hugging Face weights directly; llama.cpp needs GGUF converter support. Which one lands first depends on the model |
| Same model across Mac, Linux, and Windows | [llama.cpp](https://github.com/ggml-org/llama.cpp) / GGUF | One GGUF file works everywhere; MLX has a Linux CUDA backend, but Apple silicon is still its home turf |
| Tight memory, want per-layer quant control | llama.cpp / GGUF | Many K-quant and IQ options, plus offloading some layers to CPU |
| Long-running public service with access control | Neither built-in server directly | Both built-in servers are dev-oriented; put another layer in front |

On speed, don't trust someone else's percentage; measure your own machine:

```bash
mlx_lm.benchmark --model mlx-community/Qwen3-4B-Instruct-2507-4bit -p 2048 -g 128
llama-bench -m qwen3-4b-instruct-2507-q4_k_m.gguf -p 2048 -n 128
```

Both use a 2048-token prompt and generate 128 tokens; compare prompt-processing and generation speed. Match the bit width (MLX 4-bit against a Q4 variant), or you're comparing quantization rather than engines.

## Limitations and gotchas

- **Formats don't interoperate**: MLX uses safetensors with MLX-specific quantization parameters and can't load GGUF quant files directly. In the other direction, only `mlx_lm.fuse --export-gguf` exports, and only fp16 GGUF for llama, mixtral, and mistral architectures.
- **You need a Python environment**: compared with llama.cpp's single binary or Ollama's installer, there's an extra layer of Python versions and venvs to manage.
- **KV cache quantization disables batching**: `mlx_lm.server --kv-bits 4` saves memory on long contexts, but per the docs the server then handles one request at a time.
- **`trust_remote_code`**: some tokenizers require `--trust-remote-code`, which runs the model author's code; don't add it casually for models you don't trust.
- **It's a research framework first**: the README says MLX is "designed by machine learning researchers for machine learning researchers." The API moves fast and behavior can change between minor versions, so pin versions if you build a product on it.

One thing to do tonight: `pip install mlx-lm`, run `mlx_lm.chat`, then use `mlx_lm.generate` to see how many tokens per second your Mac gets from a 4-bit 4B model. With that number in hand, read the next post on how [oMLX](/posts/ai/2026-11-22-omlx-apple-silicon-inference-server-en) turns it into a server for multiple agents, and the third on how [Splash](/posts/ai/2026-11-22-splash-apple-silicon-inference-engine-en) bypasses MLX with its own Metal kernels. If you're shopping for hardware, see the [local inference hardware guide](/posts/ai/2026-04-02-ai-hardware-local-inference-guide-en).

## References

- [ml-explore/mlx — GitHub](https://github.com/ml-explore/mlx)
- [MLX docs: Build and Install](https://ml-explore.github.io/mlx/build/html/install.html)
- [MLX docs: Unified Memory](https://ml-explore.github.io/mlx/build/html/usage/unified_memory.html)
- [MLX docs: Lazy Evaluation](https://ml-explore.github.io/mlx/build/html/usage/lazy_evaluation.html)
- [mlx — PyPI](https://pypi.org/project/mlx/)
- [ml-explore/mlx-lm — GitHub](https://github.com/ml-explore/mlx-lm)
- [mlx-lm SERVER.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/SERVER.md)
- [mlx-lm BENCHMARKS.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/BENCHMARKS.md)
- [mlx-lm LEARNED_QUANTS.md](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LEARNED_QUANTS.md)
- [mlx-community — Hugging Face](https://huggingface.co/mlx-community)
- [Exploring LLMs with MLX and the Neural Accelerators in the M5 GPU — Apple Machine Learning Research](https://machinelearning.apple.com/research/exploring-llms-mlx-m5)
- [Ollama is now powered by MLX on Apple Silicon in preview — Ollama Blog](https://ollama.com/blog/mlx)
- [Ollama's highest performance on Apple Silicon yet with MLX — Ollama Blog](https://ollama.com/blog/mlx-performance)
- [lmstudio-ai/mlx-engine — GitHub](https://github.com/lmstudio-ai/mlx-engine)
- [llama.cpp deep dive](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en)
- [Ollama local LLM guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en)
