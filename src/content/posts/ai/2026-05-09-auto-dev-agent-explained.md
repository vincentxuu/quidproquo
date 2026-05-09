---
title: "什麼是 auto-dev agent？daodao 自動化開發系統的入門解說"
date: 2026-05-09
category: ai
tags:
  - ai-agent
  - auto-dev-agent
  - product
  - automation-overview
  - non-engineer
  - notion
  - github
  - pipeline
lang: zh-TW
tldr: "PM 在 Notion 勾選一張任務卡 → 系統自己同步成 GitHub issue → 寫成 plan → 寫成 code → 開 PR 給人類 review。這篇講這套系統做什麼、不做什麼、為什麼現在可行，給沒在寫 code 的人看。"
description: "auto-dev agent 是什麼？PM、設計師、創辦人入門解說：從 Notion 任務到 GitHub PR 的自動化流程、4 種介入模式、安全設計、與限制。"
draft: false
---

## TL;DR

PM 在 Notion 勾選一張任務卡 → 系統自己同步成 GitHub issue → 寫成 plan → 寫成 code → 開 PR 給人類 review。這篇講這套系統做什麼、不做什麼、為什麼現在可行，給沒在寫 code 的人看。

如果你想看怎麼蓋這套系統的細節，直接看〈[從 Plan 到 PR：daodao 的 auto-dev agent 實戰](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/)〉case study 或〈[自製 auto-dev agent 的 15 個 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/)〉。

---

## 一個 PM 的一天

想像你是 daodao 的 PM。早上開會跟設計師討論完，你拿到一個改動：「練習頁的 mood 沒填時，checkin 卡片要顯示空狀態而不是錯誤」。

**沒有 auto-dev agent 之前**，這件事的工序是：

1. 你在 Notion 任務板上開卡片，寫描述、acceptance criteria
2. 你打開 Slack 找工程師，說「這個今天能做嗎？」
3. 工程師看一眼 → 估個時間 → 排進 sprint
4. 工程師到 GitHub 開 issue（手動 copy 你 Notion 上的描述）
5. 工程師開 branch、寫 code、push、開 PR
6. 你 review PR、merge

整個過程從「你想到」到「PR 出來」，最快也要半天，慢的話一兩週。每一步都需要工程師主動接力。

**有 auto-dev agent 之後**，同一件事的工序：

1. 你在 Notion 卡填描述、acceptance criteria
2. 你勾兩個 checkbox：`Status = Ready for Dev` + `Sync to GitHub = ✅`
3. 一小時內，GitHub 自動冒出對應的 issue
4. 兩小時內，GitHub 自動開出 PR（小任務）或 spec PR（大任務）
5. 你或工程師 review PR、merge

從「你想到」到「PR 出來」最快兩小時內。整個過程沒有人主動接力——是系統定時掃 Notion、把該做的事自動往下推。

---

## 它做的不只是「Notion 同步到 GitHub」

如果只是同步 issue，那是 Zapier 等工具早就能做的事。auto-dev agent 真正的價值在後段——**它會自己寫 code**。

把它想像成一個「永遠在線、永遠不抱怨、但需要清楚指令」的工程師：

- **小任務**（typo、加個 endpoint、改個按鈕文字）：它直接寫 code 開 PR，你 review 後 merge
- **中型任務**（一個新功能，要改幾個檔案）：它先寫一份「設計提案」（spec PR），你看完、改幾句、merge → 它再根據 merged spec 寫 code 開第二個 PR
- **大型任務**（架構改動、跨服務）：它只寫設計提案，code 階段交給人類接手

這背後的判斷邏輯是 PM 在 Notion 上設的：

| Notion 設定 | 系統行為 |
|---|---|
| `Auto Mode = manual` | 只同步 issue，不寫 code |
| `Auto Mode = plan-only` | 寫 plan / spec，不寫 code |
| `Auto Mode = auto-pr`、`Scope = XS / S` | 直接寫 code 開 PR |
| `Auto Mode = auto-pr`、`Scope = M` | 先寫 spec PR，等人類 merge 後再寫 code PR |
| `Auto Mode = auto-pr`、`Scope = L` | 只寫 spec PR，code 強制人類接手 |

PM 不需要懂程式碼，只需要學會：「這件事多大、要多少人類介入」。系統按 Notion 設定走相應的路徑。

---

## 它怎麼避免亂搞？

讓 AI 自動開 PR 聽起來很可怕。實際 daodao 系統有幾層防護：

### 1. 兩道閘門

不是只勾 `Sync to GitHub` 就會被推到 GitHub——還必須 `Status = Ready for Dev`。兩個都要 yes 才同步。

避免「PM 還在發想階段、AI 已經跑去寫 code」這種狀況。

### 2. 高風險 repo 強制不自動

daodao 有 8 個 repo，其中 2 個叫 `daodao-storage`（資料庫遷移腳本）、`daodao-infra`（基礎建設）。這兩個一旦被改錯就回不去——資料庫 migration 是 production 事故、infra 改錯整個服務掛掉。

系統內部寫死：**這兩個 repo 永遠只走 plan-only**，PM 在 Notion 上勾 `auto-pr` 也沒用。系統會把 Notion 設定當參考、不當命令。

這層防護寫死在程式碼裡（不能從設定改），要改需要工程師走正式的 PR review 流程。

### 3. 四種隨時叫停的方法

- 全暫停：在專案根放一個 `.automation-paused` 檔，所有 routine 立刻停
- 單個 repo 暫停：放 `.automation-paused-<repo>` 只暫停那個 repo
- 單張 issue 暫停：在 issue 上加 `automation:hold` label
- 永久接管：在 issue 上加 `human-driving` label，系統自動退場、清掉自己加的 label、留 audit comment「🤝 已交接給人類」

PM、工程師、任何有 GitHub 寫權限的人都可以叫停。不需要工程師才能踩煞車。

### 4. AI 寫的 code 還是要人 review

系統開 PR 之後**不會自己 merge**。人類 review、CI 跑綠、人類 approve、人類按 merge。

對齊矽谷大公司的做法：Stripe / Spotify / Ramp 的內部 agent 都不做 auto-merge，code 還是要人類最後點頭。Coinbase 例外，但他們有更複雜的多層 AI review council，daodao 還沒到那規模。

---

## 它做不到的事

別被「自動寫 code」這個詞騙了。auto-dev agent 不會：

- **想出產品策略**：你還是要決定「要做什麼」。系統只負責「怎麼做」
- **猜測模糊的 acceptance criteria**：Notion 卡寫得越清楚、系統做得越準。寫得糟、它也糟
- **改動沒寫進 spec 的東西**：它只動 issue 描述提到的部分，不會「順便」幫你重構
- **跨 8 個 repo 一次大改**：每張 issue 只能指定一個 target repo
- **取代資深工程師的判斷**：架構決策、效能瓶頸、安全 review 還是要人。系統只做「定義清楚、可驗證」的工作

更白話：**它是把工程師從重複勞動中解放、不是取代工程師**。Spotify CTO 說他們最強的工程師「2025 年 12 月起沒親手寫過一行 code」——那是因為他們在做更高階的事（架構、review、產品決策），而不是因為工程師被取代了。

---

## 為什麼現在可行

兩年前做不出這個，三個關鍵變化：

1. **LLM 寫 code 真的可用了**：Claude Sonnet 4.6 / Opus 4.7 在多檔重構、bug 修復這類「中等複雜度」工作上的成功率夠高。不是 100%，但 70-80%，搭配人類 review 已經夠用
2. **「圍牆」設計成熟了**：Stripe Minions、Ramp Inspect、Coinbase Cloudbot、Spotify Honk 等矽谷大公司開源了具體的 guardrails 設計（tool allowlist、verification loop、token budget 等 15 個 walls）。這套不需要重新發明
3. **Claude Code Routines 提供了基礎建設**：Anthropic 把「定時跑、有 GitHub access、能 push code」這套變成 SaaS。不用自己架 EC2、寫 cron、管 secret——三個 checkbox 設定完開跑

矽谷一線公司每週靠內部 agent merge 上千個 PR（[Stripe 1300/週、Spotify 1000/10天](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/)），daodao 這種小團隊也能用同套思路做出 1/100 規模的版本。

---

## 整體來說

如果你是 PM、設計師、創辦人——auto-dev agent 對你的影響是：

- **想到的事更快進到 production**（從一兩週縮到幾小時）
- **你的 Notion 卡寫得越清楚、產品迭代越快**
- **不用追工程師排 sprint**（小事系統自動處理、大事工程師看 spec PR）
- **不用學寫 code、但要學寫清楚的 acceptance criteria**

如果你是工程師——

- **review code 的時間多了、寫 boilerplate 的時間少了**
- **架構設計、code review 的能力越重要**（系統寫的 code 你要看得出對不對）
- **人類負責定義「什麼是對的」（測試、規格），系統負責「寫 code 讓它變對」**

如果你是團隊負責人——

- **小團隊也能跑這套**（不需要 Stripe 規模的 infra）
- **但前期投資不便宜**（光寫 plan + 設計 walls 就要 1-2 個工程天）
- **長期回報是團隊規模 × 2-3 倍的產出**（Meta 重度使用者 YoY 提升 80%）

下一篇要看實作的話，從 [case study](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) 開始；要看每個 wall 細節看 [15 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/)；要照著做有 [tutorial](https://quidproquo.cc/posts/ai/2026-05-09-build-your-own-auto-dev-agent/)。

---

## 參考資料

- [從 Stripe 到 Meta：矽谷一線公司如何用 AI Agent 取代鍵盤](https://quidproquo.cc/posts/ai/2026-04-04-internal-ai-coding-agents/) — 矽谷大公司怎麼做的
- [從實戰整理：AI Native 團隊該做好的事](https://quidproquo.cc/posts/ai/2026-04-17-ai-native-team-practices/) — 18 條實作經驗
- [從 Plan 到 PR：daodao 的 auto-dev agent 實戰](https://quidproquo.cc/posts/ai/2026-05-09-daodao-auto-dev-agent-build/) — daodao 案例的設計與踩坑
- [自製 auto-dev agent 的 15 個 walls](https://quidproquo.cc/posts/ai/2026-05-09-auto-dev-agent-15-walls/) — 具體實作細節
- [手把手建 Notion → PR auto-dev agent](https://quidproquo.cc/posts/ai/2026-05-09-build-your-own-auto-dev-agent/) — 12 步教學
- [Anthropic Claude Code Routines](https://code.claude.com/docs/en/routines) — 系統跑的基礎建設
- [Spotify CTO Gustav Söderström: 最好的開發者從 2025/12 起沒寫過 code](https://techcrunch.com/2026/01/15/spotify-cto-best-developers-not-writing-code) — Engineer role transformation 引述
