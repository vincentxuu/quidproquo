---
title: "工具推薦｜BankMCP — 讓 AI 助理唯讀查詢你自己的歐洲銀行帳戶"
date: 2026-09-09
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "自架、唯讀的 MCP server，透過 PSD2 Open Banking API 讓 Claude、ChatGPT 等 AI 助理查詢歐洲銀行帳戶餘額與交易"
tldr: "BankMCP 是一個自架的唯讀 MCP server，透過 Enable Banking 的 PSD2 API 串接 2,700+ 家歐洲銀行，讓 AI 助理直接回答『這筆發票付了沒』『訂閱總共花多少錢』這類問題。安裝：`claude mcp add bankmcp -- npx -y bankmcp`。解決了『AI 助理想幫你管錢，卻沒有安全、唯讀管道碰到真實帳戶資料』的問題。"
series:
  name: "AI Tool of the Day"
  order: 25
---

> 🌏 [English version](/en/posts/daily/2026-09-09-tool-bankmcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | BankMCP |
| 類型 | MCP server（stdio 本機執行，或自架成遠端 HTTP connector） |
| GitHub | [noskillish/bankmcp](https://github.com/noskillish/bankmcp) |
| Stars | 154 |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `claude mcp add bankmcp -- npx -y bankmcp` |

## 解決什麼問題

你是不是也想過，要是能直接問 AI 助理「這個月訂閱總共扣了多少錢」「Acme 的發票付了沒」，不用自己一筆一筆對帳單，該有多方便？問題是銀行資料是最敏感的個資之一——把網銀截圖丟給 LLM，或是把帳號密碼交給某個第三方 SaaS 幫你「智慧理財」，都等於把最不該外流的東西暴露在不受你控制的地方。多數人因此乾脆放棄，繼續手動對帳。

BankMCP 用歐洲既有的 PSD2 開放銀行規範解決這個信任問題：它不是一個幫你保管資料的雲端服務，而是一支你自己架設、自己持有金鑰的伺服器，透過持牌的 Enable Banking 把 2,700 多家歐洲銀行包裝成一支 PSD2 API。你的伺服器只存 Enable Banking 的應用金鑰、銀行同意書和帳戶 ID，不落地保存餘額或交易紀錄；每次查詢都即時打去 Enable Banking 現拉，銀行密碼全程只在你自己銀行的官網輸入，不會經過 BankMCP 或任何 AI 廠商。對外它是一支標準 MCP server，只開放唯讀工具——沒有任何一支工具可以轉帳或付款。

適合場景：想讓 Claude Code、Claude Desktop 或 Cursor 直接回答帳務問題（餘額、某筆交易、訂閱總支出）；想做月度收支總結、抓出異常大額交易、或設定「餘額低於 5,000 就通知我」這類背景規則；或是本身就在用 Enable Banking 涵蓋的歐洲銀行，想把「查帳」這件重複性工作交給 Agent 而不是自己開網銀 App。

## 快速上手

### 安裝

```bash
# 需要 Node 24 以上
# 先到 https://enablebanking.com 免費註冊，之後設定時會用到

claude mcp add bankmcp -- npx -y bankmcp

# 之後問助理任何跟銀行有關的問題，它會回一個 localhost 設定頁網址
# 打開網址，照頁面指示到 Enable Banking 建立一個 application，
# 填入 application id 和下載的 .pem 金鑰檔即可
```

Claude Desktop 使用者也可以直接下載 [`bankmcp.mcpb`](https://github.com/noskillish/bankmcp/releases/latest/download/bankmcp.mcpb) 當擴充套件安裝，不用碰指令列。

### 基本用法

設定完成、跟助理說「連接我的銀行」（`connect-bank` prompt）走完一次銀行登入授權後，Agent 會拿到一組唯讀工具：

```
list_accounts        → 列出所有已連接帳戶（可自訂顯示名稱，如「日常」「聯名」）
get_balances          → 某帳戶的目前餘額與可用餘額
get_transactions       → 分頁取得交易紀錄（含金額、對象、說明）
create_watch / list_watches → 建立/查看背景監控規則
```

```
使用者：Acme 的發票付了嗎？
Agent：（呼叫 get_transactions 篩選對象含 "Acme"）
       → 9 月 3 日已扣款 NT$12,400（原幣別 EUR 380）
```

### 進階用法

```bash
# 用背景 watch 規則，餘額低於門檻或出現大額扣款時透過 webhook 通知
create_watch(type: "balance_below", account: "日常", threshold: 5000)
create_watch(type: "single_debit_over", account: "日常", threshold: 10000)

# 也可以直接裝成 Claude Code plugin，內建三個 skill
# （/bank:setup 本機安裝、/bank:deploy 遠端部署、bank 對帳規則）
/plugin marketplace add noskillish/bankmcp
/plugin install bank@bank
```

## 與現有工具的比較

| | BankMCP | 手動對帳單截圖丟給 LLM | 傳統記帳 App（人工輸入） |
|---|---|---|---|
| 資料唯讀、不落地保存交易明細 | ✅ | ❌（截圖內容進了對話紀錄） | 視 App 而定 |
| 銀行密碼只在銀行官網輸入 | ✅ | ❌（帳密可能被要求貼進聊天視窗） | ✅ |
| 自架、金鑰自己保管 | ✅ | — | ❌（多數是雲端 SaaS） |
| MCP 原生，Agent 可自主查詢 | ✅ | ❌ | ❌ |
| 支援背景監控規則 + webhook 通知 | ✅ | ❌ | 部分 |

## 注意事項

- **只涵蓋歐洲銀行**：底層依賴 Enable Banking 的 PSD2 API，只支援歐洲約 2,700 家銀行，台灣、美國等地的銀行帳戶目前無法連接。
- **管理密碼就是唯一防線**：README 明講「知道 admin 密碼的人就能讀你的帳戶」，遠端部署務必設一組夠長的密碼，並開啟登入通知 webhook；換掉密碼並重啟是唯一的「踢掉所有裝置」機制。
- **資料是輪詢來的，不是即時的**：PSD2 對未受監控的背景存取限制每天最多查 4 次，所以 watch 規則不是即時推播，而是有延遲的定期檢查；官方文件也直說「不要用小模型（如本機 8B）來算總額，算錯機率不低」。

## 今日收穫

過去看到「AI 讀你的財務資料」通常只有兩種極端：要嘛把截圖或匯出檔整份丟進對話（資料進了模型供應商手裡），要嘛乾脆不碰、繼續手動對帳。BankMCP 說明其實有第三條路——借用金融業已經存在十年的 PSD2 規範和持牌中介機構，把「合規的唯讀資料存取」這件事讓專業機構處理，自己只需要架一支薄薄的、開源可審查的 MCP server 做轉接。這代表「讓 Agent 碰敏感資料」不必然要在「完全信任黑盒 SaaS」和「完全不用」之間二選一，只要底層有受監管的資料層存在，MCP 可以只是一層很薄、很透明的橋接。

## 參考資料

- [BankMCP GitHub repo](https://github.com/noskillish/bankmcp)：README、Stars、語言、授權（MIT）均出自官方 repo 與 GitHub API。
- [README「Security notes」章節](https://github.com/noskillish/bankmcp#security-notes)：admin 密碼機制、OAuth 實作與資料落地範圍說明。
- [README「What you get」章節](https://github.com/noskillish/bankmcp#what-you-get)：完整唯讀工具與 prompt 清單。
- [Enable Banking 官方網站](https://enablebanking.com)：PSD2 Open Banking API 提供者，涵蓋銀行數量與條款。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
