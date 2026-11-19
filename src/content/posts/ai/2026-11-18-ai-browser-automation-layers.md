---
title: "AI 瀏覽器自動化怎麼選：AI 層、Driver、協定與瀏覽器的五層地圖"
date: 2026-11-18
category: ai
type: deep-dive
tags: [browser-automation, browser-agent, stagehand, playwright, cdp, mcp]
lang: zh-TW
tldr: "Playwright MCP、Stagehand、Browser Use 同在 AI 層，差在誰決定下一步：外部 coding agent、你寫的程式，還是 agent 自己；Browserbase 和 Cloudflare Browser Run 在最下面的瀏覽器層，只提供瀏覽器。選型要分開問三件事：誰決定下一步、driver 要不要跨瀏覽器、瀏覽器放哪。"
description: "AI 瀏覽器自動化系列總覽：把 Playwright MCP、Stagehand、Browser Use、Playwright、CDP、WebDriver BiDi、Browserbase、Cloudflare Browser Run 放進同一張五層地圖，說明各層解決什麼、同一個任務在不同層怎麼做，以及選型時要分開問的三個問題。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 0
---

> 🌏 [English version](/posts/ai/2026-11-18-ai-browser-automation-layers-en)

想讓 AI 幫你操作網頁：抓一張價格表、填一份表單、跑一遍註冊流程。搜一圈會同時看到 [Playwright MCP](https://github.com/microsoft/playwright-mcp)、[Stagehand](https://github.com/browserbase/stagehand)、[Browser Use](https://github.com/browser-use/browser-use)、[Browserbase](https://www.browserbase.com/)、[Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)，比較文常把它們排成同一張表，但它們不是同一種東西。前三個都在決定「下一步做什麼」，差在握控制權的是誰：Claude Code 這類 coding agent、你寫的程式，還是 agent 自己。後兩個只提供一台遠端的 Chrome。

這篇是「AI 瀏覽器自動化」系列的入口。讀完你拿到一個新工具時，應該能說出它在哪一層、跟誰才是競品，以及選型時要分開問哪三件事。

## 五層地圖

從你寫的東西往下，到真的在跑的瀏覽器，可以拆成五層。每一層只解決一件事，上一層靠下一層把事情做完。

```diagram
title: AI 瀏覽器自動化的五層
desc: 由上往下依序是應用、AI 層、Driver、協定、瀏覽器與執行位置；AI 層負責決定下一步做什麼，是工具選型最常混淆的一層。
caption: 簡化示意：一個產品可以同時橫跨好幾層，例如 Browser Use 同時有 agent、自寫的 driver 與雲端瀏覽器。
---
<svg viewBox="0 0 640 384">
  <path class="dg-axis" d="M36 336V64" marker-end="url(#arrow)"/>
  <text class="dg-tag" x="36" y="44" text-anchor="middle" dominant-baseline="central">抽象</text>
  <text class="dg-tag" x="36" y="356" text-anchor="middle" dominant-baseline="central">具體</text>

  <rect class="dg-box" x="72" y="24" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="52" dominant-baseline="central">L5</text>
  <text class="dg-label" x="124" y="52" dominant-baseline="central">應用</text>
  <text class="dg-sub" x="604" y="52" text-anchor="end" dominant-baseline="central">你的產品、Claude Code、爬蟲服務</text>

  <rect class="dg-box dg-box--accent" x="72" y="88" width="552" height="72" rx="6"/>
  <text class="dg-tag" x="92" y="114" dominant-baseline="central">L4</text>
  <text class="dg-label" x="124" y="114" dominant-baseline="central">AI 層</text>
  <text class="dg-sub" x="124" y="138" dominant-baseline="central">決定下一步做什麼</text>
  <text class="dg-sub" x="604" y="114" text-anchor="end" dominant-baseline="central">Stagehand、Browser Use、Playwright MCP</text>

  <rect class="dg-box" x="72" y="168" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="196" dominant-baseline="central">L3</text>
  <text class="dg-label" x="124" y="196" dominant-baseline="central">Driver</text>
  <text class="dg-sub" x="604" y="196" text-anchor="end" dominant-baseline="central">Playwright、Puppeteer、自寫 CDP client</text>

  <rect class="dg-box" x="72" y="232" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="260" dominant-baseline="central">L2</text>
  <text class="dg-label" x="124" y="260" dominant-baseline="central">協定</text>
  <text class="dg-sub" x="604" y="260" text-anchor="end" dominant-baseline="central">CDP、WebDriver BiDi</text>

  <rect class="dg-box" x="72" y="296" width="552" height="56" rx="6"/>
  <text class="dg-tag" x="92" y="324" dominant-baseline="central">L1</text>
  <text class="dg-label" x="124" y="324" dominant-baseline="central">瀏覽器</text>
  <text class="dg-sub" x="604" y="324" text-anchor="end" dominant-baseline="central">Chromium、Lightpanda；本機或託管雲</text>
</svg>
```

**應用**是你自己的東西：一個客服機器人、一支每天跑的爬蟲，或你正在用的 Claude Code。

**AI 層**決定「下一步做什麼」，也是最容易被混在一起比較的一層。它裡面還分三種，差別在誰握有控制流程：

| 類型 | 誰決定下一步 | 代表 |
|---|---|---|
| 給 coding agent 的工具 | 外部 agent 的模型（Claude Code、Codex） | [Playwright MCP](/posts/tech/2026-06-20-playwright-mcp)、[Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp)、[agent-browser](/posts/ai/2026-11-19-agent-browser-cli)、[browse CLI](/posts/ai/2026-05-23-browse-sh-browser-skills) |
| 混合式 SDK | 你寫的程式，個別步驟交給模型 | [Stagehand](/posts/ai/2026-11-18-stagehand-v4)、[Midscene](/posts/ai/2026-05-23-midscene-vision-ui-automation)、[AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction)、[Skyvern](/posts/ai/2026-11-19-skyvern) 的 SDK |
| 自主 agent | 模型，每一步都自己判斷 | [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide)、Skyvern 的 agent |

工具這一型本身不含模型，決策品質主要看你接上的那一個；換句話說，它的「決定」其實發生在上一層，是 Claude Code 這個應用的模型透過工具在操作瀏覽器。混合式 SDK 讓你在程式碼裡寫 `stagehand.act("click the sign in button")`，穩定的步驟照樣用 selector。自主 agent 收一句任務描述，自己看頁面、自己點。

**Driver** 把「點這個按鈕」翻成瀏覽器聽得懂的指令。一邊是現成的函式庫：[Playwright](https://playwright.dev/)、[Puppeteer](https://pptr.dev/)、[Selenium](https://www.selenium.dev/)，以及修掉自動化特徵的 fork [Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright)。另一邊是自己寫的：[Stagehand 從 v3 起](https://developers.cloudflare.com/browser-run/stagehand/)、[Browser Use 從 2025 年 8 月起](https://browser-use.com/posts/playwright-to-cdp)，以及用 Rust 寫的 agent-browser，都拿掉了 Playwright，直接對瀏覽器下指令。

**協定**是 driver 和瀏覽器之間的語言。Chromium 系瀏覽器講 CDP（Chrome DevTools Protocol）；W3C 的 WebDriver BiDi 是跨瀏覽器的新標準。Firefox 從 141 版起[完全移除了 CDP](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)，只剩 BiDi 一條路。兩個協定的差別見[協定篇](/posts/ai/2026-11-19-cdp-webdriver-bidi)。

**瀏覽器**這層有兩個問題。一是用哪個引擎：幾乎都是 Chromium，也有 [Lightpanda](https://github.com/lightpanda-io/browser) 和 [Cloudflare Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure) 這類非 Chromium 引擎。二是跑在哪：你的筆電，或 [Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure)、[Steel](/posts/ai/2026-08-22-steel-browser-infrastructure)、[Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure)、Cloudflare Browser Run 這些託管雲。

## 同一個任務，在不同層怎麼做

拿一個具體任務走一遍：**每天打開競品的公開價格頁，把方案名稱和月費抓成 JSON。** 下面四種做法各在不同層，示意寫法都取自各家官方文件。

**一、在 Claude Code 裡用 Playwright MCP。** 裝好之後直接用自然語言下指令，Claude 透過 accessibility tree 讀頁面、自己決定點哪裡：

```bash
claude mcp add playwright npx @playwright/mcp@latest
# 之後在對話裡說：打開 https://example.com/pricing，把每個方案的名稱和月費整理成 JSON
```

適合偶爾做一次、或先摸清楚頁面長什麼樣。每天固定跑就不划算：每次都是一整段 agent 對話。

**二、用 Stagehand 寫一支腳本。** 導航用一般程式碼，只有「讀懂表格」這一步交給模型：

```typescript
// 片段：browser、stagehand、z 的設定見系列的 Stagehand v4 篇
const [page] = await browser.context.pages();
await page.goto("https://example.com/pricing");
const { data } = await stagehand.extract(
  "extract every plan with its name and monthly price",
  z.object({ plans: z.array(z.object({ name: z.string(), monthlyPrice: z.number() })) }),
);
```

價格頁改版時 `extract()` 照樣能讀，不用改 selector；代價是每次執行都要一次模型推論，除非跑在 Browserbase 上並開通它的伺服器端快取（細節見 [Stagehand v4 那篇](/posts/ai/2026-11-18-stagehand-v4)）。

**三、交給 Browser Use。** 只給任務描述，從開頁到整理全由 agent 決定：

```python
# 片段：需要 Browser Use 的 API key 或自己的模型設定
from browser_use import Agent
result = Agent("Open https://example.com/pricing and list every plan with its monthly price as JSON").run_sync()
```

最省事，也最難預測：每一步都在推論，同一個任務兩次執行可能走不同路。

**四、打一個 Cloudflare Browser Run 的 Quick Action。** 不寫瀏覽器程式，直接呼叫 `/json` 端點，Cloudflare 開瀏覽器、渲染頁面、用 [Workers AI](https://developers.cloudflare.com/workers-ai/) 抽資料：

```bash
curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<accountId>/browser-run/json' \
  -H 'Authorization: Bearer <apiToken>' \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com/pricing", "prompt": "list every plan with its monthly price"}'
```

頁面不用登入、不用點任何東西時，這條最短。要登入、要多步操作，就得改開 Browser Session，自己用 Playwright、Puppeteer 或 CDP 控制瀏覽器；Stagehand 在 Browser Run 上目前只支援舊的 v2.5.x。

四種做法裡，前三種都可以跑在你自己的筆電上，也都可以把瀏覽器換成託管雲。第四種把 AI 層和瀏覽器打包成一個 API。這就是分層的用處：同一個任務的選擇，其實是好幾個獨立決定的組合。

## 選型時分開問的三件事

**誰決定下一步？** 步驟固定、每天重複跑：寫成程式碼，只在需要判斷的地方用模型（混合式 SDK）。步驟事先不知道、每次都不同：交給自主 agent。只是自己偶爾要用：給 coding agent 一個工具就好。這一題決定了每次執行要不要推論，也就決定了成本會不會隨執行次數一起成長。

**Driver 要不要跨瀏覽器？** 要在 Firefox、WebKit 上測，Playwright 本身就支援；手上已經有一套 Playwright 測試，選掛在它上面的 AI 工具（Midscene、Skyvern、AgentQL）比較好接。主要跑大量遠端 Chromium：自寫 CDP 的工具（Stagehand、Browser Use）在架構上有優勢，代價是只能用 Chromium。

**瀏覽器放哪？** 自己的筆電最簡單，也最容易被反爬機制擋下。需要大量並發、需要代理和 CAPTCHA 處理、需要 session 錄影時，才值得付託管費。會不會被反爬機制擋，主要看瀏覽器環境、輸入方式和從哪個網路出口連線，換一個 AI SDK 通常改變不了；要不要這樣做，先看目標網站的使用條款。

## 三個常見的誤會

**「直接打 CDP 還是用 Playwright」不是二選一。** Playwright 驅動 Chromium 時，底下送出的也是 CDP。差別在中間有沒有那一層現成的包裝。拆掉它的工具是嫌這層包裝在 AI 情境下礙事，不是在用另一種協定。

**Browser Run 和 Stagehand 不是競品。** Browser Run 提供瀏覽器，Stagehand 在上面決定要做什麼。不過兩者目前接不太起來：Browser Run 的 Stagehand 整合[只支援 v2.5.x](https://developers.cloudflare.com/browser-run/stagehand/)，Cloudflare 的說明是 Stagehand v3 之後不再以 Playwright 為基礎。

**廠商的成功率不能拿來互相比。** 廠商宣稱的九成以上成功率，不少來自 [WebVoyager](https://arxiv.org/abs/2401.13919)（arXiv:2401.13919）這個評測。[Online-Mind2Web 論文](https://arxiv.org/abs/2504.01382)（arXiv:2504.01382）指出它涵蓋的網站少、任務偏簡單：一個只會 Google 搜尋、再點進結果看一眼的 agent，在 WebVoyager 上就有 51%。同一篇論文換成上百個真實網站、由人工評分，多數 agent 只剩 30% 左右。看到這類數字，先問是哪個評測、誰評的分。

## 跨層的問題：安全

有一類問題不屬於任何一層，每一層都要處理：**讀網頁的 agent，也在讀攻擊者寫的文字。** 頁面裡藏一段指令，就可能讓 agent 把資料送到不該去的地方。各層的防法不同：

- 工具層：agent-browser 的[安全設定](https://agent-browser.dev/security)提供加密保存的登入資訊（模型看不到密碼）、網域白名單、動作政策，以及把頁面內容標成「不可信」的邊界標記；這些控制預設關閉，要自己開。
- SDK 層：Stagehand 的 [`variables`](https://docs.stagehand.dev/v4/basics/act) 只把變數名稱送給模型，真正的密碼在本機替換（開了 Browserbase 的伺服器端快取時例外，值會送到快取服務）；[v4](https://www.browserbase.com/blog/stagehand-v4) 把網域政策移到瀏覽器內執行，被擋的請求在送出前就攔下。
- 瀏覽器層：託管服務的 session 隔離與錄影，讓事後追查做得到。

系列各篇遇到時會分別處理，這裡先記住一件事：給 agent 開瀏覽器之前，先決定它可以連到哪些網域。

## 系列怎麼讀

系列照五層由上往下排，每篇談一層裡的一個選擇。從你手上的工具所在那一段讀起就好：

| 段落 | 已上線 |
|---|---|
| 給 coding agent 的工具 | [三家 AI 進 Chrome](/posts/ai/2026-05-09-ai-browser-agents-claude-codex-gemini)、[@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp)、[Puppeteer MCP](/posts/tech/2026-06-20-puppeteer-mcp)、[Chrome DevTools MCP](/posts/tech/2026-06-20-chrome-devtools-mcp)、[Browser MCP 三選一](/posts/tech/2026-06-20-browser-mcp-comparison)、[agent-browser 與 CLI 路線](/posts/ai/2026-11-19-agent-browser-cli)、[browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills) |
| 寫程式用的 AI SDK | [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4)、[Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright)、[Midscene.js](/posts/ai/2026-05-23-midscene-vision-ui-automation)、[AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction)、[Skyvern](/posts/ai/2026-11-19-skyvern)、[混合式 SDK 比較](/posts/ai/2026-11-19-ai-browser-sdk-comparison) |
| 模型自己決定 | [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide)、[agent 迴圈怎麼了](/posts/ai/2026-11-19-browser-agent-loop-to-code-mode) |
| Driver 與協定 | [自己打 CDP 還是用 Playwright](/posts/ai/2026-11-18-cdp-vs-playwright-driver)、[CDP 與 WebDriver BiDi](/posts/ai/2026-11-19-cdp-webdriver-bidi) |
| 瀏覽器與執行位置 | [Chromium 以外的引擎](/posts/ai/2026-11-19-browser-engines-beyond-chromium)、[託管瀏覽器對照](/posts/ai/2026-11-19-hosted-browser-comparison)、[Cloudflare Browser Run](/posts/ai/2026-11-19-cloudflare-browser-run)、[Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure)、[Steel](/posts/ai/2026-08-22-steel-browser-infrastructure)、[Hyperbrowser](/posts/ai/2026-08-22-hyperbrowser-browser-infrastructure)、[Cloudflare Kitesurf](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure) |


這個系列不處理兩件事：只想找現成爬蟲服務的讀者，請看[搜尋與爬取實戰](/series/search-and-scraping)系列；繞過反爬機制的做法不教，遇到時只寫合規與限制。

## 自我檢查

1. **Midscene 和 Stagehand 是同一層嗎？** 是，都是混合式 SDK：你寫程式控制流程，個別步驟交給模型。差在感知方式（Midscene 看截圖，Stagehand 讀 accessibility tree）和 driver（Midscene 掛在 Playwright 或 Puppeteer 上，Stagehand 自己打 CDP）。
2. **Cloudflare Browser Run 是 Stagehand 的競品嗎？** 不是。Browser Run 在瀏覽器層，跟它同類的是 Browserbase、Steel；Stagehand 在 AI 層，可以跑在 Browser Run 上，但目前只限 v2.5.x。
3. **你的任務是「每週一次、步驟每次都不同的競品調查」，該從哪一型開始？** 自主 agent 或給 coding agent 的工具。步驟不固定，寫成腳本的成本回收不了。

## 參考資料

- [Stagehand（GitHub）](https://github.com/browserbase/stagehand)
- [Stagehand v4：Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [Stagehand v4：Extract](https://docs.stagehand.dev/v4/basics/extract)
- [Browserbase：Introducing Stagehand v4](https://www.browserbase.com/blog/stagehand-v4)
- [Browser Use（GitHub）](https://github.com/browser-use/browser-use)
- [Browser Use：Closer to the Metal: Leaving Playwright for CDP](https://browser-use.com/posts/playwright-to-cdp)
- [microsoft/playwright-mcp（GitHub）](https://github.com/microsoft/playwright-mcp)
- [vercel-labs/agent-browser（GitHub）](https://github.com/vercel-labs/agent-browser)
- [agent-browser：Security](https://agent-browser.dev/security)
- [Skyvern（GitHub）](https://github.com/Skyvern-AI/skyvern)
- [Cloudflare Browser Run 文件](https://developers.cloudflare.com/browser-run/)
- [Cloudflare Browser Run：/json 端點](https://developers.cloudflare.com/browser-run/quick-actions/json-endpoint/)
- [Cloudflare Browser Run：Stagehand](https://developers.cloudflare.com/browser-run/stagehand/)
- [MDN：Firefox 141 release notes for developers](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)
- [Xue et al., An Illusion of Progress? Assessing the Current State of Web Agents（arXiv:2504.01382）](https://arxiv.org/abs/2504.01382)
- [Lightpanda（GitHub）](https://github.com/lightpanda-io/browser)
- [Patchright（GitHub）](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright)
- [Playwright：Test Agents](https://playwright.dev/docs/test-agents)
- [Puppeteer：WebDriver BiDi support](https://pptr.dev/webdriver-bidi)
