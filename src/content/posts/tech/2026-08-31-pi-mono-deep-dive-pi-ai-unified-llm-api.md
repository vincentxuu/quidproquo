---
title: "pi-mono 深度導讀 3：pi-ai——統一 15+ 供應商的 LLM API，從 Lazy Loading 到 Model Catalog 自動生成"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, llm-api, provider-pattern, model-catalog, oauth]
lang: zh-TW
series:
  name: "pi-mono 深度導讀"
  order: 3
tldr: "pi-ai 是 pi-mono 的反腐層：上層只見 Message/Tool/Context/streamFunction，下層 15+ providers 各自實作細節。本文拆解：統一介面設計、Provider Factory Registry、Lazy Loading 實現 Tree-shaking、Model Catalog 自動生成流程、OAuth/API Key 統一管理、Credential Sync 機制、Thinking/Reasoning 參數標準化。"
description: "深入 pi-ai 套件：統一多供應商 LLM API 的架構設計。涵蓋核心型別、Provider Factory 模式、api/ 目錄下的具體實作、lazy.ts 動態載入、models.generated.ts 自動生成、auth/ 模組的 OAuth 與 Credential Store、streaming 事件標準化、thinking/reasoning 參數跨供應商映射。適合研究 LLM Gateway、多模型抽象層設計的工程師。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-pi-mono-deep-dive-pi-ai-unified-llm-api-en)

## TL;DR

- **核心抽象**：`Message`、`Tool`、`Context`、`StreamFunction`、`StreamEvent` — 所有 provider 共用
- **Provider Factory**：`providers/index.ts` 註冊 15+ factories，`getProviderFactory(name)` 取得
- **Lazy Loading**：`api/lazy.ts` 用動態 `import()`，未使用的 provider 代碼被 tree-shaking 移除
- **Model Catalog**：`npm run generate:models` 從各官方 API 抓取 → `models.generated.ts`（~50KB、不可手改）
- **Auth 統一**：`auth/credential-store.ts`（本地加密存儲）、`auth/context.ts`（請求級 credential 解析）、OAuth 流程內建
- **Streaming 統一**：5 種 `StreamEvent` 類型覆蓋所有 provider 差異
- **Thinking/Reasoning**：`reasoning: "low"|"medium"|"high"|"off"` 映射到各家參數

---

## 為什麼需要 pi-ai？反腐層的價值

上層（`pi-agent-core`、`pi-coding-agent`）**完全不需知道**：

- Anthropic 用 `messages` endpoint、OpenAI 用 `responses`/`chat/completions`
- Google 叫 `generateContent`、Bedrock 叫 `InvokeModelWithResponseStream`
- 每家 tool calling 格式不同、thinking 參數名不同、streaming 事件結構不同
- OAuth flow、API Key header、base URL 都不一樣

**pi-ai 做的事**：把這些差異封裝在 `streamFunction` 後面，上層只呼叫：

```typescript
// 上層完全相同的代碼，無論用哪個 provider
const events = await streamFunction(modelConfig, context, {
  apiKey: resolvedKey,
  signal: abortSignal,
  reasoning: "medium",
  toolExecution: "parallel",
});

for await (const event of events) {
  // 處理統一的 StreamEvent
}
```

---

## 核心型別：統一契約

### Message 類型（`packages/ai/src/types.ts`）

```typescript
// 統一的訊息格式（上層使用）
export interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string | ContentBlock[];
  // ... metadata
}

// Content Block：文字、思考、工具調用、工具結果、圖片
export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "thinking"; thinking: string; signature?: string }
  | { type: "toolCall"; id: string; name: string; arguments: Record<string, unknown> }
  | { type: "toolResult"; toolCallId: string; content: ContentBlock[]; isError?: boolean }
  | { type: "image"; source: ImageSource };
```

> **關鍵**：`toolCall` 內的 `arguments` 永遠是 `Record<string, unknown>`（已解析的 JSON），不是字串。provider 端負責序列化。

### Tool 定義（`packages/ai/src/types.ts`）

```typescript
export interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;  // 標準 JSON Schema
  // 可選：provider-specific 參數
  execute?: (id: string, args: unknown, signal, onUpdate) => Promise<ToolResult>;
}
```

### Context：給 LLM 的完整上下文

```typescript
export interface Context {
  systemPrompt: string;
  messages: Message[];
  tools: Tool[];
  // 可選：provider-specific 選項
  options?: Record<string, unknown>;
}
```

### StreamFunction：統一的流式介面

```typescript
// 所有 provider 實作此簽名
export type StreamFunction = (
  model: ModelConfig,
  context: Context,
  options: StreamOptions
) => AsyncIterable<StreamEvent>;
```

### StreamEvent：5 種統一事件

```typescript
export type StreamEvent =
  | { type: "start"; partial: AssistantMessage }           // 開始生成
  | { type: "text_delta"; partial: AssistantMessage }      // 文字增量
  | { type: "thinking_delta"; partial: AssistantMessage }  // 思考增量
  | { type: "toolcall_delta"; partial: AssistantMessage }  // 工具調用增量
  | { type: "done"; result: () => Promise<AssistantMessage> } // 完成
  | { type: "error"; error: Error };                       // 錯誤
```

> **設計哲學**：事件類型極少（5 種），但 `partial` 帶有完整的 `AssistantMessage` 狀態，上層只要渲染 `partial` 即可。不需要處理 provider-specific 的事件結構。

---

## Provider Factory Pattern：註冊與解析

### Factory 介面（`packages/ai/src/providers/index.ts`）

```typescript
export interface ProviderFactory {
  name: string;                                    // "anthropic"、"openai"、"google"...
  createStreamFunction: (config: ProviderConfig) => StreamFunction;
  getModelConfig: (modelId: string) => ModelConfig | undefined;
  validateConfig: (config: ProviderConfig) => ValidationResult;
  // 可選：OAuth 支援
  oauth?: {
    getAuthUrl: (config) => string;
    exchangeCode: (code, config) => Promise<Credential>;
    refreshToken: (refreshToken, config) => Promise<Credential>;
  };
}
```

### 註冊表（`packages/ai/src/providers/index.ts`）

```typescript
import { anthropicFactory } from "./anthropic/index.ts";
import { openaiFactory } from "./openai/index.ts";
import { googleFactory } from "./google/index.ts";
// ... 15+ imports

const factories = new Map<string, ProviderFactory>([
  ["anthropic", anthropicFactory],
  ["openai", openaiFactory],
  ["google", googleFactory],
  ["azure", azureFactory],
  ["bedrock", bedrockFactory],
  ["mistral", mistralFactory],
  ["groq", groqFactory],
  ["cerebras", cerebrasFactory],
  ["xai", xaiFactory],
  ["huggingface", hfFactory],
  ["kimi", kimiFactory],
  ["minimax", minimaxFactory],
  ["nvidia", nvidiaFactory],
  ["openrouter", openrouterFactory],
  ["ollama", ollamaFactory],
]);

export function getProviderFactory(name: string): ProviderFactory | undefined {
  return factories.get(name);
}

export function listProviderFactories(): ProviderFactory[] {
  return Array.from(factories.values());
}
```

### 使用方式

```typescript
// 上層解析 model string 如 "anthropic/claude-3-5-sonnet-20241022"
const [providerName, modelId] = modelString.split("/");
const factory = getProviderFactory(providerName);
if (!factory) throw new Error(`Unknown provider: ${providerName}`);

const streamFn = factory.createStreamFunction({ apiKey, baseUrl, ... });
```

---

## Lazy Loading：Tree-shaking 的關鍵

### 問題：15+ providers 全 import 會炸 bundle size

```typescript
// ❌ 錯誤：靜態 import 所有 provider
import { anthropicFactory } from "./providers/anthropic/index.ts";
import { openaiFactory } from "./providers/openai/index.ts";
// ... 15 行 import
```

### 解法：`api/lazy.ts` 動態載入

```typescript
// packages/ai/src/api/lazy.ts
function lazy<T>(factory: () => Promise<T>) {
  let cached: T | null = null;
  return async (): Promise<T> => {
    if (!cached) cached = await factory();
    return cached;
  };
}

// 每個 provider 的 stream function 獨立 lazy load
export const anthropicMessages = lazy(() => import("./anthropic-messages.ts").then(m => m.streamAnthropicMessages));
export const openaiResponses = lazy(() => import("./openai-responses.ts").then(m => m.streamOpenAIResponses));
export const openaiCompletions = lazy(() => import("./openai-completions.ts").then(m => m.streamOpenAICompletions));
export const googleGenerativeAI = lazy(() => import("./google-generative-ai.ts").then(m => m.streamGoogleGenerativeAI));
export const googleVertex = lazy(() => import("./google-vertex.ts").then(m => m.streamGoogleVertex));
export const bedrockConverseStream = lazy(() => import("./bedrock-converse-stream.ts").then(m => m.streamBedrockConverseStream));
export const mistralConversations = lazy(() => import("./mistral-conversations.ts").then(m => m.streamMistralConversations));
export const openaiCodexResponses = lazy(() => import("./openai-codex-responses.ts").then(m => m.streamOpenAICodexResponses));
export const azureOpenAIResponses = lazy(() => import("./azure-openai-responses.ts").then(m => m.streamAzureOpenAIResponses));
export const piMessages = lazy(() => import("./pi-messages.ts").then(m => m.streamPiMessages));
// ... 更多
```

### Provider Factory 內部如何用 lazy function

```typescript
// packages/ai/src/providers/anthropic/index.ts
import { anthropicMessages } from "../../api/lazy.ts";

export const anthropicFactory: ProviderFactory = {
  name: "anthropic",
  createStreamFunction: (config) => {
    // 返回一個包裝函數，內部呼叫 lazy-loaded stream function
    return async (model, context, options) => {
      const streamFn = await anthropicMessages();  // 首次使用時才 import
      return streamFn(model, context, options);
    };
  },
  // ...
};
```

**效果**：
- 使用者只用 Anthropic → 只有 `anthropic-messages.ts` 被打包進 bundle
- 使用者用 Ollama → 只有 `ollama` 相關代碼被打包
- `esbuild`/`tsgo` 靜態分析可移除未被呼叫的動態 import 分支

---

## Model Catalog：自動生成、版本化、不可手改

### 為什麼要自動生成？

- 15+ providers、數百個模型、頻繁更新（新模型、價格變動、context window 擴大）
- 手維護不可能、容易過期、PR review 成本高
- 官方 API 大多有模型列表端點，可程式化抓取

### 生成流程（`packages/ai/scripts/generate-models.ts`）

```bash
# 執行生成
npm run generate:models

# 內部流程：
# 1. 並行呼叫各 provider 官方 API（或靜態清單）
# 2. 正規化欄位：id、name、contextWindow、maxOutputTokens、pricing、capabilities
# 3. 寫入 packages/ai/src/models.generated.ts
# 4. 同時生成 models-store.ts 供運行時查詢
```

### 生成產物（`models.generated.ts` 摘錄）

```typescript
// 這個檔案完全由腳本生成，請勿手動修改
export const MODEL_CATALOG: readonly ModelCatalogEntry[] = [
  {
    provider: "anthropic",
    id: "claude-3-5-sonnet-20241022",
    displayName: "Claude 3.5 Sonnet",
    contextWindow: 200000,
    maxOutputTokens: 8192,
    pricing: { input: 3.00, output: 15.00 },  // USD per 1M tokens
    capabilities: {
      tools: true,
      vision: true,
      thinking: true,
      streaming: true,
      systemPrompt: true,
    },
    thinking: { type: "anthropic", maxTokens: 32000 },
    knowledgeCutoff: "2024-04",
  },
  {
    provider: "openai",
    id: "gpt-4o-2024-08-06",
    displayName: "GPT-4o",
    contextWindow: 128000,
    maxOutputTokens: 16384,
    pricing: { input: 2.50, output: 10.00 },
    capabilities: { tools: true, vision: true, thinking: false, streaming: true, systemPrompt: true },
  },
  // ... 300+ entries
] as const;
```

### 運行時查詢（`models-store.ts`）

```typescript
export class ModelStore {
  private catalog: ModelCatalogEntry[];

  constructor(catalog = MODEL_CATALOG) {
    this.catalog = catalog;
  }

  getModel(provider: string, modelId: string): ModelCatalogEntry | undefined {
    return this.catalog.find(m => m.provider === provider && m.id === modelId);
  }

  listModels(provider?: string): ModelCatalogEntry[] {
    return provider
      ? this.catalog.filter(m => m.provider === provider)
      : this.catalog;
  }

  // 用於 CLI /model 選單分組
  getModelsByProvider(): Record<string, ModelCatalogEntry[]> {
    return this.catalog.reduce((acc, m) => {
      (acc[m.provider] ??= []).push(m);
      return acc;
    }, {} as Record<string, ModelCatalogEntry[]>);
  }
}
```

### 版本化與發佈

- `models.generated.ts` 隨著 pi 版本發佈（lockstep versioning）
- 每次 release 都重新生成，確保模型資料與代碼同步
- 使用者可用 `pi --list-models` 查看當前版本支援的模型

---

## Auth 統一：API Key、OAuth、Credential Store

### Credential 類型（`packages/ai/src/auth/types.ts`）

```typescript
export type Credential =
  | { type: "api_key"; apiKey: string }
  | { type: "oauth"; accessToken: string; refreshToken?: string; expiresAt?: number }
  | { type: "none" };  // 無需認證（如 Ollama local）
```

### Credential Store（`packages/ai/src/auth/credential-store.ts`）

```typescript
// 本地加密存儲（使用 OS keychain 或加密檔案）
export class CredentialStore {
  async get(provider: string): Promise<Credential | undefined>;
  async set(provider: string, credential: Credential): Promise<void>;
  async delete(provider: string): Promise<void>;
  async list(): Promise<Record<string, Credential>>;
}

// 實作細節：
// - macOS: Keychain Access
// - Linux: libsecret / 加密檔案 ~/.pi/credentials.enc
// - Windows: Credential Manager
// - Fallback: 檔案加密（AES-GCM，密鑰衍生自機器 ID）
```

### Credential Context（`packages/ai/src/auth/context.ts`）

```typescript
// 請求級的 credential 解析（優先級：環境變數 > 參數 > Store > OAuth）
export async function resolveCredential(
  provider: string,
  options: { apiKey?: string; oauth?: boolean; overrides?: Credential }
): Promise<Credential> {
  // 1. 參數覆蓋
  if (overrides) return overrides;
  if (options.apiKey) return { type: "api_key", apiKey: options.apiKey };

  // 2. 環境變數（如 ANTHROPIC_API_KEY）
  const envKey = `${provider.toUpperCase()}_API_KEY`;
  if (process.env[envKey]) return { type: "api_key", apiKey: process.env[envKey]! };

  // 3. Credential Store
  const stored = await credentialStore.get(provider);
  if (stored) return stored;

  // 4. OAuth（如果啟用）
  if (options.oauth) return await startOAuthFlow(provider);

  return { type: "none" };
}
```

### OAuth 流程（內建、無需外部庫）

```typescript
// packages/ai/src/auth/helpers.ts
export async function startOAuthFlow(provider: string): Promise<Credential> {
  const factory = getProviderFactory(provider);
  if (!factory?.oauth) throw new Error(`${provider} doesn't support OAuth`);

  // 1. 開啟瀏覽器到授權頁
  const authUrl = factory.oauth.getAuthUrl({ redirectUri: "http://localhost:3434/callback" });
  await openBrowser(authUrl);

  // 2. 本地啟動臨時 HTTP server 接收 callback
  const code = await new Promise<string>((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url!, `http://localhost:3434`);
      resolve(url.searchParams.get("code")!);
      res.end("Authorized! You can close this window.");
      server.close();
    });
    server.listen(3434);
  });

  // 3. 換取 token
  return factory.oauth.exchangeCode(code, { redirectUri: "http://localhost:3434/callback" });
}
```

---

## Credential Sync：跨裝置、跨 Session 同步

### 問題

- 使用者在多台機器用 pi
- API Key / OAuth token 會過期、輪換
- 不想每台機器都手動設定

### 解法：`ModelRuntime` + Credential Synchronization

```typescript
// packages/coding-agent/src/core/model-runtime.ts
export class ModelRuntime {
  private credentialSync: CredentialSynchronizer;

  async synchronizeCredentials(provider: string): Promise<void> {
    // 1. 從 Credential Store 讀取本地憑證
    const local = await credentialStore.get(provider);

    // 2. 若有遠端同步後端（可選），拉取最新
    const remote = await this.credentialSync.pull(provider);

    // 3. 合併策略：較新的 expiresAt 勝出
    const merged = this.mergeCredentials(local, remote);

    // 4. 寫回本地
    if (merged) await credentialStore.set(provider, merged);

    // 5. 推送到遠端（如果有變更）
    if (merged !== local) await this.credentialSync.push(provider, merged);
  }

  private mergeCredentials(a, b): Credential {
    if (!a) return b;
    if (!b) return a;
    // OAuth token 以 expiresAt 判斷新舊
    if (a.type === "oauth" && b.type === "oauth") {
      return (a.expiresAt ?? 0) > (b.expiresAt ?? 0) ? a : b;
    }
    return a; // API Key 通常不變，保留本地
  }
}
```

> **注意**：Credential Sync 是**可選**的、需使用者啟用。預設只用本地 Credential Store。

---

## Streaming 統一：從 Provider 差異到 5 種事件

### Anthropic Streaming（`api/anthropic-messages.ts`）

```typescript
// Anthropic 原生事件：message_start、content_block_delta、message_delta、message_stop
export async function* streamAnthropicMessages(model, context, options) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": options.apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: model.id, messages: context.messages, stream: true, ... }),
    signal: options.signal,
  });

  let partialMessage: AssistantMessage = { role: "assistant", content: [] };

  for await (const chunk of response.body) {
    const event = parseSSE(chunk);
    switch (event.type) {
      case "content_block_delta":
        if (event.delta.type === "text") {
          partialMessage.content.push({ type: "text", text: event.delta.text });
          yield { type: "text_delta", partial: { ...partialMessage } };
        } else if (event.delta.type === "thinking") {
          partialMessage.content.push({ type: "thinking", thinking: event.delta.thinking });
          yield { type: "thinking_delta", partial: { ...partialMessage } };
        }
        break;
      case "message_stop":
        yield { type: "done", result: async () => partialMessage };
        break;
    }
  }
}
```

### OpenAI Streaming（`api/openai-responses.ts`）

```typescript
// OpenAI Responses API 原生：response.output_text.delta、response.output_item.added（tool call）
export async function* streamOpenAIResponses(model, context, options) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${options.apiKey}` },
    body: JSON.stringify({ model: model.id, input: context.messages, stream: true, tools: context.tools, ... }),
    signal: options.signal,
  });

  let partialMessage: AssistantMessage = { role: "assistant", content: [] };

  for await (const chunk of response.body) {
    const event = parseSSE(chunk);
    switch (event.type) {
      case "response.output_text.delta":
        partialMessage.content.push({ type: "text", text: event.delta });
        yield { type: "text_delta", partial: { ...partialMessage } };
        break;
      case "response.output_item.added":
        if (event.item.type === "function_call") {
          partialMessage.content.push({ type: "toolCall", id: event.item.call_id, name: event.item.name, arguments: JSON.parse(event.item.arguments) });
          yield { type: "toolcall_delta", partial: { ...partialMessage } };
        }
        break;
      case "response.completed":
        yield { type: "done", result: async () => partialMessage };
        break;
    }
  }
}
```

> **統一點**：無論 provider 內部事件多複雜，對外都只產出 5 種 `StreamEvent`。上層 `agent-loop.ts` 完全不知道底下是 Anthropic 還是 OpenAI。

---

## Thinking / Reasoning 參數標準化

### 統一介面

```typescript
// 上層只傳 reasoning: "low" | "medium" | "high" | "off"
export interface StreamOptions {
  reasoning?: "low" | "medium" | "high" | "off";
  // ...
}
```

### 各 Provider 映射表

| 統一值 | Anthropic | OpenAI | Google | Bedrock | 其他 |
|---|---|---|---|---|---|
| `"off"` | `thinking: { type: "disabled" }` | 無 reasoning 參數 | `thinkingConfig: { thinkingBudget: 0 }` | `thinking: false` | 忽略 |
| `"low"` | `thinking: { type: "enabled", budget_tokens: 1024 }` | `reasoning: { effort: "low" }` | `thinkingConfig: { thinkingBudget: 1024 }` | `thinking: { budgetTokens: 1024 }` | 映射到對應 |
| `"medium"` | `budget_tokens: 8192` | `effort: "medium"` | `thinkingBudget: 8192` | `budgetTokens: 8192` | 映射 |
| `"high"` | `budget_tokens: 32768` | `effort: "high"` | `thinkingBudget: 32768` | `budgetTokens: 32768` | 映射 |

### 實作（`packages/ai/src/utils/reasoning.ts`）

```typescript
export function mapReasoningToProvider(provider: string, reasoning: ReasoningLevel, model: ModelConfig): Record<string, unknown> {
  switch (provider) {
    case "anthropic":
      if (reasoning === "off") return { thinking: { type: "disabled" } };
      return { thinking: { type: "enabled", budget_tokens: budgetFor(reasoning) } };
    case "openai":
      if (reasoning === "off") return {};
      return { reasoning: { effort: reasoning } };
    case "google":
      if (reasoning === "off") return { thinkingConfig: { thinkingBudget: 0 } };
      return { thinkingConfig: { thinkingBudget: budgetFor(reasoning) } };
    case "bedrock":
      if (reasoning === "off") return { thinking: false };
      return { thinking: { budgetTokens: budgetFor(reasoning) } };
    default:
      return {};
  }
}
```

---

## 參考資料

- [Pi 官方文件：Multi-Provider 支援](https://pi.dev/docs/latest/providers)
- [GitHub - earendil-works/pi — packages/ai 目錄](https://github.com/earendil-works/pi/tree/main/packages/ai)
- [Anthropic Messages API Streaming](https://docs.anthropic.com/en/api/messages-streaming)
- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses)
- [Google Generative AI API](https://ai.google.dev/api/generate-content)
- [AWS Bedrock Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/converse-api.html)
- [JSON Schema 規範](https://json-schema.org/)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)

---

## 下一篇預告

> **第 4 篇：Agent Loop：雙層循環與事件流**
>
> `agentLoop()` 如何啟動？`runLoop()` 的雙層 `while(true)` 結構？`getSteeringMessages()` vs `getFollowUpMessages()` 如何對應 Enter/Alt+Enter？`prepareNextTurn()` 何時觸發 compaction、model switch？`streamAssistantResponse()` 如何處理部分訊息更新？工具執行的 parallel/sequential 邏輯？