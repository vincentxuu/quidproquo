# Admin v2 — Phase 6 實作計畫：Extensions

狀態：草稿（2026-08-29）。前置：Phase 2（Session 引擎）、Phase 5（Cloudflare Sandbox）。
Spec 參考：`docs/admin-v2-spec.md` §3.1 工具三層、§7 Settings › Extensions。

## 1. 目標

讓 Session 內的 agent 能使用任意 MCP Server 的工具，並在 Settings › Extensions 統一管理 Skills、MCP Servers、Plugins、Marketplace。

---

## 2. 現有基礎

### 已有（Phase 1 搬遷後的位置）

| 元件 | 位置 | 狀態 |
|---|---|---|
| Skills CRUD | `src/lib/extensions/manager.ts` | 完整：list/get/create/update/delete/import/export |
| MCP Servers CRUD | `src/lib/extensions/mcp-servers-manager.ts` | 完整：list/create/update/delete/toggle |
| Plugins CRUD | `src/lib/extensions/plugins-manager.ts` | 完整：list/install/update/uninstall |
| D1 Tables | `migrations/0024_agent_skills.sql` | `user_skills`、`mcp_servers`、`plugins` |
| API | `src/pages/api/admin/settings/extensions/{skills,mcp-servers,plugins}/*` | CRUD 已搬遷 |
| UI 骨架 | `src/pages/admin/settings/extensions/{index,skills,mcp-servers,plugins,marketplace}.astro` | 空殼 |
| 手寫工具 | `src/lib/tool-registry/definitions/` | 14 支 syscall（knowledge-notion、action-slack 等） |

### 缺少

| 缺口 | 說明 |
|---|---|
| **MCP 代理層** | 容器內 agent 無法呼叫外部 MCP Server；需要 Workers 作為代理 |
| **工具級權限** | `mcp_servers.tools` 欄位存 JSON 但沒有 per-tool allow/ask/deny 機制 |
| **預設工具集** | spec 說 Settings 有預設工具集，Routine 必勾選，Session 可調——沒有此概念 |
| **Marketplace** | 沒有 GitHub repo 安裝流程 |
| **手寫工具 → MCP 遷移** | 14 支 syscall 仍是手寫的，需逐步改走 MCP |

---

## 3. MCP 代理架構

Spec §3.1 定義的 MCP 層：容器內 agent 經 per-session 端點呼叫 Workers，Workers 轉發到實際 MCP Server。

```
容器（agent loop）
  │  tool_use: mcp__notion__search
  │
  ▼  POST /api/admin/sessions/:id/mcp-call
Workers（MCP 代理）
  │  1. 查 session 的 tool permission → allow/ask/deny
  │  2. ask → 送 control_request 事件，等 control_response
  │  3. 查 mcp_servers 表找到 server config
  │  4. Workers 作為 MCP client 呼叫目標 server
  │  5. 回傳 tool result 到容器
  ▼
MCP Server（Notion、GitHub、Slack…）
```

### 關鍵設計

| 項目 | 決策 |
|---|---|
| 傳輸 | Workers → MCP Server：HTTP（Streamable HTTP Transport）為主；stdio 型用 Cloudflare Container 啟動 sidecar |
| 憑證 | MCP Server 需要的 API key 由 Workers 側注入（同 spec §6 Outbound Worker 模式），容器不碰 |
| 工具發現 | Session 啟動時，Workers 對每個 enabled MCP Server 送 `tools/list`，彙整後傳給容器的 agent |
| 連線池 | Workers 端維護 per-server 連線，跨 session 共享（同一個 MCP Server 不重複建連） |
| 超時 | per-tool call 30s 超時；MCP Server 不回應則回 tool error |

### 新檔案

```
src/lib/mcp-proxy/
├── client.ts          # MCP client：connect、tools/list、tools/call
├── registry.ts        # 從 D1 mcp_servers 表載入 enabled servers，cache tool list
├── dispatcher.ts      # 收到 tool_use → 辨識 mcp__ prefix → 找 server → call
├── permission.ts      # per-tool permission check（allow/ask/deny）
└── types.ts           # McpToolCall、McpToolResult 等型別
```

### 新 API

```
POST /api/admin/sessions/:id/mcp-call
  Body: { server: string, tool: string, input: object }
  Returns: { result: object } | { error: string }
  Auth: session token（容器到 Workers 的內部 auth）
```

---

## 4. 工具級權限

### Schema 變更

`mcp_servers` 表新增欄位（migration）：

```sql
ALTER TABLE mcp_servers ADD COLUMN tool_permissions TEXT;
-- JSON: { "tool_name": "always_allow" | "always_ask" | "always_deny" }
-- null = 全部 always_allow（手動 Session 預設全開）
```

新增 `default_toolset` 表：

```sql
CREATE TABLE IF NOT EXISTS default_toolset (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,           -- toolset 名稱（e.g. 'default', 'routine-safe'）
  description TEXT,
  server_ids TEXT NOT NULL,            -- enabled server ids JSON array
  tool_overrides TEXT,                 -- per-tool permission overrides JSON
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

### 權限流程

1. Session 啟動時，決定使用哪個 toolset（手動 Session = 全開 or 自選；Routine = 必指定）
2. agent 呼叫工具時，dispatcher 查 toolset → server 的 tool_permissions
3. `always_allow`：直接執行
4. `always_ask`：送 `control_request/can_use_tool` 事件，等使用者 approve/deny
5. `always_deny`：回 tool error

---

## 5. Marketplace

### 流程

```
GitHub repo URL（用戶輸入 or 從來源清單選）
  → Workers fetch repo 的 manifest.json（根目錄）
  → 解析：skills[]、mcp_servers[]、metadata
  → 顯示安裝預覽（什麼 skill、什麼 MCP server、需要什麼權限）
  → 用戶確認 → 寫入 plugins 表 + 展開 skills/mcp_servers 到各自表
```

### manifest.json 格式

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "author": "someone",
  "description": "...",
  "skills": [
    { "name": "...", "file": "skills/my-skill.md" }
  ],
  "mcp_servers": [
    { "name": "...", "type": "http", "url": "https://..." }
  ]
}
```

### Schema 變更

`plugins` 表新增欄位：

```sql
ALTER TABLE plugins ADD COLUMN manifest_url TEXT;
ALTER TABLE plugins ADD COLUMN last_checked_at INTEGER;
ALTER TABLE plugins ADD COLUMN update_available INTEGER DEFAULT 0;
```

### 來源清單

Settings › Extensions › Marketplace 頁面維護一份 `marketplace_sources` D1 表：

```sql
CREATE TABLE IF NOT EXISTS marketplace_sources (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,            -- GitHub repo URL
  name TEXT,                           -- 顯示名稱
  description TEXT,
  last_fetched_at INTEGER,
  created_at INTEGER NOT NULL
);
```

### 新檔案

```
src/lib/marketplace/
├── fetcher.ts         # fetch GitHub repo manifest.json
├── installer.ts       # 解析 manifest → 寫入 plugins + skills + mcp_servers
├── updater.ts         # 檢查版本更新
└── types.ts           # PluginManifest 型別
```

---

## 6. Skills 完善

### 現有能力

Skills CRUD 已完整（`extensions/manager.ts`），Phase 6 需要補：

| 功能 | 說明 |
|---|---|
| **專案 Git 匯入** | 從指定 Git repo 的 `.agents/skills/` 或 `.claude/skills/` 匯入 |
| **版本追蹤** | `user_skills.version` 已有欄位，需 UI 展示 diff |
| **Skills 搜尋** | 已有 name index，前端加搜尋框 |

### Schema

不需要新表，現有 `user_skills` 已足夠。

---

## 7. UI 完善（Settings › Extensions）

### Skills tab

替換空殼為完整 CRUD UI（原 `agent-ecosystem` 的 Skills tab 搬過來）：
- 列表（搜尋 + 篩選 source）
- 建立 / 編輯（name、description、content textarea）
- 匯入 / 匯出（JSON）
- 從 Git 匯入

### MCP Servers tab

替換空殼：
- 列表（name、type、enabled toggle、工具數）
- 新增（name、type、command/url、env vars）
- 工具級權限管理（展開 server → 每個 tool 的 allow/ask/deny dropdown）
- 連線測試（ping → tools/list）

### Plugins tab

替換空殼：
- 已安裝列表（name、version、author、source）
- 解除安裝
- 檢查更新

### Marketplace tab

替換空殼：
- 來源清單管理（add/remove GitHub repo URL）
- 瀏覽可安裝 plugin（從來源 fetch manifest）
- 安裝預覽 + 確認
- 更新通知

---

## 8. 手寫工具 → MCP 遷移

14 支手寫 syscall 需逐步遷移為 MCP Server。分批：

| 批次 | 工具 | MCP Server |
|---|---|---|
| 1 | knowledge-notion、action-notion-page | Notion MCP（已有社群版） |
| 2 | action-slack-message | Slack MCP |
| 3 | action-github-issue、action-github-comment | GitHub MCP |
| 4 | knowledge-sql、knowledge-drive、knowledge-github | 各自 MCP |
| 5 | external-search、read-url | 保留為 Web 層（spec §3.1 Web 工具不走 MCP） |
| 6 | model-invoke、skill-read、get-post-detail | 內部工具，保留為沙箱內建 |

遷移策略：
1. 在 `mcp_servers` 表註冊對應的社群 MCP Server
2. agent loop 的 tool dispatch 先查 MCP 表，有則走代理，無則走舊 syscall
3. 確認 MCP 版功能對齊後，刪除舊 syscall

---

## 9. 新檔案總表

| # | 路徑 | 說明 |
|---|---|---|
| 1 | `src/lib/mcp-proxy/client.ts` | MCP client（connect、tools/list、tools/call） |
| 2 | `src/lib/mcp-proxy/registry.ts` | Server registry + tool cache |
| 3 | `src/lib/mcp-proxy/dispatcher.ts` | Tool dispatch（mcp__ prefix → proxy call） |
| 4 | `src/lib/mcp-proxy/permission.ts` | Per-tool permission check |
| 5 | `src/lib/mcp-proxy/types.ts` | 型別 |
| 6 | `src/lib/marketplace/fetcher.ts` | GitHub manifest fetcher |
| 7 | `src/lib/marketplace/installer.ts` | Plugin 安裝器 |
| 8 | `src/lib/marketplace/updater.ts` | 版本更新檢查 |
| 9 | `src/lib/marketplace/types.ts` | 型別 |
| 10 | `src/pages/api/admin/sessions/[id]/mcp-call.ts` | MCP proxy API |
| 11 | `migrations/XXXX_mcp_tool_permissions.sql` | tool_permissions + default_toolset + marketplace_sources |

### 修改檔案

| # | 路徑 | 變更 |
|---|---|---|
| 1 | `src/pages/admin/settings/extensions/skills.astro` | 空殼 → 完整 CRUD UI |
| 2 | `src/pages/admin/settings/extensions/mcp-servers.astro` | 空殼 → 完整管理 + 權限 UI |
| 3 | `src/pages/admin/settings/extensions/plugins.astro` | 空殼 → 已安裝列表 + 解除安裝 |
| 4 | `src/pages/admin/settings/extensions/marketplace.astro` | 空殼 → 來源管理 + 安裝流程 |
| 5 | `src/lib/agent/kernel.ts` | tool dispatch 加 MCP 代理分支 |
| 6 | `src/lib/extensions/mcp-servers-manager.ts` | 加 tool_permissions 欄位操作 |
| 7 | `src/lib/extensions/plugins-manager.ts` | 加 manifest_url、update_available 欄位 |

---

## 10. 實作順序

1. **MCP client**：寫 `mcp-proxy/client.ts`，能對一個 HTTP MCP Server 做 `tools/list` 和 `tools/call`
2. **Registry + dispatcher**：從 D1 載入 servers，dispatch tool calls
3. **Session API**：`sessions/:id/mcp-call` 端點
4. **Kernel 整合**：agent loop 的 tool_use → dispatcher
5. **權限**：tool_permissions 欄位 + permission check
6. **MCP Servers UI**：管理 + 權限 + 連線測試
7. **Skills UI**：搬遷 agent-ecosystem 的 Skills tab 完整功能
8. **Marketplace fetcher**：fetch GitHub manifest
9. **Marketplace installer**：安裝 + 解除安裝
10. **Marketplace UI**
11. **手寫工具遷移**（漸進，跨多個 sprint）

---

## 11. 風險評估

| 風險 | 嚴重度 | 緩解 |
|---|---|---|
| MCP Server 不穩定導致 agent 卡住 | 中 | 30s 超時 + fallback to tool error |
| stdio MCP Server 需要容器 sidecar | 高 | Phase 6 先只支援 HTTP/SSE；stdio 等 Sandbox 穩定後做 |
| Marketplace manifest 被注入惡意內容 | 中 | manifest 只讀 metadata + URL，不執行代碼；MCP Server URL 需使用者確認 |
| 手寫工具遷移期間功能迴歸 | 中 | 雙軌：MCP 和 syscall 並存，確認對齊後才刪舊版 |
| tool_permissions 頻繁查 D1 | 低 | Session 啟動時一次載入到 memory，不逐 call 查 |

---

## 12. 開放問題

1. **stdio MCP Server 支援**：需要在 Cloudflare Container 裡啟動 sidecar process，Phase 5 Sandbox 穩定前做不了。Phase 6 要先只做 HTTP/SSE 嗎？
2. **MCP 連線認證**：社群 MCP Server 的認證方式各異（API key、OAuth），是否需要通用的 credential provider？
3. **工具命名衝突**：兩個 MCP Server 都提供同名工具怎麼辦？建議用 `mcp__<server>__<tool>` 命名空間。
4. **Marketplace 來源清單初始值**：要預載哪些 GitHub repo？Anthropic 官方 MCP servers repo？
5. **手寫工具遷移優先級**：先遷哪批？建議先遷 Notion（用量最高），還是先遷 GitHub（最多社群 MCP 支援）？
