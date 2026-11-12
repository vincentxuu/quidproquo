# Research: Simular box 與「給 AI 一台雲端電腦」的競品全景

研究日：2026-11-09　｜　類別：tech／AI agents（devtools）　｜　來源登錄：`2026-11-09-simular-box-landscape.sources.jsonl`（309 筆：read 225、partial 29、snippet 48、abstract 1、blocked 6）　｜　逐家細節：`2026-11-09-simular-box-landscape.detail/01~07-*.md`

> 狀態：研究筆記，尚未發文。價格與限制都是 2026-11-09 讀到的官方頁，會變動，引用前要重查。

## 子問題

1. box 本身有哪些實測限制？
2. 母群：GUI 桌面型、無桌面沙盒、瀏覽器型各有哪些？
3. 桌面型逐家官方查證
4. 沙盒型與瀏覽器型跟 box 的差別
5. 反證與風險

## 母群與覆蓋（誠實標註偏誤）

母群由我從搜尋結果與 Simular 自己的比較文組出來，**不是系統性掃描**。涵蓋 24 家：

- A 桌面型：Orgo、Cua、E2B（含 Desktop）、Daytona、Windows 365 for Agents、Sai
- B 沙盒型：Fly Sprites、Modal、Vercel Sandbox、Cloudflare、Runloop、Blaxel、Morph Cloud、Northflank、machine0
- C 瀏覽器型：Browserbase、Anchor、Steel、Hyperbrowser、Browser Use Cloud、Scrapybara（已停）

**沒涵蓋**：AWS（Bedrock AgentCore 的瀏覽器／程式碼執行）、Google Cloud、Docker 自家 sandbox、自己用 Hetzner／DigitalOcean 搭 VNC 桌面、Manus／Genspark 這類託管 agent、Anthropic 官方 computer-use 參考實作。偏誤：母群有一部分來自 Simular 比較文的清單，所以和它重疊的家數偏多。

## 一、box 本身

| 項目 | 官方寫的 | 狀態 |
|---|---|---|
| 形態 | 雲端 Ubuntu 桌面，內建 Chrome 與 shell，AI 經遠端 MCP 操作（`https://mcp.box.simular.ai/mcp`） | ✅ 重讀 `llms-full.txt` |
| 數量 | 每帳號一台 | ✅ |
| 休眠 | 閒置休眠，AI 連線約 1 秒喚醒，檔案與狀態保留 | ✅ |
| 費用 | 「the box itself is free. Its model calls use your account's daily credits.」 | ✅ 原話 |
| 每日 1000 credits、早上 8 點重置 | 官方沒寫 1000；重置時間第三方說 UTC 00:00（台灣 08:00） | ⚠️ 第三方，與使用者說法一致 |
| CPU／RAM／磁碟 | **官方沒寫**。社群實測約 4C／7.7G／40G（linux.do、NodeLoc 摘要），同日有人回報只剩 2C4G | ⚠️ 不可當保證 |
| 休眠逾時、保存期限、同時連線數 | 官方沒寫 | ⚪ |
| 每操作扣多少 credits | 官方沒公布 | ⚪ |
| 自帶模型的 agent（Codex、Claude Code）扣不扣 | 官方沒表態；一位部落格作者用 Codex 實測沒扣 | ✉️ |
| 工具 | 官方 SKILL.md 列出 shell、檔案、`browser_*`、screenshot、`computer_*`、`script_run`、`box_*`；GitHub 實測 31 個 | ✅ |
| 離線接力 | `/box:offload`、`/box:back`：把 git repo 丟進 box 跑 agent，再合併 commits；一 repo 一 session、每個 box 最多三個 offload session；box 內 agent 的權限提示被關閉 | ✅ |
| 隱私 | 政策會收螢幕畫面、DOM、瀏覽 URL，任務內容送模型供應商；預設不拿來訓練 | ✅ |
| 條款 | beta 功能可隨時改或停，免費 credits 可隨時調降 | ✅ |
| 安全提醒 | 官方 headless 文件自己寫：預設全授權後，「網頁上讀到的內容可以操控 box 的瀏覽器與 shell」 | ✅ 官方原文 |
| 穩定性 | MCP 網址 2026-11-04 搬家，舊網址登入可能失敗；有人回報 Hermes 常駐時「睡了叫不醒」 | ⚠️ 單一回報 |

獨立評測：Reddit／HN 沒找到討論；第三方多是優惠部落格。**box 的第三方證據很薄。**

## 二、事實交叉表（只放來源說了什麼）

| 事實 | 來源 | 狀態 |
|---|---|---|
| Cua Cloud 與 Fleets 於 2026-10-18 終止，現為 Cua Spaces（自備算力） | cua.ai 官方遷移文件（我重讀） | ✅ |
| Simular 比較文（10 月 13 日）仍把 Cua Fleet 當現行（$0.178/hr、15 分鐘 TTL） | 比較文 vs 官方 | ❌ 比較文與官方衝突 |
| Daytona v2 的 Windows 頁寫「Windows sandboxes for Daytona v2 are coming soon」 | daytona.com/docs/windows-sandboxes（我重讀） | ✅ 窄事實；v1 文件曾寫 Windows 可用 |
| Orgo 有免費帳號（$5 起始 credit 可跑 1 台 Medium）；比較文寫無免費層 | subagent 讀 orgo.ai 定價區 | ⚠️ 我重讀首頁時定價區被擷取器濾掉，**未獨立重讀** |
| Orgo Windows 要 Scale 方案或另購 | orgo.ai 首頁（我重讀） | ✅ |
| Windows 365 for Agents：$0.40/hr、$5/月 always-available（美國），2026-06 GA；一般開發者不能直接註冊，要經 Copilot Studio 或 Agent 365 | Microsoft 官方頁（subagent） | ✅ 官方單一權威 |
| Windows 365 for Agents 價格非「只公布美國」，官方公布 9 個地理區 | 同上 | ❌ 與比較文衝突 |
| E2B：Firecracker microVM、$0.0504/vCPU-h、$0.0162/GiB-h、Hobby 連續 1 小時／Pro 24 小時；pause 保留記憶體 | E2B 官方（subagent） | ✅ |
| E2B 預設 RAM 是 512 MiB 還是 4 GiB | E2B 官方兩頁互相矛盾 | ❌ 官方內部衝突 |
| Daytona 公開 repo 已 archived（AGPL-3.0，2026-06 核心轉私有） | GitHub／官方（subagent） | ✅ |
| Sai 的 OSWorld：每題最佳 run 79.38%，平均 77.31%，低於 Opus 5 的 77.67%；Snorkel 榜未收錄；Simular 為 OSWorld 共同作者 | Simular 資料集 README、Steel.dev（標自報） | ✅ 但為廠商自述 |
| Runloop 有 Computer（Ubuntu Desktop，鍵鼠截圖 API）與 Browser | Runloop 官方（subagent） | ✅ |
| Blaxel 2026-09-10 被 Baseten 收購 | 報導／官方（subagent） | ⚠️ 單一回報，未交叉 |
| Scrapybara 2025-10-15 下線 virtual desktop，公司轉做 Capy | Scrapybara 官方 X 貼文、capy.ai | ✅ |
| 瀏覽器型代理流量價約 $5–12/GB，是帳單主體 | 各家官方定價 | ✅ |
| Anchor 時價：首頁 $0.09／小時 vs docs $0.05／小時 | Anchor 兩頁 | ❌ 官方內部衝突 |
| Browserbase Search 超量價 $5 vs $7 | Browserbase 兩頁 | ❌ 官方內部衝突 |
| Fly Sprites 試用額度 $30 vs $1；checkpoint 是否存記憶體（文件內部矛盾） | Fly 兩頁、部落格 | ❌ 官方內部衝突，建議問 Fly |
| 各家低延遲數字（Blaxel 25ms、Morph <250ms 等） | 皆廠商自述 | ⚠️ 無獨立量測 |

**Simular 比較文的整體可信度**：數字大多與官方一致，但已查出的錯誤全部偏向讓自家以外的競品顯得較弱或較舊（Cua Fleet 已停仍列為現行、Orgo 無免費層、Windows 365 只公布美國、E2B 星數過時、省略 E2B 與 Daytona 的 Claude 整合）。它同時把 E2B、Daytona 歸為「得自己寫 agent」，但官方都能直接接 coding agent。**只當候選清單，不當證據。**

## 三、桌面型與沙盒型比較（2026-11-09 官方頁）

| 產品 | 層級 | 桌面 | 價格重點 | 持久化 | 主要缺點 |
|---|---|---|---|---|---|
| **box** | 託管電腦，agent 自備 | Ubuntu 桌面＋Chrome | 電腦免費，模型呼叫用每日 credits | 休眠保留檔案，約 1 秒喚醒 | 規格未公布；一帳號一台；beta；第三方證據薄 |
| Sai | 託管電腦＋agent | Windows 或 Linux | Explore 免費；$50/月（50,000 credits、最多 5 台） | 閒置休眠 | 不能自帶 agent；macOS 只能 BYOD |
| Orgo | 桌面基礎設施 | Linux；Windows 要 Scale 或加購 | $29／$99／$399 月繳；Medium $0.055/hr；$5 免費 credit（待重讀） | stop 後檔案保留，記憶體不保留 | 無獨立負評可查；Windows 貴 |
| Cua | 開源 SDK＋Spaces | 本機／自備雲 | Spaces Free（2 台、每月 20 遠端小時）、Pro $18、Teams $30/seat | 視自備環境 | **託管雲端已停**，只能自備 AWS／GCP／Azure／Hetzner／Modal |
| E2B＋Desktop | 沙盒＋Linux 桌面附加 | Xfce | Hobby $0＋$100 一次性；Pro $150/月＋用量 | pause 保留記憶體 | 連續 1／24 小時；桌面同時一條 stream |
| Daytona | 沙盒＋桌面 | Linux；Windows v2「coming soon」；macOS 預約 | $200 免費算力 | container 不能 pause，VM 可 | 公開 repo archived；有第三方記錄的建立失敗事件 |
| Windows 365 for Agents | 企業 Cloud PC 池 | Windows | $0.40/hr＋$5/月 | 用完即重置，閒置 30 分鐘回收 | 要 Entra／Intune／Azure，不能直接註冊 |
| Runloop | 沙盒＋Computer／Browser | Ubuntu Desktop | Pro $250/月起 | 只存磁碟，suspend 要 Pro | 規格上限未公布 |
| Morph Cloud | 完整 VM | 自己跑 XFCE＋VNC | $0.05/MCU | 快照／分叉含記憶體 | 價格頁抓不到，欄位有歧義 |
| Hyperbrowser | 瀏覽器＋沙盒 | macOS Beta 附 VNC | $30／$100/月 | — | macOS 與 GPU 要聯絡開通 |

無桌面（shell 為主）：Fly Sprites、Modal（可自組 VNC）、Vercel Sandbox、Cloudflare、Blaxel、Northflank、machine0。「沒有 GUI」的依據是官方功能清單未列出，不是官方明文否認。

瀏覽器型：Browserbase（Free 1 小時；$20／100 小時；$99／500 小時）、Anchor（$5 點數；$50；$2,000/月）、Steel（$30 一次性；$250/月）、Hyperbrowser、Browser Use Cloud（$0.02/瀏覽器小時；住宅代理 $5/GB）。進階 stealth 都鎖在高價層，且 Browserbase、Steel、Browser Use 官方文件各自寫了「不保證能過」。廠商自出的 stealth 基準互相矛盾，每家都把自己排第一。

## 我的推論（與上表分開）

| 推論 | 依據 | 這個推論可能錯在哪 |
|---|---|---|
| box 的真正對手是 Orgo、Runloop，而不是 E2B／Daytona | box 與 Orgo／Runloop 都主打「給 AI 一台持久的桌面」；E2B／Daytona 偏用完即丟的沙盒 | 我沒實測任何一家的使用體驗，只比較官方文件 |
| 免費額度的差別在「誰付模型費」：box 與 Sai 以 credits 吸引使用者，Orgo 與 E2B 以一次性 credit 為主 | 各家定價頁 | box 的 credits 實際能做多少事未知（每操作成本沒公布） |
| 「一帳號一台」讓 box 不適合平行批次工作；Sai 與 Orgo 的多機方案才適合 | 官方一帳號一台、Sai 最多 5 台 | box 之後可能開放多台 |
| box 是 beta 且免費 credits 可隨時調降，所以不適合當生產依賴 | 條款原文 | 條款是通用免責語，實際調降機率不知道 |
| 研究時間點上，託管桌面型市場剛經歷整併：Cua Cloud 停、Scrapybara 停、Blaxel 被收購、Daytona 核心轉私有 | 四個獨立事件 | 四個事件的原因各異，不一定是同一趨勢 |

## 草稿骨架（若要發文，交 `post` skill）

- **核心概念**：把 AI 的「手」從終端機延伸到整台電腦。box 是其中一種：免費、Linux、經 MCP 接任何 coding agent。
- **關鍵設計決定**：box 把「電腦」與「agent」分開（agent 自備），跟 Sai（任務委派）是同一家的兩條路。
- **替代方案**：要持久桌面→Orgo；要開源自架→Cua；要企業 Windows→Windows 365；只要瀏覽器→Browserbase／Steel／Anchor。
- **適合**：個人想試「讓 AI 在雲端點螢幕」、不想動自己的電腦。**不適合**：需要明確 SLA、平行多機、Windows、或不能讓螢幕畫面經過第三方的情境。
- **限制**：規格不透明、一帳號一台、beta 條款、隱私政策會收螢幕與 DOM、第三方評測稀少。
- **取捨**：免費換來不確定性。

## 讀取完整度盤點

詳細逐筆在 `.sources.jsonl` 與各 `detail/*.md` 第三節。

| 範圍 | 狀態 |
|---|---|
| 官方首頁、定價、docs（各家） | 多數 read；Morph 首頁與 pricing 所有工具抓不到內容，改讀 `cloud.morph.so/web/subscribe` |
| Browserbase 定價頁 | Groundlane 被 browser-challenge 擋兩次，改用 firecrawl 讀到全文 |
| 第三方負面評價 | 多數只讀到搜尋摘要（snippet 48 筆），**只能當線索** |
| GitHub issues（box-plugin、Cua 782 個 open issues） | 部分只讀到一部分內文；Cua 的 issue 標題被抽取器移除 |
| 我抽查重讀 | Cua 終止公告、Daytona Windows 頁、box `llms-full.txt`、Orgo 首頁（定價區被濾掉） |
| **我沒有做**的 | 1) 抽查比例：7 份報告只重讀其中 4 個關鍵事實，不是每份隨機三個數字；2) `research-pool.mjs` 的 ingest／record-search 寫回沒有執行；3) 沒有另派「沒參與精讀」的 agent 抽查 |

## 待解問題

⚪ 整條鏈試過仍無公開資料：

- box 的 CPU／RAM／磁碟、休眠逾時、保存期限、同時連線數、每操作 credit 成本
- Windows 365 for Agents 的 vCPU／RAM
- Runloop 單一 devbox 規格上限與最長存活
- Modal 明確的 vCPU／記憶體上限表；Modal、Vercel、Cloudflare 的具體恢復秒數；Cloudflare 與 Modal 的官方 sandbox MCP
- Cua 精確星數（約 32k 只來自搜尋摘要）
- Orgo 與 Windows 365 for Agents 的獨立負評
- OSWorld 官方榜表（JS 渲染讀不到）

✉️ 只能問廠商：

- Simular：自帶模型的 agent 操控 box 是否扣 credits？box 的模型呼叫是否就是 Sai credits？免費檔實際規格與休眠規則？
- Fly：Sprites checkpoint 是否存記憶體？試用額度 $30 還是 $1？
- Daytona：Windows $0.0858/vCPU-h 是加價還是取代？桌面同時串流數？
- Morph：Free 檔實際含什麼？

## 其他說明

- 本研究由 7 個 subagent 平行蒐集後整合；每份報告都要求官方頁整份讀完、價格附對照條件與日期、至少跑一輪反證搜尋。
- 本次研究期間，Orgo／Cua 組的 subagent 呼叫了一次 `add_repo`（`trycua/cua`）。結果為「公開 repo，session git proxy 已能匿名讀取，未附加任何東西」，沒有擴大權限。
