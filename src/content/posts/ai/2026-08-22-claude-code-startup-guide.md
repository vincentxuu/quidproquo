---
title: "Claude Code 新創操作手冊：Anthropic 歸納的五條出貨原則"
date: 2026-08-22
type: deep-dive
category: ai
tags: [claude-code, anthropic, startup, agentic, sdlc, agent]
lang: zh-TW
tldr: "Anthropic 訪談 15 間新創，歸納出 Claude Code 操作五原則：人人出貨、自動化瑣事、信任但驗證、為重建而建、原型到產品化。ClickHouse 多出 30% 功能、Clay 100% 自動化 bug triage、Artemis Security 一週 6,000+ PR。"
description: "導讀 Anthropic 官方部落格《The Claude Code Guide For Startups》，整理五條讓小團隊做到十倍產出的操作原則與可落地的技術建議。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-claude-code-startup-guide-en)

Anthropic 在 2026 年 8 月 20 日發佈了一篇長文 [The Claude Code Guide For Startups](https://claude.com/blog/claude-code-guide-for-startups)，訪談了十五間快速成長的新創公司——ClickHouse、Clay、Omni、Artemis Security、Harvey、Cognition、Commure、Heidi、Crosby、Zingage、Emergent、Translucent、Higgsfield、Parahelp、Cainex——歸納出它們用 Claude Code 達到「以小搏大」的五條操作原則。

這篇文章不是產品發表，而是一份從實戰訪談提煉出的操作手冊。它回答的問題是：**如果一間公司從零開始，用 Claude Code 打造整個產品開發週期，會長什麼樣子？**

以下依原文的五條原則結構，整理核心觀點和可落地的技術做法。

## 原則一：人人都能出貨

Agentic coding 降低了參與門檻——**理解問題的人可以直接出第一版**，不用等工程師排程。

Heidi 的 CEO Thomas Kelly 把這稱為解決「broken telephone problem」：過去一個點子從提出到出貨，要經過 PM → 設計 → 工程的轉手鏈，每一關都會失真。Claude Code 讓有想法的人直接交 PR，設計師和工程師在需要專業的環節才介入。Crosby 的做法更直接——律師本身就是產品的使用者，所以他們直接用 Claude Code 出貨。

這不代表行銷團隊要自己解 merge conflict。原文的重點是**從 0 到 1 的原型製作對所有人開放**，進入正式工程流程後仍有分工。幾個讓這件事系統化的做法：

- **連接工具**：用 [MCP](https://code.claude.com/docs/en/mcp)（Model Context Protocol）把 Claude 接到團隊的資料源和工具。當團隊發現自己在複製貼上資訊到 Claude 裡，就是該接 MCP 的時候。已有成熟 CLI 的工具（`gh`、`kubectl`、`psql`）直接用 CLI 連，token 更省。
- **共享 Skill**：用 [Plugin Marketplace](https://code.claude.com/docs/en/plugin-marketplaces) 讓一個人寫好的最佳實踐可以即時傳遞給全團隊。子目錄放 `CLAUDE.md` 寫該區塊的慣例，on-demand 的工作流用 skill。
- **展示機制**：Clay 做季度 review，讓非技術員工的原型有機會進入正式 roadmap。Omni 開了專門的 Slack 頻道展示 Claude 產出的原型。

## 原則二：自動化瑣事

這些新創的共同信念：**agent 拿走機械性的 80%，工程師專注在需要判斷力的工作上。**

一句話說得很直接：「大家都在搶著做 AI 產品，很少人在重建公司的運作方式。第二件事才是更大的突破。」（Artemis Security CEO Shachar Hirshberg）

具體落地的範圍有兩塊：

**AI 原生的開發流程。** Emergent 的新人第一天就用 Claude 指向一份 markdown 完成開發環境設定——如果 Claude 遇到過時的步驟，它會直接更新那份文件。Commure 的一位工程師用 Claude 子 agent 平行跑了約 13 張 ticket，每個 agent 各自擁有一張 ticket 和它的 PR。ClickHouse 把幾乎每個 SDLC 階段都變成自主迴圈，修 flaky test 和補測試覆蓋的 agent 已是 repo 的第二和第三大 contributor。

**用 agent 加速重複流程。** 幾乎每間公司都建了某種內部數據分析 agent。Clay 建了 bug triage agent，100% 自動化了從初步分類到建議修改的流程。Crosby 用子 agent 摘要上千份法律文件。Commure 掃描理賠資料找異常。

可以馬上做的事：

- 在 repo 上開啟 [Code Review](https://code.claude.com/docs/en/code-review)（research preview），讓 PR 自動跑一輪審查。
- 用 [Claude Tag](https://claude.com/product/tag)（@Claude in Slack）做 CI/CD 失敗的第一線回應——Anthropic 自己內部每次 CI/CD 事故的第一份情況報告都是 Claude Tag 寫的，通常在 15 分鐘內發佈。
- 用 [Dynamic Workflows](https://code.claude.com/docs/en/workflows#orchestrate-subagents-at-scale-with-dynamic-workflows) 扇出多個子 agent 做平行分析或互相對抗審查。

## 原則三：信任，但驗證

這條是原則二的必要前提：**你不能自動化一個沒辦法可靠驗證結果的流程。**

一個常見的早期教訓：給 Claude 完全的自主權，它會快速出貨看起來合理的程式碼——但偏離架構，而且偏離的方式「看起來是對的，其實不是」。Zingage 的解法是寫下 567 行「團隊怎麼思考」的文件，把所有不可變的規則收在裡面（CEO Victor Hunt）。

最完整的案例來自 Cainex（醫療計費，CTO Uriah Israel）。他們建了一個完整的自我改進迴圈：agent 處理一批資料 → 審計員在內部 app 審查結果（看得到推理過程）→ 每個修正都按類別標記 → Claude Code 讀回修正和評論，找到產生錯誤的指令段落 → 修訂的是**原則**而不是個案 → 跑 back-test（語意比對 + 判斷是否為合理的替代路徑，不是字串比對）→ 通過 golden set 和隨機抽樣才出貨。

這個流程的建立本身也經歷了迭代：「第一版過擬合了——它會把具體案例編碼進去當成修復，我們累積的是補丁而不是知識。」

幾個可落地的做法：

- 把**不可變的架構規則、安全邊界**寫在 repo 根目錄的 `CLAUDE.md`，它在每次 session 開始時都會被讀取。
- 用 [Hooks](https://code.claude.com/docs/en/hooks) 做硬性閘門：lint 不過就擋寫入、commit 前必須通過測試、推送前清除 secrets。Hook 是使用者定義的命令，在 Claude Code 生命週期的固定點觸發，跟模型的決策無關。
- 用 [Loops](https://code.claude.com/docs/en/workflows)（重複循環直到滿足停止條件的 agent）做自主性高的任務。停止條件越明確越好——修 flaky test 是經典案例，因為 agent 可以自己跑測試驗證。
- 建立和維護 **evaluation golden set**。Anthropic 另有一篇 [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) 可參考。

## 原則四：為重建而建

**模型能力持續變化，很少東西被視為永久。**

Clay 的做法是一個縮影：「你建一次，再建一次，再建一次。第四次你就知道所有需要的東西，然後做對了。我們不是丟東西，是帶著更多清晰度重建。」（CEO Kareem Amin）

重建在過去之所以難，是因為拆除舊路徑永遠贏不了功能開發的優先級——它很無聊而且不出新功能。但現在 Commure 的一位工程師可以用 Claude skill 對所有已全量釋出的 feature flag 開 PR 清除舊程式碼，過去要吃大量開發時間的 migration 幾小時搞定（CEO Tanay Tandon）。

這個現象跨公司一致。Harvey 和 Cognition 都表示：每一波模型能力——推理、agent、編排——都需要完整的架構重寫。Cognition 共同創辦人 Walden Yan 說得最直接：「做 AI 的生活方式就是接受你今天建的東西很可能在六個月到一年後被捨棄。」

可以馬上做的事：

- 用 [git worktrees](https://code.claude.com/docs/en/worktrees) 在隔離副本跑重建，v2 跑在 v1 旁邊，eval 比較後才 merge。這是讓「建四次」變得便宜的關鍵。
- 大型重寫先進 [Plan Mode](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode)（`--plan` 或 `Shift+Tab`），讓 Claude 先探索 codebase 再提方案。這是最便宜的偏離檢測點——在寫任何程式碼之前就能修正方向。

## 原則五：原型→吃狗糧→產品化

最後一條是這些新創的飛輪：**用 AI 建造的過程幫助你更好地理解 AI，進而做出更好的 AI 產品。**

具體的啟發來自使用過程本身。Omni 從 Claude Code 的 harness 設計得到靈感——看到 Anthropic 用檔案而不是 embedding 的做法，讓他們放心簡化自己產品的 RAG pipeline，避免了大量複雜度。他們也把 Claude Code 的平行處理概念搬進了自己的 UI（CTO Chris Merrick）。

另一個常見的好處是加速 triage。Emergent 的 app builder 也用 Anthropic 的模型，當產品出現異常行為時，可以用 Claude Code 快速判斷是模型行為還是 harness 問題（CEO Mukund Jha）。

原文反覆出現的模式是：**用 Claude Code 建內部 agent → 內部使用（dogfood）→ 反應好就用 Claude API / SDK / Managed Agents 升級成客戶產品**。ClickHouse 就是這樣——「我們用 Claude Code 來建造和迭代驅動客戶 AI 體驗的 agent。」（CTO Alexey Milovidov）

## 整體來說

這五條原則不是各自獨立的——它們互相支撐。讓所有人出貨（原則一）要有自動化的品質閘門（原則二 + 三）才不會變成混亂。自動化要有驗證機制（原則三）才能信任。持續重建（原則四）在有 agent 做機械性工作時才划算。而這一切的實戰經驗會回饋到產品（原則五），形成飛輪。

對小團隊來說最直接的第一步：把 `CLAUDE.md` 寫好、把重複的流程辨識出來交給 agent、建立至少一組 eval 確認結果。這三件事今天就能開始做。

## 參考資料

- [The Claude Code Guide For Startups](https://claude.com/blog/claude-code-guide-for-startups) — Anthropic 官方部落格，2026-08-20
- [Claude Code MCP 文件](https://code.claude.com/docs/en/mcp) — Model Context Protocol 連接指南
- [Claude Code Code Review](https://code.claude.com/docs/en/code-review) — 自動化 PR 審查（research preview）
- [Claude Code Hooks 文件](https://code.claude.com/docs/en/hooks) — 生命週期閘門
- [Claude Code Workflows 文件](https://code.claude.com/docs/en/workflows) — Loops 與 Dynamic Workflows
- [Claude Code Worktrees 文件](https://code.claude.com/docs/en/worktrees) — git worktree 隔離重建
- [Claude Code Plan Mode 文件](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode) — 先規劃再動手
- [Plugin Marketplaces 文件](https://code.claude.com/docs/en/plugin-marketplaces) — 跨團隊共享 skill
- [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic 工程部落格，agent 評估指南
- [Steering Claude Code: Skills, Hooks, Rules, Subagents](https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more) — 情境引導指南
- [Building Verification Loops in Claude Code with Skills](https://claude.com/blog/building-verification-loops-in-claude-code-with-skills) — 驗證迴圈實作
- [Dynamic Workflows in Claude Code](https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code) — 動態工作流介紹
- [Claude Tag](https://claude.com/product/tag) — Slack 內的 Claude agent
