---
title: "工具推薦｜pgbot — 讓 AI agent 唯讀連進 Postgres，秒判斷資料庫哪裡不對"
date: 2026-08-27
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "pgbot 是一個唯讀的 Go 靜態執行檔，讀 Postgres 自己的統計視圖產生 findings-first 健康報告，也能跑成 MCP server 讓 AI agent 直接呼叫，不用部署任何監控平台"
tldr: "pgbot 是一個唯讀的 Postgres 健康檢查 CLI，跑 `pgbot mcp` 就變成 MCP server 讓 agent 直接呼叫。安裝：curl -fsSL https://pgbot.dev/install | sh。解決了資料庫變慢時要開好幾個監控面板拼湊根因、agent 卻只能看到片段資訊的問題。"
series:
  name: "AI Tool of the Day"
  order: 12
---

> 🌏 [English version](/en/posts/daily/2026-08-27-tool-pgbot)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | pgbot |
| 類型 | CLI + MCP server（PostgreSQL 唯讀診斷工具） |
| GitHub | [pgrundev/pgbot](https://github.com/pgrundev/pgbot) |
| Stars | 757 |
| 語言 | Go |
| 授權 | Apache-2.0 |
| 安裝 | `curl -fsSL https://pgbot.dev/install \| sh` |

## 解決什麼問題

資料庫變慢的時候，你通常要開好幾個地方才拼得出全貌：pg_stat_statements 查慢查詢、手動算 dead tuple 比例看 autovacuum 是不是跟不上、再翻一次 `\d+` 看索引到底有沒有用到。如果背後坐了一個 AI agent 要幫你診斷，情況更糟——agent 得自己組 SQL、自己判斷哪個數字算異常，沒有人告訴它「這個資料庫是不是健康」這種綜合判斷。

pgbot 是一個唯讀的 Go 靜態執行檔，直接讀 Postgres 內建的統計視圖（`pg_stat_statements`、`pg_stat_user_tables`、`pg_locks`、`pg_stat_replication` 等），跑一次 `pgbot inspect` 就吐出一份 findings-first 的健康報告：先分級成 CRITICAL / WARNING / NOTE，再列出檢查過沒問題的項目，讓你知道「哪些真的健康」而不只是「哪些出問題」。從第三次執行開始，它會拿本機存的 baseline 做比對，直接告訴你「哪個查詢變慢了」「哪張表開始在跑 seq scan」，而不是丟一堆原始數字要你自己比對。真正的重點是 `pgbot mcp`：同一份 findings 用 Model Context Protocol 對外開放，agent 可以呼叫 `inspect`、`unused_indexes`、`suggest_indexes`、`explain_plan` 這些唯讀工具，拿到的是版本化、PII-free 的 JSON contract，而不是自己現拼的 SQL 結果，而且連線字串和查詢字面值都不會被吐給模型。

適合場景：要幫別人 troubleshoot 一個你不熟的資料庫、CI 裡想在 migration PR 擋下危險的 schema 變更（`--fail-on` 可以直接當 exit code gate）、或是想讓 coding agent 具備「先看資料庫健康報告再動手」能力的團隊。

## 快速上手

### 安裝

```bash
# 安裝腳本（含 cosign 簽章與 checksum 驗證）
curl -fsSL https://pgbot.dev/install | sh

# 或用套件管理器
brew install pgrundev/tap/pgbot        # Homebrew
npx @pgbot/cli inspect "$DATABASE_URL" # npx，免安裝
go install github.com/pgrundev/pgbot/cmd/pgbot@latest
```

需要一個只有 `pg_monitor` role 的唯讀帳號（`pgbot init` 會產生對應的建立 SQL，但不會替你執行）。

### 基本用法

```bash
export DATABASE_URL="postgres://pgbot_ro@host:5432/db"

pgbot inspect              # 健康分數 + CRITICAL/WARNING/NOTE 分級報告
pgbot indexes              # 找出零掃描但佔空間的索引
pgbot vacuum                # 每張表的 dead tuple 比例、autovacuum 是否跟不上
pgbot ask "why is it slow?" # 在同一份 deterministic findings 上加一層口語化解讀
```

### 進階用法

```bash
# 跑成 MCP server，讓 agent 直接呼叫
pgbot mcp
```

```json
{
  "mcpServers": {
    "pgbot": {
      "command": "pgbot",
      "args": ["mcp"],
      "env": { "DATABASE_URL": "postgres://pgbot_ro@host:5432/db" }
    }
  }
}
```

`inspect` 之外，`unused_indexes`、`suggest_indexes`（需要 hypopg extension）、`explain_plan`、`schema_of`、`compare_to_baseline` 都以 MCP tools 開放，全部唯讀。CI 場景則用 `--format=sarif --fail-on=critical` 把結果丟進 GitHub Security tab，或 `--fail-on-new base.json` 只針對這次 migration 新冒出來的問題擋 PR。

## 與現有工具的比較

pgbot 自己在 README 裡把定位講得很清楚：它是「你主動跑一次的 point-in-time 診斷」，不是要取代常駐監控平台。

| | pgbot | pganalyze | pgwatch |
|---|---|---|---|
| 部署方式 | 單一靜態 binary，免服務 | SaaS，需裝 collector agent | 自架，需部署 collector + 時序資料庫 |
| 需要外部帳號 | ❌ | ✅（SaaS） | ❌ |
| 長期趨勢 / dashboard / 告警 | ❌（只比對本機 baseline） | ✅ | ✅ |
| 原生 MCP server | ✅ | ❌ | ❌ |
| CI gate（exit code / SARIF） | ✅ | ❌ | ❌ |
| 授權 | Apache-2.0 開源 | 商業 SaaS | Apache-2.0 開源 |

## 注意事項

- **Status: beta**：README 自己標註 `--json` 是版本化契約（目前 1.2.0），但人類可讀的終端輸出不算穩定介面——寫自動化要 parse `--json`，別 parse 文字報表。
- **`advise`（索引建議）需要 hypopg extension 且 Postgres 16+**：14–15 版本只有「best-effort」支援，部分 collector 會直接降級跳過而不是報錯。
- **`ask` / `explain` 需要外部模型金鑰**：這兩個指令要接 `OPENAI_API_KEY` 或 `GEMINI_API_KEY` 才能用；其餘所有指令（含 `inspect`、`mcp`）完全 deterministic、不需要任何金鑰、也不會把資料送出機器。
- **索引「零掃描」的判讀要小心複本**：`indexes` 指令自己在輸出裡提醒，scan 計數是 per-node 的——主節點看起來沒用到的索引，replica 上可能還在用，不能只看主節點數字就砍索引。

## 今日收穫

過去講「讓 agent 操作資料庫」，直覺是給它一個能執行 SQL 的 MCP server，然後靠 agent 自己判斷查詢結果好不好。pgbot 的做法反過來：deterministic 的判斷邏輯（哪些是 finding、嚴重度怎麼分級）寫死在 Go 程式碼裡，agent 只負責解讀，不負責產生數字。這條分工線——工具算數字、模型講人話——比單純把資料庫連線丟給 agent 更適合正式環境，也更容易稽核 agent 到底看到了什麼。

## 參考資料

- [pgrundev/pgbot GitHub repo](https://github.com/pgrundev/pgbot)：README、指令列表、MCP tools 說明、授權（Apache-2.0）、stars 數字均出自官方 repo。
- [pgbot.dev 官方網站](https://pgbot.dev/)：Quickstart、安裝方式、MCP 設定範例。
- [pgbot.dev launches open-source Postgres intelligence tool for AI agents and developers — LavX News](https://news.lavx.hu/article/pgbot-dev-launches-open-source-postgres-intelligence-tool-for-ai-agents-and-developers)：發佈報導，涵蓋安裝方式與 MCP 整合說明（2026-08-25 發布）。
