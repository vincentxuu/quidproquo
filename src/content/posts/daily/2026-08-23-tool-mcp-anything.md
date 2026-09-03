---
title: "工具推薦｜mcp-anything — 一個 MCP server 搜遍全世界 7.5 萬個 MCP server"
date: 2026-08-23
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "meta-MCP gateway：把官方 registry、PulseMCP、npm、Glama 四個來源的 MCP server 索引成本機 BM25 搜尋，只用 5 個 meta-tools 就能讓 agent 自己找到、檢視、呼叫任何 MCP server，context 成本不隨生態成長"
tldr: "mcp-anything 是一個 meta-MCP server，把 7.5 萬個 MCP server 的 registry 索引到本機，讓 agent 用 5 個固定的 meta-tools（search/describe/list_tools/call_tool/sync）搜尋並呼叫任何 MCP server。安裝：`npx mcp-anything sync && npx mcp-anything serve`。解決了「MCP server 太多、每個都要手動配置、每多裝一個就多燒一份 context」的問題。"
series:
  name: "AI Tool of the Day"
  order: 8
---

> 🌏 [English version](/en/posts/daily/2026-08-23-tool-mcp-anything-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp-anything |
| 類型 | MCP server（meta-MCP gateway） |
| GitHub | [Dror-Bengal/mcp-anything](https://github.com/Dror-Bengal/mcp-anything)（2026-08-21 新建） |
| Stars | 0（剛發佈，單一貢獻者） |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npx mcp-anything sync && npx mcp-anything serve` |

## 解決什麼問題

你有沒有遇過這個情境：想找一個能查 Postgres 的 MCP server，結果不知道去哪找,只能靠關鍵字亂搜、翻 awesome-list、或問人。就算找到了,也得手動貼進 host 的設定檔、重啟、確認能連上——每次加一個新工具都要重複這套流程。更麻煩的是,每多配置一個 MCP server,它的 tool schema 就會被永久載入每一次對話的 context 裡；裝到第十個 server、每個 server 十幾個 tool,還沒開口就先燒掉幾千 token。這也是為什麼多數人卡在只裝幾個 MCP server，不是不想要更多能力，而是 context 太貴。

mcp-anything 把這個模型倒過來：你只在 host 裡配置「一個」MCP server，它在背後同步官方 MCP registry、PulseMCP（約 2.2 萬個）、npm（約 6.7 萬個帶 mcp 標籤的套件）、Glama（約 7.5 萬個索引）四個來源，跨來源去重（同一個 server 可能同時以 `io.github.acme/weather`、`pulse/weather-mcp`、`npm/@acme/weather-mcp` 三種身分出現）,合併 star 數和下載量做熱度排序，建成本機 BM25 全文索引。Agent 只看到固定的 5 個 meta-tool：`search_mcp_servers` 搜尋、`describe_mcp_server` 看 transport/所需環境變數/安全判定、`list_mcp_tools` 即時連線列出真正的 tool schema、`call_mcp_tool` 執行、`sync_registry` 刷新索引。不管生態長到多大，載進 context 的永遠是這 5 個 tool 的定義。

適合場景：MCP host（Claude Code、Claude Desktop、Cursor）想讓 agent 自己發現並串接新工具，而不是每次都要人工去找、去配置；或是想先「探索」有沒有現成的 MCP server 能做某件事，再決定要不要正式裝進專案。

## 快速上手

### 安裝

```bash
# 需要 Node >= 20
npx mcp-anything sync     # 第一次索引下載，約幾秒鐘
npx mcp-anything serve    # 在 stdio 上啟動 meta-MCP server
```

加進 Claude Code：

```bash
claude mcp add anything -- npx -y mcp-anything serve
```

### 基本用法

裝好之後直接用自然語言問模型即可，它會自己呼叫 meta-tools：

```
你：幫我找一個能查 Postgres 並列出它的 tool 的 MCP server

Agent 背後做的事：
1. search_mcp_servers("postgres")     → 拿到候選清單（含可連線性判定）
2. describe_mcp_server(選中的那個)     → 看 transport、需要哪些環境變數
3. list_mcp_tools(同一個 server)      → 即時連線，列出真正的 tool schema
```

### 進階用法（CLI 直接用，不經過 agent）

```bash
mcp-anything sync             # 手動刷新 registry 索引
mcp-anything search "weather" # 直接在終端機搜尋索引
mcp-anything serve --http --discovery-only   # 對外提供搜尋服務，但關閉執行（避免變成公開 proxy）
```

## 與現有工具的比較

作者在發佈文中主動點名了三種相近但不同的做法：MetaMCP 這類 gateway 聚合的是「你已經配置好的」server，Composio 的 Rube 是路由到自己代管的 hosted catalog，各 host 內建的原生 tool search 則只搜尋「已經連上的」工具。mcp-anything 的差異點是索引整個公開 registry 生態，本機優先、開源、可對接私有 registry：

| | mcp-anything | 手動逐一配置 | MetaMCP 類 gateway |
|---|---|---|---|
| 搜尋整個公開 MCP 生態（7.5 萬個） | ✅ | ❌ | ❌（只聚合已配置的） |
| Context 成本固定（5 個 meta-tool） | ✅ | ❌（每裝一個燒一份） | 依聚合的 server 數量而定 |
| 本機優先、開源、可自架 | ✅（MIT） | — | 部分方案為 hosted |
| 內建 SSRF guard / stdio 執行預設關閉 | ✅ | 需自行把關 | 依實作而定 |

## 注意事項

- **剛發佈、0 星、單一貢獻者**：建立於 2026-08-21，長期維護狀況未知，先當概念驗證評估，別直接接進生產工作流。
- **spawn stdio server 預設關閉**：因為從公開 registry 執行任意套件等於在你機器上跑陌生程式碼的 RCE 風險，`call_mcp_tool` 對 stdio 類型的 server 預設不可用，要自己針對特定套件明確加白名單並鎖版本才能開。
- **公開自架時務必用 `--discovery-only`**：作者明講，若對外提供的 instance 開了 `call_mcp_tool`，等於架了一個任何人都能用的開放 proxy；官方 Dockerfile 預設就是 discovery-only 模式。
- **下游 server 回傳的內容一律當「不可信第三方資料」**：README 承認這只是「降低」prompt injection 風險而非解決，安全模型仍在演進中。

## 今日收穫

多數 MCP 聚合工具解的是「怎麼管理我已經裝好的一堆 server」，mcp-anything 解的是更前面一步的「我根本不知道該裝哪個」——用固定 token 成本的 5 個 meta-tool 把發現這件事交還給 agent 自己做。但它也老實承認了代價：把 LLM 對接到一個公開、任何人都能上傳的 registry，本質上就是把攻擊面從「你手動審過的幾個 server」擴大到「整個生態」，所以這類工具的核心賣點其實不是搜尋演算法，而是那層 SSRF guard、stdio 白名單、「不可信輸出」標記組成的安全策略。

## 參考資料

- [Dror-Bengal/mcp-anything — GitHub](https://github.com/Dror-Bengal/mcp-anything)：專案介紹、架構圖、Quickstart 指令、meta-tools 清單、安全模型、授權（MIT）皆出自官方 README。
- [MCP has a discovery problem. I built a meta-server that searches all 75,000 servers. — DEV Community](https://dev.to/dror_bengal_4d4388774752d/mcp-has-a-discovery-problem-i-built-a-meta-server-that-searches-all-75000-servers-30gm)：作者發佈文，說明各來源索引規模、設計取捨（BM25 而非 embedding）、與 MetaMCP / Composio Rube / 原生 tool search 的定位比較。
- [MCP 官方 registry](https://registry.modelcontextprotocol.io)：mcp-anything 索引的四個來源之一。
