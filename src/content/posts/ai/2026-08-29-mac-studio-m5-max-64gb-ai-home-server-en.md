---
title: "Choosing Mac Studio M5 Max Memory: AI Home Server Architecture, Tiered Models, and Router AI"
date: 2026-08-29
category: ai
type: deep-dive
tags: [mac-studio, local-llm, ai-home-server, architecture, mcp, claude, llm-router]
lang: en
tldr: "The goal isn't replacing Claude with local LLMs — it's building a 24/7 AI Home Server. A local 35B model handles the brain and offline fallback, while Claude Haiku and Sonnet each own a tier. 64GB is enough."
description: "Working backward from an AI Home Server's tiered model architecture to determine Mac Studio M5 Max memory needs — how Local LLM, Claude Haiku, and Claude Sonnet divide the work, and why 64GB suffices."
draft: false
glossary:
  - term: "Router AI"
    definition: "負責判斷每個請求該交給哪個模型處理的路由層，通常由規則引擎加上小型分類模型組成。"
    definition_en: "A routing layer that decides which model handles each request, typically combining rule-based logic with a small classifier model."
---

> 🌏 [中文版](/posts/ai/2026-08-29-mac-studio-m5-max-64gb-ai-home-server)

Should the [Mac Studio M5 Max](https://www.apple.com/mac-studio/specs/) have 64GB or 128GB of unified memory? After going back and forth, I chose 64GB — not to save money, but because mapping out the full architecture proved that what I actually want to build doesn't need 128GB. This post walks through the decision process and the AI Home Server architecture that settled it.

## 64GB or 128GB?

The new Mac Studio M5 Max [starts at NT$84,900 in Taiwan](https://mrmad.com.tw/apple-mac-studio-2026-specs-price) (~US$2,499), with an 18-core CPU, up to 40-core GPU, and 614GB/s memory bandwidth. The 40-core GPU model offers 48GB, 64GB, or 128GB unified memory.

Jumping from 64GB to 128GB costs roughly NT$56,000 (~US$1,600) — more than an entry-level Mac mini.

If the goal is running bigger local LLMs, 128GB makes sense: it fits a 70B model at Q4 quantization, or two 35B models side by side. But the real question is: do I need 70B locally?

## Not a Local LLM Workstation — an AI Home Server

Stepping back, what I actually want is not a computer that replaces [Claude](https://claude.com/pricing) with local models. It's a 24/7 Personal AI Home Server.

The difference: a Local LLM workstation optimizes for "how large a model can I run locally." An AI Home Server optimizes for "how many tools can I integrate, how much can it handle autonomously." One is compute-driven, the other is integration-driven.

The hard truth: even a fully loaded [M5 Ultra with 512GB](https://www.apple.com/mac-studio/specs/) starting at NT$199,900 (~US$6,999) can't match the inference quality of a $200/month [Claude Max 20x plan](https://claude.com/pricing). Claude Opus-level complex reasoning, long-horizon planning, and agentic work aren't things local models can replace anytime soon.

So the question shifts from "how do I run the biggest local model" to "how do I split work between local and cloud."

## Tiered Model Architecture

Three model layers, each handling a different tier of work.

### Local LLM (7B–35B): The Local Brain

The local model isn't the primary reasoning engine. It serves three roles:

1. **Router / Classifier**: determine user intent, classify task difficulty, decide which model handles it
2. **Lightweight tasks**: simple Q&A, format conversion, data extraction
3. **Offline fallback**: backup reasoning when the network is down

Take [Qwen3.5 35B-A3B](https://github.com/QwenLM/Qwen3.5) as an example: at Q4 quantization it [needs only ~21GB of unified memory](https://willitrunai.com/blog/qwen-3-5-35b-a3b-vram-requirements), and its MoE architecture activates just 3B parameters per inference pass, reaching 60+ tok/s on Apple Silicon. Deploy with [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) or [MLX](https://github.com/ml-explore/mlx) for fast startup and predictable memory use.

### Claude Haiku: The Fast Processing Layer

[Claude Haiku 4.5](https://claude.com/pricing) at $1/$5 per MTok is fast and cheap. It handles:

- Summarization, classification, translation
- Medium-complexity conversations
- High-volume repetitive tasks (batch processing at 50% off)

Costs sit between Local LLM's "free" and Sonnet — most daily Home Server tasks don't need anything stronger.

### Claude Sonnet: The Complex Reasoning Layer

When the task demands complex reasoning, long-horizon planning, or multi-step agents, it goes to [Claude Sonnet 4.6](https://claude.com/pricing) at $3/$15 per MTok:

- Multi-step agent workflows
- Code generation and analysis
- Critic / Evaluator / Planner tasks

Only the most token-intensive work hits this layer.

### How Router AI Routes Requests

Router AI is the critical switch in this architecture. It's not a single large model — it's a rule engine plus a small classifier:

1. **Rule matching**: specific commands route directly ("turn on lights" → [Home Assistant](https://www.home-assistant.io/), no LLM needed)
2. **Small-model classification**: a 7B model classifies task difficulty and type
3. **Difficulty assessment**: simple tasks stay local, medium tasks go to Haiku, complex tasks escalate to Sonnet

Each layer processes only what it's best at, optimizing both cost and latency.

## Full AI Home Server Architecture

Here's what the full system looks like:

![AI Home Server Architecture](/images/posts/2026-08-29/ai-home-server-architecture.jpg)

### Entry Points

Multiple entry points run concurrently:

- **Telegram / LINE Bot**: primary conversational interfaces
- **Web UI**: admin console and advanced operations
- **Warashi**: a custom-built [Live2D](https://www.live2d.com/) voice AI interface
- **Voice input (STT)**: speech-to-text via [Whisper](https://github.com/openai/whisper)

All entry points pass through an AI Gateway that handles authentication, permissions, rate limiting, and session management.

### MCP / Tool Layer

Tools connected via [MCP (Model Context Protocol)](/posts/ai/2026-03-22-mcp-model-context-protocol):

| Tool | Purpose |
|------|---------|
| [Home Assistant](https://www.home-assistant.io/) | Smart home control |
| Apple Calendar / Notes | Scheduling and personal notes |
| [Linear](https://linear.app/) | Project management |
| [Obsidian](https://obsidian.md/) | Knowledge base (local) |
| [Notion](https://www.notion.so/) | Knowledge base (cloud) |
| Web / API | Web search and data retrieval |
| [ComfyUI](https://github.com/comfyanonymous/ComfyUI) | Image generation |
| Music AI | Composition (ACE-Step / Stable Audio) |

### Memory Layer

Following the [Agent Memory architecture](/posts/ai/2026-03-19-agent-memory-systems), split into three tiers:

- **Episodic**: conversation logs and event history
- **Semantic**: knowledge graphs and vector search ([Qdrant](https://qdrant.tech/))
- **Working**: short-term memory for the current session

### Infrastructure

Everything runs in [Docker](https://www.docker.com/) containers on the Mac Studio:

| Service | Role |
|---------|------|
| [PostgreSQL](https://www.postgresql.org/) | Relational data |
| [Redis](https://redis.io/) | Cache and queue |
| [Qdrant](https://qdrant.tech/) | Vector database |
| [Whisper](https://github.com/openai/whisper) | Speech recognition |
| TTS | Text-to-speech |
| Scheduler / Monitoring / Backup | Orchestration, observability, resilience |

### Development Workflow

Development runs separately and doesn't consume the Home Server's 24/7 resources: [Claude Code](https://claude.ai/code) and Codex run in the cloud, sharing MCP tools and Git project management.

## Is 64GB Enough?

Here's the memory budget:

| Component | Estimated Usage |
|-----------|----------------|
| macOS + system services | ~8 GB |
| Docker containers (PostgreSQL + Redis + Qdrant + others) | ~6 GB |
| Local LLM (35B Q4_K_M) | ~21 GB |
| Whisper + TTS | ~3 GB |
| **Total** | **~38 GB** |
| **Remaining headroom** | **~26 GB** |

26GB of headroom is plenty for KV cache, memory spikes, or temporarily loading a second small model for A/B testing.

128GB would let me run two 35B models simultaneously or a single 70B dense model — but that's a "toy upgrade," not an architectural requirement.

## Overall

The decision boils down to one principle: draw the architecture first, then pick the hardware.

64GB supports a 24/7 Home Server integrating smart home, Apple ecosystem, project management tools, and a multi-tier AI stack. The extra headroom from 128GB would go toward running bigger local LLMs — which isn't the goal. What I need is integration, not raw compute.

Rather than spending NT$56,000 on non-upgradeable, depreciating RAM, it makes more sense to save it for the next-generation Mac Studio in two years. By then, 64GB might be the baseline config, and locally runnable models will be a generation stronger.

## References

- [Mac Studio — Technical Specifications (Apple)](https://www.apple.com/mac-studio/specs/)
- [Plans & Pricing — Claude by Anthropic](https://claude.com/pricing)
- [Apple Mac Studio 2026: 7 Spec Highlights, Taiwan Pricing, and Who Should Buy (瘋先生)](https://mrmad.com.tw/apple-mac-studio-2026-specs-price) (in Chinese)
- [Qwen3.5-35B-A3B VRAM Requirements — Will It Run AI](https://willitrunai.com/blog/qwen-3-5-35b-a3b-vram-requirements)
- [MCP (Model Context Protocol): Standardized Tool-Calling Protocol for AI Agents (site)](/posts/ai/2026-03-22-mcp-model-context-protocol)
- [Agent Memory Systems: From RAG to Read-Write Memory (site)](/posts/ai/2026-03-19-agent-memory-systems)
