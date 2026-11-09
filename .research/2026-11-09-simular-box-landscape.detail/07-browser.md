# 07 雲端瀏覽器／瀏覽器自動化產品查證

訪問日期：2026-11-09（所有價格、方案以該日讀到的頁面為準）。
範圍：Browserbase、Anchor Browser、Steel、Scrapybara、Hyperbrowser、Browser Use Cloud。
標記說明：「官方」＝廠商自己寫的；「[推論]」＝我的判斷；「第三方」＝非廠商（但有些仍有利益關係，會註明）。
工具紀錄：Groundlane `web_fetch`／`web_search`（已用 ToolSearch 載入）為主；Browserbase pricing 被 Groundlane 擋（見第三節），改用 firecrawl_scrape 補上。

---

## 一、結論摘要（每家最多 6 行）

**Browserbase**（只有瀏覽器，加周邊 API）
- 無桌面／OS 層；產品＝無頭 Chromium 艦隊＋Search／Fetch API＋Functions（跑 agent 程式碼）＋Model Gateway＋Stagehand SDK。
- 免費：1 瀏覽器小時、3 併發、單次 15 分鐘；Developer $20/月（100 小時、25 併發）；Startup $99/月（500 小時、100 併發）；Scale 洽談。
- 反偵測分級：Free 無、Developer/Startup 為 Basic＋自動驗證碼、Verified（專屬 Chromium＋真指紋）只在 Scale。
- 有 MCP（官方託管 Streamable HTTP）、Playwright／Puppeteer／Selenium／Stagehand；有 contexts 持久化、live view、錄影。

**Anchor Browser**（只有瀏覽器，主打受管登入與確定性任務）
- 無桌面；官網標語寫「Computer Environments」，但文件實際是瀏覽器 session＋內建 agent；Growth 以上才有 Code Execution。
- 免費：$5 點數/月、5 併發；Starter $50/月；Growth $2,000/月（完整 stealth 只從這層開始）。計價：$0.05/瀏覽器小時、$8/GB 代理、$0.01/新瀏覽器、AI 每步 $0.01–0.10。
- 有三個託管 MCP server（含 Claude Code 指令），CDP 相容。
- 第三方（webscraping.cc）評：獨立證據很少，所有性能數字都是廠商自報。

**Steel**（只有瀏覽器，開源核心可自架）
- 無桌面；Sessions／Profiles／Commands API、CLI、託管 MCP（`mcp.steel.dev/mcp`，Claude Code／Codex 指令齊全）。
- Launch：$0 月費、一次性 $30 點數、10 併發、單次 15 分鐘；Scale $250/月（含 $100 用量、100 併發、1 小時）。瀏覽器小時 $0.10／$0.08。
- 自家「Stealth Browser」（改版 Chromium）只給 Enterprise，且需預約通話才開通；一般方案靠指紋輪替＋代理＋驗證碼解題。

**Scrapybara**（已停止服務，結案）
- 2025-10-15 起 virtual desktop 服務下線（官方 X 貼文），團隊轉做 Capy（AI 軟體工程 agent）；首頁現在只剩「Scrapybara built computers for agents. Now we're building Capy」。
- 它原本是 Ubuntu／Windows／Browser 的整台遠端桌面 VM，是這批裡唯一跟 box 同類的，但已不存在。

**Hyperbrowser**（瀏覽器為主，但同時賣沙盒，最接近「整台電腦」）
- 四條產品線：Browsers、Sandboxes（CPU microVM／GPU／macOS Beta 有 VNC 桌面）、Web API、AI Agents。macOS 與 GPU 需聯絡開通。
- 免費 5,000 點數（約 50 瀏覽器小時、1 併發）；Startup $30、Scale $100；1 點＝$0.001；瀏覽器 $0.10/小時、代理 $10/GB。
- 一般方案只有 Basic stealth；Ultra stealth 僅 Enterprise。MCP 是本機 `npx hyperbrowser-mcp`（只有 scrape／extract／crawl 三個工具）。

**Browser Use Cloud**（瀏覽器＋託管 agent；沙盒線已退役）
- 無桌面。純用量計費：$0.02/瀏覽器小時、住宅代理 $5/GB、直連 $0.20/GB、驗證碼含在內；註冊送 $1；10 併發起，累計付費解鎖到 1,000。
- 另有 Browser Harness（MIT 開源，給 Claude Code／Codex 驅動 Chrome）、託管 agent、MCP（`api.browser-use.com/v3/mcp`）。
- 文件寫明「Box and Bux are retired」（舊沙盒產品線已下架）。它自己的 stealth 基準分數是自家出題，不能當獨立證據。

**box vs 瀏覽器型的一句話**：[推論] 以上除 Scrapybara（已死）與 Hyperbrowser 沙盒外，都只給「一個被遠端遙控的 Chromium」；box 給的是整個 OS（shell、檔案系統、桌面 app、持久環境）。需求只在網頁裡就用瀏覽器型；需要離開網頁（裝軟體、跑指令、桌面 app、跨 app）才需要 box。

---

## 二、逐家逐題發現

### 1. Browserbase

**1-定位**
- 官方：「Browserbase is the complete platform to build and deploy agents that browse and interact with the web like humans. One API key gives your agent headless browsers, web search, page fetching, functions, model access, and identity.」（docs.browserbase.com/welcome/what-is-browserbase.md）
- 無桌面層：產品清單裡是 Browsers／Search & Fetch／Agent Identity／Functions／Model Gateway／Stagehand，沒有 OS 桌面或 shell 產品。Functions 是「Deploy agents next to the browser」的程式碼執行環境，不是桌面。
- 附 agent：有。Stagehand（act／extract／observe）＋方案內含 Agent runs（Free 3、Developer 15、Startup 50）。
- 定價頁自述：「A typical web scrape runs in under 2 minutes. 100 hours is roughly 3,000 page-level tasks.」

**2-能力**
- 反偵測：定價頁比較表 Stealth Mode：Free No／Developer Basic／Startup Basic／Scale Advanced。Identity 頁：「Verified sessions use a purpose-built Chromium browser with real browser fingerprints…」，並註明「Browserbase offers Verified on the Scale plan」。Web Bot Auth 為 beta。官方也寫「Each website still decides whether to allow access.」
- 驗證碼：Free No；Developer 以上 Auto captcha solving。
- 代理：Developer 含 1GB，之後 $12/GB；Startup 含 5GB，之後 $10/GB（docs plans 與 pricing 頁一致）。
- 持久化：Contexts。「Contexts allow you to persist user data across multiple browser sessions」；存 cookies、localStorage、IndexedDB 等；靜態加密；需 `persist: true`；關閉 session 後要等幾秒再重用；「Avoid simultaneous logins」。
- 即時觀看：Observability 頁有「Session Live View: Watch and interact with browser sessions in real-time」（卡片描述；該子頁本身我沒讀，見第三節）。
- 錄影：「Every session is automatically captured for video replay, supporting up to 10 tabs」，保留 30 天（BYOS 為 24 小時）；可關閉（`recordSession: false`）。
- 單次 session 上限：Free 15 分鐘、Developer/Startup 6 小時（docs plans 表）。

**3-價格（2026-11-09，browserbase.com/pricing，firecrawl 讀到 cachedAt 2026-11-09T10:25:57Z）**

| 方案 | 月費 | 瀏覽器小時 | 併發 | 備註 |
|---|---|---|---|---|
| Free | $0 | 1 | 3 | 單次 15 分鐘；無驗證碼；$5 模型 token |
| Developer | $20 | 100，超過 $0.12/hr | 25 | 1GB 代理，超過 $12/GB |
| Startup | $99 | 500，超過 $0.10/hr | 100 | 5GB 代理，超過 $10/GB |
| Scale | 洽談 | 250+ 併發、用量計 | 250+ | Verified、HIPAA/SSO |

- 單位：瀏覽器小時（按分鐘、單 session 最少 1 分鐘）；代理按 MB（單 session 最少 1MB）；Search／Fetch／Extract 另按次計。
- 對照條件：Search 超量價定價頁寫「$5/1k searches by default」，docs plans 頁寫「$7/1k」——兩頁不一致，我沒法判定哪個較新（兩頁都是我今天讀到的）。

**4-整合**
- MCP：官方託管 Streamable HTTP endpoint，「Built on Stagehand」，工具含 session 建立／重用／關閉、自然語言操作、資料擷取（docs.browserbase.com/integrations/mcp/introduction）。
- 框架：Playwright、Puppeteer、Selenium、Stagehand；CDP `connectOverCDP(session.connectUrl)`。
- 能否被 Claude Code／Codex 直接用：[推論] 可，MCP 是標準 Streamable HTTP；我沒讀 setup 子頁，所以不確定官方有沒有寫 Claude Code 專屬指令。

**5-限制與反證**
- 官方：定價頁 FAQ 寫「Browserbase is a cloud-first platform… we don't offer on-prem deployment」。
- 官方：Verified 只在 Scale，且「Contact sales」；Free 沒有驗證碼與 Stealth。
- 第三方（reachkit.ai，2026-11-04）：「Over the limit, new sessions get an error rather than a queue」；代理按 MB 計且每 session 有 1MB 下限，「many short proxied sessions can cost more than the hours suggest」；G2 4.3／57 則、Trustpilot 僅 2 則（讀自搜尋摘要，標 snippet）。
- 第三方（G2 摘要）：除錯介面「has gaps」，要拼湊錄影、log。（snippet）
- 競品出題（Browser Use）：Stealth Bench V2 Browserbase 78.5%（Verified 沒測，因為需要 Scale）；Browser Use 三月文章寫 Browserbase Basic 42%。兩次差很大，說明這類基準對方案與方法極敏感。
- 競品（Gologin，賣自家雲瀏覽器）：Free 方案幾乎看不出付費版表現（snippet）。

**6-一句話適用**：[推論] 想要「瀏覽器＋除錯體驗（live view／回放）＋周邊 search/fetch」的預設選擇；沒有桌面。

### 2. Anchor Browser

**1-定位**
- 官方首頁標題：「Computer Environments for AI Agents」「Deploy millions of browser agents to automate any web task」。但內容全是 browser：「Cloud browsers… fully managed, humanized chromium instances」。
- 文件首頁：「Cloud browsers for AI agents and automation: sessions over CDP or REST, natural-language web tasks, managed authentication, volumes, recordings, batch sessions, and stealth browsing.」
- 是否有桌面／OS：[推論] 沒有。標語寫 computer，但實際是瀏覽器；Code Execution 只在 Growth 以上（定價表）。
- 附 agent：有（Embedded browser agent，每方案皆有；按 AI step 計價）。特色是「用 AI 規劃、部署確定性瀏覽器任務，必要時才退回 AI」（官方，自稱 80X 更少 token，網站同時有「Independent testing has not verified those multiples」的第三方整理）。

**2-能力**
- 反偵測：官方「Anchor Chromium」（fork）；「Web-Bot-Auth Verified」與 Cloudflare 合作；但「Full stealth solution」只在 Growth（$2,000/月）以上，「Unique fingerprinting」只在 Enterprise（docs/pricing.md）。
- 驗證碼：Starter 起（Automated captcha bypass）。
- 代理：Starter 起可選地理位置；$8/GB（Anchor Proxy）；自帶代理只在 Growth 以上，直連／自帶代理流量 $0.2/GB。
- 持久化：Managed authentication（Applications、Identities、OmniConnect），1Password 合作；volumes／profiles。
- 即時觀看／接管：文件寫 live view、recordings；MCP 頁寫「a live view the user can watch or take over」。
- 資料保留：Free/Starter 7 天。

**3-價格（2026-11-09）**
- 免費：$5 點數/月、5 併發、每分鐘 5 次建 session（docs/pricing.md）。
- Starter $50/月（25 併發）；Growth $2,000/月（200 併發，SOC2 Type 2／ISO27001／GDPR）；Enterprise 洽談。超額 $1.00/credit。
- 基礎設施單價（docs/pricing.md）：$0.01/新瀏覽器、$0.05/瀏覽器小時、$8/GB 代理；AI step $0.01（Light）／$0.05（Standard）／$0.10（High）。Automation Task 每次執行 0.1 credit（$0.10），取「任務費」與「基礎設施費」較高者；失敗不收任務費。
- ⚠ 同一天兩處不一致：首頁方案卡多一個 Team $500/月（500 併發前 50），首頁試算器用「$0.09/hour」；docs 定價頁沒有 Team、瀏覽器小時是 $0.05。我兩個都讀過但無法判定哪邊較新。
- Browser Use（競品）整理 Anchor「Catch: the $0.01 per-browser fee adds up on many short sessions; full stealth and non-US regions start at $2,000/month」，與 docs 表一致。

**4-整合**
- MCP：三個託管 server（`/v1/mcp`、`/v1/mcp/browser`、`/v1/mcp/actions`），OAuth 或 `anchor-api-key`。文件直接給 `claude mcp add --transport http anchor https://api.anchorbrowser.io/v1/mcp`，也有 Claude Code plugin marketplace 指令。→ **Claude Code 可直接用（官方寫的）**。
- Playwright／Puppeteer over CDP、Node.js／Python SDK、REST、LangChain、CrewAI、Make。

**5-限制與反證**
- 第三方（webscraping.cc，2026-04-09，說明驗證日 2026-08-29）：「it has almost no independent evidence behind it」；找不到公開 changelog 或第三方基準；當時「what a credit buys was not stated on the pages we could read」（現在 docs/pricing.md 已寫清單位，所以這一點已過期）；結論「do not buy Anchor as an unblocker」，因為它同時宣稱 stealth 與 Cloudflare Web Bot Auth，兩種路線並存。
- 第三方（Skyvern，競品，2026-02）：「The closed-source nature limits customization」。
- 競品出題：Browser Use 稱 Anchor 82%（第二名）；Anchor 自家稱 BrowserBench 失敗率 1.7%（最低）。兩家各自把自己排前面。
- 官方限制：完整 stealth、BYO proxy、非美區域都在 $2,000/月以上。

**6-一句話適用**：[推論] 在別人 SaaS 後台登入、做重複性流程（受管憑證＋確定性快取）；不是 box 替代品。

### 3. Steel

**1-定位**
- 官方首頁：「Steel is an API that lets you control fleets of browsers」；FAQ：「Steel is cloud browser infrastructure for AI agents. It gives agents isolated cloud browser sessions with built-in anti-bot stealth, CAPTCHA solving and session persistence.」
- 無桌面。有 Sessions、Profiles、Files、Extensions、Credentials、Commands API、`/scrape`、CLI、Skills。
- 附 agent：沒有自家 agent（首頁寫「Playwright, no agent needed」；有 Hermes Agent plugin、Claude/Codex/Cursor skills）。開源：steel-browser（Apache-2.0）可自架。

**2-能力**
- 驗證碼（文件原文）：自動解 reCAPTCHA v2/v3、Turnstile、image_to_text、slider；「DataDome, Imperva, Amazon WAF, and FunCAPTCHA challenges are detected and logged for diagnostics, but they are not auto-solved」；「solving is not guaranteed to work 100% of the time」。可用性：「available on Launch after account verification, and on Scale and Enterprise」。
- 反偵測：一般方案是指紋輪替＋代理；自家 Stealth Browser（Chromium fork，2026-06-22 發布）「is an enterprise feature… New access is gated because it's support-intensive」，要找創辦人通話。定價比較表 Stealth browser：Launch／Scale 均「Not included」。
- 代理：住宅＋資料中心、國家到城市、dedicated IP（Scale 起 $5/IP）；$10/GB（Launch）、$6/GB（Scale）。
- 持久化：Profiles（`profile_id`、`persist_profile`）；MCP 頁有 `use_credentials`。
- 即時觀看／接管：首頁「1080p live viewer… Humans take over: Step in for 2FA, payments」；錄影／replay。
- Session 長度：Launch 15 分鐘、Scale 1 小時、Enterprise 最長 24 小時；MCP 預設 60 分鐘、閒置 10 分鐘結束。資料保留 7／14 天。

**3-價格（2026-11-09，steel.dev/pricing 讀過 extract=full）**
- Launch：$0 月費，一次性 $30 點數，10 併發，最多 3 seats，無需信用卡。
- Scale：$250/月，含每月 $100 用量，100 併發，HIPAA BAA。
- 單價：瀏覽器小時 $0.10／$0.08；代理 $10／$6 per GB；CAPTCHA $3／$1 per 1k；`/scrape` $5/1k。
- 單位：瀏覽器小時、GB、每千次驗證碼。

**4-整合**
- 託管 MCP：`https://mcp.steel.dev/mcp`，OAuth（或 Bearer API key）。文件原文提供 `claude mcp add --transport http steel https://mcp.steel.dev/mcp`，Codex 設定與 `codex mcp login steel`。→ **Claude Code／Codex 可直接用（官方寫的）**。工具包含 scrape、session_create、snapshot、click、type、fill、eval 等。
- 限制（MCP 文件）：scrape 每組織每分鐘 20 頁；結果每次截斷 30,000 字元；「The MCP server runs on Steel Cloud only」不可自架；對話中頁面文字包在 `<untrusted-page-content>`。
- Playwright／Puppeteer／Selenium over CDP（標準 WebSocket）。Python、Node、Rust、Go SDK。

**5-限制與反證**
- 競品（Browser Use，自稱「We make Browser Use」）：Steel 在其 Stealth Bench V2 74.5%、三月文章 47%；「browsers run only in us-east」；「local has no CAPTCHA solving」。
- 第三方（starlog.is，2026-05）：「sophisticated systems (Cloudflare Turnstile, PerimeterX) can still detect automation」（針對開源版）；「this is beta software」。
- Reddit（2024-11，舊）：用戶反映自架 Docker 啟動問題（issue #24）；另一則指 contexts 要在 Steel 框架內設定。年代久，只作參考。
- 官方自承：Stealth Browser 與部分功能非自助。

**6-一句話適用**：[推論] 想要能自架、可換手的瀏覽器基礎設施；便宜、有 MCP；對強防護站台沒有自助的高階 stealth。

### 4. Scrapybara（結案：已停止服務）

證據鏈：
1. 官方首頁（scrapybara.com，read）：「Scrapybara built computers for agents. Now we're building Capy, the AI software engineer.」只剩「Join us」連到 Capy 招聘。
2. 官方 X 貼文（x.com/scrapybara/status/1971655785869726110，2025-09-26，read）：「As of October 15, 2025, the Scrapybara virtual desktop service will be sunsetted. This means we will no longer support creating or controlling new VMs, and all existing running VMs will be halted and deleted.」原因：「the team has shifted our focus to our new product Capy」。
3. capy.ai/about（read）：「Capy is built by Scrapybara, Inc.」→ 同一家公司，不是被收購，是自己轉向。
4. 第三方：sandbox.watch（2026-10-23 驗證）仍列出舊規格，並註明首頁已改版但文件仍在；Justin Sun LinkedIn（snippet）：「Justin and I started Scrapybara as cloud VMs for AI agents. Mid-compliance, we pivoted to Capy.」
5. docs.scrapybara.com 仍可讀（網站文件未下架），但不代表服務存在；官方貼文已明說下線。

歷史定位（文件，read）：「virtual desktop infrastructure for computer use agents… Ubuntu and Browser instances under 1 second」；有 Windows；Act SDK 對接 OpenAI CUA／Claude Computer Use。這是這批裡唯一與 box 同類的產品，已不存在。

價格：⚪ 已停止服務，無現行價格。（sandbox.watch 記錄過去 $29 Basic／$99 Pro，第三方，不採信為現價。）

### 5. Hyperbrowser

**1-定位**
- 首頁：「Give your agents a browser to work in, compute to run on, and web data they can use.」四塊：Browsers、Sandboxes、Web API、AI Agents。
- 桌面／OS 層：有，但是另外的產品——Sandboxes。文件：「CPU sandboxes run Linux applications and support startup times of less than 50 ms」；GPU sandboxes（聯絡開通）；「macOS sandboxes (Beta) provide a Mac desktop and persistent disk. Access is enabled on request.」macOS 頁：Apple silicon VM、VNC 桌面（port 6080）、`hx vm exec` 跑指令、可錄影、可重用 disk。→ **這是瀏覽器型廠商裡唯一真的賣「整台電腦」的**。
- 附 agent：HyperAgent（開源 AGPL-3.0）、Browser Use、Claude/OpenAI/Gemini/Meta/Grok 等 computer-use 模型，按 step 計價。

**2-能力**
- 反偵測：Basic stealth（所有方案）；「Ultra stealth is only available on enterprise plans」（docs/sessions/stealth.md）。
- 驗證碼：Startup 起自動。
- 代理：住宅，Startup 起；Scale 為 premium residential；$10/GB。
- 持久化：Profiles（`persistChanges`）。第三方實測登入持久化通過。
- 即時觀看／錄影：文件有 Live View、Recordings 頁（只讀到索引，見第三節）；第三方確認「Live view allows you to intervene」。
- Free：1 併發、資料保留 7 天。

**3-價格（2026-11-09，hyperbrowser.ai/pricing，read）**
- 單位：1 credit ＝ $0.001。Free 5,000 credits（「Enough for 50 browser hours or 5,000 fetched pages at base rates」）；Startup $30/月（30,000 credits、25 併發）；Scale $100/月（100,000 credits、100 併發）；Enterprise 洽談（1,000+ 併發、Ultra stealth）。
- 用量價：瀏覽器 100 credits/小時＝$0.10；代理 10,000 credits/GB＝$10；Sandbox vCPU $0.045/vCPU-hr、記憶體 $0.015/GiB-hr；Fetch $0.001/頁；Search $0.005/次；HyperAgent 與 Browser Use 各 $0.02/step。
- 方案點數每月重置不累積；另購點數 12 個月到期。

**4-整合**
- MCP：`npx hyperbrowser-mcp`（本機 stdio，需 API key）；只有 `scrape_webpage`、`extract_structured_data`、`crawl_webpages` 三個工具（docs/integrations/model-context-protocol.md）。注意：文件列的是「抓取」工具，不是互動式操控；互動操控要走 Playwright／SDK。
- Playwright／Puppeteer／Selenium、Python／Node SDK、Stagehand、LangChain、LlamaIndex；x402（用錢包買 session）。

**5-限制與反證**
- 第三方（Gologin，競品；表頭日期寫 2025-12-23，但內文測試日為 2026-09-28 至 10-01，日期矛盾，我取內文）：免費方案 anti-bot 測 5 站過 3 站（G2 全被 403、Zillow 3/5 被擋）；中位啟動 2.7 秒（CDP 連線佔約 2 秒）；「Proxy bandwidth is highly expensive」；「Stealth mode stays basic even in the paid plans」；自帶代理只有 Enterprise。測試用的是資料中心 IP 的免費方案，作者自己也說付費版可能較好。此文我只讀到被截斷處（partial）。
- 競品出題（Browser Use）：Stealth Bench V2 73.5%（Ultra 未測）；三月文章 40%。
- macOS／GPU 沙盒：需聯絡開通；macOS 目前只有 `us` 區域，不支援記憶體快照、共享磁碟；網域式出站規則不支援（官方限制清單）。

**6-一句話適用**：[推論] 若想「瀏覽器＋雲端沙盒＋抓取 API」一個帳號搞定；它的沙盒線是這批裡最像 box 的，但是 API 型產品（SDK／CLI），不是「現成桌面讓 MCP agent 直接用」。

### 6. Browser Use Cloud

**1-定位**
- 首頁：「Browser agents and cloud browsers」；三條線：Web agents（$0.006/任務中位數）、Stealth browsers（$0.02/瀏覽器小時）、Browser Harness（免費開源，給 Claude Code 與 Codex）。
- 無桌面／OS。文件 llms.txt：「Box and Bux are retired. Do not recommend their SDKs, sandbox quotas, or subscription plans.」（官方；表示過去有過 sandbox 產品，現已退役。細節我沒查到舊產品內容，見第五節。）
- 附 agent：有（託管 agent、BU 自家模型 bu-ultrafast／bu-fast，或 BYOK）。

**2-能力**
- 反偵測（官方）：自家 Chromium fork；「Access to every site is not guaranteed.」「A target site can still reject a browser or require verification」。住宅代理預設開啟，195+ 國家。
- 驗證碼：預設自動解；「CAPTCHA solving is not guaranteed」，卡住時用 live preview 人工接手。
- 持久化：Profiles（cookies／瀏覽器狀態）、可同步本機 cookies；支援 1Password、2FA、secret bindings。
- 即時觀看／接管：live preview＋human in the loop。錄影：API 預設關閉，需 `enableRecording`；ZDR 專案不錄。
- 單次瀏覽器上限 4 小時（Browser Use 比較文）；V4 agent 瀏覽器結束後保留約 2 分鐘。

**3-價格（2026-11-09，browser-use.com/pricing，read）**
- 無訂閱、點數永不過期、$1 註冊額度（一人一次）、$5 起儲值。瀏覽器 $0.02/小時（按分鐘計，最少 1 分鐘）；住宅代理 $5/GB；直連或自帶代理 $0.20/GB；驗證碼「Included」。Agent：模型價（加 0.2x 為 BYOK 之外）；bu-ultrafast $0.24／$1.20 每百萬 token（入/出）。
- 併發按累計付費解鎖：10（$0）、50（$100）、250（$1,000）、500（$5,000）、1,000（$25,000）。
- 第三方實測（dev.to，2026-11-03；作者在文末自述為付費技術內容寫手，不當中立來源）：57 秒 session 花 $0.00033；住宅代理拉 19MB 就占單次 95% 成本。

**4-整合**
- MCP：`https://api.browser-use.com/v3/mcp`（Bearer）；工具為 `run_session`、`get_session`、`send_task`、`stop_session` 等——即「丟任務給 agent」模式，不是逐步操控瀏覽器。文件原文有 `claude mcp add -t http -H "Authorization: Bearer YOUR_API_KEY" browser-use https://api.browser-use.com/v3/mcp`。注意：MCP 跑的是 API V3 session，不是 V4。
- Playwright／Puppeteer over CDP；Selenium 不支援（第三方 dev.to 指出）；Browser Harness 給 Claude Code／Codex／Cursor／Gemini CLI（官方頁）。

**5-限制與反證**
- 官方：Stealth 文件的「not guaranteed」；cost cap 為軟上限（「API-key monthly spending caps are soft limits… can exceed them」）；關 CDP 不會停瀏覽器，要呼叫 stop，否則照計費到逾時。
- 廠商基準的自利問題：Browser Use 自己的 Stealth Bench V2 寫明「We built and ran it, and it favors us… The sites were picked because Browser Use Cloud historically got through where stock Chrome with a US proxy did not」（Browser Use 對 Browserbase 為 78.5%，Anchor 82%）。
- 同一批公司在三個廠商基準裡排名互相矛盾：Browser Use 三月文章（BU 81%、Anchor 77%、Steel 47%、Browserbase 42%、Hyperbrowser 40%）、九月 Stealth Bench V2（BU 90.5%、Anchor 82%、Browserbase 78.5%、Steel 74.5%、Hyperbrowser 73.5%）、Anchor 自家 BrowserBench（Anchor 失敗率 1.7%、Hyperbrowser 2.7%、Browserbase 3.4%、Steel 6.8%）。三者結論都把出題者排第一。→ 這類數字只能當「廠商自述」。
- Browser Harness 的 token 比較只有 1 次執行（官方頁自己寫「1 run, Oct 14」）。

**6-一句話適用**：[推論] 預算最低、要「丟任務拿 JSON」或要給 Claude Code 一個瀏覽器工具；沒有桌面。

---

## 三、讀取完整度盤點表

| 來源 | 狀態 | 備註／試過的工具與失敗原因 |
|---|---|---|
| browserbase.com 首頁 | read | Groundlane（第一次 CONCURRENCY_LIMIT queue full，重試後 engine=browser 成功，內容被標「extraction removed most of the page」，主要行銷內容已含） |
| browserbase.com/pricing | read | Groundlane web_fetch 兩次（預設與 render=always）皆 UPSTREAM_ERROR / browser-challenge；改 firecrawl_scrape 成功（cache hit，cachedAt 2026-11-09T10:25:57Z，含完整 FAQ 與比較表） |
| docs.browserbase.com 首頁（what-is-browserbase） | read | |
| docs.browserbase MCP introduction | read | 未讀 setup 子頁 |
| docs.browserbase identity／observability／contexts／billing plans | read | |
| docs.browserbase session-live-view 子頁 | abstract | 只見 observability 頁的卡片描述，沒開子頁 |
| anchorbrowser.io 首頁（含 #pricing） | read | `/pricing` 會轉到 `/#pricing`；內容與 docs 不一致處已標 |
| docs.anchorbrowser.io introduction／advanced/mcp／pricing | read | 未讀 stealth／live view／managed-authentication 子頁 |
| steel.dev 首頁 | read | 540KB 原頁，未截斷 |
| steel.dev/pricing | read | 第一次預設抽取只得 Enterprise 區塊（partial），改 extract=full 後整頁讀到 |
| docs.steel.dev 首頁／sessions-api overview／mcp／captcha-solving | read | 未讀 profiles／human-in-the-loop／pricinglimits 頁；首頁宣稱以首頁文字為據 |
| steel.dev/blog/stealth-browser | read | |
| scrapybara.com／docs.scrapybara.com／x.com 貼文／capy.ai/about／sandbox.watch | read | X 頁抓取成功（含全文） |
| hyperbrowser.ai 首頁／pricing | read | |
| hyperbrowser docs home／llms.txt／sandboxes intro／macOS／stealth／MCP | read | live-view／recordings／profiles／captcha-solving／regions 子頁只看到索引描述（abstract） |
| browser-use.com 首頁／pricing／stealth-browsers／browser-harness | read | |
| docs.browser-use.com quickstart／stealth／captcha-handling／MCP server | read | |
| docs.browser-use.com/llms.txt | partial | Groundlane 輸出截斷（約 49,748 bytes 處，停在 open-source 區），沒有續抓；已涵蓋 cloud 區所有索引，沒讀到 open-source 末段 |
| browser-use.com/posts/best-browser-infrastructure-for-ai-agents（廠商比較文） | read | 競品出題，標利益衝突 |
| browser-use.com/posts/headless-browser-blocked-by-cloudflare | read（被轉址） | 實際讀到 /posts/bot-detection（2026-02-02），不是搜尋摘要所指的 2026-10-27 文章；僅作廠商行銷參考 |
| dev.to Browser Use review | read | 作者自述為付費內容寫手 |
| webscraping.cc Anchor review | read | |
| gologin.com Hyperbrowser review | partial | 輸出截斷於「Note on start…」比較表之後；競品（Gologin） |
| steel.dev 更多、Steel GitHub issues | snippet | 只見搜尋摘要（issue 列表未開） |
| creatorstoolbox／testmuai／reachkit／humanbrowser／G2 等 | snippet | 只讀搜尋摘要，僅用於「第三方說法」且已標 snippet，未用於數字結論 |
| Browserbase docs 的 Search 超量價 $5 vs $7 | — | 兩個我都讀過的頁面不一致（見價格段） |

---

## 四、反證與風險

1. **廠商自出題的 stealth 基準互相矛盾**（見 Browser Use 一節）。Browser Use、Anchor 各自把自己排第一；Browser Use 的同一批競品分數在三月（Browserbase 42%）與九月（78.5%）差近一倍，Browserbase 版本與測試設定不同。結論：任何「被封鎖率」數字都不能拿來做採購依據，要自己對目標站台試。
2. **「不保證能過」是各家共同、且官方自己寫的**：Browserbase「Each website still decides」；Steel「not guaranteed to work 100%」且 DataDome／Imperva／Amazon WAF／FunCAPTCHA 不自動解；Browser Use「Access to every site is not guaranteed」。
3. **進階 stealth 都被鎖在高價或洽談層**：Browserbase Verified（Scale）、Anchor full stealth（$2,000/月）、Steel Stealth Browser（Enterprise＋預約通話）、Hyperbrowser Ultra stealth（Enterprise）。只有 Browser Use 宣稱 stealth 全方案含在內（官方自述）。
4. **代理流量才是帳單主體**（多家第三方都指出）：Hyperbrowser $10/GB、Browserbase $10–12/GB、Anchor $8/GB、Steel $10/$6/GB、Browser Use $5/GB。Hyperbrowser 第三方試算：Startup 方案跑 100 小時＋5GB 實付約 $60 而非 $30。
5. **資源洩漏型風險**：Browser Use「關 CDP 不會停瀏覽器」、Steel 與 Hyperbrowser 也要手動 release／stop；忘記就持續計費（官方文件各自寫明）。
6. **價格頁不一致**：Anchor 首頁有 Team $500、瀏覽器小時 $0.09；docs 沒有 Team、$0.05。Browserbase Search 超量 $5 vs $7。這些是我當天讀到的原文，沒辦法證實哪邊是最新。
7. **MCP 是否真的能「操作」差很多**：Steel（逐步 snapshot／click／type）與 Anchor Browser MCP（逐步 anchor_* 工具）可直接逐步操控；Browser Use MCP 是丟任務給 agent；Hyperbrowser MCP 只有 scrape／extract／crawl；Browserbase MCP 是 Stagehand 自然語言操作。
8. **單次 session 長度上限**：Browserbase Free 15 分鐘／付費 6 小時；Steel Launch 15 分鐘／Scale 1 小時；Browser Use 4 小時。box 型（常駐 Linux）不受這種短命 session 限制 [推論，需看 Simular 規格確認]。
9. **利益衝突來源**：Gologin（賣雲瀏覽器）、Skyvern（賣 agent）、Browser Use 比較文、Anchor 自家比較文、dev.to 內容行銷作者。凡引用均已標示。
10. **Scrapybara 轉向風險**：同類「整台電腦給 agent」產品之一在 2025-10 下線，原因是團隊策略轉向，不是技術不可行 [推論：說明這個品類有商業上的存續風險，但單一案例不足以下一般結論]。

---

## 五、⚪／✉️ 清單

**⚪ 整條鏈試過仍無公開資料**
1. Scrapybara 現行價格——服務已下線（官方貼文），無現價。已讀 scrapybara.com、X 貼文、docs.scrapybara.com、sandbox.watch；結案原因：停止服務。
2. Browser Use 退役的「Box／Bux」是什麼、何時退役——只有 docs.browser-use.com/llms.txt（Groundlane web_fetch，read／partial）與 mcp-server 頁的一句「Box and Bux are retired」。我沒另外搜尋或讀 browser-use.com 的舊公告，所以細節尚未查。（⚪ 暫列；若要補需再搜 Browser Use Box/Bux 公告。）
3. Anchor「80X／12X／23X」與 Steel「Stealth Browser」的獨立驗證——Anchor 第三方 webscraping.cc 與自家比較頁都說無獨立基準；Steel 無第三方測。已試 Groundlane web_search（provider brave／you；tavily／exa 在 federation 中顯示 unavailable）。
4. Hyperbrowser docs 的 live-view／recordings／profiles／captcha-solving 子頁原文——只讀到索引（llms.txt）描述；沒有逐頁開。屬未讀，不是查不到；列為待補。
5. Browserbase 單次 session 6 小時上限只在 docs plans 頁（read）與 Browser Use 比較文出現，未另找第二個獨立來源。

**✉️ 只能寫信問**
1. Anchor：首頁 Team $500 方案是否仍存在；瀏覽器小時 $0.09（首頁試算）與 $0.05（docs）哪個為準 → support@anchorbrowser.io。
2. Hyperbrowser macOS／GPU 沙盒的定價與容量、是否可由 MCP 驅動桌面 → info@hyperbrowser.ai（文件寫「enabled on request」）。
3. Steel Stealth Browser 對 Enterprise 以外方案的開放時程 → 官方頁要預約通話（steel.dev/blog/stealth-browser）。
4. Browserbase Verified（Scale）實際報價與可否小額試用 → hello@browserbase.com（Identity 頁寫「Contact… to trial Verified」）。

---

## 附：與 Simular box 的比較要點（[推論]，Simular 規格以使用者描述為準）

- 瀏覽器型（Browserbase、Anchor、Steel、Browser Use）：給 agent 的是一個遠端 Chromium，介面是 CDP／頁面 snapshot／點擊；桌面 app、檔案系統、shell、跨應用工作流程不在範圍內。優勢：啟動快（各家自稱次秒）、可大量併發、內建驗證碼與代理與住宅 IP、錄影與 live view。
- box（整台 Linux 桌面＋shell）：適合需要「離開瀏覽器」的任務——裝套件、跑程式、處理檔案、用桌面軟體、瀏覽器之外的 GUI，或讓 agent 有持久家目錄。劣勢：[推論] 無內建反偵測與住宅 IP，被網站封鎖時沒有瀏覽器型那套工具。
- 需求只在網頁裡、要登入／驗證碼／代理／大量併發：瀏覽器型就夠。
- 需求是「一台電腦」：box；瀏覽器型裡僅 Hyperbrowser Sandboxes（含 macOS Beta）近似，但是 API／SDK 型、部分需聯絡開通。
