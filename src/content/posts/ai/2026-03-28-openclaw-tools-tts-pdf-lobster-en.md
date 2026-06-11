---
title: "OpenClaw Tools (Part 4): TTS, PDF, Lobster, and MCP"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, tts, pdf, lobster, mcp, media, elevenlabs, openai-tts]
lang: en
tldr: "TTS supports three providers — ElevenLabs, Microsoft, and OpenAI. PDF has native and extraction modes. Lobster is a deterministic workflow runtime. MCP enables external tool integration."
description: "OpenClaw's TTS voice synthesis, PDF analysis, Lobster workflow engine, MCP Server integration, and media processing tools."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-tts-pdf-lobster)

This post covers OpenClaw's auxiliary tools: voice synthesis, document analysis, deterministic workflows, and external tool integration.

## Text-to-Speech (TTS)

Converts agent responses into speech. Disabled by default.

### Three Providers

| Provider | Requires API Key | Description |
|---|---|---|
| ElevenLabs | ✅ (`ELEVENLABS_API_KEY`) | High-quality voices |
| OpenAI | ✅ (`OPENAI_API_KEY`) | OpenAI TTS API |
| Microsoft | ❌ | Uses Edge's neural TTS, free |

### Auto-TTS Modes

| Mode | Behavior |
|---|---|
| `off` (default) | Disabled |
| `always` | Convert all responses to speech |
| `inbound` | Convert only after receiving a voice message |
| `tagged` | Convert only when the response contains a `[[tts]]` tag |

### Configuration

```json5
{
  messages: {
    tts: {
      auto: "always",
      provider: "elevenlabs"
    }
  }
}
```

### Skip Conditions

- Response already contains media
- Text is fewer than 10 characters
- Text is too long (auto-summarization before conversion can be enabled)

### Slash Commands

```
/tts status               # Check status
/tts provider openai      # Switch provider
/tts limit 2000           # Set character limit
```

Settings are stored locally (per-session), not globally.

## PDF Tool

Analyzes PDF documents and returns text content.

### Two Modes

| Mode | Behavior | Supported By |
|---|---|---|
| Native | Sends raw PDF bytes directly to the provider API | Anthropic, Google |
| Extraction fallback | Extracts text first; renders page images when text is insufficient | Other providers |

### Input Methods

- Local file path (supports `~` expansion)
- File URL
- HTTP/HTTPS URL (remote URLs are blocked in sandbox mode)

### Parameters

| Parameter | Description |
|---|---|
| `pdf` | Single PDF |
| `pdfs` | Multiple PDFs (up to 10) |
| `prompt` | Analysis instruction (default: Analyze this PDF document) |

### Limitations

- Default file size limit: 10 MB
- Extraction fallback: max 20 pages
- Native mode does not support page filtering

## Lobster: Deterministic Workflow Runtime

Lobster lets OpenClaw execute multi-step tool sequences as deterministic operations.

### The Problem It Solves

LLM-driven workflows have a problem: the token cost and coordination overhead of multiple tool calls is high. Lobster merges multiple tool calls into a single structured operation.

### Three Core Advantages

| Advantage | Description |
|---|---|
| Merged execution | One Lobster call replaces multiple tool calls |
| Built-in approval | Pauses before side effects, waits for human authorization |
| Resumable state | Paused workflows return a token that allows resumption without re-execution |

### Design Philosophy

Lobster uses a DSL rather than arbitrary code — deterministic + auditable. Pipelines are data, making them easy to log, diff, replay, and review.

### Implementation Pattern

```bash
inbox list --json | inbox categorize --json | inbox apply --json
```

Chain small CLI commands with approval steps for control.

### Security Mechanisms

- Enforced timeouts
- Output size limits
- Fixed executable naming
- Sandbox-aware
- Does not directly handle secrets or network calls

## MCP Server Integration

OpenClaw supports MCP (Model Context Protocol) Servers to extend the agent's toolset.

### Configuration

```json5
{
  mcp: {
    servers: {
      "my-server": {
        command: "npx",
        args: ["-y", "@my-mcp/server"],
        env: { API_KEY: "..." }
      }
    }
  }
}
```

### Management Commands

```
/mcp list                  # List MCP servers
/mcp status                # Check status
```

MCP allows OpenClaw to connect to the external tool ecosystem — databases, APIs, custom services, and more.

## Media Processing

### Images

- `image` tool: Image analysis (requires `imageModel`)
- `image_generate` tool: Image generation/editing (requires `imageGenerationModel`)
- Supports OpenAI, Google, fal, and other providers

### Media Attachments

Inbound media is automatically copied to the sandbox workspace (`media/inbound/*`). Supported formats depend on the channel.

## Other Tools

| Tool | Description |
|---|---|
| `message` | Send a message to the current channel |
| `memory_search` | Semantic search over memory |
| `memory_get` | Read a specific memory file |
| `cron` | Scheduled tasks |
| `gateway` | Gateway management |
| `nodes` | Node device control |
| `canvas` | Canvas tool |

## Summary

OpenClaw's toolset covers everything from voice to documents, from deterministic workflows to external MCP extensions. TTS gives the agent a "voice," Lobster makes complex workflows predictable and auditable, and MCP opens up unlimited tool extensibility.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/tools/tts.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/tts.md) — TTS voice synthesis
- [docs/tools/pdf.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/pdf.md) — PDF tool
- [docs/tools/lobster.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/lobster.md) — Lobster workflow
- [docs/tools/mcp.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/mcp.md) — MCP Server integration
- [docs/tools/media.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/media.md) — Media processing
- [docs/tools/image.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/image.md) — Image tool
