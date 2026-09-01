---
title: "工具推薦｜mcp-spend-guard — 幫每個 MCP server 加一個花費上限與斷路器"
date: 2026-09-02
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "mcp-spend-guard 是一個包住任意 stdio MCP server 的 proxy，用 SQLite 計數強制花費上限、每分鐘呼叫數、逾時斷路器和一個 touch 檔案就能觸發的緊急停止鍵"
tldr: "mcp-spend-guard 是一個開源的 MCP stdio proxy，替沒有內建限流機制的 MCP 協定補上花費上限、rate limit、斷路器和 kill switch。安裝：`pipx install .`。解決了 agent 陷入迴圈或被 prompt injection 誘導狂打付費 tool 卻沒有煞車的問題。"
series:
  name: "AI Tool of the Day"
  order: 18
---

> 🌏 [English version](/en/posts/daily/2026-09-02-tool-mcp-spend-guard-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp-spend-guard |
| 類型 | MCP stdio proxy（花費上限 + rate limit + 斷路器 + kill switch） |
| GitHub | [waseemnasir2k26/mcp-spend-guard](https://github.com/waseemnasir2k26/mcp-spend-guard) |
| Stars | 1 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `pipx install .`（或 `pip install .`，尚未上 PyPI） |

## 解決什麼問題

你是否接過一個 MCP server，然後放心讓 agent 自己決定要呼叫幾次？MCP 協定本身沒有內建任何限流機制——一個卡在迴圈裡的 agent 可以對同一個付費 tool（搜尋 API、圖片生成、企業級 SaaS 呼叫）連打幾百次，直到你自己發現帳單或 log 才驚覺;更麻煩的是,如果 fetch 回來的網頁內容裡藏了 prompt injection，誘導模型對一份 CSV 的每一列都呼叫一次昂貴的 enrichment tool，這種攻擊面完全不需要 agent 本身「壞掉」，client 端也沒有任何機制能攔下來。

mcp-spend-guard 是一個插在 MCP client 和真正的 MCP server 之間的 stdio JSON-RPC relay：它把子行程開起來，逐行轉發 JSON-RPC frame，唯一會攔下的請求是撞到上限的 `tools/call`。上限寫在一份 YAML 裡——總呼叫數、每分鐘呼叫數、估算花費上限（每個 tool 自己填一個單價）、wall-clock timeout，外加一個「N 次連續錯誤就跳斷路器」的機制。所有計數存在本機 SQLite,重開機或 client 斷線重連都不會歸零。想緊急煞車時,在另一個 terminal `touch STOP` 就好,不用改設定、不用重啟。

適合場景：你的 agent 串了任何按次計費或有明確成本的 MCP tool（搜尋、圖片生成、第三方付費 API），想要一個不依賴 agent 自律、也不用自己在應用層寫節流邏輯的硬煞車;或是純粹想知道「這個 session 到底打了幾次、花了多少」，跑一次 `mcp-spend-guard report` 就有答案。

## 快速上手

### 安裝

```bash
pipx install .        # 或：pip install .
```

### 基本用法

```yaml
# guard.yaml
server:
  command: npx
  args: ["-y", "@acme/search-mcp"]

limits:
  max_calls_total: 200
  max_calls_per_minute: 30
  max_spend_usd: 5.00

costs:
  tools:
    web_search: 0.01

safety:
  kill_switch_file: ./STOP
  circuit_breaker_errors: 5
```

```diff
 {
   "mcpServers": {
     "search": {
-      "command": "npx",
-      "args": ["-y", "@acme/search-mcp"]
+      "command": "mcp-spend-guard",
+      "args": ["run", "-c", "/abs/path/to/guard.yaml"]
     }
   }
 }
```

```bash
# 看這個 session 花了多少、被擋了幾次
mcp-spend-guard report
```

### 進階用法

```bash
# 從另一個 terminal 立刻凍結所有呼叫
touch STOP
# 恢復正常
rm STOP
```

上限第一個被撞到的會直接回傳一個乾淨的 JSON-RPC 錯誤，agent 看到的不是卡死，是明確的拒絕原因：

```json
{"jsonrpc":"2.0","id":3,"error":{"code":-32011,
 "message":"mcp-spend-guard blocked this call [max_spend_usd]: spend cap reached: $0.2000 estimated spend, this call adds $0.1000, limit $0.2500",
 "data":{"cap":"max_spend_usd","limit":0.25,"current":0.2,"tool":"web_search","guard":"mcp-spend-guard"}}}
```

## 與現有工具的比較

| | mcp-spend-guard | 自己在應用層寫節流 | LLM provider 的用量上限（OpenAI/Anthropic 帳號層級） | mcp-guardrail（tool 層級准駁） |
|---|---|---|---|---|
| 針對「單一 MCP tool」設花費上限 | ✅ | 需自行實作 | ❌（只管模型 token，不管下游 MCP tool） | ❌（管的是能不能叫，不是叫多貴） |
| 計數跨重啟／重連不歸零 | ✅（SQLite） | 需自行實作 | ✅（provider 端） | 視實作而定 |
| 一個檔案就能緊急煞車 | ✅（kill switch file） | 需自行實作 | ❌（通常要進後台改設定） | ❌ |
| 換掉哪個 MCP server 都能套用 | ✅（proxy 層，與 server 無關） | — | — | ✅（同樣是 proxy 層） |
| 解決「哪些 tool 能叫」vs.「叫太多次」 | 只管花費/次數 | — | — | 只管准駁，互補而非取代 |

## 注意事項

- **花費是估算,不是實際帳單**：單價由你自己填在 `costs.tools` 裡，guard 完全看不到任何 provider 的真實發票——估錯了上限就跟著錯，該當斷路器用，不能拿來對帳。
- **目前只支援 stdio**：HTTP／SSE transport 的 MCP server 還沒被包住，README 自己列在待辦清單裡。
- **計費粒度是每次呼叫,不是每個 token**：輸入大小會影響實際成本的 tool，沒辦法精準建模；而且一台機器包五個 server 就要五份設定，除非刻意共用同一個 `db_path` 和 `session_id`，否則預算不會互通。剛發佈不到一天,只有單一貢獻者、1 顆星,schema 之後可能還會調整。

## 今日收穫

MCP 生態這一年一直在補「這個 agent 能連上哪些 server、能叫哪些 tool」的准駁層（像上週介紹過的 mcp-guardrail），但「叫了之後到底花了多少、會不會停不下來」是另一個完全獨立的維度——准駁答不出「值不值得」，只有計量機制答得出來。兩者疊在一起，才算是把「agent 自己決定要不要用某個 tool」這件事真正收攏成人可以掌握的邊界。

## 參考資料

- [mcp-spend-guard GitHub repo](https://github.com/waseemnasir2k26/mcp-spend-guard)：專案介紹、README、安裝指令、config schema、運作架構、授權（MIT）均出自官方 README。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
