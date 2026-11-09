# 04 Windows 365 for Agents 與 Sai by Simular 查證報告

訪問日期：2026-11-09。工具：Groundlane MCP（web_fetch / web_search，整條 fallback 鏈第 1 層全程可用，未降級；其中 search 的 tavily/exa 後端回報 unavailable，由 brave+you 提供結果）。一次並行批次曾遇 proxy "upstream closed the stream"，重試即成功。
標記：【官】官方原文；[推論] 我的推論；[自報] 廠商自述。

---

## 一、結論摘要

**Windows 365 for Agents（W365A）**
- 定位：SaaS 層的「代理專用 Cloud PC 池」，不含 agent。官方頁自稱是 Azure IaaS 之上的託管層；agent 要自帶或經 Copilot Studio／Agent 365／Project Opal／Researcher。2026-06 第一週 GA（Learn what's new）。
- OS：Windows（Win 11 Enterprise 24H2 + Edge，Copilot Studio 池）；Researcher 用 Linux Cloud PC。規格（vCPU/RAM）官方沒寫（見第六節）。純雲端，無 BYOD。
- 價格（US）：$0.40/VM/hr 隨用隨付，「每個小時窗口內累計執行時間、進位到下一整點」；always-available 另加 $5/Cloud PC/月。各地理區價差見下。無獨立免費方案，但 Copilot Studio 路徑有 2 個試用池＋每租戶 50 小時（preview 文件）。
- 持久化：池子模式，用完 reset，不保留狀態；session 閒置 30 分鐘被回收，無最長時限。
- 一般開發者能不能直接用：不能「註冊就用」。要 Entra/Intune 租戶、Agent 365 授權（走 A365 路徑）、Azure 訂閱計費；呼叫面是 Graph API＋session API＋每 session 的 MCP endpoint（65 個工具），但 GitHub 官方 quickstart 前置條件是 A365 agent blueprint。
- 官方承認限制：Copilot Studio 路徑 preview、不支援 CMK、只能 Entra 使用者執行；Microsoft 自己對 computer use 的成功率預期約 web 80%／desktop 35%（二手轉述，見四）。

**Sai by Simular**
- 定位：含 agent 的託管產品（Sai agent + 雲端電腦 + API/SDK/MCP）。box 是「只給電腦、AI 自備」；Sai 是「給任務、它自己操作」。
- 電腦：Simular 代管的 Windows 或 Linux 雲端電腦，或自己的 Mac／Windows（BYOD，需開著 Sai Agent）。Explore 免費（每日 credits＋有限度的池化 Windows 雲端電腦）；PAYG $50/月（50,000 credits，最多同時 5 台）；Enterprise 客製。sai.work 另列 Sai Unlimited（always-on）。
- OSWorld：Simular 自報；「79.38% 最高」其實是每題最佳 clean run；平均 77.31%（單次首 run 76.74%），低於 Opus 5 的 77.67%。Sai 是用 Claude Opus 5 當模型的 harness，非獨立模型。獨立（Snorkel）榜單未收錄 Sai；Simular 是 OSWorld 2.0 共同作者之一。
- 與 box：同一家、同一個 Simular 帳號與「credits」措辭；但 key、MCP 套件、入口、計費頁皆分開。box 內「模型呼叫」是否就是 Sai credits——官方沒明說，見六。
- 反證：獨立評論極少（G2 無評分、Product Hunt 5 則）；定價多次改版。

---

## 二、逐家逐題發現

### A. Windows 365 for Agents

**1 定位與層級**
- 【官】產品頁：「Windows 365 for Agents operates as software as a service (SaaS)—a managed layer above infrastructure」「Azure provides foundational infrastructure as a service (IaaS)」；也寫「is a distinct offering … it is not a feature add-on to user-assigned Windows 365 plans」。（https://www.microsoft.com/en-us/windows-365/agents）
- 【官】「Windows 365 for Agents provides the secured compute environment (Cloud PCs) for agentic workloads, while Agent 365 is the governance and control plane」。→ 是基礎設施（執行環境），不是 agent 本身；agent 要另外帶（Microsoft 一方、第三方或自建）。
- 【官】Learn 簡介：「brand-new class of Cloud PCs for agent use」；Agent 工作方式是「check-out/check-in model」。（https://learn.microsoft.com/en-us/windows-365/agents/introduction-windows-365-for-agents）
- GA：【官】Learn what's new「Week of June 1, 2026 … Windows 365 for Agents now generally available」。（https://learn.microsoft.com/en-us/windows-365/agents/whats-new）

**2 OS／規格／雲端 vs BYOD**
- 【官】GitHub FAQ：「What operating system do Cloud PCs run? A: Windows.」；Copilot Studio 文件：「Cloud PC pools run on Windows 11 Enterprise 24H2 with Microsoft Edge」。Learn 簡介：Researcher Computer Use 用「Linux Cloud PCs」。
- 瀏覽器：【官】GitHub FAQ「Microsoft Edge」。
- 規格：官方頁、Learn 簡介、provisioning policy、GitHub overview/FAQ 均未列 vCPU/RAM → ⚪（見第六節）。
- 純 Microsoft 雲端；無 BYOD。區域：【官】「globally available in all supported regions where Cloud PC provisioning is supported」（GitHub overview）；Microsoft 部落格摘要曾稱 preview 僅限美國（Security Blog 2026-05-01 摘要，snippet 層級）。

**3 價格**（2026-11-09 讀自產品頁與 Learn）
- 【官】Learn：「For US Geography … billed at $0.40 per hour for consumption. Usage is calculated as the total time spent running agent tasks on provisioned Cloud PCs within each hourly window, rounded up to the next full hour.」「always-available … $5 per Cloud PC per month … in addition to any Pay-as-you-go based usage.」（https://learn.microsoft.com/en-us/windows-365/agents/pricing-paygo-always-available）
- 【官】產品頁各地理區（PAYG/always-available）：US East/West/Central $0.40/$5；Central America $0.44/$5.5；Canada $0.48/$6；Europe/UK $0.52/$6.5；Asia/India $0.56/$7；Middle East/France/UAE/Switzerland $0.572/$7.15；Australia/Australasia $0.58/$7.25；South Africa $0.584/$7.3；South America $0.80/$10。
- 核實使用者列的說法：$0.40/hr ✓、「整點進位」✓（但官方措辭是「每個小時窗口內累計後進位」，並非明寫「每個任務進位到整點」[推論]：同一小時窗口多個任務可能合併計）、$5/月 always-available ✓（疊加在用量上，且僅 US）。
- 其他費用：【官】「Agent capabilities and compute are billed independently from Cloud PC usage」（產品頁）。Copilot Studio 路徑另計 credits：二手來源稱每個 computer-use 步驟 5 Copilot Credits（標準模型）、Claude Opus 4.6 為 15（windowsforum，二手轉述 Microsoft Learn；未回原頁核實）。
- 計費通道：【官】billing-w365a「billed through your existing Azure subscription」；Agent 365 路徑需 provisioning policy 前置：Intune 授權＋Agent 365 授權＋有效 W365A billing plan（create-provisioning-policy-agents）。
- 免費額度：【官】Copilot Studio Cloud PC pool（preview 文件）「create up to two Cloud PC pools in a tenant without requiring a Windows 365 for Agents billing plan … each tenant is provided with 50 hours of free Cloud PC pool usage for published agents running autonomously」；內嵌測試聊天不計費。（https://learn.microsoft.com/en-us/microsoft-copilot-studio/use-cloud-pc-pool）

**4 持久化／閒置／並行**
- 【官】池 vs 企業 Cloud PC：「Persistence: Reset after use」（cloud-pc-agent-pools）。Release：「the Cloud PC is reset」。
- 【官】session：「no fixed maximum duration」；「A session that goes 30 minutes without any MCP activity is automatically evicted」；「In-session state does not survive an unexpected session loss」「Checkpoint state externally」。（agent-session-lifecycle）
- 取得時間：【官】checkout「may take up to 30 seconds」（mcp-tool-overview）；建池「around 20-30 minutes」（create-provisioning-policy-agents）。
- 並行：【官】Agent 365 路徑 provisioning policy「Always available Cloud PCs count … between 1 and 200」；Copilot Studio 路徑「up to five Cloud PC pools in an environment, each … up to 10 Cloud PCs」。同一 session 多 caller 可共用，指令序列化（GitHub FAQ）。

**5 整合與存取**
- 【官】三個面：Graph API（管理員/ISV 管池）、session API（`POST /api/pools/{poolId}/sessions` 取、`DELETE` 還）、per-session MCP endpoint（`POST {computerUrl}/mcp`）；另有 WebRTC Screenshare SDK。（mcp-tool-overview）
- 【官】GitHub README：65 個 MCP 工具（3 session＋26 desktop＋36 browser）；「Prerequisites: an Agent 365 (A365) agent blueprint published in Entra with the Windows 365 Computer-Use MCP server added and consented, plus a provisioned Cloud PC agent pool」。範例為 C#/.NET 10 Teams agent。（https://github.com/microsoft/windows-365-for-agents）
- 【官】消費入口：Copilot Studio computer use（Cloud PC pool 目前仍標 preview）、Project Opal、Researcher Computer Use、Agent 365。（Learn 簡介）
- 一般開發者能不能直接用：[推論] 不能個人註冊即用。必要條件含 Entra/Intune 租戶、Global Admin consent、Azure 訂閱、（A365 路徑）Agent 365 與 Intune 授權。沒有 CLI、沒有個人免費入口。對「獨立開發者想要一台雲端桌面」基本是不同客群。

### B. Sai by Simular

**1 定位與層級**
- 【官】platform.simular.ai：「Sai is Simular's computer-use agent, available to developers as the Sai API. Give it a task in plain English and it does the work on a real computer」。→ 含 agent 的託管產品。
- 【官】「No model keys to bring. The model and the computer are included in your Sai plan.」（docs 首頁）。
- 【官】文件另有「Direct control (research preview). Skip the task and drive the computer yourself: run Simulang code on it and get screenshots back」，且「Direct control … need a cloud computer for now」（quickstart）。→ 有 box 式的低階控制，但僅 research preview、僅雲端電腦。

**2 OS／規格／雲端 vs BYOD**
- 【官】quickstart：雲端 Windows 或 Linux；自己的 Mac 或 Windows（`kind: own`）需「Install the Sai Agent」，「Sai works on it only while the Sai Agent is running and the computer is awake」。macOS 無雲端版（僅 BYOD；比較文 snippet 也這麼寫，但非我直讀）。
- 規格：官方頁未列 vCPU/RAM → 見六。

**3 價格**（https://platform.simular.ai/pricing，2026-11-09）
- Explore $0：「Daily credit allowance／Limited access to a cloud-based Windows computer／Create and test workflows／Community support」。
- Pay as you go $50/mo：「50,000 credits a month ($50 of usage) for AI models and computer time」「A dedicated Windows or Linux cloud computer, billed only while it runs. Run up to 5 cloud computers at the same time」「Or run Sai on your own Mac or Windows. Only AI usage counts, no computer time」「Top up credits any time」。
- Enterprise：Managed scaling、SSO/RBAC、SLA（platform 頁），sai.work 版另列 SOC2。
- sai.work/pricing 另有「Sai Unlimited」：「Unlimited AI usage within our fair-use guidelines … Always-on cloud computer … included」；價格字樣在抓取結果被剝除，Simular 比較文 snippet 與 best-ai-agent snippet 寫 $500/月（snippet 層級，未讀到原價）。platform.simular.ai/pricing 並未列 Unlimited。
- 免費方案細節：docs【官】「Free accounts get one pooled Windows cloud computer, a daily time limit on it, and a daily credit grant … choosing a model needs a paid plan … exact daily figures are shown in the portal」；quickstart 範例顯示免費帳戶 credits $0.35。→ 確切每日額度公開頁沒有（需登入 portal）。
- 計價單位：credits（1 credit≈$0.001 [推論]，由「50,000 credits＝$50」得出）；「per-hour computer rate is not published separately from credits」（比較文 snippet 對 Sai 的自述）。

**4 持久化／閒置／並行**
- 【官】「Each message continues your API conversation on that computer: Sai remembers the earlier messages, and the desktop is as the last task left it.」
- 【官】免費：首次請求「can take about two minutes while its cloud computer starts」；「free_computer_time_exhausted … daily computer time is spent and the workspace shut down」；direct control「Closing its lease deletes a free-plan computer」。
- 並行：Free 1 台池化；PAYG 最多 5 台雲端同時；API key：Free 1／Paid 20；速率：POST /message 每小時 600（付費）／60（免費）（billing-and-limits）。
- Unlimited 版 always-on（sai.work）；saner.ai 評論稱 $50 層級「machine sleeps when idle」，早期定價版本（Starter/Premium/Pro $50/200/500）已與現行 platform 頁不同，視為過時 [推論]。

**5 整合與存取**
- 【官】`POST https://api.simular.ai/v1/agents/message`、Python SDK（`pip install sai-sdk`）、TypeScript SDK、MCP `@simular-ai/sai-mcp`（Claude Code/Codex/Cursor）；MCP 工具：sai_machines, sai_models, sai_task_start, sai_task_wait, sai_task_approve, sai_task_abort, sai_upload, sai_control_*；`learn` 端點把任務轉成可重播 Simulang 程式碼。需 Node 22.12+；免費帳戶需手機驗證才發 key。
- 一般開發者可直接用：✓（Google 登入→建 `sapi_` key）。

**6 Sai 專項：OSWorld**
- 【官（Simular）】文章（發表 2026-08-28，2026-10-02 更新）：OSWorld 2.0 為 73% 部分分、$15.70/task（binary 28.25%）；OSWorld 2.1「77.3% partial score (79.4% counting repeated runs, 41.7% binary score) at an average cost of $14.34 per task, on par with Opus 5 at 77.67% (cost unavailable)」。文末致謝「Darrow Hartman, who ran the full OSWorld 2 evaluation」。
- 【官（Simular）】platform 頁與 benchmark 頁改寫為「highest partial score on the official leaderboard, 79.38%」「binary accuracy … second, at 41.67%」，列為「Sai w/ Claude Opus 5」，Opus 5 Max binary 44.33% 較高。
- 關鍵查證：Simular 的 HF 資料集【官（Simular）】：「Sai (agent model anthropic/claude-opus-5, thinking effort max) … 134 runs across 108 tasks … Headline (mean over tasks of each task's mean clean score): 0.7731 … First clean run per task: 0.7674. Best clean run per task: 0.7938.」→ 79.38% 是「每題挑最佳 clean run」，不是平均；平均 77.31%、首跑 76.74%，皆低於 Opus 5 Max 的 77.67%（Snorkel/Simular mirror 同值）。因此「榜首」標題只在採最佳 run 口徑時成立。[推論]
- 非獨立模型：Sai 在這個提交裡用 Claude Opus 5；$14.34 是 Sai 加模型的整體成本。
- 獨立驗證：Snorkel（benchmark 共同作者）的 OSWorld 2.0 榜（https://snorkel.ai/leaderboard/os-world-2-0/，read）列 23 列，無 Sai。Steel.dev 追蹤頁（read）把 Sai 73.0%/$15.70 標為「self-reported by Simular, a benchmark co-author」，並寫「independent reproductions not involving the benchmark authors are still rare」。OSWorld 官方 repo 說明要列入 verified leaderboard 需與維護者排會、由他們跑你的 agent 或由受信任機構分享軌跡。官方榜（osworld-v2.xlang.ai）的表格由 JS 渲染，HTML 與 browser render 兩種抓取都讀不到榜單列，無法直接確認 Sai 在官方榜上的標記 → ⚪／✉️（第六節）。Simular 的軌跡公開在 HF（可複現，我未下載驗證）。
- Simular 與 OSWorld 的關係：官網作者單位列「11 Simular」（Saaket Agashe, Xin Eric Wang）。→ 利益關係需註明。
- 成本欄：2.1 榜多數列沒有成本，「唯一公開成本」成立但表示只是別人沒填 [推論]。
- 自報 Opus 5.5 81.8% 不在官方榜（platform compare 頁 snippet，未直讀）。

**6 box 與 Sai 的關係**
- 【官】box 首頁：「Cost: the box itself is free. Its model calls use your account's daily credits.」「one cloud Linux desktop per account. It sleeps when no one uses it and wakes when your AI connects.」box docs：「The model says credits are used up → Add credits or choose a plan on Billing (box.simular.ai/billing)」。
- 【官】box 不含 agent：連到 Claude、ChatGPT、Claude Code、Codex、Cursor 等，MCP URL `https://mcp.box.simular.ai/mcp`，OAuth 用 Simular 帳號，key 前綴 `cb_`；Sai 的 key 前綴 `sapi_`、MCP 套件 `@simular-ai/sai-mcp`、portal platform.simular.ai／sai.simular.ai。兩者是不同入口與不同 key。
- 「box 內的模型呼叫是不是 Sai credits？」：官方只說用「your account's daily credits」，沒有明寫就是 Sai 的 credits。Sai 免費額度以美元表示（$0.35 範例）、box 第三方稱每日 1,000 credits（aipromonow、kocpc 2026-11-07/08，二手）。[推論] 同一 Simular 帳戶體系，但是否同一個餘額池、兌換率是否相同，官方未明示 → ✉️。另，第三方稱「若用自己的 agent 驅動，模型花費留在自己帳戶」（aipromonow，二手）；box 的 credits 較可能是花在 box 自身的內部模型（如多步 GUI 規劃）[推論，未證實]。
- 分工總結：box＝「電腦＋MCP 工具，AI 自備」，一帳戶一台免費 Ubuntu 桌面；Sai＝「agent＋電腦（可選自己的機器）」，任務委派式、含審批與重播。Sai 有 direct control（research preview）重疊 box 的功能面。第三方稱 box 免費規格約 4 CPU/8GB/40GB（aipromonow，二手）。

**7 限制與反證**：見第四節。

---

## 三、讀取完整度盤點表

| 來源 | 程度 | 備註 |
|---|---|---|
| microsoft.com/en-us/windows-365/agents | read | 內容被擷取器精簡（warning），價格與定位段落完整；導覽/卡片未讀 |
| .../agents/compare-plans-pricing | read | 同上；與主頁價格段一致 |
| Learn：W365A 簡介、pricing、billing、session lifecycle、agent pools、provisioning policy、availability-a365、mcp-tool-overview、what's new | read | 全文 |
| Learn：docs 首頁 | partial | 只有一段簡介 |
| Learn：architecture-overview、agent-authentication-model、identity-security、MCP server reference | blocked/未讀 | architecture-overview 一次 proxy 中斷，後續未重試；其餘未嘗試，與結論影響低 |
| Copilot Studio Cloud PC pool 文件 | read | |
| GitHub microsoft/windows-365-for-agents README、docs/overview.md、docs/faq.md | read | |
| security blog 2026-05-01、schneider.im、techcommunity Build 2026 | snippet | 只看搜尋摘要 |
| windowsforum.com 文章 | read | 二手，轉述 Microsoft 文件 |
| paintbycode.blog、digitalapplied、licensingschool | snippet | |
| platform.simular.ai 首頁／pricing／docs 首頁／quickstart／billing-and-limits／benchmark 頁 | read | 全文 |
| sai.work/pricing | read | 價格數字被剝除 |
| simular.ai/articles/sai-tops-osworld-2-0 | read | 全文 |
| simular.ai/alternatives/cloud-computers-for-ai-agents | read | 全文（content 約 173KB bytes，無 truncated），W365 與 box 段落完整；Sai 專節在本版本不存在（見第五節） |
| box.simular.ai 首頁、/docs、llms-full.txt、/billing | read | |
| HF simular-ai/sai-osworld-v21-reference-runs | read（README） | 未下載軌跡 |
| osworld-v2.xlang.ai | partial | 摘要/論文內容 read；榜單表格 JS 渲染讀不到（試 HTML 與 browser render） |
| github.com/xlang-ai/OSWorld-V2 | read | |
| snorkel.ai/leaderboard/os-world-2-0 | read | |
| leaderboard.steel.dev/osworld-2 | read | |
| saner.ai simular-reviews | read | 競品自家部落格，有利益關係 |
| aipromonow、kocpc、benchlm、presenc、llmlearner | snippet/read(aipromonow) | |
| platform.simular.ai/compare/claude-vs-simular-api | snippet | |

---

## 四、反證與風險

搜尋輪次：W365A review/limitations/complaints；Sai review/complaints/independent verification；box/Sai credits；OSWorld 2.1 verified。

**Windows 365 for Agents**
- 【官】Copilot Studio Cloud PC pool 仍為 preview，「Preview features aren't meant for production use」；限制：「Only a Microsoft Entra user account can execute computer use」「Customer-Managed Key (CMK) isn't supported」；建池最多 30 分鐘、需 Entra RDP 認證、隱藏同意提示等多項前置作業。
- 【官】池為 reset-after-use，session 狀態遺失需外部 checkpoint。
- 【官（Learn 一般性限制）】Microsoft 自述適用範圍與使用風險由 windowsforum 轉述：成功率約 web 80%／desktop 35%；不支援／有問題的目標含 Electron、Java、Unity、遊戲、CLI、Citrix。此為二手轉述 Copilot Studio 文件（我未回該 Learn 頁核實）→ 標二手。
- 成本風險：進位計價（短任務吃虧）、Copilot Credits 另計（二手）、always-available 疊加費。
- 評論稀少：未找到獨立開發者實測負評；多數是通路商／部落格複述官方資料。⚪（見第六節）。

**Sai**
- 獨立評論稀薄：saner.ai（競品，利益衝突）稱 G2 無足夠評論、無 Capterra/Trustpilot、Product Hunt 5 則平均 4.4；早期使用者回報非 Mac 支援、中文輸入與 CAPTCHA 問題；code-based workflow editor 對非技術使用者偏難；定價與命名多次變動。該文價格（Starter $50 招待制／Premium $200／Pro $500）與現行 platform 頁不同，已過時。
- 官方自承：free 帳戶需手機驗證、首次請求約 2 分鐘冷啟動、免費只能用 `auto` 模型；direct control 為 research preview 且僅雲端；link-only 敏感步驟需人工；「Tasks run on a real computer and may act on the user's accounts. Confirm anything irreversible」。
- OSWorld 數字口徑風險：同一份成績在 Simular 各頁出現 77.3／79.4／79.38／73／72.6 多個數字，需分清 OSWorld 1.0（Agent S3 72.6%）、2.0（73.0%）、2.1（77.31% 平均／79.38% 最佳）。
- 成績是 Sai 加 Claude Opus 5，成本含底層模型；換模型或降低 effort 結果不保證。

---

## 五、與 Simular 比較文不一致處

比較文版本：抓到的版本標 publishedAt 2026-11-09、box 排第一；搜尋摘要顯示同網址在 2026-10-12 版本曾以 Sai 為首選，內容已改版。以下以我讀到的 2026-11-09 版為準。

1. 數據日期矛盾：文中「Every figure was read from the vendor's own pricing or documentation page on 10 October 2026」，但頁面 publishedAt 為 2026-11-09，box MCP URL 已用 11-04 之後的新網址。→ 日期聲明已過時／未重新驗證。
2. W365A「Announced in preview at Ignite in November 2025」：我讀到的官方來源只有 GA（2026-06 第一週，Learn what's new）；Security Blog（2026-05-01，snippet）稱「now available in public preview (in the United States only)」。Ignite 2025 預覽說法官方頁未見，無法證實，且與「preview 2026-05」的說法難以調和 → 未證實，疑似不一致。
3. 「pricing published for the US only」：不一致。官方產品頁與 compare-plans 頁公布 9 組地理區價格。
4. 「No free tier; requires Microsoft 365 licensing context」：部分不一致。官方有 Copilot Studio 試用（2 池＋50 小時，preview）；Copilot Studio 路徑明寫「Windows license 不需要」「Microsoft 365 Unattended license 不需要」；計費走 Azure 訂閱。Agent 365 路徑則需 Agent 365＋Intune 授權（這部分比較文大致對）。
5. 「Hourly billing is rounded up, so a five-minute task costs an hour」：與官方一致但過度簡化。官方是「each hourly window 內總執行時間進位」，同窗口多任務是否合併未明寫 [推論：可能合併，所以最壞情境不一定每任務 1 小時]。
6. 「Azure-hosted VM」：官方明講 W365A 是 SaaS，不等同裸 Azure VM；比較文歸為 Layer 2 desktop infrastructure 尚可，但「Azure-hosted VM」欄位不等於官方定位。
7. 「Pilot partners Manus, Genspark」：官方頁未見，無法證實。
8. 一致處：$0.40/hr、整點進位、$5/月 always-available、Linux 僅 Researcher、經 Copilot Studio／Agent 365 取得、池子 check-out 模型、Windows 桌面、Intune/Entra 治理。
9. Sai 相關（來自 10-12 版 snippet 與其他 Simular 頁面，非 11-09 版全文）：snippet 稱「API exposes task delegation and a view-only live stream, not shell or input primitives」，與 Sai docs 的 Direct control（run Simulang code、screenshots；research preview）不一致；「free tier includes a cloud computer」與官方一致（但限池化 Windows、有每日時間上限）。
10. 利益聲明：Simular 在比較文自述把 box 列第一且為唯一 layer-3，「Nothing here is sponsored」；屬廠商自述，評分與排序不能當中立。
11. box「Free during beta」與「Freemium; pay as you go」：box 官方頁只寫「the box itself is free」，未見 beta 字樣（第三方稱付費方案約 $50/月起，二手）。

---

## 六、⚪／✉️ 清單

- ⚪ Windows 365 for Agents 的 Cloud PC 規格（vCPU/RAM/磁碟）：試過 microsoft.com/windows-365/agents、compare-plans-pricing、Learn 簡介、create-provisioning-policy-agents、cloud-pc-agent-pools、GitHub README/overview/faq（Groundlane web_fetch，皆成功但未載規格）；web_search 兩次僅得到企業版 Cloud PC 規格頁（無關）。未試：architecture-overview（一次 proxy 中斷）、device-management。結案條件：整條鏈只試了第 1 層，Groundlane 本身可用；其餘 fallback 層級對同一官方頁無額外價值，故標 ⚪ 但建議之後補讀 architecture-overview。
- ⚪ 官方 OSWorld 榜（osworld-v2.xlang.ai）是否收錄「Sai w/ Claude Opus 5」、是否標 verified：Groundlane web_fetch（markdown＋render=always＋selector）皆只得到頁首與摘要，榜單由 JS 載入；Snorkel、Steel.dev 兩個鏡像榜未列 Sai（Sai 2.0 僅在 Steel 以自報列出）；Simular 的 benchmark 頁自稱資料「From the official OSWorld leaderboard」並與 Snorkel 的 Opus 數字相符。未試 Firecrawl/其他瀏覽型工具。
- ✉️ 獨立複現：是否有非 Simular 的第三方跑過 Sai 的 OSWorld 2.1 → 可寫信 OSWorld 維護者（README 列 yuanmengqi732@gmail.com、zzl0712@connect.hku.hk）。
- ✉️ box 的「model calls use your account's daily credits」與 Sai credits 是不是同一餘額池／兌換率／哪些呼叫扣款 → support@simular.ai。
- ✉️ Sai 免費方案每日 credits 與每日電腦時間的實際數字：公開頁沒有，需登入 portal 或問 Simular。
- ⚪ Sai Unlimited 價格：sai.work/pricing 抓取結果被剝除價格；platform 頁未列；只在搜尋摘要見 $500/月。試過 Groundlane web_fetch ×2。
- ⚪ W365A 獨立使用者負評（Reddit/HN/部落格實測）：搜尋兩輪僅得官方、通路商與 windowsforum 轉述，無一手負評。
- ⚪ Sai 獨立負評：僅 saner.ai（競品）與其引用的 Product Hunt 評論（未直讀 PH 頁）。
