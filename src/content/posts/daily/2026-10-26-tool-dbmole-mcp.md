---
title: "工具推薦｜dbmole-mcp — 讓 Agent 自己管理 PostgreSQL／MySQL 連線的 MCP server"
date: 2026-10-26
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "新發布的 MCP server 讓 agent 透過工具在執行期新增、編輯 PostgreSQL／MySQL 連線——內建 SSH tunnel、TLS 驗證與唯讀保護，不必手動改用戶端設定檔"
tldr: "dbmole-mcp 是一個 PostgreSQL／MySQL 的 MCP server，讓 agent 自己管理連線設定。安裝：`claude mcp add dbmole -- npx -y dbmole-mcp`。解決了現有資料庫 MCP 工具連線要手動編輯用戶端設定檔、無法由 agent 自行新增或修改的問題。"
series:
  name: "AI Tool of the Day"
  order: 65
---

> 🌏 [English version](/posts/daily/2026-10-26-tool-dbmole-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | dbmole-mcp |
| 類型 | MCP server（stdio） |
| GitHub | [ed-smartass/dbmole-mcp](https://github.com/ed-smartass/dbmole-mcp) |
| Stars | 1（GitHub mirror 於 2026-10-25 建立；npm 套件已迭代到 0.2.0，看得出先在作者自己的 git server 上開發過一段時間） |
| 語言 | TypeScript（Node.js ≥ 22） |
| 授權 | MIT |
| 安裝 | `claude mcp add dbmole -- npx -y dbmole-mcp` |

## 解決什麼問題

你請 agent 幫忙查一下 staging 資料庫的某張表，但多數資料庫 MCP server 的連線字串是寫死在 client 設定檔裡的——要加一個新連線，得自己編輯 JSON、填密碼、重啟 client。換一個 bastion、換一個唯讀帳號，又要重複一次。agent 本身完全插不上手，因為「設定連線」這一步根本不是 MCP 工具，是你手動做的事。

dbmole-mcp 把連線管理本身也做成 MCP 工具：你跟 agent 說「連到 bastion.example.com 後面的 staging 複本，唯讀」，它就呼叫 `add_connection` 寫進專案目錄下的 `.dbmole.json`（或全域的 `~/.config/dbmole/connections.json`），兩個檔案在每次工具呼叫時都會重新讀取，所以你在編輯器裡手動改、或另一個 session 改,下一次呼叫就生效,不用重啟。連線裡可以帶 SSH tunnel（密碼／金鑰／agent 三種認證，host key 會對照 `known_hosts` 或你釘住的 fingerprint 驗證)和 TLS（含憑證鏈與 hostname 驗證），`readonly: true` 則是在資料庫 session 層面真的執行唯讀——PostgreSQL 包一層 `BEGIN READ ONLY`、MySQL 設 `SET SESSION TRANSACTION READ ONLY`，而不是靠 SQL parser 擋關鍵字。每次呼叫結束都會把 session 重置乾淨（捲回交易、清掉暫存表與 session 變數），下一次呼叫不會繼承上一次留下的狀態。

適合場景：agent 需要經常切換不同環境（本機、staging、透過 bastion 的 production 唯讀複本）查資料，而你不想每切一次就手動改一次設定檔；也適合想研究「要把多少控制權交給 agent」這個權衡的人——它把「連線管理」整個攤開成工具，同時把風險（見下方注意事項）寫得很清楚。

```diagram
title: execute_sql 執行時的唯讀保護與連線重置
desc: 每次查詢先看這個連線是不是唯讀，執行完不論成功或失敗都會重置連線階段狀態，不讓一次呼叫的設定留到下一次呼叫。
caption: 簡化示意；省略連線解析（project 檔案蓋過 global store）與 SSH tunnel 建立這兩層。
step: agent 呼叫 execute_sql，帶 connection 名稱與 SQL
step: 這個連線設定了 readonly
step: 不是唯讀，直接往下執行
step: 包成一筆 BEGIN READ ONLY／SET SESSION TRANSACTION READ ONLY 交易再執行
step: 成功就回傳結果；失敗就回傳錯誤訊息——兩條路最後都會重置連線階段狀態
---
<svg viewBox="0 0 640 576">
  <path class="dg-line" d="M280 34V56" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 112V144" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M376 192H428" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 236V268" data-step="3"/>
  <path class="dg-line" d="M520 216V260Q520 268 512 268H288" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M280 272V292" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line" d="M280 348V372" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line dg-line--accent" d="M376 416H428" marker-end="url(#arrow-accent)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 460V492" marker-end="url(#arrow-warn)" data-step="5"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="196" y="60" width="168" height="52" rx="6"/>
    <text class="dg-label" x="280" y="80" text-anchor="middle" dominant-baseline="central">呼叫 execute_sql</text>
    <text class="dg-sub" x="280" y="98" text-anchor="middle" dominant-baseline="central">connection 名稱＋SQL</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 148L376 192L280 236L184 192Z"/>
    <text class="dg-label" x="280" y="182" text-anchor="middle" dominant-baseline="central">設定了 readonly？</text>
    <text class="dg-sub" x="280" y="204" text-anchor="middle" dominant-baseline="central">這個連線</text>
  </g>

  <g data-step="2">
    <rect class="dg-box" x="432" y="168" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="188" text-anchor="middle" dominant-baseline="central">包成 READ ONLY 交易</text>
    <text class="dg-sub" x="520" y="206" text-anchor="middle" dominant-baseline="central">session 層面強制</text>
  </g>

  <circle class="dg-dot" cx="280" cy="270" r="4" data-step="2 3"/>

  <g data-step="4">
    <rect class="dg-box" x="192" y="292" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="312" text-anchor="middle" dominant-baseline="central">執行這一筆 statement</text>
    <text class="dg-sub" x="280" y="332" text-anchor="middle" dominant-baseline="central">依 rowLimit／40KB 截斷</text>
  </g>

  <g data-step="5">
    <path class="dg-box" d="M280 372L376 416L280 460L184 416Z"/>
    <text class="dg-label" x="280" y="406" text-anchor="middle" dominant-baseline="central">執行成功？</text>
    <text class="dg-sub" x="280" y="428" text-anchor="middle" dominant-baseline="central">execute_sql 回報</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--accent" x="432" y="392" width="176" height="48" rx="6"/>
    <text class="dg-label" x="520" y="416" text-anchor="middle" dominant-baseline="central">回傳結果</text>
  </g>

  <g data-step="5">
    <rect class="dg-box dg-box--warn" x="192" y="492" width="176" height="56" rx="6"/>
    <text class="dg-label" x="280" y="512" text-anchor="middle" dominant-baseline="central">回傳錯誤訊息</text>
    <text class="dg-sub" x="280" y="532" text-anchor="middle" dominant-baseline="central">session 一樣會重置</text>
  </g>

  <text class="dg-edge" x="402" y="180" text-anchor="middle" dominant-baseline="central" data-step="2">是</text>
  <text class="dg-edge" x="290" y="256" text-anchor="start" dominant-baseline="central" data-step="3">否</text>
  <text class="dg-edge dg-text--accent" x="402" y="404" text-anchor="middle" dominant-baseline="central" data-step="5">是</text>
  <text class="dg-edge dg-text--warn" x="290" y="480" text-anchor="start" dominant-baseline="central" data-step="5">否</text>
</svg>
```

## 快速上手

### 安裝

```bash
# 需要 Node.js 22 以上；伺服器啟動時不用先給任何連線設定
claude mcp add dbmole -- npx -y dbmole-mcp

# 也支援 Codex、Cursor（一鍵連結）、VS Code、Claude Desktop（.mcpb 檔）與 Docker，
# 細節見 README「Install」一節
```

### 基本用法

跟 agent 說，例如：

> 幫這個專案加一個唯讀的 postgres 連線 `shop`：host 10.0.0.12、database shop、user reporter，
> 透過 ssh 連到 deploy@bastion.example.com（用我的 ssh agent）。然後列出最大的五張表。

agent 會呼叫 `add_connection` 寫進 `.dbmole.json`，再依序呼叫 `test_connection`、`list_tables`、`execute_sql`：

```json
{
  "name": "shop",
  "type": "postgres",
  "host": "10.0.0.12",
  "user": "reporter",
  "database": "shop",
  "readonly": true,
  "ssh": { "host": "bastion.example.com", "user": "deploy", "agent": true },
  "scope": "project"
}
```

### 進階用法

```bash
# 釘住 SSH host key，之後連線不再查 known_hosts
ssh-keyscan -p 22 bastion.example.com 2>/dev/null | ssh-keygen -lf -
# 256 SHA256:EXAMPLE... bastion.example.com (ED25519)
# 把拿到的 SHA256:... 告訴 agent，請它呼叫 update_connection 設定 ssh.hostKey
```

```json
// project 與 global 同名連線時，project 的設定會蓋過 global，
// list_connections 會標出哪個被蓋過（shadows）
{
  "connections": [
    { "name": "shop", "type": "postgres", "host": "127.0.0.1", "user": "dev", "database": "shop" }
  ]
}
```

## 與現有工具的比較

| | dbmole-mcp | DBHub | Postgres MCP Pro | mcp-server-mysql | MCP Toolbox |
|---|---|---|---|---|---|
| PostgreSQL | ✅ | ✅ | ✅ | ❌ | ✅ |
| MySQL | ✅ | ✅ | ❌ | ✅ | ✅ |
| 其他資料庫 | ❌ | ✅ | ❌ | ❌ | ✅ |
| 內建 SSH tunnel | ✅ | ✅ | — | ✅ | ❌ |
| agent 可透過工具自己新增／編輯連線 | ✅ | ❌（作者在 issue 裡標明不打算做） | ❌ | ❌ | ❌ |
| Index 調校 | ❌ | — | ✅ | — | — |
| 健康檢查 | ❌ | ✅ | ✅ | — | ✅（內建 PostgreSQL 工具） |

（資料來自 dbmole-mcp README 的對照表，標註檢查時間 2026 年 10 月；其他工具若有更新，實際功能請以各自文件為準。）

## 注意事項

- **readonly 不是安全邊界**：agent 本來就能呼叫 `update_connection` 把 `readonly` 關掉，README 自己也這麼寫。真的要保證唯讀，連線帳號在資料庫端就不該有寫入、檔案或管理權限。
- **readonly 保護不到的地方是真的存在**：PostgreSQL 的 `COPY ... TO PROGRAM`／`lo_export`、`dblink` 寫入、對暫存表的 DML、`pg_terminate_backend`／`SET GLOBAL`／`KILL` 這類管理指令，都不在「唯讀交易」的保護範圍內。
- **連線檔案是明文密碼**（權限 `0600`，跟 `~/.pgpass` 一樣）：務必把 `.dbmole.json` 加進 `.gitignore`。更麻煩的是，在你 clone 下來、還沒檢查過的 repo 裡,如果裡面已經帶著一個 `.dbmole.json`,dbmole 會原樣信任它、可能蓋過你的 global 連線,把查詢導去別的主機——進陌生 repo 前先跑一次 `list_connections` 檢查。
- **SSH tunnel 開著時,本機 `127.0.0.1` 上任何行程都能連進那個 port**（沒有額外認證,包括共享主機上的其他使用者），資料庫本身的帳密是最後一道防線。

## 今日收穫

多數資料庫 MCP server 把「連線怎麼設定」留在工具外面，當成使用者該自己搞定的前置作業；dbmole-mcp 把它搬進 MCP 工具層，表面上省掉編輯設定檔、重啟 client 這幾步，但同時把「連線管理」本身變成新的攻擊面——誰能呼叫 `update_connection`、或是誰能把一個帶惡意連線設定的 repo 丟給你 clone，就等於拿到了憑證的存取權，這跟「SQL 執行層的唯讀保護」完全是兩件事。作者在 SECURITY.md 裡把這個威脅模型講得很直白,這種「把方便的地方和風險寫在同一份文件裡」的誠實,在同類工具中不算常見。

## 參考資料

- [ed-smartass/dbmole-mcp — GitHub](https://github.com/ed-smartass/dbmole-mcp)
- [dbmole-mcp SECURITY.md](https://github.com/ed-smartass/dbmole-mcp/blob/main/SECURITY.md)
- [dbmole-mcp CHANGELOG.md](https://github.com/ed-smartass/dbmole-mcp/blob/main/CHANGELOG.md)
- [dbmole-mcp — npm](https://www.npmjs.com/package/dbmole-mcp)
- [ed-smartass/esmole-mcp — 同作者的 Elasticsearch 版本](https://github.com/ed-smartass/esmole-mcp)
- [bytebase/dbhub — GitHub（比較對象）](https://github.com/bytebase/dbhub)
- [crystaldba/postgres-mcp — GitHub（比較對象）](https://github.com/crystaldba/postgres-mcp)
