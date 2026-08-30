---
title: "Agent Platform 深度解析（四）— Provider Router & MCP：多 Provider 路由、Fallback 鏈與 OpenAI 相容 Proxy"
date: 2026-08-23
category: tech
tags: ["ai-agent", "provider-router", "mcp", "openai-proxy", "fallback", "model-mapping", "agent-platform"]
lang: zh-TW
description: "Agent Platform Provider Router 深度解析：統一 Provider Registry、10+ LLM + 12 Search + 2 Reader providers、Groundlane MCP 整合、Step-local tool selection、Fallback chain with health-aware routing、OpenAI 相容 Proxy API（/v1/chat/completions）、model alias mapping 與跨 provider 格式正規化。"
tldr: "Provider Router 是 Agent Platform 的「模型與工具網關」：統一 30+ providers、MCP tool discovery、step-local 權限控制、fallback chain with RRF fusion、OpenAI 相容 Proxy 讓現有 SDK 零改動接入。配置驅動而非硬編碼，provider 健康度感知路由。"
---
> 🌏 [English version](/posts/tech/2026-08-23-agent-platform-provider-router-en)

## TL;DR

Provider Router 解決**「用哪個模型、哪個搜尋、哪個 reader、怎麼 fallback、怎麼記帳」**：
- **統一 Registry**：10 LLM + 12 Search + 2 Reader + Knowledge/Action/Verifier，`provider-config.json` 配置驅動
- **MCP 整合**：Groundlane MCP server 提供 `web_search`/`web_fetch`/`web_extract`，12 search adapters + RRF fusion + 預算控制
- **Step-local Tool Selection**：Flow/Skill/Policy 三層過濾，只暴露當前步驟允許的工具子集
- **Fallback Chain**：`proxy-model-mapping.json` 定義 primary + fallback providers，health-aware routing 自動跳過不健康 provider
- **OpenAI 相容 Proxy**：`/v1/chat/completions` + `/v1/models`，現有 OpenAI SDK 零改動接入，跨 provider 格式正規化（Anthropic/Gemini/Workers AI...）
- **Invocation Logging**：每次呼叫記錄 input/output/token/cost/latency/retry/fallback reason，Observability 直接可視化

---

## 為什麼需要 Provider Router？

直接在代碼裡寫死 `openai.chat.completions.create()` 的時代已經過去了。生產環境面臨：

| 問題 | 傳統做法 | Provider Router 解法 |
|------|---------|---------------------|
| 模型供應商越來越多，代碼到處 `if/else` | 手寫 router、各自格式不統一 | 統一介面、配置驅動、新增 provider 只改 JSON |
| 某 provider 掛了、限流、延遲高 | try/catch 手寫 fallback | 健康度感知、自動 fallback、記錄 fallback reason |
| 成本失控、無法追蹤哪步用了哪模型 | 事後對帳、或根本不追蹤 | 每次 invocation 記錄 token/cost/latency，按 run/step/skill 聚合 |
| 想換模型、換搜尋引擎不想改 flow 代碼 | 重寫代碼、重新部署 | Flow 只宣告 `providerRole: "search"`，具體用哪家由 preset/policy 決定 |
| 既有代碼用 OpenAI SDK，想接入其他模型 | 改所有呼叫點 | OpenAI 相容 `/v1` endpoint，`base_url` 一改即用 |

---

## Provider Registry：配置驅動的 Provider 目錄

### provider-config.json：單一事實來源

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

**每個 provider 定義包含**：
| 欄位 | 說明 |
|------|------|
| `id` | 唯一標識，Flow/Policy/Skill 引用用 |
| `type` | `llm` / `search` / `reader` / `knowledge` / `action` / `verifier` |
| `enabled` | 全域啟用/停用（不刪除配置，保留審計） |
| `credentialRefs` | 需要的環境變數/Secret 名稱（用於 UI 提示） |
| `readinessKeys` | 檢查 ready 狀態用的 key（任一存在即 ready） |
| `models` | 該 provider 支援的模型 ID 列表 |
| `activeModel` | 預設使用的模型 |

**Provider 類型完整清單**：
| 類型 | Providers (已實作) |
|------|------------------|
| **LLM** | Workers AI、Groq、OpenAI、Anthropic、Gemini、OpenRouter、NVIDIA、Cerebras、Ollama Cloud、Ollama Local、OpenCode Zen |
| **Search** | Tavily、Exa、Parallel、Browserbase、Firecrawl、Linkup、Serper、You.com、Jina Search、Brave、SerpAPI、Bing、Search Router |
| **Reader** | Jina Reader、Mozilla Readability (local fallback) |
| **Knowledge** | Cloudflare Vectorize (native)、LlamaIndex (adapter) |
| **Vector Store** | Vectorize (Cloudflare-native) |

---

## Provider Readiness & Health：部署時與運行時

### 部署時：Readiness Check

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

- **本機開發**：無 API key 時，只有 `workers_ai`（模擬）ready，其他顯示「需配置 KEY」
- **Web UI → Manage → Providers**：顯示每個 provider 的 ready 狀態、延遲、成本、fallback 配置
- **Flow Validation**：發布 flow 時檢查所需 provider 是否 ready，未 ready 則阻擋發布

### 運行時：Health-Aware Routing

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

## MCP Integration：Groundlane 統一搜尋/讀取/抽取層

### 為什麼用 MCP？

MCP (Model Context Protocol) 提供**標準化的工具介面**：
- 模型不需要知道「怎麼呼叫 Tavily API」 vs 「怎麼呼叫 Exa API」
- 只需知道「有一個 `web_search` tool，參數是 `{query, maxResults, freshnessDays}`」
- Provider 端實作 MCP server，統一暴露 `tools/list`、`tools/call`

### Groundlane MCP Server

Agent Platform 採用 **Groundlane MCP Server**（獨立部署或本機嵌入）作為搜尋/讀取/抽取的統一入口：

| 能力 | MCP Tool | 說明 |
|------|----------|------|
| **Search** | `web_search` | 12 search adapters、RRF fusion、`balanced`/`deep`/`fallback` 策略、canonical URL 去重、per-host limit |
| **Fetch** | `web_fetch` | 讀取網頁內容、支援 JavaScript 渲染（Playwright）、Jina Reader fallback |
| **Extract** | `web_extract` | CSS selector 結構化擷取、非 LLM 推論、確定性輸出 |

**Groundlane 核心特性**：
- **Strategies**：`balanced`（2-provider RRF fusion）、`deep`（multi-provider fusion）、`fallback`（單一 provider）
- **Deduplication**：canonical URL、tracking parameter stripping、per-host limits
- **Budgets**：每 provider 月度嘗試預算、health-aware routing
- **Local fallback**：無 API key 時用 `fixtures/local-research-sources.json` 確定性離線模式

### Step-Local Tool Selection：權限最小化

```typescript
// 流程：FlowStep → Skill → Policy 三層過濾
const allowedTools = computeAllowedTools({
  flowAllowedTools: flowStep.allowedTools,        // Flow 定義允許
  skillPermissions: skill.metadata.permissions,   // Skill 宣告需要
  policyToolPermissions: policy.toolPermissions   // Policy 限制
});
```

**例子**：`citation-extractor` skill 宣告 `permissions: ["provider:llm", "reader:read"]`

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

**效果**：模型只能呼叫它「應該」能呼叫的工具，減少幻覺工具調用、防止權限越界。

---

## Fallback Chain：從配置到執行

### proxy-model-mapping.json：模型級 Fallback 定義

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

- `providers`：主要嘗試順序（按優先序）
- `fallback`：主要全部失敗後嘗試的備援順序
- **最大 3 次嘗試**（primary + fallback 最多 2 次）
- Provider 必須在 `provider-config.json` 註冊且 enabled

### 運行時 Fallback 邏輯

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

**記錄的 Fallback 細節**（供 Observability 分析）：
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

## OpenAI 相容 Proxy API：`/v1` 端點

### 設計目標

現有代碼使用 OpenAI SDK：
```python
from openai import OpenAI
client = OpenAI(api_key="sk-...")
client.chat.completions.create(model="gpt-4o", messages=[...])
```

**零改動遷移**：
```python
from openai import OpenAI
client = OpenAI(
    base_url="https://your-worker.workers.dev/v1",  # 只改 base_url
    api_key="ak_live_..."  # Platform API key (需 proxy:write scope)
)
client.chat.completions.create(model="gpt-4o", messages=[...])
```

### 端點規格

| Method | Path | 說明 |
|--------|------|------|
| `GET` | `/v1/models` | 列出所有可用模型（聚合所有 provider） |
| `POST` | `/v1/chat/completions` | Chat completion（streaming + non-streaming） |

### 模型 ID 格式

```
短名稱（自動路由到最佳 provider）：
  gpt-4o, claude-3.5-sonnet, gemini-3.5-flash, llama-3.3-70b-versatile

提供者前綴（強制指定）：
  openai/gpt-4o, anthropic/claude-3.5-sonnet, gemini/gemini-3.5-flash
  groq/llama-3.3-70b-versatile, openrouter/nemotron-3-ultra
```

### 跨 Provider 格式正規化

每個 provider API 格式不同，Proxy 統一轉換：

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

**關鍵轉換**：
| Provider | 輸入格式 | 輸出格式 | 正規化重點 |
|----------|---------|---------|-----------|
| OpenAI/Groq/OpenRouter/NVIDIA/Ollama Cloud/OpenCode Zen | OpenAI native | OpenAI native | 直通 |
| Anthropic | `system` 分離、`user/assistant` roles | `content: [{type:"text",text:...}]` array | System message 提取、role 映射 |
| Gemini | `contents: [{role, parts:[{text}]}]` | `candidates: [{content:{parts:[{text}]}}]` | Contents 格式、generationConfig |
| Workers AI | 簡化 `{model, messages, ...}` | 簡化 | 最小化欄位 |

### Streaming 正規化

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

### 功能完整性

| 功能 | 支援狀態 | 備註 |
|------|---------|------|
| Non-streaming chat completion | ✅ | 完整支援 |
| Streaming (SSE) | ✅ | 逐 token 回傳 |
| Tool calling / Function calling | 🚧 | 進行中 |
| Vision (image input) | 🚧 | 依 provider 支援 |
| Response format (JSON schema) | 🚧 | 依 provider 支援 |
| Model listing | ✅ | 聚合所有 provider |
| Usage tracking | ✅ | token/cost 歸屬到 API key |

---

## Invocation Logging：可觀測性的數據源

每次 provider/tool 呼叫都記錄：

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

**Web UI Observability 頁面直接查詢這些記錄**：
- Run 總成本、按 step/provider/skill/tool 細分
- Latency 分佈（p50/p95/p99）
- Fallback 率、錯誤率、retry 率
- Token 使用趨勢

---

## 免費模型整合：`free-llm-models` 驗證清單

Agent Platform 整合 [free-llm-models](https://github.com/vincentxuu/free-llm-models) 驗證過的免費模型：

| 模型 | 可用 Provider | 適用場景 |
|------|--------------|----------|
| `nemotron-3-ultra` | OpenRouter/NVIDIA/Groq/Ollama Cloud | 高品質推理、長上下文 |
| `gpt-oss-120b` / `gpt-oss-20b` | OpenRouter/NVIDIA/Groq/Ollama Cloud | 開源大模型 |
| `glm-5.2` | OpenRouter | 中文強、推理佳 |
| `hy3` | OpenCode Zen | 免費、中文優化 |
| `deepseek-v4-flash` | OpenCode Zen | 速度快、成本極低 |

**配置方式**：在 `proxy-model-mapping.json` 的 fallback chain 中優先放入免費 provider（如 `openrouter:free`、`opencode-zen`），Policy 設定 `max_cost_usd: 0` 即可強制走免費模型。

---

## 常見陷阱與最佳實踐

| 陷阱 | 正確做法 |
|------|----------|
| 在 Flow 步驟硬編碼 `model: "gpt-4o"` | 步驟只宣告 `providerRole: "planner"`，具體模型由 preset/policy/proxy-mapping 決定 |
| 不配置 fallback，單一 provider 掛了整個 flow 卡住 | **務必配置 fallback chain**，並啟用 health-aware routing |
| 以為 Proxy API 只是轉發，不需要正規化 | **跨 provider 格式差異大**，必須正規化 request/response/streaming |
| 忽略 `readinessKeys` 檢查，部署後發現 provider 不可用 | CI/CD 階段跑 `createProviderReadinessCheck`，未 ready 剋阻擋部署 |
| 所有步驟都暴露所有 tools | **Step-local tool selection**：Flow/Skill/Policy 三層過濾，最小權限原則 |

---

## 總結：Provider Router 的核心契約

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

**三大不變量**：
1. **配置驅動** —— 新增 provider 只改 JSON，不改代碼
2. **健康度感知** —— 自動跳過不健康 provider，記錄 fallback reason
3. **統一介面** —— Flow/Skill 只知 `providerRole`，不知具體 vendor；Proxy 統一 OpenAI 格式

---

## 參考資料

- [Agent Platform: Provider Tool Routing Spec](https://github.com/vincentxuu/agent-platform/blob/main/openspec/specs/provider-tool-routing/spec.md)
- [Provider Catalog Implementation](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/provider-catalog.ts)
- [Provider Config](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/provider-config.json)
- [Proxy Model Mapping](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/proxy-model-mapping.json)
- [Proxy Normalization](https://github.com/vincentxuu/agent-platform/blob/main/packages/runtime/src/proxy-normalization.ts)
- [Agent Gateway Plan - MCP / Provider Router](https://github.com/vincentxuu/agent-platform/blob/main/agent-gateway-plan.md#412-mcp--provider-router--a2a-adapter)
- [Groundlane MCP Server](https://github.com/vincentxuu/groundlane) — 統一搜尋/讀取/抽取
- [free-llm-models](https://github.com/vincentxuu/free-llm-models) — 免費模型驗證清單
