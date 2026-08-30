---
title: "Agent Platform Deep Dive (Part 4) — Provider Router & MCP: Multi-Provider Routing, Fallback Chains, and an OpenAI-Compatible Proxy"
date: 2026-08-23
category: tech
tags: ["ai-agent", "provider-router", "mcp", "openai-proxy", "fallback", "model-mapping", "agent-platform"]
lang: en
description: "A deep dive into the Agent Platform Provider Router: a unified Provider Registry, 10+ LLM and 12 Search providers plus 2 Reader providers, Groundlane MCP integration, step-local tool selection, fallback chains with health-aware routing, an OpenAI-compatible Proxy API (/v1/chat/completions), model alias mapping, and cross-provider format normalization."
tldr: "The Provider Router is Agent Platform's model and tool gateway: it unifies 30+ providers, MCP tool discovery, step-local permission control, fallback chains with RRF fusion, and an OpenAI-compatible Proxy that existing SDKs can use without code changes. It is configuration-driven rather than hard-coded, with provider-health-aware routing."
---
> 🌏 [中文版](/posts/tech/2026-08-23-agent-platform-provider-router)

## TL;DR

The Provider Router answers **which model to use, which search provider to call, which reader to use, how to fall back, and how to account for every call**:

- **Unified Registry**: 10 LLM + 12 Search + 2 Reader providers, plus Knowledge/Action/Verifier, driven by `provider-config.json`
- **MCP integration**: the Groundlane MCP server provides `web_search`/`web_fetch`/`web_extract`, 12 search adapters, RRF fusion, and budget controls
- **Step-local tool selection**: three layers of filtering—Flow, Skill, and Policy—expose only the subset of tools allowed for the current step
- **Fallback chain**: `proxy-model-mapping.json` defines primary and fallback providers, while health-aware routing automatically skips unhealthy providers
- **OpenAI-compatible Proxy**: `/v1/chat/completions` + `/v1/models`, letting existing OpenAI SDK clients connect without code changes while normalizing formats across providers such as Anthropic, Gemini, and Workers AI
- **Invocation logging**: every call records input/output, tokens, cost, latency, retries, and the fallback reason for direct visualization in Observability

---

## Why Do You Need a Provider Router?

The days of hard-coding `openai.chat.completions.create()` throughout the codebase are over. Production systems face a different set of problems:

| Problem | Traditional approach | Provider Router approach |
|------|---------|---------------------|
| The number of model vendors keeps growing, leaving `if/else` branches everywhere | Write a router by hand, with inconsistent formats for each provider | Use one interface and configuration-driven routing; adding a provider only requires a JSON change |
| A provider goes down, rate-limits requests, or becomes slow | Hand-write fallback logic with try/catch | Use health awareness, automatic fallback, and recorded fallback reasons |
| Costs run out of control, with no way to tell which step used which model | Reconcile bills afterward, or do not track usage at all | Record tokens, cost, and latency for every invocation, aggregated by run, step, and skill |
| You want to change a model or search engine without changing flow code | Rewrite code and redeploy | Let the Flow declare only `providerRole: "search"`; the preset or policy chooses the concrete provider |
| Existing code uses the OpenAI SDK, but you want to connect other models | Change every call site | Point `base_url` at the OpenAI-compatible `/v1` endpoint |

---

## Provider Registry: A Configuration-Driven Provider Catalog

### provider-config.json: The Single Source of Truth

```json
// packages/runtime/src/provider-config.json
{
  "defaultAllowedProviderIds": [
    "workers_ai", "groq", "openai", "anthropic", "gemini", 
    "openrouter", "opencode-zen", "tavily", "exa", "parallel", ...
  ],
  "providers": [
    {
      "id": "anthropic",
      "name": "Anthropic",
      "type": "llm",
      "enabled": false,
      "credentialRefs": ["ANTHROPIC_API_KEY"],
      "readinessKeys": ["ANTHROPIC_API_KEY"],
      "models": ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest"],
      "activeModel": "claude-3-5-sonnet-latest"
    },
    {
      "id": "tavily",
      "name": "Tavily Search",
      "type": "search",
      "enabled": false,
      "credentialRefs": ["TAVILY_API_KEY"],
      "readinessKeys": ["TAVILY_API_KEY"],
      "models": ["tavily-search", "tavily-extract"],
      "activeModel": "tavily-search"
    },
    ...
  ]
}
```

**Each provider definition includes**:

| Field | Description |
|------|------|
| `id` | Unique identifier referenced by Flow, Policy, and Skill |
| `type` | `llm` / `search` / `reader` / `knowledge` / `action` / `verifier` |
| `enabled` | Global enable/disable switch; disabling preserves the configuration for auditability |
| `credentialRefs` | Names of required environment variables or Secrets, used for UI guidance |
| `readinessKeys` | Keys used to determine readiness; the provider is ready if any one is present |
| `models` | List of model IDs supported by the provider |
| `activeModel` | Default model |

**Complete list of provider types**:

| Type | Providers (implemented) |
|------|------------------|
| **LLM** | Workers AI, Groq, OpenAI, Anthropic, Gemini, OpenRouter, NVIDIA, Cerebras, Ollama Cloud, Ollama Local, OpenCode Zen |
| **Search** | Tavily, Exa, Parallel, Browserbase, Firecrawl, Linkup, Serper, You.com, Jina Search, Brave, SerpAPI, Bing, Search Router |
| **Reader** | Jina Reader, Mozilla Readability (local fallback) |
| **Knowledge** | Cloudflare Vectorize (native), LlamaIndex (adapter) |
| **Vector Store** | Vectorize (Cloudflare-native) |

---

## Provider Readiness & Health: Deployment Time and Runtime

### Deployment Time: Readiness Check

```typescript
// packages/runtime/src/provider-catalog.ts
export function createProviderReadiness(env = {}, options = {}) {
  return Object.fromEntries(PROVIDER_MODEL_CATALOG.map((provider) => {
    // Workers AI 特殊：本機模擬可用
    if (provider.id === "workers_ai" && options.localWorkersAiReady) {
      return [provider.id, true];
    }
    // 其他：檢查環境變數是否有任一 readinessKeys
    return [provider.id, provider.readinessKeys.some((key) => Boolean(env[key]))];
  }));
}
```

- **Local development**: without an API key, only `workers_ai` (simulated) is ready; the others show that a key must be configured
- **Web UI → Manage → Providers**: displays each provider's readiness, latency, cost, and fallback configuration
- **Flow validation**: when a flow is published, the platform checks whether its required providers are ready and blocks publication if they are not

### Runtime: Health-Aware Routing

```
Step 需要 search provider
    ↓
Router 取得所有 type=search 且 enabled 的 providers
    ↓
過濾：policy.allowedProviders ∩ flow.allowedProviders ∩ skill.permissions
    ↓
排序：primary → fallback chain（來自 proxy-model-mapping.json）
    ↓
健康度檢查：跳過近期失敗率高、延異常、quota 用盡的 provider
    ↓
選中第一個 healthy provider
    ↓
執行 → 記錄 latency/success/cost → 更新健康度統計
```

---

## MCP Integration: Groundlane as the Unified Search, Reading, and Extraction Layer

### Why MCP?

MCP (Model Context Protocol) provides a **standardized tool interface**:

- The model does not need to know how to call the Tavily API versus the Exa API
- It only needs to know that a `web_search` tool accepts `{query, maxResults, freshnessDays}`
- The provider implements an MCP server that exposes `tools/list` and `tools/call` through one interface

### Groundlane MCP Server

Agent Platform uses the **Groundlane MCP Server**—either deployed independently or embedded locally—as its unified entry point for search, reading, and extraction:

| Capability | MCP Tool | Description |
|------|----------|------|
| **Search** | `web_search` | 12 search adapters, RRF fusion, `balanced`/`deep`/`fallback` strategies, canonical URL deduplication, and a per-host limit |
| **Fetch** | `web_fetch` | Reads web content, supports JavaScript rendering (Playwright), and falls back to Jina Reader |
| **Extract** | `web_extract` | Structured extraction with CSS selectors, no LLM inference, and deterministic output |

**Core Groundlane features**:

- **Strategies**: `balanced` (two-provider RRF fusion), `deep` (multi-provider fusion), and `fallback` (single provider)
- **Deduplication**: canonical URLs, tracking-parameter stripping, and per-host limits
- **Budgets**: a monthly attempt budget for each provider, plus health-aware routing
- **Local fallback**: deterministic offline mode using `fixtures/local-research-sources.json` when no API key is available

### Step-Local Tool Selection: Least Privilege

```typescript
// 流程：FlowStep → Skill → Policy 三層過濾
const allowedTools = computeAllowedTools({
  flowAllowedTools: flowStep.allowedTools,        // Flow 定義允許
  skillPermissions: skill.metadata.permissions,   // Skill 宣告需要
  policyToolPermissions: policy.toolPermissions   // Policy 限制
});
```

**Example**: the `citation-extractor` skill declares `permissions: ["provider:llm", "reader:read"]`

```
FlowStep: extract_evidence (type: agent, uses: citation-extractor@1.0.0)
    ↓
Skill permissions: provider:llm, reader:read
    ↓
Policy: 允許所有 reader tools，拒絕 action tools
    ↓
Runtime 暴露給模型的 tools：
  - web_fetch (reader)
  - web_extract (reader)  
  - LLM completion (provider:llm)
  
不暴露：
  - web_search (search - skill 沒宣告)
  - github_create_issue (action - policy 拒絕)
  - browser_screenshot (browser - skill 沒宣告)
```

**Result**: the model can only call the tools it is supposed to use, reducing hallucinated tool calls and preventing privilege escalation.

---

## Fallback Chain: From Configuration to Execution

### proxy-model-mapping.json: Model-Level Fallback Definitions

```json
// packages/runtime/src/proxy-model-mapping.json
{
  "version": 1,
  "models": {
    "gpt-4o": {
      "providers": ["openai"],
      "fallback": ["openrouter", "azure-openai"]
    },
    "claude-3.5-sonnet": {
      "providers": ["anthropic"],
      "fallback": ["openrouter"]
    },
    "llama-3.3-70b-versatile": {
      "providers": ["groq", "cerebras", "nvidia"],
      "fallback": ["openrouter", "ollama-cloud"]
    },
    "nemotron-3-ultra": {
      "providers": ["openrouter", "opencode-zen", "nvidia"],
      "fallback": ["openrouter:free", "groq"]
    }
  }
}
```

- `providers`: the primary attempt order, in priority order
- `fallback`: the backup order after every primary provider fails
- **At most three attempts**: the primary attempt plus up to two fallback attempts
- A provider must be registered and enabled in `provider-config.json`

### Runtime Fallback Logic

```typescript
// 簡化版邏輯
async function executeWithFallback(modelId, request) {
  const mapped = getMappedProviders(modelId);  // 從 mapping 取得 primary + fallback
  
  for (const { providerId, isFallback, fallbackIndex } of mapped) {
    const provider = getProviderCatalogEntry(providerId);
    if (!provider || !provider.enabled) continue;
    if (!isProviderHealthy(providerId)) continue;  // health-aware: 跳過不健康
    
    try {
      const response = await callProvider(providerId, request);
      recordInvocation({ providerId, isFallback, fallbackIndex, success: true });
      return response;
    } catch (error) {
      recordInvocation({ providerId, isFallback, fallbackIndex, success: false, error });
      // 繼續下一個 fallback
    }
  }
  
  throw new Error("All providers failed");
}
```

**Recorded fallback details** for Observability analysis:

```json
{
  "providerId": "anthropic",
  "isFallback": true,
  "fallbackIndex": 0,
  "failedProvider": "openai",
  "failureReason": "rate_limit_exceeded",
  "outcome": "succeeded"
}
```

---

## OpenAI-Compatible Proxy API: The `/v1` Endpoints

### Design Goal

Existing code uses the OpenAI SDK:

```python
from openai import OpenAI
client = OpenAI(api_key="sk-...")
client.chat.completions.create(model="gpt-4o", messages=[...])
```

**Migration without code changes**:

```python
from openai import OpenAI
client = OpenAI(
    base_url="https://your-worker.workers.dev/v1",  # 只改 base_url
    api_key="ak_live_..."  # Platform API key (需 proxy:write scope)
)
client.chat.completions.create(model="gpt-4o", messages=[...])
```

### Endpoint Specification

| Method | Path | Description |
|--------|------|------|
| `GET` | `/v1/models` | Lists all available models, aggregated across every provider |
| `POST` | `/v1/chat/completions` | Chat completion, both streaming and non-streaming |

### Model ID Formats

```
短名稱（自動路由到最佳 provider）：
  gpt-4o, claude-3.5-sonnet, gemini-3.5-flash, llama-3.3-70b-versatile

提供者前綴（強制指定）：
  openai/gpt-4o, anthropic/claude-3.5-sonnet, gemini/gemini-3.5-flash
  groq/llama-3.3-70b-versatile, openrouter/nemotron-3-ultra
```

### Cross-Provider Format Normalization

Each provider uses a different API format. The Proxy converts them into one interface:

```typescript
// packages/runtime/src/proxy-normalization.ts
export function normalizeChatCompletionRequest(
  openaiRequest: ChatCompletionRequest,
  targetProvider: SupportedProvider
): ProviderRequestFormat {
  // 1. 統一基礎格式
  const baseRequest = { model, messages, temperature, max_tokens, ... };
  
  // 2. 依目標 provider 轉換
  switch (targetProvider) {
    case "anthropic":
      return convertToAnthropicFormat(baseRequest);  // system 分離、messages 角色轉換
    case "gemini":
      return convertToGeminiFormat(baseRequest);     // contents 格式、generationConfig
    case "workers-ai":
      return convertToWorkersAIFormat(baseRequest);  // 簡化格式
    default:  // openai, groq, openrouter, nvidia, ollama-cloud, opencode-zen
      return baseRequest;  // 原生 OpenAI 格式
  }
}
```

**Key conversions**:

| Provider | Input format | Output format | Normalization details |
|----------|---------|---------|-----------|
| OpenAI/Groq/OpenRouter/NVIDIA/Ollama Cloud/OpenCode Zen | OpenAI native | OpenAI native | Pass-through |
| Anthropic | Separate `system`, `user/assistant` roles | `content: [{type:"text",text:...}]` array | Extract system message and map roles |
| Gemini | `contents: [{role, parts:[{text}]}]` | `candidates: [{content:{parts:[{text}]}}]` | Convert contents format and generationConfig |
| Workers AI | Simplified `{model, messages, ...}` | Simplified | Minimize fields |

### Streaming Normalization

```typescript
export function normalizeStreamChunk(
  providerChunk: ProviderResponseFormat,
  openaiModelId: string,
  providerId: SupportedProvider
): ChatCompletionChunk {
  if (providerId === "gemini" && providerChunk.candidates) {
    // Gemini streaming: candidates[0].content.parts[0].text
    deltaContent = candidate.content.parts[0].text;
    finishReason = mapGeminiFinishReason(candidate.finishReason);
  } else {
    // OpenAI/Anthropic/others: choices[0].delta.content
    deltaContent = choice.delta.content;
    finishReason = mapFinishReason(choice.finish_reason, providerId);
  }
  return OpenAI_chunk_format;
}
```

### Feature Coverage

| Feature | Status | Notes |
|------|---------|------|
| Non-streaming chat completion | ✅ | Fully supported |
| Streaming (SSE) | ✅ | Returns tokens incrementally |
| Tool calling / Function calling | 🚧 | In progress |
| Vision (image input) | 🚧 | Depends on provider support |
| Response format (JSON schema) | 🚧 | Depends on provider support |
| Model listing | ✅ | Aggregates every provider |
| Usage tracking | ✅ | Attributes tokens and cost to the API key |

---

## Invocation Logging: The Data Source for Observability

Every provider or tool call is recorded:

```typescript
interface ProviderInvocation {
  id: string;
  runId: string;
  stepRunId: string;
  skillVersionId?: string;
  providerId: string;
  providerRole: "llm" | "search" | "reader" | ...;
  modelId: string;
  isFallback: boolean;
  fallbackIndex: number;
  request: { messages, parameters... };  // 脫敏後
  response: { content, usage, finish_reason... };
  status: "success" | "error" | "timeout";
  durationMs: number;
  costUsd: number;
  tokenUsage: { input: number; output: number; total: number };
  retries: number;
  error?: ErrorInfo;
  createdAt: string;
}
```

**The Web UI Observability page queries these records directly**:

- Total run cost, broken down by step, provider, skill, and tool
- Latency distribution (p50/p95/p99)
- Fallback, error, and retry rates
- Token usage trends

---

## Free Model Integration: The `free-llm-models` Validation List

Agent Platform integrates free models validated by [free-llm-models](https://github.com/vincentxuu/free-llm-models):

| Model | Available providers | Suitable use cases |
|------|--------------|----------|
| `nemotron-3-ultra` | OpenRouter/NVIDIA/Groq/Ollama Cloud | High-quality reasoning and long contexts |
| `gpt-oss-120b` / `gpt-oss-20b` | OpenRouter/NVIDIA/Groq/Ollama Cloud | Open-source large language models |
| `glm-5.2` | OpenRouter | Strong Chinese support and good reasoning |
| `hy3` | OpenCode Zen | Free and optimized for Chinese |
| `deepseek-v4-flash` | OpenCode Zen | Fast and extremely low-cost |

**Configuration**: prioritize free providers such as `openrouter:free` and `opencode-zen` in the fallback chain in `proxy-model-mapping.json`. Setting `max_cost_usd: 0` in Policy forces the router to use free models.

---

## Common Pitfalls and Best Practices

| Pitfall | Recommended approach |
|------|----------|
| Hard-code `model: "gpt-4o"` in a Flow step | Have the step declare only `providerRole: "planner"`; let the preset, policy, or proxy mapping choose the concrete model |
| Omit fallback configuration, causing the entire flow to stall when one provider goes down | **Always configure a fallback chain** and enable health-aware routing |
| Assume the Proxy API only forwards requests and does not need normalization | **Provider formats differ substantially**, so requests, responses, and streaming all need normalization |
| Ignore `readinessKeys`, then discover after deployment that a provider is unavailable | Run `createProviderReadinessCheck` during CI/CD and block deployment when a provider is not ready |
| Expose every tool to every step | Use **step-local tool selection** with three-layer Flow/Skill/Policy filtering and the principle of least privilege |

---

## Summary: The Provider Router's Core Contract

```
Provider Config (provider-config.json)
    → ProviderCatalog (registry, readiness, model listing)
    
Proxy Model Mapping (proxy-model-mapping.json)
    → getMappedProviders(modelId) → [primary..., fallback...]
    
MCP Server (Groundlane)
    → tools: web_search, web_fetch, web_extract
    → 12 search adapters, RRF fusion, budgets
    
Step Execution
    → computeAllowedTools(flow, skill, policy) → tool subset
    → selectProvider(role, preset, policy, health) → providerId
    → callProvider(providerId, request) → response
    → recordInvocation(...) → Observability
    
OpenAI Proxy (/v1)
    → normalizeRequest(openaiFormat, targetProvider) → providerFormat
    → executeWithFallback(modelId, request) → providerResponse
    → normalizeResponse(providerResponse, openaiModelId) → openaiFormat
```

**Three invariants**:

1. **Configuration-driven** — adding a provider changes JSON, not code
2. **Health-aware** — the router automatically skips unhealthy providers and records the fallback reason
3. **Unified interface** — Flow and Skill know only the `providerRole`, not the concrete vendor; the Proxy presents one OpenAI format

---

## References

- [Agent Platform: Provider Tool Routing Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/provider-tool-routing/spec.md)
- [Provider Catalog Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/provider-catalog.ts)
- [Provider Config](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/provider-config.json)
- [Proxy Model Mapping](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/proxy-model-mapping.json)
- [Proxy Normalization](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/proxy-normalization.ts)
- [Agent Gateway Plan - MCP / Provider Router](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#412-mcp--provider-router--a2a-adapter)
- [Groundlane MCP Server](https://github.com/vincentxuu/groundlane) — unified search, reading, and extraction
- [free-llm-models](https://github.com/vincentxuu/free-llm-models) — validated list of free models
