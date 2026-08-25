---
title: "The Complete Unsloth Guide: Fine-Tune and Run LLMs Locally, Faster"
date: 2026-08-25
type: guide
category: ai
tags: [unsloth, llm, fine-tuning, local-inference, lora, qlora, gguf, self-hosted]
lang: en
tldr: "Unsloth is the fastest, most VRAM-efficient local LLM fine-tuning tool — 2× training speed and 70% less VRAM. In 2026 it added a Desktop app that bundles inference, training, image/video generation, web search, and agent integration into a complete local AI workstation."
description: "A complete Unsloth introduction: core fine-tuning capabilities (SFT, RL, GRPO), Desktop vs Studio vs Core, hardware requirements and platform support (NVIDIA, AMD, Mac), unsloth start agent integration, model export formats, and how it compares to Ollama, LM Studio, and llama.cpp."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-unsloth-local-llm-training)

The hardest parts of fine-tuning LLMs on your own hardware are VRAM limits, slow training, and environment setup. Unsloth tackles all three with hand-written Triton kernels — the same GPU can train larger models, twice as fast.

In 2026 it's no longer just a fine-tuning library. With the Desktop app and Studio web UI, Unsloth is now a local AI workstation that combines inference, training, image/video generation, web search, and agent integration. This post covers Unsloth's core capabilities, platform support, practical usage, and how it compares to other local AI tools.

---

## What Unsloth Is

Unsloth is an open-source tool (dual-licensed Apache 2.0 + AGPL-3.0) for **fine-tuning and running** large language models locally. The core selling point is performance: 2× faster training than native HuggingFace, 70% less VRAM.

Founded by brothers Daniel and Michael Han in December 2023. The key technical decision is hand-written Triton kernels that replace PyTorch's autograd, dramatically reducing memory overhead during backpropagation. Over 30K GitHub stars.

```bash
# Run a model with Unsloth Desktop, connect to Claude Code in one command
unsloth start claude
```

The biggest difference from Ollama and LM Studio: **Unsloth can fine-tune models; the other two can only run inference.**

---

## Three Ways to Use It

Unsloth offers three entry points for different users:

### Desktop (Native App)

A native desktop application for Mac, Windows, and Linux. The easiest way to get started — download, install, and go. No Python environment setup needed. Integrates inference, training, image/video generation, web search, and agent connections.

### Studio (Web UI)

An open-source, no-code web interface for training, running, and exporting models. Desktop is essentially a native wrapper around Studio. You can launch it manually via CLI:

```bash
# macOS / Linux / WSL
unsloth studio -H 0.0.0.0 -p 8888

# Expose via Cloudflare tunnel for remote HTTPS access
unsloth studio --secure
```

### Core (Code-Level)

A Python package, installed via `pip install unsloth`. For developers who need full control over the training pipeline, usable in Jupyter notebooks or scripts. This is the original interface with the most documentation and examples.

```python
from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Llama-3.2-3B-Instruct",
    max_seq_length=2048,
    load_in_4bit=True,
)

model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                     "gate_proj", "up_proj", "down_proj"],
    lora_alpha=16,
    lora_dropout=0,
    use_gradient_checkpointing="unsloth",
)
```

---

## Core Fine-Tuning Capabilities

This is Unsloth's key differentiator. It doesn't just run inference — it lets you train your own models on consumer hardware.

### Supported Training Methods

| Method | Description | VRAM Requirement |
|--------|-------------|------------------|
| QLoRA (4-bit) | Model quantized to 4-bit, only LoRA adapter is trained | Lowest (3B model ~3.5 GB) |
| LoRA (16-bit) | Base model frozen, low-rank adapter trained | Medium (3B model ~8 GB) |
| Full fine-tuning | Train the entire model | Highest |
| FP8 | 8-bit floating-point training, speed/precision trade-off | Medium |
| Pre-training | Train from scratch or continue pre-training | Highest |

### Reinforcement Learning (RL)

Supports GRPO (Group Relative Policy Optimization), claimed to use 80% less VRAM than standard implementations. This makes RL training on consumer GPUs feasible — something previously reserved for well-resourced teams.

### Data Processing

Studio and Desktop include no-code data processing:

- Import PDF, CSV, JSON, DOCX, TXT
- Automatic conversion to training dataset format
- Built-in sandboxed Bash and Python execution for model testing and output verification

### Model Export Formats

Trained models can be exported in multiple formats:

| Format | Use Case |
|--------|----------|
| GGUF | Run inference with Ollama, llama.cpp, LM Studio |
| 16-bit safetensors | Load with HuggingFace Transformers |
| LoRA adapter | Apply on top of a base model |
| NVFP4 | NVIDIA GPU optimized inference |

This is Unsloth's position in the local AI toolchain: **fine-tune with Unsloth → export to GGUF → run inference with Ollama or LM Studio.**

---

## Supported Models

Unsloth claims support for 500+ models. The main ones:

**General chat**: Llama 3.1/3.2/3.3/4, Qwen 3/3.5/3.8, Gemma 2/3/4, DeepSeek R1/V3/V4, Mistral/Mixtral, Phi-4, GLM-5.2, Kimi K3

**Vision/multimodal**: Llama 3.2 Vision, Gemma 3 Vision, Qwen 2.5-VL

**Embedding**: Embedding model fine-tuning supported

**TTS/audio**: Text-to-speech model fine-tuning supported

**Image/video generation** (Desktop/Studio): MiniMax-H3, FLUX, Wan, LTX, DiffusionGemma

Unsloth typically provides day-zero support for new model releases, and publishes pre-quantized Dynamic GGUF versions on HuggingFace that automatically select the best quantization level for your VRAM.

---

## Platform Support and Hardware Requirements

### Operating Systems

| Platform | Inference | Fine-Tuning |
|----------|-----------|-------------|
| Linux / WSL (Ubuntu 20.04+) | Full support | Full support |
| Windows 10/11 (64-bit) | Full support | Full support |
| macOS 12+ (Intel or Apple Silicon) | Full support | Full support (MLX) |

**Mac users note**: Fine-tuning on Mac runs through Apple's MLX framework, not CUDA. Inference supports both MLX and GGUF formats. The Desktop app natively supports Mac.

### GPU Support

| GPU | Inference | Fine-Tuning |
|-----|-----------|-------------|
| NVIDIA (CUDA 7.0+) | Full support | Full support, best performance |
| AMD (ROCm) | Supported | Supported (extra setup required) |
| Intel | Supported | Supported (extra setup required) |
| Apple Silicon (MLX) | Full support | Full support |
| CPU only | GGUF inference | Not supported |

### VRAM Requirements (QLoRA 4-bit, Minimum)

| Model Size | QLoRA Minimum VRAM | LoRA Minimum VRAM |
|------------|-------------------|-------------------|
| 3B | 3.5 GB | 8 GB |
| 7B | 5 GB | 19 GB |
| 14B | ~10 GB | ~35 GB |
| 70B | 41 GB | 164 GB |

QLoRA 4-bit is Unsloth's sweet spot: an RTX 4060 (8 GB) can fine-tune a 7B model, and an RTX 4090 (24 GB) can handle 14B. Mac users' unified memory (16 GB / 32 GB / 64 GB) serves as GPU memory.

---

## Agent Integration: unsloth start

A major 2026 feature is `unsloth start`, which connects local models to coding agents with one command:

```bash
# Connect to Claude Code
unsloth start claude

# Connect to Codex with a specific model and context length
unsloth start codex --model unsloth/gemma-4-E2B-it-GGUF:UD-Q4_K_XL --context-length 32768

# Connect to other agents
unsloth start hermes
unsloth start opencode
unsloth start openclaw
```

Technically, `unsloth start` automatically configures the endpoint, API key, provider, model, and context length — no manual agent configuration needed. Unrecognized arguments are passed directly to the agent.

A few caveats:

- Codex currently requires a GGUF model served through the `llama-server` backend
- Codex, OpenClaw, and Hermes need the `--persist` flag to maintain state across launches
- You can connect to a remote Unsloth server via `UNSLOTH_STUDIO_URL` and `UNSLOTH_API_KEY` environment variables

Unsloth also claims 50% improved tool calling accuracy with a built-in self-healing mechanism that detects failed tool calls and automatically retries.

---

## Other Built-In Features

### Web Search and Deep Research

Desktop and Studio include free, unlimited web search that visits pages directly rather than relying on search engine snippets. Deep Research mode builds a research plan, sources credible references, and produces a cited report.

### Image and Video Generation

Supports MiniMax-H3, FLUX, Wan, LTX, DiffusionGemma, and other diffusion models for local image and video generation.

### Remote Access

Built-in Cloudflare tunnel support — one command to serve your local model over HTTPS:

```bash
unsloth studio --secure
```

### OpenAI-Compatible API

Unsloth exposes an OpenAI-compatible API endpoint, so any code using the OpenAI SDK can connect directly.

---

## Comparison with Other Local AI Tools

| | Unsloth | Ollama | LM Studio | llama.cpp |
|---|---|---|---|---|
| **Core focus** | Fine-tuning + inference + generation | Local inference (one-command model runner) | Local inference (GUI) | Inference engine (C++ core) |
| **Fine-tuning** | Primary feature | No | No | No |
| **Interface** | Desktop GUI + Web UI + CLI | CLI + REST API | Desktop GUI | CLI only |
| **Open source** | Apache 2.0 + AGPL-3.0 | MIT | No (free to use) | MIT |
| **Mac support** | Inference + fine-tuning (MLX) | Inference (Metal) | Inference (Metal) | Inference (Metal) |
| **GPU management** | Automatic | Automatic | GUI controls | Fully manual |
| **Image/video gen** | Yes | No | No | No |
| **Agent integration** | `unsloth start` one-command | TUI launcher | None | None |
| **Model formats** | HF + GGUF + MLX | GGUF (Modelfile) | GGUF | GGUF |

### How to Choose

- **Want to fine-tune your own model** → Unsloth (the only option with full fine-tuning)
- **Just want the simplest inference + API server** → Ollama
- **Want a GUI chat interface, no terminal** → LM Studio
- **Want maximum low-level control, embed in your own code** → llama.cpp

They're not mutually exclusive. The most common combination is: **fine-tune with Unsloth → export GGUF → run inference with Ollama**. Both Unsloth Desktop and Ollama use llama.cpp under the hood for GGUF inference.

---

## Pricing

| Plan | Price | Features |
|------|-------|----------|
| Open Source / Desktop / Studio | Free | 2× speedup, 70% VRAM savings, single GPU |
| Pro | Contact sales | Multi-GPU (up to 8), additional speedup, less memory usage |
| Enterprise | Contact sales | Multi-node, 30% accuracy improvement, 5× inference speedup, support |

The free tier covers most individual users. Pro and Enterprise are aimed at teams that need multi-GPU training.

---

## Limitations and Caveats

### Training Requires a GPU

CPU-only systems can run inference but cannot fine-tune. Training requires at minimum an NVIDIA (CUDA), AMD (ROCm), Intel GPU, or Apple Silicon.

### Multi-GPU Support Is Still Improving

The official documentation notes that "a much better version is coming." Multi-GPU works but isn't fully optimized yet.

### Not a Production Inference Solution

Unsloth's inference is for development and testing, not high-concurrency production. For production inference, use vLLM or TGI.

### Mac Fine-Tuning Uses MLX

Fine-tuning on Mac runs through Apple's MLX framework rather than CUDA. Some advanced features and latest optimizations may not be fully equivalent. But basic LoRA/QLoRA fine-tuning is fully supported.

### Ecosystem Less Mature Than Ollama

Ollama has extensive third-party integrations (OpenWebUI, LangChain, n8n, etc.). Unsloth's inference ecosystem is newer; agent integration is its main selling point.

---

## Bottom Line

Unsloth's core value is clear: **make LLM fine-tuning — something that used to be expensive — feasible on consumer hardware.** QLoRA 4-bit plus hand-written Triton kernel optimizations mean an 8 GB GPU can fine-tune a 7B model.

The 2026 pivot is also interesting — from a Python fine-tuning library to a full workstation with Desktop GUI, Web UI, agent integration, and image/video generation. This mirrors Ollama's evolution from "LLM runner" to "AI developer hub."

Good for: fine-tuning LLMs on your own data, RL training to improve model behavior, running fine-tuned models locally for development, connecting local models to Claude Code or Codex.

Not for: just wanting to chat without touching training (use Ollama or LM Studio), high-concurrency production inference (use vLLM), machines with no GPU at all (inference only, no training).

If you're already running local models with Ollama and feel open-source models fall just short, Unsloth lets you fine-tune on your own data to close that gap — without renting an A100.

## References

- [Unsloth Official Website](https://unsloth.ai/) — Desktop downloads, documentation, and model directory
- [Unsloth GitHub Repository](https://github.com/unslothai/unsloth) — Source code and issue tracker
- [Unsloth Documentation](https://unsloth.ai/docs) — Installation, fine-tuning, inference, and agent integration guides
- [Unsloth Start Documentation](https://unsloth.ai/docs/integrations/unsloth-start) — Agent integration command reference
- [Unsloth Studio Documentation](https://unsloth.ai/docs/new/studio) — Web UI features and launch commands
- [The Complete Ollama Guide](/posts/ai/2026-03-14-ollama-local-llm-guide-en/) — Ollama inference tool introduction on this site
- [llama.cpp Guide](/posts/ai/2026-04-01-llama-cpp-local-llm-inference-en/) — llama.cpp inference engine introduction on this site
