# Research note：Moshi — 手機終端機 app（AI coding agent 專用）

日期：2026-08-27
狀態：draft research note，未發文

## 子問題

1. 產品定位與核心機制（local-first 架構、moshi-hook daemon 角色）
2. 定價與版本（免費版 vs Pro）
3. Agent 整合廣度（moshi-hook 支援清單、整合深度）
4. 與 Claude Code 官方 Remote Control 的差異
5. 安全性設計（SSH key 存放、biometric、無 cloud relay 的具體機制）
6. 團隊背景、上線時間、使用者評價

## 核心概念

Moshi 不是聊天式的「agent client」，而是一個**行動裝置終端機 app**：透過 SSH／Mosh／ET（Eternal Terminal）直連使用者自己控制的機器（Mac、Linux、VPS、WSL），開一個「真的 shell」。AI coding agent（Claude Code、Codex 等）本身還是跑在使用者自己的機器上，Moshi 只是手機端的操作介面 + 通知層。

官方自我定位的比喻：「baby monitor for your AI agents」——agent 在跑的時候你不用守著，它負責在需要你時（approval、完成、卡住）用通知把你叫回來。

架構分兩層：

- **Moshi core（app 本身）**：純終端機功能，不需要任何 host 端安裝——SSH/Mosh 連線、biometric key 保護、語音輸入、agent usage 追蹤全部靠 client 端 + 標準 SSH 就能動。免費。
- **`moshi-hook`（選用的 host 端 daemon）**：裝在你自己的機器上，把 Claude Code / Codex / OpenCode 等 agent 的 hook 事件（approval、完成、tool 執行）正規化成統一的 inbox 事件，並開一個只 bind `127.0.0.1:24543` 的本地 gateway，供 diff viewer、browser preview、live multiplexer 偵測使用。這一層才是「agent-aware」的來源。

**沒有 wrapper command，沒有 host daemon 取代你的 shell**——這是官方在多篇 compare 文章反覆強調的差異點：你開的還是你平常在桌機上用的同一個 shell / tmux session，Moshi 只是換了個螢幕接上去。

## 關鍵設計決定

- **Local-first，不經公司伺服器 relay 終端機內容**：官方文件（`/docs/hooks` 的 Data privacy 段落）明確拆分「哪些資料留在 host↔phone 直連通道」vs「哪些送到 Moshi 伺服器」：
  - 留在本地／直連：完整 Claude Code / Codex 對話 transcript、diff 內容、原始碼、實際終端機流量。
  - 送到伺服器：只有通知摘要——prompt 前 200 字、assistant 回應前 80 字、approval 指令前 256 字，加上 project 名稱、session ID、agent、model、token 用量等 metadata。
  - 這是可查證的具體承諾（而非空泛的「我們重視隱私」行銷話），值得在文章裡明確引用邊界。
- **終端機渲染用 Ghostty + Metal GPU 繪製**（依 `/compare/blink` 內容），對長時間 agent 輸出的滾動效能與省電是特意的技術選擇，對比多數 SSH app 走 CPU 繪製。
- **Multiplexer 分三級支援**：tmux／Zellij／Herdr（agent-aware 的新 multiplexer）。tmux 支援最完整（含 `moshi <dir>` 專案啟動器），Herdr 次之（缺 `moshi DIR` launcher 但其餘功能對等甚至更深，因為 Herdr 自己就有 agent 狀態），Zellij 只有核心連線流程，缺 Jump To 導覽與 reconnect auto-attach。
- **免費版刻意做到「真的堪用」而非閹割版誘餌**：無限 session、SSH 全功能、2 個已存連線、biometric key 保護、agent usage 追蹤全部落在免費層；Pro 主要解鎖的是「重度使用」才會踩到的牆——Mosh 傳輸、multiplexer 深度整合、image paste、diff viewer、browser preview。

## 定價（2026-08 查證，來源：`/pricing` + `/docs/subscription`）

| 方案 | 價格 | 備註 |
|---|---|---|
| Free | $0 | 完整 SSH 終端機、2 個已存連線、agent 通知（10 fan-out/60s）、biometric key、inbox 前 5 動作免費試用、cloud 語音 3 分鐘/月 |
| Pro Monthly | $7.99/mo | 隨時取消 |
| Pro Yearly | $69.99/yr（≈$5.83/mo，省 27%） | 官方標示「多數人選這個」 |
| Pro Lifetime | $199 一次性 | 限時提供 |

Pro 解鎖：Mosh 傳輸、ET（實驗性）、multiplexer 深度整合、image paste、diff viewer、browser preview、無限已存連線、cloud 語音 60 分鐘/月、無限 inbox 動作、Apple Watch 操作（非唯讀）、更高通知 fan-out（60/60s）、跨裝置 unified push、自訂主題/字型。

⚠️ **價格演變（需在文中註明是快照，非長期穩定值）**：App Store 頁面同時列出已過期/限時的早鳥方案（`Moshi Founder Yearly $19.99`、`Moshi Pioneer Yearly $29.99`），與三方索引站 Grokipedia 提到「$20/year」的說法時間點吻合（2026-03 快照）。目前（2026-08）官網現行公開價是 Pro Yearly $69.99——**價格已上漲，寫文章時要用當前公開頁為準，並註明這是會變動的訂閱定價**。

## Agent 整合（來源：`/docs/hooks`「Supported agents」表）

`moshi-hook` 支援的 agent 分兩個獨立能力：

- **Hooks & inbox**（把事件正規化進通知/inbox）：Claude Code、Codex CLI、OpenCode、Antigravity、Cursor、Kimi、Qwen Code、Grok Build、Pi、Oh My Pi (OMP)、Hermes。
- **Chat View**（把 agent session 渲染成手機原生對話 UI，需要即時 host-gateway 連線）：官方標示為「experimental」，支援的 agent 名單比 hooks 名單窄。

官方明確定位「Claude-Code-first」——首頁與文檔多處把 Claude Code 列為第一優先，其他 agent 是後續擴充的「broad roster」。任何未在名單上的 CLI 仍可在 Moshi 終端機正常執行，只是拿不到 agent-aware 的通知/inbox/approval 卡片。

## 與 Claude Code 官方 Remote Control 的差異

官方 `/compare/anthropic-remote-control` 頁的核心論點：**「Remote Control 延伸 Claude；Moshi 延伸整台機器」**。

| 面向 | Claude Code Remote Control | Moshi |
|---|---|---|
| 定位 | Anthropic 第一方，Claude 專用 | 第三方，跨 agent 廠商的終端機 |
| 連線方式 | 透過 claude.ai/code，continue 一個 Claude 對話 | 直連自己機器的 SSH/Mosh，真實 shell |
| 支援 agent | 只有 Claude | Claude Code、Codex、OpenCode、Grok、Cursor 等（見上表） |
| 持續性模式 | Claude 對話本身的延續 | tmux/Zellij/Herdr session，agent 只是其中一個跑在裡面的行程 |
| 價格 | 免費（隨 Claude 帳號） | Free tier 陽春夠用，深度功能要 Pro 訂閱 |
| 何時選它 | 只用 Claude、要免費第一方方案 | 多 agent 混用、需要完整 shell（git/vim/htop/log/測試）、需要 tmux 級持久 session |

另有一個常被搞混的 Anthropic 官方功能是 `/teleport`——那是把 claude.ai 網頁對話「搬進」本機 Claude Code 終端機 session，跟 Remote Control（從別的裝置遙控本機 session）是不同機制，Moshi 的 compare 文章沒有特別著墨這塊，但寫文章時應該分清楚三者：Remote Control vs teleport vs Moshi。

同類產品還有 **Happy**（免費開源、relay 架構，經過 Happy 自己的伺服器轉發加密 blob）與 **Termius / Blink Shell / ShellFish**（傳統 SSH client，近期補上 agent 感知功能）。Moshi 官網自己排出 6 個 compare 頁（Termius、Remote Control、Blink Shell、ShellFish、Happy、Kittylitter），一致的論調是「我們是直連的真終端機，不是 relay 出去的聊天介面」。

## 安全性設計（來源：`/privacy` + `/docs/connections` + `/docs/hooks`）

- SSH private key 存在 **iOS Keychain**，用 Face ID / Touch ID 閘門保護；複製私鑰需要 biometric 二次確認。
- 官方明白宣告「不是外部或硬體 SSH agent 的橋接器」——每個連線精確對應一把儲存在本機的私鑰，PIV／security key 無法轉發。
- 語音輸入分兩種引擎：本機 Whisper／Apple 內建（完全 on-device，無配額）與 cloud 語音（送到 OpenAI 做轉錄，免費 3 分鐘/月，Pro 60 分鐘/月）——這是隱私政策裡唯一「內容」會離開裝置的路徑，值得在文章裡點出來，避免讀者誤以為「全部語音都是 on-device」。
- 第三方服務清單（隱私政策揭露）：Expo + Apple Push（推播）、OpenAI（cloud 語音）、Apple/Google（購買驗證）、Mixpanel + Google Analytics（用量分析，不含終端機內容）、Resend（授權金鑰信件）。
- moshi-hook 的 data privacy 邊界前面已列（transcript/diff/原始碼走本地 gateway 不經 Moshi 伺服器，只有通知摘要 + metadata 上送）。這點跟隱私政策的敘述一致，交叉驗證沒有衝突。

## 團隊背景

官網首頁署名創辦人為「**Joel**」，X（Twitter）帳號 `@odd_joel`，公司登記名稱為 **Moshi Tech Ltd.**（見 App Store 開發者欄位）。

⚠️ 需要在文章裡明確排除混淆：這位 Joel **不是** Joel Spolsky（Stack Overflow / Trello 創辦人、「Joel on Software」部落格作者）。搜尋過程中兩者同名容易被搜尋引擎混在一起，找不到 Joel（`@odd_joel`）的完整真實姓名、公司規模或先前創業經歷的獨立來源——這塊標記 `[unverified]`，若要寫進文章需再查 X/Twitter 個人檔案或訪談，不能用 Joel Spolsky 的背景頂替。

## 上線時間與版本狀態

- App Store 頁面署名日期 2026-02-24；Terms of Service「Last updated: January 2026」；Privacy Policy「Last updated: May 2026」——綜合判斷 app 大約在 **2026 年初（1–2 月）上線**，此後持續迭代（文檔多處標「updated 1 week ago」「updated yesterday」，顯示更新頻率相當高）。
- App Store 評分：US store 4.8 分、487 則評分（查證時間 2026-08）。多篇第三方/自媒體評測（YouTube「Testing Moshi」影片、Reddit r/SideProject 自我介紹貼文）描述其為「agent-first，不是 terminal-first」的新進者，相對 Termius 等老牌 SSH client 是後進者但評價正面（「polished」「smooth」）。
- 目前无法找到正式的 changelog 頁面（`getmoshi.app/changelog` 未驗證存在），版本歷史細節（何時加入哪個 agent、何時上 Zellij 支援）**未逐版查證**，只能確認「持續且高頻更新」這個大方向。

## 使用者評價摘要

- 正面：App Store 評論多次提到「Moshi + tmux + [agent CLI]」組合是「終於等到的手機端 coding agent 工作流」；YouTube 評測者認為 UI 比 Termius 更順、更「為 agent 設計」而非「縮小版桌面終端」。
- 中性/觀察：這款產品跟 mosh 協定本身（2012 年 USENIX 論文出身的老工具）沒有繼承關係上的爭議，HN 上的相關討論主要是在討論 mosh 協定本身或其他競品（Blink 的新 iOS client「Echo」），不是直接針對 Moshi 這個 app 的技術批評——**目前沒找到對 Moshi 本身有實質技術負評的獨立討論串**，這代表資訊還新、討論量不夠大，不是「經過大量社群審視後仍口碑良好」。
- Moshi 自己的 compare 文章對競品的評語相對誠實（例如承認 Blink Shell 開源、Happy 免費開源、Termius 生態更廣），但這些文章畢竟是 Moshi 自己發的行銷內容，比較表格的措辭傾向會偏向自己（如強調自己「Hybrid cockpit」「Broad hook roster」），寫文章時要標記來源是廠商自述，不能當獨立評測引用。

## 事實交叉表

| 事實 | 來源 A | 來源 B | 狀態 |
|---|---|---|---|
| 免費版無帳號無卡片即可用 | 官網首頁 | `/docs/subscription` | ✅ |
| Pro Yearly $69.99（2026-08） | `/pricing` | App Store 定價列表 | ✅（App Store 另列多組已過期/區域價格，屬正常現象） |
| SSH key 存 iOS Keychain + biometric | `/privacy` | 第三方 app 索引站 mwm.ai | ✅ |
| Transcript/diff 不經 Moshi 伺服器，只有摘要上送 | `/docs/hooks` Data privacy 段 | `/privacy` | ✅ 兩份文件敘述一致 |
| Claude Code Remote Control 免費、Research Preview 起步 | Moshi `/compare/anthropic-remote-control` | 第三方部落格 zackproser.com、Reddit r/ClaudeCode | ✅ |
| moshi-hook 支援 11 種 agent 的 hooks | `/docs/hooks` | — | ⚠️ 單一來源（官方文檔），數量隨版本可能變動，發文前建議重新確認一次 |
| 創辦人 Joel（`@odd_joel`），公司 Moshi Tech Ltd. | 官網首頁署名 | App Store 開發者欄位 | ✅ 名字/公司一致；但 Joel 本人背景資料不足，標 `[unverified]` |
| 上線約在 2026 年 1–2 月 | Terms of Service 更新日期 | App Store 頁面日期 | ⚠️ 推論而非官方明示的「發布日」 |
| Ghostty + Metal GPU 渲染終端機 | `/compare/blink` | — | ⚠️ 單一來源，屬技術細節宣稱，未在其他頁交叉確認 |

## 適合 / 不適合的情境

**適合**：
- 平常已經在 host 機器上用 tmux/Zellij/Herdr 跑長時間 agent（Claude Code、Codex 等），只是想要手機能插進同一個 session 看狀態、按 approve。
- 混用多家 coding agent，不想因為換 agent 就換一個遙控 app。
- 對「內容不經過廠商伺服器」有明確要求（本地部署／合規敏感的工作環境）。

**不適合**：
- 只用 Claude Code、只需要偶爾從手機回覆一句 approval——Claude Code 官方 Remote Control 免費且第一方，够用就不必多付一個訂閱。
- 完全不想在自己機器上裝額外 daemon（`moshi-hook`）——雖然核心終端機功能不需要它，但少了它就沒有 agent-aware 的通知/inbox/diff。
- 需要團隊共享/多人協作的遠端存取（Moshi 明確定位「一人一機」，沒有像 Termius Pro 那種團隊 vault）。

## 限制 / 已知問題

- Chat View（把 agent session 渲染成原生對話 UI）官方自己標示「experimental」，且只覆蓋 agent 名單裡的一部分。
- 免費版 inbox 只有 5 次動作試用額度，超過要嘛看免費 fan-out 上限、要嘛升 Pro。
- 沒有正式 changelog／版本歷史頁可供逐版查證，功能等級的說法都只能靠現況文檔快照，寫文章時建議明確標時間戳「截至 2026-08」。
- 創辦人與團隊規模資訊稀薄，屬單人或極小團隊 indie app 的常見狀態，難以評估長期維護與規模化能力（沒有公開的資金或團隊人數資訊）。

## 取捨總結

Moshi 賭的是「終端機優先、agent 是終端機裡的一個行程」，而不是「agent 優先、終端機是附屬功能」。這個定位讓它同時要跟兩種對手競爭：傳統 SSH client（Termius、Blink Shell）和新興 agent 專屬 client（Happy、Claude Code Remote Control）。相對傳統 SSH client，它多了 agent 感知的 inbox/approval/diff；相對 agent 專屬 client，它保留了「這就是我平常用的那個 shell」的完整性與 local-first 的信任模型。付費模式合理（免費版真的堪用，Pro 解決的是重度使用者才會撞到的牆），但作為 2026 年初才上線的獨立開發者產品，長期維護能力與大規模社群審視都還缺乏數據，寫文章時要如實標註「新產品、資訊來源多為官方一手文檔」這個限制。

## 草稿骨架（供 post skill 使用）

1. 開場：为什么手機需要一个「真的」终端机，而不是聊天式 agent client（引 Remote Control vs Moshi 的定位差异）
2. Moshi 是什么：local-first 架构、moshi-hook 分层设计
3. 核心功能走一輪：SSH/Mosh 韧性连线、tmux/Zellij/Herdr 整合、agent inbox、diff viewer、语音输入
4. 安全模型细看：key 存放、biometric、什么内容留本地/什么上送服务器
5. 跟 Claude Code Remote Control、Happy 的对比（各自适合的场景）
6. 定价与免费版是否够用
7. 限制与观察期的保留态度（新产品、团队资讯稀薄）
8. 结论：适合谁、什么时候该等等看

## 待補查證（發文前）

- 重新確認 moshi-hook 支援 agent 清單是否有變動（單源官方文檔）。
- 若要寫「創辦人」段落，需另外查證 `@odd_joel` 的公開身分資訊，不能用 Joel Spolsky 頂替。
- Ghostty + Metal 渲染的技術細節建議找 Moshi 官方部落格或工程文章做第二來源。
- 若引用「4.8 分 / 487 則評分」，發文前應重新讀一次 App Store 頁面確認數字未變。
