---
title: "AI Agent Arxiv Digest — 2026-06-16"
date: 2026-06-16
category: daily
tags: [ai-agent, arxiv, daily, agent-deployment, agent-evaluation, agent-framework]
lang: zh-TW
description: "今天三篇論文從「訓練 → 架構 → 環境」三個層次，一起回答同一個問題：怎麼讓 Agent 在真實系統裡更可靠"
tldr: "今天三篇論文從「訓練 → 架構 → 環境」三個層次，一起回答同一個問題：怎麼讓 Agent 在真實系統裡更可靠？RefGRPO 找出 Agent RL 訓練中被忽略的反思校準問題，讓 Agent 成為自己的驗證器；「Agents All the Way Down」給出從 LLM substrate 到上線部署的完整 custom agent 方法論，強調地基穩固比框架選擇更重要；EurekAgent 則以自主科研任務為場景，證明「環境工程」比「流程工程」更決定 agent 的可靠性上限。"
series:
  name: "AI Agent Arxiv Digest"
  order: 23
---
> 🌏 [English version](/en/posts/daily/2026-06-16-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文從「訓練 → 架構 → 環境」三個層次，一起回答同一個問題：怎麼讓 Agent 在真實系統裡更可靠？RefGRPO 找出 Agent RL 訓練中被忽略的反思校準問題，讓 Agent 成為自己的驗證器；「Agents All the Way Down」給出從 LLM substrate 到上線部署的完整 custom agent 方法論，強調地基穩固比框架選擇更重要；EurekAgent 則以自主科研任務為場景，證明「環境工程」比「流程工程」更決定 agent 的可靠性上限。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| Reflection Gap（反思落差） | Agent 看到環境回饋（如程式執行結果）後，仍無法正確判斷「我有沒有答對」的現象；即使答對了也說「不確定」 |
| Calibration（校準） | 模型「預測自己對不對」的準確度；校準良好 = 說有把握時通常真的對，說沒把握時通常真的不對 |
| Agentic RL（Agent 強化學習） | 讓 LLM Agent 在環境中互動（如執行程式碼、查詢資料庫），用交互結果訓練模型的強化學習方法 |
| Substrate（底層基礎） | 把 LLM 視為軟體元件的最底層架構，涵蓋 tools / system prompt / messages 三層；好比蓋房子的地基 |
| Environment Engineering（環境工程） | 不只設計 Agent 的思考流程，而是精心設計 Agent 工作的「環境」（隔離機制、評分介面、資源限制），讓可靠行為自然浮現 |


---


## 論文一｜Closing the Reflection Gap: A Free Calibration Bonus for Agentic RL

**作者**: Yinglun Zhu（University of California, Riverside）　·　**arxiv**: 2606.14211
**連結**: [arxiv](https://arxiv.org/abs/2606.14211) · [alphaxiv](https://www.alphaxiv.org/abs/2606.14211)

### TL;DR

LLM Agent 明明答對了卻說「我答錯了」——本文用一個不需額外標注的校準獎勵修正這個反思偏差，讓 Agent 真正成為自己的驗證器。

### Read Priority

必讀
直接觸及 Agent 自我改進的可靠性根基，對任何有 RL fine-tuning 或 self-improvement loop 的 agent 系統都是核心問題。

### 領域背景

Agent 在與環境互動後需要「反思」——判斷「我剛才做對了嗎？」這個能力叫做 calibrated reflection（校準反思）。然而研究發現，大部分 LLM Agent 存在嚴重的 reflection gap：即使答對了，也常誤認為答錯（underconfidence）。更麻煩的是，標準 RL 訓練因為 credit assignment（功勞歸屬）不對齊，完全沒辦法修正這個問題。

### 中階導讀


#### 問題

想像一個 SQL 生成 agent：使用者下了查詢，agent 執行後拿到正確資料，但它的反思卻寫「這個 SQL 可能不對，我不確定」。這樣的 agent 就算任務做對了，也無法當驗證器排除錯誤答案，self-improvement loop 也會因為 pseudo-reward 不可信而崩潰。

#### 方法

作者提出 **RefGRPO**，在 GRPO（Group Relative Policy Optimization，一種流行的 LLM RL 算法）之上加一個「校準獎勵」。核心想法：把 agent 的 reflection（對結果的判斷）和真實環境結果做對比，若判斷準確就給正向獎勵，反之負向。這個獎勵完全來自環境本身的訊號，不需要額外的 reward model、LLM judge 或人工標注——所以稱「免費」。搭配動態係數調節（dynamic schedule）避免訓練不穩定。

#### 為什麼重要

校準好的反思可以讓 agent 做三件事：(1) 當自己的 verifier（輸出之前先自我篩選）；(2) 生成可信的 pseudo-reward，支持無監督訊號的 self-improvement；(3) test-time selective prediction——只在 reflection 說「答對了」時才 commit 答案，提升推論精度。

### 深入要點

- **Reflection gap 定義**：P(model says correct | actually correct) 與 P(model says correct | actually wrong) 的差值；gap 愈小代表反思愈不可信
- **為何標準 RL 無效**：任務 reward 只在最後給，reflection token 的 credit assignment 不對齊，RL 無從修正反思品質
- **RefGRPO 的兩成分**：① Calibration bonus（從 reflection vs. outcome 對比計算）② Dynamic coefficient schedule（動態調節 λ，避免過早放大校準 loss 干擾任務學習）
- **關鍵數據（5 個 text-to-SQL benchmark）**：underconfidence rate 從 **44.4% → 7.7%**（下降 83%）；task accuracy 從 **75.1% → 76.5%**（+1.4pp）
- **衍生應用一**：Self-improvement with pseudo-rewards（不需 outcome 監督訊號）
- **衍生應用二**：Test-time selective prediction（過濾掉 reflection 說答錯的 rollout）
- **落地門檻**：需要 RL fine-tuning 基礎設施；無法直接套用到 inference-only 的生產 agent
- **Limitation**：只在 text-to-SQL 上驗證；task accuracy 提升幅度偏小（1.4pp）；44.4% 的 baseline underconfidence rate ⚠️（不確定是否為特定模型特性，還是普遍現象）

### Reviewer 一句話評

概念清楚、問題真實，calibration bonus 免費這點有說服力；但實驗只在 text-to-SQL 上，task accuracy 僅微升 1.4pp，跨任務泛化尚未驗證。「有想法但尚未完全紮實」，值得追蹤後續複現。

### 給你的 take-away

- Agent 有 RL fine-tuning 管線？→ 看 RefGRPO 的 calibration bonus 設計，不需額外基礎設施，能顯著降低 agent 「明明對卻說錯」的問題
- 在做 agentic evaluation 或 critic 機制？→ 本文「reflection as verifier」視角可直接套用在 commit filter 邏輯設計上

---


## 論文二｜Agents All the Way Down: A Methodology for Building Custom AI Agents from Substrate to Production

**作者**: Marc Alier Forment, Juanan Pereira, Francisco José García-Peñalvo, María José Casañ Guerrero（Universitat Politècnica de Catalunya 等）　·　**arxiv**: 2606.11869
**連結**: [arxiv](https://arxiv.org/abs/2606.11869) · [alphaxiv](https://www.alphaxiv.org/abs/2606.11869)

### TL;DR

不想每次框架升級就重寫 agent？這篇給你從 LLM API 底層到上線維護的完整方法論：兩個前提條件（substrate + building blocks）加上三個持續實踐，比「先 pip install langchain」更底層也更持久。

### Read Priority

必讀
少數系統地整理「如何在真實產品裡建 agent」的學術論文，P1/P2 框架語言清楚，適合 agent 平台團隊建立技術規範的共同語言。

### 領域背景

市面上的 agent 框架（LangGraph、AutoGen、CrewAI）讓工程師快速起步，但也讓人跳過底層理解。一旦框架版本升級或換 LLM 供應商，系統就得大改。「Custom agent」（客製 agent）是相對通用 AI assistant 的另一種選擇：它活在特定應用裡、只做一件事、有明確安全邊界——這種 agent 更適合生產環境，但建造它需要對底層有紮實理解。

### 中階導讀


#### 問題

「我用 LangGraph 建了 agent，改個 system prompt 行為就變，升級新版又要重寫 tool interface——為什麼這麼脆弱？」根本原因是沒搞清楚底層的 substrate（LLM 作為軟體元件的組合方式），直接跳到了框架層。

#### 方法

作者提出兩個一次性的「前提條件」，加上三個在 agent 生命週期中持續執行的「實踐」：
**P1（Substrate）**：把 LLM 視為純軟體元件，按 tools → system prompt → messages 的順序組合，善用 prompt caching 降低延遲與成本。
**P2（Building Blocks）**：熟悉六個積木——function calling（工具呼叫）、MCP（Model Context Protocol，Anthropic 制定的工具協議標準）、CLI orchestration（命令列工具整合）、liteshell pattern（輕量 shell 整合，比完整 OS 整合更安全）、agent loop（感知→思考→行動循環）、skills（可複用的 agent 技能模組）。

#### 為什麼重要

這個框架讓「框架無關」成為可能：不管用 LangGraph 還是 AutoGen，底下的 P1/P2 是不變的地基。對 agent 平台架構師來說，這是設計技術債最少、最易維護的 agent 的路線圖。

### 深入要點

- **Substrate 的 tools → system → messages 層序**：先定義 tools（agent 的 capabilities），再寫 system prompt（persona + constraints），最後管理 messages（context window 控制）——順序弄錯會導致行為不可預測
- **liteshell pattern**：Agent 透過輕量 shell 命令執行外部操作（有限 command whitelist + subprocess），比完整 OS 整合更安全、更易稽核，適合生產
- **MCP 的定位**：論文把 MCP 與 function calling 並列為 building block，說明 MCP 已被視為業界 standard component，不只是 Anthropic 的專有功能
- **Testing 二軌架構**：決定性測試（invariant、interface、error handling）＋ 情境式行為評估（scenario-based behavioral evaluation）——agent 是隨機的，兩軌都要有，不能只靠傳統 unit test
- **Custom vs. General-purpose agent**：區別是 fit（貼合一個任務）而非 capability（廣度），這解釋了為什麼生產環境常選 custom agent
- **Production case study**：含實際生產部署案例佐證，但公開資料中細節有限
- **Limitation**：缺乏大規模量化實驗；三個持續實踐的具體內容在公開資訊中描述不夠清晰；論文偏向 Claude/Anthropic 生態（MCP 是 Anthropic 標準）

### Reviewer 一句話評

P1/P2 分類清晰，liteshell + MCP 並列有實務說服力，解決了真實問題（太多人跳過底層）。主要弱點是案例量少、量化依據薄弱，更像有說服力的技術部落格升格成論文。值得讀，但請帶上自己的工程判斷。

### 給你的 take-away

- 準備做技術選型（LangGraph? AutoGen? CrewAI?）→ 先用 P1/P2 框架檢查架構地基是否穩固，再決定上層框架，而不是先選框架再倒推底層
- 寫 agent 測試計畫？→ 參考「deterministic + behavioral evaluation 二軌」邏輯，確保測試同時覆蓋 interface 穩定性和行為合理性

---


## 論文三｜EurekAgent: Agent Environment Engineering is All You Need For Autonomous Scientific Discovery

**作者**: Amy Xin, Jiening Siow, Junjie Wang, Zijun Yao, Fanjin Zhang, Jian Song, Lei Hou, Juanzi Li（清華大學 / 智譜 AI）　·　**arxiv**: 2606.13662
**連結**: [arxiv](https://arxiv.org/abs/2606.13662) · [alphaxiv](https://www.alphaxiv.org/abs/2606.13662)

### TL;DR

讓 Agent 自動提假設、跑實驗、迭代改進的瓶頸，不是 LLM 能力而是「環境怎麼設計」——清華這套系統靠容器隔離和清楚的評分介面，在多個科研任務達到 SOTA。

### Read Priority

📖 略讀
EurekAgent 的環境工程架構思維對 agent 平台設計很有啟發，但應用場景偏向科研自動化，數字需存疑，快速掌握架構模式即可。

### 領域背景

「AI for Science」的 agent 系統已能在特定科研任務超越人類（如 AlphaFold 蛋白質預測、AI 自動優化演算法）。現在的瓶頸不再是「LLM 能力不夠」，而是 agent 工作的環境太難設計：怎麼給資源、怎麼隔離實驗、怎麼評分，以及如何避免 agent reward hacking（找算分漏洞而非真正解決問題）。EurekAgent 聚焦在這個「環境工程」層。

### 中階導讀


#### 問題

想讓 agent 自動優化 ML 模型：需要提方案、寫程式碼、跑實驗、看結果再改。三個問題馬上出現：① Agent 可能找到評分邏輯漏洞（reward hacking）；② 前一次實驗資源污染下一次；③ 想讓人隨時介入，但頻繁等人讓成本失控。

#### 方法

EurekAgent 的核心是「問題定義介面 + 容器隔離」：
- **使用者只需提供三個檔案**：`INSTRUCTION.md`（問題描述）、`SUBMISSION_FORMAT.md`（提交格式的 JSON schema）、`evaluate.py`（私有評分函數）
- **雙容器架構**：Agent 容器（跑 Claude Code sessions + workspace）和 Grader 容器（執行私有 [evaluate.py](http://evaluate.py)）嚴格隔離——agent 看不到評分邏輯，從根本上阻斷 reward hacking
- **Human-in-the-loop**：每步支援人工介入，但預設全自動；提供 live web 監控（成本追蹤、分數演進）

#### 為什麼重要

「環境比流程更重要」這個洞見可遷移到任何 agentic workflow：與其精細設計 agent 的思考步驟，不如先確保環境的信號清晰、代價結構正確、隔離機制健全。

### 深入要點

- **雙容器隔離**：Agent container（Claude Code + workspace）↔ Grader container（私有 [evaluate.py](http://evaluate.py)），原理與 RL 裡的 reward model 隔離相同，防止 agent 「偷看答案」
- **End-to-end research loop**：proposal → implementation → evaluation → refinement 四步循環，支援 resumable 長時間運行
- **關鍵數據**：
- 數學最佳化（circle packing 等）：宣稱 SOTA ⚠️（內部定義 benchmark，比較對象需自行核查）
- Kernel engineering（TriMul 矩陣乘法）：2247.78 μs → 2005.03 μs（降約 10.8%）⚠️（單一 micro-benchmark）
- ML（MLE-Bench subset）：85.71% vs. 71.43% 先前最佳（+14.28pp）⚠️（subset，非完整 MLE-Bench 全集）
- **成本**：數學最佳化每次執行 API cost 低於 **$17**
- **tech stack**：Python 3.12 + Claude Code + Docker，未用傳統 orchestration 框架
- **Reward hacking 防制**：Grader container 隔離是核心；評分邏輯完全不暴露給 agent
- **Limitation**：評測任務為精心挑選的場景；⚠️ 數字均來自 subset 或 micro-benchmark；$17/run 在規模化使用時成本顯著；泛化到「環境未事先為 agent 設計的任務」尚無驗證

### Reviewer 一句話評

「環境工程比流程工程更重要」有說服力，容器隔離防 reward hacking 設計實務。但數據比較對象均為 subset 或內部 benchmark，⚠️ 有選擇性報告嫌疑，全集測試表現未知。整體是「架構思維值得學，數字先存疑」。

### 給你的 take-away

- 在設計 agentic workflow 的評分或 reward 系統 → 參考 Grader container 隔離模式，防止 agent reward hacking
- 用 Claude Code 做自動化研究或工程任務 → `INSTRUCTION.md` + `evaluate.py` 三檔案介面是個可直接複用的問題定義模式


## 參考資料

- [arxiv:2606.14211](https://arxiv.org/abs/2606.14211)
- [arxiv:2606.11869](https://arxiv.org/abs/2606.11869)
- [arxiv:2606.13662](https://arxiv.org/abs/2606.13662)
