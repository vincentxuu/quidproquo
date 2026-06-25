---
title: "Code Mode：把 tool definition 從 context 搬進 code"
date: 2026-05-10
type: deep-dive
category: ai
tags: [mcp, agent, code-mode, runtime, context-engineering, anthropic, cloudflare]
lang: zh-TW
tldr: "別再把所有 tool description 在 session 開頭一次塞進 context。讓 model 寫 code、runtime 執行，tool 定義只在 import 那行才進 context — Anthropic 的 GDrive→Salesforce 範例從 ~150K tokens 降到 2K，Cloudflare 的 2,500 endpoints schema 從 1.17M 降到 1K。"
description: "Anthropic 11/4 與 Cloudflare 接連發表 Code Mode 模式，重新定義 agent 工具呼叫：tool 是被 import 的 module，不是 prompt 裡的 schema。"
draft: false
---

🌏 [English version](/posts/ai/2026-05-10-code-mode-mcp-runtime-pattern-en)

四月那篇〈[MCP vs CLI vs API：Agent 工具介面的真實分界](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)〉處理的是「定位」：API 是 base layer，五種包裝各有適用場景，MCP 唯一站得住的護城河只剩「跨 host 共享」。但那篇沒處理一個更實務的問題——**就算選對了介面，為什麼一個 agent workflow 動不動就燒掉 100K 以上的 tokens？**

2025 年 11/4 [Anthropic engineering blog](https://www.anthropic.com/engineering/code-execution-with-mcp) 跟稍後 [Cloudflare blog](https://blog.cloudflare.com/code-mode-mcp/) 接連給了一致的答案：問題不在協定，在「eager loading」這個習慣。修法是讓 model 寫 code，把 tool 從 prompt schema 改成被 import 的 module。這個 pattern 開始被叫做 **Code Mode**。

## 問題不是 MCP，是 eager loading

主流 agent host 的預設行為是：session 一啟動，就把所有 connected tool 的 description 載入 context。Tool 越多，初始 context 越胖。

```
傳統做法（eager loading）
┌──────────────────────────────────┐
│ Session 啟動                      │
│ ├─ Playwright MCP    13.7K       │
│ ├─ Chrome DevTools   18K         │
│ ├─ GitHub MCP        ~8K         │
│ ├─ Slack MCP         ~6K         │
│ ├─ Notion MCP        ~10K        │
│ ─────────────────────            │
│ 開工前已用：~55K tokens           │
└──────────────────────────────────┘
                 ↓
    每個 step 又把 tool output 餵回 model
                 ↓
    單一 workflow 膨脹到 150K+ tokens
```

這不是 MCP 獨有的問題。OpenAPI tools、平台 Actions、function calling 都會踩到——只要「tool description 在 prompt 裡」這個前提成立，多 tool 環境就回不去。

## Code Mode：tool 是被 import 的 module

Code Mode 的翻轉只有一句話：**tool 定義不放 prompt，放 module；agent 不填參數，寫 code。**

```
Code Mode
┌────────────────────────────────────┐
│ Model context 起始：runtime 簡介    │
│   + 「你可以 import @tools/<name>」  │
│ ─────────────────────               │
│ 開工前用：< 1K tokens                │
└────────────────────────────────────┘
                 ↓
        Model 寫一段 TS / bash
                 ↓
        Runtime 執行 → 結果回 model
                 ↓
    tool 定義只在 import 那一行進 context
    data 只在 model 真的需要看時才進 context
```

Workflow 燒這麼多 token，主要是兩件事疊加：(a) 開頭就把所有 tool schema 灌進去；(b) 每個 step 把 tool output 整包丟回 model。Code Mode 兩件事一起治：tool 定義 lazy 化，data 在 code 裡 reduce 完才回 model。

### Anthropic 的範例：GDrive → Salesforce

把 Google Drive 的會議逐字稿同步進 Salesforce CRM。

| | 老做法 | Code Mode |
|---|---|---|
| Tool schema 載入 | GDrive + Salesforce 兩份 schema 從一開始就在 context | `import { getDoc } from "@tools/gdrive"`、`import { updateAccount } from "@tools/salesforce"` 兩行 |
| Transcript 流向 | model → tool → model → tool（過 model 兩次） | 在 runtime 內以變數傳遞，model 只看摘要 |
| 總 token | ~150K | ~2K |

98.7% 的下降來自兩件事：tool schema 不再常駐、原始 transcript 不再過 model。

### Cloudflare 的極端版本

Cloudflare 把整個 2,500 endpoints 的 API schema（1.17M tokens）壓成兩個函式：

```typescript
search(query: string): EndpointDescriptor[]
execute(endpoint: string, params: object): unknown
```

Agent 看到的初始 context 只有 ~1K tokens——「有 search、有 execute、想用什麼自己撈」。需要做事就先 `search` 找 endpoint，再 `execute`。當 schema 規模超過某個門檻，**目錄式查找比 schema-in-prompt 更便宜**，這個門檻其實比想像中低。

## 兩種 primitive：bash + typed import

Code Mode runtime 不是只能跑 TypeScript。實務上是兩種 primitive 混搭，agent 自己決定哪個任務用哪個。

```
        Code Mode runtime
       ┌──────┴──────┐
       ▼             ▼
     bash       typed module import
   (已安裝)      (內部 / 專屬 API)
       │             │
   git, curl,    @tools/salesforce
   grep, jq      @tools/stripe
   ffmpeg...     @tools/internal-*
```

**bash**：所有已經放在 `$PATH` 裡的東西。LLM 在訓練資料裡看過幾百萬筆 `git log`、`grep -r`、`curl | jq` 的範例，幾乎不需要 description 就能用對。要找所有 import pandas 的 Python 檔？

```bash
grep -r "import pandas" --include="*.py" .
```

不需要 tool 定義。Shell 自己就是介面。

**Typed module import**：給沒有現成 CLI、又進不了 LLM training data 的東西——內部系統、企業 SaaS、私有 API。每個 tool 寫成一個 TS 檔，input/output 型別寫清楚，agent 用到才 import。

這兩塊剛好接住前一篇〈MCP vs CLI vs API〉裡的兩條線：CLI 在訓練覆蓋上贏熟悉的；typed import 在新東西上補上 schema 缺口。差別是 Code Mode 把它們塞進**同一個 runtime**，不再是「選一個架構」的二選一。

## 寫起來像這樣

```typescript
import { searchFiles } from "@tools/github";
import { sendMessage } from "@tools/slack";

const files = await searchFiles({ pattern: "*.py", path: "./src" });
const summary = files.map(f => f.path).join("\n");

await sendMessage({
  channel: "#engineering",
  text: `Found ${files.length} Python files:\n${summary}`,
});
```

這幾行裡有三件以前的做法做不到的事：

1. **Tool 定義 lazy 化**：runtime 裡可能有 50 個 tool，但這次任務 model context 只進 `searchFiles` 跟 `sendMessage` 兩份
2. **Data 在 code 裡 reduce**：完整檔案清單從來不過 model，model 只看到 `summary`
3. **控制流是 code**：迴圈、條件、map/filter 都是 runtime 在跑，不是每一步丟回 model

## 老做法 vs Code Mode

| 維度 | Tool-in-prompt | Code Mode |
|---|---|---|
| Tool 定義何時進 context | Session 開頭，全部 | Import 那一行 |
| Tool output 流向 | 每步回 model | code 裡傳遞，必要時才回 model |
| 多 tool 成本 | 線性疊加 | 幾乎為零（沒用就沒成本） |
| 控制流（loop / branch） | 透過 model round-trip | runtime 直接跑 |
| 失敗場景 | 同時 connect 太多 server 直接爆 context | runtime quota / 沙箱錯誤 |
| 對 LLM 能力要求 | function calling 即可 | 寫得出 TS / bash |

不是免費午餐——Code Mode 假設 model 寫得出可執行的 code，這對 frontier model 沒問題，對小模型是門檻。

## 「MCP 是死了嗎？」

不是。Anthropic 在同一篇文章揭露：MCP SDK 下載量從年初的 100M 到現在的 300M，是 agent 基礎設施裡成長最快的一塊。

死掉的是「session 開頭把所有 tool schema 灌進 prompt」這個習慣。MCP 還是寫 tool 的標準介面，只是 host 端的消費方式變了——

```
舊：MCP server → tool list 灌進 prompt → model 用 function call 呼叫
新：MCP server → 包成 typed module → 進 Code Mode runtime → model import 用
```

協定還在，包裝變了。對寫 MCP server 的人沒影響；對組 agent host 的人，工作量從「設計 prompt」轉到「設計 runtime」。

## 整體來說

把上一篇〈[MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)〉跟這篇接起來看，會看到一條清楚的演化：

> **介面之爭結束了，剩下的是 runtime 設計。** MCP / OpenAPI / CLI 都不是 runtime，它們是 runtime 組裝的 primitive。Code Mode 就是把它們組裝起來的 runtime。

實務上要不要立刻搬到 Code Mode？兩個前提：

- 同時連 5 個以上 tool source、context 已經吃緊——值得搬
- 只接一兩個 tool、prompt 還清爽——眼前不缺這層基礎建設

但中長期方向不再有第二個答案：**tool definitions 屬於 code，不屬於 context**。

## 參考資料

- [MCP vs CLI vs API：Agent 工具介面的真實分界](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)（站內前文）
- [Anthropic — Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [Cloudflare — Code Mode: the better way to use MCP](https://blog.cloudflare.com/code-mode-mcp/)
- [Akshay Pachaar — MCP vs CLI was the wrong debate](https://x.com/akshay_pachaar/status/2053166970166772052)
- [Model Context Protocol 官方網站](https://modelcontextprotocol.io/)
