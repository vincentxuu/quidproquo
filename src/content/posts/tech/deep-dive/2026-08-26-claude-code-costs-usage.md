---
title: "Claude Code 成本怎麼管：token 追蹤、模型選擇、effort 與團隊用量"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, cost, model-config, usage]
lang: zh-TW
tldr: "Claude Code 成本隨 context 大小累積：企業部署平均每位開發者每個活躍日約 $13、每月 $150–250。本文整理 /usage 與 /insights 追蹤、六種省 token 手段，以及「該用哪個模型」的系統性答案：provider-dependent model aliases、effort levels、fast mode（Opus 5/4.8 每 MTok $10/$50）與 advisor 工具。"
description: "拆解 Claude Code 的成本結構與追蹤工具，涵蓋 /usage 用量歸因、context 管理、模型 alias 與 effort 取捨、fast mode 計價，以及團隊層級的 analytics dashboard。"
draft: false
series:
  name: "Claude Code 深入介紹"
  order: 32
---

> 🌏 [English version](/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage-en)

訂閱方案的使用者常有一個誤解：以為用量跟著「我打多少字」走。實際上 Claude Code 按 API token 消耗計費（[官方文件](https://code.claude.com/docs/en/costs)的說法），而 token 消耗的主要變數是 **context 大小**——每次請求都會帶上完整對話歷史，所以一個開了一整天的 session，就算你最後只問一句話，計量的仍是整段對話。這篇是系列的成本篇，接續 [context window 管理](/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management)和 [prompt caching](/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching)兩篇，把它們落成錢和限額的問題。

## 成本從哪裡來

先給量級。依 Anthropic 官方文件引用的企業部署數據，平均每位開發者每個活躍日約 **$13**，每月 **$150–250**；90% 的使用者低於每天 $30。變異主要來自三件事：模型選擇、codebase 大小、使用模式（多開 instance、跑自動化都會放大）。

長 session 用量莫名攀升，官方文件點名了幾個原因：

- **Long context**：每次工具呼叫都是一個帶著全部歷史的新請求。
- **Cache miss**：中斷超過 [prompt cache](https://code.claude.com/docs/en/prompt-caching) 生命週期後的第一則訊息要重算整份 context。訂閱方案的 cache 生命週期是一小時；一旦動用 usage credits 或改走 API key，就降到五分鐘。
- **背景消耗**：排程任務照間隔觸發、跨 session 訊息送達、agent teammate 未退出，都會在你看起來沒做事時送出完整 context。
- **Compaction 本身**：`/compact` 要讀完它摘要的對話，壓縮大 context 就是一次大請求。想重新開始的話，`/clear` 不花錢。

## 追蹤：/usage 和 /insights

`/usage` 是主要的追蹤指令。session 區塊顯示當前 session 的 token 明細與金額——預設按牌價估算；如果組織用 managed settings 設了 `modelPricing`，新版 Claude Code 會用組織費率顯示。這仍是估算，正式帳單以 Claude Console 的 Usage 頁為準。訂閱使用者真正該看的是下面的 **plan usage breakdown**：它把最近的用量歸因到 skills、subagents、plugins 和各個 MCP server（各佔百分比），並把 long context、cache miss 這類行為在佔比達 10% 以上時標旗出來。新版還會列出最近最重的 `/loop` 或 scheduled tasks；usage credits 開啟時也會顯示本月 usage-credit spend。按 `d` 或 `w` 可以切換最近 24 小時和 7 天。

想了解的是「我怎麼工作」而不是「用了多少 token」，跑 [`/insights`](https://code.claude.com/docs/en/costs)：它分析本機最多 200 個近期 session，產出一份 HTML 報告（摩擦點、建議），寫到 `~/.claude/usage-data/report.html`，並保留 timestamped copy；分析本身也計入方案額度。

## 省 token 的實際手段

官方文件的降成本清單裡，這幾條投報率最高：

1. **任務之間 `/clear`**。切到不相關的工作前先清，殘留 context 會讓每一則後續訊息都變貴。怕找不到舊 session，先 `/rename` 再 clear，回頭用 `/resume`。
2. **自訂 compaction 指示**。`/compact 只保留程式碼範例與 API 用法`，或在專案根目錄 CLAUDE.md 寫 `# Compact instructions` 段落，控制摘要保留什麼。
3. **精簡 CLAUDE.md**。它每個 session 開頭整份載入；特定 workflow 的詳細指示搬進 skill（skill 只在被呼叫時載入）。官方建議壓在 200 行內。
4. **用 hooks 前處理輸出**。讓 Claude 讀一萬行 log 才找錯誤，不如掛一個 PreToolUse hook 先 grep 出 `ERROR` 行——文件給的例子是把數萬 token 壓到數百。
5. **減少 MCP 開銷**。MCP 工具定義已預設 deferred，但 CLI 工具（`gh`、`aws` 這類）仍然更省，因為完全不佔 per-tool 列表；不用的 server 用 `/mcp` 停用。
6. **雜活丟給 subagent**。跑測試、抓文件這類大量輸出的操作交出去，只有摘要回到主對話。

還有一條最簡單也最常被忽略的：**prompt 寫具體**。「改善這個 codebase」會觸發大範圍掃描；「幫 auth.ts 的 login 函式加輸入驗證」一次到位。

## 該用哪個模型：一套系統性答案

讀者最常問的問題，官方答案散在四頁文件裡，這節把它們拼起來。

### 模型家族與預設

截至 2026-08-29，官方文件建議不要記完整型號，而是用 alias：`best`、`fable`、`opus`、`sonnet`、`haiku`、`sonnet[1m]`、`opus[1m]`、`opusplan`。`opus`、`sonnet` 解析到哪個實際模型跟 provider 有關：Anthropic API 目前是 Opus 5 / Sonnet 5；Claude Platform on AWS 是 Opus 5 / Sonnet 4.6；Bedrock 與 Google Cloud Agent Platform 是 Opus 5 / Sonnet 4.5；Microsoft Foundry 則是 Opus 4.6 / Sonnet 4.5。alias 會隨 Claude Code 更新，想避免漂移就 pin full model name 或用 `ANTHROPIC_DEFAULT_*_MODEL`。

**Fable 5 在任何帳號類型都不是預設**，要用 `/model fable` 主動選；`/model` picker 也可能等 server 回報組織可用後才顯示。它是最強但最貴的，適合超過一個 session 坐得下的長任務，且部分方案上會計入 usage credits（有同意提示）。

日常分工的原則官方寫得很直白：Sonnet 處理大部分 coding 任務，Opus 留給複雜架構決策，簡單的 subagent 任務在 frontmatter 指定 `model: haiku`。另一個省錢組合是 `opusplan`：plan mode 用 Opus 推理，執行階段自動切回 Sonnet。

### Effort levels

[`/effort`](https://code.claude.com/docs/en/model-config) 控制 adaptive reasoning：模型自己決定每一步要想多深。等級 `low` 到 `max`，預設 `high`。低 effort 對直白任務更快更便宜；`max` 最深但可能過度思考，官方明說要先測試再全面採用。臨時想要更深推理不用改設定，prompt 裡放 `ultrathink` 這個關鍵字即可，只影響那一輪。

### Fast mode

[`/fast`](https://code.claude.com/docs/en/fast-mode) 不是換模型，是把 Opus 切到延遲優先的 API 配置：最高 **2.5 倍速**，代價是 Opus 5 / Opus 4.8 每 MTok 輸入 $10、輸出 $50。它只支援 Anthropic API 與 subscription usage credits，不支援 Bedrock、Google Cloud Agent Platform、Microsoft Foundry 或 Claude Platform on AWS。適合互動式除錯、快速迭代；批次處理和 CI 用標準模式就好。兩個坑要注意：Team／Enterprise 組織要 Owner 先啟用；而且對話中途才開啟 fast mode，第一次要按 fast mode 牌價重付整份 context 的未快取輸入——要開就在 session 開頭開。

### Advisor

[Advisor 工具](https://code.claude.com/docs/en/advisor)（實驗性）是折衷方案：主模型照常用較便宜的 Sonnet，Claude 在關鍵決策點——承諾做法前、反覆卡同一個錯、宣告完成前——去諮詢指定的更強 advisor（如 Opus 或 Fable）。advisor 是 Anthropic API 的 server tool，不支援 Bedrock、Claude Platform on AWS、Google Cloud Agent Platform 或 Microsoft Foundry；每次呼叫也都收到完整對話，所以它不是免費的，但在決策點呼叫通常比全程跑強模型便宜。用 `/advisor opus` 設定。

### Extended thinking 何時值得

Extended thinking 預設開啟，thinking tokens **按 output 計價**，預算可能每個請求數萬 token。取捨很清楚：複雜規劃值得，直白任務是純浪費——調低 effort、或用 `/config` 關掉 thinking 都可以省。例外是 Fable 5：它的 thinking 關不掉。

## 團隊層：analytics dashboard 與 spend 管理

個人看 `/usage`，團隊看 [analytics dashboard](https://code.claude.com/docs/en/analytics)。Teams／Enterprise 版在 `claude.ai/analytics/claude-code`：每日活躍使用者、session 數、建議接受率、leaderboard、CSV export，加上 GitHub 整合的 contribution metrics（哪些 PR 含 Claude Code 協作的程式碼）——官方刻意用保守匹配，只計高置信度的部分，所以數字是低估。per-user token 與 usage-credit spend 不在這個採用 dashboard 裡，要看 org analytics 的 spend report、Enterprise Analytics API，或自己接 OpenTelemetry。API 客戶走 Console 的 `platform.claude.com/claude-code` dashboard，看 per-user spend、accepted lines、activity 與 team insights。

spend 上限方面，Teams／Enterprise 的 seat allowance 本身就是天花板，要讓成員越過它就得開 usage credits，並在 organization、group 或個人層級設 spend limits。Console 客戶則用 workspace spend limits。需要即時 per-user 數據進自己的 observability stack，OpenTelemetry export 是所有接入方式都支援的唯一選項。

## 學到的事

成本管理的核心只有一句話：**context 是主要變數，其他都是槓桿。** `/clear` 和 compaction 控制 context 大小，模型選擇和 effort 控制每個 token 的單價，fast mode 和 advisor 是在速度與品質之間挪動籌碼。先用 `/usage` 搞清楚你的錢花在哪個歸因項上，再決定動哪個槓桿——順序反了就是瞎調。

## 參考資料

- [Manage costs effectively — Claude Code Docs](https://code.claude.com/docs/en/costs) — token 追蹤、企業成本數據、降成本策略與長 session 用量攀高的原因
- [Track team usage with analytics — Claude Code Docs](https://code.claude.com/docs/en/analytics) — Teams／Enterprise 與 API 客戶的 dashboard、contribution metrics 歸因機制
- [Model configuration — Claude Code Docs](https://code.claude.com/docs/en/model-config) — 模型 alias、effort levels、extended context 與 auto-compact window
- [Speed up responses with fast mode — Claude Code Docs](https://code.claude.com/docs/en/fast-mode) — fast mode 計價、適用情境與 usage credits 要求
- [Escalate hard decisions with the advisor tool — Claude Code Docs](https://code.claude.com/docs/en/advisor) — advisor 配對、呼叫時機與計費方式

## 更新紀錄

- 2026-08-26：初版，依五頁官方文件（costs／analytics／model-config／fast-mode／advisor）撰寫。
- 2026-08-29：依官方文件更新 `/usage` 欄位、model alias/provider drift、fast mode/advisor 可用性與 team analytics/spend 說法。
