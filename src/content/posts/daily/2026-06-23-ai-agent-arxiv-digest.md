---
title: "AI Agent Arxiv Digest — 2026-06-23"
date: 2026-06-23
category: daily
tags: [ai-agent, arxiv, daily, multi-agent, agent-rag, agent-framework]
lang: zh-TW
description: ""
tldr: ""
series:
  name: "AI Agent Arxiv Digest"
  order: 30
---
> 🌏 [English version](/en/posts/daily/2026-06-23-ai-agent-arxiv-digest-en)

[!blue_background]
📌 **今日總覽**
今天三篇從不同角度切入 agent 平台的核心工程挑戰：**H-RePlan** 提出「跨設備 agent 分層故障恢復」，解決 agent 跨多台設備執行時失敗粒度太粗的老問題；**Multi-Agent Transactive Memory** 把 RAG 從人類文字延伸到 agent 軌跡，讓整個 agent 群體能累積並共享執行知識；**LLM+RL 階層控制** 則驗證「LLM 做高層策略選擇、RL 負責低層執行」的混合分工在多 agent 環境的可行性。三篇合在一起，勾勒出 2026 年 agent 平台設計的三個核心問題：如何優雅地處理跨設備執行失敗、如何讓 agent 的過去行為成為可重用的群體資產、以及大腦（規劃）和手腳（執行）之間應該怎麼分工。

## 讀這篇前該知道的詞


| 白話解釋 | 詞 |
|---|---|
| 能自己決策並採取行動完成任務的 AI 程式，不只回答問題，還會去點按鈕、呼叫 API、執行指令 | Agent |
| 管理多個子 agent 分工的「總指揮」，負責分配任務並整合各 agent 的執行結果 | Orchestrator（協調器） |
| 借自社會心理學的概念：群體共用的分散式記憶系統，不是每個人記所有事，而是知道「誰懂什麼」，需要時去問對方 | Transactive Memory（跨體記憶） |
| 讓 LLM 在回答前先從外部知識庫撈相關資料，避免只靠訓練時記住的知識 | RAG（檢索增強生成） |
| 讓 AI 透過反覆試錯並接收獎勵訊號來學習的訓練方式，適合有明確目標的連續決策場景 | RL（強化學習） |


---


## 論文一｜Beyond Global Replanning: Hierarchical Recovery for Cross-Device Agent Systems

**作者**: Shu Yao, Yuhua Luo, Qian Long 等　·　**arxiv**: 2606.20487
**連結**: [arxiv](https://arxiv.org/abs/2606.20487) · [alphaxiv](https://www.alphaxiv.org/abs/2606.20487)
[!yellow_background]
🎯 
### TL;DR

跨多台設備的 agent 執行失敗時，別急著全部重來——先讓設備端自己試著換個方式（API → CLI → GUI），不行再往上呈報給總指揮。
[!green_background]
⭐ 
### Read Priority

必讀
對在做 computer-use agent 或多設備 automation 的工程師最直接，這篇把生產環境最常見的「執行失敗怎麼辦」痛點說清楚了。
[!gray_background]
🧭 
### 領域背景

現在的 computer-use agent（例如同時控制手機和電腦完成一個訂票+存行事曆的任務）需要跨多台設備協作。既有系統會把大任務拆成子任務分給不同設備，但當某個設備執行失敗，通常只有三招：重試、換台設備、或重新規劃整個計劃（global replanning）。這三招都太粗，常常花了大量 token，其實只要在設備端換個執行方式（比如 GUI 點按改成 API 呼叫）就能過。

### 中階導讀


#### 問題

想像你讓 agent「在手機訂高鐵票、同時在電腦開行事曆」。手機端因為 app 改版而 GUI 操作失敗，現有系統把「訂票失敗」直接拋給 Orchestrator 要求重新分配，即使其實只要換成 API 呼叫就能成功。這種「小問題大驚小怪」的設計讓整個系統效率低落、token 成本高昂。

#### 方法

H-RePlan 引入三層抽象：每台設備能支援的執行方式（API、CLI、GUI）組成可替換的「策略組合」；當設備端某個策略失敗，先由 **Strategy Planner** 在設備層自行切換策略嘗試；只有設備層真的無法解決時，才由 **Orchestrator** 介入，透過「跨層故障摘要（cross-layer failure abstraction）」了解是否需要跨設備調度。

#### 為什麼重要

這個設計把「設備端能自己搞定的失敗」和「真的需要上層介入的失敗」清楚分開，大幅降低 Orchestrator 的決策負擔和 token 消耗。對 agent 平台設計者來說，這是一個可落地的「分層故障恢復」架構模板，且 API/CLI/GUI 三種接口的設計在 Windows、Linux、Android 等多數作業系統都有對應。

### 深入要點

- 論文為此評測引入 **HeraBench**：一個人工注入策略層和設備層故障的多設備工作流基準，任務橫跨 Linux 和 Android 設備
- H-RePlan 在 HeraBench 上達到 **完成率 75.84%、指令遵循率 77.72%、完美通過率 36.78%**，大幅優於單策略和粗粒度 baseline
- 「完美通過率（perfect-pass rate）」是指任務從頭到尾完全無誤——這才是生產環境的真實指標，比單純「完成率」更嚴格
- **Tok./PP**（每完美通過一次任務所需的 token 成本）是本文提出的新評測維度，H-RePlan 在這個維度也優於 baseline，代表同樣可靠度花更少錢
- 與 UFO（微軟的 WindowsAgentArena 框架）等現有系統比較，H-RePlan 的策略切換是 framework 層解法，理論上可移植到任何同時支援 API/CLI/GUI 的 agent runtime
- 和 MCP（Model Context Protocol）的關聯：MCP 工具呼叫本質上也是 API 接口，H-RePlan 的「策略切換」概念可以延伸為 MCP tool 的 fallback 機制
- **Limitation**：HeraBench 是自建 benchmark，故障場景人工注入，真實環境的故障模式更複雜；目前只在 Linux + Android 兩類設備驗證，對 Windows 或純 web 場景泛化性未知
[!purple_background]
🧐 
### Reviewer 一句話評

問題定義清楚、baseline 比較紮實，HeraBench 本身也是貢獻；但 36.78% 的完美通過率顯示即使有分層恢復，複雜多設備任務仍遠未解決，且 HeraBench 是作者自建，需要社群獨立複現才能確認。
[!orange_background]
🎬 
### 給你的 take-away

- 設計 agent orchestration 架構時，「設備端自救」和「全局重規劃」應該是兩個獨立的錯誤處理路徑——不要讓所有失敗都冒泡到最頂層 Orchestrator
- 如果你的 agent 系統同時支援 API 和 GUI 兩種操作方式，現在就值得設計 fallback 順序：API 失敗 → CLI → GUI，而不是直接失敗

---


## 論文二｜Multi-Agent Transactive Memory

**作者**: To Eun Kim, Xuhong He, Dishank Jain, Ambuj Agrawal, Negar Arabzadeh, Fernando Diaz　（Carnegie Mellon University · UC Berkeley）　·　**arxiv**: 2606.19911
**連結**: [arxiv](https://arxiv.org/abs/2606.19911) · [alphaxiv](https://www.alphaxiv.org/abs/2606.19911)
[!yellow_background]
🎯 
### TL;DR

讓 agent 把完整的執行軌跡（怎麼一步步完成任務）存進共享庫，讓其他 agent 之後能撈出來參考，而不是每次遇到類似任務都重新摸索。
[!green_background]
⭐ 
### Read Priority

必讀
對在設計 multi-agent 平台記憶架構的人來說，這篇提出了一個可落地的「群體知識共享」框架，並在 ALFWorld + WebArena 兩個主流 benchmark 驗證，可信度高。
[!gray_background]
🧭 
### 領域背景

傳統 RAG 讓 agent 從人類寫的文件撈知識。但 agent 的「軌跡（trajectory）」——也就是它實際做了哪些步驟、工具呼叫了什麼、遇到錯誤怎麼處理的——是一種完全不同的文件類型：很長、有時序結構、充滿工具呼叫記錄。現有系統把這些軌跡用完即丟，或只留給產生它的那個 agent，每次新 agent 上場都得從零開始。

### 中階導讀


#### 問題

一個成功在 WebArena 上完成「查詢並預訂最便宜機票」的 agent，其實積累了寶貴的操作食譜：哪個下拉選單要點、遇到登入彈窗怎麼繞過、搜尋失敗時怎麼換關鍵字。但這份食譜在任務結束後消失了，下一個 agent 遇到類似任務還是要從頭摸索。在大規模部署成千上萬個 agent 的情境下，這是巨大的浪費。

#### 方法

MATM 把 multi-agent 系統分成兩種角色：**Producer agent**（完成任務後把軌跡存入共享庫）和 **Consumer agent**（執行新任務前先撈相關軌跡作為參考）。核心技術是**學習式 reranking（learned reranking）**：因為 agent 軌跡和一般文字在結構上差異很大，用標準向量相似度搜尋效果差，需要專門訓練的 reranker 模型來排出真正有用的軌跡。

#### 為什麼重要

這把 RAG 的應用範圍從「人類文件」延伸到「agent 行為記錄」，讓整個 agent 群體能累積集體執行知識。對 agent 平台而言，這意味著可以建立一個「作法資料庫」，讓每個新 agent 都站在前人肩膀上，不需要協調或聯合訓練就能受益。

### 深入要點

- 在 **ALFWorld**（文字式室內導航任務）和 **WebArena**（真實網頁操作任務）上評測，是目前最常用的 agent benchmark 之二
- 結果顯示 MATM 加上 learned reranking 能提升 consumer agent 的任務完成率並減少互動步數（具體百分比數字論文有，但搜尋結果未取得完整對比表格）⚠️
- **純向量相似度搜尋（BM25/embedding retrieval）效果顯著不如 learned reranking**，說明軌跡類型的文件確實需要特殊處理
- 不需要 producer 和 consumer agent 之間有任何協調或聯合訓練——純粹基於 retrieval，對現有系統的侵入性低
- 「transactive memory」這個詞借自社會心理學（Wegner, 1987）：一個群體不是每個人記所有事，而是記「誰懂什麼」。MATM 把這個概念系統化應用到 multi-agent 系統是首次
- 與 MemGPT、Zep 等現有 agent 記憶工具最大差別：那些工具管的是單一 agent 的跨會話記憶，MATM 管的是跨 agent 的群體記憶
- **Limitation**：效果取決於 producer 軌跡的品質；共享庫初期為空，需要 warm-up；reranker 的訓練資料從哪來是落地關鍵，論文未詳述
[!purple_background]
🧐 
### Reviewer 一句話評

概念清晰且有 40 年心理學研究支撐，CMU+Berkeley 的組合可信；但目前搜尋到的資訊未見完整的數字對比表，「顯著提升」的說法有待查閱原始論文確認，建議謹慎引用具體數字。
[!orange_background]
🎬 
### 給你的 take-away

- 如果你的平台有大量 agent 在跑同類型重複性任務（客服、資料抓取、填表），現在就值得設計一個軌跡存儲和檢索層——agent 的「解題過程」應該是平台資產，不是用完即丟的中間產物
- 特別注意 reranker 的訓練資料問題：靠人工標注太貴，考慮用 agent 任務的成功/失敗結果當弱監督信號來訓練

---


## 論文三｜Hierarchical Control in Multi-Agent Games: LLM-based Planning and RL Execution

**作者**: Jannik Hösch, Alessandro Sestini, Florian Fuchs, Amir Baghi, Joakim Bergdahl, Konrad Tollmar, Jean-Philippe Barrette-LaPierre, Linus Gisslén　（工業界與學術合作）　·　**arxiv**: 2606.20014
**連結**: [arxiv](https://arxiv.org/abs/2606.20014) · [alphaxiv](https://www.alphaxiv.org/abs/2606.20014)
[!yellow_background]
🎯 
### TL;DR

用 LLM 當多 agent 團隊的指揮官決定策略方向，再讓 RL 訓練的底層 agent 負責真正的動作執行——兩者各司其職，比純 RL 或純手工規則都更彈性。
[!green_background]
⭐ 
### Read Priority

📖 略讀
實驗環境是電玩遊戲（2v2 搶山頭），不能直接套用到一般 agent 平台，但「LLM 做高層策略、RL 做低層執行」的分工模式是個值得了解的設計方向。
[!gray_background]
🧭 
### 領域背景

用 RL 訓練多 agent 在複雜對戰環境中合作一直很難：獎勵稀疏（不知道哪一步對了）、狀態空間爆炸（兩個 agent 加上對手的組合）、協調難（兩個 agent 容易各打各的）。但 LLM 在這類需要實時反應的環境中又太慢、太貴——不可能每個 timestep 都問 LLM 該怎麼辦。

### 中階導讀


#### 問題

想像訓練兩個 agent 在競技場上合作（2v2 搶占據點）：純 RL 訓練因為缺乏高層策略，兩個 agent 常常各自為政；但全部交給 LLM 規劃，LLM 的推理速度根本跟不上實時對戰。中間有個 gap：誰來做「我們現在應該一攻一守還是雙攻」這種策略決定？

#### 方法

LLM 作為 **strategic controller**，每隔一段時間（不是每個 timestep）觀察全局狀態，從預先定義的「技能策略組合」中選一個（例如：「進攻模式」、「防守模式」）。**RL skill policies**（預先訓練好的底層策略）負責在低層把選定的策略執行出來，處理細節動作和即時反應。

#### 為什麼重要

LLM 發揮強項（常識性策略推理），RL 發揮強項（反應式低層執行），各司其職。對 agent 平台工程師的啟示是：不需要每次工具呼叫都問 LLM，可以讓 LLM 只做「哪種執行方式」的高層選擇，把具體步驟交給更輕量的執行模組。

### 深入要點

- 評測環境：自製 **2v2 King of the Hill**（搶山頭電玩競技），是相對封閉的測試場景
- 勝率結果：LLM+RL 混合架構 **46.4%** vs 手工設計的 Behavior Tree（BT）**51.5%** vs 純 Flat RL 顯著更低；LLM+RL vs BT 統計上無顯著差異（p=0.103）⚠️（此數據來自特定遊戲場景，泛化需謹慎）
- 核心意涵：不需要工程師手工設計行為樹規則，LLM+RL 自動達到手工設計的水準——節省大量規則工程工作
- LLM 的調用頻率是「每 N 個 timestep 一次」，不是每步，大幅降低推理成本
- RL skill policies 是預先訓練好的模組，LLM 只需從已有技能中選擇，不需要從頭學
- 對 LangGraph/AutoGen 的啟示：可以把 LLM orchestrator node 設計為「定期觸發、高層決策」，而非「每次工具呼叫都全力推理」
- **Limitation**：只在單一遊戲環境測試，未驗證其他場景；LLM 只能從預定義技能集選擇，新技能仍需重新訓練 RL；遊戲的即時反應需求和現實 agent 的非同步工具呼叫有本質差異
[!purple_background]
🧐 
### Reviewer 一句話評

架構想法清楚，hybrid LLM+RL 是個有趣方向；但只在一個遊戲環境測試說服力有限，46.4% vs 51.5% 的差距雖無統計顯著性但絕對值不小，且論文對遊戲 RL 和真實世界 agent tool-use 的差距討論不足。
[!orange_background]
🎬 
### 給你的 take-away

- 設計 multi-agent orchestration 時，考慮「LLM 只做高層策略節點決策、低層執行交給更輕量模組」——不是每次工具呼叫都需要完整的 LLM 推理
- 注意這篇的「預定義技能集 + LLM 選擇」的設計方式：這比讓 LLM 從頭規劃每個細節步驟更穩定，也更省成本，可以套用到你自己系統的 orchestrator 設計上


## 參考資料

- [arxiv:2606.20487](https://arxiv.org/abs/2606.20487)
- [arxiv:2606.19911](https://arxiv.org/abs/2606.19911)
- [arxiv:2606.20014](https://arxiv.org/abs/2606.20014)
