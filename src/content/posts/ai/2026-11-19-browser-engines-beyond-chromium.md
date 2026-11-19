---
title: "Chromium 以外的瀏覽器引擎：Lightpanda、Kitesurf、Obscura 給 AI agent 用，換到什麼、犧牲什麼"
date: 2026-11-19
category: ai
type: deep-dive
tags: [lightpanda, kitesurf, obscura, headless-browser, browser-automation, chromium]
lang: zh-TW
tldr: "Lightpanda、Cloudflare Kitesurf、Obscura 都是為 agent 和擷取重寫的瀏覽器引擎，自己實作 CDP，所以 Puppeteer、Playwright 換個連線位址就能接。Lightpanda 完全不畫圖；Kitesurf 和 Obscura 會排版、能截圖，但畫出來的不等於 Chrome。換到的主要是記憶體和 CPU：第三方實測每多開一頁，Lightpanda 多約 14 MB、Chrome 的 headless shell 多約 69 MB；會不會比較快，要看並行量。犧牲的是不報錯的差異（點到被遮住的按鈕、confirm() 回 false）、Lightpanda 一眼就認得出來的指紋，以及截圖。要像素或要登入身分就留在 Chromium；大量擷取公開頁面才值得試。"
description: "給 AI agent 用的非 Chromium 瀏覽器引擎：為什麼工具預設都用 Chromium；Lightpanda（不畫圖）與 Kitesurf、Obscura（自己畫）兩條路線；記憶體與 CPU 省多少、時間為什麼不一定快；靜默的相容性差異、指紋與截圖的代價；Firefox、WebKit 在這裡的位置；以及怎麼判斷你的工作能不能換掉 Chromium。"
draft: false
series:
  name: "AI 瀏覽器自動化"
  order: 18
---

> 🌏 [English version](/posts/ai/2026-11-19-browser-engines-beyond-chromium-en)

[協定篇](/posts/ai/2026-11-19-cdp-webdriver-bidi)說過，直接打 CDP 的工具綁的其實是 CDP，不完全是 Chromium：任何自己實作 CDP 的引擎都接得上。2026 年這類引擎多了好幾個：Lightpanda 出了 1.0，Cloudflare 把 Kitesurf 開源，Obscura 加上了自己的排版和繪製。它們都主打「給 agent 用、比 Chrome 輕」。

這篇回答：**這些引擎換到什麼、犧牲什麼；你的工作（大量擷取，還是需要截圖、登入、複雜的單頁應用）能不能換掉 Chromium。**

## 為什麼大家預設用 Chromium

幾乎每個 AI 瀏覽器工具都預設 Chromium，原因可以拆成五個：

- **CDP 是它的原生協定。** 其他引擎要接上這些工具，得自己把 CDP 實作一遍。
- **版本能固定。** [Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing) 是給自動化用的 Chrome，不會自動更新，每個版本都有，測試結果可以重現。agent-browser 找不到 Chrome 時就是從這裡下載。
- **有輕量的無頭版本。** 從 Chrome 132 起，舊的 headless 模式分出來成為獨立的 [`chrome-headless-shell`](https://developer.chrome.com/docs/chromium/headless)，Playwright 無頭執行時預設用它。
- **網站是照 Chrome 測的。** 2026 年 10 月，[StatCounter](https://gs.statcounter.com/browser-market-share) 的全球占比 Chrome 是 68.79%，Edge、Opera、Samsung Internet 也都是 Chromium 核心。網站開發者最常測的就是這個引擎。
- **指紋跟真實使用者一樣。** 一個跟大多數訪客都不一樣的瀏覽器，本身就會被認出來。

換掉 Chromium，就是在這五點上各讓一步，換取資源用量。

## 兩條路線：不畫圖，或自己畫

| | Lightpanda | Kitesurf | Obscura |
|---|---|---|---|
| 誰做的 | Lightpanda 公司 | Cloudflare | 個人開發者 |
| 寫成 | Zig，JavaScript 用 V8 | Rust 元件，JavaScript 在 Workers 裡跑 | Rust，JavaScript 用 V8 |
| 畫面 | **不排版、不畫圖** | 自己排版、繪製，能截圖和產 PDF | 自己排版、繪製，能截圖和產 PDF |
| 協定 | CDP、MCP，WebDriver BiDi 剛起步 | CDP、Playwright、Puppeteer、MCP | CDP、MCP |
| 授權 | AGPL-3.0（貢獻要簽 CLA） | Apache-2.0 | Apache-2.0 |
| 狀態 | 2026-10 [發布 1.0](https://lightpanda.io/blog/posts/lightpanda-1-0) | Browser Run 的可選引擎；2026-11 開源 | v0.2.x，agent-browser 標為 experimental |

**[Lightpanda](https://github.com/lightpanda-io/browser)** 是最極端的一個。它的 JavaScript 交給 V8，HTML 解析用 Servo 專案的 html5ever，DOM 和 Web API 用 Zig 自己寫，但完全沒有排版和繪製。[官方文件](https://lightpanda.io/docs/core-concepts/architecture-overview)寫得很清楚：元素位置是依 DOM 深度和兄弟順序「模擬」出來的，`Page.captureScreenshot` 回傳的是一張佔位圖；`--dump png` 只是把頁面的 markdown 畫成圖片。預設也會送使用統計，用 `LIGHTPANDA_DISABLE_TELEMETRY=true` 關掉。

**[Kitesurf](https://developers.cloudflare.com/browser-run/kitesurf/)** 是 Cloudflare Browser Run 裡的另一個引擎，不指定時預設仍是 Chromium。它用 Blitz 做 HTML、DOM、排版與繪製，用 Stylo 算 CSS，JavaScript 在 Workers 裡跑，跑不了時才退到 Boa。2026 年 11 月它[以 Apache-2.0 開源](https://blog.cloudflare.com/kitesurf-open-source/)，可以自己部署到 Workers（需要付費方案）；README 提醒，本機版的 JavaScript 跑在 `workerd` 裡，不是加固過的沙箱，不要拿來開不受信任的網站。官方列出的不適用情境：播影片和 WebGL、用真實 TLS 指紋通過機器人驗證、需要持久狀態的長時間登入。架構細節見 [Kitesurf 篇](/posts/ai/2026-08-22-cloudflare-kitesurf-browser-infrastructure)。

**[Obscura](https://github.com/h4ckf0r0day/obscura)** 用 Rust 寫、內嵌 V8，後來加上了自己的 CSS 排版和繪製，可以截圖、產 PDF，README 也承認長尾 CSS、部分 Web API 和字型繪製「may differ from Chromium」。它另外提供可選的 stealth 模式，例如指紋隨機化。[Cloudflare 說](https://blog.cloudflare.com/kitesurf/) Kitesurf 最初的靈感就來自 Obscura。細節見站上的 [Obscura 篇](/posts/ai/2026-09-28-obscura-rust-headless-browser)。

這三個以外，還有 Rust 寫的 [Moli](https://github.com/lexmount/moli) 這類新專案；[Ladybird](https://ladybird.org/) 還沒有第一個 alpha 版；[Servo](https://servo.org/) 的定位是嵌進應用程式的 WebView，不是給自動化用的。

## 換到什麼：記憶體和 CPU，不一定是時間

廠商自己的數字都很漂亮，但條件要看清楚：

- **Lightpanda 的 README** 寫記憶體少 16 倍、快 9 倍，說明文字寫在 AWS m5.large 上抓 933 個網頁，表格標的是 100 頁。它自己的[方法文件](https://github.com/lightpanda-io/demo/blob/main/BENCHMARKS.md)寫的卻是 m5.xlarge，而 123 MB、約 5 秒那組數字對應的是 25 個平行行程的那一列，抓的是 Lightpanda 自己的示範網站。
- **Kitesurf 的[文件](https://developers.cloudflare.com/browser-run/kitesurf/)**在擷取 HTML 的測試裡寫 CPU 少約 3.8 倍、記憶體少約 7 倍，但總時間比預先暖機的 Chromium 慢約 1.7 倍；截圖那一列是 CPU 少 3.1 倍、記憶體少 4.7 倍、慢 1.8 倍。

兩份第三方測試在資源上的結論一致，在速度上不一致。[Bright Data](https://brightdata.com/blog/comparison/lightpanda-vs-playwright-and-headless-chrome) 拿 Lightpanda 1.0.2 和 Chrome 的 headless shell 抓 16 個公開網站：每多開一個並行頁面，Lightpanda 多用約 14 MB，headless shell 多用約 69 MB，CPU 時間是後者的 44% 到 48%；但在最多 8 個並行的測試裡，「Neither browser was consistently faster in wall time」，作者的結論是「The main gain is memory, not speed」。[Gologin 的評測](https://gologin.com/blog/lightpanda-review/)在 25 個並行頁面時，Lightpanda 則快了約一倍（9.0 秒對 20.7 秒）。並行量越大，省下的資源越可能變成速度。

同一篇還算了一筆帳：省下的 CPU 大約是每千頁 12 個 CPU 分鐘；如果你付費買 proxy 流量，一千頁的 1.6 到 2 GB 流量比這 12 分鐘還貴。而在 Chrome 裡擋掉圖片，省下的 proxy 流量跟換成 Lightpanda 差不多。

要注意，Bright Data 和另一份來自 Gologin 的評測都是賣 Chrome 型雲端瀏覽器或防偵測產品的公司，而且是同一位作者寫的。目前找得到的實測都來自有利害關係的廠商。

## 犧牲什麼：不報錯的差異

最危險的不是報錯，而是看起來成功、結果不一樣。Bright Data 跑了 44 項 Playwright 檢查，Lightpanda 預設只有 22 項跟 Chrome 一樣，開了四個旗標後是 30 項。不一樣但不會報錯的有 11 項，例如：

- **點到被遮住的按鈕。** 沒有排版，就不知道按鈕上面蓋著一層 overlay。在 Chrome 上，Playwright 會發現按鈕被遮住、點擊逾時報錯；Lightpanda 則直接點下去。
- **`confirm()` 回傳 false。** 對話框不會跳出來給你處理。
- **CSS `:hover` 選單打不開**，`@media` 規則也不會隨 viewport 改變。
- **IntersectionObserver 把每個元素都判成在畫面內。** 像 YouTube 這種靠它觸發無限捲動的頁面，載入行為就跟 Chrome 不同；一個 Next.js 頁面預先抓了 21 個連結頁面，Chrome 只抓 4 個。

另外三項會直接報錯：同一個 browser context 開第二個頁面、下載檔案（1.0.3 已修）、service worker。

其他代價：

- **指紋。** Lightpanda 送出的 user agent 是 `Lightpanda/1.0`，`--user-agent` 不接受含「Mozilla」的值，TLS 和 HTTP/2 指紋也跟 Chrome 不同，有機器人偵測的網站認得出每一個請求。Gologin 的評測在 19 個 Lightpanda Cloud session 上得到同一個 FingerprintJS 訪客 ID。Kitesurf 的官方文件也把「用真實 TLS 指紋通過機器人驗證」列為不適用情境。
- **相容性。** Lightpanda [宣稱](https://lightpanda.io/blog/posts/lightpanda-1-0)通過 170 萬個 WPT 子測試，但其中大部分是編碼相關的自動生成測試；Bright Data 把兩邊的編碼測試都扣掉重算，Lightpanda 通過的數量約是 Chrome 的 57%，CSS 部分只有 24%。Kitesurf 官方各頁的 WPT 數字也互相不一致，跨廠商比較沒有意義。
- **抓到的文字。** 19 個網頁裡，Lightpanda 有 15 個抓到九成以上的文字；Medium 只抓到 2% 到 25%。Lightpanda [自己的 agent 測試](https://lightpanda.io/docs/core-concepts/benchmarks)裡，agent-browser 接 Lightpanda 在 GAIA Level 1 上是 81.1%，接 Chromium 是 84.9%，官方承認差在「text-only output misses content a rendered page would show」。

## Firefox、WebKit 是另一回事

Firefox 和 WebKit 是完整的瀏覽器引擎，一點也不比 Chromium 輕。選它們的理由是跨瀏覽器測試，或是不想讓所有流量都長得像 Chrome，不是省資源：

- Playwright 的 Firefox 和 WebKit 是[打過 patch 的版本](https://playwright.dev/docs/browsers)，不能用一般安裝的 Firefox 和 Safari。
- [Camoufox](https://github.com/daijro/camoufox) 是一個給擷取和 agent 用的 Firefox 修改版，透過 Playwright 的 Juggler 協定控制，README 標明仍在開發、可能不適合穩定的正式環境。這個系列不談繞過偵測，只列事實。
- 要真的 Safari，agent-browser 可以透過 Appium [控制 iOS 模擬器裡的 Mobile Safari](https://agent-browser.dev/ios)，需要 macOS 和 Xcode，第一次啟動要 30 到 60 秒，只能開一個分頁。

## 你的工作能不能換掉 Chromium

依序問：

1. **要不要像素？** 截圖、看畫面的視覺模型、computer use agent、依版面位置點擊：留在 Chromium。Kitesurf、Obscura 能截圖，但畫出來的不保證跟 Chrome 一樣。
2. **要不要身分？** 要登入、要長時間保持狀態、目標網站有機器人偵測：留在 Chromium。Lightpanda 的指紋一眼就認得出來，Kitesurf 官方也說它不適合通過機器人驗證。
3. **剩下的是大量擷取公開頁面？** 先試最簡單的 HTTP 請求，Bright Data 的 19 個網頁裡有 9 個這樣就夠了；不夠再試 Lightpanda，逐個網站確認抓到的內容跟 Chrome 一樣多，並保留退回 Chrome 的路徑。Lightpanda [列出](https://lightpanda.io/blog/posts/lightpanda-1-0)的使用者 Hermes Agent 就是這樣做：遇到截圖這類 Lightpanda 不支援的動作時，自動改用 Chrome。
4. **要改 Lightpanda 的程式碼、放進網路服務？** 它是 AGPL-3.0，修改後讓使用者透過網路使用，就要提供修改後的原始碼，條文的意義見 [Skyvern 篇](/posts/ai/2026-11-19-skyvern)的 AGPL 段落。這不是法律意見。

省資源真正划算的情況是：並行量大、機器成本占大頭、頁面以文字為主，而且你能接受逐站校準。

## 想深入

這幾個引擎多半透過託管服務來用：Kitesurf 在 Cloudflare Browser Run 裡，Lightpanda 有自己的雲端。下一篇換到「瀏覽器放在哪裡跑」：Browserbase、Browser Run、Steel、Hyperbrowser、Browser Use Cloud 這些託管服務各適合什麼，什麼時候該自己架。

## 參考資料

- [lightpanda-io/browser](https://github.com/lightpanda-io/browser)
- [Lightpanda：Architecture overview](https://lightpanda.io/docs/core-concepts/architecture-overview)
- [Lightpanda：Lightpanda 1.0](https://lightpanda.io/blog/posts/lightpanda-1-0)
- [lightpanda-io/demo：BENCHMARKS.md](https://github.com/lightpanda-io/demo/blob/main/BENCHMARKS.md)
- [Cloudflare：Kitesurf（Browser Run docs）](https://developers.cloudflare.com/browser-run/kitesurf/)
- [Cloudflare blog：Kitesurf is now open source](https://blog.cloudflare.com/kitesurf-open-source/)
- [cloudflare/kitesurf](https://github.com/cloudflare/kitesurf)
- [h4ckf0r0day/obscura](https://github.com/h4ckf0r0day/obscura)
- [agent-browser：Obscura engine](https://agent-browser.dev/engines/obscura)
- [agent-browser：iOS](https://agent-browser.dev/ios)
- [Bright Data：Lightpanda vs Playwright and headless Chrome](https://brightdata.com/blog/comparison/lightpanda-vs-playwright-and-headless-chrome)
- [Gologin：Lightpanda review](https://gologin.com/blog/lightpanda-review/)
- [Chrome for Developers：Chrome for Testing](https://developer.chrome.com/blog/chrome-for-testing)
- [Chrome for Developers：Headless Chrome](https://developer.chrome.com/docs/chromium/headless)
- [StatCounter：Browser Market Share Worldwide](https://gs.statcounter.com/browser-market-share)
- [Playwright：Browsers](https://playwright.dev/docs/browsers)
- [daijro/camoufox](https://github.com/daijro/camoufox)
- [Ladybird](https://ladybird.org/)
- [Servo](https://servo.org/)
