---
title: "工具推薦｜postgres2mcp — 把 Postgres 連線變成帶治理層的 MCP server"
date: 2026-10-09
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "自架的開源 MCP server，把任何 Postgres 連線包成可用參數化 SQL 自訂工具、用 API key 控管誰能呼叫哪個工具的治理層，解決多個 agent 共用一個資料庫卻只能 all-or-nothing 授權的問題"
tldr: "postgres2mcp 是一個自架 MCP server，把 Postgres 連線包成帶權限治理的工具介面。安裝：curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh | bash。解決了多個 agent 或第三方服務要連同一個資料庫，卻只能給整庫唯讀或完全不給這種 all-or-nothing 授權的問題。"
series:
  name: "AI Tool of the Day"
  order: 49
---

> 🌏 [English version](/posts/daily/2026-10-09-tool-postgres2mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | postgres2mcp |
| 類型 | MCP server（Postgres 連線治理層） |
| GitHub | [Railcode-HQ/postgres2mcp](https://github.com/Railcode-HQ/postgres2mcp) |
| Stars | 5（2026-10-06 建立，Railcode 官方專案） |
| 語言 | TypeScript（Bun + Effect） |
| 授權 | MIT |
| 安裝 | `curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh \| bash` |

## 解決什麼問題

你想讓 agent 查資料庫，第一個念頭通常是開一個唯讀的 Postgres role 給它連，或是隨便找一個 `mcp-postgres` 類的包裝工具接上去。這在只有一個 agent、一種信任層級的時候沒問題。但一旦變成「內部同事用一組、客服 agent 用一組、連到你產品的第三方服務又要另一組」，問題就出現了：Postgres 的角色系統是資料庫層的概念，不是為了「這個 client 只能呼叫這幾個工具」設計的。結果通常是要嘛全部開唯讀、要嘛乾脆不開，中間那層「這個 key 只能查訂單表、那個 key 連 schema 都看不到」的細粒度控制，得自己寫一層應用層代理才做得到。

postgres2mcp 把這層代理做成現成的自架服務：接上 Postgres 連線字串後立刻拿到一個 MCP server，內建 schema introspection、唯讀查詢這些常見工具；真正的差異在於它讓你用參數化 SQL 定義自己的工具（例如 `fetch_users_by_org(organization_id)`），再發 API key 給每個 client，每把 key 能看到哪些工具完全獨立設定。資料庫層的權限（role 能不能寫入）和 MCP 層的權限（這把 key 能不能呼叫這個工具）是兩件分開管理的事，加上內建的使用紀錄和分析面板，等於把「誰在什麼時候查了什麼」也一併補上。

適合場景：團隊內有多個 agent 或多個外部服務要接同一個 Postgres，權限需求彼此不同；或者你是被其他人要求「連我們的資料庫」的第三方服務，想給對方一個自己可以稽核、而不是整包信任的存取层。如果只是你自己本機跑一個 agent 查自己的開發資料庫，這層治理暫時用不太到，直接用唯讀 role 接 MCP 就夠。

## 快速上手

### 安裝

```bash
# 需要 Docker + Compose v2，腳本會檢查並視情況幫你裝
curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh | bash

# 非互動式：直接帶資料庫連線字串和網域
curl -fsSL https://raw.githubusercontent.com/Railcode-HQ/postgres2mcp/main/install.sh | \
  bash -s -- --yes --database-url 'postgres://user:pass@host:5432/db' --domain mcp.example.com
```

安裝完成後終端機會印出一個帶 setup token 的連結，用它建立第一個管理員帳號；沒有網域就走 `http://localhost:3333`，純內網或本機測試用。

### 基本用法

在 dashboard 建立一把 API key，指定它能看到哪些工具，拿到 MCP 設定片段貼進 agent：

```json
{
  "mcpServers": {
    "postgres2mcp": {
      "url": "https://mcp.example.com/mcp",
      "headers": { "Authorization": "Bearer <你的 API key>" }
    }
  }
}
```

內建工具涵蓋 `list_tables`、`describe_table`、`query`（唯讀交易）這類常見操作，agent 不需要額外設定就能先看 schema 再查資料。

### 進階用法

用參數化 SQL 建一個語意化的自訂工具，取代讓 client 直接寫任意 SQL：

```sql
-- 在 dashboard 或透過 MCP 建立
SELECT name, email, date_joined, organization_id
FROM users
WHERE organization_id = :organization_id
```

存成 `fetch_users_by_org` 之後，把它分給某把 API key，同時**不**給那把 key `execute_sql` 權限，這把 key 就只能呼叫這一個工具、查不到其他任何東西：

```bash
# 資料庫端先建一個唯讀 role 給 postgres2mcp 自己用
psql -c "CREATE ROLE mcp LOGIN PASSWORD '...';"
psql -c "GRANT pg_read_all_data TO mcp;"
psql -c "ALTER ROLE mcp SET statement_timeout = '15s';"
```

## 與現有工具的比較

| | postgres2mcp | 手動開 Postgres 唯讀 role | 泛用 mcp-postgres 類包裝 |
|---|---|---|---|
| 每把 API key 各自限定能呼叫的工具 | ✅ | ❌（角色是資料庫層，不分 client） | ❌ 通常所有 client 共用同一組工具 |
| 可用參數化 SQL 建語意化自訂工具 | ✅ dashboard / MCP 都能建 | ❌ | 需自己寫程式 |
| 內建 audit log 與使用量分析 | ✅ | ❌ 要自己查 `pg_stat_statements` | 視實作而定，通常沒有 |
| 10 分鐘內自架完成（含 HTTPS） | ✅ 一行 curl 腳本 | — | 視專案而定 |
| 開源、刻意保持小可自行稽核 | ✅ MIT | — | 視專案而定 |

## 注意事項

- **「唯讀」預設不是鐵律**：`ALTER ROLE ... SET default_transaction_read_only = on` 只是連線的預設值，握有 `execute_sql` 權限的 client 理論上可以自己 `SET default_transaction_read_only = off`。README 自己也寫明：真正的唯讀保證要靠資料庫端的 GRANT，不是靠這個開關，部署前務必照 `docs/deployment.md` 設好專用的資料庫角色。
- **版本還在早期**：目前是 0.4.0，建在 Effect 4.0 的 release candidate 之上，相依的 `@modelcontextprotocol/sdk` 等套件也還在快速迭代，正式環境上線前先盯一下 repo 的 commit 紀錄。
- **預設沒有 HTTPS**：不帶 `--domain` 安裝就是本機或內網的明文 HTTP，admin 密碼和 session 都走明文；對外服務一定要帶網域走內建的 Let's Encrypt 流程，或接自己的反向代理。

## 今日收穫

多數「把資料庫接給 agent」的 MCP server，預設邏輯是 all-or-nothing：要嘛整個資料庫唯讀開放給任何能連上的 client，要嘛乾脆不開。postgres2mcp 把「這把 key 能呼叫哪個工具」做成跟「這個資料庫角色有什麼權限」完全分開的第二層治理，等於讓同一個資料庫可以同時服務好幾個信任層級不同的 agent，而不必為每一種信任層級另外開一個資料庫角色。

## 參考資料

- [Railcode-HQ/postgres2mcp — GitHub](https://github.com/Railcode-HQ/postgres2mcp)
- [postgres2mcp — 部署文件（資料庫角色設定、唯讀保證的限制）](https://github.com/Railcode-HQ/postgres2mcp/blob/main/docs/deployment.md)
- [postgres2mcp — install.sh 安裝腳本原始碼](https://github.com/Railcode-HQ/postgres2mcp/blob/main/install.sh)
- [Railcode](https://railcode.dev)
- [Model Context Protocol 官方規格](https://modelcontextprotocol.io)
