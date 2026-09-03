---
title: "AI Agent Arxiv Digest — 2026-07-07"
date: 2026-07-07
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-security, agent-framework, multi-agent]
lang: zh-TW
description: "今天三篇論文都圍繞「讓 agent 系統更安全、更可預測、不出包」這個主軸"
tldr: "今天三篇論文都圍繞「讓 agent 系統更安全、更可預測、不出包」這個主軸。前兩篇出自同一研究團隊，以靜態分析角度出發：一篇系統性揭露 agent 陷入無限循環的成因與規模，另一篇則為整個 agent 程式碼建立依賴圖，讓安全審計和元件盤點成為可能。第三篇針對 multi-agent 軟體開發，把 LLM 輸出的信心分數引入協作流程，防止早期幻覺向下游蔓延。"
series:
  name: "AI Agent Arxiv Digest"
  order: 44
---
> 🌏 [English version](/en/posts/daily/2026-07-07-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文都圍繞「讓 agent 系統更安全、更可預測、不出包」這個主軸。前兩篇出自同一研究團隊，以靜態分析角度出發：一篇系統性揭露 agent 陷入無限循環的成因與規模，另一篇則為整個 agent 程式碼建立依賴圖，讓安全審計和元件盤點成為可能。第三篇針對 multi-agent 軟體開發，把 LLM 輸出的信心分數引入協作流程，防止早期幻覺向下游蔓延。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| 靜態分析（Static Analysis） | 不實際執行程式，只看程式碼結構來找潛在問題，像讀食譜猜廚師有沒有放錯料 |
| Infinite Agentic Loop（無限代理循環，IAL） | Agent 陷入無法終止的循環，一直打 API、呼叫工具，直到帳單爆炸或被強制中斷 |
| Agent Dependency Graph（代理依賴圖，ADG） | 把 agent 程式裡的模型、prompt、工具、記憶體、控制邏輯全畫成一張圖，讓關係一目了然 |
| 幻覺傳播（Hallucination Propagation） | 前期 agent 產生錯誤輸出，下游 agent 照單全收繼續用，像電話傳言遊戲越傳越歪 |
| Token Log Probability（token 對數機率） | LLM 每輸出一個詞時的信心分數；分數很低代表模型其實不確定，可用來偵測「假裝有把握」的回應 |


---


## 論文一｜When Agents Do Not Stop: Uncovering Infinite Agentic Loops in LLM Agents

**作者**: Xinyi Hou, Shenao Wang, Yanjie Zhao, Haoyu Wang　·　**arxiv**: 2607.01641
**連結**: [arxiv](https://arxiv.org/abs/2607.01641) · [alphaxiv](https://www.alphaxiv.org/abs/2607.01641)

### TL;DR

Agent 程式可能陷入「停不下來的迴圈」，本文開發靜態掃描工具 IAL-Scan，評估 6,549 個真實 repo，精準度 91.9%，發現這是比想像中普遍的系統性問題。

### Read Priority

必讀
只要你部署過 LangGraph、AutoGen 或任何 agentic workflow，幾乎都踩過「agent 一直跑不停」的雷；這篇把問題系統化、給出規模數據，值得每位平台工程師讀完方法章節。

### 領域背景

現代 LLM agent 靠「反覆執行迴圈（iterative loop）」完成任務——每輪呼叫模型、使用工具、更新狀態、轉交給下一個 agent。這個設計彈性很高，但也留下一個隱患：當回饋路徑沒有被正確限制，agent 可能無限重複同樣動作。傳統程式有 while-loop 分析工具，但 agent 的「迴圈」藏在框架語義（framework semantics）裡——例如 LangGraph 的 conditional edge、AutoGen 的 handoff 宣告——一般靜態分析工具完全看不進去。

### 中階導讀


#### 問題

想像一個「自動客服 agent」：它呼叫工具查訂單 → 工具回傳模糊結果 → agent 決定再查一次 → 工具再次回傳模糊答案……這個循環沒有終點。每次迴圈都在耗費 API token、呼叫外部工具、可能反覆修改資料庫。一個請求可以在幾分鐘內把當月 API 預算燒光，或讓下游服務癱瘓（self-inflicted DoS）。

#### 方法

IAL-Scan 分三步：**第一步**，把 LangGraph、AutoGen、CrewAI 等框架的程式碼抽象成「框架無關的 Agent IR（中間表示）」；**第二步**，從 IR 建出 Agentic Loop Dependence Graph（ALDG），把「可能形成迴圈的回饋路徑」全部標出來；**第三步**，檢查每條路徑是否有「有效的終止條件（termination bound）」，沒有的就標為 IAL 風險。

#### 為什麼重要

這是 IAL 問題的首個大規模系統性研究，確認了 68 個 IAL 失敗案例分散在 47 個真實專案。更關鍵的是：它揭示這不是個別開發者的失誤，而是 agent 框架設計本身留下的系統性漏洞——現有框架雖有 `recursion_limit` 這類保護，但多數開發者沒有正確設定，或用了可以繞過的寫法。

### 深入要點

- IAL 分四類：model call loop（模型重試不止）、tool call loop（工具反覆呼叫）、state update loop（狀態無上限累積）、agent handoff loop（agent 互傳球不終止）
- 評估規模：6,549 個 GitHub repo，IAL-Scan 產出 74 個候選，人工確認 68 個真正 IAL，精準度 **91.9%**（論文數據）
- 漏報調查：另抽 100 個未被報告的「高風險 agent」，發現 9 個漏網——主因是動態工具綁定（dynamic tool binding）和自訂 orchestration 邏輯，靜態分析看不進去
- 與 LangGraph 的 `recursion_limit` 參數直接相關；框架的保護機制存在但常被錯誤使用或刻意繞過
- 本文與同日發表的 AgentFlow（2607.01640）出自同一研究團隊，可視為配對論文：AgentFlow 建整體依賴圖，IAL-Scan 專注迴圈路徑
- Limitation：動態生成的 agent 拓撲（runtime-generated topologies）和跨語言呼叫無法靜態捕捉；**Recall 未評估**，6,549 個 repo 裡只確認 68 個，整體漏報率未知

### Reviewer 一句話評

問題定義清晰、工具有實際用途、91.9% precision 在靜態分析領域屬合理水準；但 recall 完全沒評估是個明顯缺口，且 6,549 個 repo 中只找到 68 個讓人好奇覆蓋率。整體偏工程報告風格，理論貢獻有限，但對實務 agent 開發者有直接參考價值。

### 給你的 take-away

- 如果你維護 LangGraph 或 AutoGen 專案，現在就去檢查你的 recursion_limit 設定和每個 agent handoff 的終止條件——論文的四類 IAL 是很好的 review checklist
- 如果你在做 agent 平台，IAL 值得加進 observability dashboard：「連續 N 次相同工具呼叫」或「token 耗用超出預期倍數」都是可以設的早期警報

---


## 論文二｜AgentFlow: Building Agent Dependency Graphs for Static Analysis of Agent Programs

**作者**: Shenao Wang, Xinyi Hou, Yanjie Zhao, Xiao Cheng, Haoyu Wang　·　**arxiv**: 2607.01640
**連結**: [arxiv](https://arxiv.org/abs/2607.01640) · [alphaxiv](https://www.alphaxiv.org/abs/2607.01640)

### TL;DR

為 agent 程式碼建出一張「依賴圖」，讓你看清這個 agent 用了哪些模型、prompt、工具、記憶體，並自動偵測有危險的「prompt 到高權限工具」路徑；支援 5 大主流框架，分析了 5,399 個真實專案。

### Read Priority

必讀
Agent 的供應鏈安全（supply chain security）和治理（governance）正在成為企業部署的必要條件，這篇提供了第一個跨框架的系統性解法，架構概念值得納入你的 platform 設計思路。

### 領域背景

傳統軟體有成熟的靜態分析工具（如 SAST）可以分析依賴、找安全漏洞。但 LLM agent 程式很特殊：它混合了「普通 Python 程式碼」和「框架定義的語義」（agent constructor、tool decorator、agent handoff 宣告等），依賴關係藏在 framework-induced semantics 裡，不是普通的 import 或 function call，既有工具完全失效——你根本不知道這段程式碼在 runtime 時哪個 agent 能觸達哪個工具。

### 中階導讀


#### 問題

你的公司用 CrewAI 搭了一個業務流程 agent，裡面有 10 個 sub-agent、30 幾個工具。發生資料外洩事件後，你想知道：哪個 prompt 能觸發到哪個工具？哪個模型的回應被哪段記憶體影響？現在根本沒有工具能幫你快速回答這些問題，只能一行一行讀程式碼。

#### 方法

AgentFlow 分析原始碼，建出 Agent Dependency Graph（ADG）——一個有型別的圖，節點是 agent、prompt、model、capability（工具）、memory state、control policy，邊是三種依賴關係：component-dependency、control-flow、data-flow。這個圖與框架無關，支援 OpenAI Agents SDK、LangChain/LangGraph、CrewAI、LlamaIndex、Semantic Kernel 五個框架。

#### 為什麼重要

ADG 建好後能做多種分析：自動產生「Agent BOM（Bill of Materials，元件清單）」；偵測「prompt-to-tool risk」——哪些 prompt 可能被操控去呼叫高權限工具（prompt injection 的靜態預警）；未來還能支援供應鏈攻擊分析、合規稽核等。

### 深入要點

- 資料集：從 GitHub 收集 5,399 個使用上述框架的 Python 專案（LangChain/LangGraph 3,823 個、CrewAI 947 個、OpenAI Agents SDK 442 個、LlamaIndex 146 個、Semantic Kernel 41 個）（論文數據）
- Prompt-to-tool 風險偵測精準度 **73.0%**（100 個抽樣報告中 73 個確認有真實風險）（論文數據）；另發現 9 個漏報，主因是動態工具綁定和自訂 wrapper
- Agent BOM 概念類比軟體供應鏈的 SBOM（Software Bill of Materials），對企業合規和安全審計直接有用
- 與 IAL-Scan（2607.01641）出自同組，ADG 和 ALDG 可視為互補：ADG 描述「整個 agent 的結構」，ALDG 聚焦「哪條路徑會造成無限循環」
- 跨框架支援是亮點，尤其 OpenAI Agents SDK 是 2026 年快速成長的框架，工具能第一批支援很有時效性
- Limitation：動態框架語義（runtime-generated agents、動態 tool 載入）無法靜態捕捉；precision 73% 代表約 1/4 報告是誤報，仍需人工確認；**Recall 同樣未正面評估**

### Reviewer 一句話評

框架覆蓋廣、應用場景具體、資料集規模紮實，BOM 和 prompt-to-tool 的概念對業界有啟發性。但 73% precision 對安全工具來說偏低——誤報太多容易讓工程師警告疲勞（alert fatigue）。整體是奠基性的探索工作，分類框架的貢獻比工具本身更持久。

### 給你的 take-away

- 如果你做 agent 平台的 DevX（Developer Experience），可以考慮把「agent BOM 自動產生」加入 CI pipeline，讓開發者在 merge 時就知道這個 agent 的依賴清單和風險暴露面
- 如果你做企業 agent 部署的安全 review，「哪些 prompt 路徑能觸達高權限工具」這個問法值得納入你的威脅建模（threat modeling）流程

---


## 論文三｜UA-ChatDev: Uncertainty-Aware Multi-Agent Collaboration for Reliable Software Development

**作者**: Temitayo Olamilekan Ogunsusi, Lijun Qian, Xishuang Dong（Prairie View A&M University）　·　**arxiv**: 2607.02186
**連結**: [arxiv](https://arxiv.org/abs/2607.02186) · [alphaxiv](https://www.alphaxiv.org/abs/2607.02186)

### TL;DR

讓 multi-agent 軟體開發框架學會「自我懷疑」：用 token 的信心分數決定哪個 agent 的輸出需要驗證再轉交，防止早期錯誤在 pipeline 中滾雪球。

### Read Priority

略讀
對 coding agent 或 multi-agent orchestration 有興趣的工程師，「方法」段的概念值得看；如果你不熟 ChatDev 框架，只讀 TL;DR 和 take-away 就夠了。

### 領域背景

ChatDev（2023 年提出）是最早把 LLM 組成「角色扮演多 agent 團隊」做軟體開發的框架：需求分析師、程式設計師、測試員各司其職，一棒接一棒。問題是每個 agent 接到前一個 agent 的輸出時都「照單全收」——沒有機制判斷前一步是否可靠，所以一旦需求分析師幻覺了一個不存在的 API，後面的程式設計師和測試員全跟著幻覺走，最後交出根本跑不起來的程式。

### 中階導讀


#### 問題

Agent A 寫需求文件 → Agent B 照文件寫程式 → Agent C 照文件寫測試。但 Agent A 幻覺了一個不存在的 API，Agent B 不知道所以照著寫，Agent C 不知道所以照著測——最後整個 pipeline 交出一份看起來很完整、但完全跑不起來的程式碼。現有框架對這種「早期幻覺傳染」毫無防禦。

#### 方法

UA-ChatDev 在每個 agent 交棒前計算這次輸出的「不確定性分數」：聚合 LLM 輸出每個 token 時的 log probability（對數機率），得出一個信心指標。每個開發階段（需求、設計、實作、測試）有獨立的閾值（phase-aware threshold calibration），分數太低就觸發 retrieval-based verification——去找外部參考資料確認後，再把修正過的輸出傳給下游 agent。

#### 為什麼重要

這個方法的最大優點是「輕量」：不需要額外訓練任何模型，log probability 大多數 LLM API 都支援，改動只在 agent 之間的接口層，可以插入現有框架而不大改架構。

### 深入要點

- 不確定性估算基於 token-level log probability，屬 white-box 方法，需要 LLM API 開放 logprobs 參數（OpenAI、Anthropic API 均支援，但部分本地部署模型不開放）
- Phase-aware threshold calibration：不同開發階段用不同閾值，需求階段門檻更嚴（早期錯誤代價更高），實作階段較寬鬆
- 在 SRDD（Software Requirements-Driven Development）benchmark 上，completeness、executability、consistency、overall quality 四項指標均優於現有框架 **⚠️**（具體改善幅度請查原文表格，公開資訊未提供確切數字）
- Retrieval-based verification 的「去哪找資料」在公開摘要中未說清楚，是方法說明的一個模糊點
- Limitation：依賴 logprobs API，對不開放此參數的模型無法套用；SRDD benchmark 規模較小，缺乏在 SWE-bench 等主流 benchmark 上的驗證；本質上是 ChatDev 的改良版，非框架性突破

### Reviewer 一句話評

問題真實、方法輕量、想法直觀，logprob 當信心指標的思路在業界已有應用但學界正式化得不多。然而這本質上是 ChatDev 的改良版，SRDD benchmark 知名度低，缺乏與更強基線（如 SWE-bench 上的 coding agent）的對比，說服力有限。值得追蹤方向，但不是突破性論文。

### 給你的 take-away

- 如果你的 multi-agent pipeline 的 LLM API 有開放 logprobs，可以把「token 平均 log probability 低於閾值就觸發重試或人工確認」直接加進 agent 接口層——這個邏輯不需要讀完整篇論文就能試
- 如果你在評估 coding agent 框架，可以問：「這個框架在每個 agent 交棒時有沒有任何可靠性過濾機制？」完全沒有的框架在長流程任務上更容易出包


## 參考資料

- [arxiv:2607.01641](https://arxiv.org/abs/2607.01641)
- [arxiv:2607.01640](https://arxiv.org/abs/2607.01640)
- [arxiv:2607.02186](https://arxiv.org/abs/2607.02186)
