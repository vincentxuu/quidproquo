# Research note：自架常駐個人 agent 橫向對照

Date: 2026-08-18
Status: 材料齊，可發文
Target: post skill / tech-deep-dive / category `ai`

---

## 0. 研究子問題

1. 這個類別（自架常駐個人 agent）的共同架構是什麼？OpenClaw 與 Hermes 各佔什麼位置？
2. 每個專案的一手事實：語言、授權、時間、規模、頻道、沙箱、記憶。
3. 設計分歧軸是什麼？為什麼會分裂成這麼多個？
4. 安全面：這類 agent 的真實風險、已公開事件與數據。
5. 選型：什麼情境選什麼。

---

## 1. 核心論點（文章骨幹）

**這不是九個競品，是同一個安全問題的九種答案。**

OpenClaw 在 2026-01 爆紅時建立了一個模式：一個常駐 gateway，把聊天頻道、LLM provider、工具、skills 接在一起，跑在你自己的機器上。這個模式立刻撞上一個結構性問題——它同時滿足 lethal trifecta 的三個條件（吃不可信輸入、有敏感資料存取、能對外通訊），而且預設跑在 host 上。

接下來半年出現的每一個「Claw」，本質上都是在回答同一題：**agent 的執行邊界該畫在哪裡？** 而它們給出的答案彼此不相容：

| 答案 | 代表 | 代價 |
|---|---|---|
| 應用層權限檢查就夠 | OpenClaw | 檢查邏輯本身成為攻擊面 |
| 每個 agent 一個 container | NanoClaw | 需要 Docker，資源翻倍 |
| 用型別系統與 Rust 縮小可信基底 | Moltis / IronClaw / ZeroClaw | 生態小、功能落後 |
| WASM capability sandbox | IronClaw / LibreFang | 工具相容性受限 |
| 整包丟到 serverless sandbox | Moltworker | 碰不到本機＝也用不到本機 |
| 讓 agent 小到能人工審完 | NanoClaw / PicoClaw | 功能面砍掉大半 |
| 記憶與學習優先，安全靠模型層 | Hermes | 記憶本身變成延遲執行的注入載體 |

第二個論點：**star 數與實際用量已經脫鉤**。OpenClaw star 是 Hermes 的 1.66 倍，但 OpenRouter 上 Hermes 的日 token 量在 2026-05 反超，全時累計也在 5 月底翻盤。星星量的是好奇心，token 量的是工作量。

---

## 2. 事實交叉表

### 2.1 repo 硬事實（`gh api`，2026-08-18 抓取）

| 專案 | ★ | fork | 語言 | 授權 | repo 建立 | 最後 push | 驗證 |
|---|---|---|---|---|---|---|---|
| openclaw/openclaw | 386,596 | 81,238 | TypeScript | NOASSERTION | 2025-11-24 | 2026-08-18 | ✅ GitHub API |
| NousResearch/hermes-agent | 232,194 | 46,268 | Python | MIT | 2025-07-22 | 2026-08-18 | ✅ GitHub API |
| zeroclaw-labs/zeroclaw | 32,610 | 4,897 | Rust | Apache-2.0 | 2026-02-13 | 2026-08-18 | ✅ GitHub API |
| nanocoai/nanoclaw | 30,537 | 12,853 | TypeScript | MIT | 2026-01-31 | 2026-08-17 | ✅ GitHub API |
| sipeed/picoclaw | 29,869 | 4,446 | Go | MIT | 2026-02-04 | 2026-08-14 | ✅ GitHub API |
| nearai/ironclaw | 12,606 | 1,490 | Rust | Apache-2.0 | 2026-02-03 | 2026-08-18 | ✅ GitHub API |
| cloudflare/moltworker | 9,946 | 1,741 | TypeScript | Apache-2.0 | 2026-01-27 | **2026-05-09** | ✅ GitHub API |
| moltis-org/moltis | 2,824 | 336 | Rust | MIT | 2026-01-29 | 2026-08-18 | ✅ GitHub API |
| librefang/librefang | 359 | 71 | Rust | MIT | 2026-03-12 | 2026-08-18 | ✅ GitHub API |

⚠️ **Moltworker 已三個多月沒 push**（2026-05-09），寫文時必須標。其餘八個都在一週內有動靜。

⚠️ **Hermes repo 建立日 2025-07-22 早於產品發布日 2026-02-25**——repo 先於產品存在（Nous 的 Hermes 模型線在先）。不要寫成「2026 年 2 月建立 repo」。

### 2.2 關鍵事實與驗證狀態

| 事實 | 狀態 | 來源 |
|---|---|---|
| OpenClaw 前身 Clawdbot → Moltbot → OpenClaw，作者 Peter Steinberger（奧地利），2025-11 起 | ✅ | TechCrunch、CNBC、Conscia、作者本人 blog |
| Steinberger 2026-02-15 加入 OpenAI，OpenClaw 轉入獨立 foundation，OpenAI 贊助 | ✅ 三源 | Altman X 貼文、CNBC、TechCrunch、steipete.me 本人 |
| Hermes Agent 由 Nous Research 於 2026-02-25 發布，MIT | ✅ 一手 | nousresearch.com/releases（官方發布頁）、多篇二手 |
| Hermes 2026-05-06 登上 OpenRouter 全站 app 排行第一 | ✅ | explainx（引 Nous 公告）、marktechpost、OpenRouter 官方 blog |
| OpenRouter 日 token：2026-05-10 Hermes 224B vs OpenClaw 186B | ✅ | marktechpost（附圖表，標明 OpenRouter 為來源） |
| OpenRouter 日 token：2026-06-06 Hermes 669B vs OpenClaw 160B（Kilo Code 175B 居中） | ⚠️ 單源 | pro.stockalarm.io，標明取自 OpenRouter rankings |
| 全時累計 2026-05 下旬翻盤：Hermes 8.14T vs OpenClaw 7.18T | ✅ 兩源 | glukhov.org、contextstudios（同引 glukhov） |
| CVE-2026-25253：one-click RCE，CVSS 8.8，成因為 Control UI 未驗證 WebSocket origin（cross-site WebSocket hijacking），2026-01-30 於 2026.1.29 修補，2026-02-03 公開 | ✅ 四源一致 | reco.ai、conscia、DigitalOcean、flutteris；發現者 Mav Levin / DepthFirst |
| ❌ 衝突：innfactory 稱 CVE-2026-25253 是 skill loader path traversal、CVSS 9.1、修於 v0.3.3 | ❌ 不採用 | 與四個來源矛盾，且 OpenClaw 用日期式版號（2026.1.29）不是 v0.3.3。判定該來源不可靠 |
| Snyk ToxicSkills（2026-02-05 資料）：掃 3,984 個 skill，36.82%（1,467）至少一個安全瑕疵，13.4%（534）critical，76 個確認惡意 payload，91% 惡意 skill 同時混用 prompt injection 與傳統惡意程式 | ✅ 一手 | snyk.io 官方 blog；CSA、obot.ai、penligent 轉述數字一致 |
| Koi Security 2026-02-01 審 ClawHub 2,857 個 skill，341 個惡意（11.9%），其中 335 屬同一波 ClawHavoc campaign | ✅ 兩源 | termdock（引 Oren Yomtov 原始審計）、SkillSieve arXiv 論文引用 |
| ClawHavoc：協同供應鏈投毒，Antiy CERT 命名 Trojan/OpenClaw.PolySkill | ⚠️ 二手 | cyberdesserts、obot.ai（稱 1,184 個 skill，與 Koi 的 335 不同口徑，可能統計期間不同） |
| ❌ **歸屬錯誤（已更正）**：原記為「Cisco 分析 31,132 個 skill，26% 有漏洞」——Cisco 只是在自家 blog **引用**這個數字，原始研究是 **Liu et al.（liu2026agentskillswild）**：31,132 個 skill 取自 42,447 個語料，漏洞率 26.1% | ✅ 已釐清 | Cisco 官方 blog「Personal AI Agents like OpenClaw Are a Security Nightmare」明寫 "Recent research on skills vulnerabilities (26% of 31,000 agent skills analyzed...)"；SkillSieve arXiv 2604.06550 引用 liu2026agentskillswild。**此數字未進文章，無已發布錯誤** |
| ClawHavoc 規模的兩個口徑不是矛盾，是不同時點與範圍 | ✅ 兩邊皆一手 | Koi Security（koi.ai，2026-02-01）：稽核當時全部 2,857 個，341 惡意 / 335 屬同一 campaign。Antiy CERT（antiy.net，截至 2026-02-05）：**歷史上**曾出現 1,184 個惡意 skill 包，歸屬 12 個作者 ID，`hightower6eu` 一人 677 個；清理後平台剩 3,498 個。2026-02-16 重掃為 824 個（registry 已膨脹到 10,700+） |
| Trail of Bits「The sorry state of skill distribution」（2026-06-03，作者 Samuel Judson / Tjaden Hess）：繞過 ClawHub 偵測器（含 VirusTotal）、Cisco skill-scanner、skills.sh 三家（Gen/Socket/Snyk）全部。四個惡意 skill 有三個開發不到一小時。PoC repo `trailofbits/overtly-malicious-skills` | ✅ 一手 | blog.trailofbits.com。可引原文："No amount of scanning or LLM analysis can reliably detect malicious content in agent skills." 手法：塞 10 萬換行讓掃描器截斷；`.pyc` bytecode 與原始碼不一致（xz-utils 式） |
| 0.12% 共識率的**反面**：96% 被 flag 的 skill 實為正當；納入 repository 上下文後真正可疑者從數千掉到 15 例（原始 flag 量的 0.52%）；另發現 121 個 skill 可被 repo hijacking 接管 | ✅ 同一份研究 | 238,180 skill 研究（Linz ITU + 維也納大學），經 Cisco Skill Scanner 作者 Vineeth Sai 轉述確認。**教訓：我原本只引對自己論點有利的那一半** |
| 七個 skill scanner 交叉比對：對 238,180 個 skill，flag 率從 3.8%（Socket）到 41.9%（OpenClaw Scanner）；被至少一個 scanner flag 的 8,402 個中，72% 只被一個 scanner flag；五個 scanner 都覆蓋的 Skills.sh 上只對 27,111 個中的 33 個（0.12%）達成共識 | ⚠️ 單源但方法透明 | theweatherreport.ai。**這是本文最有價值的反直覺數據**：掃描器彼此不同意 |
| ❌ 衝突：對外曝露實例數 — SecurityScorecard 135,000（2026-02）／Shodan 42,000 且 63% 未開 gateway 認證（時點不明）／Censys 63,070（2026-03 下旬） | ❌ 並列不選邊 | cyberdesserts、hackernoon、betterclaw。數字差異來自掃描器、方法與時點，寫文時三個都列 |
| CNCERT（中國）2026-03 發布 OpenClaw 風險警示，理由是「預設安全設定本身就弱」＋高權限 | ✅ | The Hacker News、Global Times、joylarkin/openclaw-security-news |
| 香港政府 2026-03-13 禁止公務員安裝 OpenClaw | ⚠️ 二手 | SCMP（經 joylarkin/openclaw-security-news 索引） |
| 學術：arXiv 2603.12644（Zonghao Ying et al., 2026-03-13）提出三層風險分類（AI 認知／軟體執行／資訊系統）與 FASA 全生命週期防禦架構 | ✅ 一手 | arXiv abstract 原文，18 次引用 |
| ❌ 不採用：hackernoon 稱 OpenClaw「63 天累積 138 個 CVE，7 個 critical」 | ❌ 仍無第二來源 | **第二輪補查**：改用可查證替代——cyberdesserts 2026-04 盤點「60+ CVEs and GHSAs disclosed across multiple waves」；OpenCVE 有 openclaw 廠商頁，條目排到 2026-07。無權威單一總數，文中改為引這兩者 |
| ✅ **更正人名**：失控刪信事件當事人是 **Summer Yue**（Meta Superintelligence Labs 對齊主管），不是 betterclaw 寫的「Naomi Yue」 | ✅ 五源 | TechCrunch（2026-02-23）、Business Insider、SF Standard（2026-02-25）、Kiteworks、vectara/awesome-agent-failures 案例庫。本人 X 帳號 @summeryue0，貼文 960 萬次瀏覽 |
| 事件根因：真實信箱資料量觸發 context compaction，「未經核准不要動作」的指令在壓縮摘要中被丟棄 | ✅ 一手（本人說法）＋多源轉述 | 她自述「Rookie mistake tbh. Turns out alignment researchers aren't immune to misalignment.」⚠️ TechCrunch 註明無法獨立查證信箱實況 |
| CVE-2026-32922（2026-03-29）：`device.token.rotate` 未約束新 token scope，`operator.pairing` → `operator.admin` → 全節點 RCE。CVSS 3.1 為 9.9、CVSS 4.0 為 9.4 | ✅ | ARMO 分析、blink.new 時間軸（列 GHSA-4jpw-hj22-2xmc，修於 2026.3.11） |
| Claw Chain（Cyera，2026-05-15）：四個可串連漏洞。CVE-2026-44112 CVSS 9.6，OpenShell 沙箱寫入路徑 TOCTOU race，可把寫入導出掛載根目錄外；CVE-2026-44115 CVSS 8.8，heredoc 內 shell 展開繞過 allowlist 洩漏環境變數；CVE-2026-44118 CVSS 7.8 MCP loopback 提權 | ✅ 兩源 | Cyera 原始公告、CSA labs 研究筆記。**論點價值：被打穿的是沙箱本身** |
| 曝露實例數再補兩筆：Cyera 2026-05 同時給 Shodan ~65,000 與 ZoomEye ~180,000 | ✅ 兩源 | Cyera、CSA。加上原本三筆，範圍是 42,000–180,000，差 4 倍以上 |

### 2.3 各專案定位（README／官網一手）

**OpenClaw** — 「a personal AI assistant that runs on your devices, designed for a single operator」。一個 Gateway 串起 models / tools / channels / companion apps。README 安全段自陳：「Treat inbound messages as untrusted input」「**Tools run on the host for the main session unless you configure sandboxing**」。沙箱是有的（`agents.defaults.sandbox`，mode `off`/`non-main`/`all`，backend docker/ssh，`workspaceAccess` 預設 `none`），但**主 session 預設仍在 host 上**——這是整個類別分裂的起點。官方 security 文件自己也承認模型層防禦不夠：「adaptive human attackers still break models that score well on static benchmarks, with published success rates above 80%」。

**Hermes Agent** — 「The agent that grows with you」。三個賣點：真 TUI、單一 gateway 覆蓋 Telegram/Discord/Slack/WhatsApp/Signal/CLI、**closed learning loop**（agent 自己策展記憶、複雜任務後自動生成 skill、skill 在使用中自我改進、FTS5 session 搜尋＋LLM 摘要做跨 session 回憶、Honcho dialectic 使用者建模）。相容 agentskills.io 開放標準。**有 `hermes claw migrate` 直接從 `~/.openclaw` 匯入 SOUL.md／記憶／skills／allowlist**——這是很強的敘事點：後進者把遷移路徑做成一等公民。

**NanoClaw** — 官網直接列對照表：132 個原始檔 vs OpenClaw 3,680；~17,500 行 vs 434,453 行；<10 個相依 vs 70；0 個設定檔 vs 53；「讀懂需要一個下午 vs 1–2 週」；安全模型「OS container isolation vs application-level checks」。架構：`messaging apps → host process (router) → inbound.db → container (Bun, Claude Agent SDK) → outbound.db → host process → messaging apps`，每個 session 兩個 SQLite 檔、各只有一個 writer。三層隔離模型（shared session／same agent separate sessions／完全分離的 agent group）。憑證走 OneCLI Agent Vault 在 request 時注入，**agent 永遠拿不到 raw API key**。
- 作者 Gavriel Cohen（前 Wix 工程師七年）與其兄 Lazer Cohen。2026-05 NanoCo 拿 $12M seed（Valley Capital Partners 領投，Docker、Vercel、monday.com、Slow Ventures、Hugging Face CEO Clem Delangue 參與），並回絕約 $20M 收購。✅ TechCrunch + VentureBeat 兩源
- ⚠️ 口徑差異：官網說 ~17,500 行，VentureBeat 說「核心邏輯約 500 行 TypeScript、資安團隊八分鐘可審完」——前者是整個 repo，後者是核心。寫文要分清楚。

**PicoClaw** — Sipeed 出品，Go 寫，**明確聲明不是任何專案的 fork**，靈感來自 NanoBot。README 自列對照：RAM OpenClaw >1GB / NanoBot >100MB / PicoClaw <10MB；0.8GHz 單核開機時間 >500s / >30s / <1s；硬體成本 Mac Mini $599 / ~$50 Linux 板 / **$10 起任何 Linux 板**。95% 核心程式由 Agent 生成、人工審核微調。
- ⚠️ README 自己補充：「Recent builds may use 10-20MB RAM」——<10MB 的宣稱已經被自己的合併 PR 打破。**這種自我修正很值得寫**。
- ⚠️ README 另有安全警語：「in early rapid development, may have unresolved security issues, do not deploy to production before v1.0」。

**ZeroClaw** — Rust 單一 binary。30+ channel、~20 個 provider、工具含 shell/browser/HTTP/hardware/MCP。架構分層：channels/gateway/ACP → runtime（agent loop / **security policy** / SOP engine）→ providers/tools/memory(SQLite+embeddings)。把 security policy 放進 runtime 核心三格之一，是刻意的架構表態。

**IronClaw**（nearai）— 自陳「a Rust reimplementation inspired by OpenClaw」，有 FEATURE_PARITY.md 追蹤矩陣。四個關鍵差異：Rust vs TypeScript（單一 binary、記憶體安全）、**WASM sandbox vs Docker**（輕量、capability-based）、**PostgreSQL vs SQLite**（production 級持久化）、security-first 多層防禦。另有 Docker sandbox（per-job token、orchestrator/worker）、heartbeat 主動背景執行、parallel jobs 隔離 context、self-repair。

**Moltworker**（Cloudflare 官方）— 把 OpenClaw 包進 Cloudflare Sandbox container 跑在 Workers 上，可選 R2 做持久化。**賣點正好是缺點**：完全碰不到你的本機。成本模型透明（CPU 按實際用量、記憶體與磁碟按 provisioned 時間計；設 `SANDBOX_SLEEP_AFTER` 讓 idle 睡著，一天跑 4 小時約 $5-6/月 compute + $5 方案費）。⚠️ 2026-05-09 後未更新。

**Moltis** — 作者 Fabien Penso（25 年資歷，Show HN 131 分）。Rust 59 crate workspace ~270K 行，**agent runner + model interface 只有 ~7.5K 行**（provider 再 ~19K）——刻意縮小可信基底以求可審計。unsafe 只出現在 FFI 與預編譯 runtime 邊界，不在 agent loop。加密 vault（XChaCha20-Poly1305 + Argon2id）、password/passkey/API key 認證、SSRF/CSWSH 防護、per-IP throttle、15 個 lifecycle hook（可 inspect/modify/block）＋circuit breaker、破壞性指令守衛、內建 skill/記憶變更前自動 checkpoint。沙箱 Docker/Podman/Apple Container/WASM。**也有 OpenClaw 匯入器**。
- Moltis 官方 comparison 頁很誠實地標了 snapshot commit 與日期（OpenClaw `90eb5b0` 2026-04-01、Hermes `9f22977` 2026-04-20、Moltis `5d044c6` 2026-04-22）並附免責。用 tokei 量：OpenClaw ~1.1M app LoC、Hermes ~152K、Moltis ~270K Rust。
- ⚠️ Show HN 時作者自稱「150k lines」，現在官網說 270K——四個月長了 80%。這本身是個資料點。

**LibreFang** — 「Libre Agent Operating System」，Rust 24 crate、2,100+ 測試、45 個 channel adapter、28 個 LLM provider、60 個內建 skill、WASM sandbox、taint tracking、Ed25519 簽章、OFP P2P 協定。⚠️ **自陳弱點很誠實**：「OFP wire is plaintext-by-design」，需要跑在 WireGuard/Tailscale/mTLS 之後。359 star，最早期。

### 2.4 生態尺度

- **clawclones.com** 這個第三方索引追蹤 **43 個** OpenClaw 替代品（2026-08-18 資料），中位安全分 75/100，其中 12 個「hardened」（security ≥85 且 shell risk ≤4）、9 個「open shell」（shell risk ≥8，執行幾乎無監督）。編譯型 runtime（Rust/Go/Zig/C/C++/Kotlin，19 個）平均安全分 79，腳本型（Python/TS/JS，24 個）67。
  - ⚠️ 站上「all 903 →」是 43 取 2 的兩兩比較組合數（43×42/2 = 903），**不是 903 個 clone**。差點寫錯。
  - ⚠️ 這是單一第三方站的評分，方法論未經第三方驗證，引用時要說「某索引站的評分」而非事實。
- **ClawSec**（prompt-security，SentinelOne 旗下）是一套跨專案安全 skill суite，同時支援 OpenClaw / Hermes / PicoClaw / NanoClaw，做 SOUL.md drift detection、skill 完整性驗證、簽章公告監控。AGPL-3.0。**一個安全套件要同時支援四個 agent，本身就說明了碎片化程度**。
- OWASP 於 2026-04-27 發布 **Agentic Skills Top 10**。⚠️ 二手（obot.ai、CSA），要引用需再查原始頁。
- ClawHub 是最大的 skill 市集（2026-04 約 44,000+ skills，⚠️ 單源 marktechpost）。Hermes 用同一套 SKILL.md 標準，**把 ClawHub 當成自己的安裝來源之一**——競爭對手的市集在餵它。（⚠️ 單源 postfa.st，要在文中標「據報導」或去 Hermes 文件核實）

---

## 3. 設計分歧軸（文章的分析骨架）

四個軸，每個專案在上面選了位置：

1. **隔離邊界**：無（OpenClaw 主 session 預設）→ 應用層權限 → 工具級沙箱（OpenClaw non-main/all）→ agent 級 container（NanoClaw）→ WASM capability（IronClaw、LibreFang）→ 整包 serverless（Moltworker）
2. **可信基底大小**：1.1M LoC（OpenClaw）→ 270K（Moltis，但核心只 7.5K）→ 152K（Hermes）→ 17.5K（NanoClaw）→ PicoClaw（<10MB 執行檔）
3. **記憶與學習**：無狀態 → 持久記憶 → **自我改進 skill**（Hermes、Moltis）。**這條軸與安全軸互相拉扯**：記憶越持久，delayed-execution 注入的窗口越長（Palo Alto 稱 stateful, delayed-execution attacks，⚠️ 經 DigitalOcean 轉述）
4. **部署形態**：Mac Mini / VPS（多數）→ $10 SBC（PicoClaw）→ serverless（Moltworker）→ 企業 PostgreSQL（IronClaw）

**值得寫的張力**：軸 2 和軸 3 直接衝突。你不可能同時要「小到一個下午讀完」和「自己會寫 skill、會改自己的記憶」。NanoClaw 與 Hermes 是這條光譜的兩端，而它們是這個類別裡成長最快的兩個。

---

## 4. 適合／不適合

| 情境 | 選 | 理由 |
|---|---|---|
| 要最多頻道、最大 skill 市集、願意自己硬化 | OpenClaw | 生態無可取代，但預設不安全，必須讀完 security/sandboxing 再開 |
| 想要 agent 越用越準、跨 session 記得你 | Hermes | 唯一把 learning loop 做成核心的；有 OpenClaw 遷移工具 |
| 企業／多客戶資料，需要硬邊界 | NanoClaw | agent 級 container + 憑證不進 agent；且程式碼小到能自己審 |
| 受管制產業、要 production 持久化 | IronClaw | PostgreSQL + WASM sandbox + per-job token |
| 不想裝 Node/Python、要單一 binary 與加密 vault | Moltis | 可信基底最小的實作；但生態有限 |
| $10 SBC、邊緣裝置、老手機 | PicoClaw | 唯一真的能跑在這個級距的；但 v1.0 前別上 production |
| 不想自架、接受 agent 碰不到本機 | Moltworker | ⚠️ 三個月沒更新，先確認狀態 |
| 想要 Rust 單檔 + 30 個頻道 + security policy 進核心 | ZeroClaw | 介於 Moltis 與 OpenClaw 之間 |
| 想看 agent OS 概念實驗 | LibreFang | 早期，OFP 明文傳輸，只在私網跑 |

---

## 5. 限制／已知問題（文章要誠實列）

- 星數與 token 量是兩回事，兩者都不等於「適合你」。
- OpenRouter 排名只涵蓋「有 opt-in 使用歸因」的 app，且只算走 OpenRouter 的流量——直連 Anthropic/OpenAI 的部署完全不在統計裡。這對「誰比較多人用」的結論是嚴重限制，必須寫。
- 曝露實例數三個來源差 3 倍，反映的是掃描方法差異不是真相分歧。
- skill scanner 彼此只有 0.12% 共識，代表「我掃過了」不構成安全保證。
- clawclones 的安全評分是單一第三方站的計算，非公認基準。
- 本文的 star 數是 2026-08-18 的快照，這個類別半年內排名翻過好幾次。

---

## 6. 草稿骨架

1. **開場**：不是九個競品，是同一題的九種答案。用 OpenClaw README 那句「Tools run on the host for the main session unless you configure sandboxing」當引子。
2. **這個類別是什麼**：gateway + channels + skills + memory + cron 的共同形狀，以及它為何天然是 lethal trifecta。
3. **兩個極點**：OpenClaw（廣度／生態）vs Hermes（深度／學習迴路）。附 star vs OpenRouter token 的脫鉤數據與其統計限制。
4. **分裂的真正原因**：2026 年 1–3 月的安全危機時間軸（CVE-2026-25253 → ClawHavoc → Snyk ToxicSkills → CNCERT 警示 → arXiv 論文）。
5. **七種隔離答案**：逐個講 NanoClaw / IronClaw / Moltis / ZeroClaw / PicoClaw / Moltworker / LibreFang 選了什麼邊界、放棄了什麼。
6. **兩條互斥的軸**：可信基底大小 vs 自我改進能力。為什麼這個類別不會收斂成一個贏家。
7. **選型表**＋**限制聲明**。
8. **收尾**：skill scanner 只有 0.12% 共識這件事說明什麼——隔離是架構問題，不是掃描問題。

---

## 7. 建議在文中連回站內既有文章

- OpenClaw 文件導讀系列 32 篇（`series: openclaw`），特別是 channels-overview（contextVisibility 那篇正好對應本文的隔離主題）、gateway-network、auth-secrets
- `2026-04-05-hermes-agent-intro`（zh/en）
- 這篇可以當成 openclaw 系列的橫向補充，但不放進該 series（主題不同）

## 8. 主要來源清單

一手：GitHub API（9 個 repo）／各專案 README 與官網／nousresearch.com/releases／steipete.me／snyk.io ToxicSkills blog／arXiv 2603.12644／docs.openclaw.ai security & sandbox／docs.moltis.org/comparison／nanoclaw.dev
新聞：CNBC、TechCrunch、VentureBeat、Forbes、The Hacker News、The New Stack
分析：clawclones.com、glukhov.org、theweatherreport.ai、CSA labs、obot.ai、marktechpost、termdock
索引：joylarkin/openclaw-security-news
