---
title: "工具推薦｜agent-codemode — 讓 Coding Agent 自己寫腳本呼叫 MCP server，省下 99% context"
date: 2026-08-19
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "CLI + TypeScript SDK，把 Claude Code 已經認證好的 MCP server 讀出來給你的腳本直接呼叫，一個 script 取代幾十次 tool call round trip，不用另外設 API key 或走 OAuth"
tldr: "agent-codemode 是一個開源 CLI/SDK，讓 Coding Agent 寫的腳本直接呼叫你已經在 Claude Code／Cursor／Windsurf 裡認證好的 MCP server。安裝：npm install -g agent-codemode。解決了 Agent 逐次呼叫 MCP tool 時因為模型要在每一步之間插話、耗費大量 context 的問題（作者實測案例省下 99.66% token）。"
series:
  name: "AI Tool of the Day"
  order: 4
---

> 🌏 [English version](/en/posts/daily/2026-08-19-tool-agent-codemode-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | agent-codemode |
| 類型 | CLI + TypeScript SDK |
| GitHub | [janwilmake/agent-codemode](https://github.com/janwilmake/agent-codemode) |
| Stars | 8（2026-08-18 才建立） |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npm install -g agent-codemode` |

## 解決什麼問題

你是否用過 Agent 連著多個 MCP server（Linear、Slack、GitHub…）做跨系統整理，結果一個任務要跑幾十次 tool call，每次呼叫完模型都要停下來讀結果、決定下一步，整個 context window 被灌爆，速度也慢？作者在 README 裡給了一個實測數字：同一個任務（抓出所有 In Progress 的 Linear ticket、讀完整內容、數「mcp」出現幾次）用傳統逐次 tool call 做，40 次來回吃掉 262,159 字元（約 65,500 tokens）；換成寫一支腳本一次做完，只要 903 字元（約 226 tokens）——省下 99.66%。

agent-codemode 的做法是把「呼叫 MCP server」這件事從「每一步都要模型介入的 tool call」，變成「Agent 一次寫好、一次跑完的 TypeScript 腳本」。它會直接讀取你電腦上 Claude Code、Cursor、Windsurf、VS Code、Gemini CLI 等工具已經設定好、已經認證過的 MCP server 清單（macOS 走 Keychain，其他平台讀 `~/.claude/.credentials.json` 之類的設定檔），不用你另外申請 API key 或重新走一次 OAuth。它還會依照 server 當下實際提供的 tool schema，動態產生有型別的 TypeScript client，讓 Agent 寫程式時能拿到型別檢查，而不是憑印象亂猜參數名稱。

適合場景：需要一次串接多個 MCP server 做批次整理或跨系統查詢的 Coding Agent 工作流（例如同時查 Linear 進度、Slack 討論、log 系統再彙整成報告）；已經在用 Claude Code／Cursor 之類工具、不想為了寫個腳本再管一組獨立密鑰的開發者。

## 快速上手

### 安裝

```bash
npm install -g agent-codemode
# 也會裝一個較短的別名
codemode --help
```

### 基本用法

```bash
# 列出目前所有已認證的 MCP server
agent-codemode servers

# 看某個 server 有哪些 tool
agent-codemode tools linear

# 直接呼叫一個 tool（適合單次查詢，不寫腳本）
agent-codemode call linear listIssues --arg assignee=me --arg limit:=50
```

### 進階用法

```ts
// 先產生型別定義
// agent-codemode types --all

import { mcp } from "agent-codemode";

// Agent 自己寫的腳本：一次平行打三個不同 MCP server，
// 中間不需要模型介入判斷下一步
const [issues, events, channel] = await Promise.all([
  mcp.linear.listIssues({ assignee: "me", limit: 50 }),
  mcp.axiom.queryDataset({ apl: "['prod'] | where _time > ago(24h)" }),
  mcp.slack.slackSearchChannels({ query: "general" }),
]);
```

## 與現有工具的比較

| | agent-codemode | 逐次 tool call | 自己寫一次性串接腳本 |
|---|---|---|---|
| 免另申請 API key／OAuth（直接借用 Claude Code 的認證） | ✅ | ✅（本來就是 Agent 內建） | ❌（要自己管密鑰） |
| 多個 tool call 合併成一次 round trip | ✅ | ❌ | ✅（但要手刻） |
| 型別檢查（依 server 實際 schema 動態產生） | ✅ | ❌ | 視自己有沒有寫 |
| 跨 Claude Code／Cursor／Windsurf／VS Code／Gemini CLI 通用 | ✅ | 視各 Agent 實作而定 | ❌ |
| 開源、免費 | ✅ MIT | — | — |

## 注意事項

- **非 macOS 平台目前只有部分支援**：完整的 Keychain 讀取只在 macOS 上驗證過，Linux／Windows 靠讀取 `~/.claude/.credentials.json` 等設定檔運作，作者在 README 裡明講這條路徑「partial support」，用之前建議先跑 `agent-codemode servers` 確認能不能正常列出。
- **claude.ai 的 connector 還不支援**：因為那類 connector 的認證方式不同，要支援等於要模擬 Claude Code 本身，作者目前還沒做。
- **專案非常新**：GitHub repo 是 2026-08-18 才建立，star 數個位數、只有作者一人維護，長期穩定性和 issue 回應速度都還有待觀察，正式導入前建議先讀過原始碼確認憑證讀取邏輯符合預期。

## 今日收穫

MCP 把「Agent 能存取什麼系統」標準化了，但沒解決「Agent 每呼叫一次 tool 就要讓模型停下來想一次」這個效率問題——這其實跟 Anthropic 自己在探討的「code execution with MCP」是同一個方向：與其讓模型逐步下指令，不如讓它一次寫完整段邏輯再執行。agent-codemode 把這個模式做成了一個直接借用現有 Agent 認證、不用另外管密鑰的小工具，算是把這個模式落地成一行 `npm install` 就能用的東西。

## 參考資料

- [janwilmake/agent-codemode — GitHub](https://github.com/janwilmake/agent-codemode)
- [agent-codemode — npm](https://www.npmjs.com/package/agent-codemode)
