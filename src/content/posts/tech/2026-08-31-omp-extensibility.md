---
title: "OMP 內部設計導讀 #10：hooks/skills/MCP/marketplace 四大擴展面"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, oh-my-pi, hooks, skills, mcp, marketplace, extensibility, agent-architecture]
lang: zh-TW
description: "深入剖析 OMP 四大擴展機制：為何 hooks 退居 extension runner 之後、skill frontmatter 的 description 如何決定觸發、MCP server 生命週期與動態工具註冊、marketplace 為何相容 Claude Code 格式。"
tldr: "OMP 將 hooks、skills、MCP、marketplace 整合為統一的擴展面：hooks 併入 extension runner 統一事件匯流排、skills 依 description 進行語意觸發、MCP 採 250ms 快速啟動閘 + deferred fallback、marketplace 採雙 scope 並相容 Claude Code catalog 格式。"
series:
  name: "OMP 內部設計導讀"
  order: 10
---

## TL;DR

OMP 的四大擴展面在 `packages/coding-agent/src/extensibility/` 內實作：

| 擴展面 | 核心機制 | 關鍵設計決策 |
|--------|----------|--------------|
| **hooks** | 併入 `ExtensionRunner`，事件匯流排統一 | `hookCapability` 發現 → 作為 extension module 載入 → `pi.on(...)` 綁定事件 |
| **skills** | `description` 前置欄位決定模型觸發 | 三階段發現（capability → custom dir → managed），`hide` 不影響可用性 |
| **MCP** | 250ms 啟動閘 + `DeferredMCPTool` 非同步補齊 | `MCPManager` 多重 registry 狀態機，自動重連含 circuit breaker |
| **marketplace** | 雙 scope（user/project）+ Claude Code 相容 catalog | `marketplace.json` 在 `.omp-plugin/` 與 `.claude-plugin/` 雙路徑、symlink 進 `node_modules` |

---

## 情境

OMP（oh-my-pi）作為一個 coding agent 執行環境，面臨的擴展性挑戰是：**如何讓使用者、外掛作者、第三方 CLI（Claude/Codex/Gemini/opencode）的擴展機制在同一 runtime 共存，且不互相干擾？**

這導出四個核心擴展面：

1. **hooks** — 事件驅動的運行期攔截（工具調用前/後、session 生命週期）
2. **skills** — 靜態知識包，經由模型語意觸發（`skill://`、`/skill:`）
3. **MCP** — 外部工具伺服器的動態發現、連線、工具註冊
4. **marketplace** — 從 Git/本地/直連 catalog 安裝外掛，支援 user/project 雙 scope

本文依序剖析四者的實作細節與設計取捨。

---

## 問題

### 1. hooks 為何「退到」 extension runner 後面？

早期 OMP 有獨立的 `HookRunner` + `HookToolWrapper`（`packages/coding-agent/src/extensibility/hooks/runner.ts`、`tool-wrapper.ts`）。但現在的啟動流程：

```ts
// src/extensibility/extensions/loader.ts:693-705
if (options.includeAmbientHooks !== false) {
  const hooks = await loadCapability<Hook>(hookCapability.id, loadOptions);
  for (const hookPath of hooks.items
    .map(hook => hook.path)
    .filter(hookPath => isExtensionFile(path.basename(hookPath)))) {
    addPath(hookPath);  // 加入 extensions 載入清單
  }
}
```

`--hook` 參數被視為 `--extension` 別名（`hooks.md:9`），JS/TS hook factories 經由 `hookCapability` 發現後，**作為 extension modules 載入**，其 `pi.on(...)` handlers 綁定到 **同一個 extension runner 的事件匯流排**。

**取捨理由**：
- 統一事件總線，避免 hooks 與 extensions 各自維護 handler registry
- `ExtensionRunner` 提供更完整的 context（`invokeTool`、`setInterval`、`fileWriteFallback` 等）
- hook module 仍保留 factory 簽名（`export default function(pi: HookAPI)`），相容既有寫法

### 2. skill frontmatter 的 `description` 怎麼決定觸發？

`skills.md:65-69` 明確指出：

> `description` is required for:
> - native `.omp` provider skill discovery (`requireDescription: true`)
> - `omp-plugins` extension-package skills and the `github` provider... also pass `requireDescription: true`

在 `skills.ts:18-37`，`Skill` 介面只要求 `name` 與 `path`，**但實際上 `description` 是模型決定是否喚起 skill 的關鍵**：

```ts
// src/extensibility/skills.ts:131-136
// System prompt construction uses discovered skills as follows:
// - if `read` tool is available:
//   - include discovered skills list in prompt, excluding skills with `hide: true`
```

模型在 system prompt 中看到 skill 列表（name + description），語意判斷任務是否需要該 skill，再透過 `read` tool 讀取 `skill://<name>` 內容，或使用者手動輸入 `/skill:<name>`。

**與 Claude Code/Codex 對照**：
- Claude Code 的 `.claude/skills/` 同樣依 `description` 觸發
- Codex 的 `.codex/skills/` 同樣
- 差別在 **provider precedence**：`native` (100) > `omp-plugins` (90) > `claude` (80) > `claude-plugins`/`agents`/`codex` (70) > `opencode` (55) > `github` (30) > `omp-managed` (5) — `skills.md:87-96`

### 3. MCP 為何要 250ms 快速啟動閘 + deferred fallback？

`mcp-runtime-lifecycle.md:105-119`：

```text
connectServers() waits on a race between:
- all connect/tool-load tasks settled, and
- STARTUP_TIMEOUT_MS = 250

After 250ms:
- fulfilled tasks become live MCPTools
- rejected tasks produce per-server errors
- still-pending tasks:
  - use cached tool definitions if available to create DeferredMCPTools
  - otherwise contribute no tools at startup; they stay in flight
```

`MCPManager`（`src/mcp/manager.ts`）維護**七個並行 registry**：

```ts
#connections: Map<string, MCPServerConnection>
#pendingConnections: Map<string, Promise<MCPServerConnection>>
#pendingToolLoads: Map<string, Promise<{ connection, serverTools }>>
#tools: CustomTool[]
#sources: Map<string, SourceMeta>
#pendingReconnections: Map<string, Promise<MCPServerConnection | null>>
#serverConfigs: Map<string, MCPServerConfig>
```

**設計動機**：
- 避免單一慢速 MCP server 卡住整個 agent 啟動（issue #2100）
- `MCPToolCache`（`src/mcp/tool-bridge.ts`）提供工具定義快取，下次啟動直接產出 `DeferredMCPTool`，等連線完成再熱換拔
- 自動重連採 **指數退避**（500/1000/2000/4000ms）+ **circuit breaker**（30 秒內超過 5 次重連暫停自動重連，需手動 `/mcp reconnect` 重置）— `mcp-runtime-lifecycle.md:187`

### 4. marketplace 為何相容 Claude Code 格式？

`marketplace.md:96-97`：

> When omp is the only intended consumer, prefer this path [`.omp-plugin/marketplace.json`]. To remain Claude Code-compatible, publish at `.claude-plugin/marketplace.json` instead — omp uses it as a fallback when `.omp-plugin/marketplace.json` is absent.

**Catalog 格式完全相同**（`marketplace.md:98-120`）：

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "my-marketplace",
  "owner": { "name": "Your Name", "email": "you@example.com" },
  "metadata": { "description": "...", "version": "1.0.0", "pluginRoot": "plugins" },
  "plugins": [{ "name": "my-plugin", "source": "./my-plugin", ... }]
}
```

**Plugin source 支援四種格式**（`marketplace.md:160-207`）：
- 相對路徑 `"./my-plugin"`（monorepo 內）
- GitHub shorthand `{ "source": "github", "repo": "org/repo", "ref": "main" }`
- Git subdir（monorepo 子目錄）
- npm package（目前安裝器拒絕，僅解析）

**安裝機制**（`src/extensibility/plugins/marketplace/manager.ts:241-369`）：
1. 解析 plugin source → 取得本地目錄
2. 版本解析優先序：catalog version > plugin manifest > git SHA > `0.0.0`
3. `cachePlugin` 複製到 `~/.omp/plugins/cache/plugins/<marketplace>___<plugin>___<version>/`
4. **symlink 進 scope 的 `node_modules/<packageName>/`**（`manager.ts:834-837`）
5. 寫入 `omp-plugins.lock.json` 記錄版本與 enabled 狀態

**雙 scope 影子機制**（`marketplace.md:20-25`）：
- project scope 安裝會 **shadow** 同名 user scope（僅當 project 為 enabled 時）
- disabled project install **不** shadow user install

---

## 嘗試過程

### 嘗試 1：hooks 獨立運行 vs 併入 extension runner

早期 `HookRunner.emitToolCall`（`hooks/runner.ts:326-349`）直接攔截工具調用：

```ts
async emitToolCall(event: ToolCallEvent): Promise<ToolCallEventResult | undefined> {
  for (const hook of this.hooks) {
    const handlers = hook.handlers.get("tool_call");
    for (const handler of handlers) {
      const handlerResult = await handler(event, ctx);
      if (handlerResult?.block) return result;  // first block wins
    }
  }
}
```

後來 `ExtensionRunner` 引入 `ExtensionToolWrapper`（`extensions/wrapper.ts`），hook factories 經 `hookCapability` 發現後作為 extension 載入，`pi.on("tool_call", ...)` 綁定到同一事件匯流排。**統一後的好處**：
- extensions 也能註冊 `tool_call` handler，順序由 extension 載入順序決定
- 共享 `ExtensionContext` 的 `invokeTool`、`setTimeout` 等能力
- 移除重複的 `HookToolWrapper` 實作

### 嘗試 2：skill description 可選 vs 必填

`skills.ts:91-118` 的 `loadSkillsFromDir` 強制 `requireDescription: true`。但 `claude`/`codex`/`agents`/`opencode`/`claude-plugins` providers **不強制**（`skills.md:69`）。

**權衡**：
- 必填 → system prompt 技能列表品質高，模型觸發準確
- 可選 → 相容既有第三方 skills（可能缺 description）
- 解法：native/omp-plugins/github 強制，第三方 CLI 寬鬆

### 嘗試 3：MCP 同步啟動 vs 非同步 deferred

最初 `discoverAndLoadMCPTools` 等待所有 server 連線完成。但某些 HTTP/SSE server 延遲高，導致啟動卡 10 秒以上。

**演進**：
1. 加入 250ms timeout
2. 引入 `MMPToolCache` 本地快取工具定義
3. `DeferredMCPTool`：先回傳 stub，呼叫時 `waitForConnection()` 再補齊
4. 背景續跑：連線完成後 `#onToolsChanged` 觸發 `session.refreshMCPTools` 熱換拔

### 嘗試 4：marketplace 獨立格式 vs 相容 Claude Code

若 OMP 定義獨立 `marketplace.json` schema，外掛作者需維護雙份 catalog。採用 **同一份 JSON、雙路徑讀取**：

```ts
// src/extensibility/plugins/marketplace/fetcher.ts (推測邏輯)
// 先找 .omp-plugin/marketplace.json，找不到再找 .claude-plugin/marketplace.json
```

這讓外掛作者 **單一來源發布**，OMP 與 Claude Code 皆可消費。

---

## 解法

### 統一擴展載入管線：`discoverExtensionPaths` → `loadExtensions` → `ExtensionRunner`

```ts
// src/extensibility/extensions/loader.ts:648-746
export async function discoverExtensionPaths(
  configuredPaths: string[],
  cwd: string,
  disabledExtensionIds?: string[],
  options: DiscoverExtensionPathOptions = {},
): Promise<string[]> {
  // 1. native extension modules (.omp/.pi)
  // 2. JS/TS hook factories via hookCapability
  // 3. installed plugin extension entry points (symlinked in node_modules)
  // 4. explicit configured paths
}
```

**載入順序決定優先級**：後載入的 extension 在命令、工具、flags、shortcuts 上 **last-wins**（`extensions/runner.ts:901-907`、`getCommand` 反向迭代）。

### Hook module 仍保留獨立 API 介面

```ts
// src/extensibility/hooks/types.ts:476-588
export interface HookAPI {
  on(event: "tool_call", handler: HookHandler<ToolCallEvent, ToolCallEventResult>): void;
  on(event: "tool_result", handler: HookHandler<ToolResultEvent, ToolResultEventResult>): void;
  sendMessage(...): void;
  appendEntry(...): void;
  registerCommand(...): void;
  exec(...): Promise<ExecResult>;
  logger, typebox, arktype, zod, pi: typeof PiCodingAgent
}
```

`HookAPI` 故意**比 `ExtensionAPI` 窄**（`types.ts:56-59`、`168-172`）：
- 無 `setModel`、`setActiveTools`、`registerProvider` 等會 deadlock agent loop 的方法
- UI context 只有 `select`/`confirm`/`input`/`notify`/`setStatus`/`custom`/`editor`，無 `onTerminalInput`/`setEditorComponent`

### Skill 發現三階段 + 實時去重

```ts
// src/extensibility/skills.ts:135-412
// Pass 1: capability providers (priority sorted, dedup by name)
// Pass 2: custom directories (override same-named default provider skills)
// Pass 3: managed (auto-learn) skills (dead-last, defer to any authored skill)
```

**實時去重**：
- `realPathSet` 以 `fs.realpath` 去重（symlink-safe）
- `seenAuthoredSkillNames` 同名第一勝
- custom dir 技能可覆蓋 default-path provider 技能（issue #7190）

### MCP Manager 狀態機 + 背景補齊

```ts
// src/mcp/manager.ts (核心狀態)
// getConnectionStatus(name) derives:
// - "connected" if in #connections
// - "connecting" if pending connect/tool-load/reconnect
// - "disconnected" otherwise
```

**關鍵非同步路徑**：
- `session.refreshMCPTools()` 移除所有 `mcp__` tools → 重新 wrap 最新 MCP tools → 重新激活（`mcp-runtime-lifecycle.md:166`）
- `/mcp reload`：`disconnectAll()` → `discoverAndConnect()` → `refreshMCPTools()`
- 通知橋接：`MCPManager.addNotificationListener` → `sdk.ts` 註冊 listener → `ExtensionRunner.emitMcpNotification`（`mcp-runtime-lifecycle.md:179`）

### Marketplace 安裝 = cache + symlink + lock file

```ts
// src/extensibility/plugins/marketplace/manager.ts:306-363
const cachePath = await cachePlugin(sourcePath, pluginsCacheDir, marketplace, name, version);
// symlink into node_modules
await fs.symlink(cachePath, linkPath, process.platform === "win32" ? "junction" : "dir");
// write omp-plugins.lock.json
config.plugins[packageName] = { version, enabledFeatures: null, enabled: true };
```

**Claude Code 相容**：
- `InstalledPluginsRegistry.version = 2`（數字而非字串，`types.ts:160`）
- `parseClaudePluginsRegistry()` 驗證通過
- 雙方共用 `~/.omp/plugins/installed_plugins.json`（user）與 `<project>/.omp/plugins/installed_plugins.json`（project）

---

## 為什麼會這樣

| 設計決策 | 背後動機 |
|-----------|----------|
| hooks 併入 extension runner | 消除雙重事件匯流排、共享完整 ExtensionContext、減少維護面 |
| skill `description` 必填（native/omp-plugins） | 確保 system prompt 技能列表可被模型語意匹配，提升觸發精度 |
| MCP 250ms 啟動閘 + deferred | 避免慢 server 卡啟動，快取工具定義實現「即開即用」 |
| MCP circuit breaker (5/30s) | 防止連線抖動導致的重連風暴拖垮 session |
| marketplace 雙路徑 catalog (`.omp-plugin/` + `.claude-plugin/`) | 外掛作者單一發布，OMP 與 Claude Code 雙邊消費 |
| 雙 scope + project shadow user | 專案級覆蓋滿足團隊共享，user 級保留個人偏好，disabled 不 shadow 避免誤判 |
| symlink 進 `node_modules` | 讓現有 extension loader（`getAllPluginExtensionPaths`）無感載入 marketplace plugins |

---

## 學到的事

1. **統一事件匯流排勝過獨立子系統**：hooks 併入 extension runner 後，工具攔截、session 事件、MCP 通知都走同一條 `ExtensionRunner.emit()`，順序由載入順序決定，消除「誰先攔截」的歧義。

2. **前置欄位即契約**：skill 的 `description` 不只是文檔，它是 **模型觸發的語意契約**。寫不好 description = skill 永遠不會被喚起。

3. **快取優先、背景補齊**：MCP 的 `DeferredMCPTool` 模式適用於任何「外部依賴啟動慢、但介面定義固定」的場景——先給 stub，再熱換拔。

4. **相容勝過重造**：marketplace 直接採用 Claude Code 的 catalog schema 與 installed registry 格式，外掛生態即刻互通，避免雞生蛋蛋生雞的冷啟動問題。

5. **Scope 影子規則要有「開關」**：project scope 只有在 `enabled !== false` 時才 shadow user scope，否則 user 端設定會「莫名其妙失效」，這是常見坑。

---

## 參考資料

- [OMP hooks 文件](https://github.com/can1357/oh-my-pi/blob/main/docs/hooks.md) — hook subsystem 架構、事件類型、執行模型
- [OMP skills 文件](https://github.com/can1357/oh-my-pi/blob/main/docs/skills.md) — skill 發現管線、provider precedence、system prompt 整合
- [OMP MCP runtime lifecycle](https://github.com/can1357/oh-my-pi/blob/main/docs/mcp-runtime-lifecycle.md) — MCP manager 狀態機、啟動閘、重連機制
- [OMP marketplace 文件](https://github.com/can1357/oh-my-pi/blob/main/docs/marketplace.md) — catalog 格式、安裝機制、雙 scope、Claude Code 相容
- [extensions/loader.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/extensions/loader.ts#L648) — `discoverExtensionPaths` 統一發現邏輯
- [hooks/types.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/hooks/types.ts#L476) — `HookAPI` 介面定義
- [skills.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/skills.ts#L135) — `loadSkills` 三階段發現
- [mcp/manager.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/mcp/manager.ts) — `MCPManager` 七大 registry 狀態機
- [plugins/marketplace/manager.ts](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/extensibility/plugins/marketplace/manager.ts#L241) — `installPlugin` cache+symlink+lock 流程