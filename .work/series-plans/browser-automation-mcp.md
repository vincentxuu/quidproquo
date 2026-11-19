# 系列規劃（重規劃）：AI 瀏覽器自動化（browser-automation-mcp）

使用者確認：2026-11-18（重規劃＋擴充方案：補 agent-browser、Skyvern、協定篇、瀏覽器引擎篇、Browser Run 主篇；既有 13 篇收進系列。系列名稱「AI 瀏覽器自動化」／「AI Browser Automation」）

研究筆記：`.work/research/ai-browser-automation-layers/research-note.md`（母群、覆蓋矩陣、交叉表、五關結果、讀取盤點）。

## 為什麼重規劃

既有系列 7 篇（2026-05～06）全集中在「給 coding agent 的工具層」，沒有總覽、沒有 SDK 層（Stagehand 零篇）、沒有 driver／協定／瀏覽器層。站上另有 6 篇相關單篇沒有掛系列（Browser Use、AgentQL、Browserbase、Steel、Hyperbrowser、Kitesurf）。重規劃依五層地圖由上往下排，每層至少一篇主篇。

## 五層地圖（總覽篇的主圖，系列的骨架）

```
應用    你的產品、你的 agent（不獨立成篇，總覽用例子帶過）
AI 層   混合式 SDK／自主 agent／給 coding agent 的工具
Driver  現成函式庫（Playwright、Puppeteer、Selenium、Patchright）／自己寫（Stagehand v3+、Browser Use 1.0、agent-browser）
協定    CDP、WebDriver BiDi
瀏覽器  引擎（Chromium、Firefox、WebKit、Lightpanda、Kitesurf）＋跑在哪（本機／Browserbase、Browser Run、Steel、Hyperbrowser、Browser Use Cloud）
跨層議題：安全（prompt injection 外洩、domain policy、憑證保管）——總覽列出，各篇遇到時處理，不獨立成篇
```

## 系列登錄資料（改 `src/utils/series.ts`）

- slug：`browser-automation-mcp`（**不改**，系列頁網址不變）
- 名稱：zh-TW「AI 瀏覽器自動化」／en「AI Browser Automation」。改名要同步改所有成員文章 frontmatter 的 `series.name`。
- 描述 zh-TW：讓 AI 操作瀏覽器，從上到下拆成五層：給 coding agent 的工具、寫程式用的 AI SDK、自己決定下一步的 agent、把動作送進瀏覽器的 driver 與協定，以及用什麼瀏覽器、跑在哪裡。每篇談一層裡的一個選擇，重點在它什麼時候會失敗。
- 描述 en：Putting a browser in an AI's hands, taken apart layer by layer: tools for coding agents, AI SDKs you script against, agents that pick their own next step, the drivers and protocols that carry each action, and which browser runs where. Each post covers one choice in one layer, focused on where it breaks.

## 目標讀者

會寫程式、用過 Claude Code／Codex 之類 coding agent，想讓 AI 幫忙操作網頁（爬資料、填表、測試、跑流程），但分不清 Playwright MCP、Stagehand、Browser Use、Browserbase 各在解什麼問題的人。不寫給：只想要現成 SaaS 爬蟲的人（指向「搜尋與爬取實戰」系列）；要繞過反爬的人（只寫合規與限制）。

## 入口

order 0 是新寫的總覽：五層地圖、每層代表工具與站上對應篇、選型時分開問的三個問題（誰決定下一步、driver 要不要跨瀏覽器、瀏覽器用哪個放哪）、跨層的安全議題、本系列不處理什麼。不是事件文。

## 弧線

總覽 → A 工具層（最貼近讀者：在 coding agent 裡開瀏覽器）→ B SDK 層（自己寫程式、只在需要判斷的步驟用模型）→ C agent 層（模型自己決定每一步，以及這個做法為什麼正在退場）→ D driver 與協定（看不見的那兩層）→ E 瀏覽器：引擎與執行位置

排序原則：可見先於不可見；一次一個跳躍（每篇一個工具或一個決定）；螺旋加深（「accessibility tree vs 截圖」在 A 層 MCP 篇出現、B 層比較篇加深、D 層講 closed shadow root 為什麼看不到；「Stagehand 不建在 Playwright 上」在 order 9 是事實、16 才講原因、23 回收成「所以 Browser Run 只支援 v2.5」）。

## 篇目

| order | 狀態 | 檔案／slug | 主題 | 聚焦問題 |
|---|---|---|---|---|
| 0 | 已上線 | 2026-11-18-ai-browser-automation-layers | 總覽：五層地圖 | 這些工具各在哪一層、選型要分開問哪三件事？ |
| **A 給 coding agent 的工具** | | | | |
| 1 | 既有（原 7） | 2026-05-09-ai-browser-agents-claude-codex-gemini | 三家 AI 進 Chrome | coding agent 內建的瀏覽器能做到哪？ |
| 2 | 既有（原 1） | 2026-06-20-playwright-mcp | @playwright/mcp | 官方 MCP 怎麼用 accessibility snapshot 操作頁面？ |
| 3 | 既有（原 2） | 2026-06-20-puppeteer-mcp | Puppeteer MCP | 參考實作的 MCP server 有什麼侷限？ |
| 4 | 既有（原 3） | 2026-06-20-chrome-devtools-mcp | Chrome DevTools MCP | 直連 CDP 的 MCP 適合除錯什麼？ |
| 5 | 既有（原 4） | 2026-06-20-browser-mcp-comparison | Browser MCP 三選一 | 三個 MCP 怎麼選？（2026-11-19 已補連到 6） |
| 6 | 已上線 | 2026-11-19-agent-browser-cli | agent-browser 與 CLI＋skill 路線 | 為什麼 coding agent 改用 CLI 而不是 MCP，agent-browser 和 Playwright CLI 怎麼選？ |
| 7 | 既有（原 6） | 2026-05-23-browse-sh-browser-skills | browse.sh | 把學過的網站操作存成技能 |
| **B 寫程式用的 AI SDK** | | | | |
| 8 | 已上線 | 2026-11-18-stagehand-v4 | Stagehand v4：act／observe／extract | 什麼時候在一個步驟花一次推論，怎麼讓它下次不用再花？ |
| 9 | 已上線 | 2026-11-18-stagehand-vs-playwright | Stagehand vs Playwright | 已有 Playwright 腳本，該不該換、換了會失去什麼？ |
| 10 | 既有（原 5） | 2026-05-23-midscene-vision-ui-automation | Midscene.js | 用截圖而不是 DOM 定位，換到什麼、付出什麼？ |
| 11 | 既有（單篇） | 2026-08-21-agentql-semantic-web-extraction | AgentQL | 用查詢語言做擷取 |
| 12 | 新寫 | skyvern | Skyvern：視覺型的 SDK＋agent＋no-code | 跨很多陌生網站跑同一流程時，視覺 LLM 換到什麼？AGPL 對你有什麼影響？ |
| 13 | 新寫 | ai-browser-sdk-comparison | 混合式 SDK 比較＋評測怎麼讀 | 同層 SDK 怎麼分、廠商成功率能不能拿來比？ |
| **C 模型自己決定** | | | | |
| 14 | 既有（單篇） | 2026-08-21-browser-use-complete-guide | Browser Use | 自主 agent 迴圈（待 post-update：1.0 改為 REPL＋raw CDP） |
| 15 | 新寫 | browser-agent-loop-to-code-mode | agent loop 退場 | 為什麼大家都把「每步推論」換成「AI 寫碼或外部 agent 驅動」？ |
| **D driver 與協定** | | | | |
| 16 | 已上線 | 2026-11-18-cdp-vs-playwright-driver | Driver：自己打 CDP 或用 Playwright | 為什麼有人拆掉 Playwright、代價是什麼？ |
| 17 | 已上線 | 2026-11-19-cdp-webdriver-bidi | 協定：CDP 與 WebDriver BiDi | 兩個協定差在哪，「只綁 Chromium」的代價是什麼？ |
| **E 瀏覽器：引擎與執行位置** | | | | |
| 18 | 新寫 | browser-engines-beyond-chromium | 引擎：Chromium 以外的選擇 | Lightpanda、Kitesurf 這類非 Chromium 引擎換到什麼、犧牲什麼？ |
| 19 | 新寫 | hosted-browser-comparison | 託管對照 | Browserbase、Browser Run、Steel、Hyperbrowser、Browser Use Cloud 各適合什麼，什麼時候自架？ |
| 20 | 既有（單篇） | 2026-08-22-browserbase-browser-infrastructure | Browserbase | |
| 21 | 既有（單篇） | 2026-08-22-steel-browser-infrastructure | Steel | |
| 22 | 既有（單篇） | 2026-08-22-hyperbrowser-browser-infrastructure | Hyperbrowser | |
| 23 | 新寫 | cloudflare-browser-run | Cloudflare Browser Run | Quick Actions 和 Browser Sessions 怎麼選，Workers 整合換到什麼、限制在哪？ |
| 24 | 既有（單篇） | 2026-08-22-cloudflare-kitesurf-browser-infrastructure | Cloudflare Kitesurf | |

新寫 12 篇（各中英兩檔，共 24 檔）；既有 13 篇只改 frontmatter `series`（order／name），不動 slug、date、正文。

## 斷崖處理

- 0→1：總覽只給地圖與判準，不講 API；order 1 從讀者最熟的場景（在 Claude 裡叫它開網頁）進入。
- 5→6：MCP 三選一講完後，6 用 Playwright MCP README 自己的話「CLI invocations are more token-efficient」接到 CLI 路線。
- 7→8：從「在 coding agent 裡用工具」跳到「自己寫程式」。橋：browse.sh 與 `browse` CLI 是 Stagehand 生態，「同一家公司給你的另一條路」。
- 8→9：8 只教 Stagehand 自己；9 才逐項對照 Playwright。「為什麼不建在 Playwright 上」只給一句事實，原因留到 16。
- 11→12→13：AgentQL（DOM 查詢）→ Skyvern（視覺）讓讀者手上有兩種對照，13 比較篇前先補「評測怎麼讀」（只會搜尋的 agent 在 WebVoyager 就有 51%）。
- 13→14：從程式控制流程跳到模型控制流程。橋：Stagehand v4 拿掉 `agent()` 的官方理由原句；Skyvern 本身也有 agent 模式，是自然的過渡。
- 14→15：Browser Use 篇是 0.x 時代寫的；15 開頭先交代 1.0 的變化，並對 14 做 post-update。
- 15→16：〈Bitter Lesson〉的「模型自己寫 observation、直接打 CDP」把讀者帶到 driver 層。16 是全系列最抽象的一篇，用五層結構（場景→直覺→機制→連回工具→想深入），先畫 Playwright client→Node relay→CDP 圖。
- 16→17：driver 篇結尾的代價「只能 Chromium」引出「為什麼 Firefox 不能用 CDP」。
- 17→18：協定決定能控制哪些引擎；18 接「那引擎本身有哪些選擇」。
- 18→19：引擎篇結尾：Lightpanda／Kitesurf 多半透過託管或特定平台用，接到「瀏覽器放哪」。
- 19→23：對照篇給全景，23 深入 Browser Run，回收 9／16 的伏筆（Browser Run 只支援 Stagehand v2.5，因為 v3 起不建在 Playwright 上）；24 Kitesurf 是 Browser Run 裡的非 Chromium 後端，同時回扣 18。

## 每篇範圍卡（新寫篇）

Order 0：AI 瀏覽器自動化的五層地圖
  聚焦問題：Playwright MCP、Stagehand、Browser Use、Browserbase 是同一種東西嗎？
  講：五層圖（diagram：分層圖）、每層 2–3 個代表與站上對應篇、選型三問、常見誤解（「CDP 或 Playwright」不是二選一；Browser Run 是基礎設施不是應用）、跨層安全議題清單。
  不講：任何 API 細節、價格。
  讀完後讀者能：拿到一個新工具時，說出它在哪一層、跟誰是競品。
  例子：同一個任務「每天抓發票表」分別用 Playwright MCP、Stagehand、Browser Use、Browser Run Quick Action 怎麼做（各一段）。
  自我檢查：Midscene 和 Stagehand 是同層嗎？Browser Run 跟 Stagehand 是競品嗎？（附答案）

Order 6：agent-browser 與 CLI＋skill 路線
  聚焦問題：coding agent 為什麼改用 CLI，agent-browser 和 Playwright CLI 怎麼選？
  講：snapshot＋`@e1` ref 的操作迴圈；Rust daemon＋CDP；auth vault、domain allowlist、action policy；allowlist 不能與接自家 Chrome 並用；CLI vs MCP 的 token 取捨（Browser Use 評測：分數無顯著差、差在 token，標廠商自評）；Playwright CLI 與 browse CLI 對照。
  讀完後讀者能：替自己的 coding agent 選 CLI 或 MCP，並開好安全設定。
  動筆前補研究：agent-browser 文件全文（security、snapshots、skills）；Playwright CLI 一手文件。

Order 8：Stagehand v4
  聚焦問題：什麼時候值得在一個步驟花一次推論，怎麼讓它下次不用再花？
  講：act／observe／extract；observe→Action 重播；selfHeal；variables 不給模型（開 cache 時的例外）；server cache 只在 Browserbase 且要申請；不要 retry act、在 observe 上升級模型；v4 extension 架構（圖：SDK→CDP socket→service worker）；v4 移除 agent()。
  不講：與 Playwright 逐項比較（→9）、為什麼不用 Playwright（→16）。
  讀完後讀者能：寫出「穩定步驟用 locator、判斷步驟用 act／extract、上線後重播 Action」的腳本骨架。
  例子：登入→帳單頁→擷取發票（README 範例，標明官方範例）。
  限制：只 Chromium；本機無 cache；API 從 v2 到 v4 變很快；Browser Run 只支援 v2.5。

Order 9：Stagehand vs Playwright
  聚焦問題：已有 Playwright 腳本，該不該換？
  講：遷移指南差異表（等待、strict mode、getBy*、chaining、網路攔截、dialog、context、測試工具）；Playwright 自己的 AI 路線（Test Agents、MCP、CLI）；選型判準。
  讀完後讀者能：判斷自己的腳本該「留在 Playwright＋Test Agents」還是「把常壞的步驟換成 Stagehand」。
  例子：Hacker News 腳本兩版對照（官方遷移範例）。

Order 12：Skyvern
  聚焦問題：視覺 LLM 驅動的 SDK＋agent 換到什麼，AGPL 有什麼影響？
  講：Playwright 擴充的 page.act／page.extract；agent 與 workflow；no-code builder；自架（pip／Docker）與 Cloud；AGPL-3.0 對 SaaS 的意義；WebVoyager 85.8% 為何不能直接比。
  讀完後讀者能：判斷自己的流程（跨多個陌生網站、要給非工程師用）是否適合 Skyvern。
  動筆前補研究：Skyvern 文件全文、技術報告原文、授權條款與商業授權說明。

Order 13：混合式 SDK 比較＋評測怎麼讀
  聚焦問題：同層 SDK 怎麼分，廠商成功率能不能拿來比？
  講：DOM 派 vs 視覺派；掛 Playwright vs 自寫 CDP vs Patchright；綁不綁自家雲；授權；WebVoyager vs Online-Mind2Web；實務反例（EHR 退回 Playwright）。
  不講：各工具教學（連 8、10、11、12）。
  讀完後讀者能：依「感知方式×driver×要不要測試 runner」選出 1–2 個候選。
  動筆前補研究：Midscene、Magnitude、HyperAgent、Notte 文件全文；GitHub topics 掃描。

Order 15：agent loop 退場
  聚焦問題：為什麼大家都在拿掉內建的 agent 迴圈？
  講：Stagehand code mode／tool calling、Notte 1.10、Browser Use〈Bitter Lesson〉三階段、Playwright Test Agents；成本與決定性；反面：開放式任務仍需要 runtime 推論。
  讀完後讀者能：替一個任務選「AI 寫腳本一次」或「AI 每次都在迴圈裡」。
  動筆前補研究：Browserbase hardbench 一手頁、Browser Use 1.0 MIGRATING.md。

Order 16：Driver：自己打 CDP 或用 Playwright
  聚焦問題：為什麼有人拆掉 Playwright、代價是什麼？
  講：Playwright client→Node relay→CDP/BiDi 架構（圖）；Browser Use 的理由（多一跳、三處狀態、sharp edges）；Stagehand v4 的理由（遠端延遲、domain policy）；代價（只 Chromium、自己處理當機、失去等待與 strict mode）；Patchright 是為了偵測面；「直接打 CDP 比較隱形」沒有證據。
  讀完後讀者能：說出自己的場景該站哪一邊。
  動筆前補研究：Playwright 官方對 client-server 架構的一手說明。

Order 17：協定：CDP 與 WebDriver BiDi
  （order 16 審稿留下的螺旋：order 9 提到 Stagehand CSS selector 能穿過 closed shadow root，17 要講 a11y tree／Playwright locator 為什麼看不到 closed root。）
  聚焦問題：CDP 和 BiDi 差在哪，「只綁 Chromium」的代價是什麼？
  講：CDP 的 domain／event 模型、Runtime.enable 與偵測史（V8 13.8 修補）；WebDriver classic→BiDi；Firefox 141 移除 CDP；Puppeteer 的 BiDi 支援與缺口；Playwright BiDi 仍 experimental；WebKit 進度。
  讀完後讀者能：判斷自己的工具鏈未來會不會被協定卡住。
  動筆前補研究：W3C BiDi 規格狀態、Chromium BiDi 支援、Playwright BiDi 一手說明、WebKit 進度。

Order 18：引擎：Chromium 以外的選擇
  聚焦問題：Lightpanda、Kitesurf 這類引擎換到什麼、犧牲什麼？
  讀完後讀者能：判斷自己的工作負載（大量擷取 vs 需要像素與登入）能不能換掉 Chromium。
  講：為什麼大家都用 Chromium；Lightpanda（Zig、AGPL、CDP 相容）；Kitesurf（連回 24）；Firefox／WebKit 在 agent 情境的位置。
  動筆前補研究：Lightpanda 文件、benchmark 與相容性限制原文。

Order 19：託管對照
  聚焦問題：託管瀏覽器各家差在哪，什麼時候自架？
  講：價格模型、並發與逾時、反爬能力、與 SDK 的綁定（Browserbase↔Stagehand、Browser Use Cloud↔Browser Use、Hyperbrowser↔HyperAgent）；連 20–24。
  讀完後讀者能：依預算、並發、反爬需求選出託管方案或決定自架。
  動筆前補研究：各家價格與限制重查（舊單篇是 2026-08）。

Order 23：Cloudflare Browser Run
  聚焦問題：Quick Actions 和 Browser Sessions 怎麼選，Workers 整合換到什麼？
  講：改名自 Browser Rendering；Quick Actions（markdown、截圖、PDF、`/json`、`/crawl`）；Browser Sessions（`@cloudflare/puppeteer`／`@cloudflare/playwright`／CDP）；`outboundByHost`；Playwright MCP 版；只支援 Stagehand v2.5 的原因；價格與限制（閒置逾時、並發）。
  讀完後讀者能：判斷自己的任務用一個 REST 呼叫就夠，還是要開 session。
  動筆前補研究：各 Quick Action 文件、Playwright／Puppeteer fork 的差異、`/crawl` 限制。

## 執行順序

1. 改 series.ts 名稱與描述；13 篇既有文章（26 檔）改 frontmatter `series`。
2. 先寫 order 0 總覽＋order 8 Stagehand（中英四檔），三份審稿，給使用者看。
3. 之後每批 2 篇：9＋16、6＋17、12＋13、15＋18、19＋23；post-update order 5 與 14。
