# Orgo 與 Cua 查證報告（訪問日 2026-11-09）

工具鏈說明：全程使用第 (1) 層 Groundlane MCP（web_fetch / web_search / web_extract）。輔以 jina read_url、firecrawl_scrape。Groundlane 的 web_search 預設回傳聯合結果（you / brave）。GitHub API（gh、curl api.github.com、shields.io）在本 session 被 403 擋下（見第六節），GitHub 資料改用網頁頁面。[推論] 標記表示我的推論，其餘為官方原文或讀過的頁面。

---

## 一、結論摘要

### Orgo（orgo.ai，Organic Intelligence, Inc.，YC）
- 定位：純「電腦基礎設施」，官方明寫 "Not an AI agent. Orgo provides the computer, not the agent."；但附 OpenAI 相容的 computer-use 端點（`orgo-agent`）、一鍵模板（Hermes / OpenClaw / Claude Code / Codex）和 AI credit，屬基礎設施加輕量 agent 選配。
- OS：Linux 與 Windows 自助（Windows 要 Scale 或 +$15/台 add-on，Windows 不能按小時）；Mac 與 iPhone 在 app 內「Get one」缺貨即無（Mac 約 $100/月起、iPhone $65/月起，FAQ 寫）；Android 在 API 的 os 列舉中。
- 規格：可調。Small 0.5vCPU/4GB/20GB、Medium 2/8/40、Large 4/16/80、XL 6/32/150（自助上限）、2XL 8/64/300（需聯絡）。可線上 resize。
- 價格（2026-11-09 讀自 orgo.ai/#pricing 與 docs）：月繳 Starter $29 / Growth $99 / Scale $399；年繳 $276 / $948 / $3,828（約 8 折，首頁預設顯示年繳換算 $23 / $79 / $319）。另有按小時：Medium $0.055/hr（按秒計、無最低時數），停機只收磁碟 $0.0027/hr。免費帳號：$5 起始 credit，可跑 1 台 Medium（需通過 free checks）。
- 持久化：stop = 磁碟封存，檔案、已安裝軟體保留，記憶體與行程不保留；可設 Sleep when idle（15 分–4 小時，睡眠保留記憶體與行程）；預設無 TTL，可選 `ends_in_hours` 1–720（到期整台刪除，不可復原）。
- 整合：REST、Python/TS SDK（TS SDK 為 `orgo@1`，v2 之後僅剩 CLI）、CLI、MCP（OAuth 遠端 `https://www.orgo.ai/mcp` 或 `npx orgo-mcp-server`）、VNC、SSH、嵌入式即時畫面。
- 閉源 SaaS，無自架；GitHub 上沒有核心產品 repo 可查 [推論，未逐一驗證 orgo 組織下 repo]。
- 主要風險：無公開入站主機名（webhook 打不進來）、無 systemd、stop 後 IP 可能換、記憶體不保留、Windows/自訂模板被綁高階方案；第三方負評極少，多為聯盟/正面稿（利益相關）。

### Cua（cua.ai，Cua AI, Inc.，YC X25，GitHub trycua/cua）
- 定位大轉向：**Cua Cloud 與 Fleets 已於 2026-10-18 終止**。官方現在是「Cua Spaces」（讓你把自己的 Mac / Linux 機器 / 自己雲帳號的 VM 變成共享桌面）加 MIT 的 Cua Driver / Lume / SDK / CLI / Bench。官方原文："Cua does not rent you a computer."
- 所以「Cua 雲端桌面」目前**不存在託管版**。要雲端只能 BYO：自己的 AWS / GCP / Azure / Hetzner / Modal 帳號（帳號上限 32 台機器），Linux 容器為主；Windows 與 macOS 雲端不提供。
- OS：Driver 支援 macOS / Windows / Linux（Linux 有 toolkit / compositor 限制）；Spaces app 需 macOS 26+，Linux Ubuntu 24.04，Windows 為 preview；macOS Space 需 Apple silicon，一台 Mac 最多同時 2 個 macOS VM（Apple 授權限制）。
- 價格（讀自 cua.ai/pricing）：Spaces Free $0（2 台同時使用、每月 20 遠端小時）；Pro 年繳 $180（= $15/月）或月繳 $18，5 台同時、200 小時；Teams 年繳 $300/seat（= $25/月）或月繳 $30，每 seat +5 台 +200 小時共用池。BYO 雲費用由雲商計，官方估 AWS/GCP 約 $0.03–0.04/hr、Hetzner 約 $0.0114/hr、Modal 約 $0.24/hr。
- 持久化：本機沙盒「跑到你刪除」；自己雲上預設 8 小時 TTL（`--ttl-hours`，0 = 不自動刪，Modal 最長 24 小時）；AWS/GCP 的 Space 可 stop/start 保留磁碟，Modal 不能 stop。
- 整合：MCP（`cua daemon mcp`，33 個 Spaces 工具）、SDK（Python / TypeScript / Rust；Swift、Kotlin 尚未釋出）、CLI、即時串流（QUIC / WireGuard mesh）、Claude Code / Codex / Cursor / Gemini CLI / Cline / Kiro / OpenClaw 等。
- 授權：Spaces 為 FSL-1.1-MIT（source-available，禁止做競品託管服務，每版兩年後轉 MIT）；Driver / Lume / SDK / CLI / Bench 等為 MIT；部分選配元件為 AGPL。
- GitHub（頁面讀取）：Issues 頁顯示 782 個 open issues（2026-11-09），多筆今日新開；Releases 頁最新為 nightly 2026-11-09 與 cua SDK 0.17.0；星數約 32k、forks 約 2.4k（僅 snippet，未讀到原頁，見第六節）。

---

## 二、逐家逐題發現

### A. Orgo

**1. 定位與層級**
- 官方（docs.orgo.ai/introduction.md）："Not an AI agent. Orgo provides the computer, not the agent. Bring Claude Computer Use, OpenAI's CUA, Hermes Agent, OpenClaw, or your own loop."
- 同頁："Not a browser. ... Orgo gives it a full computer." 也寫 "Not a general cloud platform. Orgo runs one thing: persistent computers for AI agents."
- 附加：OpenAI 相容端點 `POST /api/v1/chat/completions`，省略 model 時跑 `orgo-agent`（Computer Use）；方案含 AI & Platform credit（Starter $5 / Growth $10 / Scale $50），AI 以供應商牌價 +10% 計（billing.md）。
- 首頁（orgo.ai）："Secure, always-on Linux, Windows and Mac computers... Used by 1,000+ teams."（廠商自述）

**2. 規格與 OS**（docs.orgo.ai/guides/instance-types.md，read）
- 尺寸表：Small 0.5 vCPU/4 GB/20 GB（僅 API）、Medium 2/8/40、Large 4/16/80、XL 6/32/150、2XL 8/64/300。"On your own, one computer goes up to XL: 6 vCPU and 32 GB RAM. ... No computer goes above 8 vCPU, 64 GB RAM, or 300 GB of disk, on any plan."
- 可調：「Resize CPU, memory, and storage in place」（首頁）；API `PATCH /computers/{id}/resize`。
- OS 列舉：`linux`（預設）、`windows`、`macos`、`android`、`ios`（實體 iPhone，非 VM）。macOS 固定 10 GB RAM。
- 計畫 pool：Starter 2 vCPU/8 GB、Growth 8/32、Scale 36/128；一帳號付費方案最多 50 台，超過靠 credit 按小時最多 999。
- 解析度預設 1280x720x24（Linux）。
- 首頁：「Linux on every plan, Windows on Scale or as an add-on, plus Mac and iPhone.」FAQ：「Mac (from $100 a month) and iPhone (from $65 a month) are yours to get while they're in stock.」Hypertools（第三方）寫「Mac access is in closed beta」。

**3. 價格**（讀自 https://www.orgo.ai/ 完整頁、docs billing.md、pricing.md；訪問 2026-11-09）
| 方案 | 月繳 | 年繳 | 含 |
|---|---|---|---|
| Free | $0 | | 無 pool；$5 起始 credit（agent 註冊為 $2）跑 1 台 Medium 按小時 |
| Starter | $29 | $276 | 1 Medium（2 vCPU/8 GB），40 GB 儲存，Linux，$5 AI credit，社群支援 |
| Growth | $99 | $948 | 4 Medium，160 GB，$10 credit，優先支援 |
| Scale | $399 | $3,828 | 16 Medium，640 GB，Linux+Windows，自訂模板，$50 credit，25 隊友 |
| Enterprise | 洽談 | | 999+ 台，含 Mac |
- 首頁預設顯示年繳換算價（$23 / $79 / $319，"Save 20% with yearly billing"），月繳為 $29 / $99 / $399。
- 按小時：Medium $0.055/hr（月價 $32 × 1.25 ÷ 730）；Small $0.023、Large $0.11、XL $0.202、2XL $0.368；停機按磁碟 $0.0027/hr（Medium）。「Time is billed by the second, with no hourly minimum.」
- add-on：RAM $2.50/GB/月、vCPU $5/月、磁碟 $1/20 GB、Windows $15/台（Scale 內含；Medium 含 Windows 共 $47/月）。
- 對照條件：官方稱 always-on 方案較按小時划算，分界約每月 584 小時（約每天 19 小時）。
- AI 另計；稅另計（Estimate 區註明）。
- Orgo FAQ 的舊價格文字仍是 $29 / $99 / $399（月繳），與 pricing 區一致。

**4. 持久化**（instance-types.md、quickstart.md、computer-ends.md）
- 「A computer's disk and files persist across stop/start. Stopping a computer archives its disk. ... In-memory state and running processes are not preserved.」「If it lands on another host, its IP can change.」
- 閒置：**Sleep when idle**（Never / 15 min / 30 min / 1 h / 2 h / 4 h；`auto_stop_minutes`）；「Sleep keeps memory and running processes.」
- 最大存活：預設跑到你停；可設 End（1–720 小時，到期**刪除整台含磁碟**，不可復原）；可 extend 至距今 2160 小時。
- 免費帳號：hourly 電腦 credit 用完就停，檔案保留 7 天。
- 備份：每日備份，保留 7 天（migrations/overview.md）。
- 取消方案：電腦會 pause；Mac/iPhone 硬體另計一個月最低。

**5. 整合**
- MCP：遠端 OAuth（PKCE，1 小時 access token）`https://www.orgo.ai/mcp`，或本機 `npx -y orgo-mcp-server`（API key）。OAuth 範圍有限，不含模板、建立 workspace、suspend/resume、取得 VNC 密碼等；要用 API key。Claude Code：`claude mcp add --transport http orgo https://www.orgo.ai/mcp`；Codex、Cursor、VS Code、Claude Desktop 皆有設定範例。
- SDK：Python、TypeScript（`orgo@1`）、REST、CLI（`npx -y orgo@latest init`）。VNC（`/computers/{id}/vnc-password`）、SSH（`orgo ssh` 走 WebSocket，hypertools 提醒它不等於公開 SSH）、可嵌入 live view。
- 可接 coding agent：Claude Code、Codex、Hermes、OpenClaw，官方有模板與 Claude Code skill。

**6. 開源 / 自架 / 授權**
- 官方未見開源或自架說明；docs 與 MCP server（`orgo-mcp-server`）為 npm 套件。授權細節未查，歸入第六節 ✉️。

**7. 限制與反證**
- 官方承認：電腦「no public inbound hostname」，gateway 須用 outbound 模式（Slack Socket Mode、Telegram long polling），webhook 打不進來；「Orgo computers do not run systemd」；tmux 內的 gateway 重啟後不在（openclaw.md）。
- 容量模型：行程與記憶體在 stop 後消失；停機電腦仍占用 pool 的 vCPU/RAM 直到刪除（account-limits.md："A computer holds its vCPU and RAM from the pool until you delete it, whether it is running, stopped or asleep"）。
- Starter 的 pool 只裝得下 1 台 Medium；Large 在空的 Starter 會被拒（`RAM_ADDON`）。
- 發佈/建置模板需要 Scale 或 Enterprise。
- 第三方：Hypertools（有聯盟連結）列出：託管不含無限模型用量、Windows 要 Scale、Mac 在 closed beta、記憶體不保留、網路與一般 VPS 不同。Molted、Sandbox0 為競品比較頁（利益相關）。aifounderkit 該篇描述 "free tier / usage-based Pro / execution minutes" 與官方定價模型不符，且提到 "As of February 2025"，可信度低，不採用。
- Reddit r/aiagents 該串僅 4 則留言、無實質使用者回報；另一串是 Solana 同名代幣文，與本產品無關。
- 官網首頁「From the community」皆為推文（含 Elon Musk 一句 "Cool"、Grok 回覆），屬廠商挑選的證言。
- 沒找到任何 GitHub issue 形式的負評（Orgo 沒有公開核心 repo）。⚪ 見第六節。

### B. Cua

**1. 定位與層級**
- 首頁（cua.ai，read）："Cua Spaces runs on hardware you own, nothing rented. Open-source Cua Driver and Lume included."；FAQ："Does Cua host or rent the computers? No."
- docs（cua-cloud-ended.md，read）："Cua Cloud and Fleets ended on 18 October 2026. The Fleets pages have been removed."；"Fleet pool names, claim TTLs and warm-replica settings have no replacement."
- README："Bring your own agent and model... Cua provides the computer and automation tools."；SDK 無 agent 層；`cua-agent`、`cuabot` 已棄用（cuabot 官方警告 "known security issues. Do not run it."）。
- 層級：Spaces（桌面共享 app）＋ Driver（讓 agent 操作原生 app）＋ SDK/CLI（沙盒）＋ Lume（macOS VM）＋ Bench。不附 agent。

**2. 規格與 OS**
- Driver（platform-support.md）：macOS（AppKit/Accessibility）、Windows（Win32/UIA）皆 Supported；Linux X11 Supported with toolkit limits；Wayland Sway/GNOME/niri with limits，KDE、Hyprland/Omarchy Experimental。
- Spaces 三種 kind（space-kinds.md）：container（gVisor/runc）、vm（QEMU；macOS 用 Lume）、microvm（vz / containerization / Firecracker）。Windows/macOS 要 VM，Linux 容器最快。
- Spaces app：macOS 26+（Apple silicon 才能跑 macOS Space）；Linux Ubuntu 24.04、Windows preview 為 aiagentslist 整理，我以首頁「Windows is a preview」交叉確認。
- 自己的雲（your-cloud.md，read）：AWS / GCP / Azure / Hetzner / Modal，只有 Linux；「Windows and Omarchy are not offered yet」「macOS is not offered」；「An account holds at most 32 machines」；Hetzner 只有容器，新專案約 5 個 IPv4 額度。
- 規格不固定：看你選的機器（預設 `linux` 映像在 AWS 為 t4g.medium = 2 vCPU/4 GB）；本機 VM 可 resize CPU/記憶體/磁碟（reference/spaces/resize 在 llms.txt 目錄，未逐頁讀 → partial）。

**3. 價格**（cua.ai/pricing、cua.ai 首頁，read；訪問 2026-11-09）
| 方案 | 價格 | 含 |
|---|---|---|
| Free | $0，免帳號可開始 | 每台連上的電腦可開 Space；Teleport；與指名者分享；2 台同時使用、每月 20 遠端小時（經 relay） |
| Pro | 年繳 $180（$15/月）；月繳 $18 | 5 台同時、200 遠端小時；到期分享連結、90 天稽核「Coming soon」 |
| Teams | 年繳 $300/seat（$25/月）；月繳 $30，1–100 seats | 每 seat +5 台、+200 小時共用池；共用團隊電腦、角色、裝置核准；SSO/稽核匯出尚未 |
- 計量：只算經 relay 的「遠端」使用，自己機器本機使用免費；超額「nothing is cut off」只提示升級。無試用；年繳 14 天內可全額退款。
- 不一致：首頁 FAQ 與 GitHub README 寫「Pro is $18 a month, Teams $30」（月繳），pricing 頁同時列 $15 / $25（年繳換算），兩者並存、不矛盾但容易誤讀。
- 舊版雲端計價（Fleet：$0.044625/vCPU-hr + $0.0223125/GiB-hr）只見於 Simular 稿；Cua 官方該頁已移除 [我沒有讀到官方舊價頁，數字來自第三方，標為未驗證]。aiagentslist（讀）亦稱 Cloud/Fleets "previously billed per vCPU-hour and GiB-hour"。

**4. 持久化**
- 本機沙盒：「Local sandboxes run until you delete them.」（lifecycle.md）；可 suspend/resume（僅本機）。「Disconnecting never stops a sandbox.」
- 自己的雲：預設每台 8 小時 TTL，到期自毀並由 sweep 清理；`--ttl-hours 0` 不限；Modal 最長 24 小時、不能 stop/start；Hetzner 到期只關機仍計費，直到 sweep 刪除；AWS/GCP 的 `stop` 保留磁碟，只收磁碟費。
- 跨 Space 持久：Cua Volume（每帳號一個版本化磁碟，agent 記憶與輸出在 Space 之外存活）— 僅讀 llms.txt 描述，未讀頁面本體（partial）。
- 舊 Fleet 的 15 分鐘 claim TTL / 無 suspend 已隨產品終止。

**5. 整合**
- MCP：`cua daemon mcp`，「33 Spaces tools plus sandbox and computer tools」；可 `--permissions spaces:readonly`。Driver 另有獨立 MCP stdio server。
- 官網 FAQ："Claude Code, Codex, Cursor, Gemini CLI, Cline, Kiro and OpenClaw connect through the Cua MCP server."；Driver 文件另列 Hermes 等。
- SDK：Python（`pip install cua`）、TypeScript（`@trycua/cua`）、Rust；"Swift and Kotlin bindings are not yet released."
- CLI：`cua sb create/exec/screenshot`、`cua spaces ...`。
- 即時觀看：Spaces 串流（QUIC，本機網路直連）；多游標（人與 agent 各自一個）；iPhone/iPad 可看。E2B / Daytona / Modal 官方 SDK 可指向 Cua（sandbox-sdks，僅目錄描述）。
- 資安：現行版預設 WireGuard mesh E2E；瀏覽器 viewer、分享連結、舊版與 fallback 走 relay HTTPS 路徑，relay 可讀明文（relay-security.md，read）。

**6. 開源 / 自架 / 授權 / GitHub**
- 授權（README，read）：「Everything outside Cua Spaces and Cua Driver Bench is MIT-licensed」；Spaces、cua-spacesd、Keyvault、teleport、Cua Volume 為 FSL-1.1-MIT，「no competing hosted service... each release becomes MIT two years after it ships」；Driver Bench 2026-10-11 起改 FSL（先前 MIT）；`cua-som` AGPL-3.0-or-later；`cua-perception` 擴充含 AGPL-3.0-only 元件。
- 自架：relay 可自架（`cua-relay`），亦可用自己的 Tailscale/Headscale。
- Stars / forks / issues：搜尋 snippet「32k stars、2.4k forks、773 issues、606 PRs」（github.com/orgs/trycua/repositories 搜尋摘要，**只是 snippet**）。我讀過的 Issues 頁（read）顯示 "782 results"（open）。Skillsllm snippet 31,916 stars。Simular 稿寫 29k。
- 最近 commit / release（Releases 頁 read）：2026-11-09 有 nightly cua-driver-rs 0.45.2、cua SDK 0.17.0、cua-driver-rs 0.44.0（標 pre-release 僅為 monorepo 的 Latest 指標，官方說明為穩定版）、cua-spacesd 0.12.7；Commits 頁可見 bot 與人類混合提交，多為 Claude 共同署名。專案極度活躍。
- Issues 概況：2026-11-07 至 11-09 每日新增多筆；可見例子：#6214「Windows shown as This Mac/macOS in Spaces UI」（Brave snippet）、Oct 26 有標 `bug`、`flaky` 的 issues（snippet）。Issues 頁標題被抽取器移除，我未能逐筆讀標題 → partial。

**7. 限制與反證**
- 官方承認：Cloud 結束；Spaces 需 macOS 26；一台 Mac 最多 2 個 macOS Space（Apple 授權）；Hetzner 要容器；AWS 新帳號 vCPU 配額可能很低且 `cua cloud test aws` 不會預先讀取；Linux driver 依 toolkit/compositor；teleport 後任何人控制目的 Space 即擁有登入狀態；telemetry 預設開啟。
- aiagentslist（第三方編輯稿，聯盟/商業性質未確認）的 "Not ideal for" 與限制列表：不適合要 Cua 代管機器者、要全部元件寬鬆授權者；Chrome 已存密碼經 teleport 尚無法在 Space 解密。
- 官方警告 `cuabot` 有已知資安問題。
- Daytona 例外：這是 Simular 稿對 Daytona 的說明，與 Cua 無關。
- 未找到獨立的負評部落格或 HN 串（我只跑了 2 輪搜尋，詳見第六節）。

---

## 三、讀取完整度盤點表

| 來源 | 讀取程度 | 備註 |
|---|---|---|
| https://www.orgo.ai/ （extract=full） | read（約 319 KB 原頁，未截斷） | 含價格區、FAQ 區 |
| https://www.orgo.ai/pricing | read | 重導至 /#pricing，第一次抽取遺失價格；改用 extract=full 取得 |
| https://www.orgo.ai/faq | read | |
| https://docs.orgo.ai/introduction.md | read | |
| https://docs.orgo.ai/llms.txt | read | 文件目錄 |
| https://docs.orgo.ai/quickstart.md | read | |
| https://docs.orgo.ai/guides/instance-types.md | read | |
| https://docs.orgo.ai/guides/pricing.md | read | |
| https://docs.orgo.ai/guides/billing.md | read | |
| https://docs.orgo.ai/guides/account-limits.md | partial | 工具輸出過大被存檔，我讀了約前 9,000 字（限制表、add-on、每帳號台數），後段 rate limit 未讀 |
| https://docs.orgo.ai/guides/computer-ends.md | read | |
| https://docs.orgo.ai/guides/mcp.md | read | |
| https://docs.orgo.ai/guides/openclaw.md | read | |
| https://docs.orgo.ai/guides/migrations/overview.md | read | |
| hypertools.so/tool/orgo | read | 含聯盟連結，利益相關 |
| aifounderkit.com / molted.net / sandbox0.ai / DavidGeeraerts/AI#12 / bitrue / kryptoadvantage | snippet | 搜尋摘要，不進結論 |
| Reddit r/aiagents/comments/1q8ewu0 | snippet | |
| https://cua.ai/ | read（未截斷） | 首頁為 Cua Spaces |
| https://cua.ai/pricing | read | |
| https://cua.ai/docs/llms.txt | read | 文件全目錄 |
| cua.ai/docs/cua-sdk/guides/cua-cloud-ended.md | read | 關鍵證據 |
| cua.ai/docs/spaces/guides/bring-your-own-compute.md | read | |
| cua.ai/docs/cua-sdk/guides/lifecycle.md | read | |
| cua.ai/docs/spaces/guides/connect-your-agent.md | read | |
| cua.ai/docs/spaces/concepts/space-kinds.md | read | |
| cua.ai/docs/cua-sdk/guides/your-cloud.md | read | |
| cua.ai/docs/cua-driver/concepts/platform-support.md | read | |
| cua.ai/docs/spaces/guides/relay-security.md | read | |
| https://github.com/trycua/cua（README） | read（經 Groundlane 與 jina 兩次） | 無 stars 數 |
| github.com/trycua/cua/releases | read（首頁截取一段） | 最新數個 release；未翻頁 |
| github.com/trycua/cua/commits/main | partial | 作者名與日期被抽取器移除，僅知有 bot 與人類提交 |
| github.com/trycua/cua/issues?q=...open | partial | 只拿到編號與日期，標題被移除；總數 782 |
| aiagentslist.io/agents/cua | read | 第三方編輯稿；其中資訊與官方 docs 交叉確認多數 |
| Simular 比較文 | read（未截斷，約 173 KB） | 廠商自述，利益相關 |
| 搜尋結果：GitHub org repo 列表、skillsllm.com | snippet | 星數／forks 數只來自 snippet |
| cua.ai/docs/spaces/guides/teams、troubleshoot、agents-in-a-space、cua-volume、sandbox-sdks、docs/lume 等 | abstract | 僅讀 llms.txt 中的一句描述，未讀頁面 |

---

## 四、反證與風險

**對使用者決策最重要的一點**：Simular 比較文把「Cua Fleet」當成現存的雲端桌面產品，但 Cua 官方文件寫 Cloud 與 Fleets 已於 2026-10-18 結束。拿 Cua 當「雲端桌面」比較對象時，現在只剩「自己出機器」的 BYO 方案。Simular 稿 metadata 的發佈時間為 2026-11-09，而稿內自稱數據讀於 10 Oct 2026。我無法確認稿件何時實際更新，故只能說：此稿在 Cua Cloud 結束後仍列 Fleet，內容已過時（未更新日期說明）。

Orgo 風險：
1. 停機不保存記憶體/行程；stop 後 IP 可能變；無公開入站 hostname；無 systemd。
2. 計費模型：方案以 pool 計，停機電腦仍占 pool；按小時比方案貴 25%；AI 另計 +10%；Windows 不可按小時。
3. 閉源，供應商鎖定；沒有自架選項（官方資料沒有，我也沒找到）。
4. 第三方評價幾乎全正面且多為聯盟/推文，缺乏獨立長期使用負評；不能把「沒負評」當成「沒問題」。
5. 價格與規格近期變動頻繁（Starter 從 "8GB/40GB" 改為 "1 Medium"；歷史方案如 hacker/developer/team 仍存在於 plans no longer sold），引用前須重查。

Cua 風險：
1. 沒有託管雲端：「免費雲端 Linux 桌面」這個需求 Cua 現在無法直接滿足，必須自備機器或雲帳號並自付雲費；AWS 帳號要自行建 CloudFormation stack 授權。
2. 產品方向在 2026-10 大幅轉向（Spaces 在 2026-10-01 首發、Cloud 10-18 結束、多個套件棄用），API 與文件穩定性風險高；GitHub 當天仍有大量新 issue 與 nightly。
3. Spaces 是 FSL，不是 OSI 開源；Driver Bench 也在 2026-10-11 由 MIT 改 FSL。
4. 安全：relay 在 HTTPS 路徑可讀明文；teleport 把登入狀態搬到 Space；官方警告 cuabot 有已知安全問題。
5. 操作門檻高：需要 macOS 26 或自備 Linux + Docker、自己接 agent 與模型。

---

## 五、與 Simular 比較文不一致處（Simular 稿為廠商自述，利益相關；以下為對照官方頁的結果）

| # | Simular 稿所述 | 官方／讀到的原頁 | 判定 |
|---|---|---|---|
| 1 | Cua Fleet 為現行 Layer 2 雲端桌面，$0.044625/vCPU-hr + $0.0223125/GiB-hr（約 $0.178/hr）、gVisor 容器或 KubeVirt VM、15 分鐘 claim TTL、無 suspend | cua-cloud-ended.md：Cloud 與 Fleets 2026-10-18 結束；cloud 價格、TTL、pool 無替代 | 不一致（過時）。我無法在官方頁驗證舊價格數字本身，只能確認產品已停 |
| 2 | Cua「Linux in the cloud (amd64)」 | 無託管雲；只有自己雲帳號、Linux 容器 | 不一致 |
| 3 | Cua「Free cloud credits not published」 | 沒有雲，不適用 | 前提不成立 |
| 4 | Cua「SDK in Python, TypeScript, Swift and Kotlin」 | README：Swift 與 Kotlin bindings "not yet released"；目前 Python / TS / Rust | 部分不一致 |
| 5 | Cua「29k GitHub stars」 | 搜尋 snippet 約 31.9k–32k（無原頁） | 小差異，可能為時間差，無法判定 |
| 6 | Cua「cua-agent deprecated」「MIT」 | 官方確認 cua-agent 棄用；MIT 對 Driver/SDK 等成立，但 Spaces 與 Driver Bench 為 FSL | 部分一致；漏寫 FSL |
| 7 | Orgo「Stopped computers still occupy a plan slot; **no per-hour or free tier**」 | docs：按小時 Medium $0.055/hr 計秒；免費帳號有 $5 起始 credit 可跑 1 台 Medium；停機佔 pool 屬實 | 前半一致，後半不一致 |
| 8 | Orgo「Starter $29 / Growth $99 / Scale $399；Windows on Scale or add-on；extra computers $25 each」 | 月繳價一致；add-on 官方為 RAM/vCPU/磁碟分項（整台 Medium $32、Windows +$15），未見「$25 each」這個標價 | 價格主體一致；「$25 each」我沒能在官方頁找到出處 |
| 9 | Orgo「Mac on Enterprise」 | 首頁 Enterprise 列含 Mac；FAQ 稱 Mac 從 $100/月、缺貨即無；docs 稱 app 內 Get one 依庫存 | 部分一致 |
| 10 | Orgo「Hypervisor and vCPU counts are not published」 | vCPU 數公開（2/8/36 pool；每台 0.5–8）；hypervisor 我沒找到 | vCPU 部分不一致 |
| 11 | Orgo「Runs until stopped; disk persists」 | 一致，但漏寫 Sleep when idle 選項（保留記憶體）與 End（到期刪除） | 一致但不完整 |
| 12 | Orgo「$5 monthly AI credit」「MCP server, SDKs, VNC」 | 一致 | 一致 |
| 13 | Simular 把「Orgo is the simplest persistent Linux desktop」列為 Layer 2 | 官方自稱「persistent computers」，Windows/Mac 也提供 | 判斷屬行銷措辭，不是事實衝突 |

另：Simular 稿把 box by Simular 排第一、自稱 "Nothing here is sponsored" 但同時是自家產品，利益相關。

---

## 六、⚪／✉️ 清單

✅ 已找到並讀過：Orgo 價格、規格、持久化、MCP、限制；Cua 價格、終止公告、授權、持久化、MCP、BYO 雲限制。

⚪ 整條鏈都試過仍無公開資料：
- Cua 的 GitHub 精確 stars／forks／最後 commit 時間／open PR 數。已試：Groundlane web_fetch github.com/trycua/cua（頁面抽取無計數）；Groundlane web_extract（selector 欄位全為 null；pattern 引擎拒絕我的 regex）；`gh api repos/trycua/cua`（403 "GitHub access ... not enabled for this session"）；`curl api.github.com/repos/trycua/cua`（同 403）；`curl img.shields.io/github/stars/trycua/cua.json`（proxy CONNECT 403）；firecrawl_scrape query 格式（"The information is not on the page."）；jina read_url（回全文無計數）；add_repo 回應只允許 git clone，不含 API。未 clone（避免大型 repo 長時間下載，且 clone 也取不到 stars）。已有的數字（約 32k stars / 2.4k forks / 773 issues / 606 PRs）只來自搜尋 snippet，不得當作原頁讀取結論；782 open issues 來自 Issues 頁，為 read。
- Cua GitHub issues 的實際常見問題分類。已試：Groundlane web_fetch issues 頁（標題被抽取器移除，僅得編號與日期）；web_search domains github.com（只回 2 筆 snippet）。結果為 partial，沒做逐筆讀取。
- Orgo 的獨立使用者負評／事故報告。已試：Groundlane web_search 兩輪（complaints/limitations 與 reddit experience/alternative）→ 結果為廠商稿、聯盟稿、競品比較頁與一個與本產品無關的代幣串；Reddit 該串僅 snippet。未見 status.orgo.ai 或 changelog 頁（未取讀）。
- Orgo 的 hypervisor 種類與 VM 隔離技術：docs 的頁面中未寫；未讀 trust.orgo.ai。

✉️ 只能寫信問：
- Orgo 是否有自架或授權方案、資料所在地區、SLA 細節（Enterprise 才有 "SLA by contract"）：contact@orgo.ai。
- Orgo Mac／iPhone 的實際庫存與規格：app 內 Get one 才看得到。
- Cua Spaces 的 FSL 例外授權或商業授權：legal/COMMERCIAL.md 指向商用洽談。

⚪ 未取讀（頁面存在但我沒讀）：Orgo changelog、status、trust center、terms；Cua docs 的 troubleshoot、teams、cua-volume、sandbox-sdks、cua-ci 頁、Spaces 的 add-a-computer 頁，以及 Cua 部落格。這些列為 abstract，若要做定論需要補讀。
