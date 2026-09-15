---
title: "工具推薦｜DearAgent — 讓 Agent 擁有自己的信箱，跑在你自己的 Cloudflare 帳號上"
date: 2026-09-15
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源、AGPL-3.0、單一 Cloudflare Worker，讓 AI Agent 擁有自己的 email 信箱：收信、等驗證碼、搜尋、回信、webhook 通知全部跑在你自己的帳號裡,是 AgentMail 的自架替代方案"
tldr: "DearAgent 是跑在 Cloudflare Workers 上的開源 email inbox API,內建 MCP server,讓 Agent 建立信箱、等驗證碼、搜尋與回信。安裝：git clone 後 npm run setup 互動部署,或直接上 dearagent.sh 線上試用。解決了 Agent 做帳號註冊、等驗證信這類流程需要真實信箱,卻不想依賴第三方託管服務的問題。"
series:
  name: "AI Tool of the Day"
  order: 30
---

> 🌏 [English version](/en/posts/daily/2026-09-15-tool-dearagent-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | DearAgent |
| 類型 | MCP server + REST API（自架於 Cloudflare Workers） |
| GitHub | [panda-sandeep/dearagent](https://github.com/panda-sandeep/dearagent) |
| Stars | 23 |
| 語言 | TypeScript |
| 授權 | AGPL-3.0 |
| 安裝 | `git clone https://github.com/panda-sandeep/dearagent && cd dearagent && npm install && npm run setup` |

## 解決什麼問題

你在寫一個會幫使用者跑帳號註冊流程的 Agent——去某個網站填表單、收驗證信、把驗證碼貼回去完成註冊。這時候 Agent 需要一個真實能收信的 email 地址。用你自己的信箱會把測試信跟真實郵件混在一起,也沒辦法每個 Agent 或每次執行都給一個乾淨、用完即丟的地址;改用 AgentMail 這類託管的「Agent 信箱」SaaS,郵件內容存在對方雲端,原始碼封閉,計費通常按 inbox 數或訊息數走,想自己稽核資料流向也無從查起。

DearAgent 把這整套邏輯壓進一個 Cloudflare Worker:用 Cloudflare Email Routing 在你自己的網域上收信,寫進你自己帳號裡的 D1(訊息與 metadata)和 R2(附件),依 `In-Reply-To`/`References` 做 threading 而不是看 subject 硬湊,並且同時開兩種介面——一組 REST API,以及一個掛在 `/mcp` 的 stateless Streamable HTTP MCP server。MCP 工具集包含 `create_inbox`、`wait_for_message`(封鎖等待直到有新信,而不是自己寫 polling 迴圈)、`search_messages`、`reply_to_message`、`forward_message` 等,讓 Claude Code、Cursor 或任何 MCP client 都能把「一個信箱」當成一個工具來用。

適合場景:寫自動化測試或 RPA 型 Agent,需要替流程申請的每個帳號配一個一次性信箱收驗證碼;已經在用 Cloudflare Workers/D1/R2 的團隊,想把 Agent 的郵件資料留在自己的基礎設施裡,而不是再開一個第三方 SaaS 帳號。

## 快速上手

### 安裝

```bash
# 前置需求:Cloudflare 帳號、一個目前沒有在收信的 apex 網域、Node 20+、npx wrangler login

git clone https://github.com/panda-sandeep/dearagent
cd dearagent
npm install
npm run setup   # 互動式:建立 D1、R2、secrets,啟用 Email Routing/Sending,deploy,設 catch-all 規則
```

不想先部署也能看效果:[dearagent.sh](https://dearagent.sh/#try) 開頁就會在公開 demo 環境即時建一個信箱,寄一封信過去馬上能在頁面上看到,demo 地址存活 15 分鐘、不留存內容。

### 基本用法

Agent 透過 MCP 工具跟信箱互動的典型流程(取自官方 README):

```
> create_inbox {}
✓ agent-k3m9x2pq@mail.example.com   # 把地址交給要註冊的表單

> wait_for_message { inbox: "agent-k3m9x2pq@mail.example.com", timeout: 25 }
✓ from: Pied Piper
  subject: Your verification code
  text: "Your code is 493021. It expires in 10 minutes."
```

把 MCP server 接進 Claude Code:

```bash
claude mcp add --transport http dearagent https://dearagent.<your-subdomain>.workers.dev/mcp \
  --header "Authorization: Bearer $KEY"
```

### 進階用法

用 `wrangler.jsonc` 限制只接受特定格式的地址,其餘信件轉發到人工信箱,避免 catch-all 把整個網域的雜信都塞進資料庫:

```jsonc
{
  "vars": {
    "EMAIL_DOMAINS": "mail.example.com",
    "ADDRESS_MATCH_PATTERN": "^agent-[a-z0-9]{8}$",
    "FORWARD_UNMATCHED_TO": "ops@example.com",
    "RETENTION_DAYS": "7"
  }
}
```

再搭配 webhook,收到信直接推播給下游服務而不必輪詢:

```bash
curl -X POST $DA/webhooks -H "Authorization: Bearer $KEY" -d '{
  "url": "https://your-service.example.com/hooks/mail",
  "events": ["message.received"]
}'
```

## 與現有工具的比較

| | DearAgent | AgentMail(託管） | 自己寫 SMTP webhook 服務 |
|---|---|---|---|
| 郵件存放位置 | 你自己的 Cloudflare 帳號(D1 + R2) | 對方雲端 | 自己維運的基礎設施 |
| 原始碼可讀／可稽核 | ✅ 一份 repo,AGPL-3.0 | ❌ 封閉 | ✅(但要自己從零寫) |
| 內建 MCP server | ✅（`/mcp`，15 個工具） | 需自行整合 | 需自行整合 |
| Threading／附件／webhook | ✅ 內建 | ✅（產品功能） | 需自行實作 |
| 計費模式 | 你的 Workers 帳單(收信免費,寄信需 Workers Paid) | 依 inbox／訊息數計費 | 依你自架的基礎設施而定 |
| 多租戶／per-agent 權限 | ❌ 單一 API key,全權限 | ✅ 產品內建 | 需自行實作 |

## 注意事項

- **README 自己標注「Experimental」**:作者明講「尚未經過深入稽核,API 可能還會變,可能會壞」,正式接上任何敏感場景前建議自己讀過程式碼、跑過自己的稽核,不要直接餵給未信任的 Agent。
- **網域要求嚴格**:Cloudflare Email Routing 要求接管整個 apex 網域的 MX 記錄,已經在用 Google Workspace、Fastmail 等既有信箱服務的網域無法直接套用,得另外準備一個「目前沒有在收信」的網域;收信在免費方案就能跑,但要讓 Agent 主動寄信、回信,得升級 Workers Paid。
- **單一 API key、沒有 per-agent 隔離**:一把 key 就能存取這個部署底下所有信箱,官方也在 README 提醒把它當資料庫密碼看待——多個 Agent 或多人共用同一個部署時,得自己在前面加一層(如 Cloudflare Access)做權限切分,不能指望工具本身幫你分權。

## 今日收穫

多數「給 Agent 一個信箱」的方案,預設你要去租一個 SaaS、按信箱數或訊息數付費。DearAgent 提醒我們:收信、threading、附件儲存、webhook 通知這一整套,其實可以濃縮成一個 Worker + 一個 D1 + 一個 R2 bucket——當你原本就在 Cloudflare 上,「給 Agent 一個身分」這個原語(primitive)的邊際成本,基本上就是你的 Workers 帳單,而不是另一份訂閱。這也是不少「Agent 基礎設施」新創的共同模式:把雲端廠商本來就提供的原語重新包裝成一個帶 UI 和計費表的產品。

## 參考資料

- [panda-sandeep/dearagent GitHub repo](https://github.com/panda-sandeep/dearagent):README 全文——設計動機、Try it now 展示、Features、Why self-host 對照表、Quick start、API、MCP 工具清單、Security 與 Limits 段落,本文技術細節出處。
- [dearagent.sh](https://dearagent.sh/):官方網站與免部署線上試用（demo 地址存活 15 分鐘）。
- GitHub API repo metadata（`panda-sandeep/dearagent`）：Stars（23）、語言（TypeScript）、授權（AGPL-3.0）、建立時間（2026-09-11）取自 GitHub REST API。
- [AgentMail](https://www.agentmail.to/)：文中對照的託管 Agent 信箱 SaaS,DearAgent README 自陳為其開源自架替代方案。
