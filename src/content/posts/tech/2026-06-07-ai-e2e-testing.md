---
title: "AI 驅動的 E2E 測試：canary、Stagehand、Magnitude、Shortest 的不同解法"
date: 2026-06-07
category: tech
type: deep-dive
tags: [e2e-testing, playwright, browser-automation, claude-code, open-source, qa, ai-tools]
lang: zh-TW
tldr: "AI agent 跑測試不可重現、手寫 Playwright 難維護——2024-2025 年出現四套工具各自解決這個兩難，設計哲學差異很大。"
description: "canary、Stagehand、Shortest、Magnitude 與 Playwright 官方 AI 功能的設計比較：如何在 AI 彈性與測試可重現性之間取捨。"
draft: false
---

E2E 測試長期卡在兩個極端：讓 AI agent 跑測試，每次結果不同、每次燒 token、失敗時看不出原因；自己寫 Playwright script，selector 跟著 UI 一起壞，維護成本比功能開發還高。2024-2025 年出現一批工具試圖打破這個二選一，各自的解法差很多。

## [canary](https://github.com/wizenheimer/canary)：AI 跑完給你 script

canary 是一套「QA harness built for Claude Code」，核心設計決定是：AI agent 跑 QA 的同時，自動產出可以重跑的 Playwright script。

第一次跑，Claude Code agent 透過真實瀏覽器瀏覽、操作、驗結果；跑完產出 `report.html`、完整 Playwright script、Playwright trace、網路 HAR、console log 和錄影。下次要跑同樣流程，直接執行 script，不需要再呼叫 LLM。

架構由四個元件組成：

- **`canary`**（orchestrator CLI）：主要使用者界面，錄製 QA session、彙整 report
- **`canary-browser`**（engine CLI）：一次性瀏覽器自動化，不錄影、不 report，適合快速腳本
- **`canary-daemon`**：長駐 Node process，持有 Playwright + QuickJS WASM sandbox，透過 named pipe 處理 IPC
- **`canary-viewer`**（Astro + React）：本地 session 瀏覽器，可搜尋、過濾、重播所有錄製結果

Script 在 QuickJS WASM sandbox 內執行，不是 Node.js——沒有 `require`、`import`、`fs`，也沒有 `process`，安全隔離。capture 預設全開（trace、video、HAR、console），可以用 `--no-trace` 等 flag 單獨關掉。

canary 還打包成 Claude Code plugin、Cursor plugin 和 Codex plugin，共用同一份 `skills/`，不需要為不同 agent 維護三份設定。

跟其他工具相比，canary 的立場最明確：AI 跑測試的不可重現性是問題，解法是「第一次用 AI，之後用 script」。代價是多了一個 daemon 程序和 QuickJS 環境的學習成本。

## [Stagehand](https://github.com/browserbase/stagehand)：Playwright 上的 AI 語言層

Stagehand 是目前最成熟的同類工具，2026 年已累積超過 22,000 GitHub stars，每週 npm 下載量 700,000+。定位是「SDK for browser agents」，不是測試框架——這個區別很重要。

它在 Playwright 上加了四個 AI primitive：

```ts
// 自然語言操作，不用寫 selector
await stagehand.page.act("click on the Acme Circles T-Shirt");

// 結構化資料抽取
const product = await stagehand.page.extract({
  instruction: "get the product name and price",
  schema: z.object({ name: z.string(), price: z.string() }),
});

// 理解頁面現有操作
const actions = await stagehand.page.observe("what can I do on this page?");

// 高層任務
await stagehand.agent().execute("add the shirt to cart and go to checkout");
```

auto-caching 是 Stagehand 的設計亮點：`act`/`extract`/`observe` 結果會 server-side 快取，cache hit 時不呼叫 LLM；UI 改了 cache miss 時，自動重新用 AI 找新 selector。self-healing 就這樣內建進去。

但 Stagehand 沒有 assertion、沒有 pass/fail 語意——它是 automation SDK，不是測試框架。想用它跑 QA 得自己在外面搭。auto-caching 有已知問題（issue #1767），上生產前要驗 cache 是否真的有命中。支援 OpenAI、Anthropic、Google 多個 provider，透過 Vercel AI SDK 串接。

## [Shortest](https://github.com/antiwork/shortest)：最小介面，一句話就是一個測試

Shortest 的哲學最極端：一個測試就是一句自然語言。

```ts
shortest("login with valid credentials");
shortest("ensure the response contains only active users", req.fetch({
  url: "/users",
  method: "GET",
  params: new URLSearchParams({ active: "true" }),
}));
```

底層用 Anthropic Claude，支援 lifecycle hooks（`beforeEach`/`afterAll`）、API testing、測試鏈組合（用 spread operator 串接複數流程）。目前有 5,600+ stars。

Shortest 的優點是幾乎零 boilerplate——測試描述就是測試本身，沒有 selector 選不到的問題。缺點是沒有顯式 script 產出，每次跑都要付 inference cost，失敗時只有自然語言的錯誤描述，debug 能力受限。適合快速寫 acceptance test，不適合需要精確驗證或高頻 CI 的場景。

## [Magnitude](https://github.com/magnitudedev/browser-agent)：不看 DOM，只看像素

Magnitude 在 2025 年 4 月以 Show HN 形式亮相（179 points），走的是純視覺路線——完全不用 DOM 或 accessibility tree，只用截圖。

核心是兩個 agent 的分工：

- **Planner**（大型 LLM，官方推薦 Claude Sonnet 4）：理解測試意圖，把自然語言描述轉成執行計畫
- **Executor**（[Moondream](https://moondream.ai/) 2B，小型 VLM）：根據計畫，輸出像素座標，點擊、輸入、滾動

計畫可以儲存，之後重跑只要跑 Executor，不呼叫大型 LLM，省掉大部分推理成本。Executor 跑失敗時，才把控制權交回 Planner 重新規劃。在 [WebVoyager](https://arxiv.org/abs/2401.13919) benchmark 上拿到 94%。

純視覺方式對 dynamic class name、shadow DOM、iframe 內容幾乎免疫，因為根本不解析 DOM。代價是 Executor（Moondream）對複雜頁面理解有限，特定視覺任務可能不如 DOM-based 方法穩定。

## Playwright 自己的 AI 整合

Playwright 官方在 2025-2026 年加入三個方向的 AI 支援：

**[Playwright MCP](https://playwright.dev/)**（Model Context Protocol server）：讓 AI agent 透過 accessibility snapshot 控制瀏覽器，Claude Code、Cursor 等工具可以直接接 Playwright MCP 跑瀏覽器任務。

**Playwright CLI**：token-efficient 命令列界面，專為 Claude Code 和 GitHub Copilot 設計，在大型 codebase 裡需要平衡瀏覽器操作和上下文用量時使用。

**Playwright Test Agents**（三個）：
- Planner Agent：探索 app，產出測試計畫
- Generator Agent：把計畫轉成可執行 Playwright test
- Healer Agent：測試失敗時自動找出 broken locator 並修復

三個 agent 可以單獨用，也可以串成 plan → generate → run → heal 的 loop。

## 比較

| 工具 | Stars | 設計哲學 | 產出 script | 適合情境 |
|---|---|---|---|---|
| [canary](https://github.com/wizenheimer/canary) | 新興 | AI 跑完給 script，replay 不燒 token | ✅ Playwright script | Claude Code 整合、需要完整 trace 記錄 |
| [Stagehand](https://github.com/browserbase/stagehand) | 22k+ | Playwright + AI 語言層，自動 self-heal | ❌（automation SDK，不是測試框架） | 生產環境瀏覽器 automation |
| [Shortest](https://github.com/antiwork/shortest) | 5.6k+ | 一句自然語言 = 一個測試 | ❌ | 快速 acceptance test，低頻跑 |
| [Magnitude](https://github.com/magnitudedev/browser-agent) | 新興 | 純視覺 VLM，Planner + Executor 分工 | ❌（計畫可存，但不是 code） | 複雜 UI、dynamic class 環境 |
| [Playwright Agents](https://playwright.dev/) | 官方 | framework 端整合，plan/generate/heal | ✅（Generator Agent） | 已用 Playwright 的團隊 |

## 整體來說

選哪個，取決於你最在乎哪個維度。

如果 reproducibility 是必要條件——CI 要能重跑、失敗要能 trace、不能每次 inference——canary 或 Playwright Test Agents 是比較誠實的選擇。前者強調 Claude Code 整合和完整錄製，後者適合已經在用 Playwright 的團隊。

如果你要的是快速 automation SDK 而不是測試框架，Stagehand 最成熟，self-healing 省掉大量 selector 維護；但要自己搭 assertion 邏輯，不適合直接當 QA 工具用。

Shortest 的極簡介面適合早期 acceptance test，token cost 隨測試頻率等比增長，跑 CI 要算清楚預算。

Magnitude 的純視覺路線最有差異性，對 DOM 不可靠的環境最有優勢，但 Moondream 2B 的視覺理解能力仍在成熟中，目前比較適合探索而不是生產。

## 參考資料

- [canary — GitHub](https://github.com/wizenheimer/canary)
- [Stagehand — GitHub](https://github.com/browserbase/stagehand)
- [Shortest — GitHub](https://github.com/antiwork/shortest)
- [Magnitude browser-agent — GitHub](https://github.com/magnitudedev/browser-agent)
- [Playwright 官方文件](https://playwright.dev/)
- [WebVoyager arXiv](https://arxiv.org/abs/2401.13919)
- [Moondream](https://moondream.ai/)
- [Magnitude Show HN 討論](https://news.ycombinator.com/item?id=43796003)
