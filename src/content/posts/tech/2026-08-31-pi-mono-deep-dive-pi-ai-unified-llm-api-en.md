---
title: "pi-mono Deep Dive 3: pi-ai — Unifying 15+ LLM Providers, From Lazy Loading to Auto-Generated Model Catalog"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, llm-api, provider-pattern, model-catalog, oauth]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 3
tldr: "pi-ai is pi-mono's anti-corruption layer: upper layers only see Message/Tool/Context/streamFunction; 15+ providers implement details underneath. This post dissects: unified interface design, Provider Factory Registry, Lazy Loading for tree-shaking, Model Catalog auto-generation, OAuth/API Key unification, Credential Sync, Thinking/Reasoning parameter standardization."
description: "Deep dive into pi-ai package: architecture of unified multi-provider LLM API. Covers core types, Provider Factory pattern, api/ directory implementations, lazy.ts dynamic loading, models.generated.ts auto-generation, auth/ module OAuth & Credential Store, streaming event standardization, thinking/reasoning parameter mapping across providers. For engineers researching LLM Gateway and multi-model abstraction layer design."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-pi-ai-unified-llm-api)

## TL;DR

- **Core Abstractions**: `Message`, `Tool`, `Context`, `StreamFunction`, `StreamEvent` — shared by all providers
- **Provider Factory**: `providers/index.ts` registers 15+ factories, `getProviderFactory(name)` resolves
- **Lazy Loading**: `api/lazy.ts` uses dynamic `import()`, unused provider code tree-shaken away
- **Model Catalog**: `npm run generate:models` fetches from official APIs → `models.generated.ts` (~50KB, do not hand-edit)
- **Auth Unification**: `auth/credential-store.ts` (local encrypted storage), `auth/context.ts` (request-level resolution), built-in OAuth flows
- **Streaming Unification**: 5 `StreamEvent` types cover all provider differences
- **Thinking/Reasoning**: `reasoning: "low"|"medium"|"high"|"off"` maps to each provider's params

---

## Why pi-ai Exists: The Anti-Corruption Layer Value

Upper layers (`pi-agent-core`, `pi-coding-agent`) **never need to know**:

- Anthropic uses `messages` endpoint, OpenAI uses `responses`/`chat/completions`
- Google calls `generateContent`, Bedrock calls `InvokeModelWithResponseStream`
- Each provider has different tool calling format, thinking param names, streaming event structures
- OAuth flows, API Key headers, base URLs all differ

**What pi-ai does**: Encapsulates these differences behind `streamFunction`; upper layers just call:

```typescript
// Identical upper-layer code regardless of provider
const events = await streamFunction(modelConfig, context, {
  apiKey: resolvedKey,
  signal: abortSignal,
  reasoning: "medium",
  toolExecution: "parallel",
});

for await (const event of events) {
  // Handle unified StreamEvent
}
```

---

## Core Types: The Unified Contract

### Message Types (`packages/ai/src/types.ts`)

```typescript
// Unified message format (used by upper layers)
export interface Message {
  role: "user" | "assistant" | "system" | "tool";
  content: string | ContentBlock[];
  // ... metadata
}

// Content Block: text, thinking, tool call, tool result, image
export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "thinking"; thinking: string; signature?: string }
  | { type: "toolCall"; id: string; name: string; arguments: Record<string, unknown> }
  | { type: "toolResult"; toolCallId: string; content: ContentBlock[]; isError?: boolean }
  | { type: "image"; source: ImageSource };
```

> **Key**: `toolCall.arguments` is always `Record<string, unknown>` (parsed JSON), never a string. Provider side handles serialization.

### Tool Definition (`packages/ai/src/types.ts`)

```typescript
export interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;  // Standard JSON Schema
  // Optional: provider-specific params
  execute?: (id: string, args: unknown, signal, onUpdate) => Promise<ToolResult>;
}
```

### Context: Complete Context for LLM

```typescript
export interface Context {
  systemPrompt: string;
  messages: Message[];
  tools: Tool[];
  // Optional: provider-specific options
  options?: Record<string, unknown>;
}
```

### StreamFunction: Unified Streaming Interface

```typescript
// All providers implement this signature
export type StreamFunction = (
  model: ModelConfig,
  context: Context,
  options: StreamOptions
) => AsyncIterable<StreamEvent>;
```

### StreamEvent: 5 Unified Events

```typescript
export type StreamEvent =
  | { type: "start"; partial: AssistantMessage }           // Generation starts
  | { type: "text_delta"; partial: AssistantMessage }      // Text delta
  | { type: "thinking_delta"; partial: AssistantMessage }  // Thinking delta
  | { type: "toolcall_delta"; partial: AssistantMessage }  // Tool call delta
  | { type: "done"; result: () => Promise<AssistantMessage> } // Complete
  | { type: "error"; error: Error };                       // Error
```

> **Design Philosophy**: Minimal event types (5), but `partial` carries full `AssistantMessage` state. Upper layers just render `partial`. No provider-specific event handling needed.

---

## Provider Factory Pattern: Registration & Resolution

### Factory Interface (`packages/ai/src/providers/index.ts`)

```typescript
export interface ProviderFactory {
  name: string;                                    // "anthropic", "openai", "google"...
  createStreamFunction: (config: ProviderConfig) => StreamFunction;
  getModelConfig: (modelId: string) => ModelConfig | undefined;
  validateConfig: (config: ProviderConfig) => ValidationResult;
  // Optional: OAuth support
  oauth?: {
    getAuthUrl: (config) => string;
    exchangeCode: (code, config) => Promise<Credential>;
    refreshToken: (refreshToken, config) => Promise<Credential>;
  };
}
```

### Registry (`packages/ai/src/providers/index.ts`)

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

### Usage Pattern

```typescript
// Upper layer parses model string like "anthropic/claude-3-5-sonnet-20241022"
const [providerName, modelId] = modelString.split("/");
const factory = getProviderFactory(providerName);
if (!factory) throw new Error(`Unknown provider: ${providerName}`);

const streamFn = factory.createStreamFunction({ apiKey, baseUrl, ... });
```

---

## Lazy Loading: The Key to Tree-Shaking

### Problem: Static Import of 15+ Providers Bloats Bundle

```typescript
// ❌ Wrong: static import all providers
import { anthropicFactory } from "./providers/anthropic/index.ts";
import { openaiFactory } from "./providers/openai/index.ts";
// ... 15 import lines
```

### Solution: `api/lazy.ts` Dynamic Loading

```typescript
// packages/ai/src/api/lazy.ts
function lazy<T>(factory: () => Promise<T>) {
  let cached: T | null = null;
  return async (): Promise<T> => {
    if (!cached) cached = await factory();
    return cached;
  };
}

// Each provider's stream function independently lazy-loaded
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
// ... more
```

### How Provider Factory Uses Lazy Functions

```typescript
// packages/ai/src/providers/anthropic/index.ts
import { anthropicMessages } from "../../api/lazy.ts";

export const anthropicFactory: ProviderFactory = {
  name: "anthropic",
  createStreamFunction: (config) => {
    // Returns wrapper that calls lazy-loaded stream function
    return async (model, context, options) => {
      const streamFn = await anthropicMessages();  // Import on first use
      return streamFn(model, context, options);
    };
  },
  // ...
};
```

**Effect**:
- User only uses Anthropic → only `anthropic-messages.ts` in bundle
- User uses Ollama → only Ollama code bundled
- `esbuild`/`tsgo` static analysis removes uncalled dynamic import branches

---

## Model Catalog: Auto-Generated, Versioned, Do-Not-Hand-Edit

### Why Auto-Generate?

- 15+ providers, hundreds of models, frequent updates (new models, price changes, context window expansions)
- Manual maintenance impossible, staleness guaranteed, PR review overhead high
- Most official APIs have model list endpoints, programmatically fetchable

### Generation Flow (`packages/ai/scripts/generate-models.ts`)

```bash
# Run generation
npm run generate:models

# Internal flow:
# 1. Parallel fetch from provider official APIs (or static lists)
# 2. Normalize fields: id, name, contextWindow, maxOutputTokens, pricing, capabilities
# 3. Write packages/ai/src/models.generated.ts
# 4. Also generate models-store.ts for runtime queries
```

### Generated Artifact (`models.generated.ts` excerpt)

```typescript
// THIS FILE IS GENERATED BY SCRIPT. DO NOT EDIT MANUALLY.
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

### Runtime Query (`models-store.ts`)

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

  // For CLI /model menu grouping
  getModelsByProvider(): Record<string, ModelCatalogEntry[]> {
    return this.catalog.reduce((acc, m) => {
      (acc[m.provider] ??= []).push(m);
      return acc;
    }, {} as Record<string, ModelCatalogEntry[]>);
  }
}
```

### Versioning & Publishing

- `models.generated.ts` ships with pi version (lockstep versioning)
- Every release regenerates, ensuring model data stays in sync with code
- Users can run `pi --list-models` to see current version's supported models

---

## Auth Unification: API Key, OAuth, Credential Store

### Credential Types (`packages/ai/src/auth/types.ts`)

```typescript
export type Credential =
  | { type: "api_key"; apiKey: string }
  | { type: "oauth"; accessToken: string; refreshToken?: string; expiresAt?: number }
  | { type: "none" };  // No auth needed (e.g., Ollama local)
```

### Credential Store (`packages/ai/src/auth/credential-store.ts`)

```typescript
// Local encrypted storage (OS keychain or encrypted file)
export class CredentialStore {
  async get(provider: string): Promise<Credential | undefined>;
  async set(provider: string, credential: Credential): Promise<void>;
  async delete(provider: string): Promise<void>;
  async list(): Promise<Record<string, Credential>>;
}

// Implementation details:
// - macOS: Keychain Access
// - Linux: libsecret / encrypted file ~/.pi/credentials.enc
// - Windows: Credential Manager
// - Fallback: File encryption (AES-GCM, key derived from machine ID)
```

### Credential Context (`packages/ai/src/auth/context.ts`)

```typescript
// Request-level credential resolution (priority: env var > param > Store > OAuth)
export async function resolveCredential(
  provider: string,
  options: { apiKey?: string; oauth?: boolean; overrides?: Credential }
): Promise<Credential> {
  // 1. Param override
  if (overrides) return overrides;
  if (options.apiKey) return { type: "api_key", apiKey: options.apiKey };

  // 2. Environment variable (e.g., ANTHROPIC_API_KEY)
  const envKey = `${provider.toUpperCase()}_API_KEY`;
  if (process.env[envKey]) return { type: "api_key", apiKey: process.env[envKey]! };

  // 3. Credential Store
  const stored = await credentialStore.get(provider);
  if (stored) return stored;

  // 4. OAuth (if enabled)
  if (options.oauth) return await startOAuthFlow(provider);

  return { type: "none" };
}
```

### OAuth Flow (Built-in, No External Libs)

```typescript
// packages/ai/src/auth/helpers.ts
export async function startOAuthFlow(provider: string): Promise<Credential> {
  const factory = getProviderFactory(provider);
  if (!factory?.oauth) throw new Error(`${provider} doesn't support OAuth`);

  // 1. Open browser to auth page
  const authUrl = factory.oauth.getAuthUrl({ redirectUri: "http://localhost:3434/callback" });
  await openBrowser(authUrl);

  // 2. Spin up local temp HTTP server for callback
  const code = await new Promise<string>((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url!, `http://localhost:3434`);
      resolve(url.searchParams.get("code")!);
      res.end("Authorized! You can close this window.");
      server.close();
    });
    server.listen(3434);
  });

  // 3. Exchange code for token
  return factory.oauth.exchangeCode(code, { redirectUri: "http://localhost:3434/callback" });
}
```

---

## Credential Sync: Cross-Device, Cross-Session Sync

### Problem

- Users run pi on multiple machines
- API Keys / OAuth tokens expire, rotate
- Don't want manual setup on every machine

### Solution: `ModelRuntime` + Credential Synchronization

```typescript
// packages/coding-agent/src/core/model-runtime.ts
export class ModelRuntime {
  private credentialSync: CredentialSynchronizer;

  async synchronizeCredentials(provider: string): Promise<void> {
    // 1. Read local credential from Store
    const local = await credentialStore.get(provider);

    // 2. If remote sync backend exists (optional), pull latest
    const remote = await this.credentialSync.pull(provider);

    // 3. Merge strategy: newer expiresAt wins
    const merged = this.mergeCredentials(local, remote);

    // 4. Write back locally
    if (merged) await credentialStore.set(provider, merged);

    // 5. Push to remote (if changed)
    if (merged !== local) await this.credentialSync.push(provider, merged);
  }

  private mergeCredentials(a, b): Credential {
    if (!a) return b;
    if (!b) return a;
    // OAuth token: newer expiresAt wins
    if (a.type === "oauth" && b.type === "oauth") {
      return (a.expiresAt ?? 0) > (b.expiresAt ?? 0) ? a : b;
    }
    return a; // API Key usually static, keep local
  }
}
```

> **Note**: Credential Sync is **optional**, user-opt-in. Defaults to local Credential Store only.

---

## Streaming Unification: From Provider Chaos to 5 Events

### Anthropic Streaming (`api/anthropic-messages.ts`)

```typescript
// Anthropic native events: message_start, content_block_delta, message_delta, message_stop
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

### OpenAI Streaming (`api/openai-responses.ts`)

```typescript
// OpenAI Responses API native: response.output_text.delta, response.output_item.added (tool call)
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

> **Unification Point**: However complex provider internals, only 5 `StreamEvent` types emitted. Upper layer `agent-loop.ts` has zero knowledge of Anthropic vs OpenAI underneath.

---

## Thinking / Reasoning Parameter Standardization

### Unified Interface

```typescript
// Upper layer only passes reasoning: "low" | "medium" | "high" | "off"
export interface StreamOptions {
  reasoning?: "low" | "medium" | "high" | "off";
  // ...
}
```

### Provider Mapping Table

| Unified | Anthropic | OpenAI | Google | Bedrock | Others |
|---|---|---|---|---|---|
| `"off"` | `thinking: { type: "disabled" }` | No reasoning param | `thinkingConfig: { thinkingBudget: 0 }` | `thinking: false` | Ignored |
| `"low"` | `thinking: { type: "enabled", budget_tokens: 1024 }` | `reasoning: { effort: "low" }` | `thinkingConfig: { thinkingBudget: 1024 }` | `thinking: { budgetTokens: 1024 }` | Map accordingly |
| `"medium"` | `budget_tokens: 8192` | `effort: "medium"` | `thinkingBudget: 8192` | `budgetTokens: 8192` | Map |
| `"high"` | `budget_tokens: 32768` | `effort: "high"` | `thinkingBudget: 32768` | `budgetTokens: 32768` | Map |

### Implementation (`packages/ai/src/utils/reasoning.ts`)

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

## References

- [Pi Official Docs: Multi-Provider Support](https://pi.dev/docs/latest/providers)
- [GitHub - earendil-works/pi — packages/ai directory](https://github.com/earendil-works/pi/tree/main/packages/ai)
- [Anthropic Messages API Streaming](https://docs.anthropic.com/en/api/messages-streaming)
- [OpenAI Responses API](https://platform.openai.com/docs/api-reference/responses)
- [Google Generative AI API](https://ai.google.dev/api/generate-content)
- [AWS Bedrock Converse API](https://docs.aws.amazon.com/bedrock/latest/userguide/converse-api.html)
- [JSON Schema Specification](https://json-schema.org/)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)

---

## Next Up

> **Part 4: Agent Loop — Double-Loop & Event Flow**
>
> How does `agentLoop()` start? `runLoop()` double `while(true)` structure? How do `getSteeringMessages()` vs `getFollowUpMessages()` map to Enter/Alt+Enter? When does `prepareNextTurn()` trigger compaction, model switch? How does `streamAssistantResponse()` handle partial message updates? Tool execution parallel/sequential logic?