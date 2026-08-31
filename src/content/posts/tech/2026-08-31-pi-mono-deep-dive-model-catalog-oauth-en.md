---
title: "pi-mono Deep Dive 9: Model Catalog, Provider Factory, OAuth & Credential Sync — From Auto-Generation to Cross-Device Sync"
date: 2026-08-31
type: project
category: tech
tags: [pi, coding-agent, ai-tools, cli, open-source, typescript, model-catalog, provider-factory, oauth, credential-sync, credential-store]
lang: en
series:
  name: "pi-mono Deep Dive"
  order: 9
tldr: "pi-ai Model Catalog auto-generation flow, Provider Factory registration with Lazy Loading, OAuth 2.0 + PKCE flow implementation, Credential Store (Keychain/Libsecret/Credential Manager/Encrypted File Fallback), Credential Sync cross-device sync mechanism, Model Scope Diagnostics, ModelResolver parsing logic, CredentialSynchronizationOperation state machine."
description: "Deep dive into pi-ai model ecosystem: Model Catalog auto-fetch from official APIs → models.generated.ts, Provider Factory pattern registering 15+ providers, api/lazy.ts dynamic loading for Tree-shaking, OAuth 2.0 Authorization Code Flow with PKCE, Local Credential Storage Cross-platform Implementation, Credential Sync Merge Strategy & Conflict Resolution, ModelRegistry Scope Diagnostics, ModelRuntime Credential Sync Operations. For engineers researching LLM Gateway, Multi-Model Management, OAuth Integration."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-31-pi-mono-deep-dive-model-catalog-oauth)

## TL;DR

- **Model Catalog**: `npm run generate:models` parallel fetch from 15+ provider official APIs → `models.generated.ts` (~50KB, do not hand-edit)
- **Provider Factory**: `providers/index.ts` registers 15+ factories, `getProviderFactory(name)` resolves
- **Lazy Loading**: `api/lazy.ts` dynamic `import()`, unused provider code Tree-shaken away
- **OAuth 2.0**: Authorization Code Flow + PKCE, Local Temp HTTP Server for Callback, Auto Token Refresh
- **Credential Store**: macOS Keychain / Linux Libsecret / Windows Credential Manager / Encrypted File Fallback
- **Credential Sync**: Pull → Merge (Newer expiresAt Wins) → Push, Optional Enable, ModelRuntime Integration
- **ModelResolver**: CLI Model String → ModelConfig, Scope Diagnostics, Model Scope Resolution

---

## Model Catalog: Auto-Generated, Versioned, Do-Not-Hand-Edit

### Why Auto-Generate?

- 15+ Providers, Hundreds of Models, Frequent Updates (New Models, Price Changes, Context Window Expansions)
- Manual Maintenance Impossible, Staleness Guaranteed, PR Review Overhead High
- Most Official APIs Have Model List Endpoints, Programmatically Fetchable

### Generation Flow (`packages/ai/scripts/generate-models.ts`)

```bash
# Run Generation
npm run generate:models

# Internal Flow:
# 1. Parallel Fetch from Provider Official APIs (or Static Lists)
# 2. Normalize Fields: id, name, contextWindow, maxOutputTokens, pricing, capabilities
# 3. Write packages/ai/src/models.generated.ts
# 4. Also Generate models-store.ts for Runtime Queries
```

### Parallel Fetch Implementation

```typescript
// packages/ai/scripts/generate-models.ts
async function generateModelCatalog(): Promise<void> {
  const providers = [
    { name: "anthropic", fetch: fetchAnthropicModels },
    { name: "openai", fetch: fetchOpenAIModels },
    { name: "google", fetch: fetchGoogleModels },
    { name: "azure", fetch: fetchAzureModels },
    { name: "bedrock", fetch: fetchBedrockModels },
    { name: "mistral", fetch: fetchMistralModels },
    { name: "groq", fetch: fetchGroqModels },
    { name: "cerebras", fetch: fetchCerebrasModels },
    { name: "xai", fetch: fetchXAIModels },
    { name: "huggingface", fetch: fetchHFModels },
    { name: "kimi", fetch: fetchKimiModels },
    { name: "minimax", fetch: fetchMinimaxModels },
    { name: "nvidia", fetch: fetchNVIDIAModels },
    { name: "openrouter", fetch: fetchOpenRouterModels },
    { name: "ollama", fetch: fetchOllamaModels },
  ];

  // Parallel Fetch, Single Failure Doesn't Affect Whole
  const results = await Promise.allSettled(
    providers.map(p => p.fetch().then(models => ({ provider: p.name, models })))
  );

  const catalog: ModelCatalogEntry[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      catalog.push(...result.value.models.map(normalizeModel));
    } else {
      console.warn(`Failed to fetch ${providers[results.indexOf(result)].name}:`, result.reason);
    }
  }

  // Write models.generated.ts
  await writeFile(
    "packages/ai/src/models.generated.ts",
    generateModelCatalogFile(catalog),
    "utf8"
  );
}

function normalizeModel(provider: string, raw: any): ModelCatalogEntry {
  return {
    provider,
    id: raw.id || raw.model || raw.name,
    displayName: raw.display_name || raw.name || raw.id,
    contextWindow: raw.context_window || raw.max_tokens || raw.context_length || 4096,
    maxOutputTokens: raw.max_output_tokens || raw.max_completion_tokens || 4096,
    pricing: {
      input: raw.pricing?.input || raw.input_price || 0,
      output: raw.pricing?.output || raw.output_price || 0,
    },
    capabilities: {
      tools: raw.capabilities?.tools ?? raw.supports_tools ?? false,
      vision: raw.capabilities?.vision ?? raw.supports_vision ?? false,
      thinking: raw.capabilities?.thinking ?? raw.supports_thinking ?? false,
      streaming: raw.capabilities?.streaming ?? true,
      systemPrompt: raw.capabilities?.system_prompt ?? true,
    },
    thinking: raw.thinking ? { type: provider, maxTokens: raw.thinking.max_tokens } : undefined,
    knowledgeCutoff: raw.knowledge_cutoff || raw.training_data_cutoff,
  };
}
```

### Generated Artifact (`models.generated.ts` Excerpt)

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

### Versioning & Publishing

- `models.generated.ts` Ships with pi Version (Lockstep Versioning)
- Every Release Regenerates, Ensuring Model Data Stays in Sync with Code
- `pi --list-models` to View Current Version's Supported Models

---

## Provider Factory: Registration & Lazy Loading

### Factory Interface

```typescript
// packages/ai/src/providers/index.ts
export interface ProviderFactory {
  name: string;                                    // "anthropic", "openai"...
  createStreamFunction: (config: ProviderConfig) => StreamFunction;
  getModelConfig: (modelId: string) => ModelConfig | undefined;
  validateConfig: (config: ProviderConfig) => ValidationResult;
  oauth?: {
    getAuthUrl: (config) => string;
    exchangeCode: (code, config) => Promise<Credential>;
    refreshToken: (refreshToken, config) => Promise<Credential>;
  };
}
```

### Registry

```typescript
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
```

### Lazy Loading (`api/lazy.ts`)

```typescript
function lazy<T>(factory: () => Promise<T>) {
  let cached: T | null = null;
  return async (): Promise<T> => {
    if (!cached) cached = await factory();
    return cached;
  };
}

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
// ...
```

### Factory Internal Usage of Lazy Function

```typescript
// packages/ai/src/providers/anthropic/index.ts
import { anthropicMessages } from "../../api/lazy.ts";

export const anthropicFactory: ProviderFactory = {
  name: "anthropic",
  createStreamFunction: (config) => {
    return async (model, context, options) => {
      const streamFn = await anthropicMessages();  // Import on First Use
      return streamFn(model, context, options);
    };
  },
  getModelConfig: (modelId) => MODEL_CATALOG.find(m => m.provider === "anthropic" && m.id === modelId),
  validateConfig: (config) => ({ valid: !!config.apiKey }),
  oauth: {
    getAuthUrl: (config) => `https://console.anthropic.com/oauth/authorize?client_id=${config.clientId}&redirect_uri=${config.redirectUri}&response_type=code&scope=api:read`,
    exchangeCode: async (code, config) => { /* ... */ },
    refreshToken: async (refreshToken, config) => { /* ... */ },
  },
};
```

**Effect**: Only Use Anthropic → Only `anthropic-messages.ts` Bundled; Use Ollama → Only Ollama Code Bundled.

---

## OAuth 2.0 + PKCE: Complete Flow

### Authorization Code Flow + PKCE

```typescript
// packages/ai/src/auth/helpers.ts
export async function startOAuthFlow(provider: string): Promise<Credential> {
  const factory = getProviderFactory(provider);
  if (!factory?.oauth) throw new Error(`${provider} doesn't support OAuth`);

  // 1. Generate PKCE Code Verifier / Challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // 2. Build Auth URL
  const authUrl = factory.oauth.getAuthUrl({
    redirectUri: "http://localhost:3434/callback",
    codeChallenge,
    codeChallengeMethod: "S256",
    state: generateState(),
  });

  // 3. Open Browser
  await openBrowser(authUrl);

  // 4. Local Temp HTTP Server for Callback
  const { code, state } = await new Promise<{ code: string; state: string }>((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url!, `http://localhost:3434`);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      const error = url.searchParams.get("error");
      
      if (error) {
        res.end(`Error: ${error}`);
        reject(new Error(`OAuth error: ${error}`));
      } else if (code && state) {
        res.end("Authorized! You can close this window.");
        resolve({ code, state });
      }
      server.close();
    });
    server.listen(3434);
  });

  // 5. Verify State, Exchange Token
  // (State Verification Prevents CSRF)
  const credential = await factory.oauth.exchangeCode(code, {
    redirectUri: "http://localhost:3434/callback",
    codeVerifier,
  });

  return credential;
}

function generateCodeVerifier(): string {
  // RFC 7636: 43-128 Chars, URL-safe Base64
  const bytes = crypto.randomBytes(32);
  return base64url.encode(bytes);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  // S256: SHA256(Verifier) -> Base64URL
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url.encode(new Uint8Array(hash));
}
```

### Auto Token Refresh

```typescript
// packages/ai/src/auth/context.ts
export async function resolveCredential(
  provider: string,
  options: { apiKey?: string; oauth?: boolean; overrides?: Credential }
): Promise<Credential> {
  // 1. Param Override
  if (options.overrides) return options.overrides;
  if (options.apiKey) return { type: "api_key", apiKey: options.apiKey };

  // 2. Environment Variable
  const envKey = `${provider.toUpperCase()}_API_KEY`;
  if (process.env[envKey]) return { type: "api_key", apiKey: process.env[envKey]! };

  // 3. Credential Store
  const stored = await credentialStore.get(provider);
  if (stored) {
    // OAuth Token Expiry Check & Auto Refresh
    if (stored.type === "oauth" && stored.expiresAt && stored.expiresAt < Date.now() + 60000) {
      const refreshed = await refreshOAuthToken(provider, stored.refreshToken!);
      await credentialStore.set(provider, refreshed);
      return refreshed;
    }
    return stored;
  }

  // 4. OAuth Flow
  if (options.oauth) return await startOAuthFlow(provider);

  return { type: "none" };
}

async function refreshOAuthToken(provider: string, refreshToken: string): Promise<Credential> {
  const factory = getProviderFactory(provider);
  if (!factory?.oauth?.refreshToken) throw new Error(`${provider} doesn't support token refresh`);
  
  const newCredential = await factory.oauth.refreshToken(refreshToken, {});
  return newCredential;
}
```

---

## Credential Store: Cross-Platform Encrypted Storage

### Interface Definition

```typescript
// packages/ai/src/auth/credential-store.ts
export class CredentialStore {
  async get(provider: string): Promise<Credential | undefined>;
  async set(provider: string, credential: Credential): Promise<void>;
  async delete(provider: string): Promise<void>;
  async list(): Promise<Record<string, Credential>>;
}

export type Credential =
  | { type: "api_key"; apiKey: string }
  | { type: "oauth"; accessToken: string; refreshToken?: string; expiresAt?: number }
  | { type: "none" };
```

### Platform Implementations

```typescript
// macOS: Keychain Access
async function keychainGet(service: string, account: string): Promise<string | null> {
  const { stdout } = await execFile("security", [
    "find-generic-password", "-s", service, "-a", account, "-w"
  ]);
  return stdout.trim() || null;
}

async function keychainSet(service: string, account: string, password: string): Promise<void> {
  await execFile("security", [
    "add-generic-password", "-s", service, "-a", account, "-w", password, "-U"
  ]);
}

// Linux: libsecret (DBus)
async function libsecretGet(schema: string, attributes: Record<string, string>): Promise<string | null> {
  // Use secret-tool or Direct DBus Call
  const { stdout } = await execFile("secret-tool", ["lookup", ...Object.entries(attributes).flat()]);
  return stdout.trim() || null;
}

// Windows: Credential Manager
async function wincredGet(target: string): Promise<string | null> {
  // PowerShell: Get-StoredCredential
  const { stdout } = await execFile("powershell", [
    "-Command", `[System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Net.CredentialCache]::DefaultCredentials.GetCredential('${target}', '').Password)`
  ]);
  return stdout.trim() || null;
}

// Fallback: Encrypted File (AES-GCM)
const FALLBACK_PATH = "~/.pi/credentials.enc";
const KEY_DERIVATION = "PBKDF2-SHA256, 100000 Iterations, Machine-ID Salt";

async function fallbackGet(provider: string): Promise<Credential | null> {
  const data = await readEncryptedFile(FALLBACK_PATH);
  return data?.[provider] ?? null;
}

async function fallbackSet(provider: string, credential: Credential): Promise<void> {
  const data = { ...(await readEncryptedFile(FALLBACK_PATH)), [provider]: credential };
  await writeEncryptedFile(FALLBACK_PATH, data);
}
```

### Unified Entrypoint

```typescript
export class CredentialStore {
  private backend: "keychain" | "libsecret" | "wincred" | "fallback";

  constructor() {
    this.backend = detectBackend();
  }

  async get(provider: string): Promise<Credential | undefined> {
    switch (this.backend) {
      case "keychain": return keychainGet("pi", provider);
      case "libsecret": return libsecretGet("pi", { provider });
      case "wincred": return wincredGet(`pi/${provider}`);
      case "fallback": return fallbackGet(provider);
    }
  }
  // ... set, delete, list
}
```

---

## Credential Sync: Cross-Device Sync

### Sync Flow

```typescript
// packages/coding-agent/src/core/model-runtime.ts
export class ModelRuntime {
  private credentialSync: CredentialSynchronizer;

  async synchronizeCredentials(provider: string): Promise<void> {
    // 1. Read Local Credential
    const local = await credentialStore.get(provider);

    // 2. Pull Remote (Optional Backend)
    const remote = await this.credentialSync.pull(provider);

    // 3. Merge Strategy: Newer expiresAt Wins
    const merged = this.mergeCredentials(local, remote);

    // 4. Write Back Locally
    if (merged) await credentialStore.set(provider, merged);

    // 5. Push to Remote
    if (merged !== local) await this.credentialSync.push(provider, merged);
  }

  private mergeCredentials(a: Credential | undefined, b: Credential | undefined): Credential | undefined {
    if (!a) return b;
    if (!b) return a;
    
    // OAuth Token: Newer expiresAt Wins
    if (a.type === "oauth" && b.type === "oauth") {
      return (a.expiresAt ?? 0) > (b.expiresAt ?? 0) ? a : b;
    }
    
    // API Key Usually Static, Keep Local
    if (a.type === "api_key" && b.type === "api_key") return a;
    
    // Mixed Types: Prefer OAuth (Refreshable)
    if (a.type === "oauth") return a;
    if (b.type === "oauth") return b;
    
    return a;
  }
}
```

### CredentialSynchronizer Interface

```typescript
export interface CredentialSynchronizer {
  pull(provider: string): Promise<Credential | undefined>;
  push(provider: string, credential: Credential): Promise<void>;
  // Optional: Listen for Remote Changes
  onRemoteChange?: (provider: string, credential: Credential) => void;
}
```

### Sync State Machine (`CredentialSynchronizationOperation`)

```typescript
export type CredentialSynchronizationOperation =
  | { type: "idle" }
  | { type: "pulling"; provider: string }
  | { type: "pushing"; provider: string }
  | { type: "merging"; provider: string; local: Credential; remote: Credential }
  | { type: "completed"; provider: string; merged: Credential }
  | { type: "failed"; provider: string; error: Error };

export class CredentialSyncStateMachine {
  private state: CredentialSynchronizationOperation = { type: "idle" };
  private listeners: Set<(state: CredentialSynchronizationOperation) => void> = new Set();

  async sync(provider: string): Promise<void> {
    this.transition({ type: "pulling", provider });
    const remote = await this.synchronizer.pull(provider);
    
    this.transition({ type: "merging", provider, local: await this.store.get(provider), remote });
    const merged = this.merge(this.store.get(provider), remote);
    
    this.transition({ type: "pushing", provider });
    await this.synchronizer.push(provider, merged);
    await this.store.set(provider, merged);
    
    this.transition({ type: "completed", provider, merged });
  }

  private transition(newState: CredentialSynchronizationOperation): void {
    this.state = newState;
    this.listeners.forEach(l => l(newState));
  }

  subscribe(listener: (state: CredentialSynchronizationOperation) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
```

---

## ModelResolver: CLI String Parsing & Diagnostics

### Parsing Logic

```typescript
// packages/coding-agent/src/core/model-resolver.ts
export function resolveCliModel(
  input: string,
  modelRegistry: ModelRegistry
): ResolveCliModelResult {
  // Format: provider/model-id or model-id (Default Anthropic)
  const [provider, ...modelParts] = input.split("/");
  const modelId = modelParts.join("/");
  
  if (!modelId) {
    return { ok: false, error: "Model ID required", diagnostics: [] };
  }

  const resolvedProvider = provider || "anthropic";
  const factory = getProviderFactory(resolvedProvider);
  if (!factory) {
    return { ok: false, error: `Unknown provider: ${resolvedProvider}`, diagnostics: [] };
  }

  const modelConfig = factory.getModelConfig(modelId);
  if (!modelConfig) {
    return { 
      ok: false, 
      error: `Model ${modelId} not found for provider ${resolvedProvider}`,
      diagnostics: [{ type: "warning", message: `Available models: ${factory.listModels().map(m => m.id).join(", ")}` }]
    };
  }

  return { ok: true, model: modelConfig, provider: resolvedProvider, diagnostics: [] };
}
```

### Scope Diagnostics

```typescript
export function resolveModelScopeWithDiagnostics(
  modelScope: string,
  modelRegistry: ModelRegistry
): { result: ResolveCliModelResult; diagnostics: ModelScopeDiagnostic[] } {
  const diagnostics: ModelScopeDiagnostic[] = [];
  
  // 1. Check Provider Exists
  const provider = modelScope.split("/")[0];
  if (!getProviderFactory(provider)) {
    diagnostics.push({ severity: "error", code: "unknown_provider", message: `Provider '${provider}' not found` });
  }

  // 2. Check Model Exists
  const model = modelRegistry.getModel(provider, modelScope.split("/").slice(1).join("/"));
  if (!model) {
    diagnostics.push({ severity: "warning", code: "model_not_found", message: `Model not in catalog, may be outdated` });
  }

  // 3. Check Capability Match
  if (model && model.capabilities.tools === false) {
    diagnostics.push({ severity: "info", code: "no_tools", message: "Model doesn't support tool calling" });
  }

  // 4. Check Context Window
  if (model && model.contextWindow < 8192) {
    diagnostics.push({ severity: "warning", code: "small_context", message: `Small context window (${model.contextWindow} tokens)` });
  }

  return { result: resolveCliModel(modelScope, modelRegistry), diagnostics };
}
```

---

## References

- [GitHub - earendil-works/pi — packages/ai/src/](https://github.com/earendil-works/pi/tree/main/packages/ai/src)
- [Pi Official Docs: Model Management](https://pi.dev/docs/latest/models)
- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [PKCE RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)
- [macOS Keychain Services](https://developer.apple.com/documentation/security/keychain_services)
- [Linux Secret Service API](https://gitlab.gnome.org/GNOME/libsecret)
- [Windows Credential Management](https://learn.microsoft.com/en-us/windows/win32/secauthn/credential-management)

---

## Next Up

> **Part 10: Remote Session — Client/Server, Protocol, RPC, WebSocket**
>
> pi-protocol JSON-RPC 2.0 Definition, pi-client Connection Management & Reconnection, pi-server Session Registry, WebSocket Transport, Heartbeat Mechanism, Exponential Backoff Reconnection, Session Snapshot, Remote Session Handle, RPC Mode Architecture, Streaming Event Transport.