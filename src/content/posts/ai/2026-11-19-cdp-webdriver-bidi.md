---
title: "CDP 與 WebDriver BiDi：AI 瀏覽器工具底下的兩個協定，「只綁 Chromium」的代價"
date: 2026-11-19
category: ai
type: deep-dive
tags: [cdp, webdriver-bidi, browser-automation, playwright, puppeteer, chromium]
lang: zh-TW
tldr: "CDP 是 Chromium 的除錯協定，能力最完整，但 Google 從不保證相容，2026 年 9 月起官方文件更明寫第三方直接使用「unsupported」。WebDriver BiDi 是 W3C 的跨瀏覽器標準，Firefox 141 已移除 CDP，自動化改走 WebDriver、主推 BiDi；但規格仍是工作草案，Chrome 上的 BiDi 是一層翻譯成 CDP 的程式，比較慢，Puppeteer 走 BiDi 時也還拿不到瀏覽器的 accessibility tree。自己打 CDP 的工具（Browser Use、Stagehand、agent-browser）換到完整能力，付出的是只能用 Chromium 系、跟著 Chrome 改版，而且沒有官方支援。"
description: "AI 瀏覽器自動化的協定層：CDP 的 domain、session 與 target 模型，2026 年 Google 對第三方直接用 CDP 的新立場，Runtime.enable 偵測訊號怎麼被修掉；WebDriver BiDi 的規格狀態、在 Chrome／Firefox／Safari 的實作方式，Puppeteer、Playwright、Selenium 支援到哪；closed shadow root 誰看得到；以及「只綁 Chromium」實際的代價。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 17
---

> 🌏 [English version](/posts/ai/2026-11-19-cdp-webdriver-bidi-en)

[driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)的結尾留了一個代價：Browser Use、Stagehand 拆掉 Playwright、自己打 CDP 之後，就只能用 Chromium。Firefox 在 141 版移除了 CDP，自動化改走 WebDriver BiDi。

這篇往下一層，回答：**CDP 和 WebDriver BiDi 各是什麼樣的協定，為什麼兩者並存；「只綁 Chromium」除了少掉 Firefox，還意味著什麼；你的工具鏈未來會不會被協定卡住。**

## 協定這一層在做什麼

driver 把「點這個按鈕」翻成一則一則的 JSON 訊息，透過 WebSocket（或 pipe）送進瀏覽器，再收回結果和事件。協定定義的就是這些訊息長什麼樣、瀏覽器保證做什麼。

一則 CDP 指令和它的回應、以及一個事件，大致長這樣（示意，數值省略）：

```json
{"id": 1, "sessionId": "8F2…", "method": "Page.navigate", "params": {"url": "https://example.com"}}
{"id": 1, "sessionId": "8F2…", "result": {"frameId": "…", "loaderId": "…"}}
{"sessionId": "8F2…", "method": "Page.loadEventFired", "params": {"timestamp": 1234.5}}
```

同樣的事情用 WebDriver BiDi：

```json
{"id": 1, "method": "browsingContext.navigate", "params": {"context": "…", "url": "https://example.com", "wait": "complete"}}
{"type": "success", "id": 1, "result": {"navigation": "…", "url": "https://example.com"}}
{"type": "event", "method": "browsingContext.load", "params": {…}}
```

形狀很像，都是「有 id 的指令、對應的回應、沒有 id 的事件」。差別在背後的模型和誰為它負責。

## CDP：為 DevTools 設計的協定

CDP（Chrome DevTools Protocol）原本是 Chrome 開發者工具跟瀏覽器溝通用的。[官方文件](https://chromedevtools.github.io/devtools-protocol/)的說法：功能分成 domain（`DOM`、`Network`、`Runtime`……），每個 domain 定義自己的 command 和 event。目前的[定義檔](https://github.com/ChromeDevTools/devtools-protocol)有 59 個 domain，涵蓋效能分析、記憶體、覆蓋率這些除錯功能，所以它能做的事遠多於自動化需要的。

對寫 agent 工具的人，CDP 有三個重要特性：

- **要先 attach 才能操作。** 每個分頁、每個跨網域的 iframe、每個 worker 都是一個獨立的 target。client 用 `Target.attachToTarget` 取得 `sessionId`，之後每則訊息都帶著它（[Getting Started with CDP](https://github.com/aslushnikov/getting-started-with-cdp) 有完整的說明）。跨網域 iframe 跑在另一個行程、是另一個 target，要另外 attach，再自己對回頁面上的哪個 frame。driver 篇講 Browser Use 和 Stagehand 要「自己做 frame 對應」，指的就是這件事。
- **事件要先開。** 大多數 domain 要送 `X.enable` 才會開始推事件，而且狀態是每個 session 各自記。例如 `Runtime.enable` 開了，才收得到「頁面建立了新的 JavaScript 執行環境」，driver 需要它才知道在哪裡執行腳本。
- **能力完整，但沒有承諾。** 很多方法標著 experimental，包括 agent 工具常用的 `Accessibility.getFullAXTree`。

### 2026 年起，官方明說不支援第三方直接使用

CDP 從來不保證向後相容。2026 年 9 月 28 日，[CDP 官方首頁](https://chromedevtools.github.io/devtools-protocol/)改寫（[commit 4bd3de39](https://github.com/ChromeDevTools/debugger-protocol-viewer/commit/4bd3de39)），新增一段「Scope and support」：

> CDP is not a public or supported API for Chrome, and it does not guarantee backwards compatibility. Syntax and semantics may change without notice based on Chromium's requirements and Chrome's product needs.
>
> Direct use of CDP by third-party applications is unsupported.

同一段列出官方支援、建在 CDP 上的產品：Chrome、Chrome DevTools 前端、[Chrome DevTools for agents](https://developer.chrome.com/docs/devtools/agents)、Lighthouse、Puppeteer、ChromeDriver，並建議第三方工具改透過 Chrome DevTools for agents、Puppeteer 或 ChromeDriver 連線。FAQ 的說法是第三方直接使用「has been tolerated」，但協定變動時「may break without notice」。

這份名單裡沒有 Playwright，也沒有 Browser Use、Stagehand、agent-browser。改寫前的版本只說最新開發版的協定（tip-of-tree）「no backwards compatibility support guaranteed」，現在多了明確的立場。實際影響是：Chrome 改了某個方法，修好是工具作者的事；Puppeteer 也用 experimental 方法，但它在官方名單裡，有 Chrome 團隊跟著改。

### Runtime.enable：協定留下的一個痕跡

「事件要先開」這個設計曾經是最有名的偵測訊號。`Runtime.enable` 開了之後，頁面呼叫 `console.debug(err)` 時，瀏覽器會把 err 序列化傳給 client，過程中會讀 err 的 `stack` 屬性；網站把 `stack` 換成 getter，getter 被呼叫就知道有 CDP client 在聽（[Castle 的說明](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/)）。2025 年 5 月，Playwright 維護者 Pavel Feldman 送進兩個 V8 commit（[object preview](https://chromium.googlesource.com/v8/v8/+/61a907540d4c1dda4733476e54c977910f31041d)、[error preview](https://chromium.googlesource.com/v8/v8/+/e08e97347454255a337dcea361808fb25ca09077)），讓預覽不再執行頁面的 getter，Chrome 138（V8 13.8）起這個訊號失效。其他痕跡和偵測的整體觀念，見 [driver 篇](/posts/ai/2026-11-18-cdp-vs-playwright-driver)。

## WebDriver BiDi：把事件放進標準

舊的 WebDriver（現在稱 WebDriver Classic）是 W3C 標準，Selenium 用的就是它。它走 HTTP，一問一答：client 送指令，瀏覽器回結果，瀏覽器沒辦法主動通知你「頁面印了一行 log」「有個請求發出去了」。CDP 能做到這些，所以 Puppeteer 這類新工具改用 CDP，結果綁在 Chromium 上；Playwright 則另外替 Firefox、WebKit 打 patch、用自己的協定。

WebDriver BiDi 是補這個缺口的新標準。[規格](https://www.w3.org/TR/webdriver-bidi/)開頭寫的目的：

> In place of the strict command/response format of WebDriver, this permits events to stream from the user agent to the controlling software, better matching the evented nature of the browser DOM.

BiDi 走 WebSocket，定義了 10 個模組：`session`、`browser`、`browsingContext`、`emulation`、`network`、`script`、`storage`、`log`、`input`、`webExtension`。規格的編輯來自 Mozilla 和 Google，2026 年 11 月的狀態仍是 **W3C Working Draft**，還不是 Candidate Recommendation。

跟 CDP 對照（依兩邊的定義整理，不是一一對應）：

| 要做的事 | CDP | WebDriver BiDi |
|---|---|---|
| 指定操作哪個分頁或 frame | attach target，訊息帶 `sessionId` | 直接用 browsing context 的 id，不用 attach |
| 收事件 | 每個 session 各自送 `X.enable` | `session.subscribe`，可限定在某些 context |
| 執行 JavaScript | `Runtime.evaluate`，指定 execution context | `script.evaluate`，指定 realm（一個 JavaScript 全域環境），可開不受頁面腳本影響的 sandbox |
| 攔截網路請求 | `Fetch` domain | `network.addIntercept` |
| 找元素 | 沒有 locator，要自己執行腳本或查 DOM | `browsingContext.locateNodes`（CSS、XPath、文字、accessibility） |
| 讀 accessibility tree | `Accessibility.getFullAXTree`（experimental） | 規格還沒有；Chrome 有 `goog:` 開頭的擴充 |

兩邊的設計假設也不同。[Chrome 團隊的文章](https://developer.chrome.com/blog/webdriver-bidi)指出，CDP 的 client 和瀏覽器幾乎都在同一台機器上，延遲很低；BiDi 預設兩者可能隔著網路，所以盡量減少來回次數，例如拿一個物件的 id 和值，BiDi 一次就好，CDP 要兩次。同一篇 FAQ 也說得很清楚：BiDi 不會取代 CDP，Chromium 會繼續用 CDP 做除錯。

## 三個瀏覽器各怎麼實作

- **Firefox：原生 BiDi，CDP 已移除。** Firefox 的 CDP 一直是實驗性的部分實作（2021 年預設開啟時只支援 82 個 API），129 版[宣布棄用](https://fxdx.dev/deprecating-cdp-support-in-firefox-embracing-the-future-with-webdriver-bidi/)，141 版[整個拿掉](https://fxdx.dev/cdp-retirement-in-firefox/)。Mozilla 建議還在用 CDP 的人暫時改用 Firefox 140 ESR 過渡。
- **Chrome：BiDi 是一層翻譯。** Chrome 的 BiDi 來自 [chromium-bidi](https://github.com/GoogleChromeLabs/chromium-bidi) 專案，README 的描述是「a JavaScript layer translating between BiDi and CDP, running inside a Chrome tab」。透過 ChromeDriver 時，這個 mapper 跑在瀏覽器的一個分頁裡；Puppeteer 和 Playwright 在 Chrome 上開 BiDi 時，則在 Node.js 行程裡跑同一份 mapper，接在 CDP 連線上。也就是說，Chrome 上的 BiDi 最後還是 CDP。
- **Safari：剛起步。** Safari Technology Preview 到 2026 年秋天仍在陸續補 BiDi 指令（截圖指令 [10 月](https://webkit.org/blog/18420/)才加入），Selenium 的 Ruby 版在 Safari 開 BiDi 時也會[警告這是 experimental](https://github.com/SeleniumHQ/selenium/pull/17729)。

```diagram
title: 同一個動作走到三個瀏覽器的路徑
desc: 上排：工具直接用 CDP 控制 Chrome。中排：工具用 WebDriver BiDi 送出指令，經過 chromium-bidi 翻譯成 CDP，再控制 Chrome。下排：工具用 WebDriver BiDi 直接控制 Firefox。
caption: 在 Chrome 上，BiDi 指令最後還是會翻成 CDP；在 Firefox 上沒有 CDP 可用。Playwright 預設的 Firefox、WebKit 走的是自己 patch 過的版本與協定，不在圖上。
---
<svg viewBox="0 0 640 320">
  <text class="dg-tag" x="24" y="32" dominant-baseline="central">直接打 CDP（BROWSER USE、STAGEHAND、AGENT-BROWSER）</text>
  <rect class="dg-box" x="24" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="76" text-anchor="middle" dominant-baseline="central">你的工具</text>
  <rect class="dg-box" x="464" y="48" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="76" text-anchor="middle" dominant-baseline="central">Chrome</text>
  <path class="dg-line" d="M176 76H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="62" text-anchor="middle" dominant-baseline="central">CDP</text>

  <text class="dg-tag" x="24" y="136" dominant-baseline="central">BIDI 到 CHROME</text>
  <rect class="dg-box" x="24" y="152" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="180" text-anchor="middle" dominant-baseline="central">你的工具</text>
  <rect class="dg-box dg-box--accent" x="244" y="152" width="152" height="56" rx="6"/>
  <text class="dg-label" x="320" y="172" text-anchor="middle" dominant-baseline="central">chromium-bidi</text>
  <text class="dg-sub" x="320" y="192" text-anchor="middle" dominant-baseline="central">BiDi 翻成 CDP</text>
  <rect class="dg-box" x="464" y="152" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="180" text-anchor="middle" dominant-baseline="central">Chrome</text>
  <path class="dg-line" d="M176 180H240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M396 180H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="210" y="166" text-anchor="middle" dominant-baseline="central">BiDi</text>
  <text class="dg-edge" x="430" y="166" text-anchor="middle" dominant-baseline="central">CDP</text>

  <text class="dg-tag" x="24" y="240" dominant-baseline="central">BIDI 到 FIREFOX</text>
  <rect class="dg-box" x="24" y="256" width="152" height="56" rx="6"/>
  <text class="dg-label" x="100" y="284" text-anchor="middle" dominant-baseline="central">你的工具</text>
  <rect class="dg-box" x="464" y="256" width="152" height="56" rx="6"/>
  <text class="dg-label" x="540" y="284" text-anchor="middle" dominant-baseline="central">Firefox</text>
  <path class="dg-line" d="M176 284H460" marker-end="url(#arrow)"/>
  <text class="dg-edge" x="320" y="270" text-anchor="middle" dominant-baseline="central">BiDi</text>
</svg>
```

多一層翻譯是有成本的。Puppeteer 維護者在 2026 年 2 月的一個 [draft PR](https://github.com/puppeteer/puppeteer/pull/14676) 裡，對同一份工作在 Chrome 上量了一次：只算底層 CDP 指令，等瀏覽器回應的總時間 BiDi 模式是 7,662 ms，CDP 模式是 4,505 ms，也就是經過 mapper 之後，底層的 CDP 往返變多或變慢了。這是單次量測，但 chromium-bidi [自己的效能文件](https://github.com/GoogleChromeLabs/chromium-bidi/blob/main/docs/benchmark.md)也把「BiDi 和 CDP 零差距」列為目標，並承認不容易達到。

## 工具支援到哪

**Puppeteer**：從 23 版起正式支援 Firefox，Firefox 預設走 BiDi；Chrome 仍預設走 CDP，[官方](https://pptr.dev/webdriver-bidi)的理由是「not all CDP features are supported by WebDriver BiDi yet」。BiDi 模式下不支援的功能，官方列了一長串，跟 agent 工具最相關的幾項：

- **Accessibility 整類不支援**，ARIA selector 也不行。用 Puppeteer 的 Accessibility API 讀頁面的 agent，改走 BiDi 就失去主要的感知來源。
- **讀不到 response body**（`HTTPResponse.text()`、`buffer()` 等），擷取類工具要另想辦法。
- **Tracing、Coverage、`createCDPSession()`** 都沒有。

**Playwright**：預設不靠標準協定。[官方文件](https://playwright.dev/docs/browsers)寫明它的 Firefox 和 WebKit 都是打過 patch 的版本，「doesn't work with the branded version」；Firefox 那條走的是 Playwright 為它自寫的 Juggler 協定。用一般的 Firefox 走 BiDi 已經可以（`moz-firefox` 這類 channel），但官方還沒宣布正式支援。[追蹤 issue](https://github.com/microsoft/playwright/issues/37277) 裡，最新的 Firefox Nightly 已通過大多數 Playwright 測試，仍有彈出視窗的生命週期、雙擊、worker 等缺口。維護者說轉 BiDi 的主要好處是不用再維護瀏覽器 patch，但「BiDi support in WebKit doesn't look feasible in the foreseeable future」，所以實際上只是 Firefox 要不要從 Juggler 換成 BiDi。

**Selenium**：最積極。它把[整個實作](https://www.selenium.dev/documentation/webdriver/bidi/)從 WebDriver Classic 移往 BiDi，CDP 相關的頁面標為「being phased out」，4.29 起[拿掉了 Firefox 的 CDP 支援](https://www.selenium.dev/blog/2025/remove-cdp-firefox/)。

## closed shadow root：誰看得到

[Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright) 提到 Stagehand 的 CSS selector 能穿過 closed shadow root，Playwright 的 locator 不行。差別就在協定層。

closed shadow root 的設計就是讓頁面裡的 JavaScript 拿不到：`element.shadowRoot` 會回傳 `null`。Playwright 的 locator 在頁面裡執行，[官方文件](https://playwright.dev/docs/locators)直接寫「Closed-mode shadow roots are not supported」。

CDP 站在頁面外面，看得到。`DOM.getDocument` 帶 `pierce: true` 會連 shadow root 一起回傳，節點上標著 `shadowRootType: "closed"`。Stagehand v4 先用這個方法找出 closed root，從頁面外拿到它的參照，再把參照交給頁面裡的函式，讓 selector 在裡面跑；extension 那一側則用 Chrome extension 專屬的 API 直接取得 closed root。所以[它的文件](https://docs.stagehand.dev/v4/reference/locator)也註明「Closed roots require a navigated page」：`about:blank`、`data:` 頁面上沒有這些特權 API。

accessibility tree 則要看它從哪裡來。Puppeteer 維護者 Alex Rudenko [的說法](https://stackoverflow.com/questions/78684488)是，ARIA selector 根據瀏覽器自己的 accessibility tree，經由 CDP 能找到 closed shadow root 裡的元素，前提是那個元素有被放進 accessibility tree。如果工具是在頁面裡用 JavaScript 自己走 DOM 組出「accessibility snapshot」，就一樣碰不到 closed root。

BiDi 規格在序列化節點時會帶出 shadow root，並標明 `mode: "closed"`，標準層面也看得到。只是 Puppeteer 走 BiDi 時沒有 accessibility tree，這條路目前還接不起來。

## 「只綁 Chromium」的代價，說精確一點

自己打 CDP 的工具，綁的其實是 CDP，不完全是 Chromium：agent-browser 也能接 Lightpanda 這類自己實作 CDP 的引擎。但桌面版 Firefox 和 Safari 確定走不到。整理起來，代價有三層：

1. **少了 Firefox 和 Safari。** 寫測試、要驗跨瀏覽器的人會在意；只抓資料、跑流程的 agent 多半不在意。
2. **跟著 Chrome 改版。** 協定不保證相容，experimental 方法隨時會變。工具要跟著 Chrome 更新，你也要把工具和瀏覽器版本一起管理。Selenium 的做法是每一版只支援最近三個 Chrome 版本的 CDP。
3. **沒有官方支援。** 2026 年 9 月起，Google 明說第三方直接用 CDP 不受支援，建議改透過 Puppeteer、ChromeDriver 或 Chrome DevTools for agents。

反過來，BiDi 的代價是：規格還是草案，Chrome 上多一層翻譯、比較慢，瀏覽器的 accessibility tree、response body 這些 agent 常用的能力還沒到位。這兩條路短期內都不會只剩一條。Chrome 說 BiDi 不取代 CDP，Firefox 則已經沒有 CDP。

## 你的工具鏈會不會被卡住

- **只在 Chrome 上跑 agent、抓資料**：繼續用 Browser Use、Stagehand、agent-browser 沒有問題。把 Chrome 版本固定下來，升級工具時一起升瀏覽器，看一下 release notes 有沒有提到 CDP 的變動。
- **需要 Firefox 或 Safari**：直接打 CDP 的工具都不行。用 Playwright（patch 過的版本），或 Puppeteer、Selenium 的 BiDi；先確認你要的功能不在 Puppeteer 的不支援清單上。
- **自己寫 driver**：照 Google 現在的立場，建在 Puppeteer 上比直接打 CDP 多一層官方支援；代價是 driver 篇講的那些控制權。
- **工具依賴 accessibility tree**：先看它從哪裡來。讀瀏覽器原生 tree 的（CDP 的 `Accessibility.getFullAXTree`、Puppeteer 的 Accessibility API），短期內要留在 Chromium 和 CDP，這是 BiDi 目前最大的缺口；Playwright 這類在頁面裡自己算 aria snapshot 的，三個瀏覽器都能用，但看不到 closed shadow root。

## 想深入

協定決定了能控制哪些引擎。下一篇換到最底層：Chromium 以外還有哪些引擎可以給 agent 用，Lightpanda 這類自己實作 CDP 的新引擎換到什麼、犧牲什麼。

## 參考資料

- [Chrome DevTools Protocol 官方文件](https://chromedevtools.github.io/devtools-protocol/)
- [ChromeDevTools/debugger-protocol-viewer commit 4bd3de39（Scope and support 改寫）](https://github.com/ChromeDevTools/debugger-protocol-viewer/commit/4bd3de39)
- [ChromeDevTools/devtools-protocol（協定定義檔）](https://github.com/ChromeDevTools/devtools-protocol)
- [Andrey Lushnikov：Getting Started with Chrome DevTools Protocol](https://github.com/aslushnikov/getting-started-with-cdp)
- [Castle：Why a classic CDP bot detection signal suddenly stopped working](https://blog.castle.io/why-a-classic-cdp-bot-detection-signal-suddenly-stopped-working-and-nobody-noticed/)
- [V8 commit 61a9075：Prevent side effects during object preview](https://chromium.googlesource.com/v8/v8/+/61a907540d4c1dda4733476e54c977910f31041d)
- [V8 commit e08e973：Prevent side effects during error preview](https://chromium.googlesource.com/v8/v8/+/e08e97347454255a337dcea361808fb25ca09077)
- [W3C：WebDriver BiDi](https://www.w3.org/TR/webdriver-bidi/)
- [Chrome for Developers：WebDriver BiDi - The future of cross-browser automation](https://developer.chrome.com/blog/webdriver-bidi)
- [GoogleChromeLabs/chromium-bidi](https://github.com/GoogleChromeLabs/chromium-bidi)
- [MDN：Firefox 141 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/141)
- [Firefox Developer Experience：CDP Retirement in Firefox](https://fxdx.dev/cdp-retirement-in-firefox/)
- [Firefox Developer Experience：Deprecating CDP Support in Firefox](https://fxdx.dev/deprecating-cdp-support-in-firefox-embracing-the-future-with-webdriver-bidi/)
- [WebKit：Release Notes for Safari Technology Preview 254](https://webkit.org/blog/18420/)
- [Puppeteer：WebDriver BiDi support](https://pptr.dev/webdriver-bidi)
- [Puppeteer PR #14676（BiDi 與 CDP 效能量測）](https://github.com/puppeteer/puppeteer/pull/14676)
- [Playwright：Browsers](https://playwright.dev/docs/browsers)
- [Playwright：Locators（Shadow DOM）](https://playwright.dev/docs/locators)
- [microsoft/playwright issue #37277：Firefox 走 BiDi 的討論](https://github.com/microsoft/playwright/issues/37277)
- [Selenium：WebDriver BiDi](https://www.selenium.dev/documentation/webdriver/bidi/)
- [Selenium：Removing ChromeDevTools Support For Firefox](https://www.selenium.dev/blog/2025/remove-cdp-firefox/)
- [Stack Overflow：Access elements inside closed shadow DOM（Alex Rudenko 的回答）](https://stackoverflow.com/questions/78684488)
- [Stagehand：Locator](https://docs.stagehand.dev/v4/reference/locator)
- [Chrome for Developers：Chrome DevTools for agents](https://developer.chrome.com/docs/devtools/agents)
- [chromium-bidi：benchmark](https://github.com/GoogleChromeLabs/chromium-bidi/blob/main/docs/benchmark.md)
- [SeleniumHQ/selenium PR #17729（Safari BiDi）](https://github.com/SeleniumHQ/selenium/pull/17729)
