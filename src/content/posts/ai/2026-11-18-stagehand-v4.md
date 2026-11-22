---
title: "Stagehand v4 怎麼用：act、observe、extract 與不再推論的重播"
date: 2026-11-18
category: ai
type: deep-dive
tags: [stagehand, browserbase, browser-automation, browser-agent, cdp]
lang: zh-TW
tldr: "Stagehand v4 是 Browserbase 的開源瀏覽器 SDK（MIT，TypeScript／Python／Go）：穩定的步驟用 page.locator()，需要判斷的步驟才用 act()、extract() 呼叫模型，observe() 回傳的 Action 可以不經推論直接重播。伺服器端快取只在 Browserbase 的瀏覽器上有效、要另外申請開通；只支援 Chromium，v4 也拿掉了 agent()。"
description: "Stagehand v4 介紹：act、observe、extract 三個方法各在什麼時候用，怎麼用 observe 加重播、selfHeal 與 Browserbase 伺服器端快取減少推論，v4 的 extension 架構與移除 agent() 的原因，以及只支援 Chromium、本機沒有快取等限制。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 8
---

> :globe: [English version](/posts/ai/2026-11-18-stagehand-v4-en)

[Stagehand](https://github.com/browserbase/stagehand) 是瀏覽器託管公司 [Browserbase](/posts/ai/2026-08-22-browserbase-browser-infrastructure) 開源的瀏覽器自動化 SDK，MIT 授權，同時有 TypeScript、Python、Go 三種語言版本。它跟 Playwright 一樣讓你寫程式開頁面、點按鈕，差別是多了三個呼叫模型的方法：`act()` 用一句話執行一個動作，`extract()` 把頁面內容抽成有型別的資料，`observe()` 找出頁面上能做的動作。

在[五層地圖](/posts/ai/2026-11-18-ai-browser-automation-layers)裡，Stagehand 屬於 AI 層的「混合式 SDK」：控制流程在你的程式碼裡，只有你挑出來的步驟交給模型。2026 年 8 月推出的 v4 改了不少東西，這篇以 v4 為準。

這篇回答一個問題：**哪些步驟值得花一次模型推論，怎麼讓同一步下次不用再花。**

## 給誰

會寫 TypeScript 或 Python，手上有一個要反覆跑的網頁流程（登入後台抓報表、填固定的表單、從會改版的頁面抽資料），而 selector 常常壞掉的人。

不適合拿來取代 E2E 測試：Stagehand 官方明說它[不是測試框架](https://docs.stagehand.dev/v4/migrations/playwright)，沒有 `expect()`、fixtures、重試與報表。手上已有 Playwright 測試要不要換，見 [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright)。

## 三個方法

**`act()`：一次一個動作。** 給它一句指令，例如 `act("click the sign in button")`，Stagehand 讀取頁面的 accessibility tree（瀏覽器替螢幕閱讀器整理的頁面結構，只留下按鈕、輸入框、連結這類元素和它們的名稱）。它請模型挑出目標元素和動作，再執行。[官方文件](https://docs.stagehand.dev/v4/basics/act)把話講得很直接：多步驟寫在同一句指令裡「unreliable」，要自己拆成好幾個 `act()`。

**`extract()`：抽出有型別的資料。** 給一句指令加一個 schema（TypeScript 用 Zod、Python 用 Pydantic、Go 用型別參數），Stagehand 回傳前先驗證格式，拿到的就是有型別的物件。要抓連結時，欄位宣告成 URL 型別；Stagehand 讓模型選元素 ID，再自己對照回頁面上真正的網址，網址本身不是模型產生的。

**`observe()`：先看，不動手。** 給一句描述，例如 `observe("find the email input")`，回傳一組候選動作，每個 `Action` 帶著真實的 selector、方法名稱和參數。它只規劃，不碰頁面。

`observe()` 是三個裡最容易被忽略、也最省錢的一個，原因在下一節。

## 一步該用哪個方法

```diagram
title: Stagehand 的一個步驟該用哪個方法
desc: 有穩定 selector 就用 page.locator()；沒有的話，讀資料用 extract()，要點或要填就先 observe() 一次，再用 act(Action) 重播，selector 失效時由 selfHeal 重新推論一次。
caption: 依 Stagehand v4 文件整理。page.locator() 不經模型；act(Action) 重播時跳過推論與頁面快照。
---
<svg viewBox="0 0 504 488">
  <path class="dg-line" d="M136 34V60" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M248 108H292" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M136 152V188" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M248 236H292" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M136 280V316" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M136 376V412" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M248 444H292" marker-end="url(#arrow-warn)"/>

  <circle class="dg-dot" cx="136" cy="28" r="6"/>

  <path class="dg-box" d="M136 64L248 108L136 152L24 108Z"/>
  <text class="dg-label" x="136" y="98" text-anchor="middle" dominant-baseline="central">selector 穩定？</text>
  <text class="dg-sub" x="136" y="120" text-anchor="middle" dominant-baseline="central">例如 data-testid</text>

  <rect class="dg-box dg-box--accent" x="296" y="80" width="192" height="56" rx="6"/>
  <text class="dg-label" x="392" y="98" text-anchor="middle" dominant-baseline="central">page.locator()</text>
  <text class="dg-sub" x="392" y="120" text-anchor="middle" dominant-baseline="central">不經模型，毫秒級</text>

  <path class="dg-box" d="M136 192L248 236L136 280L24 236Z"/>
  <text class="dg-label" x="136" y="226" text-anchor="middle" dominant-baseline="central">要讀資料？</text>
  <text class="dg-sub" x="136" y="248" text-anchor="middle" dominant-baseline="central">還是要點、要填</text>

  <rect class="dg-box" x="296" y="208" width="192" height="56" rx="6"/>
  <text class="dg-label" x="392" y="226" text-anchor="middle" dominant-baseline="central">extract()</text>
  <text class="dg-sub" x="392" y="248" text-anchor="middle" dominant-baseline="central">依 schema 驗證</text>

  <rect class="dg-box" x="24" y="320" width="224" height="56" rx="6"/>
  <text class="dg-label" x="136" y="338" text-anchor="middle" dominant-baseline="central">observe() 一次</text>
  <text class="dg-sub" x="136" y="360" text-anchor="middle" dominant-baseline="central">拿到 Action 與 selector</text>

  <rect class="dg-box dg-box--accent" x="24" y="416" width="224" height="56" rx="6"/>
  <text class="dg-label" x="136" y="434" text-anchor="middle" dominant-baseline="central">act(Action)</text>
  <text class="dg-sub" x="136" y="456" text-anchor="middle" dominant-baseline="central">重播，不再推論</text>

  <rect class="dg-box dg-box--ghost" x="296" y="416" width="192" height="56" rx="6"/>
  <text class="dg-label" x="392" y="434" text-anchor="middle" dominant-baseline="central">selector 失效</text>
  <text class="dg-sub" x="392" y="456" text-anchor="middle" dominant-baseline="central">selfHeal 重推一次</text>

  <text class="dg-edge" x="270" y="96" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="146" y="170" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge" x="270" y="224" text-anchor="middle" dominant-baseline="central">是</text>
  <text class="dg-edge" x="146" y="298" text-anchor="start" dominant-baseline="central">否</text>
  <text class="dg-edge dg-text--warn" x="270" y="432" text-anchor="middle" dominant-baseline="central">失效時</text>
</svg>
```

**有穩定 selector 的步驟，不要用模型。** Stagehand v4 自己就是一個完整的瀏覽器 driver，`page.goto()`、`page.locator().click()`、`fill()` 都有。官方的遷移指南也這樣建議：selector 穩定的地方一律用 `page.locator()`，每一步都呼叫模型會多付延遲和錢，CSS selector 不會。

**要讀資料，用 `extract()`。** 一張表格本來要寫 `count()` 加迴圈逐列讀，換成一次 `extract()` 加陣列 schema。

**要點、要填，先 `observe()` 再重播。** `act()` 收到的如果是一句指令，每次都要推論；收到的如果是 `observe()` 回傳的 `Action`，就直接照記錄的 selector 執行，[文件](https://docs.stagehand.dev/v4/basics/act)說這會「跳過模型推論、頁面快照和 DOM 穩定等待」。一張表單有十個欄位，`observe("find all form input fields")` 一次推論，十個欄位各用 `act(field)` 重播，就是一次推論換十個動作。

重播的 selector 失效時（網站改版了），開了 `selfHeal` 的話，Stagehand 會重新推論一次再試。對重播的 `Action` 來說，「自我修復」的實際範圍就是這樣：只重試一次，而且要你開啟。指令式的 `act("...")` 每次都重新推論，本來就跟得上改版，代價是每次都要推論。

## 一個完整的例子：登入後抓發票

官方 README 的例子示範了三個方法。cookie 存在本機資料夾，下次執行不用重新登入；不過照原樣每跑一次要推論五次，要反覆跑的話，再改成下一節的重播版：

```typescript
import { localBrowser, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod/v4";

const browser = await localBrowser.launch({ userDataDir: "./browser-data" });
const stagehand = await Stagehand.create({
  browser,
  model: { modelName: "openai/gpt-5.4-mini", apiKey: process.env.OPENAI_API_KEY },
});

const [page] = await browser.context.pages();
await page.goto("https://app.example.com/login");

// observe() 回傳真實的 selector，帳密不會經過模型
const { data: email } = await stagehand.observe("find the email input");
const { data: password } = await stagehand.observe("find the password input");
await page.locator(email[0].selector).fill(process.env.APP_EMAIL!);
await page.locator(password[0].selector).fill(process.env.APP_PASSWORD!);

await stagehand.act("click the sign in button");
await stagehand.act("open the billing page");

const { data } = await stagehand.extract(
  "extract every invoice in the table",
  z.object({
    invoices: z.array(z.object({ number: z.string(), amount: z.number(), paid: z.boolean() })),
  }),
);
console.log(data.invoices);

await stagehand.close();
await browser.close();
```

注意登入那段的寫法：模型只負責找到輸入框，真正的帳密由一般的 `fill()` 填進去，從頭到尾不進 prompt。另一種做法是 `act()` 的 `variables` 選項：指令寫 `"type %password% into the password field"`，Stagehand 只把變數名稱給模型，真正的值在本機替換。


## 讓同一步下次不用再推論

**跨次執行重播。** 官方文件示範把 `observe()` 的結果[存在記憶體裡的 Map](https://docs.stagehand.dev/v4/basics/observe)，同一次執行內重複使用。要讓明天的執行也不用推論，就把 `Action` 存成檔案。`Action` 在 TypeScript 裡是一般物件（`description`、`method`、`arguments`、`selector`），可以直接寫成 JSON：

```typescript
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

// 其餘設定同上，只多開 selfHeal
const stagehand = await Stagehand.create({ browser, selfHeal: true });

// 第一次執行：推論一次，把 Action 存起來
if (!existsSync("signin.json")) {
  const { data } = await stagehand.observe("find the sign in button");
  await writeFile("signin.json", JSON.stringify(data[0]));
}

// 之後每次：讀檔重播，不經模型；selector 失效時 selfHeal 會重推一次
const signIn = JSON.parse(await readFile("signin.json", "utf8"));
await stagehand.act(signIn);
```

存檔這一步是延伸官方記憶體版的寫法，上線前先跑一次確認讀回來的物件能重播。selfHeal 重推也救不回來時，刪掉檔案重新 `observe()` 就好。

**今晚就能做的事：** 打開你最常壞的那支爬蟲，找出最常改版的那一步，把寫死的 selector 換成 `observe()`，印出回傳的 `Action` 看它挑了哪個元素。對了，照上面的寫法存檔重播；不對，把指令寫得更具體（「header 裡的搜尋按鈕」）再試一次。

Stagehand 有兩層省推論的機制，適用範圍不一樣：

| | `observe()` 加重播 | Browserbase 伺服器端快取 |
|---|---|---|
| 怎麼用 | 自己保存 `Action`，之後傳給 `act()` | 開通後預設生效；`Stagehand.create({ cache })` 可以關掉或調門檻 |
| 在哪裡跑 | 本機或 Browserbase 都可以 | 只有 Browserbase 的瀏覽器 |
| 需要申請 | 不用 | 要寫信給 Browserbase 為專案開通 |
| 涵蓋 | `act()` | `act()`、`observe()`、`extract()` |

[伺服器端快取](https://docs.stagehand.dev/v4/best-practices/caching)的 key 由指令文字、頁面內容和呼叫選項組成，刻意不包含模型設定，換模型不會讓快取失效。同樣的呼叫要得到相同結果達到門檻次數（`threshold`），才開始回傳快取；每次呼叫的 `metadata.cache.status` 會告訴你是 `HIT`、`MISS` 還是 `DISABLED`。

幾個會讓快取失效或不生效的情況：

- **本機瀏覽器完全沒有快取。** v4 不再有本機端的快取，`cache` 選項在本機瀏覽器上沒有作用，每次都推論。
- 網址帶動態參數時，快取可能對不上。
- 用 `locator` 限定範圍的呼叫不進快取，狀態會顯示 `DISABLED`。
- **帶密碼的呼叫要關快取。** `variables` 原本不會送給模型，但開了伺服器端快取時，變數的值會隨請求送到快取服務。[官方建議](https://docs.stagehand.dev/v4/basics/act)帶憑證的呼叫加 `cache: false`。

## v4 改了什麼

**狀態管理搬進瀏覽器。** Stagehand 從 v3 起就不再建在 Playwright 上，自己透過 CDP 控制 Chromium。v4 更進一步，把 target 管理、frame 追蹤和 CDP 指令派送全部移進一個跟瀏覽器一起啟動的 extension。你的 SDK 透過原本那條 CDP 連線跟 extension 溝通。一個點擊會展開成好幾個 CDP 指令，這些指令現在都在瀏覽器裡執行，不再逐一跨網路往返。

```diagram
title: Stagehand v3 與 v4：CDP 指令在哪裡跑
desc: v3 時 SDK 在本機保存瀏覽器狀態，每個 CDP 指令都跨網路送到瀏覽器；v4 的 SDK 只送一則訊息給瀏覽器內的 Stagehand extension，由它在瀏覽器裡對頁面下 CDP 指令。
caption: 依 Browserbase 的 v4 發布文整理。瀏覽器在遠端時，跨網路那一段就是延遲來源；瀏覽器在本機時差別不大。
---
<svg viewBox="0 0 640 304">
  <line class="dg-rule" x1="320" y1="24" x2="320" y2="288"/>
  <rect class="dg-zone" x="352" y="140" width="256" height="140" rx="6"/>

  <path class="dg-line" d="M160 112V220" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <path class="dg-line dg-line--accent" d="M424 112V172" marker-end="url(#arrow-accent)"/>
  <path class="dg-line" d="M476 204H504" marker-end="url(#arrow)"/>

  <text class="dg-heading" x="40" y="36" dominant-baseline="central">v3</text>
  <text class="dg-heading" x="360" y="36" dominant-baseline="central">v4</text>
  <text class="dg-tag" x="368" y="158" dominant-baseline="central">瀏覽器</text>

  <rect class="dg-box" x="40" y="56" width="240" height="52" rx="6"/>
  <text class="dg-label" x="160" y="74" text-anchor="middle" dominant-baseline="central">你的程式（SDK）</text>
  <text class="dg-sub" x="160" y="94" text-anchor="middle" dominant-baseline="central">保存一份瀏覽器狀態</text>

  <rect class="dg-box" x="40" y="224" width="240" height="52" rx="6"/>
  <text class="dg-label" x="160" y="250" text-anchor="middle" dominant-baseline="central">瀏覽器</text>

  <rect class="dg-box" x="360" y="56" width="240" height="52" rx="6"/>
  <text class="dg-label" x="480" y="74" text-anchor="middle" dominant-baseline="central">你的程式（SDK）</text>
  <text class="dg-sub" x="480" y="94" text-anchor="middle" dominant-baseline="central">只送請求</text>

  <rect class="dg-box dg-box--accent" x="372" y="176" width="104" height="56" rx="6"/>
  <text class="dg-label" x="424" y="196" text-anchor="middle" dominant-baseline="central">Stagehand</text>
  <text class="dg-sub" x="424" y="216" text-anchor="middle" dominant-baseline="central">extension</text>

  <rect class="dg-box" x="508" y="176" width="88" height="56" rx="6"/>
  <text class="dg-label" x="552" y="204" text-anchor="middle" dominant-baseline="central">頁面</text>

  <text class="dg-edge" x="172" y="156" text-anchor="start" dominant-baseline="central">每個 CDP 指令</text>
  <text class="dg-edge" x="172" y="176" text-anchor="start" dominant-baseline="central">都跨網路</text>
  <text class="dg-edge" x="436" y="126" text-anchor="start" dominant-baseline="central">一則訊息</text>
  <text class="dg-edge" x="490" y="190" text-anchor="middle" dominant-baseline="central">CDP</text>
</svg>
```

官方的理由寫在 [v4 發布文](https://www.browserbase.com/blog/stagehand-v4)：每個給你 `page` 物件的框架，都在本機維護一份瀏覽器狀態的副本。瀏覽器在遠端時，副本和實際狀態的落差會變大，就會出現「Target page, context or browser has been closed」這類錯誤。好處主要在遠端瀏覽器上，官方自己也說，瀏覽器在你筆電上時能省的不多。同一篇文章附了一次 50 步的量測：用實驗中的批次指令對遠端瀏覽器跑，跟 Playwright 比，`goBack` 的中位數從 139.5 毫秒降到 17.5 毫秒；作者註明這是單次執行，不是 benchmark。

網域政策也一樣搬進了瀏覽器。用 `browser.context.setDomainPolicy({ allowedDomains, blockedDomains })` 設定之後，連頁面自己用 `window.open` 開的彈出視窗，也會在請求送出前就被擋下；v3 的版本要等視窗開了再關掉。

架構改變也讓三種語言共用同一個核心：SDK 變成薄薄一層 client，TypeScript、Python、Go 才能同時推出、功能一致。

**`agent()` 拿掉了。** v3 有個 `agent()`，把 `act`、`extract`、`observe` 包成迴圈，讓模型每一步挑一個工具。v4 的[遷移指南](https://docs.stagehand.dev/v4/migrations/v3)說它是為「還不能可靠地自己操作瀏覽器的模型」設計的，現在改推兩條路。一是讓 coding agent 寫一支 Stagehand 腳本，之後直接跑腳本，官方建議從這裡開始；二是把 Stagehand 的整套 API 當成工具，交給你自己的 agent。為什麼各家都在拿掉內建的 agent 迴圈，系列後面有一篇專門談。

## 限制

- **只支援 Chromium。** 沒有 Firefox、WebKit，也不會自動下載瀏覽器，本機執行用你已經裝好的 Chrome。
- **不會自動等待。** Stagehand 解析 selector 一次，找不到就丟錯；`goto()` 預設只等到 `domcontentloaded`。動作前要自己 `waitForSelector()`。從 Playwright 搬過來要注意哪些差異，見 [Stagehand vs Playwright](/posts/ai/2026-11-18-stagehand-vs-playwright)。
- **不要對 `act()` 寫重試迴圈。** 失敗的 `act()` 可能已經點下去、送出去了。官方的[遷移指南](https://docs.stagehand.dev/v4/migrations/playwright)與[成本頁](https://docs.stagehand.dev/v4/best-practices/cost-optimization)建議改成重試 `observe()`（它只規劃），確定之後再交給 `act()` 執行一次；要換更強的模型重試，也是換在 `observe()` 上，不是 `act()`。
- **API 變得很快。** 從 v2 到 v4 不到一年半，建構方式、回傳格式、`agent()` 都改過，模型訓練資料裡多半是舊寫法。官方因此提供了給 coding agent 用的[規則檔](https://docs.stagehand.dev/v4/first-steps/ai-rules)，可以放進 `CLAUDE.md` 或 `.cursorrules`。
- **Cloudflare Browser Run 只支援 v2.5.x。** Cloudflare 的[說明](https://developers.cloudflare.com/browser-run/stagehand/)是 Stagehand v3 之後不再以 Playwright 為基礎。要用 v4 的託管瀏覽器，目前主要是 Browserbase。
- **accessibility tree 不是萬能。** 一篇 2026 年 5 月、v4 推出前的 EHR（電子病歷）整合[實務分享](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)，最後從 Stagehand 退回 Playwright。複雜的 DOM 上，accessibility tree 對不到正確的元素；而他們真正遇到的錯誤是隨機彈窗、渲染太慢、業務上的邊界情況，不是網站改版。Stagehand 解決的是「selector 因為改版而壞掉」，其他種類的不穩定它幫不上忙。

## 怎麼開始

1. 安裝：`pnpm add @browserbasehq/stagehand 'zod@~4.4.3'`（Python 是 `pip install stagehand`）。本機執行需要裝好 Chrome。
2. 準備一個模型的 API key，在 `Stagehand.create()` 的 `model` 裡設定。
3. 從上面的例子改起：先全部用 `page.locator()` 跑通，再照「今晚就能做的事」把最常壞的一兩步換掉。

如果你只是想讓 Claude Code 或 Codex 開瀏覽器，不需要 SDK：Stagehand 另外有一支 `browse` CLI，本機使用[不需要模型 key，也不需要 Browserbase 帳號](https://github.com/browserbase/stagehand#install)，系列裡的 [browse.sh](/posts/ai/2026-05-23-browse-sh-browser-skills) 那篇談的就是它的技能目錄。

## 參考資料

- [browserbase/stagehand（GitHub）](https://github.com/browserbase/stagehand)
- [Stagehand v4：Act](https://docs.stagehand.dev/v4/basics/act)
- [Stagehand v4：Observe](https://docs.stagehand.dev/v4/basics/observe)
- [Stagehand v4：Extract](https://docs.stagehand.dev/v4/basics/extract)
- [Stagehand v4：Caching actions](https://docs.stagehand.dev/v4/best-practices/caching)
- [Stagehand v4：Cost optimization](https://docs.stagehand.dev/v4/best-practices/cost-optimization)
- [Stagehand v4：Migrate Playwright to v4](https://docs.stagehand.dev/v4/migrations/playwright)
- [Stagehand v4：Migrate v3 to v4](https://docs.stagehand.dev/v4/migrations/v3)
- [Stagehand v4：AI rules](https://docs.stagehand.dev/v4/first-steps/ai-rules)
- [Stagehand v4：Stagehand reference](https://docs.stagehand.dev/v4/reference/stagehand)
- [Browserbase：Introducing Stagehand v4](https://www.browserbase.com/blog/stagehand-v4)
- [Cloudflare Browser Run：Stagehand](https://developers.cloudflare.com/browser-run/stagehand/)
- [What we learned building healthcare integrations for the past year（DEV Community）](https://dev.to/michael_kronovet_261e3cc1/what-we-learned-building-healthcare-integrations-for-the-past-year-4n94)
