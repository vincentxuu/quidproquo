# MCP Apps 互動卡片規劃

> 狀態：規劃中（2026-10-20）｜新依賴、wrangler 變更、deploy 都是 Tier 2，實作前逐項取得同意

## 一句話

把文章搜尋、系列導覽、名詞解釋做成 **MCP Apps 互動卡片**（SEP-1865）。別人在 Claude、ChatGPT、VS Code 裡問技術問題時，對話中直接出現 quidproquo 的文章卡，可以篩分類、看系列順序、點進原文。先做對外的唯讀 MCP server，再評估站內 Ask AI 要不要也顯示這些卡片。

## 為什麼做

- **新的導流入口**：Claude（web／Desktop／iOS）、ChatGPT、VS Code Copilot 都已支援 MCP Apps（[官方支援表](https://modelcontextprotocol.io/extensions/apps/overview)）。讀者不用先來站上搜尋，在自己慣用的 AI 裡就能找到文章。
- **內容本來就結構化**：frontmatter 已有 `tldr`、`series`、`type`、`difficulty`、`glossary`、`faq`，做成卡片幾乎不用另外整理資料。
- **省 token**：卡片 HTML 是固定模板，模型只產生工具參數；讀者在卡上切分類、翻頁時，卡片直接呼叫工具，不經過模型。

## MCP Apps 怎麼運作

```
讀者問「有沒有講 Cloudflare D1 的實作文章？」
  → 模型呼叫工具 search_posts(query="Cloudflare D1")
  → MCP server 回傳：
      content           純文字摘要（標題＋網址，給模型讀，也是不支援卡片時的備援）
      structuredContent 文章清單 JSON（給卡片用）
      工具定義的 _meta.ui.resourceUri = "ui://quidproquo/post-results"
  → 對話產品（host）讀 ui:// 資源拿到卡片 HTML，放進沙箱 iframe，把資料傳進去
  → 讀者在卡上點「只看 deep-dive」「下一頁」
  → 卡片透過 host 呼叫 search_posts_page（只給卡片用的工具），更新畫面
  → 點文章 → openLink 開 quidproquo.cc 原文
```

官方 SDK 與規格重點（2026-10-20 查證）：

| 項目 | 內容 | 來源 |
|---|---|---|
| SDK | `@modelcontextprotocol/ext-apps` 2.0.3；server 端需 `@modelcontextprotocol/server` v2（不是舊的 `@modelcontextprotocol/sdk`）、`zod ^4.2` | [npm](https://registry.npmjs.org/@modelcontextprotocol/ext-apps)、[repo](https://github.com/modelcontextprotocol/ext-apps) |
| Server API | `registerAppTool(server, name, config, cb)`、`registerAppResource(server, name, uri, config, read)`、`RESOURCE_MIME_TYPE = "text/html;profile=mcp-app"` | [API 文件](https://apps.extensions.modelcontextprotocol.io/api/modules/server-helpers.html) |
| 卡片端 API | `new App(...)`；先設 `ontoolresult` 等 handler 再 `connect()`；`callServerTool`、`openLink`、`sendMessage`、`updateModelContext` | 同上 |
| 只給卡片用的工具 | 工具 `_meta.ui.visibility: ["app"]`：模型看不到，卡片可以呼叫 | [規格](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) |
| CSP | 資源 `contents[]._meta.ui.csp`：`connectDomains`、`resourceDomains`；沒宣告的網域一律擋 | 同上 |
| Cloudflare 部署 | `createMcpHandler`（`agents/mcp/server`）無狀態、不需 Durable Object；`McpAgent` 已 deprecated | [Cloudflare 文件](https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/) |
| Claude 接入 | Streamable HTTP；**允許免登入（authless）**；server 要能從 Anthropic IP 連到 | [Claude 文件](https://claude.com/docs/connectors/building/authentication) |

## 現況（2026-10-20 盤點）

| 面向 | 現況 | 位置 |
|---|---|---|
| MCP server | **沒有**。沒有任何 `@modelcontextprotocol/*` 依賴，也沒有處理 MCP 請求的端點 | `package.json` |
| 搜尋 | `GET /api/search`：`q`、`mode=keyword\|hybrid\|rag`、`lang`、`limit`（1–50）、`offset`；hybrid／rag 依 IP 每日限流，keyword 不限 | `src/pages/api/search.ts:86-145,407-416` |
| 相關文章 | `GET /api/related-posts?slug=&limit=`：Vectorize、同語言、快取 1 小時 | `src/pages/api/related-posts.ts:9-97` |
| 文章清單 | `GET /api/posts?category=&lang=`：含 `tldr`、`tags`、`description`，無分頁 | `src/pages/api/posts.ts:36` |
| 名詞解釋 | `POST /api/glossary/explain`：會呼叫 AI，**無登入、無限流**；有本機 fallback | `src/pages/api/glossary/explain.ts:34-41,158`、`src/lib/glossary/terms.ts` |
| 可用欄位 | `title`、`date`、`category`、`tags`、`lang`、`description`、`tldr`、`type`、`difficulty`、`readingTime`、`faq`、`glossary[]`、`series{name,order}`、`additionalSeries` | `src/content.config.ts:25-64` |
| 現有 MCP client | 只在 admin Agent Console 用；手寫 JSON-RPC，只有 `tools/list`、`tools/call`；沒送 `initialize`、不處理 `Mcp-Session-Id` 與 SSE；丟掉 `_meta`、`structuredContent`；沒有 `resources/read` | `src/lib/mcp-proxy/client.ts:10-54`、`types.ts:1-17`、`src/server/agents/session-do.ts:654-856` |
| 公開 Ask AI | `/api/chat` RAG pipeline **不走 MCP**；SSE 事件 token／step／sources／related／done／error；訊息模型沒有通用 parts | `src/pages/api/chat.ts:78-433`、`src/components/Chat/ChatWidget.tsx:234-320`、`src/components/Chat/types.ts:39-49` |
| 安全標頭 | **全站沒有 CSP、`X-Frame-Options`、`frame-ancestors`**；`src/worker.ts` 只是 23 行 passthrough | `public/_headers`、`src/worker.ts` |

結論：**對外 server（階段 1）不用動現有 chat 與 admin console**，可以獨立做。站內顯示自家卡片只要加 SSE 事件與元件；只有要顯示**第三方** MCP server 的卡片時，才需要改 client、引入 iframe 沙箱與 CSP。

## 卡片元件架構：schema 先行，一份元件兩種輸出

一個工具結果有三種去處：給模型讀的純文字、站內 Ask AI 的卡片、外部 AI 的 MCP App 卡片。三者共用**同一份資料格式**，畫面只寫一次 React 元件，不為了共用而在站內也走 iframe。

```
src/cards/
  schemas.ts               ← zod schema：每張卡的工具結果格式（唯一正本）
  PostResultsCard.tsx      ← 純展示 React 元件，只吃符合 schema 的 props
  SeriesCard.tsx
  TermCard.tsx
  cards.css                ← 卡片自帶、編譯好的樣式
  mcp-app/*.tsx            ← 薄包裝：ext-apps 的 React 入口接資料 → 對應元件
src/lib/mcp-server/        ← 階段 1：工具回傳 schema 資料，資源回傳打包好的單一 HTML
```

| 用在哪 | 怎麼畫 |
|---|---|
| 外部 AI（Claude、ChatGPT） | `src/cards/mcp-app/*` 用 Vite 打成單一 HTML 檔，當成 `ui://` 資源 |
| 站內 Ask AI（階段 2a） | 依卡片名稱對應元件，直接 import，不經過 iframe |
| 不支援卡片的地方 | 工具的 `content` 純文字摘要 |

為什麼這樣做：

- **主流框架對自家工具介面都是這樣處理**：AI SDK 的 generative UI 依工具 part 畫 React 元件；assistant-ui 用 `makeAssistantToolUI` 依工具名稱註冊元件。本 repo 都已安裝（`ai`、`@assistant-ui/react`）。沙箱 iframe 是給不可信的第三方程式碼用的，自家元件不需要。
- **官方 SDK 支援 React 包裝**：`@modelcontextprotocol/ext-apps` 有 `./react` 匯出，同一個元件可以包成 MCP App，不用另寫一份 HTML。
- **只有 schema 是正本**：MCP server、站內元件、MCP App 包裝都對同一份 schema 驗證，改欄位時三處一起報型別錯誤。

元件規則：

1. **純展示**：只吃 props，不直接打 API。互動（篩分類、翻頁、切語言）透過 `onAction` 回呼往外丟。站內版本接 `/api/search`，MCP App 版本接 `app.callServerTool`。
2. **樣式自帶**：iframe 讀不到站上的全域樣式。卡片用自己的 `cards.css`，站內與 iframe 才會長得一樣。
3. **純文字摘要必備**：沒有卡片時資訊也要完整（標題＋網址）。
4. **不轉載全文**：卡片只放 tldr 與摘要，「閱讀全文」一律連回站上。
5. **開關**：站內卡片與 MCP server 各自一個 feature flag（`CLAUDE.md` 規定 AI 功能都要可單獨關閉）。

## 階段 1：公開唯讀 MCP server（建議先做）

### 部署形態

**建議：在 `src/worker.ts` 攔截 `/mcp`，交給 `createMcpHandler`，其他路徑照舊交給 Astro。**

| 選項 | 優點 | 缺點 |
|---|---|---|
| **同一個 Worker，`src/worker.ts` 攔 `/mcp`（建議）** | 直接用既有 D1、Vectorize、KV binding；不用新 wrangler 設定；`worker.ts` 本來就是薄層 | MCP 依賴進主站 bundle（zod 已是 4.3.6，符合 ext-apps 的 ^4.2） |
| 獨立 Worker | 依賴隔離、可獨立部署 | binding 要重設一份；搜尋邏輯要嘛複製、要嘛打 HTTP |

- 依 `CLAUDE.md` 規則，AI 功能都要有開關：新增 `MCP_SERVER_ENABLED`（`wrangler.jsonc` 的 `vars`），關閉時 `/mcp` 回 404。
- 搜尋直接呼叫 `src/lib/` 的既有函式，不透過 HTTP 打自己。
- 卡片 HTML：`src/cards/mcp-app/*` 用 Vite 打成單一 HTML 檔（JS／CSS inline），build 時產出成字串模組，`registerAppResource` 的 read callback 直接回傳。

### 工具與卡片

| 工具 | 給誰用 | 輸入 | 對應既有邏輯 | 卡片 |
|---|---|---|---|---|
| `search_posts` | 模型＋卡片 | `query`、`lang?`、`type?`、`difficulty?` | `/api/search` 的 **keyword** 模式（不耗 AI 額度）；結果不足再考慮 hybrid | **文章結果卡**：標題、tldr、分類、標籤、難度、閱讀時間，點了開原文 |
| `search_posts_page` | **只給卡片**（`visibility: ["app"]`） | 同上＋`offset`、`category?` | 同上 | 結果卡內的篩選與翻頁 |
| `get_series` | 模型＋卡片 | `series` 名稱或任一篇 `slug` | content collection 的 `series` / `additionalSeries` | **系列導覽卡**：依 `order` 排出閱讀路徑，標出目前這篇 |
| `get_post_brief` | 模型＋卡片 | `slug` | 文章 frontmatter＋`related-posts` | **文章摘要卡**：tldr、FAQ 摘要、相關文章 |
| `explain_term` | 模型＋卡片 | `term`、`level?` | **只用本機 glossary**（`src/lib/glossary/terms.ts` 與文章 `glossary[]`），不呼叫 AI | **名詞卡**：定義、進階說明、延伸閱讀 |

設計原則：

- 每個工具的 `content` 都要有完整的純文字摘要（標題＋網址），不支援卡片的 host 也能用。
- 引用要清楚：每筆結果附原文網址與發布日期；卡片上的「閱讀全文」一律 `openLink` 回站上，不在卡片裡轉載全文。
- 中英雙語：`lang` 預設依查詢語言判斷，英文結果連 `/en/...`。
- CSP：卡片資料都從工具結果來，不需要 `connectDomains`；若卡片要顯示 OG 圖或 R2 圖片，把對應網域加進 `resourceDomains`。

### 防濫用

- 免登入公開 server。依 IP 每日限流，沿用既有 `RATE` KV 與 `checkAndIncrementRateLimit` 的做法，額度另開一個設定值。
- `explain_term` 不走 AI 是刻意的：現有 `/api/glossary/explain` 沒有限流，不能直接對外放大。
- 階段 1 不開放 hybrid／rag 模式；要開的話共用既有每日限額。

### 驗收

1. 本機 `pnpm dev` 後用 MCPJam 或 ext-apps repo 的範例 host 連本機 dev server 的 `/mcp`：工具都列得出來，卡片顯示得出來，篩選與翻頁不經過模型。
2. 部署 `quidproquo-preview` 後在 Claude 加成自訂 connector（authless）：問「有沒有講 Cloudflare D1 的文章」會出現結果卡，點文章開對網址；Claude iOS 也正常。
3. 不支援卡片的 host：純文字摘要完整、網址可點。
4. `MCP_SERVER_ENABLED=false` 時 `/mcp` 回 404，站上其他功能不受影響。
5. `pnpm verify` 全綠。

### 待查（實作前先確認）

- ext-apps 的 `registerAppTool` 掛在 `createMcpHandler` 工廠產生的 `McpServer` 上能不能正常運作：型別上相容（都用 `@modelcontextprotocol/server` v2），但還沒實測。版本對齊 `agents` 內建的 `@modelcontextprotocol/server` 2.3.1。
- 在 Astro 的 Cloudflare adapter 下，`src/worker.ts` 先攔 `/mcp` 再交給 Astro 的寫法是否會影響 Astro 的 middleware 與 session。
- 無狀態模式下 `getUiCapability` 拿不拿得到 client 能力：保險做法是**一律註冊卡片工具**，靠 `content` 純文字當備援。

## 階段 2：站內顯示卡片（先決定要不要做）

分成兩件事，難度差很多：

**2a. 站內 Ask AI 顯示自家卡片（建議做）**：沿用上面的「卡片元件架構」。

- `/api/chat` 新增 SSE 事件 `card`（`{card, data}`，`data` 符合 schema）；`src/components/Chat/types.ts` 的 `Message` 加 `cards` 欄位；`ChatWidget.tsx` 的事件解析多接一種。
- `src/components/Chat/ChatMessageRow.tsx:46-48` 在 Markdown 下方依卡片名稱渲染元件。
- 第一步可以不新增工具：把現有的 `sources`、`related` 事件資料直接改用 `PostResultsCard` 呈現。
- 不需要沙箱、不需要改 MCP client。

**2b. 顯示第三方 MCP server 的卡片（有需要才做）**：admin Agent Console 已能接外部 MCP server，且 assistant-ui 已有 tool-call parts（`src/lib/admin/session-thread-adapter.ts:174`、`src/components/assistant-ui/thread.tsx:46`），是最適合先試的地方。建議**先做 admin console，再考慮公開 Ask AI**：

| 層 | 要改什麼 |
|---|---|
| MCP client | 送 `initialize` 並宣告 `capabilities.extensions["io.modelcontextprotocol/ui"] = { mimeTypes: ["text/html;profile=mcp-app"] }`、送 `notifications/initialized`、保存 `Mcp-Session-Id`、處理 SSE；保留 `_meta`、`structuredContent`；新增 `resources/read`。建議直接換成官方 `@modelcontextprotocol/client` v2 |
| 資料 | `mcp_servers` 的 `tools` JSON 要保留每個工具的 `_meta`（是否需要 migration 視儲存方式而定，屬 Tier 2） |
| 串流 | 新 SSE 事件 `ui_resource`（tool、resource_uri、html、structured_content）；對話紀錄也要存，重新整理後卡片還在 |
| 前端 | 依規格用**雙層 iframe**：外層 sandbox proxy 放在**不同網域**（例如 `sandbox.quidproquo.cc`），內層套 CSP。全站目前沒有任何 CSP，這是新的安全面，要一起補 `frame-ancestors` 等標頭 |
| 卡片發起的工具呼叫 | 新路由驗證：admin session、server 有啟用、工具在 `tool_permissions` 允許清單、工具 `visibility` 含 `app`，才轉送；沿用 `mcp-proxy/dispatcher.ts` 的權限判斷 |

## 不做

- 不在卡片裡轉載全文，一律導回站上。
- 不對外開放會呼叫 AI 的工具（名詞解釋走本機資料、搜尋只用 keyword），直到有獨立限額。
- 不在階段 1 改 `/api/chat` 與 admin console。

## 需要拍板（Tier 2）

1. 新增依賴：`agents`、`@modelcontextprotocol/server`、`@modelcontextprotocol/ext-apps`（zod 已是 4.3.6，不用動）。
2. `wrangler.jsonc` 新增 `MCP_SERVER_ENABLED` 與限流額度設定。
3. 對外網址：`quidproquo.cc/mcp` 或獨立子網域。
4. 要不要申請上架 Claude connector 目錄（上架有額外審核要求，需另查）。
5. 階段 2b（第三方卡片 host）要不要做；2a 自家卡片沿用共用元件即可。
6. 這份定案後是否補一篇 ADR（`docs/adr/0005-…`）。`docs/README.md` 已列「ADR-005 MCP Gateway」為 Proposed，兩者範圍要先對齊。

## 相關文件

- [`docs/README.md`](./README.md)：Agent Platform 文檔導覽與 ADR 表
- [`agent-platform-gap-analysis.md`](./agent-platform-gap-analysis.md)：MCP 與 Agent Plugins 缺口
- [`agent-plugin-export-import-spec.md`](./agent-plugin-export-import-spec.md)：plugin.json／mcp.json 匯入匯出
- [`agent-console-runbook.md`](./agent-console-runbook.md)：admin Agent Console
- [`interactive-glossary.md`](./interactive-glossary.md)：名詞解釋功能
- [`product/ask-ai/tool-activity-display PRD.md`](./product/ask-ai/tool-activity-display%20PRD.md)：工具使用畫面
- [`superpowers/specs/2026-10-16-ask-ai-conversation-continuity-design.md`](./superpowers/specs/2026-10-16-ask-ai-conversation-continuity-design.md)：Ask AI 最新對話設計
