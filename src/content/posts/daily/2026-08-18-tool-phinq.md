---
title: "工具推薦｜Phinq — 讓 Agent 動手前先問你，高風險操作攔下來再說"
date: 2026-08-18
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "開源的 Agent 執行期守門員：攔截每一次 tool call，依風險分級，不可逆操作暫停等你在 Telegram／Slack 上按核准，並留下防竄改的雜湊鏈稽核紀錄"
tldr: "Phinq 是一個開源的 Agent 執行期治理層，攔截 Agent 的每一次工具呼叫並依風險分級，可逆操作放行、不可逆操作（刪除、金流、憑證存取、大量操作）暫停等人核准。安裝：npx @phinq/phinq。解決了 Agent 無人看管時可能做出不可逆破壞、且事後沒有可信稽核紀錄的問題。"
series:
  name: "AI Tool of the Day"
  order: 3
---

> 🌏 [English version](/en/posts/daily/2026-08-18-tool-phinq-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | Phinq |
| 類型 | Runtime governance proxy / MCP gateway / SDK |
| GitHub | [phinq-co/phinq](https://github.com/phinq-co/phinq) |
| Stars | 5（2026-08 中在 Product Hunt 上架，"Launched this week"） |
| 語言 | TypeScript（proxy／SDK）、Python（governance skill 版本另有 PyPI 套件） |
| 授權 | MIT |
| 安裝 | `npx @phinq/phinq` |

## 解決什麼問題

你是否放心讓 Agent 在無人看管的狀態下跑一整晚的自動化？Phinq 的作者在 Product Hunt 貼文裡舉了兩個真實案例：今年四月一個 coding agent 在九秒內刪光了一家公司的正式環境資料庫和所有備份；另一起事件則是某家公司明明宣告了「凍結期」，Agent 還是清空了 1,206 筆高階主管的紀錄。這類事故不是假設題——Agent 拿到的工具越多、跑得越自主，一次判斷失誤造成的損害就越難挽回。

Phinq 的做法是在 Agent 和它能操作的世界之間插一層「執行期檢查點」：每一次工具呼叫先經過分類器判斷風險等級，可逆的動作（讀檔、查詢）直接放行；不可逆的動作（刪除、憑證存取、金流、大量寄信/大量操作）會被攔下來，透過 Telegram 或 Slack 推播「核准／拒絕」按鈕給你，超過 240 秒沒回應就自動拒絕。所有決策不論核准或拒絕，都寫進一份雜湊鏈（RFC 8785 JCS + SHA-256）稽核紀錄，任何一筆被竄改、刪除或調換順序都能被偵測出來。它另外提供 `phinq learn`，能把你過去核准／拒絕的紀錄整理成可引用的規則草案，讓「治理標準」隨時間累積而不是每次都要重新判斷。

適合場景：讓 Agent 在無人值守下長時間自動化跑任務（排程整理、批次處理、跨系統操作）的團隊；需要向客戶或稽核單位證明「有人類監督」的場景（作者提到 EU AI Act 已開始要求人類監督）；以及任何用 Claude Code、Codex、或其他 MCP 相容 Agent 執行會碰觸正式環境資源的工作流。

## 快速上手

### 安裝

```bash
# 互動精靈：自動偵測你在跑 Claude Code / Codex / Gemini CLI / Hermes / MCP，
# 問三個問題後印出要貼的那一行設定。預設是「只觀察不攔截」的 watch-only 模式。
npx @phinq/phinq
```

也可以從原始碼跑 proxy：

```bash
git clone https://github.com/phinq-co/phinq.git
cd phinq/proxy
npm install && npm run build && npm start
# 監聽在 127.0.0.1:5100
```

### 基本用法

把你的 Agent 指向 Phinq proxy 之後，先用 watch-only 模式觀察一陣子，確認分類結果符合預期，再打開強制攔截：

```bash
PHINQ_ENFORCE=1 \
PHINQ_TELEGRAM_BOT_TOKEN=*** \
PHINQ_TELEGRAM_CHAT_ID=*** \
npm start
```

啟用後，遇到高風險操作 Phinq 會透過 Telegram 推播「Approve / Deny」按鈕；也支援用 Slack（Socket Mode）取代 Telegram 做核准。

若不想跑獨立 proxy，也可以用 MCP gateway 模式，直接包住任何 stdio MCP server，不用改 Agent 或 server 本身：

```jsonc
// MCP client 設定（Claude Code、Codex 皆可）
{
  "mcpServers": {
    "filesystem": {
      "command": "phinq-mcp",
      "args": ["--enforce", "--",
               "npx", "-y", "@modelcontextprotocol/server-filesystem", "/data"]
    }
  }
}
```

### 進階用法

也提供 TypeScript SDK，直接嵌進自己寫的 Agent 程式碼裡做同步呼叫層級的把關：

```ts
import { PhinqGovernor } from "@phinq/governance";

const governor = new PhinqGovernor();
const { allowed } = await governor.gate(
  { name: "run_shell", args: { command } },
  { onHold: (req) => askOperator(req) }  // 回傳 "approve" | "deny"
);

if (allowed) await runTool();
```

## 與現有工具的比較

| | Phinq | 純靠 Prompt 交代規則 | 手動 code review |
|---|---|---|---|
| 執行期強制攔截（Agent 看不到被拒的呼叫） | ✅ | ❌（Agent 可能忽略指示） | ❌（事後才看得到） |
| 防竄改稽核紀錄（雜湊鏈） | ✅ | ❌ | 需自建 |
| 免人力即時盯著 | ✅（Telegram/Slack 通知） | ❌ | ❌ |
| 支援任何 MCP server 直接包一層 | ✅（`phinq-mcp` gateway） | — | — |
| 免費、開源 | ✅ MIT | — | — |

## 注意事項

- **分類目前主要看工具名稱，不是看參數**：作者在 Product Hunt 留言區承認，像 `delete_file` 這種具名工具目前是「看到就當作不可逆」，但同一個工具刪的是暫存檔還是唯一的正式環境備份，分類器現在還分不出來；透過 shell 執行的 `rm -rf` / `DROP TABLE` 雖然有做參數檢查，但目前偏保守（多半放行）。導入前建議先跑一段時間 watch-only 模式，確認分類結果符合你的風險認知。
- **專案非常新、維護者只有一人**：GitHub repo 是 2026-06-27 才建立，star 數僅個位數，長期維護狀況、issue 回應速度都還有待觀察，正式上線前建議自己讀過 proxy 的分類邏輯原始碼。
- **核准管道要自己架設**：Telegram 要透過 @BotFather 建 bot、Slack 要開 Socket Mode 並申請多個 token，這些前置設定要花時間；沒設定核准管道之前，Phinq 只能跑在 watch-only 模式，不會真的攔任何東西。

## 今日收穫

以前把「Agent 安全」想成事後補救——寫測試、盯 log、事故後複盤。Phinq 提醒我其實已經有人把這件事做成「執行期治理層」，跟這個網站在 `CLAUDE.md` 裡自己定義的 Tier 0～3 分級（自主執行／過閘門／先問再做／禁止）幾乎是同一種思路：不是信任 Agent 永遠判斷正確，而是把「哪些動作可逆、哪些不可逆」講清楚，讓不可逆的動作永遠停下來等人點頭。這種「治理即程式碼」的做法，接下來應該會越來越常見。

## 參考資料

- [phinq-co/phinq — GitHub](https://github.com/phinq-co/phinq)
- [phinq-co/phinq-governance — GitHub](https://github.com/phinq-co/phinq-governance)
- [Phinq: Stops AI agents before they break something — Product Hunt](https://www.producthunt.com/products/phinq)
- [Building Phinq: How a Cronjob Failure Forced Me to Redesign Agent Governance From Scratch — DEV Community](https://dev.to/hythamh/building-phinq-how-a-cronjob-failure-forced-me-to-redesign-agent-governance-from-scratch-47og)
