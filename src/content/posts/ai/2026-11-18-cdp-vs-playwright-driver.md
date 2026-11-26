---
title: "自己打 CDP 還是用 Playwright：Browser Use、Stagehand 拆掉 Playwright 的理由與代價"
date: 2026-11-18
category: ai
type: deep-dive
tags: [cdp, playwright, browser-automation, browser-agent, browser-use, stagehand]
lang: zh-TW
tldr: "Browser Use 和 Stagehand 拆掉 Playwright、自己用 CDP 寫 driver，理由是 agent 要對頁面下大量查詢、需要 frame 層級的控制，而 Python 版的 Node.js driver 和遠端瀏覽器放大了延遲與狀態落差。代價是只剩 Chromium、自己處理當機，自動等待、strict mode 和網路攔截也要重做；直接打 CDP 本身也不會讓你比較難被偵測。"
description: "AI 瀏覽器 driver 層的取捨：Playwright 的 client、Node.js driver、瀏覽器三段架構，Browser Use 與 Stagehand 拆掉 Playwright 的理由，自己打 CDP 的代價（只剩 Chromium、當機處理、失去等待與網路攔截），Patchright 改的是什麼，以及「直接打 CDP 比較隱形」為什麼不成立。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 16
---

> :globe: [English version](/posts/ai/2026-11-18-cdp-vs-playwright-driver-en)

[上一篇](/posts/ai/2026-11-19-browser-agent-loop-to-code-mode)講到 Browser Use 1.0 讓模型直接打 CDP，理由之一是 Playwright 的 locator 看不到 closed shadow root。這不是第一次：前面幾篇一直出現同一句話，Stagehand 從 v3 起不建在 Playwright 上，Browser Use 在 2025 年 8 月就拆掉了 Playwright。Playwright 是公認成熟的工具，為什麼做 AI 瀏覽器工具的團隊要自己重寫一層？

這篇回答：**driver 這一層在做什麼，為什麼有人拆掉 Playwright，拆掉要付出什麼。** 這是系列裡最抽象的一篇，也是五層裡看不見的那兩層的第一篇，所以先從一個場景開始。

## 一個 agent 的一步

一個瀏覽器 agent 要決定下一步點哪裡，得先知道頁面上有哪些元素、各在哪個位置、看不看得見、會不會被別的元素蓋住、有沒有掛點擊事件。Browser Use 在[說明拆掉 Playwright 的文章](https://browser-use.com/posts/playwright-to-cdp)裡說，為了檢查元素位置、透明度、繪製順序、JavaScript 事件監聽和 aria 屬性，他們要下「thousands of CDP calls」。

寫測試腳本的人很少碰到這種量。一支測試點十個按鈕、檢查五個斷言，每個動作多花幾毫秒沒人在意。agent 每一步都要先把頁面查一遍，同樣的額外成本乘上幾千次呼叫，就變成看得到的延遲。

## driver 是一層翻譯

[五層地圖](/posts/ai/2026-11-18-ai-browser-automation-layers)裡，driver 夾在 AI 層和協定之間：你說「點這個按鈕」，driver 把它翻成瀏覽器聽得懂的協定指令。Chromium 系瀏覽器聽的是 CDP（Chrome DevTools Protocol），一組 JSON 格式的指令，例如 `Page.navigate`、`DOM.getDocument`、`Input.dispatchMouseEvent`。

翻譯層的好處是你不用懂 CDP。一個 `locator.click()` 背後，driver 會先等元素出現、確認它可見而且沒被遮住、捲動到畫面裡、算出座標，再送出滑鼠事件。壞處是每多一層翻譯，就多一處可能跟瀏覽器實際狀態不同步。

## Playwright 的三段架構

Playwright 支援 TypeScript、Python、Java、.NET，核心邏輯只寫一份，用 Node.js 實作。Python 版會在背景啟動一個 Node.js driver 行程，兩邊透過 stdin／stdout 交換訊息。Playwright 維護者在 [GitHub issue](https://github.com/microsoft/playwright-python/issues/2688) 解釋過 Python 套件為什麼那麼大：跟瀏覽器的溝通、重試和周邊邏輯都在 driver 裡。driver 是 Node.js 寫的，所以 Python 套件附了一份 Node.js。

TypeScript 版沒有這一跳。從 [Playwright 原始碼](https://github.com/microsoft/playwright/blob/c0cc9802/packages/playwright-core/src/inProcessFactory.ts)可以看到，Node.js 的 client 和 server 建在同一個行程裡，直接互傳訊息。但你手上的 `Page` 仍然是一份副本，這點下面講 Stagehand 時會再碰到。

```diagram
title: Playwright 與自己打 CDP 的指令路徑
desc: 上排是 Playwright 的 Python、Java、.NET 版：你的程式透過 pipe 把 Playwright 協定的訊息送給 Node.js driver，driver 再控制瀏覽器。下排是自己打 CDP：你的程式直接用 CDP 控制瀏覽器。
caption: 上排的狀態分散在三個行程裡，下排只有兩個；driver 控制 Chromium 時走 CDP。Stagehand v4 又把派送 CDP 的那一層搬進瀏覽器內的 extension，見 Stagehand v4 篇的圖。
---
<svg viewBox="0 0 640 244">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">PLAYWRIGHT（PYTHON、JAVA、.NET）</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="68" text-anchor="middle" dominant-baseline="central">你的程式</text>
  <text class="dg-sub" x="100" y="88" text-anchor="middle" dominant-baseline="central">保存物件副本</text>
  <rect class="dg-box" x="244" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="68" text-anchor="middle" dominant-baseline="central">Node.js driver</text>
  <text class="dg-sub" x="320" y="88" text-anchor="middle" dominant-baseline="central">等待、重試</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="76" text-anchor="middle" dominant-baseline="central">瀏覽器</text>
  <path class="dg-line" d="M176 76H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="62" text-anchor="middle" dominant-baseline="central">pipe</text>
  <text class="dg-edge" x="430" y="62" text-anchor="middle" dominant-baseline="central">CDP</text>

  <text class="dg-tag" x="24" y="148" dominant-baseline="central">自己打 CDP（BROWSER USE、STAGEHAND V3）</text>
  <rect class="dg-box dg-box--accent" x="24" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="184" text-anchor="middle" dominant-baseline="central">你的程式</text>
  <text class="dg-sub" x="100" y="204" text-anchor="middle" dominant-baseline="central">自己處理等待與當機</text>
  <rect class="dg-box" x="464" y="164" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="192" text-anchor="middle" dominant-baseline="central">瀏覽器</text>
  <path class="dg-line dg-line--accent" d="M176 192H460" marker-end="url(#arrow-accent)"/>
  <text class="dg-edge" x="320" y="178" text-anchor="middle" dominant-baseline="central">CDP</text>
</svg>
```

這個設計讓四種語言的行為一致，`Page`、`BrowserContext` 這些物件也把瀏覽器底層的 target、frame、session 包裝得很乾淨。代價是同一份狀態有好幾份：瀏覽器裡的真實狀態、driver 記得的狀態、你的程式手上的物件。

## Browser Use 為什麼拆掉

Browser Use 的文章列了三個理由，都是他們自己的經驗，沒有對照實驗。

**多一跳。** 每個指令都要先經過 Node.js 那一層再進瀏覽器，下幾千次 CDP 查詢時，延遲累積得很明顯。他們把這一段描述成經過 websocket 的網路往返；不過依上面那則 issue，Python 和 driver 在本機走的是 stdin／stdout，不是網路。多出來的是每次呼叫的行程間往返和翻譯，呼叫次數越多越吃虧。

**三處狀態會漂移。** 瀏覽器、driver、Python 三邊的狀態偶爾對不上。他們描述的最糟情況是：分頁在瀏覽器裡當掉，driver 一直等一個不會來的回應，Python 那邊也卡住，只能 `kill -9` 重來。這類問題只在約 1% 的情況、特定的慢速網路下出現，但評測一跑幾千步，就會把整體成功率拉下來。

**邊緣情況繞不過去。** 他們列的清單包括：

- 超過 16,000 像素高的整頁截圖會讓 Playwright 當掉
- `alert()`、`confirm()`、`onbeforeunload` 的處理
- 沒有先 focus 頁面就送出鍵盤滑鼠輸入
- 遠端瀏覽器上的檔案上傳下載
- `chrome://` 這類特殊頁面
- 分頁當掉

`DEBUG=pw:api` 能幫一點，但他們認為繞著一層自己改不動的中繼層寫 workaround，已經不划算。

拆掉之後，他們用自己產生的 Python CDP 綁定 [cdp-use](https://github.com/browser-use/cdp-use) 直接下指令，改成訂閱 CDP 事件的架構，用專門的 watchdog 監看下載和當機。他們說元素擷取、截圖和預設動作都快了很多（沒有附數字），也終於能正確處理跨網域的 iframe。代價也寫得很老實：光是分頁當掉，他們就列了至少十種方式，估計 Playwright 處理好其中一半，另一半被那層 driver 擋住。拆掉之後，全部都要自己處理：「now we're faced with the difficult challenge of solving 100% of these cases ourself」。

## Stagehand 為什麼拆掉

Stagehand 拆掉 Playwright 是在 v3。Browserbase 在 2025 年 10 月的〈[Why we're graduating from Playwright](https://www.browserbase.com/blog/stagehand-playwright-evolution-browser-automation)〉列了三點，也都是自己的經驗：

- **為測試設計的等待會拖慢自動化。** Playwright 只在元素可見、穩定、可操作時才點，這對 E2E 測試很好；做自動化時，他們常常想直接動手，這些檢查反而增加延遲。
- **需要 CDP 層級的控制，尤其是 frame。** Stagehand 要從 CDP 讀 accessibility tree、DOM 快照和網路事件，交給模型當上下文。Playwright 不提供唯一的 frame ID，要把 CDP 指令送到特定 frame 很麻煩；透過 Playwright 的 `CDPSession` 做大量 CDP 工作，往返也太多。
- **長時間執行的問題。** 使用者回報長時間的 session 記憶體一直漲，也碰過特定版本的回歸問題。

v4 再往前一步，理由跟遠端瀏覽器有關。給你 `page` 物件的框架都在本機留一份瀏覽器狀態的副本，Playwright 是這樣，Stagehand v3 自己也是。瀏覽器離得越遠，副本越容易過期；頁面用 `window.open` 開出的分頁，甚至會趕在網域攔截生效前開始載入。v4 因此把狀態管理和 CDP 派送搬進瀏覽器內的 extension，細節與 v3／v4 的對照圖見 [Stagehand v4 篇](/posts/ai/2026-11-18-stagehand-v4)。

要注意 Stagehand v4 並沒有少一層：SDK 先把訊息送給瀏覽器裡的 extension，extension 再打 CDP。它換的是那一層的位置，從你的機器搬到瀏覽器旁邊。官方也說，瀏覽器在你的筆電上時能省的不多。

遠端瀏覽器對 Playwright 也有另一個限制。連託管瀏覽器時，Playwright 多半只能用 [`connectOverCDP()`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp) 接上去。它的文件自己寫，這種連線比 Playwright 自家協定的連線「significantly lower fidelity」。瀏覽器沒用 Playwright 那套參數啟動時，部分功能可能會壞。

## 拆掉的代價

兩家的理由都成立，但都是在「大量呼叫、遠端瀏覽器、為 agent 打造」這個前提下成立。拆掉 Playwright 之後失去的東西，Stagehand 自己的[遷移指南](https://docs.stagehand.dev/v4/migrations/playwright)列得最清楚：

- **只剩 Chromium。** CDP 是 Chromium 的協定。Firefox 在 141 版[移除了實驗性的 CDP 實作](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)，自動化改走 WebDriver，主推 WebDriver BiDi。自己打 CDP 的工具幾乎註定只能用 Chromium。
- **等待、strict mode、網路攔截要自己做。** 這些都是 driver 層的功能。Stagehand v4 沒有自動等待，selector 對到多個元素時直接點第一個，也沒有 `page.route()`。逐項對照在 [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright) 那篇。
- **當機與邊緣情況要自己扛。** Playwright 原本替你處理掉的當機情況，現在全部要自己處理。
- **沒有官方支援。** CDP 從不保證向後相容；2026 年 9 月起，CDP 官方文件更明寫第三方直接使用「unsupported」，建議改透過 Puppeteer、ChromeDriver 這類 Google 自己的產品。細節在[協定篇](/posts/ai/2026-11-19-cdp-webdriver-bidi)。

## 常見誤會：直接打 CDP 比較不會被偵測

這個說法沒有證據支持。Playwright 控制 Chromium 時用的本來就是 CDP，「自己打 CDP」和「透過 Playwright 打 CDP」走的是同一個協定。

網站偵測自動化看的是協定留下的痕跡和整體環境，不是你用哪個函式庫。一個經典的例子是 `Runtime.enable`：自動化工具開啟這個 CDP 網域後，頁面可以用一段 JavaScript 測出 DevTools 正在預覽物件。偵測公司 Castle 的[文章](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/)指出，V8 在 2025 年 5 月的兩個修改讓這個訊號失效。他們也說，在某些設定下仍有其他 JavaScript 訊號能測出 CDP 自動化。他們現在主要靠多層訊號：滑鼠與捲動的行為、執行環境的特徵、代理與網路、大規模活動的時間序列。

[Patchright](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright) 正好說明偵測面在哪裡。它是 Playwright 的修改版，API 不變，改的是會留下痕跡的地方：

- 不呼叫 `Runtime.enable`，改在隔離的執行環境跑 JavaScript。
- 整個關掉 Console API，所以 console 功能不能用。
- 調整啟動參數，例如拿掉 `--enable-automation`。

它也只支援 Chromium；[Notte](https://github.com/nottelabs/notte) 這類 SDK 的安裝步驟就是用 Patchright 裝瀏覽器。換句話說，被偵測的程度取決於這些痕跡和環境，不取決於有沒有 Playwright。

## 誰在哪一邊

| 用現成 driver | 自己打 CDP |
|---|---|
| Playwright、Puppeteer、Selenium | Stagehand（v3 起；v4 改由瀏覽器內 extension 派送） |
| 掛在現成 driver 上的 AI 工具，例如 [@playwright/mcp](/posts/tech/2026-06-20-playwright-mcp)、可以接 Playwright 或 Puppeteer 的 [Midscene.js](/posts/ai/2026-05-23-midscene-vision-ui-automation) | Browser Use（2025 年 8 月起，cdp-use） |
| 用 Patchright 的 Notte | [agent-browser](https://github.com/vercel-labs/agent-browser)（Rust 寫的 daemon） |

## 怎麼選

- **寫測試、寫一般自動化腳本：用 Playwright。** 你下的指令不多，等待、strict mode、跨瀏覽器、trace 都直接省下大量工作，三段架構的成本感覺不到。
- **在做 agent 框架，每一步要大量查詢頁面，或主要跑遠端 Chromium：自己打 CDP 才有意義。** 先確認你願意自己處理當機、對話框、特殊頁面，而且接受只能用 Chromium。
- **在意自動化痕跡：先知道 Patchright 改得到什麼、改不到什麼。** 它只處理協定與啟動參數留下的痕跡，Castle 說的行為、環境、網路訊號它管不到；而且只支援 Chromium，console 也不能用。要不要碰，先看目標網站的使用條款。
- **你只是用 Stagehand 或 Browser Use：這是工具作者的決定。** 你要知道的是它帶來的限制，主要是只有 Chromium，以及少了哪些 Playwright 功能。

## 想深入

driver 底下是協定。CDP 只屬於 Chromium，Firefox 的自動化已經轉向 WebDriver BiDi；這兩個協定差在哪、「只綁 Chromium」長期會不會卡住你的工具鏈，見下一篇 [CDP 與 WebDriver BiDi](/posts/ai/2026-11-19-cdp-webdriver-bidi)。

## 參考資料

- [Browser Use：Closer to the Metal: Leaving Playwright for CDP](https://browser-use.com/posts/playwright-to-cdp)
- [Browserbase：Why we're graduating from Playwright](https://www.browserbase.com/blog/stagehand-playwright-evolution-browser-automation)
- [Browserbase：Introducing Stagehand v4](https://www.browserbase.com/blog/stagehand-v4)
- [Stagehand：Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [microsoft/playwright-python issue #2688：Why is the python package so large?](https://github.com/microsoft/playwright-python/issues/2688)
- [microsoft/playwright：inProcessFactory.ts](https://github.com/microsoft/playwright/blob/c0cc9802/packages/playwright-core/src/inProcessFactory.ts)
- [Playwright：BrowserType.connectOverCDP](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp)
- [MDN：Firefox 141 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)
- [Castle：Why a classic CDP bot detection signal suddenly stopped working](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/)
- [Patchright GitHub](https://github.com/Kaliiiiiiiiii-Vinyzu/patchright)
- [browser-use/cdp-use](https://github.com/browser-use/cdp-use)
- [Notte GitHub](https://github.com/nottelabs/notte)
