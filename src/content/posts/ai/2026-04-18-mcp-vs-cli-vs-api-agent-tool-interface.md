---
title: "MCP vs CLI vs API：Agent 工具介面的真實分界"
date: 2026-04-18
category: ai
tags: [mcp, agent, cli, api, claude-code, tool-use]
lang: zh-TW
tldr: "MCP 不會退場，但有效範圍比想像中窄。本機開發場景 CLI 和 raw API 幾乎都贏過 MCP；MCP 真正不可替代的，是「跨 agent 共享的本機工具層」這條窄縫。"
description: "拆解 Agent 操作工具的五種姿勢——CLI、生成 code、通用 HTTP tool、OpenAPI/Actions、MCP——並指出 MCP 在每個維度上的真實對手與唯一護城河。"
draft: false
---

「MCP 將退場，輕量化 CLI 介面崛起」最近被反覆討論。Claude Code、Codex CLI、Gemini CLI 都把 bash 當一等公民，跳過 MCP 也活得很好；同時又有人說 MCP 是 agent 生態的 USB-C，沒它不行。這篇把命題拆開，攤開 agent 操作工具的五種姿勢，指出 MCP 在每個維度上的真實對手，以及它唯一站得住的位置。

## Agent 操作工具的五種姿勢

通常我們會把這個問題簡化成「MCP vs CLI」，但這是壓扁的二元。實際上 agent 消費工具有五條路：

```
              Agent 想做事
                   │
   ┌───────────────┼───────────────┐
   ▼               ▼               ▼
 生成 code      Tool call       Shell exec
 (寫再跑)       (填參數)         (CLI 包)
                   │
       ┌───────────┼───────────┬─────────────┐
       ▼           ▼           ▼             ▼
  通用 HTTP    OpenAPI      平台 Actions    MCP
  tool        as tools     (代管 secret)    server
```

這五種裡，**API 才是 base layer**——CLI、SDK、MCP、Actions、OpenAPI tools 都是 API 的不同包裝。所以真正要問的不是「MCP 還是 CLI」，而是「在這個 base layer 上，哪一層包裝對 agent 最友好」。

## 隱性變數：訓練資料覆蓋度

LLM 對工具的「熟悉度」極不平均，這是決定成功率的關鍵變數，但常被忽略。

```
        LLM 使用成功率
          │
    raw API ─────────── 熱門服務（GitHub、Stripe）：超高
          │             冷門服務：極低
          │
    CLI  ─────────────  熱門 CLI（gh、git、kubectl）：超高
          │             冷門 CLI：不穩
          │
    SDK  ─────────────  熱門 SDK：高
          │
    MCP  ─────────────  整體中等偏不穩
          │             （取決於 tool description 品質）
          └──────────────────────▶ 服務熱門度
```

關鍵在於：`curl` 加上熱門服務的 REST API，在 training data 裡有**百萬筆 Stack Overflow 與 blog 範例**；MCP server 是 2024 年下半年才大量出現，在 training data 裡幾乎是零。即使 tool description 寫得再好，LLM 對「熟悉的協定 + 熟悉的服務」的成功率仍然更高。

這條對 MCP 是最沉重的論點：**它是個新協定，而 LLM 熟悉舊東西**。

## 三個軸決定該選誰

| 軸 | 兩端 | 影響 |
|---|---|---|
| Host 端 | 有 shell / code interpreter ↔ 無 shell（純 chat UI） | 沒 shell 就不能 CLI、不能 generate code |
| Target 端 | 有成熟 CLI / 熱門 API ↔ GUI-only SaaS | 沒 CLI 也沒文件齊全的 API，agent 等於失明 |
| 權限 | Agent 可直接持有 secret ↔ Secret 必須與 LLM 隔離 | 企業、多租戶、audit log 場景必須隔離 |

把三個軸交叉，可以畫出一張更老實的選擇表：

| 場景 | 推薦 | 理由 |
|---|---|---|
| 本機 Claude Code、寫程式 | CLI / 生成 code | shell + 訓練覆蓋雙重加持 |
| 本機 agent 操作熱門 SaaS（GitHub） | CLI（`gh`） | LLM 早就用熟，不需要任何包裝 |
| 本機 agent 操作冷門內部系統 | 自訂 MCP server | 沒 CLI 又要重複用 |
| Claude Desktop 使用者操作 Notion | MCP | 沒 shell、有 secret 要代持 |
| ChatGPT 操作 Salesforce | 平台 Actions | 平台代持 secret，使用者零安裝 |

注意：**只有最後兩列是 MCP / Actions 真正擅長的場景**，其他列 CLI 或生成 code 通常更香。

## 五種方式正面對比

| 方式 | Schema 來源 | Secret 由誰持 | 訓練覆蓋 | 跨 agent 共享 | 代表 |
|---|---|---|---|---|---|
| 生成 code | 無（看 docs） | env / prompt | ⭐⭐⭐ | ❌ | Claude Code、Code Interpreter |
| 通用 HTTP tool | 無（LLM 填） | prompt | ⭐⭐⭐ | ❌ | `http_request(url, ...)` 工具 |
| OpenAPI tools | API 提供者 | prompt / proxy | ⭐ | 難 | 早期 ChatGPT Plugins |
| 平台 Actions | API + 平台 | 平台代持 | ⭐ | ❌（綁平台） | ChatGPT Actions |
| MCP server | server 作者 | server 代持 | ⭐ | ✅ | Anthropic MCP 生態 |
| CLI | 工具作者 | env / keychain | ⭐⭐⭐（熱門） | ❌ | `gh`、`wrangler`、`psql` |

把這張表反過來看，會發現 MCP 原本宣稱的三個賣點，每個都有對手：

- **結構化 schema**：OpenAPI 早就有，且 API 廠商本來就在寫
- **Server 代持 secret**：平台 Actions 也做得到（差別是「使用者本機 server」vs「平台代管」）
- **跨 agent 共享**：✅ 這條是 MCP 真正獨家——一個 MCP server 可以同時被 Claude Desktop、Cursor、VS Code agent 使用，OpenAPI / Actions / CLI 都做不到

## MCP 真正的護城河，只有「跨平台共享」

這也是它最初的設計意圖。一旦離開這個位置，每個方向都有更輕、更熟的替代方案：

```
┌────────────────────────────────────────────────────────────┐
│  MCP 唯一不可替代的交集                                    │
│                                                            │
│  ① Host 不能生成 code、不能開 shell                        │
│  ② Target 沒有現成 CLI 或熱門 API（LLM 用不熟）            │
│  ③ Secret 不該給 LLM 也不該交給 agent 平台代管             │
│  ④ 同一組工具要被多個 agent host 共享                      │
│                                                            │
│  四個條件同時滿足，才是 MCP 非它不可                        │
└────────────────────────────────────────────────────────────┘
```

第 ④ 條尤其關鍵——這是其他四種方式都做不到的。寫一個 Notion MCP server，Claude Desktop、Cursor、未來的某個 IDE agent 都能直接用，不用各自重寫整合。這個「一次實作、多 host 共享」的價值，是 MCP 唯一站得住腳的地方。

反過來說，**那些只在單一 agent host 用的 MCP server，其實都在硬蹭協定**——用 CLI 或 code interpreter 通常更直接。

## 整體來說

「MCP 退場 vs 崛起」是個假命題。比較準確的描述是：

> MCP 從「agent 的 USB-C」這個過度期待，正在收斂回它真正站得住的位置：**跨平台共享的本機工具層**。其他場景——本機開發者、熱門 SaaS、純 chat UI——各自都有更輕、訓練覆蓋更好的替代方案。

MCP 不會消失，因為「跨 agent host 共享工具」的需求是真實的、無可替代的。但它也不會吃下整個 agent 工具市場——因為對開發者場景，shell + 熱門 CLI / API 的組合幾乎總是更快、更準、更省 context。

我們不需要 MCP 不見，需要它停止承擔不該承擔的角色。

## 參考資料

- [Model Context Protocol 官方網站](https://modelcontextprotocol.io/)
- [Anthropic MCP 公告](https://www.anthropic.com/news/model-context-protocol)
- [Claude Code 官方文件](https://docs.anthropic.com/en/docs/claude-code/overview)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [ChatGPT Actions 文件](https://platform.openai.com/docs/actions)
- [GitHub CLI (`gh`)](https://github.com/cli/cli)
- [Simon Willison 的 blog（持續寫 LLM tool use 觀察）](https://simonwillison.net/)
- [Armin Ronacher 的 blog（多次評論 MCP 設計）](https://lucumr.pocoo.org/)
