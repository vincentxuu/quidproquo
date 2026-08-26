---
title: "AI Agent Arxiv Digest — 2026-07-02"
date: 2026-07-02
category: daily
tags: [ai-agent, arxiv, daily, agent-rag, agent-memory, agent-evaluation]
lang: zh-TW
description: "今日三篇分別瞄準 Agent 平台的三大核心難題：**記憶如何從「撈資料」升級成「推理狀態」**（User as Code）、**多 Agent 如何去掉中央協調者卻更省成本**（DeLM），以及**Web Agent 執行後如何讓人快速驗證結果**（HANSEL）"
tldr: "今日三篇分別瞄準 Agent 平台的三大核心難題：**記憶如何從「撈資料」升級成「推理狀態」**（User as Code）、**多 Agent 如何去掉中央協調者卻更省成本**（DeLM），以及**Web Agent 執行後如何讓人快速驗證結果**（HANSEL）。三篇合在一起，幾乎就是一張高信任 Agent 平台的技術地圖——記憶層、協調層、可解釋層各攻一塊。"
series:
  name: "AI Agent Arxiv Digest"
  order: 39
---
> 🌏 [English version](/en/posts/daily/2026-07-02-ai-agent-arxiv-digest-en)

## 今日總覽

今日三篇分別瞄準 Agent 平台的三大核心難題：**記憶如何從「撈資料」升級成「推理狀態」**（User as Code）、**多 Agent 如何去掉中央協調者卻更省成本**（DeLM），以及**Web Agent 執行後如何讓人快速驗證結果**（HANSEL）。三篇合在一起，幾乎就是一張高信任 Agent 平台的技術地圖——記憶層、協調層、可解釋層各攻一塊。

## 讀這篇前該知道的詞


| 白話解釋 | 詞 |
|---|---|
| 讓 Agent 記住使用者跨對話的偏好與歷史；不是對話視窗本身，而是「另外存起來、下次用得到」的持久儲存 | Agent 記憶（Memory） |
| 把記憶「撈回來」的方式；最常見是用語意相似度搜尋，類似 Google 搜尋的感覺 | Retrieval（語意檢索） |
| 多個 AI 分工合作完成任務的系統；想像成一個專案團隊，每個 agent 負責不同子任務 | Multi-Agent System（MAS） |
| MAS 裡負責分派任務、整合結果的「主管」；DeLM 的核心主張是去掉這個單點 | Orchestrator（協調者） |
| Agent 執行任務時留下的步驟紀錄；Web Agent 的軌跡包含它點了哪些頁面、抓了哪些資料 | Trajectory（軌跡） |


---


## 論文一｜User as Code: Executable Memory for Personalized Agents

**作者**: Bojie Li（Pine AI）　·　**arxiv**: 2606.16707
**連結**: [arxiv](https://arxiv.org/abs/2606.16707) · [alphaxiv](https://www.alphaxiv.org/abs/2606.16707)

### TL;DR

把「使用者模型」從一堆文字筆記，升級成可以直接執行的 Python 程式碼，讓 Agent 不只能「查詢事實」，還能對使用者狀態做計算與邏輯推理。

### Read Priority

必讀
Agent 個人化是 2026 最熱需求之一；這篇從根本重新定義「記憶應該長什麼樣子」，對在做個人化功能的工程師幾乎直接可用。

### 領域背景

AI Agent 需要記住使用者跨越多個對話的偏好——例如你告訴 Agent「我不吃堅果」，下週訂餐時還要記得。現有系統幾乎都把這些偏好存成純文字或知識圖譜，再用語意搜尋撈回來。問題在於：「撈相似的記憶」和「推理使用者狀態」是兩件事，文字記憶很難處理邏輯衝突、跨多筆彙總統計，以及複雜的「如果…則…」規則。

### 中階導讀


#### 問題

想像你的 Agent 記住了一百筆你的飲食偏好、行程備注、消費習慣。現在它要回答：「我這個月花了多少在外食上？」這是一個「彙總計算」，不是「找最像的那筆記憶」——但所有靠語意搜尋的記憶系統都答不好，因為它們沒辦法把一百筆一起拿來算。

#### 方法

User as Code（UaC）把使用者模型存成 Python 程式碼：用 typed Python objects 描述使用者的「狀態」（例如 `user.monthly_food_budget`），再用 Python functions 描述「規則」（例如「如果訂單含花生，標記為 reject」）。這段程式碼是活的，每次對話後 Agent 把新資訊 append 進 event log，並定期 checkpoint 成整理過的結構化程式碼。要回答問題時，直接執行這段程式碼算出答案。

#### 為什麼重要

對平台開發者而言，UaC 意味著「使用者記憶」從 blob storage + vector search，變成一個版本控管的程式碼庫。記憶邏輯可測試、可審計、可 diff。對 PM 而言，個人化功能的精度可以從「大概對」躍升到「精確計算」。

### 深入要點

- **兩段式 pipeline**：append-only event log（永不刪記錄）→ 定期 checkpoint 成結構化 Python code；靈感來自資料庫的 event sourcing 設計模式
- **LOCOMO benchmark**：一般事實問題 78.8%，與 full-context 上限和最強 retrieval-based 系統相當
- **彙總問題的斷崖**：retrieval-based memory 在彙總問題（aggregate questions）只有 6–43%，UaC 達到 **99%**；這個差距是論文最核心的論點
- **與 MemGPT / Mem0 的對比**：現有主流系統仍以文字 + 檢索為核心；UaC 是首篇把使用者模型整體存成可執行程式碼的論文（作者自稱）
- **Limitation**：程式碼生成依賴 LLM，若 LLM 產出有 bug 會靜默出錯；LOCOMO 規模偏小，大型部署穩定性尚待驗證
- **落地門檻**：需要底層 LLM 能穩定輸出正確 Python；複雜使用者邏輯的 code 品質強烈依賴 model 能力
- **作者**：Bojie Li，Pine AI；單作者論文，獨立研究機構，學術根基較淺但工程實踐導向

### Reviewer 一句話評

想法新穎，99% vs 6–43% 的彙總問題差距說服力強。但 LOCOMO 是個偏小且偏乾淨的 benchmark；真實使用者行為更雜亂矛盾，code checkpoint 在 edge case 的品質是最大疑問。值得追蹤，但別在壓測前搬進 production。

### 給你的 take-away

- 你在做 Agent 個人化 → 先看 Section 3（two-phase pipeline 架構），對比你現在的記憶方案是否有同樣的「彙總盲點」
- 你在設計記憶層 schema → 問自己：使用者問的是「哪筆最相關」還是「跨多筆統計」？前者 RAG 夠用，後者應該考慮 UaC 或混合方案

---


## 論文二｜DeLM: Decentralized Multi-Agent Systems with Shared Context

**作者**: Yuzhen Mao、Azalia Mirhoseini（Stanford University）　·　**arxiv**: 2606.10662
**連結**: [arxiv](https://arxiv.org/abs/2606.10662) · [alphaxiv](https://www.alphaxiv.org/abs/2606.10662)

### TL;DR

把 Multi-Agent 系統裡「一個主管分派所有任務」的架構，換成「所有 agent 共讀一個驗證過的進度表、自己搶任務」——SWE-bench 上省 50% 成本，還拿到更高分。

### Read Priority

必讀
這篇直接挑戰 LangGraph / AutoGen 的核心假設（centralized orchestrator）。任何在做 multi-agent pipeline 或評估 agent 框架的人，這篇都是必讀的反例。

### 領域背景

大多數現有 Multi-Agent 系統（MAS）都是中央集權式：一個 Orchestrator 把大任務拆成子任務，分派給 worker agents，再彙整輸出。這個設計在小規模沒問題，但當子任務變多，Orchestrator 成為瓶頸：它的 context 越塞越大，要追蹤所有 agent 的狀態、解決衝突，推理成本線性成長。

### 中階導讀


#### 問題

想像一個軟體工程 Agent 系統要修 100 個 bug。中央式做法：一個 orchestrator 一直讀所有 100 個 bug 的狀態，決定誰負責哪個、整合 patches。問題是這個 orchestrator 的 context 越來越長，推理成本跟著線性爆炸。

#### 方法

DeLM 拿掉中央 Orchestrator，換成三個元件：
1. **Task Queue**：所有待辦子任務列在這裡
1. **Shared Verified Context**：所有 agent 都能讀到「已確認完成的進度」
1. **Parallel Agents**：agent 自己從 Queue 搶任務，完成後把驗證過的更新寫回 Shared Context
Agent 之間不需直接通訊，只需讀/寫共享狀態。每個 agent 的 context 保持小而精準。

#### 為什麼重要

這個架構和現有主流框架（LangGraph 的 graph-based 流程、AutoGen 的 group chat）根本不同，更像資料庫的 event sourcing + worker pool 模式。對平台開發者而言，scale-out 可以像加 worker pod 一樣簡單，而不是重新設計 orchestrator 邏輯。

### 深入要點

- **SWE-bench Verified**：使用 Gemini 3-Flash，達到 65.7%，比最強中央式 baseline 高 **+10.5pp**，成本低約 **50%** ⚠️（VentureBeat 報導數字，需對照論文原始 Table 確認）
- **LongBench-v2 Multi-Doc QA**：在四個前沿模型上都拿到最高平均精度；說明這個架構不只適合 coding，也適合長文件推理
- **Shared Context 的驗證機制**：Agent 寫回的資訊需通過驗證才進 Context，防止錯誤資訊汙染後續 agent；具體驗證方式（unit test、LLM judge？）細節待查論文 Section 3
- **與 AutoGen / LangGraph 的關係**：DeLM 提出的是一個架構模式（pattern），理論上可在 LangGraph 之上實作類似的 shared-state node
- **開源實作**：GitHub `yuzhenmao/DeLM`，成熟度待確認
- **Limitation**：Shared Context 的 concurrency 一致性、寫回衝突的解法目前不清楚；真實部署的 fault tolerance 機制未見論文說明
- **作者背景**：Azalia Mirhoseini 為 Stanford 教授，前 Google/DeepMind，credibility 高

### Reviewer 一句話評

架構思路清晰，SWE-bench 數字夠亮眼，Stanford 出處增加可信度。但 50% 成本降幅背後的 baseline 設定（token counting 方式、是否含 overhead）需仔細核對；Shared Context 的 concurrency 問題在論文裡看起來被輕描淡寫——這篇偏研究原型多於直接落地的框架。

### 給你的 take-away

- 你在設計 multi-agent pipeline → 用 DeLM 的 shared-context pattern 評估你目前 Orchestrator 是否是成本/延遲瓶頸，特別是子任務 > 10 個的情境
- 你在選 agent 框架 → 問廠商「你們怎麼支援 stateful shared context 和 async task claim」，這篇給了你評估框架的詞彙

---


## 論文三｜HANSEL: Extracting Breadcrumbs from Web Agent Trajectories for Interactive Verification

**作者**: Yujin Zhang、Daye Nam（University of California, Irvine）　·　**arxiv**: 2606.18671
**連結**: [arxiv](https://arxiv.org/abs/2606.18671) · [alphaxiv](https://www.alphaxiv.org/abs/2606.18671)

### TL;DR

Web Agent 執行完任務後，HANSEL 自動從瀏覽歷史中抽出「最關鍵的幾頁」讓使用者點進去驗證，比起讓人看完整 log 省了 61% 的軌跡量。

### Read Priority

📖 略讀
對「Agent 可解釋性 / 使用者信任」有興趣的人值得快讀；如果你現在最大痛點不是 Web Agent observability，可以先存著。

### 領域背景

Web Agent（如 OpenAI Operator、Claude Computer Use）可以自動幫使用者做線上任務：比價、訂票、填表。但使用者怎麼知道 agent 有沒有做錯？現在要麼「完整回放軌跡」（幾十步截圖，沒人看完），要麼讓 LLM 自動總結（可能幻覺）。

### 中階導讀


#### 問題

你請 Web Agent 找三家旅館、比含早餐的價格、篩掉差評。它跑了 40 步，最後推薦 A 旅館。你想驗證，但 40 步的 log 看完要 10 分鐘——你不看，但又不安心直接相信。

#### 方法

HANSEL（Highlighting Agent Navigation Steps as Evidence Links）從軌跡中自動識別「提供了最終答案依據」的關鍵頁面，保留它們的互動狀態（當時套用的 filter、搜尋詞、捲動位置），讓使用者直接點進那幾頁重新操作確認。如果答案無法對應到任何拜訪過的頁面，HANSEL 明確標出「這個 gap」。

#### 為什麼重要

Web Agent 的信任問題是部署最大障礙。HANSEL 提供了一個輕量的「audit trail」解法，不需要完全回放，只看關鍵的幾頁。對平台商而言，這是提升使用者信任、降低人工審核成本的實用方向。

### 深入要點

- **評估集**：AssistantBench + Online-Mind2Web，共 45 個任務（規模偏小）
- **核心指標**：Evidence page 辨識 **83.7% precision / 88.8% recall**；軌跡壓縮 **61.6%**（只保留關鍵頁面）
- **互動狀態保存**：filter、query string、scroll position 都被記錄並可重現——比單純截圖更有驗證價值
- **Gap 偵測**：當 agent 答案無法追溯到任何拜訪過的頁面時顯示警告；對偵測 hallucination 有側面幫助
- **與 Playwright trace / Langsmith 的差異**：現有工具記的是「操作步驟」；HANSEL 記的是「推理依據頁面」——層次不同
- **Limitation**：45 個任務評估集偏小；只評估有結構化 trajectory log 的 agent，黑盒 agent 無法接入；真實 web 頁面的動態載入、登入牆對準確率的影響未知
- **落地門檻**：需要 agent 本身輸出含 page content + reasoning 的結構化 trajectory；現成 agent 通常不保留這些

### Reviewer 一句話評

問題定義精準，解法簡潔，gap detection 的設計特別有亮點。但 45 個任務的評估集太小，且都來自相對乾淨的 benchmark——這是個方向正確的 research prototype，現在還不是 production-ready 工具。

### 給你的 take-away

- 你在做 Web Agent 產品 → 把「evidence page extraction」列入 UX 路線圖；即使不用 HANSEL 本身，「讓使用者一鍵查證 agent 的來源」這個 UX pattern 值得現在就設計進去
- 你在做 agent observability 平台 → HANSEL 的 gap detection 邏輯（答案是否有 trajectory 支撐）可以成為你 alerting 的一個監控訊號


## 參考資料

- [arxiv:2606.16707](https://arxiv.org/abs/2606.16707)
- [arxiv:2606.10662](https://arxiv.org/abs/2606.10662)
- [arxiv:2606.18671](https://arxiv.org/abs/2606.18671)
