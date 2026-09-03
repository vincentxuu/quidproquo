---
title: "AI Agent Arxiv Digest — 2026-06-08"
date: 2026-06-08
category: daily
type: digest
tags: [ai-agent, arxiv, daily, multi-agent, agent-framework, agent-evaluation]
lang: zh-TW
description: "今天三篇分別對應 agent 平台堆疊的三個層次：AgentJet（訓練層）提出讓多個異質 LLM 同步做強化學習訓練的分散式框架，解決現有工具只能單模型訓練的根本痛點；AdaPlanBench（評測層）用 67.75% 的成績上限揭示 LLM agent 在「規則邊走邊揭露」的現實場景中遠未成熟，"
tldr: "今天三篇分別對應 agent 平台堆疊的三個層次：AgentJet（訓練層）提出讓多個異質 LLM 同步做強化學習訓練的分散式框架，解決現有工具只能單模型訓練的根本痛點；AdaPlanBench（評測層）用 67.75% 的成績上限揭示 LLM agent 在「規則邊走邊揭露」的現實場景中遠未成熟，是第一個系統量化這種適應性規劃能力的 benchmark；Beyond Tokens（通訊層）整理了 multi-agent 系統改用「傳 embedding 而非傳文字」的研究現狀，提供分類框架評估這條新通訊路徑的工程取捨。"
series:
  name: "AI Agent Arxiv Digest"
  order: 15
---
> 🌏 [English version](/en/posts/daily/2026-06-08-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇分別對應 agent 平台堆疊的三個層次：AgentJet（訓練層）提出讓多個異質 LLM 同步做強化學習訓練的分散式框架，解決現有工具只能單模型訓練的根本痛點；AdaPlanBench（評測層）用 67.75% 的成績上限揭示 LLM agent 在「規則邊走邊揭露」的現實場景中遠未成熟，是第一個系統量化這種適應性規劃能力的 benchmark；Beyond Tokens（通訊層）整理了 multi-agent 系統改用「傳 embedding 而非傳文字」的研究現狀，提供分類框架評估這條新通訊路徑的工程取捨。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| Agentic RL（強化學習式 Agent 訓練） | 讓 LLM agent 透過與環境互動得到獎懲、反覆調整行為的訓練方式，類似讓機器人在遊戲中反覆嘗試直到學會正確策略 |
| Swarm Training（群訓練） | 同時讓大量 agent 在不同環境中平行執行、統一更新共享模型的訓練策略，大幅提升 GPU 使用率 |
| Dual Constraints（雙重限制） | 同時包含「世界限制」（物理/邏輯規則，例如電梯在三樓停用）和「使用者限制」（個人偏好，例如不走超過三步），兩者都滿足才算完成任務 |
| Latent Communication（潛在溝通） | Multi-agent 系統中 agents 直接傳遞 embedding 或隱藏狀態（hidden state），而非傳送文字，可降低推理成本、減少資訊損失 |
| KV-cache（鍵值快取） | 模型生成文字時中間計算出的矩陣，可作為壓縮後的「思考快照」直接傳給另一個 agent，讓接收方不必重新理解上文 |


---


## 論文一｜AgentJet: A Flexible Swarm Training Framework for Agentic Reinforcement Learning

**作者**: ModelScope Team（阿里巴巴 ModelScope）　·　**arxiv**: 2606.04484
**連結**: [arxiv](https://arxiv.org/abs/2606.04484) · [alphaxiv](https://www.alphaxiv.org/abs/2606.04484)

### TL;DR

讓多個不同的 LLM 一起做強化學習訓練、彼此不互相干擾，一個 agent 環境崩潰不拖垮整個訓練；透過 timeline merging 讓訓練速度提升 1.5x～10x，完全開源。

### Read Priority

必讀
如果你的團隊在做 agent 的 RL fine-tuning（GRPO、RLHF、RLAIF 類），現有框架（veRL、OpenRLHF）幾乎都假設「一個模型、一種任務」——AgentJet 是目前唯一為多模型、多任務 agentic RL 設計的開源框架，直接解決你可能遇到的架構限制。

### 領域背景

強化學習是讓 LLM agent 真正學會使用工具、完成長程任務的關鍵訓練方式——DeepSeek-R1、OpenAI o 系列背後都有 RL 的影子。但現有的 RL 訓練框架（如 veRL、OpenRLHF）設計時假設單一模型、單一任務，當你想讓「Planner LLM + Coder LLM + Verifier LLM」三個角色分工協作並同時做 RL 訓練時，這些框架就力不從心——而且 agent 的外部工具（瀏覽器、程式執行環境）隨時可能崩潰，現有框架沒有容錯設計。

### 中階導讀


#### 問題

你正在做一個 coding agent，由三個 LLM 分工：一個規劃、一個寫程式、一個驗證結果。你想用 RL 同時訓練三個模型，讓它們作為一個 team 一起進步。現有工具做不到這件事——它們的設計是「一個模型跑完所有步驟」。此外，coding agent 的執行環境（Docker、沙箱）隨時可能出問題，一個 container 崩潰就讓整批訓練中斷，損失好幾小時的 GPU 時間。

#### 方法

AgentJet 採用「**去耦合多節點架構**」：**Swarm Server**（伺服端）負責持有可訓練模型並在 GPU 叢集上執行梯度更新；**Swarm Client**（客戶端）負責在任意裝置上執行 agent 邏輯。Server 和 Client 完全分離，多個不同的 Server 可以持有不同模型（Swarm 拓撲），Client 的崩潰不影響 Server 的訓練狀態。此外，AgentJet 引入 **Context Timeline Merging**：識別並合併 multi-turn / multi-agent 對話中的冗餘 context，把訓練速度提升 1.5x～10x。

#### 為什麼重要

Agentic RL 是讓 agent 真正有能力的關鍵訓練方式，但現在幾乎所有開源工具都無法支援多模型協作的 RL 訓練。AgentJet 填補這個空缺，而且完全開源——對 agent 平台團隊來說，這是 RL 訓練基礎設施可以直接採用或借鑒的工具。

### 深入要點

- **Swarm Server / Swarm Client 去耦合**是核心創新：Server 是純訓練節點（GPU 叢集），Client 是純執行節點（可以是任意機器甚至 CPU-only），兩者透過網路協定通訊，互不綁定
- **異質多模型 RL**：可在單次訓練中同時訓練多個結構不同的 LLM，每個 LLM 扮演不同 agent 角色（Planner、Coder、Verifier 等），各自有獨立的 reward function
- **多任務 Cocktail Training**：不同任務隔離在不同 Client 實例執行，一個任務的環境崩潰不影響其他任務，也防止任務間資料污染
- **Fault-Tolerant（容錯執行）**：Client 崩潰時，Server 側的訓練狀態保留，可無縫重啟 Client 並繼續訓練——對長期訓練 run 影響重大
- **Live Code Iteration**：可在訓練進行中替換 Swarm Client 節點（即更新 agent 程式碼邏輯），不需停止整個訓練 run
- **Context Timeline Merging**：multi-turn / multi-agent 對話中相同 token 被重複傳遞多次；AgentJet 識別並合併這些冗餘 context，訓練加速 **1.5x～10x**（具體倍數取決於任務的 multi-turn 深度）⚠️（數字來自論文，不同任務差異可能顯著）
- **與 veRL / OpenRLHF 的關係**：AgentJet 不是要替換 server-side 的 RL optimizer，而是在 agent execution layer 做去耦合；可理解為「在現有 RL optimizer 之上多一層 agent execution orchestration」
- **落地門檻**：需要多台機器組網（Server-Client 分離），對只有單機 GPU 的小團隊有一定 infra 門檻；但 Client 可以跑在 CPU 機器上，初期成本可接受
- **GitHub**: [github.com/modelscope/AgentJet（完全開源）](http://github.com/modelscope/AgentJet（完全開源）)
- **Limitation 1**：論文的 benchmark 主要是 ModelScope 內部任務，外部任務的 speedup 數字需要獨立驗證 ⚠️
- **Limitation 2**：Swarm topology 管理（多 Server 如何協調梯度更新）的複雜度在大規模部署時尚未充分評估

### Reviewer 一句話評

架構設計思路清晰，去耦合的想法切中現有 agentic RL 工具的根本限制；但「1.5x-10x 加速」的寬泛範圍和以 ModelScope 內部任務為主的評測，讓結論的泛化性存疑——把 AgentJet 的思路當成 reference architecture 看是紮實的，把具體加速數字當成能直接複現的保證則過於樂觀。

### 給你的 take-away

- 如果你在跑 agentic RL 訓練而且遇到「agent 環境崩潰 = 整個訓練中斷」的問題，優先看 AgentJet 的 fault-tolerant execution 和 Swarm Client 設計——即使不直接用這個框架，架構思路值得借鑒
- 如果你想讓多個 LLM role 協作並一起做 RL 訓練（Planner + Coder、Generator + Verifier 等），AgentJet GitHub（modelscope/AgentJet）是目前唯一開源的異質多模型 agentic RL 框架，值得 star 並追蹤社群反饋

---


## 論文二｜AdaPlanBench: Evaluating Adaptive Planning in Large Language Model Agents under World and User Constraints

**作者**: Jiayu Liu, Cheng Qian, Zhenhailong Wang, Bingxuan Li 等（University of Illinois Urbana-Champaign）　·　**arxiv**: 2606.05622
**連結**: [arxiv](https://arxiv.org/abs/2606.05622) · [alphaxiv](https://www.alphaxiv.org/abs/2606.05622)

### TL;DR

現實任務的規則不會一次告訴你——規劃途中違反規定才會被反饋。UIUC 團隊建立了模擬這種場景的 benchmark：307 個家務任務加上隱藏的雙重限制，邊做邊揭露，測試 10 個頂尖 LLM 後最好只有 67.75%，使用者限制比環境限制難多了。

### Read Priority

必讀
大多數 agent 評測都假設「所有規則在開始就知道」，但真實的 agent 任務（客服 agent 遇到新政策、行程規劃 agent 遇到使用者臨時條件）往往邊做邊才知道限制。AdaPlanBench 量化了這個差距，讓你知道自己的 agent 在最現實場景下的能力上限。

### 領域背景

LLM agent 的規劃能力在標準 benchmark 上已有不錯成績，但這些 benchmark 大多給 agent 完整的環境說明和所有限制條件再叫它規劃——這跟現實差很遠。真實任務中，限制條件是漸進揭露的（progressive disclosure）：你去超市買東西，才發現某樣東西缺貨；你規劃旅程，客戶才說他不搭飛機。這種「邊做邊發現限制、需要重新規劃」的能力，現有 benchmark 幾乎沒有系統性評測。

### 中階導讀


#### 問題

你的 home assistant agent 被指派任務：「幫我準備晚餐，用微波爐熱三道菜。」但微波爐其實在維修中（世界限制），而且使用者不吃蔥（使用者限制）——這兩個限制都沒有在指令裡說，只有當 agent 提出包含這些元素的計畫時，才被回饋告知違規。現有 benchmark 測的是「給你所有規則，然後規劃」；AdaPlanBench 測的是「你不知道規則，規劃了才發現，然後修正、再規劃」。

#### 方法

研究團隊以 307 個家務任務（來自 ALFRED 等現有環境）為基礎，設計可擴展的「**限制自動生成 pipeline**」：每個任務自動附加一個「世界限制」（環境物理/邏輯規則）和一個「使用者限制」（個人偏好），共雙重限制（Dual Constraints）。測試時採用 **multi-turn protocol**：agent 提出計畫 → 若違反限制則被回饋告知哪裡違規 → agent 修正再提 → 直到符合所有限制或超過最大輪次。評測 GPT-4o、Claude 3.5/3.7、Gemini 等 10 個主流 LLM。

#### 為什麼重要

67.75% 的上界揭示了一個被低估的能力差距：即使是最好的 LLM，在「規則邊揭露邊修正」的場景下，超過 30% 的任務會失敗。這直接影響任何需要 agent 在不完整規格下執行的產品——客服、行程規劃、企業流程自動化。

### 深入要點

- **307 個家務任務 × 自動生成雙重限制**：constraint pipeline 可擴充，但基礎任務多為家務場景，與企業/技術 agent 場景的可遷移性未驗證 ⚠️
- **最佳 LLM 只達 67.75%**，而且這是在只有一組雙重限制的設置下——限制數量增加時，所有模型準確率顯著下降 ⚠️（具體下降幅度需查原文）
- **User Constraints 比 World Constraints 難**：推測原因是「使用者偏好缺乏物理上的因果邏輯」，模型更難在 re-planning 時記住並正確應用；但論文的錯誤分析深度有限 ⚠️
- **主要失敗原因**：「對環境的物理接地不足（weak physical grounding）」和「累積限制追蹤失誤（失去對之前揭露限制的記憶）」——後者直接指向 agent 的 in-context memory 設計問題
- **與 LangGraph/AutoGen 的關聯**：Dual-constraint adaptive planning 可以用 LangGraph 的 conditional edge 設計成「違規 → 重新規劃」的 loop；但「限制追蹤失憶」問題需要在 state management 層面解決，不是換框架就能修的
- **可作為 agent 產品的壓力測試設計參考**：multi-turn 違規反饋協議可用於你自己的 red-teaming 或 eval pipeline
- **Limitation 1**：multi-turn 協議假設「違規時告知具體違反了哪項限制」，比真實環境寬鬆許多——現實中環境反饋往往模糊或無結構 ⚠️
- **Limitation 2**：基礎任務來自 ALFRED（模擬室內環境），跟真實物理世界的 gap 沒有評估

### Reviewer 一句話評

問題設定清晰有現實意義，67.75% 的數字夠震驚也夠有說服力；但 307 個任務規模偏小，「告知具體違反了哪項限制」的反饋假設讓 benchmark 比真實環境寬鬆許多——這是一個「讓業界意識到問題」的重要起點，但不應視為已量化了完整落差。

### 給你的 take-away

- 如果你在設計 agent 產品的 eval，把「隱藏限制邊做邊揭露，看 agent 能不能正確 re-plan」加進你的測試 case——這種場景在真實使用者身上一定存在，但幾乎所有現成 benchmark 都不測這個
- 如果你的 agent 遇到「第一次規劃後被使用者修正、但之後又忘記這個修正」的 bug，這篇的「限制追蹤失憶」分析直接切中問題根源——看 error analysis 那個 section

---


## 論文三｜Beyond tokens: a unified framework for latent communication in LLM-based multi-agent systems

**作者**: Yingzhuo Liu　·　**arxiv**: 2606.05711
**連結**: [arxiv](https://arxiv.org/abs/2606.05711) · [alphaxiv](https://www.alphaxiv.org/abs/2606.05711)

### TL;DR

Multi-agent 系統裡 agents 之間傳文字很貴又有資訊損失，這篇 survey 整理「改傳 embedding / hidden state / KV-cache」的研究現狀，提出分類框架，幫你評估這條路能否用在你的 agent 系統。

### Read Priority

📖 略讀
Latent communication 目前還在研究早期、工程可行性有限，但如果你在做 multi-agent 系統且有成本/延遲壓力，這篇的分類框架和 GitHub awesome list 是快速掌握這條技術路線現狀的最佳入口。

### 領域背景

Multi-agent 系統的標準做法是：Agent A 生成文字 → Agent B 讀文字再生成文字 → 一直下去。這個「文字傳文字」的方式有三個根本問題：（1）每次生成文字都要跑一遍完整的 decoding，成本高；（2）連續的思考被強制壓縮成離散的 token，資訊有損；（3）自然語言有歧義和冗餘，不是 agents 之間最有效率的溝通格式。研究者開始探索讓 agents 直接傳遞內部表示（embedding、hidden state、KV-cache）——但這個領域散落各處，缺乏系統性整理。

### 中階導讀


#### 問題

你的 multi-agent pipeline 有 5 個 agent 串聯，每個 agent 都要等前一個輸出完整文字才能開始。成本是 5 倍的 text generation，延遲也難以壓縮。有沒有辦法讓 agents 直接傳「思考的中間結果」，繞過這個 bottleneck？

#### 方法

本篇是 survey 論文，整理現有 latent communication 研究並提出統一分類框架。主要形式有三類：**Embedding 傳遞**（傳最後一層的 output embedding）、**Hidden State 傳遞**（傳中間某層的 hidden state）、**KV-cache 傳遞**（傳 attention 機制的 key-value cache，讓接收方直接「繼承」前一個 agent 的 attention 計算）。三種形式的資訊保留程度、跨模型相容性、工程複雜度各不相同。

#### 為什麼重要

Token-based communication 的成本問題在大規模 multi-agent 部署時會被放大。如果 latent communication 能在某些 agent 拓撲中被採用，可以帶來顯著的成本降低——這個研究方向值得 agent 平台工程師追蹤，即使目前離生產環境還有距離。

### 深入要點

- **三種 latent communication 形式的工程取捨**：Embedding 傳遞最簡單但資訊損失最大；KV-cache 傳遞資訊保留最完整但**跨模型相容性是大問題**（不同架構的 KV 格式不相容）
- **最大的工程限制**：目前 latent communication 幾乎只能在**相同架構的模型之間**運作——如果你的 multi-agent 系統混用不同廠商模型（GPT-4 + Claude），幾乎無法直接套用
- **技術成熟度（TRL）估計：2-3 / 10**——大多數研究在受控實驗室設定下展示可行性，跨模型協定、標準化介面都尚未存在
- **與 MCP / function calling 的關係**：MCP 和 function calling 是 agent 與工具的溝通協定（文字層）；latent communication 嘗試改變的是 agent 與 agent 之間的溝通層，兩者不衝突但也不是替代關係
- **Companion GitHub**：[github.com/enochliu98/Awesome-Latent-Communication，收錄當前重要論文，是追蹤這條研究線最省力的入口](http://github.com/enochliu98/Awesome-Latent-Communication，收錄當前重要論文，是追蹤這條研究線最省力的入口)
- **單一作者 survey**：Yingzhuo Liu 獨立整理，社群認可度和覆蓋面需要時間驗證 ⚠️
- **Limitation 1**：論文選取標準和覆蓋面由單一作者決定，可能有遺漏 ⚠️
- **Limitation 2**：分類框架的實用性（是否幫助工程師做選擇）需要更多社群反饋

### Reviewer 一句話評

填補了一個文獻整理空缺，框架架構合理；但單一作者、技術成熟度低，且跨模型相容性的根本限制目前沒有解法——更像是「有志者的路線圖」而非工程師可以立刻採用的手冊，現在看最大的價值是了解這條路存在、還要多久才能實用。

### 給你的 take-away

- 如果你的 multi-agent pipeline 成本主要來自 agents 之間的 text generation，把 latent communication 加入你的技術雷達「探索區」：bookmark awesome list（[github.com/enochliu98/Awesome-Latent-Communication），每季追蹤一次進展](http://github.com/enochliu98/Awesome-Latent-Communication），每季追蹤一次進展)
- 如果你的 multi-agent 系統所有 agent 都用同一個模型（全 Claude 或全 Llama），latent communication 的可行性比異質模型系統高得多——這時可以更認真評估


## 參考資料

- [arxiv:2606.04484](https://arxiv.org/abs/2606.04484)
- [arxiv:2606.05622](https://arxiv.org/abs/2606.05622)
- [arxiv:2606.05711](https://arxiv.org/abs/2606.05711)
