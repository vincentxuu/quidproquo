---
title: "混合式 AI 瀏覽器 SDK 怎麼比：七個工具的三種分法，以及廠商成功率為什麼不能拿來比"
date: 2026-11-19
category: ai
type: deep-dive
tags: [browser-automation, stagehand, midscene, skyvern, benchmark, playwright]
lang: zh-TW
tldr: "Stagehand、Midscene、Skyvern、AgentQL、Magnitude、HyperAgent、Notte 都是「你的程式控制流程、個別步驟交給模型」，差別在三件事：怎麼看頁面（DOM、截圖、查詢語言）、底下用哪個 driver（決定能不能塞進現有的 Playwright 腳本）、綁不綁雲和用什麼授權。廠商公布的 WebVoyager 成功率不能互比：刪掉的題目、模型、瀏覽器、評審都不同，這個 benchmark 本身也偏簡單，只會 Google 搜尋的 agent 就能解一半。混合式 SDK 目前沒有共同的公開評測，要比就拿自己的任務重複跑。"
description: "混合式 AI 瀏覽器 SDK 比較：Stagehand v4、Midscene、Skyvern、AgentQL、Magnitude、HyperAgent、Notte 依感知方式、driver、雲端綁定與授權分類；WebVoyager 為什麼高估、各家自報成績的條件差在哪、評審與瀏覽器環境怎麼影響分數；實務上失敗的真正原因，以及怎麼挑出一兩個候選。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 13
---

> :globe: [English version](/posts/ai/2026-11-19-ai-browser-sdk-comparison-en)

系列第 8 到 12 篇介紹了四個混合式 SDK：[Stagehand v4](/posts/ai/2026-11-18-stagehand-v4)、[Midscene](/posts/ai/2026-05-23-midscene-vision-ui-automation)、[AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction)、[Skyvern](/posts/ai/2026-11-19-skyvern)。它們的共同點是：流程由你的程式控制，只有個別步驟交給模型。同一層還有 Magnitude、HyperAgent、Notte，每家的 README 都附著一個漂亮的成功率。

這篇不再逐一教學，回答兩件事：**同一層的 SDK 要用哪幾個問題分開；廠商公布的成功率能不能拿來比。**

## 第一個分法：怎麼看頁面

模型要知道頁面上有什麼，才能決定點哪裡。四種做法：

- **讀 DOM 或 accessibility tree。** Stagehand 把 accessibility tree 修剪後交給模型；[HyperAgent](https://github.com/hyperbrowserai/HyperAgent) 的 `perform()` 也走 accessibility tree、不截圖；[Notte](https://docs.notte.cc/llms-full.txt) 把頁面轉成可見文字，元素以 `[I1] Full name` 的形式標在原位。便宜、快，但模型看到的只是 DOM 解析出來的結果，解析漏掉的東西模型就看不到。
- **只看截圖。** Midscene 從 v1.0 起完全改用截圖定位，[官方說](https://midscenejs.com/changelog)拿掉 DOM 擷取省了約八成 token；Magnitude 也是純視覺，模型直接輸出像素座標。兩者都需要有 UI 定位（grounding）能力的模型，[Magnitude 的 README](https://github.com/magnitudedev/browser-agent) 寫明需要「large visually grounded model」。好處是不受 iframe、Canvas、亂七八糟的 DOM 影響；代價是每一步都送圖。
- **查詢語言。** AgentQL 讓你寫一個形狀像輸出資料的查詢，由它的後端找出對應的元素或資料。
- **截圖加元素清單。** Skyvern 兩者都送，由模型從清單裡挑元素 ID。它自己承認效果卡在 DOM 解析，3.0 改成讓模型寫 JavaScript 讀 HTML（細節見 [Skyvern 篇](/posts/ai/2026-11-19-skyvern)）。

兩條主線的取捨在一份很小的第三方[微型測試](https://github.com/Rajeev-SG/web-automation-microbench/blob/main/artifacts/2026-09-11/report.md)裡看得到：同一個 TodoMVC 任務、同一個模型，Magnitude 每次都過，但輸入 token 約是 Stagehand 的三倍、時間約四倍；Stagehand 四次只過一次，作者認為是 Stagehand 嚴格的 JSON schema 放大了那個模型的弱點。樣本極小，只能看方向，但方向符合兩條路線的取捨：視覺路線比較穩、比較貴也比較慢；DOM 路線的成績跟模型綁得很緊。

## 第二個分法：底下的 driver

這決定你能不能把它塞進現有的 Playwright 腳本，以及能用哪些瀏覽器。

| driver | 工具 | 對你的意義 |
|---|---|---|
| Playwright | Skyvern、AgentQL、HyperAgent | Skyvern、AgentQL 可以在原本的腳本裡加 AI 步驟，不用重寫；Skyvern 實際只開 Chromium |
| Patchright（Playwright 的 fork） | Magnitude、Notte | API 跟 Playwright 相同，但只有 Chromium |
| Puppeteer 或 Playwright | Midscene | 兩種都能接，另外支援 Android、iOS、桌面 |
| 自己的 CDP＋瀏覽器 extension | Stagehand v4 | 不能接 Playwright 的 `Page`，換過來等於重寫 |

Stagehand v4 是最常被誤會的一個。它的[遷移指南](https://docs.stagehand.dev/v4/migrations/playwright)寫得很直接：「has no Playwright dependency, so you can't hand a Playwright `Page` to `act()`. There is no interop」。很多比較文章還把它寫成「建在 Playwright 上」，那是 v2 的事。原因見 [driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)，逐項差異見 [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright)。

## 第三個分法：綁不綁雲、用什麼授權

README 不會把這些放在第一屏，但它們常常直接決定能不能用：

- **AgentQL 一定要 API key。** 模型在它的後端，[免費方案](https://www.agentql.com/pricing)每月 50 次呼叫，之後每次 $0.02（2026 年 11 月的價格）。
- **Stagehand 的快取只在 Browserbase 上。** v4 [文件](https://docs.stagehand.dev/v4/best-practices/caching)寫明，本機瀏覽器「the `cache` option has no effect and every call runs inference」，而且要寫信申請才會開通。v3 的本機快取已經拿掉了。
- **Skyvern 的 CAPTCHA、proxy、anti-bot 只在 Cloud。**
- **授權差很多。** Stagehand、Midscene 是 MIT，Magnitude 是 Apache-2.0；HyperAgent 和 Skyvern 是 AGPL-3.0；Notte 是 SSPL（只有 `node-sdk/` 是 MIT）；AgentQL 開源的只有範例，核心在閉源的 API 後面。要嵌進閉源產品，AGPL 和 SSPL 都要先處理。

還有兩項會影響長期成本：

- **快取或重播。** [Midscene](https://midscenejs.com/caching) 把規劃步驟和元素定位存在本機的 `.cache.yaml`；[HyperAgent](https://github.com/hyperbrowserai/HyperAgent) 記下每個動作的 XPath，`runFromActionCache()` 先走 XPath、頁面變了才問模型，也能匯出成 TypeScript 腳本；Skyvern 成功一次後產生程式碼重播。[Magnitude](https://github.com/magnitudedev/browser-agent) 的快取還寫著「in progress」。
- **測試 runner。** Midscene 有 YAML 測試案例和 Playwright、Vitest 整合；Magnitude 有自己的 `magnitude-test`。其他幾個沒有。

### 七個工具一張表

| | 怎麼看頁面 | driver | 雲端綁定 | 授權 | 最近更新 |
|---|---|---|---|---|---|
| [Stagehand v4](https://github.com/browserbase/stagehand) | accessibility tree | 自己的 CDP | 快取只在 Browserbase | MIT | 活躍 |
| [Midscene](https://github.com/web-infra-dev/midscene) | 純截圖 | Puppeteer 或 Playwright | 無 | MIT | 活躍 |
| [Skyvern](https://github.com/Skyvern-AI/skyvern) | 截圖＋元素清單 | Playwright | CAPTCHA、proxy 在 Cloud | AGPL-3.0 | 活躍 |
| [AgentQL](https://github.com/tinyfish-io/agentql) | 查詢語言 | Playwright | 必須 API key | 核心閉源 | 活躍 |
| [Magnitude](https://github.com/magnitudedev/browser-agent) | 純截圖 | Patchright | 無 | Apache-2.0 | 2026 年 2 月後沒有更新 |
| [HyperAgent](https://github.com/hyperbrowserai/HyperAgent) | accessibility tree（可開截圖） | Playwright | 可選 Hyperbrowser | AGPL-3.0 | 2026 年 5 月後沒有更新 |
| [Notte](https://github.com/nottelabs/notte) | 頁面文字＋元素標記 | Patchright | 本機免 key | SSPL | 活躍 |

「最近更新」以 2026 年 11 月中的 GitHub 為準。[Notte 在 1.10](https://github.com/nottelabs/notte) 拿掉了 agent 迴圈、Stagehand v4 拿掉了 `agent()`，這一層的工具都在往「人寫流程、模型只做單步」收斂；為什麼會這樣，留到第 15 篇談。

## 廠商的成功率為什麼不能比

### WebVoyager 本身偏簡單

各家 README 最常引用的是 WebVoyager。2025 年的論文〈[An Illusion of Progress?](https://arxiv.org/abs/2504.01382)〉指出它的三個問題：只有 15 個網站；很多任務有捷徑，**一個只會「Google 搜尋、點進搜尋結果」的 agent 就能解 51%**（作者抽 100 題人工評分）；它用的自動評審跟人工判斷的一致性很低，而 agent 常在最後的回答裡謊稱完成，讓自動評審給出偽陽性。

作者另外建了 Online-Mind2Web：136 個網站、300 個任務，每題至少兩個人工標註。同一個搜尋 agent 在這裡（同樣抽 100 題）只剩 22%。人工評分下，Browser Use 是 30.0%，Claude Computer Use 3.7 是 56.3%，OpenAI Operator 是 61.3%。

### 三家自報的 WebVoyager，條件都不一樣

| | 成績 | 題目 | 模型與環境 | 評審 |
|---|---|---|---|---|
| [Browser Use](https://browser-use.com/posts/sota-technical-report)（2024-12） | 89.1% | 刪掉 55 題 | GPT-4o | WebVoyager 的自動評審，判為 unknown／failed 的人工複查改判 |
| [Skyvern](https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/)（2025-01） | 85.85% | 刪掉 8 題、更新過期日期 | GPT-4o＋4o-mini，Skyvern Cloud 瀏覽器 | 文章沒寫 |
| [Magnitude](https://github.com/magnitudedev/webvoyager)（2025-07） | 93.9% | 590 題，改日期、刪掉幾題不可能的 | Claude Sonnet 4 | LLM 評審，部分人工複查；瀏覽器當掉就重跑 |

刪了哪些題、用哪個模型、跑在什麼瀏覽器上、誰來評分，四項都不同。Magnitude 自己也說這是「a very strange and awkward eval to run」：日期要改、網站一直在變。

### 評審和瀏覽器環境都會改變分數

- **誰當評審。** Browser Use 在論文的人工評分下，Online-Mind2Web 是 30.0%；2026 年它在[自家網站](https://browser-use.com/best-web-agents)自報 98%，用的是自己的 agent 評審，也承認 agent 就是對著同一個評審開發的，而且沒有公布評審跟人工的一致率。中間 agent 也換代了，不能全歸因於評審，但兩個數字顯然不能放在一起比。
- **跑在哪個瀏覽器上。** 在 [WebBench](https://webbench.ai/) 裡，同一個 Skyvern 2.0 跑在自家基礎設施上是 64.4%，換到 Browserbase 是 60.7%。

### 混合式 SDK 沒有共同的公開評測

2025 年之後的新評測，比的大多不是這一層：[BU Bench](https://browser-use.com/benchmarks/agents)、Browserbase 的 [HardBench](https://www.stagehand.dev/evals) 比的是模型和 agent harness 的組合；[BrowseComp](https://arxiv.org/abs/2504.12516)、[Mind2Web 2](https://arxiv.org/abs/2506.21506) 測的是找資料；WebBench 比的是 agent。Stagehand、Midscene、AgentQL、HyperAgent、Notte 沒有在同一套題目上被比較過。連 Browser Use 的[比較頁](https://browser-use.com/best-web-agents)都寫：「read the scores as claims, not a head-to-head」。

所以一個能拿來比的數字至少要：同一份題目（含刪題清單）、同一個模型、同一個瀏覽器環境、公開跟人工一致率的評審，而且重複跑過、有變異範圍。

## 實務上失敗在哪裡

比 benchmark 更有參考價值的是實際上線的人怎麼說。

一個做醫療系統（EHR）整合的團隊[寫了他們的一年](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)：先用 agent，太慢太貴、做不對；換 Stagehand（當時是 v3），accessibility tree 在 Athena 這類複雜 DOM 上對不到正確的元素；最後退回 Playwright。他們遇到的錯誤是隨機跳出的 popup、渲染極慢的畫面，以及業務邊界情況（例如出現重複的病人資料），「something you absolutely don't want an AI resolving on its own」；Stagehand 要處理的「selector 變了」反而不是主因。解法是改用 Claude Code 在開發時產生並修改 Playwright 腳本，執行時只在少數情況保留 AI 後備，例如用截圖找到並關掉 popup。這個團隊後來開源了自己的工具，文章有推廣成分。

另一家做 EHR 事前授權的公司 [Forus](https://build.forus.com/ehr-browser-automation-ai-agents) 得出同一個結論：「Agents for authoring, but not for execution」。agent 負責提議動作、人核准，只有執行成功的步驟才寫進固定的 Playwright 腳本。

LangChain 替自家產品選工具時[比了七組](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents)：在 100 題 WebVoyager 上，成功率都落在 78% 到 90%，成本卻差了約 13 倍（Stagehand 的工具組 $1.98，Playwright MCP $26.71）。注意這篇是 LangChain 選定 Stagehand 之後寫的，比的也是給 agent 用的工具組，不是「人寫流程、單步 act()」的用法。但「成功率接近、成本差一個數量級」這個模式值得記住。

## 怎麼挑出一兩個候選

依序問自己：

1. **已經有 Playwright 腳本，只想在常壞的步驟加 AI？** 挑能直接在 Playwright 腳本裡用的 Skyvern SDK、AgentQL，或 Playwright、Puppeteer 都能接的 Midscene。Stagehand v4 要重寫。
2. **頁面的 DOM 很亂（iframe 層層疊、Canvas、老系統）？** 考慮視覺路線（Midscene、Magnitude），接受更多 token、更慢，以及對模型的要求。
3. **主要是擷取資料？** AgentQL 的查詢就是輸出的形狀，但每次呼叫都要算錢、要 API key。
4. **要寫成測試、在 CI 跑？** Midscene 有測試整合；Magnitude 也有 runner，但已經大半年沒更新。
5. **要把程式碼嵌進閉源產品？** AGPL（Skyvern、HyperAgent）和 SSPL（Notte）要先處理；只透過 API 呼叫別人的雲端服務，處境又不同，三種用法的差別見 [Skyvern 篇](/posts/ai/2026-11-19-skyvern)。這不是法律意見。MIT 的 Stagehand、Midscene 和 Apache-2.0 的 Magnitude 沒有這個問題。
6. **想在本機重播、不要每次都推論？** Midscene、HyperAgent 的快取在本機就能用；Stagehand v4 的快取要 Browserbase；Skyvern 的程式碼重播，文件沒說自架版能不能完整使用。

挑出一兩個之後，拿你自己的 20 個真實任務，每個跑三次以上，記下成功率、每次的成本和時間。上面那些實務報告都指向同一件事：你的頁面、你的模型、你的瀏覽器環境，比任何 README 上的數字更能預測結果。

## 想深入

這一層的共同前提是「流程由你的程式控制」。下一篇 [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide) 走另一條路：給模型一句任務，每一步都由它自己決定。Stagehand v4 拿掉 `agent()` 時[說的是](https://docs.stagehand.dev/v4/migrations/v3)「Nothing in v4 replaces it one-for-one」，Skyvern 也有自己的 agent 模式，兩條路的分界沒有表面上那麼清楚。

## 參考資料

- [browserbase/stagehand](https://github.com/browserbase/stagehand)
- [Stagehand：Caching](https://docs.stagehand.dev/v4/best-practices/caching)
- [Stagehand：Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [Stagehand：Migrate v3 to v4](https://docs.stagehand.dev/v4/migrations/v3)
- [web-infra-dev/midscene](https://github.com/web-infra-dev/midscene)
- [Midscene：Caching](https://midscenejs.com/caching)
- [Skyvern-AI/skyvern](https://github.com/Skyvern-AI/skyvern)
- [tinyfish-io/agentql](https://github.com/tinyfish-io/agentql)
- [AgentQL Pricing](https://www.agentql.com/pricing)
- [magnitudedev/browser-agent](https://github.com/magnitudedev/browser-agent)
- [magnitudedev/webvoyager](https://github.com/magnitudedev/webvoyager)
- [hyperbrowserai/HyperAgent](https://github.com/hyperbrowserai/HyperAgent)
- [nottelabs/notte](https://github.com/nottelabs/notte)
- [Xue et al., An Illusion of Progress? Assessing the Current State of Web Agents（arXiv 2504.01382）](https://arxiv.org/abs/2504.01382)
- [Browser Use：SOTA technical report](https://browser-use.com/posts/sota-technical-report)
- [Browser Use：Best web agents](https://browser-use.com/best-web-agents)
- [Skyvern：Skyvern 2.0 WebVoyager benchmark results](https://www.skyvern.com/blog/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/)
- [Halluminate：WebBench](https://halluminate.ai/blog/benchmark)
- [WebBench 排行榜](https://webbench.ai/)
- [Midscene：Changelog](https://midscenejs.com/changelog)
- [Notte docs（llms-full.txt）](https://docs.notte.cc/llms-full.txt)
- [Browser Use：Agent benchmarks（BU Bench）](https://browser-use.com/benchmarks/agents)
- [Stagehand：Evals（HardBench）](https://www.stagehand.dev/evals)
- [Wei et al., BrowseComp（arXiv 2504.12516）](https://arxiv.org/abs/2504.12516)
- [Gou et al., Mind2Web 2（arXiv 2506.21506）](https://arxiv.org/abs/2506.21506)
- [Michael Kronovet：What we learned building healthcare integrations for the past year](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)
- [Forus：EHR browser automation with AI agents](https://build.forus.com/ehr-browser-automation-ai-agents)
- [LangChain：How we optimized browser use for Deep Agents](https://www.langchain.com/blog/how-we-optimized-browser-use-for-deep-agents)
- [Rajeev-SG/web-automation-microbench（2026-09-11 報告）](https://github.com/Rajeev-SG/web-automation-microbench/blob/main/artifacts/2026-09-11/report.md)
