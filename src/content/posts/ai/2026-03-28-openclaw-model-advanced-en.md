---
title: "OpenClaw Model Advanced: Failover, Prompt Caching, and Token Billing"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, model-failover, prompt-caching, token-usage, cost-optimization]
lang: en
tldr: "OpenClaw has built-in two-stage fault tolerance with Auth rotation + Model Fallback, plus Prompt Caching for cost savings and comprehensive Token tracking."
description: "OpenClaw's model failover mechanism, Prompt Caching strategies, Token consumption tracking, and cost optimization."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-model-advanced)

Once you have chosen your provider and model, the next step is making it stable and cost-effective. This post covers three advanced model features in OpenClaw: failover switching, Prompt Caching, and Token tracking with cost control.

## Model Failover

OpenClaw's failover works in two stages:

```
Stage 1: Round-robin Auth Profile rotation within the same provider
         ↓ All in cooldown
Stage 2: Switch to fallback model
```

### Auth Profile Rotation

You can configure multiple API Keys for the same provider. Auth profiles are stored in `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`.

Selection priority:
1. Explicit order specified in `auth.order[provider]`
2. Profiles from the config file (filtered by provider)
3. Stored profiles from auth-profiles.json

Default sorting: OAuth takes priority over API Key; within the same type, "oldest first" (based on usage statistics).

### Session Stickiness

Once a profile is selected, it remains unchanged for the entire session — this is to maintain cache efficiency on the provider side. Switching only occurs on session reset, compaction completion, or when the profile enters cooldown.

### Cooldown Escalation

| Error Type | Cooldown Duration |
|---|---|
| General failure | 1 min → 5 min → 25 min → 1 hr (cap) |
| Billing/quota failure | 5 hr → 10 hr → 20 hr → 24 hr (cap) |

Billing errors carry heavier penalties because retrying in the short term won't help.

### Model Fallback

After all profiles are exhausted, it switches to the next model in `agents.defaults.model.fallbacks`:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["openai/gpt-5.4", "google/gemini-3.1-pro-preview"]
      }
    }
  }
}
```

### Thinking Degradation

When an extended thinking call fails, it automatically degrades to normal mode without interrupting the conversation. This is a provider-level fallback, independent of model fallback.

## Prompt Caching

Model providers can reuse the unchanged prompt prefix in a conversation, saving both tokens and latency. The first request pays the `cacheWrite` cost, and subsequent matching requests benefit from a `cacheRead` discount.

### Configuration

```json5
{
  agents: {
    defaults: {
      models: {
        "anthropic/claude-opus-4-6": {
          params: {
            cacheRetention: "short"  // none | short (5 min) | long (1 hr)
          }
        }
      }
    }
  }
}
```

Anthropic API Keys default to `short`. The legacy setting `cacheControlTtl: "5m"` automatically maps to `short`.

### Provider Support

| Provider | Support | Notes |
|---|---|---|
| Anthropic (direct API) | ✅ Full | Unconfigured Anthropic models default to `short` |
| Amazon Bedrock | ✅ | Only for Anthropic Claude models; others forced to `none` |
| OpenRouter (Anthropic) | ✅ | Automatically injects cache control for system/developer blocks |
| Other providers | ❌ | Settings have no effect |

### Context Pruning + Cache TTL

Prevents large context re-caching after idle periods:

```json5
{
  contextPruning: {
    mode: "cache-ttl",
    ttl: "1h"
  }
}
```

### Heartbeat Keep-Alive

Periodic heartbeat messages keep the cache window active, avoiding full re-cache after idle periods:

```json5
{
  heartbeat: {
    every: "55m"  // Set within the cache TTL, e.g., 55min heartbeat for 1hr TTL
  }
}
```

### Recommended Combinations

**Mixed traffic:** Use `long` + heartbeat for primary agents; use `none` for notification-type agents.

**Cost-oriented:** Use `short` as baseline, enable cache-TTL pruning, and add heartbeat only where needed.

### Diagnostics

```bash
# Enable cache trace
OPENCLAW_CACHE_TRACE=1 openclaw gateway
```

This logs cache hits, writes, and token savings in JSONL format.

## Token Consumption Tracking

### What Consumes Tokens

Everything sent to the model counts toward context:

- System prompt (dynamically assembled: tool descriptions, skills, bootstrap files, safety guidelines...)
- Conversation history
- Tool calls and results
- Attachments (images, audio, files)
- Compaction summaries
- Provider wrappers and safety headers

Bootstrap files (AGENTS.md, SOUL.md, etc.) have a per-file limit of 20,000 characters and a total limit of 150,000 characters.

Images are resized before API calls; `imageMaxDimensionPx` defaults to 1200.

### Monitoring Methods

**In chat:**
- `/status` — Session model, context usage, token count, estimated cost (API key only)
- `/usage full` — Cost footer appended to each reply
- `/usage tokens` — Shows only token count (no amounts for OAuth)
- `/usage cost` — Aggregated cost from session log

**CLI:**
- `openclaw status --usage` — Usage breakdown per provider

### Cost Calculation

Based on model pricing configuration (USD/1M tokens), with four rate types: input, output, cache read, and cache write. OAuth authentication does not display amounts.

## 10 Features That Incur API Costs

It's not just chatting that costs money:

| # | Feature | Description |
|---|---|---|
| 1 | Core model responses | Primary cost source |
| 2 | Media understanding | Audio/image/video processing |
| 3 | Memory embeddings | Semantic search (OpenAI/Gemini/Voyage/Mistral/Ollama) |
| 4 | Web search | Brave/Gemini/Grok/Kimi/Perplexity |
| 5 | Web fetch | Firecrawl (optional) |
| 6 | Provider status queries | `/status` querying usage endpoints |
| 7 | Compaction | Automatic session summarization |
| 8 | Model scanning | OpenRouter capability probing |
| 9 | Speech/Talk | ElevenLabs TTS |
| 10 | Skills | Third-party APIs from custom integrations |

## Usage Tracking

OpenClaw directly queries provider usage endpoints, displaying **actual consumption** rather than estimates.

Supported providers: Anthropic, GitHub Copilot, Gemini CLI, OpenAI Codex, MiniMax, z.ai, and others. Corresponding OAuth or API Key is required for display.

## Ways to Save Tokens

- `/compact` — Compress history from long conversations
- Reduce tool output size
- Lower `imageMaxDimensionPx` (for screenshot-heavy scenarios)
- Streamline skill descriptions
- Use smaller models for exploratory tasks

## Overall

Three levels of model management:

1. **Stability**: Auth rotation + Model Fallback + Thinking degradation → Ensure no interruptions
2. **Cost savings**: Prompt Caching + Context Pruning + Heartbeat → Reduce duplicate tokens
3. **Visibility**: Usage Tracking + `/status` + Cache Trace → Know where the money goes

Set up fallbacks and caching properly, and OpenClaw will handle most situations on its own.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/concepts/model-failover.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-failover.md) — Model failover mechanism
- [docs/reference/prompt-caching.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/prompt-caching.md) — Prompt Caching reference
- [docs/reference/token-use.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/token-use.md) — Token consumption and costs
- [docs/reference/api-usage-costs.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/api-usage-costs.md) — API cost sources
- [docs/concepts/usage-tracking.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/usage-tracking.md) — Usage Tracking
- [docs/concepts/compaction.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/compaction.md) — Compaction
- [docs/reference/memory-config.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/memory-config.md) — Memory configuration
