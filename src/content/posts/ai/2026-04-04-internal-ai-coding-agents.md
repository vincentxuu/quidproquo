---
title: "從 Stripe 到 Meta：矽谷一線公司如何用 AI Agent 取代鍵盤"
date: 2026-04-04
type: guide
category: ai
tags: [ai-agent, coding-agents, stripe-minions, agentic-coding, developer-tools, automation, meta, google, uber, amazon]
lang: zh-TW
tldr: "矽谷一線公司各自獨立打造內部 AI coding agent，從 Slack 訊息到 merged PR 全程自動化。深入拆解 Stripe、Ramp、Coinbase、Spotify 四家的架構與 2026 年最新成長數字（Stripe 7,000+ PRs/週、Ramp 75% merged PRs），再擴展到 Google、Meta、Amazon、Uber、Shopify、PostHog 等十多家公司的做法與指標。"
description: "深入介紹 Stripe Minions、Ramp Inspect、Coinbase Forge（原 Cloudbot）、Spotify Honk 的架構設計與最新關鍵指標，再擴展到 Google Agent Smith、Meta DevMate、Amazon Kiro、Shopify River 等十多家公司的內部 AI coding agent 全貌。"
draft: false
series:
  name: "AI Agent 實戰"
  order: 5
---

2026 年初，一個現象逐漸浮出水面：矽谷頂尖工程團隊不約而同地在內部打造自己的 AI coding agent。不是用 Copilot 做 autocomplete，而是真正的 end-to-end 自動化——從一句 Slack 訊息到一個 production-ready 的 PR，全程不需要人碰鍵盤。

這篇文章先深入拆解四家代表性公司的做法——Stripe、Ramp、Coinbase、Spotify——再擴展到 Google、Meta、Amazon、Uber 等十多家公司的全貌，以及它們最終收斂出的共同架構模式。

---

## Stripe Minions — 每週 1,300 PRs 的 Slack Emoji 工作流

Stripe 的 Minions 是目前公開資訊最完整的內部 coding agent，由工程師 Steve Kaliski 的團隊打造，2026 年 2 月正式對外分享技術細節。

### 觸發方式

工程師在 Slack 中對任何描述任務的訊息加上特定 emoji reaction（例如 `:create-minion-payserver:`），一個 bot 就會確認 Minion 已啟動。原始的 Slack 訊息直接成為 agent 的 prompt。

也支援 CLI、Web 介面、以及自動化系統（例如 flaky test detector）觸發。但最常見的路徑就是 Slack。

### 五層 Pipeline

Minions 的架構可以拆成五層：

```
1. Invocation    — Slack emoji / CLI / Web / 自動化系統觸發
2. Devbox        — 隔離 VM，~10 秒啟動，預載 Stripe 程式碼與服務
3. Toolshed MCP  — 集中式 MCP Server，管理 ~500 個內部工具
4. Agent Loop    — Blueprint 架構（確定性節點 + Agent 節點交替）
5. Output        — Lint → CI（最多跑 2 輪）→ 開 PR 等人 review
```

### Blueprint 架構

這是 Minions 最核心的設計。Blueprint 是一種 orchestration template，把兩種截然不同的步驟串在一起：

- **確定性節點（Deterministic Nodes）**：固定、可預測的操作——git push、linting、CI 執行、格式檢查
- **Agent 節點（Agentic Nodes）**：LLM 驅動的推理和程式碼生成

兩者交替執行形成 feedback loop：AI 生成程式碼 → 確定性節點驗證能不能編譯 → AI 提出重構 → 測試跑一次確認沒壞。不依賴 AI 每次都對，而是用確定性的 checkpoint 把錯誤攔住。

一個典型的 Blueprint 流程長這樣：

```
Slack 觸發（確定性）→ clone repo + 環境設定（確定性）
→ 理解任務 + 規劃實作（agentic）→ 撰寫程式碼（agentic）
→ 跑 linter（確定性）→ push branch（確定性）
→ 修 CI 失敗（agentic，最多 2 次）→ push 最終版（確定性）
→ PR ready for review
```

CI 修復上限設為 2 次是刻意的設計——如果 LLM 兩次修不好，第三次也不會有幫助，只是在燒算力。此時系統會標記讓人類接手。

這其實是兩個更普遍的工程模式，只是套用在 agent pipeline 上而已。Blueprint「確定性節點守住 agent 節點」的本質是**薄 spec、厚 gate**：prompt（spec）可以寫得隨性，因為真正擋錯誤的不是要求 agent 一次寫對，而是後面一整排 lint、CI、type check 這些「厚」的驗證閘門。CI 修復上限設 2 次，則是分散式系統可靠度工程裡常見的 **circuit breaker（斷路器）**模式，搬進了 coding agent。與其讓 agent 無限重試燒算力、拖住整條 pipeline，不如設一個失敗次數上限，超過就跳閘丟給人類，不再假設「再試一次應該會成功」。

針對不同任務類型（dependency 更新、API 遷移、測試生成、文件撰寫）有專門的 Blueprint，由 orchestration layer 自動路由。

### Toolshed MCP Server

Stripe 內部有超過 500 個工具，但把全部塞給 AI 會造成 token paralysis。Toolshed 是一個集中式 MCP（Model Context Protocol）Server，根據任務類型策展出約 15 個最相關的工具子集，讓 agent 從一開始就擁有精準、高密度的 context。

### Devbox 隔離環境

每個 Minion 都跑在獨立的 AWS EC2 VM（Devbox）上——跟真人工程師用的 dev box 規格完全相同，預載 Stripe 完整源碼、warmed Bazel cache、type-checking cache。

Stripe 預先佈建一個 warm pool，觸發時從 pool 中抓一台，因此只需要 **~10 秒**就能啟動。沒有 internet 存取、沒有 production 存取、沒有真實使用者資料，完全 sandbox。任何錯誤的爆炸半徑都被控制在一台用完即丟的 VM 內。

另一個細節：agent 在檔案系統中移動時，directory-scoped rule files 會自動附加——不是一整包 global context 塞進去，而是根據所在目錄動態提供指引。這避免了 context window 爆滿的問題。

### 關鍵指標

- 每週 merge 量從公開時的 **1,300+ PRs**，八個月內衝到 **7,000+ PRs**（2026 年 8 月），佔 Stripe 全公司 merged PRs 的 **~30%**
- 所有 PR 皆含零人工撰寫的程式碼
- 每個 PR 仍需人工 code review
- 底下的程式碼支撐 Stripe 每年超過 **$1 兆** 的支付交易量

### 起源與設計哲學

Minions 的 core agent 是 Block 開源的 Goose 的 internal fork。關鍵改造是把所有「給人用的」部分拿掉——interruptibility、確認對話框、人類觸發的命令——換成完全無人值守的 one-shot 模式。

Steve Kaliski 稱這種模式為 **"pair prompting"**——一種新型態的 pair programming。他的核心觀點是：「好的人類開發者體驗，同時也會帶來好的 AI agent 結果。」讓人類開發者高效的基礎設施（devbox、tooling、CI），同樣讓 agent 變得高效。

Stripe 團隊的架構哲學可以濃縮成一句：**"The walls matter more than the model"**——agent 周圍的護欄、基礎設施和約束，比你用哪個 LLM 更重要。Devbox 基礎設施、300 萬個測試、500 個 MCP 工具——這不是一個新創公司能一夜之間複製的東西。

---

## Ramp Inspect — 30% Merged PRs 來自 Agent

Ramp 是矽谷成長最快的企業支出管理平台，他們的內部 coding agent 叫 Inspect。

### 技術架構

Inspect 建構在 OpenCode（開源 AI coding CLI 工具）之上，搭配 Modal 雲端容器提供隔離的 sandbox 環境。每個任務都在獨立容器中執行，可以跑測試、lint、type check，確保產出的程式碼在提交前就通過基本品質閘門。

### 觸發方式

主要透過 Slack 觸發——工程師在 Slack channel 中描述任務，Inspect 啟動容器、執行工作、完成後回 Slack 貼出 PR 連結。也支援 CLI。

### 適用場景

- Bug 修復
- 小型功能實作
- 重構與程式碼遷移
- 測試撰寫
- Boilerplate 生成

所有 agent 產出的 PR 仍需人工 review，Inspect 定位是增強而非取代人類判斷。

### 關鍵指標

- 2026 年 1 月約 30% 的 merged PRs 由 Inspect 產出，**2026 年 8 月已衝到 75%**（每四個 PR 有三個來自 Inspect），累計超過 **100 萬次 session**
- 團隊採用率極高，大多數工程師日常使用
- 瓶頸已經從「寫程式碼」轉移到「審 PR」——這是所有走到這個規模的團隊都會撞到的牆

### 視覺驗證

Inspect 整合了 visual DOM verification——不只看程式碼能不能跑，還能透過 DOM 快照驗證 UI 改動的正確性。這在前端任務上特別有價值。

---

## Coinbase Forge — Agent Councils + Auto-Merge，加上 Mux 多 Agent 編排

Coinbase 的內部 coding agent 名字換過兩次：一開始叫 Claudebot，多模型化之後改名 Cloudbot，2026 年再定名為現在的 **Forge**（本文以下沿用現名；如果你看到其他地方寫 Cloudbot，指的是同一套系統）。它最大的差異化特色是它的 **agent council** 機制和 **auto-merge** 能力。

### Agent Councils

Forge 不是單一 agent 獨立作業。它採用多 agent 組成的「council」架構——一個 agent 寫程式碼，其他 agent 扮演 reviewer 和 validator 角色，在人類介入之前先完成一輪內部評審。

這個 ensemble/consensus 機制降低了單一 LLM 出錯的風險，也讓系統有信心在特定條件下自動合併。

### Auto-Merge

跟其他三家都不同的是，Forge 在 **CI 測試全通過 + agent council review 正面** 的情況下，可以自動合併 PR，不需要人工介入。人類開發者只在複雜案例中才需要手動 review。

這是一個大膽的設計選擇——把人從 loop 中拿掉，完全信任自動化品質閘門。

### 觸發方式

透過 Slack 命令或 PR 留言觸發，主要處理 dependency 升級、程式碼遷移、boilerplate、測試生成等機械式任務。

### 從零打造

不同於 Stripe 和 Ramp 各自基於開源工具（Goose、OpenCode）修改，Coinbase 的 Forge 是完全自研的——包含 agent council、auto-merge pipeline、和內部架構理解能力。

### 關鍵指標

- 2026 年 2 月：Forge 產出 Coinbase 全公司 **5%** 的 merged PRs，PR cycle time 從 ~150 小時砍到 ~15 小時（10x）
- 服務 1,000+ 名工程師，透過 Slack、Linear、MCP 整合進日常工作流

### Mux — 工程師自己孵化出來的多 Agent 編排工具

2026 年 5 月，Coinbase 官方部落格公開了另一個內部工具 **Mux**：一個讓工程師同時操控多個 agent 平行作業的多 agent 編排層。它的起點不是自上而下的產品規劃，而是一名工程師為了解決自己的問題寫的側案——每個 agent 拿到自己的 git worktree、自己的分支、自己的終端機，彼此不衝突、不用 stash。分享到 Slack channel 之後自然擴散，沒有推廣活動。

上線一個月內（截至 2026 年 4 月），Mux 已經：

- 累積 **600+ 使用者**（工程師、PM、設計師都在用），其中 335 人活躍、197 人是重度使用者
- 跨 461 個 repo、10 個組織，合併了 **5,068 個 PR**
- 重度使用者平均每人產出 **3.5 倍**於基準的 merged PRs（39.6 vs 11.4）

Coinbase 官方把這個轉變定調為「工程師從 implementer 變成 orchestrator」——盯著三、四個平行跑的 agent（一個寫 API、一個補測試、一個修 bug、一個做重構），自己負責審查與整合，而不是下場自己寫。

---

## Spotify Honk — 從手機描述需求到 Merged PR

Spotify 的內部 coding agent 叫 Honk，透過三篇 Spotify Engineering Blog（2025 年 11-12 月）公開完整技術細節。

### 起源

Spotify 從 2022 年就開始建構 **Fleet Management** 框架，用來跨數百個 repo 批量套用程式碼改動。2025 年 7 月，他們把 Claude Agent SDK 整合進這個框架，Honk 就此誕生。

在此之前 Spotify 試過自研 agent，但發現自研方案「需要過度嚴格的指令，遇到複雜的多步驟編輯就卡住」。換成 Claude Code 後，反而用**描述終態**的 prompt 風格效果更好——告訴 agent 你要什麼結果，而非一步步教它怎麼做。

### 工作流程

Claude Code 讀取 codebase、理解架構、撰寫實作、跑測試、push 新版本，最後**透過 Slack 通知工程師**。工程師可以直接在**手機上 review**，確認沒問題就 merge 到 production。

遷移的 prompt 是 **version-controlled in Git** 的，Spotify 內部的 orchestration 系統負責觸發 Claude Code agent。

### 三層品質保證

Spotify 在 Part 3 blog 中詳述了三種最擔心的失敗模式：

1. **Agent 沒產出 PR**——影響小，重試就好
2. **PR 通過 CI 但功能錯誤**——最嚴重，會侵蝕團隊信任
3. **產出不可預測**

解法是 **verification loop**：agent 生成改動 → 跑 formatter/linter/build/test → 失敗就用錯誤訊息重新進入 loop，加上 verifier 和 judge 機制引導 agent 往正確方向走。

### 主要用途

Honk 的殺手級應用是**大規模程式碼遷移**——跨數百個 repo 的 deprecated API migration，至今已完成約 **50 次遷移**。

CTO Gustav Söderström 對分析師說：

> Spotify 最好的開發者從 2025 年 12 月起就沒有親手寫過一行程式碼了。

### 關鍵指標

- 累計 merge **1,500+ agent PRs**
- 目前每 10 天 merge **1,000 PRs**——2026 年 3 月 QCon London 上 Spotify 團隊證實：半年前這個量還要花三個月才能達到，現在縮到 10 天，加速了近 18 倍
- 遷移任務節省 **60-90%** 時間
- 建構在 Claude Code + Claude Agent SDK 上

### 2026 下半年：從遷移工具變成日常基礎設施

2026 年 4 月的 Part 4 blog 記錄了一次教訓：Honk 被用去處理跨團隊的下游資料集遷移時，因為改動範圍超出它能自行驗證的界線，原本最關鍵的「verify 自己的工作」能力用不上，只能靠下游團隊自己手動測試再合併——提醒了這套系統的能耐是有邊界的，不是什麼任務都能無腦丟給它。

到了 6 月的 "Coding is no longer the constraint" 一文，Spotify 把 Honk 直接整合進 Fleet Management 工具鏈：Fleetshift 負責人類端的編排（挑目標、排程、追進度），Honk 負責實際改程式碼，一個團隊可以一眼看到遷移任務開了幾個 PR、合併了幾個、哪些卡住需要人看。文章標題本身就是結論——寫程式碼已經不是瓶頸，審查才是，這和 Ramp Inspect 撞到的牆是同一道牆。

---

## 共同架構模式

LangChain 創辦人 Harrison Chase 觀察到 Stripe、Ramp、Coinbase 三家公司獨立開發卻收斂出極為相似的架構，因此在 2026 年 3 月發布了 Open SWE——一個開源框架，把這些共同模式抽象出來。

以下是四家公司的核心設計選擇：

### 1. 隔離雲端沙箱

每個 agent 任務都跑在獨立的容器或 VM 中，不能碰 production、不能碰 internet（Stripe）、或只能存取特定範圍的資源。這是信任的基礎。

### 2. Slack-First 觸發

四家公司都以 Slack 作為主要觸發入口。工程師不需要切換工具，在日常溝通的地方直接下達指令。

### 3. 精選工具集

不是把所有內部工具都灌給 agent，而是根據任務類型動態策展一個小而精的工具子集。Stripe 的 Toolshed 管理 ~500 工具但每次只給 ~15 個。

### 4. Context 注入

從 Linear issue、GitHub PR、Slack thread 等來源注入豐富的 context，讓 agent 理解任務的完整背景。

### 5. Sub-Agent 編排

複雜任務會拆分給多個 sub-agent 協作，而非單一 agent 扛所有事。

### 6. 厚 Gate 守薄 Spec，出錯就斷路

四家公司的驗證機制看起來實作各異——Stripe 的確定性節點、Ramp 的 sandbox 自我驗證、Coinbase 的 agent council、Spotify 的 verification loop——但收斂到同一個原則：**agent 端的 spec/prompt 可以寫得薄，因為真正擋住錯誤的是後面那一層厚重、確定性的驗證閘門**（lint、CI、測試、council review）。而所有系統都對「重試」設了上限，這是分散式系統裡的 circuit breaker 模式：與其讓 agent 無限重試燒算力，不如失敗到一定次數就跳閘丟給人。這也是為什麼 Stripe 工程團隊會說 **"the walls matter more than the model"**——換掉底層 LLM 相對容易，但這圈驗證閘門和斷路器，才是真正扛住規模化生產風險的東西。

### 並排比較

| 特性 | Stripe Minions | Ramp Inspect | Coinbase Forge | Spotify Honk |
|------|---------------|--------------|-------------------|--------------|
| **基底** | Goose fork | OpenCode | 自研 | Claude Code + Agent SDK |
| **觸發** | Slack emoji | Slack / CLI | Slack / PR comment | 自然語言描述 |
| **沙箱** | 獨立 VM | Modal 容器 | 雲端沙箱 | 背景環境 |
| **Review** | 人工必要 | 人工必要 | Agent council + auto-merge | 人工必要 |
| **週 PR 量** | 1,300+ → **7,000+**（2026-08） | 30% → **75%**（2026-08） | 5% company-wide + Mux 5,068 PR/月 | 1,000/10天 |
| **特色** | Blueprint 架構 | Visual DOM 驗證 | Auto-merge，另加 Mux 多 agent 編排 | Verification loop + 遷移優化 |

---

## 其他公司也在做

不只上述四家。從金融科技新創到打造前沿模型的 AI 實驗室自己，以下是其他有公開資訊的大型公司：

### Google — Agent Smith，加上一個更廣的 75% 官方數字

Google 的內部 coding agent **Agent Smith** 在 Q3 2024 就已負責 **25%+ 的新 production code**（Sundar Pichai 財報電話會議），Q1 2025 突破 30%。它接收高層級任務描述，自行拆分子任務、跨多個檔案撰寫程式碼、跑測試、迭代，直到 PR ready 才給人類 review。2026 年初正式上線後太受歡迎，Google 不得不限制內部存取。

2026 年 4 月，Pichai 在 Google Cloud Next 官方部落格另外公布一個更高、範圍也更廣的數字：Google **全公司新程式碼有 75% 是 AI 生成、經工程師核准**，比前一年秋天的 50% 又往上跳了一截。這個數字跟 Agent Smith 的 30% 不是同一件事——後者測的是完全自主、端到端的 agent PR，前者則涵蓋所有「AI 產出、人類過目」的程式碼（包含 autocomplete、Gemini 輔助等更廣的用法），兩個數字並存反而說明：全自主 agent 的滲透率遠低於「AI 輔助寫程式」的整體滲透率。

外部產品方面，Google 推出 **Antigravity**——agent-first 的 IDE，支援同時編排多個平行 agent 在不同 workspace 工作。

### Anthropic — 用 Claude 寫 Claude 自己的程式碼

Anthropic 自己是這套模式走得最極端的案例。2026 年 5 月，官方研究報告《When AI Builds Itself》公開一組數字：Anthropic 生產環境 merge 的程式碼裡，**超過 80% 是 Claude 寫的**——Claude Code 在 2025 年 2 月上線研究預覽前，這個比例還只是個位數。

報告也交代了品質沒有跟著崩掉的原因：Anthropic 內部跑一個自動化的 Claude reviewer，回溯分析發現它本來可以攔下過去 claude.ai 事故裡約三分之一的生產 bug。這跟 Stripe 的確定性節點是同一個道理——真正扛住規模的是審查閘門，不是模型本身。

其他數字同樣驚人：

- 2026 年第二季，一般工程師每天 merge 的程式碼量是 2024 年的 **8 倍**——Anthropic 自己提醒這個數字會灌水，因為程式碼量從來不是好的生產力指標；130 位研究員的內部問卷估計實際產出提升約 **4 倍**，更保守
- 在最難、規格最不明確的工程任務上，Claude 的成功率從六個月前的 26% 衝到 **76%**（2026 年 5 月）
- 2026 年 4 月，Claude 修了 **800+ 個 fix**，把某一類 API 錯誤發生率砍到千分之一，負責的工程師估計人類要花 **4 年**才能做完同樣的事
- Anthropic 預期 2026 年底前 Claude 撰寫比例會衝過 **90%**

Dario Amodei 在 2026 年 1 月世界經濟論壇上提過，公司內部已經有工程師跟他說「我已經不寫程式碼了」。

### OpenAI — Codex 從工程工具變成全公司預設

OpenAI 走類似的路徑，但敘事重心不太一樣。總裁 Greg Brockman 在 2026 年 5 月 Sequoia AI Ascent 大會上說，AI 現在寫了公司 **80%** 的程式碼（從 20% 一路衝上來）。同月稍早，Fortune 報導 Claude Code 的作者 Boris Cherny（現任職 Anthropic）和一位 OpenAI 研究員都公開說自己「100% 不再手寫程式碼」。

比起單一比例數字，OpenAI 更愛講 Codex 的滲透率：截至 2026 年 6 月，**97.9% 的員工在用 Codex**（2025 年 8 月時大約只有 40%），而且早就不只是工程部門在用——法務、招募等非技術部門也把 Codex 當主要工具，法務部門的月產出中位數是 2025 年 11 月的 **13 倍**。曾參與 Codex 專案的工程師 Calvin French-Owen 離職後寫的部落格提到：團隊曾在七週內用 Codex 從零生出一個完整的內部 beta 產品——從商業邏輯、基礎設施到工具與文件，幾乎全由 Codex 完成。

這幾個數字要留一個但書：業界對這類自報的生產力數字本來就有爭議——2026 年 2 月 NBER 的一篇論文發現，80% 有在用 AI 的企業回報「沒有可量測的生產力影響」。AI 實驗室自己的內部案例再驚人，也不代表所有公司都能複製同樣的結果。

### Meta — DevMate + 多 Agent 體系

Meta 的做法最激進：**DevMate** 不是一個 agent，而是一個 agent 網路——包含 Planner、Researcher、Builder、Reviewer、Negotiator 等角色，協同完成任務。

指標驚人：DevMate 最終產出 **50% 的 code changes**。自 2025 年初起，每位工程師產出提升 30%，重度使用者 YoY 提升 80%。H1 2026 的內部目標是 65% 的工程師用 AI 產出 75%+ 的程式碼。

2026 年 8 月，Meta 另闢一條路線：推出 **Muse Code**——公司第一款終端機（terminal）coding agent（beta），跑自家的 Muse Spark 1.2 模型，主打長時間、跨大型 repo 的多檔案改動，用持久化的 sub-agent 規劃、實作、驗證。跟 DevMate 的多 agent 網路不是同一套系統，顯示 Meta 內部同時押注好幾種型態的 coding agent，而不是收斂成單一架構。

### Amazon — Q Developer 走入尾聲，交棒給 Kiro

Amazon 用 Q Developer 的 code transformation 功能完成了 **30,000 個 Java 應用**從 Java 8/11 遷移到 Java 17。CEO Andy Jassy 在財報電話中透露：節省了 **4,500 開發者年的工時**和 **$2.6 億美元**。平均每個應用的升級時間從 ~50 人天縮短到幾小時，79% 的自動生成 code review 被直接接受。

不過這個成功案例本身正在收攤：AWS 已於 2026 年 5 月官方宣布 Q Developer **停止新戶申請**（5/15 起）、**2027 年 4 月全面停止支援**，資源轉往新的 **Kiro**——一個「spec-driven」的 agentic IDE：工程師先寫結構化的 spec，agent 照 spec 規劃、實作、驗證，而不是逐句回應 prompt。最新的 Claude Opus 4.7 也只在 Kiro 上開放，Q Developer Pro 被鎖在 Opus 4.6。上面的遷移數據依然成立，但它已經是 Amazon 上一代的答案。

Kiro 不只是賣給客戶的產品，AWS 自己內部也在用。2026 年 4 月 AWS Summit London 上，AWS 英國區負責人 Alison Kay 舉了個具體例子：AWS 要把 Bedrock 背後的推論引擎整套重寫，「兩年前你問我，我會說要 40 個工程師、12 個月、外加大量咖啡」——實際上靠 Kiro agent 全程協作（agent 寫程式碼、跑測試、抓 bug、修 bug、部署，工程師睡覺時它們照樣在跑），最後只用 **6 個工程師、76 天**就做完。AWS CEO Matt Garman 也提過，公司內部約 **80% 的開發者每天以某種形式在用 AI**。

不過 Garman 同時是業界少數公開潑冷水的聲音：面對 Google、Microsoft 都在秀「AI 生成程式碼佔比」，他直言這是個「蠢指標」——「搞不好裡面都是爛程式碼；程式碼行數從來不是好的衡量標準，很多時候行數更少反而更好，我一直搞不懂為什麼大家喜歡拿這個數字出來炫耀。」這跟 Ramp、Spotify 撞到的「審查瓶頸」是同一種提醒：PR 量或程式碼量衝高不代表真的在加速交付。

### Uber — Minions + Shepherd + uReview

Uber 的 agent 體系包含三個角色：**Minions**（任務 agent）、**Shepherd**（遷移 agent）、**uReview**（code review agent）。uReview 分析 **90%+ 的 ~65,000 weekly code diffs**，中位數 review 時間只要 4 分鐘，65% 的 AI 評論被採納（高於人類 reviewer 的 51%）。2026 年 3 月，84% 的開發者是 agentic coding 使用者，更新後的數字是 **92% 每月至少用一次 agent、31% 的程式碼由 AI 撰寫**。另一個專職 agent **AutoCover** 負責生成測試，每月產出約 **5,000 個 merged 測試**。

2026 年 9 月，Uber 工程團隊把整套系統定型為 **inner loop / outer loop** 架構：agent 先在自己的沙箱裡完成規劃與驗證（inner loop），確認可行才把 PR 推上公司共用的 CI（outer loop）——避免每個小任務都去擠占昂貴的共享 CI 資源，這跟 Stripe 的「確定性節點守 agent 節點」是同一種薄 spec + 厚 gate 邏輯，只是換了個名字。

### Shopify — River，把 Agent 放進公開 Slack 頻道

Shopify 的內部 agent 叫 **River**，設計上最特別的地方是它只在**公開** Slack 頻道回應、拒絕私訊——目的是把「看別人怎麼跟 agent 對話」變成公司內建的學習場，Shopify 自己稱為「Lehrwerkstatt」（教學工坊）。River 深度整合進 Shopify 的 monorepo「World」，能讀程式碼、跑測試、開 PR、查資料倉儲、看 production trace。

上線 30 天的數字：**5,938 名員工**在 **4,450 個頻道**用過 River，主 repo 一週開出 1,870 個 PR，其中約 **1/8（12.5%）的 merged PRs** 由 River 共同撰寫。2026 年 9 月，Shopify 進一步把 River 用在資安修補——抓到漏洞就自動開 Slack 討論串、生成修補 PR、追到 CI 過關與漏洞紀錄更新為止才算完成。

### PostHog — 小公司的另一種答案：Agent 審 Agent

不是所有故事都發生在大公司。PostHog 的工程師公開了他們怎麼應付「agent 寫程式碼的速度快過任何人能審查的速度」：解法不是逼人審快一點，而是先讓別的 agent 幫忙擋一輪。他們同時派出多個帶著不同指令、甚至不同底層模型的 reviewer agent，分別盯資安漏洞、資料庫設計、效能、命名慣例。關鍵原則是**寫程式碼的 agent 不能審自己的程式碼**——agent 對自己的盲點通常沒有自覺。這跟 Coinbase 的 agent council 是同一個直覺，只是規模小到可以由個別工程師自己組裝。

### Cloudflare — 用自己賣的產品，蓋自己的 AI 開發基礎設施

Cloudflare 也在賣 Agents SDK、Workers AI 這類 agent 基礎設施給客戶，但 2026 年 4 月的官方部落格難得攤開了自己內部怎麼用：過去 11 個月，一個內部代號 iMARS（Internal MCP Agent/Server Rollout Squad）的臨時小組，全程只用 Cloudflare 自己賣的產品——AI Gateway、Workers AI、Access、Sandbox SDK、Agents SDK（Durable Objects）、Workflows——搭出全公司的 AI 開發基礎設施。

過去 30 天的數字：全公司 6,100 名員工中有 3,683 人（**60%**）在用，R&D 部門滲透率高達 **93%**；每月 4,795 萬次 AI 請求，跨 295 個團隊；AI Gateway 每月路由 2,018 萬次請求、處理 2,413 億個 token。合併請求量的四週滾動平均從每週約 5,600 衝到 8,700+，尖峰週逼近 11,000。

架構分三層，跟本文一路強調的「厚 gate」邏輯完全對得上：平台層（認證、路由、推論）、知識層（用開源工具 Backstage 建了一個 16,000+ 節點的知識圖譜，讓 agent 理解內部系統）、**執行層（enforcement layer）**——AI Code Reviewer 加上一套叫 Engineering Codex 的規範，負責在規模化之後還守得住品質。工程師端主力用的 agent 是開源的 **OpenCode**（跟 Ramp 同款選擇），Cloudflare 工程師已經往上游貢獻了 45+ 個 PR。

### NVIDIA — 30,000+ 工程師，程式碼產出翻三倍

NVIDIA 給內部工程師配了一個客製化的 Cursor 版本，2026 年 2 月的報導證實：**30,000+ 名工程師**在用，公司自稱「100% 的工程師都被動員起來用 AI 輔助寫程式」。效果是程式碼提交量翻了 **3 倍**，而 bug 率沒有跟著往上——這點呼應了前面 AWS CEO 對「程式碼量」這個指標的質疑：量能衝高不稀奇，NVIDIA 特別強調品質（bug 率）沒有跟著崩，才是真正值得看的部分。

### Salesforce — 一邊賣 Agentforce，一邊也在買 Anthropic 的 token

Salesforce 的內部工程用的正是自家賣的 **Agentforce**：SVP Jayesh Govindarajan 說，過去 30 天內所有部署到 production 的 Apex 程式碼裡，約 **20%** 由 Agentforce 產出——他們特別強調追蹤的是「真正部署上線」的程式碼，不是產生了多少。CEO Marc Benioff 在 2026 年 5 月進一步證實：工程團隊生產力提升超過 **30%**，公司從 2025 年起凍結工程師招募，並延續到 2026 年。

但有個細節值得留意：Benioff 同一場合也提到 Salesforce 2026 年預計花將近 **3 億美元**在 Anthropic 的 token 上——賣自家 agent 產品的同時，公司內部也大量採購競品模型供應商的算力。這說明「自己吃自己的狗糧」跟「內部工程實際上用什麼」不一定是同一件事。

### Goldman Sachs — Devin 部署

Goldman Sachs 是**第一家部署 Devin（Cognition）的大型銀行**（2025 年 7 月），從數百人擴展到 12,000 人的開發團隊。主要用於將內部程式碼遷移到新版語言。報告 3-4x 生產力提升。

### Walmart — WIBEY

Walmart 的開發者 agent **WIBEY** 是四個「super agent」之一，在 2024-2025 年節省了約 **400 萬開發者小時**。建構在 Walmart 自研的 Element ML 平台上，正在重構為 agent 編排架構。

### 產業全貌

| 公司 | 工具 | 關鍵指標 |
|------|------|---------|
| Google | Agent Smith / 全公司 AI 輔助 | Agent Smith 30%+ 全自主 PR；全公司 AI 生成程式碼佔比 75%（2026-04） |
| Anthropic | Claude Code（自用） | 生產程式碼 80%+ 由 Claude 撰寫，年底前上看 90% |
| OpenAI | Codex（自用） | 80% 程式碼由 AI 撰寫；97.9% 員工日常使用 Codex |
| Meta | DevMate + Muse Code | 50% code changes，多 agent 網路；2026-08 再推終端機 agent Muse Code |
| Amazon | Q Developer → Kiro | 4,500 開發者年，$2.6 億節省；AWS 自己也用 Kiro（Bedrock 推論引擎重寫：40人/12月 → 6人/76天） |
| Uber | Minions/Shepherd/uReview/AutoCover | 92% 每月使用 agent，31% 程式碼由 AI 撰寫，90% diffs 自動 review |
| Shopify | River（Slack-native agent）| 1/8（12.5%）merged PRs，跨 4,450+ Slack 頻道，另用於資安修補 |
| Goldman Sachs | Devin | 首家銀行部署，12,000 開發者 |
| Walmart | WIBEY | 400 萬小時節省 |
| PostHog | StampHog + 多 agent review | agent 審 agent，不同角色/模型交叉審查 |
| Cloudflare | 自家 AI Gateway/Workers AI + OpenCode | R&D 滲透率 93%（全公司 60%），3,683 名內部使用者 |
| NVIDIA | 客製化 Cursor | 30,000+ 工程師使用，程式碼提交量 3x，bug 率持平 |
| Salesforce | Agentforce | 20% production Apex 程式碼由 Agentforce 產出，工程生產力 +30% |
| Block | Goose（開源）| 27,000 GitHub stars，Stripe Minions 的基底 |
| Apple | Xcode Intelligence | Claude 整合，agentic coding |
| Airbnb | 內部平台 | 2026 Q1 財報：60% 新程式碼由 AI 撰寫；技術債遷移成功率 97% |

---

## 整體來說

從四家深入分析到產業全貌，結論很清楚：**AI coding agent 不再是實驗品，而是 production infrastructure**。

核心取捨很清楚：

- **速度 vs. 控制**：Coinbase 選擇 auto-merge 追求極致速度；其他三家保留人工 review 作為最後防線
- **自研 vs. 開源基底**：Coinbase 完全自研，Stripe fork Goose，Ramp 用 OpenCode，Spotify 用 Claude SDK——沒有標準答案，取決於現有tech stack和內部需求
- **通用 vs. 專精**：所有系統都從「well-defined、mechanical tasks」開始（遷移、dependency 升級、bug 修復），再逐步擴展到更複雜的場景

對於想打造類似系統的團隊，LangChain 的 Open SWE 框架是一個起點，它把 Stripe/Ramp/Coinbase 獨立收斂出的架構模式做成了開箱即用的開源方案。

半年後回頭看，成長速度比架構本身更能說明問題：Stripe 從 1,300 PRs/週衝到 7,000+，Ramp 從 30% 衝到 75% 的 merged PRs。但這幾個月裡，沒有一家公司把整套系統換掉重寫，也不是靠換了更強的 LLM 才達成——真正在動的是圍牆本身：Coinbase 加了 Mux 把單一 agent 編排成 agent 艦隊，Ramp 和 Spotify 不約而同地把瓶頸從「寫程式碼」搬到「審 PR」再去補強審查層。這正印證了 Stripe 工程團隊那句話——**the walls matter more than the model**——擴大規模靠的是加厚驗證閘門、加寬 orchestration，而不是等一顆更聰明的模型出現。

而對於大多數團隊來說，現在至少該開始思考的問題是：**你的工程團隊中，有多少工作其實可以用一句 Slack 訊息取代？**

## 更新紀錄

- 2026-09-13：依 `agent-watchlist.json` A1（大廠）section 再補三個內部案例——Cloudflare（自家 AI Gateway/Workers AI 蓋出 R&D 93% 滲透率的內部工具鏈，含「厚 gate」對應的 enforcement layer）、NVIDIA（30,000+ 工程師用客製化 Cursor，程式碼提交量 3x）、Salesforce（Agentforce 佔 20% production Apex 程式碼，但同時也是 Anthropic token 大客戶）；Palantir、Oracle、SAP、Adobe、Snowflake 查無夠具體的內部案例，暫未收錄。
- 2026-09-13：補上 2026 年中／下半年最新指標——Stripe Minions 1,300→7,000+ PRs/週、Ramp Inspect 30%→75% merged PRs、Spotify Honk 遷移瓶頸轉移案例；Coinbase Cloudbot 更名為 Forge，新增 Mux 多 agent 編排工具；補充 Amazon Q Developer 轉往 Kiro（含 AWS 自己用 Kiro 重寫 Bedrock 推論引擎的內部案例與 CEO 對「AI 生成程式碼佔比」這個指標的質疑）、Google 官方 75% AI 生成程式碼數字、Meta 新增 Muse Code、Uber 最新採用率與 inner/outer loop 架構；新增 Anthropic（Claude 寫自己 80%+ 的程式碼）、OpenAI（Codex 滲透率 97.9%）、Shopify River、PostHog agent-review-agent 共四個新案例；把「薄 spec + 厚 gate」與「circuit breaker」寫進 Blueprint 與共同架構模式章節，並把 "the walls matter more than the model" 拉高為全文貫穿的論點。

---

## 參考資料

- [Stripe Dev Blog: Minions — Stripe's one-shot, end-to-end coding agents (Part 1)](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents)
- [Stripe Dev Blog: Minions — Part 2](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents-part-2)
- [Lenny's Newsletter: How Stripe built "minions" — Steve Kaliski](https://www.lennysnewsletter.com/p/how-stripe-built-minionsai-coding)
- [ByteByteGo: How Stripe's Minions Ship 1,300 PRs a Week](https://blog.bytebytego.com/p/how-stripes-minions-ship-1300-prs)
- [InfoQ: Stripe Engineers Deploy Minions](https://www.infoq.com/news/2026/03/stripe-autonomous-coding-agents/)
- [MindStudio: Stripe Minions Blueprint Architecture](https://www.mindstudio.ai/blog/stripe-minions-blueprint-architecture-deterministic-agentic-nodes)
- [Anup.io: Stripe's coding agents — the walls matter more than the model](https://www.anup.io/stripes-coding-agents-the-walls-matter-more-than-the-model/)
- [SitePoint: Deconstructing Stripe's Minions — One-Shot Agents at Scale](https://www.sitepoint.com/stripe-minions-architecture-explained/)
- [InfoQ: Ramp Builds Internal Coding Agent That Powers 30% of Pull Requests](https://www.infoq.com/news/2026/01/ramp-coding-agent-platform/)
- [DevOps.com: Open SWE Captures the Architecture That Stripe, Coinbase and Ramp Built Independently](https://devops.com/open-swe-captures-the-architecture-that-stripe-coinbase-and-ramp-built-independently-for-internal-coding-agents/)
- [Spotify Engineering: 1,500+ PRs Later — Spotify's Background Coding Agent (Part 1)](https://engineering.atspotify.com/2025/11/spotifys-background-coding-agent-part-1)
- [Spotify Engineering: Context Engineering — Background Coding Agents (Part 2)](https://engineering.atspotify.com/2025/11/context-engineering-background-coding-agents-part-2)
- [Spotify Engineering: Feedback Loops — Background Coding Agents (Part 3)](https://engineering.atspotify.com/2025/12/feedback-loops-background-coding-agents-part-3)
- [TechCrunch: Spotify says its best developers haven't written a line of code since December](https://techcrunch.com/2026/02/12/spotify-says-its-best-developers-havent-written-a-line-of-code-since-december-thanks-to-ai/)
- [Anthropic Customer Story: Spotify](https://claude.com/customers/spotify)
- [GitHub: langchain-ai/open-swe](https://github.com/langchain-ai/open-swe)
- [LangChain Blog: Open SWE — An Open-Source Framework for Internal Coding Agents](https://blog.langchain.com/open-swe-an-open-source-framework-for-internal-coding-agents/)
- [Harrison Chase on X: Internal cloud coding agents](https://x.com/hwchase17/status/2033977192053612621)
- [ChatPRD: Stripe's AI Minions Ship 1300 PRs Weekly from a Slack Emoji](https://www.chatprd.ai/how-i-ai/stripes-ai-minions-ship-1300-prs-weekly-from-a-slack-emoji)
- [Anthropic: 2026 Agentic Coding Trends Report](https://resources.anthropic.com/2026-agentic-coding-trends-report)
- [Fortune: Over 25% of Google's code written by AI](https://fortune.com/2024/10/30/googles-code-ai-sundar-pichai/)
- [Google Developers Blog: Build with Google Antigravity](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)
- [LinearB: How Meta Built Agentic Infrastructure](https://linearb.io/blog/meta-ai-control-plane-james-everingham-guildai)
- [Engineering at Meta: Ranking Engineer Agent](https://engineering.fb.com/2026/03/17/developer-tools/ranking-engineer-agent-rea-autonomous-ai-system-accelerating-meta-ads-ranking-innovation/)
- [Amazon CEO Andy Jassy: Q Developer saves 4,500 developer-years](https://finance.yahoo.com/news/amazon-ceo-andy-jassy-says-213018283.html)
- [Pragmatic Engineer: How Uber uses AI for development](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development)
- [Uber Blog: uReview — Scalable GenAI for Code Review](https://www.uber.com/blog/ureview/)
- [CNBC: Goldman Sachs pilots autonomous coder Devin](https://www.cnbc.com/2025/07/11/goldman-sachs-autonomous-coder-pilot-marks-major-ai-milestone.html)
- [Walmart Tech: From Models to Agents — WIBEY](https://tech.walmart.com/content/walmart-global-tech/en_us/blog/post/wibey-announcement.html)
- [Pragmatic Engineer: AI Tooling for Software Engineers in 2026](https://newsletter.pragmaticengineer.com/p/ai-tooling-2026)
- [Block Open Source: Introducing Goose](https://block.xyz/inside/block-open-source-introduces-codename-goose)
- [GitHub: block/goose](https://github.com/block/goose)
- [a16z Podcast Summary: Stripe's Will Gaybrick on Minions scaling to 7,000 PRs/week](https://www.signalcast.app/episode/a16z-podcast/stripes-ai-strategy-build-more-not-less)
- [Linear Customer Story: The coding agent behind 75% of Ramp's merged PRs](https://linear.app/customers/ramp)
- [Pragmatic Engineer: Why Ramp built its own in-house coding agent, Inspect](https://newsletter.pragmaticengineer.com/p/why-ramp-built-inspect)
- [Coinbase Blog: Coding Had a Concurrency Problem — How Mux Helped Solve It](https://www.coinbase.com/blog/coding-had-a-concurrency-problem-how-mux-helped-solve-it)
- [Forbes: Coinbase Forge Illustrates The Power Of Internal Architectures](https://www.forbes.com/sites/johnwerner/2026/08/05/coinbase-forge-illustrates-the-power-of-internal-architectures/)
- [Spotify Engineering: Background Coding Agents — Dataset Migrations (Honk, Part 4)](https://engineering.atspotify.com/2026/4/background-coding-agents-dataset-migrations-honk-part-4)
- [Spotify Engineering: Coding Is No Longer the Constraint](https://engineering.atspotify.com/2026/6/code-with-claude-coding-is-no-longer-the-constraint)
- [InfoQ: QCon London 2026 — Rewriting All of Spotify's Code Base, All the Time](https://www.infoq.com/news/2026/03/spotify-honk-rewrite/)
- [AWS DevOps Blog: Amazon Q Developer End-of-Support Announcement](https://aws.amazon.com/blogs/devops/amazon-q-developer-end-of-support-announcement/)
- [TechCrunch: Meta launches Muse Code, an AI agent for large code bases](https://techcrunch.com/2026/08/05/meta-launches-muse-code-an-ai-agent-for-large-code-bases/)
- [Pragmatic Engineer: How Uber uses AI for development (March 2026 update)](https://newsletter.pragmaticengineer.com/p/how-uber-uses-ai-for-development)
- [Pragmatic Engineer Newsletter: How Uber built an AI software factory for agentic coding](https://newsletter.port.io/p/how-uber-built-a-software-factory)
- [Shopify Engineering: Under the River](https://shopify.engineering/under-the-river)
- [Shopify Engineering: How River takes security work from a fix to merge](https://shopify.engineering/river-vulnerability-remediation)
- [TechCrunch: Airbnb says AI now writes 60% of its new code](https://techcrunch.com/2026/05/08/airbnb-says-ai-now-writes-60-of-its-new-code/)
- [PostHog Newsletter: Stop being the code review bottleneck](https://newsletter.posthog.com/p/code-review-tips)
- [Google Blog: Sundar Pichai shares news from Google Cloud Next 2026](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/)
- [Anthropic: When AI Builds Itself](https://www.anthropic.com/institute/recursive-self-improvement)
- [VentureBeat: Anthropic says 80% of its new production code is now authored by Claude](https://venturebeat.com/technology/anthropic-says-80-of-its-new-production-code-is-now-authored-by-claude-how-your-enterprise-can-keep-up)
- [Business Insider: OpenAI's President Says AI Has Gone From Writing 20% to 80% of Its Code](https://www.businessinsider.com/openai-president-ai-now-writing-80-percent-of-code-2026-5)
- [Fortune: Top engineers at Anthropic, OpenAI say AI now writes 100% of their code](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/)
- [Metaintro: Nearly Every OpenAI Employee Now Codes With Codex](https://www.metaintro.com/blog/openai-employees-codex-ai-coding-preview-2026)
- [ITPro: "While the engineers slept, the agents kept building" — AWS UK chief touts big gains with AI-powered coding](https://www.itpro.com/software/development/while-the-engineers-slept-the-agents-kept-building-aws-uk-chief-touts-big-gains-with-ai-powered-coding)
- [Cloudflare Blog: The AI engineering stack we built internally — on the platform we ship](https://blog.cloudflare.com/internal-ai-engineering-stack/)
- [Cloudflare Blog: Orchestrating AI Code Review at scale](https://blog.cloudflare.com/ai-code-review/)
- [Tom's Hardware: Nvidia now produces three times as much code as before AI](https://www.tomshardware.com/tech-industry/artificial-intelligence/nvidia-now-produces-three-times-as-much-code-as-before-ai-specialized-version-of-cursor-is-being-used-by-over-30-000-nvidia-engineers-internally)
- [VentureBeat: This AI already writes 20% of Salesforce's code](https://venturebeat.com/ai/this-ai-already-writes-20-of-salesforces-code-heres-why-developers-arent-worried)
- [EnterpriseDNA: Salesforce Spends $300M on AI, Freezes Engineering Hires](https://enterprisedna.co/resources/news/salesforce-300m-anthropic-tokens-engineer-hiring-freeze-2026/)
