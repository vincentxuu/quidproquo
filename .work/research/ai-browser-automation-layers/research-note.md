# 研究筆記：AI 瀏覽器自動化的分層（Stagehand、Playwright、CDP、競品、託管）

研究日期：2026-11-18。前一版草稿 `.research/2026-11-18-stagehand-vs-playwright.md`（本檔為最終狀態，取代它）。
原始抓取存在 `raw/`（完整原文）與 `prose/`（去掉程式碼區塊的文字版，方便閱讀）。

## 母群定義（research-selection）

「讓程式或 AI agent 操作真實瀏覽器」的開源工具與託管服務，2026 年仍活躍（近 6 個月有 commit），依抽象層歸類：

| 層 | 定義 | 掃描到的成員 |
|---|---|---|
| AI 層／混合式 SDK | 程式控制流程，個別步驟交給模型 | Stagehand、Midscene、Skyvern SDK、HyperAgent、AgentQL、Magnitude、Notte、Shortest（LaVague 已停更） |
| AI 層／自主 agent | 模型決定每一步 | Browser Use、Skyvern agent、Nanobrowser、各家 computer-use |
| AI 層／給 coding agent 的工具 | 不含模型，提供工具給外部 agent | Playwright MCP、Playwright CLI、Chrome DevTools MCP、agent-browser、browse CLI、Browser Harness |
| Driver | 把動作翻成協定指令 | Playwright、Puppeteer、Selenium、Patchright；自寫：Stagehand v3+、Browser Use（cdp-use）、agent-browser（Rust） |
| 協定 | | CDP、WebDriver BiDi |
| 瀏覽器＋執行位置 | | Chrome/Chromium、Firefox、WebKit、Lightpanda、Kitesurf；託管：Browserbase、Cloudflare Browser Run、Steel、Hyperbrowser、Browser Use Cloud、Kernel、Notte |

掃描方式：GitHub API 星數與更新日、各專案 README、2026 年比較文（SparkProxy、Browser Use、Towards AI、Kanopy、Drydock、Deptrip）點名的工具交集。
偏誤：以英文開源生態與星數為主；閉源 RPA（UiPath 等）、中國生態（除 Midscene）、Selenium 系 AI 擴充未系統掃描。

### 覆蓋矩陣（站上既有文章 × 層）

| 層 | 站上已有 | 缺口 |
|---|---|---|
| 給 coding agent 的工具 | 系列「瀏覽器自動化與 MCP」7 篇（Playwright MCP、Puppeteer MCP、Chrome DevTools MCP、三選一、Midscene、browse.sh、三家 AI 進 Chrome） | agent-browser、Playwright CLI 未寫 |
| 混合式 SDK | AgentQL 單篇、Midscene 單篇 | **Stagehand 零篇**；同層比較零篇 |
| 自主 agent | Browser Use 完整介紹（2026-08，0.x 時代） | 1.0（REPL＋raw CDP）未更新 |
| Driver／協定 | 無 | **CDP vs Playwright 零篇** |
| 託管 | Browserbase、Steel、Hyperbrowser、Kitesurf 單篇 | 跨家對照零篇；Browser Run（Chromium 版）沒有主篇 |
| 總覽 | 無 | **分層地圖零篇** |

## 1. Stagehand v4

**事實（✅ 一手全文）**
- MIT，TS／Python／Go。⭐26,083（2026-11-18）。npm：1.0（2024-10-29）、2.0（2025-03-31）、3.0（2025-10-29）、4.0（2026-08-10）、latest 4.4.0。〔gh api、npm〕
- v3 起不依賴 Playwright；v4「drives Chromium over CDP…no Playwright dependency…There is no interop」。〔docs/v4/migrations/playwright〕
- v4 架構：target 管理、frame／execution context 追蹤、CDP dispatch 移進瀏覽器內的 extension（service worker）。SDK 經既有 CDP socket，用 `Target.attachToTarget`＋`Runtime.addBinding`（`__stagehandSendToHost`）與 worker 收發 JSON 訊息（MCP 同格式）。本機用 `Extensions.loadUnpacked` 載入；Browserbase 預裝。〔v4 blog〕
- 動機原文：「Every framework that hands you a page object is betting that it can keep a local copy accurate…Point that same script at a remote browser…the gap widens」；v3 的實例：`window.open` 開的 pop-up 在 `Fetch.enable` 到達前就載入，domain policy 攔不到。〔v4 blog〕
- 效能（廠商一次量測，自承 "one run rather than a benchmark"）：50 步 Wikipedia 爬取 batch 14,221.7ms vs Playwright 22,650.3ms；`goBack` 139.5→17.5ms；client-to-remote RTT 42.2ms；「Point this at a browser on your own laptop and there's less to gain」。〔v4 blog〕
- v4 移除 `agent()`、`deepLocator()`、`frameLocator()`；`serverCache`→`cache`；「there's no client-side caching in v4」；自訂模型實作 `generate()`。〔v4 blog〕
- 移除 agent() 理由：「built for models that couldn't reliably drive a browser on their own」；替代：Code mode（coding agent 寫腳本，官方推薦起點）、Tool calling（整套 API 當工具，`page.snapshot()` 回 a11y tree＋xpathMap）。〔docs/v4/migrations/v3〕
- `act()`：一次一個動作；收指令＝推論，收 `Action`＝無推論重播（跳過推論、snapshot、DOM-settle）；selector 失效且 `selfHeal` 開時重推論一次。多步指令「unreliable」。〔docs/v4/basics/act〕
- `observe()`：回傳 Action 清單（selector、method、arguments）；「plan then execute」一次推論填整張表單；可用 locator 縮範圍降 token。〔docs/v4/basics/observe〕
- `extract()`：Zod／Pydantic／Go 型別，回傳前驗證；連結擷取是讓模型選 ID 再對照；截圖選項只拍 viewport 且繞過 cache。〔docs/v4/basics/extract〕
- `variables`：只把變數名給模型，本機替換；例外：開了 server cache 時值會送到 cache 服務，官方建議帶憑證的呼叫設 `cache:false`。〔docs/v4/basics/act〕
- Cache：需 Browserbase 瀏覽器＋向 support 申請開通；key＝instruction＋頁面內容＋options（不含模型）；threshold 次數；本機無效；有 locator scope 的呼叫不快取；URL 動態會失效；best-effort。〔docs/v4/best-practices/caching〕
- 成本建議：不要用大模型做簡單任務；**在 observe 上升級模型重試，不在 act 上**（act 可能已點擊／送出）；Stagehand 報 token 不報錢。〔docs/v4/best-practices/cost-optimization〕

## 2. Stagehand vs Playwright（✅ 遷移指南全文）

- Stagehand 不是測試框架：無 fixtures、`expect()`、retries、HTML reporter、codegen、trace viewer、Inspector、`page.pause()`、video。
- 只 Chromium；不下載瀏覽器；一個 browser 一個 context（無 `newContext`、`storageState`）。
- Locator：CSS／XPath／`text=`；CSS 穿 closed shadow root；`>>` 穿 iframe 取代 `frameLocator`。無 `getBy*`、chaining、`filter/and/or`。
- **無 strict mode**：Playwright 多重匹配會拒絕動作；v4 直接點第一個——「a selector that quietly went ambiguous keeps working on the wrong element」。
- **無 auto-wait**：解析一次就丟 `Could not find an element…`；`goto` 預設 `domcontentloaded`（Playwright `load`）；無 default timeout setter。
- 無網路層：無 `page.route()`、mock、`waitForResponse/Request/Event`；`page.on()` 只有 console；無 dialog handler；無 CDP escape hatch（blog 說開發中）。
- 官方警告：「Don't wrap act() in a retry loop」。
- 移植順序：先原樣跑通→補等待→換 getBy*→把常壞的 selector 換 act/extract→穩定後開 cache。
- Playwright 這邊的 AI 路線：Test Agents（planner／generator／healer，`npx playwright init-agents --loop=claude|codex|vscode|opencode`；產物是一般 Playwright 測試碼）〔✅ playwright.dev/docs/test-agents〕；Playwright MCP（a11y snapshot＋ref，vision 需 `--caps`）與 Playwright CLI＋skills，README 自述「CLI invocations are more token-efficient」〔🟡 README 前段〕。

## 3. Driver 層：為什麼有人離開 Playwright

- Browser Use 2025-08 改 raw CDP（✅ 全文）：
  - Playwright 是 client–server：各語言 client →「playwright protocol」→ Node.js relay → CDP/BiDi → 瀏覽器；Python 用法多一跳網路，「thousands of CDP calls」時延遲明顯。
  - 狀態在瀏覽器、relay、client 三處漂移；tab crash 時 relay 可能永遠卡住，只能 `kill -9`。
  - Sharp edges：>16,000px 整頁截圖必當、dialog、未 focus 時輸入、遠端檔案上下傳、`chrome://` 等特殊頁、crashed tab。「Playwright handled about half of these well」。
  - 代價自述：「now we're faced with the difficult challenge of solving 100% of these cases ourself」。
  - 新架構：事件驅動 watchdog（下載、crash）、跨 OOPIF 的 node 表示（targetId＋frameId＋backendNodeId）。
- Browser Use〈Bitter Lesson〉2026-09（✅ 全文）：從「我們定義 state 與 action」→「模型寫 action（JS、notebook）」→「模型也寫 observation（直接 CDP）」；理由例：closed shadow root 裡的按鈕，a11y tree 或 Playwright locator 看不到。重用 Codex／Pi 等既有 agent harness。廠商數據：Hermes agent 把 12 個工具換成 `browser_exec`，token 降 60–66%，18/18（六題×三次）——小樣本自評。
- Stagehand v4 理由同型（狀態鏡像、遠端延遲），另加安全：domain policy 在瀏覽器內攔。「Playwright was built for testing…security model…never designed for adversarial pages」——廠商主張。
- 反面與限制：
  - 拆掉後失去跨瀏覽器與 Playwright 的等待、strict mode、網路攔截（Stagehand 文件自承）。
  - **Firefox 已在 141 移除 CDP**，只剩 WebDriver BiDi；Puppeteer 23 起 Firefox 走 BiDi（Chrome 仍預設 CDP，BiDi 不支援 accessibility、tracing 等）；Playwright 的 BiDi 支援仍是 experimental，Mozilla M18–M21（2026）里程碑以補 Playwright 需要的 API 為主。〔✅ fxdx.dev 2025-06、🟡 pptr.dev／MozillaWiki 摘段〕→ raw CDP 路線等於綁死 Chromium。
  - 偵測面：舊的 `Runtime.enable` 偵測在 Chrome 138（V8 13.8，2025-06）被修掉，修補者是 Playwright 維護者 Pavel Feldman；2026 仍有其他路徑與框架痕跡（`__pwInitScripts`、`Runtime.addBinding` 的全域函式、headless shell）。〔🟡 ProxyHat、✅ Castle 摘段〕——[推論] Stagehand v4 本身也用 `Runtime.addBinding`，「直接打 CDP」不等於比較隱形。
  - openwaf 實驗（作者自建偵測頁、每組 3 次）：Playwright 12/12 被標記；Patchright 推薦設定＋擬人輸入 0/3；人類 0/31。結論：輸入合成與環境不一致才是主要破綻，不在用哪個 driver。〔🟡〕
- Patchright：Playwright 的 Chromium driver fork，避開 `Runtime.enable`、在 isolated world 執行、拿掉自動化旗標；Magnitude、Notte 用它。〔🟡〕

## 4. 同層競品（混合式 SDK）

| 工具 | ⭐／授權 | Driver | 感知 | API | 依據 |
|---|---|---|---|---|---|
| Stagehand | 26k／MIT | 自寫 CDP | a11y tree | act/observe/extract | ✅ |
| Midscene | 15.6k／MIT | Playwright 或 Puppeteer（package.json 兩者皆依賴）；Android/iOS/HarmonyOS/桌面 | 截圖視覺定位 | aiAct/aiWaitFor/aiAssert，YAML 測試、HTML 報告 | 🟡 README 前段＋package.json |
| Skyvern | 23k／AGPL | 「Playwright extension」 | 視覺 LLM＋DOM | page.act/page.extract＋no-code workflow | 🟡 README |
| HyperAgent | 1.6k／未標 | Playwright | DOM | page.ai/page.extract/executeTask，action caching | 🟡；最後 push 2026-05 |
| AgentQL | 1.5k／MIT | Playwright 整合 | 查詢語言 | 查詢形狀＝輸出形狀 | 🟡＋站上單篇 |
| Magnitude | 4.1k／Apache | Patchright | 視覺優先 | act/extract＋測試 runner | 🟡；最後 push 2026-02；自報 WebVoyager 94% |
| Notte | 2.1k／SSPL（badge） | Patchright | observe→action space | observe/execute/scrape；1.10 移除 agent loop | 🟡 |
| Shortest | 5.7k／MIT | Playwright | Claude computer use | 自然語言 E2E | 🟡；最後 push 2026-08 |

Benchmark 讀法（✅ arXiv 2504.01382 主體）：WebVoyager 只 15 個網站、任務偏簡單——只會 Google 搜尋再點一下的「search agent」就有 51%；Online-Mind2Web（300 題、136 站、人工標註）上 Browser Use 30.0%、SeeAct 30.7%、Claude CU 3.7 56.3%、Operator 61.3%；WebVoyager 自動評審因 agent 幻覺回答而偏高。→ Skyvern 85.8%、Magnitude 94% 這類 WebVoyager 數字不能拿來比較。
其他評測（皆 🟡，非中立）：Browser Use BU Bench V2.1（四個工具分數差異 95% 區間都含 0，差在 token）；Towards AI 18 題；HN Sentinel 9 題×5；SparkProxy 指出不存在三方 head-to-head benchmark。
實務反證（✅ dev.to EHR）：agent → Stagehand → 退回 Playwright；a11y tree 在 Athena 等複雜 DOM 對不到；真正錯誤是隨機 popup、慢渲染、業務邊界（不希望 AI 自己決定）；託管後反而更 flaky。

## 5. 誰決定下一步：agent loop 正在退場？

- Stagehand v4 移除 `agent()`、Notte 1.10 移除 agent loop、Browser Use 1.0 把迴圈交給既有 coding-agent harness、Playwright Test Agents 讓 AI 產生決定性測試碼——四家一致把「runtime 每步推論」改成「AI 寫碼或外部 agent 驅動」。〔✅ 前三；✅ Playwright〕
- 成本面：SparkProxy 引 Browserbase hardbench：每 task $0.02～$3.07（不同模型／harness，136 倍差），基礎設施相對小。〔🟡〕
- 反面：開放式任務仍需要 runtime 推論；Towards AI 測試中 Browser Use 靠模型自寫重連碼救回 tab crash。〔🟡〕

## 6. 瀏覽器跑在哪：託管

- Cloudflare Browser Run（原 Browser Rendering）：Quick Actions（REST：markdown、截圖、PDF、`/json`、`/crawl`）與 Browser Sessions（Puppeteer／Playwright／CDP／Stagehand）。Paid 每月 10 browser-hours 後 $0.09/hr；Sessions 另計並發，10 個後每個 $2（月均日峰值）；Free 每天 10 分鐘、3 並發。閒置 60 秒逾時（keep_alive 最多 20 分鐘）；Paid 預設 200 並發、新開 3/秒。`outboundByHost` 把指定 hostname 請求導回 Worker。〔✅ docs index／pricing／limits／README〕
- **Browser Run 只支援 Stagehand v2.5.x：「Stagehand v3 and later are not supported because they are not Playwright-based」**（文件 2026-11-11 更新）。〔✅ developers.cloudflare.com/browser-run/stagehand〕
- repo cloudflare/browser-run：`@cloudflare/puppeteer`、`@cloudflare/playwright`、`@cloudflare/playwright-mcp`，上游 submodule＋`patches/`。〔✅〕
- Browserbase、Steel、Hyperbrowser、Kitesurf：站上已有單篇，對照篇引用並複查價格（待該篇動筆前）。

## 交叉表（關鍵事實）

| 事實 | 來源 | 狀態 |
|---|---|---|
| Stagehand v3+ 不建在 Playwright | Stagehand docs、Cloudflare docs | ✅ 兩方一致 |
| v4 移除 agent() | v4 blog、migration v3、SparkProxy、himanshuai | ✅ |
| Server cache 只在 Browserbase | caching、act、observe、extract 文件 | ✅ |
| v4 比 Playwright 快 1.59x | v4 blog 單次自測 | ⚠️ 廠商單次，只能寫「官方一次量測」 |
| Browser Use 改 raw CDP（2025-08） | 官方 blog、changelog | ✅ |
| WebVoyager 高估 | Online-Mind2Web 論文 | ✅ 學術 |
| Firefox 移除 CDP | Mozilla fxdx.dev | ✅ |
| CDP 直連比較不易被偵測 | 無證據；openwaf 顯示輸入與環境才是主因 | ❌ 不寫這個主張 |

## 研究足夠的判準（五關）

| 段落（對應規劃篇） | ①一手 | ②作者主張／實證 | ③2024 後 | ④反證 | ⑤飽和 | 結論 |
|---|---|---|---|---|---|---|
| 總覽／分層 | ✅ | ✅ 分層是本站整理，文中明示 | ✅ | ✅ | ✅ 六篇比較文都只回已知工具 | 過 |
| Stagehand v4 | ✅ 文件與 blog 全文 | ✅ 效能標廠商單次 | ✅ | ✅ dev.to、Sentinel、Show HN 質疑 | ✅ | 過 |
| vs Playwright | ✅ 遷移指南全文、Test Agents | ✅ | ✅ | ✅ | ✅ | 過 |
| Driver／CDP | ✅ 兩家 blog 全文、Mozilla | ✅ 理由皆廠商主張；偵測為第三方實驗 | ✅ | ✅ 代價、BiDi、偵測 | 🟡 Playwright 官方對 relay 架構的說明未讀 | 動筆前補 Playwright 架構一手文件 |
| 同層競品 | 🟡 README 前段 | ✅ benchmark 已有學術反證 | ✅ | ✅ | 🟡 未掃 GitHub topics | 動筆前：讀 Midscene／Skyvern／Magnitude 文件全文，掃 topics |
| agent loop 退場 | ✅ | 🟡 成本數字轉引 | ✅ | 🟡 | 🟡 | 動筆前補 Browserbase hardbench 一手頁、Browser Use 1.0 MIGRATING |
| 託管 | ✅ Browser Run；其他靠站上舊文 | — | ✅ | 🟡 | 🟡 | 動筆前重查各家價格與限制 |

## 讀取盤點

| 來源 | 程度 |
|---|---|
| Stagehand README（gh api） | ✅ |
| docs.stagehand.dev v4：act、observe、extract、caching、cost-optimization、migrations/playwright | ✅ 全文（raw/ 有原檔） |
| docs.stagehand.dev v4：migrations/v3、migrations/browser-use、ai-rules、models、webmcp | 🟡 已抓全文未逐段讀（v3 讀前半） |
| browserbase.com/blog/stagehand-v4 | ✅ 全文 |
| browser-use.com/posts/playwright-to-cdp | ✅ 全文 |
| browser-use.com/posts/bitter-lesson-browser-agents | ✅ 全文 |
| browser-use.com 2026 MCP 比較文 | 🟡 摘段 |
| playwright.dev/docs/test-agents | ✅ 主體 |
| microsoft/playwright-mcp README | 🟡 前 7k 字元 |
| Browser Use、Skyvern、agent-browser、Midscene、HyperAgent、AgentQL、Magnitude、Notte、Shortest README | 🟡 前段 |
| arXiv 2504.01382（Online-Mind2Web） | ✅ 2–4 節與結果表（HTML） |
| developers.cloudflare.com/browser-run：index、stagehand、pricing、limits；cloudflare/browser-run README | ✅ |
| fxdx.dev CDP retirement | 🟡 摘段（主體已涵蓋） |
| pptr.dev/webdriver-bidi、MozillaWiki BiDi | 🟡 摘段 |
| ProxyHat、Castle、openwaf（偵測） | 🟡 摘段 |
| SparkProxy、Towards AI、HN Sentinel、smoketest.sh、himanshuai | 🟡 摘段 |
| dev.to EHR 實務文 | ✅（摘段即主體） |
