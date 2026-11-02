---
title: "工具推薦｜AnythingMCP — 把公司裡沒有 MCP server 的系統直接變成 MCP 工具"
date: 2026-11-03
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "自架的開源 MCP gateway，匯入 REST/SOAP/GraphQL/OData/SQL 規格就自動產生 MCP tool，不用自己寫 MCP server"
tldr: "AnythingMCP 是一個 AGPL-3.0 授權、可自架的開源 MCP gateway，匯入 OpenAPI、SOAP/WSDL、GraphQL、OData 或資料庫 schema，就能自動把每個操作變成 MCP tool 給 Claude、ChatGPT、Copilot 用。安裝：`docker compose up -d`（搭配官方 quickstart compose 檔）。解決了「公司裡一堆 ERP、SOAP 老系統、自家 REST API 都沒有 MCP server，得自己一個個手寫」的問題。"
series:
  name: "AI Tool of the Day"
  order: 72
---

> 🌏 [English version](/posts/daily/2026-11-03-tool-anythingmcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | AnythingMCP |
| 類型 | MCP server（自架 MCP gateway） |
| GitHub | [HelpCode-ai/anythingmcp](https://github.com/HelpCode-ai/anythingmcp) |
| Stars | 771 |
| 語言 | TypeScript（NestJS 後端 + Next.js 前端，monorepo） |
| 授權 | AGPL-3.0-only（`ee/` 目錄下的企業功能另用商業授權，見 `LICENSING.md`） |
| 安裝 | `docker compose up -d`（搭配官方 `docker-compose.quickstart.yml`） |

## 解決什麼問題

你的公司大概有不只一個系統是 AI agent 想查卻查不到的：ERP（SAP、Odoo）、一個 2009 年留下來的 SOAP 服務、自家的 REST API、一台只有內部網路能連的 PostgreSQL。這些系統都沒有 MCP server，要讓 Claude 或 ChatGPT 讀寫它們，得自己動手寫一個——每換一個系統就重來一次：解析 API 規格、處理認證、把回應轉成模型看得懂的格式。

AnythingMCP 把這個「寫 MCP server」的手工活變成設定。匯入一份 OpenAPI/Swagger 規格、WSDL、GraphQL endpoint、Postman collection,或直接連一個 SQL 資料庫、MongoDB,它就把每個操作自動變成一個 MCP tool,在 runtime 註冊、不用重啟服務。它也內建 694 個現成的「adapter」(SAP S/4HANA、Odoo、WooCommerce、Amazon Seller 等),其中 35 個完全不用 API key 就能試。工具產生之後,管理者可以在視覺化編輯器裡重新命名、改描述、決定哪些欄位在送到模型之前就被拿掉,以及哪個角色能叫哪個工具;每一次呼叫都留稽核紀錄。

```diagram
title: AnythingMCP 怎麼把舊系統變成 MCP tool
desc: ERP、REST/SOAP API 和 SQL 資料庫各自的規格匯入 AnythingMCP 的 connector 目錄，產生 MCP tool，經治理層過濾欄位與角色權限後，才讓 Claude、ChatGPT 等 AI client 透過一個 MCP 端點呼叫。
caption: 簡化示意：省略知識圖譜、公司記憶與 Code Mode 的沙箱執行層。
---
<svg viewBox="0 0 680 480">
  <rect class="dg-zone" x="200" y="16" width="308" height="448" rx="8"/>
  <text class="dg-tag" x="216" y="38" dominant-baseline="central">ANYTHINGMCP（自架）</text>

  <path class="dg-line" d="M160 110H224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 210H224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 310H224" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M354 360V384" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--link" d="M484 416H560" marker-end="url(#arrow-link)"/>

  <rect class="dg-box" x="20" y="82" width="140" height="56" rx="6"/>
  <text class="dg-label" x="90" y="102" text-anchor="middle" dominant-baseline="central">ERP／SAP、Odoo</text>
  <text class="dg-sub" x="90" y="122" text-anchor="middle" dominant-baseline="central">OData／SQL 規格</text>

  <rect class="dg-box" x="20" y="182" width="140" height="56" rx="6"/>
  <text class="dg-label" x="90" y="202" text-anchor="middle" dominant-baseline="central">REST／SOAP／GraphQL</text>
  <text class="dg-sub" x="90" y="222" text-anchor="middle" dominant-baseline="central">OpenAPI／WSDL</text>

  <rect class="dg-box" x="20" y="282" width="140" height="56" rx="6"/>
  <text class="dg-label" x="90" y="302" text-anchor="middle" dominant-baseline="central">SQL／MongoDB</text>
  <text class="dg-sub" x="90" y="322" text-anchor="middle" dominant-baseline="central">自家資料庫</text>

  <rect class="dg-box dg-box--store" x="224" y="60" width="260" height="300" rx="6"/>
  <text class="dg-label" x="354" y="200" text-anchor="middle" dominant-baseline="central">Connector 目錄</text>
  <text class="dg-sub" x="354" y="222" text-anchor="middle" dominant-baseline="central">694 個 adapter，runtime 註冊成 MCP tool</text>

  <rect class="dg-box dg-box--accent" x="224" y="384" width="260" height="64" rx="6"/>
  <text class="dg-label" x="354" y="406" text-anchor="middle" dominant-baseline="central">治理層</text>
  <text class="dg-sub" x="354" y="428" text-anchor="middle" dominant-baseline="central">角色權限・欄位過濾・稽核紀錄</text>

  <rect class="dg-box" x="560" y="388" width="100" height="56" rx="6"/>
  <text class="dg-label" x="610" y="408" text-anchor="middle" dominant-baseline="central">AI client</text>
  <text class="dg-sub" x="610" y="428" text-anchor="middle" dominant-baseline="central">Claude／ChatGPT</text>

  <text class="dg-edge" x="522" y="404" text-anchor="middle" dominant-baseline="central">MCP endpoint</text>
</svg>
```

適合的場景：企業內部要讓多個 AI client（Claude、ChatGPT、Copilot、Gemini）共用同一組對內部系統的存取權限，又需要集中管控誰能叫哪個工具、哪些欄位不能離開內網；或是手上有一堆還沒 MCP 化的舊系統（SOAP、OData、內部資料庫），想先用現成 adapter 或自己匯入規格快速接上。

## 快速上手

### 安裝

```bash
mkdir anythingmcp && cd anythingmcp
curl -fsSLo docker-compose.yml \
  https://raw.githubusercontent.com/HelpCode-ai/anythingmcp/main/docker-compose.quickstart.yml
printf 'JWT_SECRET=%s\nENCRYPTION_KEY=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" > .env
docker compose up -d
```

打開 `http://localhost:3000` 註冊，第一個帳號自動變成管理者。MCP 端點是 `http://localhost:4000/mcp`，API 文件在 `http://localhost:4000/api/docs`。`.env` 裡的 `ENCRYPTION_KEY` 是解密所有連線憑證的鑰匙，要保留好，丟了就得重設每一個 connector 的憑證。

### 基本用法

1. 在 dashboard 裡選一個現成 adapter（例如 Odoo），或貼上自己 API 的 OpenAPI/WSDL/GraphQL 規格。
2. 在視覺化編輯器裡勾選要暴露哪些操作、哪些欄位要在送進模型前拿掉，設定哪個角色能叫哪個工具。
3. 把產生的 MCP 端點網址（`http://your-host:4000/mcp`）加進 Claude 的 *Customize → Connectors*，或任何支援 MCP 的 client。

### 進階用法

Code Mode 讓 agent 用一段簡短程式把多次工具呼叫合併成一次，程式跑在獨立的 code-runner 容器裡，沒有檔案系統、網路、環境變數，只能呼叫呼叫者本來就有權限用的工具：

```js
// 探索可用工具、讀 schema、呼叫工具——僅限呼叫者已有權限的連線
const schema = await amcp.describe('list_invoices');
const invoices = await amcp.run('list_invoices', { customerId: args.customerId });
return invoices.filter((i) => i.status === 'open').map((i) => i.id);
```

Code Mode 預設關閉，要先由管理者在工作區層級打開（`codeMode`），且需要另外跑 code-runner 服務。

## 與現有工具的比較

| | AnythingMCP | Composio | n8n |
|---|---|---|---|
| 授權 | 開源 AGPL-3.0（`ee/` 另計） | SDK 是 MIT，但平台本身封閉、跑在官方雲端 | Source-available「fair-code」（Sustainable Use License，非 OSI 開源） |
| 自架可用完整功能 | ✅ `docker compose up` 就是完整版 | ❌ 自架是 Enterprise 專案，要走 sales，自助方案一律把憑證存在 Composio 雲端 | ✅（但憑證與維運要自己管理） |
| 把既有 REST/SOAP/OData/SQL 規格自動轉成 MCP tool | ✅ 匯入規格即產生，694 個現成 adapter | 以自動產生的 SaaS 工具目錄為主，SOAP／OData／自架資料庫不是強調重點 | ❌ 工作流程平台，MCP 只是其中一個 node／trigger，要自己拼整合邏輯 |
| 內建角色權限、欄位過濾、稽核 | ✅ 視覺化編輯器直接設 | 另外設定 | 要自己用 workflow 拼 |

## 注意事項

- **AGPL-3.0 的網路條款**：如果你改過原始碼並讓別人透過網路使用改過的版本（例如架一個對外的 SaaS），依授權要公開那份原始碼；自己公司內部自架通常不會踩到這條,但商用前務必先讀 `LICENSING.md` 確認情境。
- **免費自架上限 3 個活躍使用者**：Community 版本自架免費,但帳號數超過 3 個、或要用 File Search/公司記憶/SSO 這些標成 Cloud、Enterprise 的功能,就需要付費授權。
- **image 目前只有 amd64**：Apple Silicon 下用 compose 的平台模擬跑,不是原生 arm64;quickstart 預設只綁 `127.0.0.1`,要讓別人或雲端 AI client 連進來,得照 `docs/deployment.md` 另外跑 `setup.sh` 設網域和 TLS。
- **Code Mode 預設關閉**：要另外啟動 code-runner 服務並在工作區層級打開,沒開之前 agent 沒有把多次工具呼叫合併成一次程式的能力。

## 今日收穫

這類「匯入規格、自動產生 MCP tool」的 gateway 說明了一件事：接上 AI agent 的門檻已經從「要不要有人手寫一個 MCP server」,變成「這個系統有沒有公開的 API 規格可以匯入」。真正拉開工具差距的不再是轉換本身(OpenAPI → tool 這件事已經很機械化),而是轉換之後的治理——誰能叫哪個工具、哪些欄位不該離開公司網路、每一次呼叫有沒有留稽核紀錄。這跟 Composio 選擇把憑證和治理收進自己雲端、n8n 把 MCP 當成工作流程裡一個 node 的做法,是三種不同的押注。

## 參考資料

- [HelpCode-ai/anythingmcp — GitHub](https://github.com/HelpCode-ai/anythingmcp)
- [AnythingMCP README](https://github.com/HelpCode-ai/anythingmcp/blob/main/README.md)
- [LICENSE（AGPL-3.0-only）](https://github.com/HelpCode-ai/anythingmcp/blob/main/LICENSE)
- [LICENSING.md（AGPL 與 ee/ 商業授權的界線）](https://github.com/HelpCode-ai/anythingmcp/blob/main/LICENSING.md)
- [Code Mode 文件](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/code-mode.md)
- [Best self-hosted API integration platforms for AI agents — Nango（Composio 自架限制於 Enterprise）](https://nango.dev/blog/best-self-hosted-api-integration-platforms-for-ai-agents)
- [n8n — Wikipedia（fair-code／Sustainable Use License 說明）](https://en.wikipedia.org/wiki/N8n)
