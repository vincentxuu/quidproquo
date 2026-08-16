---
title: "AI Agent Arxiv Digest — 2026-07-10"
date: 2026-07-10
category: daily
tags: [ai-agent, arxiv, daily, agent-memory, agent-evaluation, agent-framework]
lang: zh-TW
description: "今天三篇論文共同描繪 Agent 平台的「進化前線」：EvoSOP 讓 Agent 不再每次從零重組工具，而是從過去執行歷程中自動萃取可重用的 SOP，讓工作效率顯著提升；AgenticSTS 對長任務記憶提出嚴格的「有界合約」設計，用五層結構化提取取代無止盡的 context 堆疊；Spider "
tldr: "今天三篇論文共同描繪 Agent 平台的「進化前線」：EvoSOP 讓 Agent 不再每次從零重組工具，而是從過去執行歷程中自動萃取可重用的 SOP，讓工作效率顯著提升；AgenticSTS 對長任務記憶提出嚴格的「有界合約」設計，用五層結構化提取取代無止盡的 context 堆疊；Spider 2.0-AIFunc 則揭示 AI 函式已被直接嵌入雲端 SQL 語法，但最強模型準確率僅約 67%，是資料 Agent 必須面對的新挑戰。三篇合看：從工具效率、記憶架構到資料能力，勾勒出 2026 年 Agent 平台亟需補強的三個關鍵短板。"
series:
  name: "AI Agent Arxiv Digest"
  order: 47
---
## 今日總覽

今天三篇論文共同描繪 Agent 平台的「進化前線」：EvoSOP 讓 Agent 不再每次從零重組工具，而是從過去執行歷程中自動萃取可重用的 SOP，讓工作效率顯著提升；AgenticSTS 對長任務記憶提出嚴格的「有界合約」設計，用五層結構化提取取代無止盡的 context 堆疊；Spider 2.0-AIFunc 則揭示 AI 函式已被直接嵌入雲端 SQL 語法，但最強模型準確率僅約 67%，是資料 Agent 必須面對的新挑戰。三篇合看：從工具效率、記憶架構到資料能力，勾勒出 2026 年 Agent 平台亟需補強的三個關鍵短板。

## 讀這篇前該知道的詞


| 白話解釋 | 詞 |
|---|---|
| 在 Agent 框架中指從執行歷程裡萃取並封裝的多步驟工具工作流程，讓相似任務不必每次都從原子動作重新規劃，類似「巨集指令」或可呼叫的子程式。 | SOP（Standard Operating Procedure，標準作業程序） |
| 每次決策的 context 大小設有上限，透過結構化提取取代「把所有歷史通通塞進去」，防止 prompt 隨任務長度無限膨脹。 | Bounded Memory（有界記憶） |
| 系統性關閉某個模組或功能，觀察性能下降幅度，用來量化「這個元件到底貢獻了多少」。 | Ablation Study（消融實驗） |
| 在 SQL 查詢中直接呼叫 LLM 函式（如 AI_CLASSIFY、AI_COMPLETE），讓資料庫層直接做 NLP 任務，不需把資料拉出來再另行處理。 | AI-native SQL |
| text-to-SQL 評測中，Agent 生成的 SQL 執行結果與正確答案完全一致的比例；是衡量 SQL 代理能力的主流指標。 | Execution Accuracy（執行準確率） |


---


## 論文一｜From Atomic Actions to Standard Operating Procedures: Iterative Tool Optimization for Self-Evolving LLM Agents

**作者**: Haipeng Ding, Yuexiang Xie, Zhewei Wei, Yaliang Li, Bolin Ding　·　**機構**: 中國人民大學 / 阿里巴巴通義實驗室　·　**arxiv**: 2607.07321
**連結**: [arxiv](https://arxiv.org/abs/2607.07321) · [alphaxiv](https://www.alphaxiv.org/abs/2607.07321)

### TL;DR

讓 Agent 把反覆做過的「多步驟工具流程」萃取成可重用的 SOP（標準作業程序），下次遇到類似任務直接呼叫，避免重新發明輪子，任務成功率提升 2.5%～13.4%。

### Read Priority

必讀
任何在 LangGraph、AutoGen 或自建框架上管理工具庫的開發者都應看這篇：EvoSOP 的 SOP 合成機制直接對應「工具版本管理與組合」這個生產痛點，架構思路可以直接借鑒。

### 領域背景

現有 Agent 框架（LangGraph、AutoGen、Dify 等）預設工具庫是**靜態**的：每個工具就是一個原子動作（讀一個檔、搜一次網路、執行一行程式碼）。Agent 每次執行複雜任務，都要從這些原子動作重新規劃整個流程，造成推理 overhead 高、同樣錯誤反覆犯。這問題在長任務和 coding agent 場景尤其嚴重，但過去幾乎沒有系統性解法。

### 中階導讀


#### 問題

想像一個 coding agent 每次要「讀取 Python 檔 → 找出函式定義 → 跑單元測試 → 整合分析」，這個四步流程它可能執行了幾十次，但每次都從最基本的工具呼叫開始重新規劃，不僅推理 token 耗費高，還常在第二步犯同樣的錯誤。靜態工具庫設計讓 Agent 無法從過去的成功經驗中學習「怎麼把這幾個步驟組合起來最有效」。

#### 方法

本文提出 **EvoSOP**，一套讓 Agent 自我進化工具庫的框架，流程分四階段循環：
1. **Construction（萃取）**：分析歷史執行軌跡，找出頻繁出現的多步驟動作序列，封裝為 SOP
1. **Merging（合併）**：把功能重疊的 SOP 合併去冗余，維持工具庫簡潔
1. **Evaluation（評估）**：在新任務上測試每個 SOP 的成功率
1. **Pruning（修剪）**：移除表現差的 SOP，確保工具庫品質只升不降

#### 為什麼重要

SOP 機制相當於幫 Agent 建了一個「可增長的 skill library」，且是從實際成功執行中自動萃取，不需人工設計。對平台開發者的啟示是：工具庫應該被當成**可演化的資產**，而不是一次性的靜態配置。

### 深入要點

- **核心概念**：SOP = callable higher-order tool，封裝多步驟邏輯，對 Agent 的上層規劃器來說就像呼叫一個普通工具
- **實驗結果**：在 ACEBench 的兩個子集上，EvoSOP 相較 base method 提升 **2.5%～13.4%**（視 backbone model 而異），且顯著減少 interaction rounds
- **AgentLens benchmark**：論文同時引入一個以真實 coding agent production trace 建構的評測集，強調實際部署環境而非人工合成任務
- **與 EvoTool（2603.04900）的差異**：EvoTool 改優化工具呼叫策略（policy），EvoSOP 改變的是工具本身的顆粒度（granularity）
- **框架關聯**：LangGraph 的 subgraph 機制、AutoGen 的 ConversableAgent tool registry 都可以直接承接 SOP 概念；MCP 的 tool discovery 未來若支援動態工具版本，EvoSOP 邏輯可以無縫嵌入
- **Limitation**：SOP 品質依賴歷史軌跡的多樣性——若 training distribution 窄，萃取出的 SOP 可能過度特化，在新任務上反而帶來干擾
- **落地門檻**：需要保存結構化執行軌跡（trace），對沒有 trace logging 基礎設施的系統需要補建；SOP 版本管理機制尚未完整討論

### Reviewer 一句話評

SOP 概念本身並不新，但在 LLM agent 工具框架語境下的系統化實作與評測是明確貢獻；2.5%～13.4% 的提升幅度依賴 backbone 選擇，最高增益數字要留意是否在較弱的 baseline model 上取得——整體紮實，是值得在框架工程層跟進的方向論文。

### 給你的 take-away

- 如果你的 Agent 有重複性的多步驟工作流程（例如「讀程式碼 → 分析 → 生成 patch → 測試」這種固定流程），現在就可以評估把它拆成「可被 Agent 呼叫的 SOP 工具」而非每次讓 Agent 重新規劃，EvoSOP 的四步循環是一個可借鑑的管理框架
- 在設計工具庫時，開始記錄「哪些工具組合序列出現最頻繁且成功率最高」——這份 log 是未來自動萃取 SOP 的原料

---


## 論文二｜AgenticSTS: A Bounded-Memory Testbed for Long-Horizon LLM Agents

**作者**: Xiangchen Cheng, Yunwei Jiang, Jianwen Sun, Zizhen Li, Chuanhao Li, Xiangcheng Cao, Yihao Liu, Fanrui Zhang, Li Jin, Kaipeng Zhang　·　**機構**: AlayaLab（Shanda AI）　·　**arxiv**: 2607.02255
**連結**: [arxiv](https://arxiv.org/abs/2607.02255) · [alphaxiv](https://www.alphaxiv.org/abs/2607.02255)

### TL;DR

長任務 Agent 不應把所有對話歷史塞進 context，而應用「有界合約」：每個決策的輸入由五個有型別的記憶層結構化提取而來，prompt 大小始終有限。用《Slay the Spire 2》幾百回合的連續決策當 testbed，並公開 298 條軌跡供比較研究。

### Read Priority

必讀
任何在做長任務 Agent（客服 bot、研究助手、程式碼維護 agent）且正在為「context 越來越長、性能越來越差」頭痛的工程師，AgenticSTS 的五層記憶設計就是一個可直接參考的架構藍圖。

### 領域背景

長任務 LLM Agent 的記憶問題幾乎所有生產系統都碰過：把所有歷史對話塞進 context 不只貴，推理品質在超過某個長度後反而下降（所謂「lost in the middle」問題）；做 summarization 又容易丟失關鍵決策細節。過去研究（Memento、Memory-R2 等）多聚焦在「怎麼更好地 retrieve」，但記憶的「型別結構」與「prompt 組裝邏輯」本身是否可被系統化設計與消融，是較少被嚴格討論的問題。

### 中階導讀


#### 問題

一個需要跑幾百個決策步驟的 Agent（例如長期研究助手、自動程式碼審查、策略型遊戲 AI），如果每步都把前面所有的 context 塞進去，prompt 會爆；如果只保留最近幾步，又會遺忘關鍵的早期資訊。怎麼在「記得重要的東西」和「不讓 prompt 爆炸」之間找到平衡？

#### 方法

AgenticSTS 提出**有界記憶合約**（bounded memory contract）：每個決策的輸入 `u_d = π(L1, L2(s), L3(s), L4(s), L5(s))` 由五層記憶結構化提取組合，**絕不直接附加跨決策的原始 transcript**：
- **L1**：不可變的 operator prompts 和協議
- **L2**：不可變的 state schema 和 action format
- **L3**：靜態知識庫（遊戲中為 577 張牌、121 個敵人的資料）
- **L4**：可寫的 episodic memory + post-run summaries
- **L5**：有 write gate 的 skill library（策略型技能庫）

#### 為什麼重要

每個記憶層都可以單獨消融（ablate），讓工程師能精確知道「到底是哪個層在貢獻性能」，而不是面對一個黑盒 RAG + memory 混合系統。對平台開發者的啟示：記憶設計應是有型別、有邊界、可觀測的系統元件，而非事後補丁。

### 深入要點

- **Testbed**：《Slay the Spire 2》——一個閉合規則的隨機卡牌遊戲，每局需要幾百個戰術與戰略決策，是測試長任務規劃的嚴格環境
- **消融結果** ⚠️（N=10，方向性而非統計顯著）：
- Baseline（無任何記憶）：3/10 勝
- Prompt-only（僅 L1/L2）：4/10 勝
- 加入 L5 skills（Mode A/B）：**6/10 勝**
- Full（所有層）：**6/10 勝**
- Fisher exact p ≈ 0.37，樣本量不足，勿視為定論
- **公開資源**：298 條軌跡、記憶快照、prompt 記錄與腳本，設計為可重現比較的標準評測資產
- **與主流方案的差異**：RAG-based memory（如 mem0、Zep）側重「更好地 retrieve」；AgenticSTS 關注的是「memory 的型別合約與 prompt 組裝架構」，兩者互補
- **Limitation**：實驗規模小（N=10），結果僅為方向性；Slay the Spire 2 是封閉規則遊戲，遷移到開放世界長任務的泛化能力待驗證
- **落地門檻**：需要明確定義各記憶層的型別與 write gate 邏輯，對已有 memory module 的系統需要重構而非小改
- **投稿狀態**：EMNLP 2026 ARR under review

### Reviewer 一句話評

五層架構設計清晰、可消融，是記憶研究方法論上的有益貢獻；但 N=10 的實驗結論根本無法統計顯著，論文誠實地標注了這點是加分項——整體是一篇「問對了問題、工具完善、但需要更大規模驗證」的方向性工作，目前價值在於架構範例，而非效果數據。

### 給你的 take-away

- 如果你的 Agent 有「context 越來越長、但性能沒有跟著提升」的問題，AgenticSTS 的五層型別化設計是一個可以直接對照自己系統的架構檢查清單：L1 是否有、L3 知識庫是否與 L4 episodic memory 分開、L5 技能庫的 write gate 是否有明確的寫入條件
- 公開的 298 條軌跡可以當作設計類似長任務 testbed 的參考資料，尤其是 prompt record 格式對理解 context 組裝邏輯很有幫助

---


## 論文三｜Spider 2.0-AIFunc: Extending Real-World Text-to-SQL to AI-Native SQL Workflows

**作者**: Tianyang Liu, Canwen Xu, Fangyu Lei, Nikki Lijing Kuang, Jixuan Chen, Tao Yu, Julian McAuley, Zhewei Yao, Yuxiong He　·　**機構**: UC San Diego / Microsoft / 哥倫比亞大學等　·　**arxiv**: 2607.06229
**連結**: [arxiv](https://arxiv.org/abs/2607.06229) · [alphaxiv](https://www.alphaxiv.org/abs/2607.06229)

### TL;DR

Snowflake 等雲端資料平台已把 LLM 直接嵌入 SQL（AI_CLASSIFY、AI_COMPLETE 等函式），但現有 text-to-SQL benchmark 完全沒覆蓋這類「AI-native SQL」。本文建立 465 個任務的評測集，最強模型準確率僅約 67%，是資料 Agent 的全新能力缺口。

### Read Priority

必讀
如果你的 Agent 平台需要對接雲端資料倉儲（Snowflake、BigQuery 等），或你在做 data analyst agent，這篇揭示了一個你可能還沒意識到的能力盲區——現有模型在 AI-native SQL 的表現，遠不如在傳統 SQL 上的表現。

### 領域背景

text-to-SQL 是 AI 輔助資料分析的核心能力，Spider 2.0 是這個領域的標竿 benchmark（ICLR 2025 oral）。近一年，Snowflake 的 Cortex AI Functions、BigQuery 的 BQML 等讓分析師可以在 SQL 裡直接用 `SELECT AI_CLASSIFY(review_text, ['positive','negative'])` 做情感分析——完全不需離開資料庫環境。但這種「AI-native SQL」的語法與參數規格和傳統 SQL 截然不同，現有任何 benchmark 都沒有評測過。

### 中階導讀


#### 問題

想像一個資料分析 Agent，客戶問它「幫我找出去年評論最負面的 100 筆訂單」。在有 Snowflake Cortex 的環境下，正確做法是 `SELECT order_id FROM reviews WHERE AI_CLASSIFY(text, ['positive','negative']) = 'negative' ORDER BY date DESC LIMIT 100`——但現有模型幾乎都不知道 AI_CLASSIFY 這個函式的存在，更不知道它的參數格式。現有 text-to-SQL benchmark 完全沒評測過這個場景。

#### 方法

本文基於 Spider 2.0（Snowflake 子集）建立 **Spider 2.0-AIFunc**：
- 用 agent-based pipeline 把原有任務改寫成 AI-native 版本，同時更新 target query 和自然語言指令
- **465 個驗證過的任務**，橫跨 **125 個真實資料庫**
- 涵蓋 **6 種** Snowflake Cortex AI 函式類型（AI_COMPLETE、AI_CLASSIFY、AI_FILTER、AI_SIMILARITY_SCORE 等）
- 評測方法：讓 Agent 有 bash 工具（探索 schema）+ SQL 執行工具，測量 execution accuracy

#### 為什麼重要

AI-native SQL 代表資料基礎設施層正在發生的典範轉移——分析邏輯和 AI 推理的邊界正在消融。Agent 平台如果沒有針對這種能力做特別的訓練或工具支援，就會在雲端資料場景中表現得像個不懂新語法的初學者。

### 深入要點

- **模型表現**：最強 proprietary 模型（GPT 系列）execution accuracy 約 **67%～70%** ⚠️；最佳開源模型達 **58.1%**；差距主要來自三個環節：predicate specification（條件撰寫）、schema grounding（資料表對應）、AI function parameterization（AI 函式參數填寫）
- **反直覺發現**：為傳統 text-to-SQL 設計的複雜 agent（多輪 schema retrieval、table selection 等）**不比 minimal agent 好**——AI-native SQL 需要的能力不是 schema exploration，而是了解 AI 函式本身
- **benchmark 建構方法**：用 agent pipeline 自動改寫任務，同時保持 ground truth 的可驗證性（執行結果一致）——這個建構方法本身也值得關注，是未來建立類似 benchmark 的參考
- **對現有框架的啟示**：LangChain/LangGraph 的 SQL toolkit 需要擴展 AI-native SQL function 的 schema 描述；text-to-SQL fine-tuning dataset 需要補充 AI function 用法示例
- **Snowflake 依賴**：目前 benchmark 鎖定 Snowflake Cortex，BigQuery BQML 和 Azure SQL AI Functions 等類似生態系還沒納入——跨平台泛化性是未來研究方向
- **Limitation**：465 個任務主要由 agent 自動生成並驗證，人工複核範圍有限；AI 函式的語義正確性（如分類標準是否合理）超出 execution accuracy 的評測範圍

### Reviewer 一句話評

問題選得前瞻、時機精準——AI-native SQL 確實是被現有 benchmark 完全忽視的現實缺口；benchmark 建構方法有巧思（agent 改寫 + 自動驗證）。67% 的最高準確率比想像中低，但要留意這是 execution accuracy 而非 semantic accuracy，實際可用性可能更複雜——整體是一篇推動資料 Agent 能力評測往前走一步的有用工作。

### 給你的 take-away

- 如果你的 Agent 要對接 Snowflake，現在就把 Snowflake Cortex AI Functions 的語法和參數格式加進 system prompt 或工具說明，因為模型默認不知道這些函式——這是一個今天就能做的改進
- 在評估資料 Agent 能力時，把 Spider 2.0-AIFunc 加進評測矩陣；如果你的用例涉及 AI-native SQL，傳統 Spider 2.0 分數無法反映真實能力


## 參考資料

- [arxiv:2607.07321](https://arxiv.org/abs/2607.07321)
- [arxiv:2603.04900](https://arxiv.org/abs/2603.04900)
- [arxiv:2607.02255](https://arxiv.org/abs/2607.02255)
- [arxiv:2607.06229](https://arxiv.org/abs/2607.06229)
