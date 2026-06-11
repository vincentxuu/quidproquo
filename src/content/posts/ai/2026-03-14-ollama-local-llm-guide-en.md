---
title: "The Complete Ollama Guide: Run LLMs Locally with One Command"
date: 2026-03-14
type: guide
category: ai
tags: [ollama, llm, local-inference, llama-cpp, self-hosted, openai-compatible]
lang: en
tldr: "Ollama wraps llama.cpp in a Docker-style CLI + REST API, letting you run LLMs locally with a single command. This post covers core concepts, installation, API, hardware requirements, Modelfile customization, and what this tool is — and isn't — good for."
description: "A complete Ollama introduction: installation and setup, CLI commands, REST API and OpenAI-compatible endpoints, hardware requirements, Modelfile customization, ecosystem integrations, and comparisons with llama.cpp, LM Studio, and vLLM."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-14-ollama-local-llm-guide)

When running LLMs locally, the most common hurdles are: converting model formats, manually allocating GPU memory, and picking quantization parameters yourself. Ollama wraps all of this up, letting you download and launch a model with a single command. This post is a comprehensive look at Ollama's design, usage, and real-world limitations.

---

## What Is Ollama

Ollama is an open-source platform (MIT license) for running large language models on local machines. Under the hood it uses the llama.cpp inference engine, with a Docker-style CLI and REST API layered on top.

Core design philosophy: **manage models like you manage containers**. Model weights, configuration, and runtime environment are packaged into a unit called a Modelfile. Model layers are cached like container images, and shared layers don't need to be downloaded again.

```bash
# This single line does three things: downloads the model, configures GPU, and starts an interactive chat
ollama run llama3.2
```

As of 2026 Q1, Ollama sees 52 million monthly downloads and has over 100,000 stars on GitHub.

---

## Core Capabilities at a Glance

Ollama is more than just a CLI tool — it's a complete local LLM runtime platform:

- **One-command model management** — `ollama run`, `ollama pull`, `ollama rm`
- **Automatic GPU detection** — NVIDIA CUDA, AMD ROCm, Apple Metal all auto-detected
- **Automatic VRAM management** — Multiple models loaded simultaneously; overflow to RAM when VRAM is exceeded
- **OpenAI-compatible API** — `localhost:11434/v1/` can directly replace an OpenAI endpoint
- **Modelfile system** — Configuration files similar to Dockerfiles
- **Multimodal** — Supports vision models (Gemma 3, Llama 3.2 Vision, LLaVA)
- **Structured output** — JSON Schema-constrained response formats
- **Tool calling** — Function calling support
- **Embeddings** — Built-in embedding endpoint

---

## Supported Models

The full list is at [ollama.com/library](https://ollama.com/library). Here are the highlights:

**General chat**: Llama 3.1/3.2/4 (Meta), Mistral/Mixtral (Mistral AI), Qwen 2.5/3 (Alibaba), Gemma 2/3 (Google), Phi-3/4 (Microsoft), GPT-OSS (OpenAI open-source models)

**Reasoning**: DeepSeek R1, DeepSeek-v3.1 (various distilled sizes)

**Code**: Qwen 2.5-Coder, CodeLlama, Qwen3-Coder

**Vision**: Gemma 3 (officially recommended), Llama 3.2 Vision, LLaVA

**Embeddings**: embeddinggemma, qwen3-embedding, all-minilm (official top three picks)

Models not in the official library can be manually imported as long as they're in GGUF format.

---

## Recent New Features (2025-2026)

Ollama has added several noteworthy features over the past year:

### Thinking/Reasoning Mode

Supports thinking mode for models like Qwen 3, DeepSeek R1, DeepSeek-v3.1, and GPT-OSS. Responses are split into two fields: `thinking` (reasoning process) and `content` (final answer). You can choose to show or hide the reasoning chain.

```bash
# Enable thinking (on by default for compatible models)
ollama run deepseek-r1 --think "How many r's in strawberry?"

# Hide reasoning, show only the answer
ollama run deepseek-r1 --hidethinking "Explain quantum entanglement"

# Toggle in interactive mode
>>> /set think
>>> /set nothink
```

GPT-OSS is special — thinking isn't a boolean but has levels (low/medium/high):

```bash
ollama run gpt-oss --think=low "Simple question"
```

At the API level, adding `think: true` to a chat or generate request causes `message.thinking` to include the reasoning content.

### Tool Calling (Three Modes)

Ollama's tool calling goes beyond single invocations, supporting three modes:

1. **Single** — The model calls one tool; you execute it and feed the result back
2. **Parallel** — The model calls multiple tools at once; you execute all of them and return results together
3. **Agent Loop** — Multi-turn loop where the model decides when to call tools and when to stop

The Python SDK lets you pass function objects directly to the `tools` parameter, which are automatically parsed into schemas. JavaScript requires manually defining JSON Schemas.

### Structured Output (JSON Schema)

Beyond just `format: "json"` returning arbitrary JSON, you can now use full JSON Schema to constrain response formats:

```python
from ollama import chat
from pydantic import BaseModel

class Country(BaseModel):
    name: str
    capital: str
    languages: list[str]

response = chat(
    model='llama3.2',
    messages=[{'role': 'user', 'content': 'Tell me about Taiwan'}],
    format=Country.model_json_schema(),
)
country = Country.model_validate_json(response.message.content)
```

On the JavaScript side, use Zod + `zodToJsonSchema()` for the same effect. Vision models also support structured output — you can use a schema to constrain the fields of image descriptions.

### Web Search (Cloud Feature)

Note: This is not a local feature. It requires an Ollama account and API key (obtainable from [ollama.com/settings/keys](https://ollama.com/settings/keys)).

Two cloud APIs are provided:
- `POST https://ollama.com/api/web_search` — Search queries, returning titles + URLs + summaries
- `POST https://ollama.com/api/web_fetch` — Fetch full content from a specific URL

```python
import ollama
response = ollama.web_search("Ollama latest version")
```

Combined with models like Qwen 3, you can build a search agent: the model autonomously decides when to search, when to fetch, and when to answer. The official recommendation is to use models with 32K+ context for search agents. Integration with tools like Cline and Codex is also available via MCP Server.

### Ollama Cloud

Cloud hosting service launched in September 2025:

- **Pro**: $20/month
- **Max**: $100/month

Suitable for those who don't want to manage hardware but want to use the Ollama ecosystem. Cloud models run at full context capacity. However, public documentation for rate limits, per-token billing, and enterprise SLAs is still lacking — it's still in early stages.

### TUI Interactive Interface + AI Tool Launcher (0.18.3)

This is the biggest positioning shift. Starting from 0.18, typing `ollama` in the terminal with no arguments opens an interactive TUI menu:

```
Ollama 0.18.3

▸ Run a model
    Start an interactive chat with a model

  Launch Claude Code
    Anthropic's coding tool with subagents

  Launch Codex
    OpenAI's open-source coding agent

  Launch OpenClaw
    Personal AI with 100+ skills

  Launch Visual Studio Code
    Microsoft's open-source AI code editor

  Launch Cline (not installed)
    Install with: npm install -g cline

↑/↓ navigate • enter launch • → configure • esc quit
```

Ollama is no longer just a "local LLM runner" — it has become a **unified entry point for AI development tools**. The official documentation lists 18 integrated tools: Claude Code, Codex, Cline, OpenClaw, VS Code, JetBrains, Xcode, Zed, Roo Code, OpenCode, Droid, Pi, Goose, Marimo, n8n, NemoClaw, Onyx, and more. Tools that aren't installed display installation commands.

This is a smart design move — Ollama is already the default choice for developers running local LLMs, and turning itself into an AI tool launcher means it's competing for the entry point position in developer workflows.

---

## Installation

### macOS

```bash
# Or download .dmg from ollama.com/download
brew install ollama
```

Apple Silicon automatically enables Metal GPU acceleration with no extra configuration.

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Automatically installs the binary and sets up a systemd service.

### Windows

```bash
winget install Ollama.Ollama
```

### Docker

```bash
# CPU
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# NVIDIA GPU
docker run -d --gpus all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama

# AMD GPU
docker run -d --device /dev/kfd --device /dev/dri \
  -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama:rocm
```

macOS Docker Desktop does not support GPU passthrough — running the Docker version falls back to CPU. It's recommended to install natively on macOS.

---

## Environment Variables and Advanced Configuration

Ollama's behavior is almost entirely controlled by environment variables. These are the ones you'll eventually need:

### Core Settings

| Variable | Purpose | Default |
|----------|---------|---------|
| `OLLAMA_HOST` | Bind address and port | `127.0.0.1:11434` |
| `OLLAMA_MODELS` | Model storage path | `~/.ollama/models` (macOS), `/usr/share/ollama/.ollama/models` (Linux) |
| `OLLAMA_ORIGINS` | CORS allowed origins | `127.0.0.1`, `0.0.0.0` |
| `OLLAMA_NO_CLOUD` | Disable cloud features | Not set |
| `HTTPS_PROXY` | Proxy for model downloads | Not set |

### Performance Tuning

| Variable | Purpose | Default |
|----------|---------|---------|
| `OLLAMA_CONTEXT_LENGTH` | Global context window size | Auto-determined by VRAM |
| `OLLAMA_NUM_PARALLEL` | Max parallel requests per model | `1` |
| `OLLAMA_MAX_LOADED_MODELS` | Models loaded in memory simultaneously | GPU count x 3 (or 3 in CPU mode) |
| `OLLAMA_MAX_QUEUE` | Request queue limit; returns 503 when exceeded | `512` |
| `OLLAMA_KEEP_ALIVE` | How long a model stays in memory after idle | `5m` |
| `OLLAMA_FLASH_ATTENTION` | Enable Flash Attention (saves memory) | Not enabled |
| `OLLAMA_KV_CACHE_TYPE` | KV Cache quantization type | `f16` (options: `q8_0` for half memory, `q4_0` for quarter) |

`OLLAMA_KEEP_ALIVE` supports multiple formats: `"10m"`, `"24h"`, `0` (unload immediately after use), negative values (never unload). The memory overhead of `OLLAMA_NUM_PARALLEL` = parallel count x context length — setting it too high will exhaust memory.

### Platform-Specific Configuration

```bash
# macOS — Set via launchctl, restart app to take effect
launchctl setenv OLLAMA_CONTEXT_LENGTH 64000

# Linux — Edit the systemd service
sudo systemctl edit ollama.service
# Add under the [Service] section:
# Environment="OLLAMA_CONTEXT_LENGTH=64000"
sudo systemctl daemon-reload && sudo systemctl restart ollama

# Windows — System Settings → Environment Variables, restart app
```

---

## CLI Commands

Commands you'll use day to day:

```bash
ollama serve                          # Start server (port 11434)
ollama run llama3.2                   # Download + start interactive chat
ollama run llama3.2 "Explain the TCP three-way handshake"  # One-shot question
ollama pull qwen2.5:14b               # Download only, don't launch
ollama list                           # List downloaded models
ollama ps                             # See which models are in memory
ollama show llama3.2                  # Model info (architecture, quantization, license)
ollama rm mistral                     # Delete a model
ollama stop llama3.2                  # Unload from memory
```

You can adjust parameters in real time during interactive mode:

```
>>> /set parameter temperature 0.8
>>> /set system "You are a senior backend engineer"
>>> /set think                          # Enable reasoning mode
>>> /set nothink                        # Disable reasoning mode
>>> /show info
>>> /bye
```

---

## API

Ollama provides two API sets at `localhost:11434`.

### Native API

```bash
# Multi-turn chat
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "What is RAG?"}],
  "stream": false
}'

# Generate embeddings
curl http://localhost:11434/api/embed -d '{
  "model": "nomic-embed-text",
  "input": "Ollama is a local LLM platform"
}'
```

Other endpoints: `/api/generate` (text generation), `/api/tags` (list models), `/api/pull` (download models), `/api/show` (model info), `/api/ps` (running models).

### Performance Metrics in API Responses

Every API response includes performance data (in nanoseconds):

```json
{
  "total_duration": 5589157167,
  "load_duration": 3013701500,
  "prompt_eval_count": 46,
  "prompt_eval_duration": 1160282000,
  "eval_count": 113,
  "eval_duration": 1325948000
}
```

To calculate token generation speed: `eval_count / eval_duration x 10^9` = tokens/sec. The example above gives `113 / 1.326 ≈ 85 tok/s`. This number is useful for identifying hardware bottlenecks — if `load_duration` dominates, the model is being frequently unloaded and reloaded; consider increasing `OLLAMA_KEEP_ALIVE`.

### Advanced Parameters: The options Object

Both `/api/chat` and `/api/generate` support an `options` object that lets you override model parameters at the per-request level:

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "Write a poem"}],
  "stream": false,
  "options": {
    "temperature": 1.2,
    "top_p": 0.95,
    "num_ctx": 8192,
    "seed": 42,
    "repeat_penalty": 1.2
  },
  "keep_alive": "30m"
}'
```

`seed` combined with a fixed `temperature` produces reproducible output — useful for testing and debugging.

### OpenAI-Compatible Endpoints

This is one of Ollama's most practical features. Any code using the OpenAI SDK can switch to a local model just by changing `base_url`:

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:11434/v1/",
    api_key="ollama",  # Any string; Ollama doesn't validate
)

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Write a binary search in Python"}],
)
print(response.choices[0].message.content)
```

Supported endpoints: `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`, `/v1/models`. Streaming, function calling, and structured output are all supported.

---

## Hardware Requirements

### Memory Reference Table (4-bit Quantization)

| Model Size | Required RAM/VRAM |
|------------|------------------|
| 7B | ~4-5 GB |
| 13B | ~8-9 GB |
| 30B | ~16-20 GB |
| 70B | ~40+ GB |

Reserve 2-3 GB for the OS. Higher quantization levels (Q8, FP16) increase memory requirements by 2-4x.

### GPU Support

**NVIDIA** (most complete): CUDA compute capability 5.0+. The RTX 4090 (24 GB) is the top consumer choice; the RTX 4060 (8 GB) is the budget option.

**AMD**: Supported on Linux via ROCm; experimental on Windows. The RX 7900 XTX (24 GB) works well, but some GPUs may need the `HSA_OVERRIDE_GFX_VERSION` environment variable.

**Apple Silicon**: Metal API is automatically enabled. The unified memory architecture advantage is that all system RAM is available to the GPU — M-series chips with 32 GB+ memory provide an excellent local LLM experience.

### Context Length and VRAM Relationship

Ollama automatically determines context window size based on VRAM:

| Available VRAM | Default Context Length |
|---------------|----------------------|
| < 24 GB | 4,000 tokens |
| 24-48 GB | 32,000 tokens |
| > 48 GB | 256,000 tokens |

For web search, agent tasks, and coding tool scenarios, the official recommendation is at least 64,000 tokens. Manual configuration:

```bash
# Global setting
OLLAMA_CONTEXT_LENGTH=64000 ollama serve

# Per-request level (via options.num_ctx)
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3",
  "messages": [...],
  "options": {"num_ctx": 64000}
}'
```

Doubling context length doubles KV cache memory. Combining with `OLLAMA_KV_CACHE_TYPE=q8_0` lets you run the same context at half the memory, at the cost of slightly reduced precision. `q4_0` is even more efficient (quarter memory), but the quality impact is more noticeable.

### When VRAM Isn't Enough

Ollama automatically spills some layers to system RAM. The upside is it doesn't crash; the downside is speed drops 5-30x.

```bash
# Check GPU/CPU allocation status
ollama ps
# NAME       SIZE    PROCESSOR    CONTEXT
# llama3.2   4.9 GB  100% GPU     8192
```

`PROCESSOR` showing `100% GPU` is the ideal state. If you see `50% GPU / 50% CPU`, it means the model is partially running on CPU with significantly reduced performance. Solutions: use a smaller model, reduce context length, enable KV cache quantization, or upgrade hardware.

---

## Modelfile Customization

Modelfile is one of Ollama's killer features. The syntax resembles Dockerfile:

```dockerfile
FROM llama3.2

PARAMETER temperature 0.7
PARAMETER num_ctx 8192
PARAMETER top_p 0.9

SYSTEM """You are a senior software engineer. Always include code examples in your answers and explain your reasoning step by step."""
```

```bash
# Create a custom model
ollama create my-code-assistant -f ./Modelfile

# Use it
ollama run my-code-assistant

# View any model's Modelfile
ollama show --modelfile llama3.2
```

### All Directives

| Directive | Purpose |
|-----------|---------|
| `FROM` | Base model (required). Can be a model name, local GGUF path, or safetensors directory |
| `SYSTEM` | System prompt, injected into the template's `{{ .System }}` |
| `PARAMETER` | Inference parameters (see full list below) |
| `TEMPLATE` | Custom prompt template (Go template syntax, variables: `{{ .System }}`, `{{ .Prompt }}`, `{{ .Response }}`) |
| `ADAPTER` | Apply a LoRA adapter (safetensors directory or GGUF file) |
| `MESSAGE` | Pre-fill conversation history, specifying role (system/user/assistant) to guide model behavior |
| `LICENSE` | Declare license terms |
| `REQUIRES` | Specify minimum Ollama version (e.g., `REQUIRES 0.14.0`) |

### Complete Parameter Table

| Parameter | Description | Default |
|-----------|-------------|---------|
| `temperature` | Creativity; higher = more random | 0.8 |
| `num_ctx` | Context window size (tokens) | 2048 |
| `num_predict` | Max generated tokens (-1 = unlimited) | -1 |
| `top_k` | Limit candidate tokens; lower = more deterministic | 40 |
| `top_p` | Nucleus sampling threshold | 0.9 |
| `min_p` | Minimum probability threshold | 0.0 |
| `repeat_penalty` | Repetition penalty | 1.1 |
| `repeat_last_n` | Lookback window for repetition detection | 64 |
| `seed` | Random seed (with fixed temperature, enables reproducible output) | 0 |
| `stop` | Stop sequences (can be set multiple times) | — |

### Advanced Example: Pre-filling Conversations with MESSAGE

```dockerfile
FROM llama3.2
SYSTEM """You are a Taiwan labor law consultant, specializing in the Labor Standards Act. Answer in Traditional Chinese."""
PARAMETER temperature 0.3
PARAMETER num_ctx 8192

# Pre-fill few-shot examples with MESSAGE
MESSAGE user "How is overtime pay calculated?"
MESSAGE assistant "According to Article 24 of the Labor Standards Act, for extended working hours, the first 2 hours are paid at 1/3 above the regular hourly wage, and the next 2 hours at 2/3 above."
```

Modelfile lets you create different model configurations for different purposes — one specialized for coding, one for translation, one for RAG — without re-downloading model weights. You're just applying different settings on top of the same base model.

---

## Importing Custom Models

For models not in the Ollama library, there are three import methods:

### GGUF Files (Most Common)

Community-quantized GGUF files on HuggingFace can be used directly:

```dockerfile
# Modelfile
FROM ./my-model-q4_K_M.gguf
SYSTEM "Your system prompt"
```

```bash
ollama create my-model -f Modelfile
ollama run my-model
```

### Safetensors (Full Models or Adapters)

Import a full model directly:

```dockerfile
FROM /path/to/safetensors/directory
```

Or import a LoRA adapter (output from fine-tuning with tools like Unsloth or MLX):

```dockerfile
FROM llama3.2
ADAPTER /path/to/adapter/directory
```

Important: The `FROM` base model must be exactly the same one you used when training the adapter, otherwise results will be unpredictable.

### Quantization

You can quantize when importing FP16/FP32 models:

```bash
ollama create --quantize q4_K_M my-model -f Modelfile
```

Supported quantization types: `q4_K_S`, `q4_K_M` (recommended — good balance of quality and size), `q8_0`.

### Sharing Models

```bash
ollama cp my-model myuser/my-model
ollama push myuser/my-model
# Others can then run: ollama run myuser/my-model
```

---

## Comparison with Other Solutions

| | Ollama | llama.cpp | LM Studio | vLLM |
|---|---|---|---|---|
| Interface | CLI + REST API | Pure CLI | GUI + API | Server API |
| Installation | One command | Requires compilation | Installer | pip install |
| Open source | MIT | MIT | No (free) | Apache 2.0 |
| Best for | Developers, API integration | Maximum performance control | Beginners, GUI preference | Production high-throughput |
| GPU management | Automatic | Fully manual | GUI controls | Auto-optimized |

**How to choose?**

- Want fastest setup + API-driven development → **Ollama**
- Want a GUI you can point and click → **LM Studio**
- Need maximum performance control and customization → **llama.cpp**
- Need production deployment with high concurrency → **vLLM**

Both Ollama and LM Studio use llama.cpp under the hood. Ollama wins on automatic VRAM management and developer-friendly APIs; LM Studio wins on UI and model discovery experience.

---

## Ecosystem

Ollama's official documentation lists 18 integrated tools, and the community ecosystem is already quite mature:

| Category | Tools |
|----------|-------|
| Web UI | OpenWebUI (the most ChatGPT-like local interface) |
| AI Coding | Claude Code, Codex, Cline, Roo Code, OpenCode, Droid, Pi, Goose |
| IDE | VS Code, JetBrains, Xcode, Zed |
| Automation | n8n, Marimo |
| Personal Assistant | OpenClaw, NemoClaw, Onyx |
| RAG Frameworks | LangChain, LlamaIndex |

Common pairings: Ollama + OpenWebUI for a local chat interface, Ollama + LangChain for local RAG, Ollama + Claude Code/Codex for using local models as coding agents. The TUI launcher in version 0.18 makes switching between these tools even more seamless.

---

## Limitations and Caveats

### Not a Production Solution

Ollama is designed for local development and experimentation, not production deployment. There's no built-in load balancing, horizontal scaling, or observability. Request queuing is silent — it won't reject requests, just silently increases latency with no warnings.

### Security Is a Major Concern

There's no authentication by default. If you set `OLLAMA_HOST` to `0.0.0.0`, the API is open to everyone. In January 2026, reports identified 175,000 exposed Ollama servers being exploited. Any non-localhost deployment must include a reverse proxy + authentication.

### Model Quality Ceiling

Open-source models running locally still generally can't match cloud APIs like Claude or GPT-4o on complex reasoning tasks. 7B models are suitable for simple tasks; 70B approaches cloud quality, but hardware requirements scale accordingly.

### Other Limitations

- Cannot select specific quantization methods (Ollama decides automatically)
- Models are stored in a proprietary blob format, making cross-tool sharing inconvenient (unlike using GGUF directly)
- Inference only, no fine-tuning (though you can apply LoRA adapters)
- No built-in GUI — requires third-party frontends like OpenWebUI
- AMD GPU support is less mature than NVIDIA

---

## Debugging and Troubleshooting

### Where Are the Logs

```bash
# macOS
cat ~/.ollama/logs/server.log

# Linux (systemd)
journalctl -u ollama --no-pager --follow

# Docker
docker logs ollama

# Windows
# %LOCALAPPDATA%\Ollama (server log)
# %HOMEPATH%\.ollama (models and config)
```

To enable debug mode on Windows: `$env:OLLAMA_DEBUG="1"` before launching.

### GPU Not Detected

**NVIDIA**: Verify `nvidia-smi` runs. In Docker, test with `docker run --gpus all ubuntu nvidia-smi`. If the UVM driver isn't loaded: `sudo nvidia-modprobe -u`. Advanced diagnostics: `CUDA_ERROR_LEVEL=50`.

**AMD**: The user must be in the `video` and `render` groups to access `/dev/kfd`. Docker containers need `--group-add` with the corresponding GID. ROCm versions below v6 may cause timeouts — upgrade to v7.

### Common Issues

**Model gradually slows down**: Check the `PROCESSOR` column with `ollama ps`. If it changes from `100% GPU` to a `GPU/CPU` mix, memory is insufficient and spilling has started. Reduce `num_ctx` or switch to a smaller model.

**CPU fallback but you don't want it**: Force a specific LLM library: `OLLAMA_LLM_LIBRARY="cpu_avx2" ollama serve`. Priority order: `cpu_avx2` > `cpu_avx` > `cpu` (most compatible; works with macOS Rosetta too).

**GPU not working in Docker**: Check `/etc/docker/daemon.json` and confirm it has `"exec-opts": ["native.cgroupdriver=cgroupfs"]`.

**`/tmp` mounted as noexec**: Set `OLLAMA_TMPDIR` to point to another directory.

**Installing a specific version**:

```bash
curl -fsSL https://ollama.com/install.sh | OLLAMA_VERSION=0.5.7 sh
```

---

## The Big Picture

Ollama's core trade-off is clear: **sacrifice a layer of abstraction for developer experience**. You give up llama.cpp's fine-grained control in exchange for one-command model execution + OpenAI-compatible API + automatic GPU management.

From 2025 to 2026, Ollama's positioning has expanded from "local LLM runner" to "unified entry point for AI developers." Thinking mode, tool calling agent loops, structured output, web search, TUI launcher — these features combined have transformed it from a simple inference tool into a development platform.

Good use cases: local development and testing of LLM applications, cost-saving prototype development, privacy-sensitive offline usage, experimenting with RAG frameworks, importing custom fine-tuned models for inference.

Not-so-good use cases: high-concurrency production environments (use vLLM), maximum performance tuning needed (use llama.cpp), non-technical users (use LM Studio).

If you're a developer who wants to run LLMs locally for development and testing, Ollama is currently the lowest-friction option.

## References

- [Ollama Official Documentation](https://ollama.com/docs) — Complete reference for Ollama CLI, API, and Modelfile
- [Ollama GitHub Repository](https://github.com/ollama/ollama) — Source code, issue tracker, and release notes
- [llama.cpp GitHub Repository](https://github.com/ggml-org/llama.cpp) — Ollama's underlying inference engine, a C++ implementation supporting GGUF format
- [Searching for Best Practices in Retrieval-Augmented Generation](https://arxiv.org/abs/2407.01219) — Wang et al. (2024), research on best practices for local LLMs with RAG
- [OpenWebUI GitHub Repository](https://github.com/open-webui/open-webui) — The most commonly paired open-source Web UI for Ollama
- [vLLM Documentation](https://docs.vllm.ai/) — Official vLLM docs, for comparison as a production alternative to Ollama
- [Meta Llama Official Page](https://llama.meta.com/) — Meta's official Llama model licensing and technical details
- [Ollama — Modelfile Documentation](https://github.com/ollama/ollama/blob/main/docs/modelfile.md) — Complete Modelfile syntax specification, including all directives and parameter descriptions
