---
title: "工具推薦｜AnythingMCP — 把 ERP、SOAP、SQL 這些舊系統自動變成 MCP tool"
date: 2026-10-21
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "AGPL-3.0 自架 MCP 閘道，吃進 OpenAPI／SOAP／GraphQL／SQL／517 個現成 ERP 和電商 adapter，不用寫一行 MCP server 程式碼就能產生工具，並附 RBAC、SSO、稽核日誌和回應欄位過濾"
tldr: "AnythingMCP 是一個自架的 MCP 閘道，把 REST、SOAP、GraphQL、OData、SQL 資料庫自動轉成 MCP tool，附 517 個現成 ERP／電商 adapter。安裝：`docker compose up -d`（quickstart 範本）。解決了公司內部系統沒有 MCP server、每個都要自己手寫一套工具轉接層的問題。"
series:
  name: "AI Tool of the Day"
  order: 61
---

> 🌏 [English version](/posts/daily/2026-10-21-tool-anythingmcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | AnythingMCP |
| 類型 | MCP server（自架 MCP 閘道，從既有系統自動生成工具） |
| GitHub | [HelpCode-ai/anythingmcp](https://github.com/HelpCode-ai/anythingmcp)（今日 GitHub Trending Repository of the Day） |
| Stars | 772 |
| 語言 | TypeScript |
| 授權 | AGPL-3.0（`ee/` 下的雲端運維程式碼另外授權，自架不需要） |
| 安裝 | `docker compose up -d`（搭配官方 quickstart compose 檔） |

## 解決什麼問題

公司裡真正有 MCP server 的系統通常只有一兩個，剩下的是一個 REST API、一套用了十年的 SOAP 服務、一台 SAP，或者就是一張要直接查的資料表。想讓 agent 碰這些系統，傳統做法是為每一個都手寫一個 MCP server——定義 tool schema、處理認證、決定哪些欄位能回給模型看。接得越多系統，這份手工活就越重複：WSDL 要自己剖析、OpenAPI 要自己轉成 tool 定義、SQL 要自己擋住寫入。

AnythingMCP 把「手寫 MCP server」這一步拿掉。你丟給它一個 OpenAPI spec、WSDL、GraphQL endpoint 或資料庫連線字串，它在執行期把每個操作直接轉成 MCP tool，不需要重啟服務。它也內建 517 個現成 adapter（SAP、Odoo、WooCommerce、Amazon Seller、DHL 之類），裝一個 adapter 就是貼 API 金鑰的事。更關鍵的是它把「哪些欄位能讓模型看到」做成可編輯的回應對映層——官方範例是一筆訂單從 12,172 bytes 過濾到 1,072 bytes，連 context 成本都一起省了。

適合場景：團隊手上有多個沒有 MCP server 的內部系統（ERP、CRM、SOAP 服務、資料庫），想讓 Claude、ChatGPT 或 Cursor 透過同一個端點存取,又需要 RBAC、SSO 和稽核日誌符合內部安全要求。如果你只是要接一兩個已經有官方 MCP server 的服務（像 GitHub 或 Slack），直接裝官方 server 比多跑一個閘道簡單。

## 快速上手

### 安裝

```bash
mkdir anythingmcp && cd anythingmcp
curl -fsSLo docker-compose.yml \
  https://raw.githubusercontent.com/HelpCode-ai/anythingmcp/main/docker-compose.quickstart.yml
printf 'JWT_SECRET=%s\nENCRYPTION_KEY=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" > .env
docker compose up -d
# 打開 http://localhost:3000 註冊，第一個帳號自動變 admin
# MCP 端點：http://localhost:4000/mcp
```

需要 Docker 24+，amd64 映像在 Apple Silicon 上靠模擬跑，約 30 秒拉完映像、24 秒後 API 就緒。

### 基本用法

```bash
# 把閘道加進 Claude Code
claude mcp add --transport http anythingmcp http://localhost:4000/mcp
```

接著在 Web UI 裝一個 adapter（例如 WooCommerce），貼上 API 金鑰、選好角色能呼叫哪些工具——Claude 這邊的工具清單會即時更新，不用重啟 MCP 連線。每個 adapter 的每個操作都變成一個獨立的 tool，附帶 `readOnlyHint`／`destructiveHint` 標註。

### 進階用法

```json
{
  "transform": {
    "mode": "select",
    "fallbackToRaw": false,
    "exclude": ["customer.iban", "customer.taxId"],
    "select": { "order": "$.id", "total": "$.amounts.gross", "status": "$.state" }
  }
}
```

這是回應對映設定：指定工具只回傳哪些欄位，`fallbackToRaw: false` 確保對映設錯時直接讓呼叫失敗，而不是悄悄把完整原始回應（可能含 IBAN、稅號）洩漏給模型。

## 與現有工具的比較

| | AnythingMCP | 手寫單一 MCP server | AI Agent Gateway（[已推薦過](/posts/daily/2026-10-10-tool-ai-agent-gateway)的憑證閘道） |
|---|---|---|---|
| 從既有 API/ERP/DB 自動生成 tool | ✅ | ❌（每個系統都要自己寫） | ❌（它假設工具已經是 MCP server） |
| 517 個現成 adapter | ✅ | ❌ | ❌ |
| RBAC + SSO + 稽核日誌 | ✅ | 需自行實作 | ✅（這是它的核心功能） |
| 回應欄位過濾（防敏感資料進 context） | ✅ | 需自行實作 | ❌（不碰工具回傳內容） |
| 自架開源 | ✅（AGPL-3.0） | 視專案而定 | ✅（Apache-2.0） |

兩者其實可以疊著用：AnythingMCP 負責把舊系統變成 MCP tool，AI Agent Gateway 負責在多個 agent 間做憑證注入和稽核。

## 注意事項

- **AGPL-3.0 的著作權衍生義務**：公司內部自架使用不受影響，但如果你修改了 AnythingMCP 本體、並把修改版開放給外部網路使用，就要把修改開源。純粹自己部署、自己用不會踩到這條。
- **部分 adapter 標了 †**：README 上標 † 的 adapter（如 OTTO Market、Zalando Direct Ship、Sage 100）是照廠商公開文件寫的，還沒在真實租戶上跑過，第一次接可能要自己除錯。
- **quickstart 預設只綁 `127.0.0.1`**：沒有 TLS termination，只能本機測試。要讓團隊或雲端 AI client 連進來，得照 Deployment Guide 跑 `./setup.sh`（透過 Caddy 拿證書）。

## 今日收穫

一直以為「幫系統接 MCP」是等那個系統的維護者去寫官方 MCP server；AnythingMCP 讓我意識到 adapter 本質上就是一份 JSON 設定檔，剖析 OpenAPI/WSDL 的工作可以通用化——這把「寫 MCP server」這件事,從程式問題變成設定問題。

## 參考資料

- [HelpCode-ai/anythingmcp — GitHub](https://github.com/HelpCode-ai/anythingmcp)
- [AnythingMCP 官網](https://anythingmcp.com/)
- [License FAQ（AGPL-3.0 細節）](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/license-faq.md)
- [REST / OpenAPI connector 文件](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/connectors/rest.md)
- [Deployment Guide](https://github.com/HelpCode-ai/anythingmcp/blob/main/docs/deployment.md)
