---
title: "AI Agent GitHub Digest — 2026-10-23"
date: 2026-10-23
category: daily
tags: [ai-agent, github, open-source, daily, agent-framework, context-engineering, mcp]
lang: zh-TW
description: "「自我改進」從論文走進日常 CLI——hermes-agent 和 prime-agent 都把學習迴圈當主打功能出貨，context-mode 則用官方宣稱 98% 的壓縮率證明 context 爆炸有多普遍"
tldr: "**NousResearch/hermes-agent**（25.6 萬★）把『自我改進』做成主打功能——會自己建 skill、自己改進 skill，還能跨 Telegram/Discord/Slack/WhatsApp/Signal 同一個 gateway process 跟你對話；**PrimeIntellect-ai/prime-agent**（2.2 萬★）用『Continual Harness』讓 agent 在工作過程中小幅自我修改補充指引，留有 snapshot 可回滾；**vercel/eve**（5,653★）是 Vercel 官方做的檔案系統優先 agent 框架；**mksglu/context-mode**（3.2 萬★，曾登上 Hacker News 第一名）官方宣稱一般情況可把工具輸出壓縮 98%。Release：Composio 新增 session hooks，能在 agent 呼叫工具前後直接攔截封鎖；Microsoft Flint 正式發布 1.0，MCP server 和 npm 套件同時支援互動式圖表。"
series:
  name: "AI Agent GitHub Digest"
  order: 69
---

> 🌏 [English version](/posts/daily/2026-10-23-ai-agent-github-digest-en)

## 今日亮點

今天兩個分量不小的 agent CLI——hermes-agent 和 prime-agent——都把「自我改進」當成主打功能直接出貨，不再只是論文或 demo 裡的概念；同一天 context-mode 靠著曾經登上 Hacker News 第一名，衝上 3 萬多顆星，說明「context 爆炸」是多少人在真實踩的痛點；而 Composio 和 Microsoft Flint 則分別從「攔截執行」和「圖表能力」兩個更具體的切角，把 agent 基礎設施往前推一步。

## Trending Repos

### vercel/eve ⭐ 5,653

[GitHub](https://github.com/vercel/eve)　·　TypeScript　·　Apache-2.0

- **是什麼**：Vercel 官方做的「檔案系統優先」agent 框架——agent 的 instructions、tools、skills、channels、schedules 全部對應到固定的目錄結構，而不是寫在某個 SDK 的物件設定裡。
- **為什麼值得看**：多數 agent 框架（LangGraph、Mastra）還是以程式碼／API 設定為主，eve 把整個 agent 的設計攤開成可以直接讀的檔案樹；接 Slack／Discord／HTTP channel 或加 cron schedule，都是加資料夾而不是寫 orchestrator，還內建跟 Vercel 平台整合的一鍵部署和「Sign in with Vercel」的 Web Chat。
- **Tech stack**：TypeScript + Vercel AI Gateway（模型路由）+ Zod（工具 schema）
- **上手難度**：低——`npx eve@latest init` 一行建專案，但要用 Web Chat 部署需要 Vercel 帳號。

---

### PrimeIntellect-ai/prime-agent ⭐ 22,266

[GitHub](https://github.com/PrimeIntellect-ai/prime-agent)　·　Rust　·　MIT

- **是什麼**：PrimeIntellect-ai 做的開源 coding／research agent，核心是「Recursive Language Model（RLM）」——把 context 當變數、把 subagent 呼叫當 function call，整套跑在一個長駐的 Python REPL 裡，加上「Continual Harness」讓 agent 能在工作過程中小幅自我修改補充指引（不動基礎 system prompt）。
- **為什麼值得看**：跟 Claude Code、Codex 這類 CLI coding agent 最大的差異，是「自我改進」真的做成可呼叫的 `/refine` 指令，而且留有 snapshot 可以回滾；agent 之間還能互相傳訊息、互相協調，session 用 daemon 跑，終端機斷線後可以重新接上繼續看進度。
- **Tech stack**：Rust 核心 + Python REPL sandbox + MCP（接 Slack 等外部工具）
- **上手難度**：中——一行安裝腳本就能跑，但要先理解 RLM／Continual Harness 這套新抽象才能用好。

---

### NousResearch/hermes-agent ⭐ 256,186

[GitHub](https://github.com/NousResearch/hermes-agent)　·　Python　·　MIT

- **是什麼**：NousResearch 做的「自我改進」agent CLI 加 gateway，官方說法是唯一內建學習迴圈的 agent——會從經驗建立 skill、在使用過程中讓 skill 自己變好、定期把重要資訊存成跨 session 的長期記憶，還能用同一個 gateway process 跨 Telegram、Discord、Slack、WhatsApp、Signal 跟你對話。
- **為什麼值得看**：內建的 `hermes claw migrate` 指令，透露它是接續（或吸收）前一個叫 OpenClaw 工具的使用者；規模上 25.6 萬顆星、5.6 萬 fork 已經是量級很大的專案，還提供六種執行環境後端（本機、Docker、SSH、Modal、Daytona、Vercel Sandbox），其中 Daytona／Modal 兩個是閒置時會休眠、幾乎不花錢的無伺服器選項。
- **Tech stack**：Python + 多平台 gateway + FTS5 全文搜尋（session 記憶）+ 相容 agentskills.io 開放標準
- **上手難度**：低——一行安裝腳本能跑起來，但要完整發揮多平台 gateway 和排程功能，得花時間設定每個通訊平台自己的憑證。

---

### mksglu/context-mode ⭐ 31,807

[GitHub](https://github.com/mksglu/context-mode)　·　TypeScript　·　ELv2（Elastic License v2，非完全開源，商用前建議先讀授權條款）

- **是什麼**：在 agent 讀到工具輸出、log 之前先做 context 壓縮的 MCP server 加 hooks，官方宣稱一般情況可以把工具輸出減少 98%，同時用 hooks 在 17 個平台（Claude Code、Codex、Cursor、Kiro、Zed 等）上強制一套 context 的 routing 規則。
- **為什麼值得看**：跟昨天介紹過的 headroom 解的是同一塊問題（送進 LLM 前先瘦身），但 context-mode 走的是 MCP + hooks 雙管道而不是 proxy；曾衝上 Hacker News 第一名（570 分以上），3.1 萬顆星的成長速度也說明「context 爆炸」這個痛點有多普遍。
- **Tech stack**：TypeScript + MCP server + 17 個平台的 hooks 整合
- **上手難度**：中——裝起來快，但要針對每個使用的 agent 平台（Claude Code／Codex／Cursor…）分別設定 hooks 才能完整生效。

## Notable Releases

### Composio @composio/slim@0.27.0

[Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fslim%400.27.0)

- **重要變更**：新增 session hooks，可以在 agent 呼叫工具「之前」擋下整次呼叫，或在工具回應「之後」擋下結果再讓 agent 看到；`create()`／`update()` 都接受 `hooks` 參數，被攔截的呼叫會回傳 `resultType: 'blocked'`，並附上攔截原因。
- **Breaking Changes**：`session.proxyExecute()` 和 `ctx.proxyExecute()` 現在回傳 `resultType: 'completed'` 或 `'blocked'`，被擋的請求沒有 HTTP response，原本讀 `status` 欄位的 TypeScript 程式要先改成檢查 `resultType`。
- **對你的影響**：如果你在用 Composio 幫 agent 接外部工具，這版等於多了一層「執行期防火牆」——可以直接寫規則擋掉特定 toolkit（例如範例裡的「不准寄信給 example.org 以外的人」），不用再自己包一層攔截邏輯。

---

### Microsoft Flint 1.0「Interactivity」

[Release Notes](https://github.com/microsoft/flint-chart/releases/tag/1.0)

- **重要變更**：Flint 從 0.x 正式升級到 1.0，主打讓圖表具備互動性——連結式刷選（linked brushing）、標註、語意縮放、圖表和表格的連動視圖，都有現成 preset 可以套，也能用新的互動 API 自訂行為；MCP server 和 npm 套件（`flint-chart`）同時支援這套互動功能。
- **Breaking Changes**：Release Notes 未列出破壞性變更。
- **對你的影響**：如果你已經在用 Flint 幫 agent 產生圖表（例如接在 Claude Code、Cursor 這類支援 MCP 的用戶端），升級後可以直接套用互動 preset，不用自己再處理縮放、刷選這些底層邏輯；還在評估圖表工具的話，1.0 是個比較適合開始測試的時間點。

## 今日收穫

之前以為 agent 的「自我改進」多半停留在論文或研究 demo 階段，今天看到 hermes-agent 和 prime-agent 都直接把這個能力做成使用者每天會用到的指令（自動建 skill、`/refine`），才意識到這已經不是展示用的概念，而是正在變成 CLI agent 的標準配備。

## 參考資料

- [vercel/eve GitHub](https://github.com/vercel/eve)
- [PrimeIntellect-ai/prime-agent GitHub](https://github.com/PrimeIntellect-ai/prime-agent)
- [Prime Agent 部落格：Recursive Language Model](https://www.primeintellect.ai/blog/rlm)
- [NousResearch/hermes-agent GitHub](https://github.com/NousResearch/hermes-agent)
- [mksglu/context-mode GitHub](https://github.com/mksglu/context-mode)
- [context-mode Hacker News 討論](https://news.ycombinator.com/item?id=47193064)
- [Composio @composio/slim@0.27.0 Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fslim%400.27.0)
- [Microsoft Flint 1.0 Release Notes](https://github.com/microsoft/flint-chart/releases/tag/1.0)
- [Microsoft Flint-Interactive 報導](https://windowsforum.com/news/microsoft-flint-interactive-adds-ai-agent-chart-interactions-with-mcp-and-canvas-state.449574/)
