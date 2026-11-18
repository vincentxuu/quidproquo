---
title: "Stagehand vs Playwright：已有 Playwright 腳本，該不該換？"
date: 2026-11-18
category: ai
type: deep-dive
tags: [stagehand, playwright, browser-automation, testing, browser-agent]
lang: zh-TW
tldr: "Stagehand v4 不能接 Playwright 的 page，換過去等於移植，會失去自動等待、strict mode、getByRole、網路攔截、測試 runner 與 Firefox／WebKit。測自家網站留在 Playwright，讓 Test Agents 在寫測試和修測試時介入；在別人網站上 selector 常壞的步驟才換成 Stagehand，只想加幾個 AI 步驟就先看掛在 Playwright 上的 SDK。"
description: "Stagehand v4 與 Playwright 逐項對照：Hacker News 腳本的兩版寫法、移植時會失去的自動等待、strict mode、getBy*、網路攔截與測試工具，Playwright 自己的 AI 路線 Test Agents，以及什麼腳本該留、什麼步驟該換。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 9
---

> 🌏 [English version](/posts/ai/2026-11-18-stagehand-vs-playwright-en)

上一篇介紹了 [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4) 的三個方法。這篇回答接下來的問題：**手上已經有 Playwright 腳本，該不該換成 Stagehand，換了會失去什麼？**

先講一個事實：Stagehand 從 v3 起就不建在 Playwright 上，自己透過 CDP（Chrome DevTools Protocol）控制 Chromium。為什麼要拆掉 Playwright，留到系列的 [Driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)再談；這篇只看它對你的程式碼造成什麼影響。

## 兩者不是同一種東西

Playwright 一次裝進兩樣東西：控制瀏覽器的函式庫，以及疊在上面的測試 runner `@playwright/test`（fixtures、`expect()`、重試、HTML 報表、trace viewer、codegen）。Stagehand 只對應第一樣。它的[遷移指南](https://docs.stagehand.dev/v4/migrations/playwright)開頭就說了：Stagehand 不是測試框架。

兩者也不能混用。Playwright 的 `Page` 不能交給 Stagehand 的 `act()`，官方的說法是「There is no interop; moving a flow to Stagehand means porting it」。Browserbase 在 [v4 發布文](https://www.browserbase.com/blog/stagehand-v4)把「在 Stagehand 腳本裡帶入 Playwright 的 `Page`」列為之後的工作，目前還沒有。

所以「換不換」不是裝個套件的問題，是決定要不要重寫。

## 同一支腳本的兩個版本

遷移指南用的例子是：打開 Hacker News，切到最新文章，讀前五個標題。Playwright 版：

```typescript
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto("https://news.ycombinator.com");
await page.getByRole("link", { name: "new" }).click();
await page.waitForLoadState("domcontentloaded");

const titles = await page.locator(".titleline > a").allTextContents();
console.log(titles.slice(0, 5));

await browser.close();
```

Stagehand v4 版（官方範例，跑在 Browserbase 上；要在本機跑，改用 `localBrowser.launch()` 開瀏覽器）：

```typescript
import { browserbase, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod/v4";

const browser = await browserbase.launch({ apiKey: process.env.BROWSERBASE_API_KEY });
const stagehand = await Stagehand.create({ browser });

try {
  const page = await browser.context.newPage("https://news.ycombinator.com");

  // getByRole() 沒有對應的方法，這個連結也沒有穩定的 selector
  await stagehand.act("Click the 'new' link in the top navigation");
  await page.waitForLoadState("domcontentloaded");

  // extract() 取代 allTextContents() 迴圈，一次回傳有型別的資料
  const { data } = await stagehand.extract(
    "Extract the titles of the first five stories",
    z.object({ titles: z.array(z.string()) }),
  );
  console.log(data.titles);
} finally {
  await stagehand.close();
  await browser.close();
}
```

兩版的差別集中在兩行。`getByRole()` 在 Playwright 裡不用模型，靠的是頁面的角色與名稱；Stagehand 沒有這個方法，官方範例改用 `act()` 請模型找連結，預設每跑一次就多一次推論。`allTextContents()` 換成 `extract()` 也多一次推論，但這一步其實不必：`.titleline > a` 是穩定的 selector，遷移指南另外給了不經模型的寫法，用 `count()` 加 `nth()` 逐一讀出來。

這個例子剛好說明換過去的代價：Playwright 不用模型就做得到的事，在 Stagehand 裡要嘛改用模型，要嘛自己用 `page.evaluate()` 重寫。移植時每一步都該問一次：這裡真的需要模型嗎？

## 換過去會失去什麼

遷移指南列得很完整，下面挑出最容易出事的幾項：

| Playwright 有的 | Stagehand v4 的情況 | 搬過去要做的事 |
|---|---|---|
| 每個動作自動等待元素掛上 DOM、可見、穩定、可點 | 解析 selector 一次，找不到就丟錯 | 動作前自己 `waitForSelector()`，或寫重試迴圈 |
| strict mode：selector 對到多個元素就拒絕動作 | 直接對第一個元素動作 | 自己檢查 `count() === 1` |
| `getByRole()`、`getByLabel()`、`filter()`、locator 串接 | 沒有 | 改寫成 CSS、用 `text=`、交給 `observe()`，或用 `evaluate()` 重建 |
| `page.route()`、request mock、`waitForResponse()` | 沒有網路層，`page.on()` 只有 `"console"` | 只能用 `browser.context.setDomainPolicy()` 的白名單／黑名單擋整個網域 |
| `page.on("dialog")` | 沒有 | 頁面載入前用 `addInitScript()` 改寫 `window.confirm` |
| 多個 context、`storageState()` | 一個瀏覽器只有一個 context | 要隔離就開多個瀏覽器，登入狀態用 cookie API 保存 |
| `@playwright/test`、trace viewer、codegen | 沒有 | 自備 Vitest、Jest 這類 runner；除錯用 Browserbase 的錄影或 `stagehand.metrics()` |
| Firefox、WebKit | 只支援 Chromium | 無法替代 |
| `goto()` 預設等到 `load` | 預設只等到 `domcontentloaded` | 需要子資源載完的地方明寫 `waitUntil` |

**最危險的是 strict mode。** 其他差異多半會直接報錯，你很快就會發現；不會報錯的有兩個，`goto()` 的預設等待和 strict mode。strict mode 更危險：網站改版後，原本只對到一個按鈕的 selector 變成對到三個，Playwright 會拒絕動作並報錯；Stagehand 會安靜地點第一個。官方原話是「a selector that quietly went ambiguous keeps working on the wrong element」。

**最常造成不穩定的是自動等待。** 官方說移植過去的腳本「多半從這裡開始不穩定」。Playwright 會反覆重試直到元素可以操作；Stagehand 只看一次。遷移指南附了一個重試迴圈的寫法，並特別提醒：不要把 `act()` 包進重試迴圈，因為失敗的 `act()` 可能已經點下去了，要重試就重試只做規劃的 `observe()`。

另外三個方法的簽名改了意思：`page.click()`、`page.hover()`、`page.type()` 在 v4 收的是座標或文字，不是 selector。好在型別檢查會擋下來，要點元素一律走 `page.locator(selector).click()`。

## 換過去會得到什麼

- **用一句話描述目標的步驟。** `act()`、`extract()`、`observe()`，細節在[上一篇](/posts/ai/2026-11-18-stagehand-v4)。這是換過去的主要理由。
- **shadow DOM 與 iframe 比較好處理。** CSS selector 會穿過 shadow DOM，包含 closed root；`page.locator("iframe#checkout >> button.submit")` 可以直接跨進 iframe，取代 `frameLocator()`。
- **推論可以省，遠端可以快。** `observe()` 重播加 `selfHeal`、Browserbase 的伺服器端快取、v4 把狀態搬進瀏覽器內的 extension，三件事的適用範圍見 [Stagehand v4](/posts/ai/2026-11-18-stagehand-v4)。要注意本機沒有快取。

## Playwright 自己的 AI 路線

不換 Stagehand，Playwright 這邊也有 AI 可用，而且做法剛好相反。

[Playwright Test Agents](https://playwright.dev/docs/test-agents) 內建三個 agent。planner 探索你的應用，寫出 Markdown 測試計畫。generator 把計畫轉成 Playwright 測試檔，邊跑邊驗證 selector 和斷言。healer 在測試失敗時重跑失敗的步驟、找出對應的元素並提出修補，跑到通過或被護欄擋下為止；如果它判斷是功能本身壞了，會把測試標成 skipped。用 `npx playwright init-agents --loop=claude`（也支援 `vscode`、`codex`、`opencode`）產生 agent 定義，交給你平常用的 coding agent 驅動。

關鍵在產物：generator 寫出來的是一般的 Playwright 測試碼，用的是 `getByRole()` 和 `expect()`。模型只在寫測試和修測試時介入，每天跑的時候完全不用模型。

```diagram
title: 模型在什麼時候介入
desc: 比較兩條路線。Playwright 加 Test Agents：模型在寫測試與測試壞掉時介入，每次執行不用模型。Stagehand：模型在每次執行時的 act、extract 步驟介入，壞掉時由 selfHeal 重新推論。
caption: Stagehand 的 observe 重播與 Browserbase 快取可以讓穩定的步驟不再推論，但預設的 act、extract 每次都會呼叫模型。
---
<svg viewBox="0 0 640 228">
  <text class="dg-sub" x="256" y="28" text-anchor="middle" dominant-baseline="central">寫腳本</text>
  <text class="dg-sub" x="408" y="28" text-anchor="middle" dominant-baseline="central">每次執行</text>
  <text class="dg-sub" x="560" y="28" text-anchor="middle" dominant-baseline="central">壞掉時</text>

  <text class="dg-label" x="24" y="76" dominant-baseline="central">Playwright</text>
  <text class="dg-sub" x="24" y="96" dominant-baseline="central">＋Test Agents</text>
  <rect class="dg-box dg-box--accent" x="192" y="56" width="128" height="56" rx="6"/>
  <text class="dg-label" x="256" y="76" text-anchor="middle" dominant-baseline="central">模型</text>
  <text class="dg-sub" x="256" y="96" text-anchor="middle" dominant-baseline="central">planner、generator</text>
  <rect class="dg-box" x="344" y="56" width="128" height="56" rx="6"/>
  <text class="dg-label" x="408" y="76" text-anchor="middle" dominant-baseline="central">一般測試碼</text>
  <text class="dg-sub" x="408" y="96" text-anchor="middle" dominant-baseline="central">不用模型</text>
  <rect class="dg-box dg-box--accent" x="496" y="56" width="128" height="56" rx="6"/>
  <text class="dg-label" x="560" y="76" text-anchor="middle" dominant-baseline="central">模型</text>
  <text class="dg-sub" x="560" y="96" text-anchor="middle" dominant-baseline="central">healer 改一次測試碼</text>

  <text class="dg-label" x="24" y="164" dominant-baseline="central">Stagehand</text>
  <rect class="dg-box" x="192" y="144" width="128" height="56" rx="6"/>
  <text class="dg-label" x="256" y="164" text-anchor="middle" dominant-baseline="central">你寫</text>
  <text class="dg-sub" x="256" y="184" text-anchor="middle" dominant-baseline="central">或 coding agent 寫</text>
  <rect class="dg-box dg-box--accent" x="344" y="144" width="128" height="56" rx="6"/>
  <text class="dg-label" x="408" y="164" text-anchor="middle" dominant-baseline="central">模型</text>
  <text class="dg-sub" x="408" y="184" text-anchor="middle" dominant-baseline="central">act、extract</text>
  <rect class="dg-box dg-box--accent" x="496" y="144" width="128" height="56" rx="6"/>
  <text class="dg-label" x="560" y="164" text-anchor="middle" dominant-baseline="central">模型</text>
  <text class="dg-sub" x="560" y="184" text-anchor="middle" dominant-baseline="central">selfHeal 執行時重推</text>
</svg>
```

Playwright 另外還有給 coding agent 用的 MCP server，見系列的 [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp) 篇。它的用途是讓 agent 當下操作瀏覽器，不是產生要長期跑的腳本。

## 怎麼選

先問一個問題：**這些頁面是誰的？**

- **測的是自家網站：留在 Playwright。** 頁面是你的，selector 壞了可以從源頭修，例如補上 `data-testid`。你需要的自動等待、strict mode、網路 mock、跨瀏覽器、trace，Stagehand 都沒有。想讓 AI 幫忙，用 Test Agents 產生和修補測試，執行時仍然不用模型；healer 的修補和 skip 要當成 PR 來審，不要讓它直接合進主線。
- **在別人的網站上反覆跑流程，selector 常因改版壞掉：把壞的那幾步換成 Stagehand。** 你改不了對方的 HTML，這正是 `act()`、`extract()` 能幫上忙的地方。穩定的步驟繼續用 `page.locator()`，不要整支改成自然語言。
- **想在既有 Playwright 腳本裡加幾個 AI 步驟，又不想移植：先看掛在 Playwright 上的 SDK。** [Midscene.js](/posts/ai/2026-05-23-midscene-vision-ui-automation)、[AgentQL](/posts/ai/2026-08-21-agentql-semantic-web-extraction) 直接接 Playwright 的 `page`，自動等待、strict mode、跨瀏覽器都留著；代價是看頁面的方式和計費方式不同，系列後面的 SDK 比較篇會並排看。
- **需要 Firefox、WebKit、攔截請求或多個隔離的 context：只能用 Playwright。** 這幾項在 Stagehand 沒有替代方案。
- **流程的步驟每次都不一樣：兩個都不是首選。** 沒有固定步驟，寫腳本的成本回收不了，看 [Browser Use](/posts/ai/2026-08-21-browser-use-complete-guide) 這類模型自己決定下一步的工具。

決定要搬之後，遷移指南建議的順序是：

1. 原封不動搬一支腳本，先跑通。
2. 補上原本靠自動等待的地方。
3. 換掉 `getBy*` 和斷言。
4. 把最常壞的 selector 換成 `act()`、`extract()`。
5. 流程穩定後才開快取。

指南附了一段給 coding agent 的移植規則，可以直接貼進 `CLAUDE.md` 這類規則檔，機械式的對照交給它做。

換之前先做一件事：把最近二十次失敗的錯誤訊息分類，看是「找不到元素、對到多個元素」，還是逾時、彈窗、資料不對。前者才是 Stagehand 幫得上的，後者換 SDK 也不會好。一篇 EHR（電子病歷）整合的[實務分享](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)就是因此從 Stagehand 退回 Playwright，改成寫腳本時才用 AI，細節見 [Stagehand v4 篇的限制](/posts/ai/2026-11-18-stagehand-v4)。

## 參考資料

- [Stagehand：Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [Browserbase：Introducing Stagehand v4](https://www.browserbase.com/blog/stagehand-v4)
- [Playwright：Test Agents](https://playwright.dev/docs/test-agents)
- [Stagehand GitHub](https://github.com/browserbase/stagehand)
- [Michael Kronovet：What we learned building healthcare integrations for the past year](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)
