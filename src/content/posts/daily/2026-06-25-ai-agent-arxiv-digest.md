---
title: "AI Agent Arxiv Digest — 2026-06-25"
date: 2026-06-25
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-security, agent-evaluation, agent-reasoning]
lang: zh-TW
description: "今天三篇都在探索「agent 能力的邊界與突破路徑」"
tldr: "今天三篇都在探索「agent 能力的邊界與突破路徑」。Sakana Fugu（Sakana AI）訓練了一個 0.6B 的協調器模型，學會動態指揮一池 frontier LLM 分工，在 SWE-Bench Pro 等多個榜單達到公開 SOTA——核心命題是「orchestrator 本身可以被訓練，而不只是工程師寫死規則」。NatureBench 用 90 個 Nature 期刊的真實科研任務反問：coding agent 真的能做科學發現？最強配置只勝過原論文 SOTA 17.8%，且靠的是把問題「翻譯成熟悉的 ML 任務」，不是真正的發明。最後，《Rising from the Ashe"
series:
  name: "AI Agent Arxiv Digest"
  order: 32
---
> 🌏 [English version](/en/posts/daily/2026-06-25-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇都在探索「agent 能力的邊界與突破路徑」。Sakana Fugu（Sakana AI）訓練了一個 0.6B 的協調器模型，學會動態指揮一池 frontier LLM 分工，在 SWE-Bench Pro 等多個榜單達到公開 SOTA——核心命題是「orchestrator 本身可以被訓練，而不只是工程師寫死規則」。NatureBench 用 90 個 Nature 期刊的真實科研任務反問：coding agent 真的能做科學發現？最強配置只勝過原論文 SOTA 17.8%，且靠的是把問題「翻譯成熟悉的 ML 任務」，不是真正的發明。最後，《Rising from the Ashes》六位資安研究員系統整理了 agentic AI 如何接手五類長年讓防禦者頭痛的勞力密集任務，以 16 個案例作為落地參考。

## 讀這篇前該知道的詞


| 白話解釋 | 詞 |
|---|---|
| 不直接解題、負責分配任務給其他 AI 模型的「指揮模型」；Sakana Fugu 就是這類系統 | Orchestrator（協調器模型） |
| 以真實 GitHub Issues 為題的軟體工程 Agent 標準評測，分數越高代表能解決越多真實 bug | SWE-Bench Pro |
| agent 超過原論文報告最佳結果的比例；NatureBench 的核心指標 | Surpass-SOTA rate（超越 SOTA 比例） |
| NatureBench 的設計：故意把論文解法移除，只給問題和資料，逼 agent 自行發明方法 | Information Firewall（資訊防火牆） |
| 能接收任務後自行規劃、使用工具、執行多步驟的 AI 系統；與「一問一答的 chatbot」相對 | Agentic AI（自主代理 AI） |


---


## 論文一｜Sakana Fugu Technical Report

**作者**: Yujin Tang, Edoardo Cetin 等 14 人（Sakana AI）　·　**arxiv**: 2606.21228
**連結**: [arxiv](https://arxiv.org/abs/2606.21228) · [alphaxiv](https://www.alphaxiv.org/abs/2606.21228)

### TL;DR

Sakana AI 訓練了一個「學會指揮其他模型」的 0.6B 小型協調器，把 Claude/GPT 等現有 frontier 模型的能力組合出超越任何單模型的表現，在 SWE-Bench Pro 達到 73.7%（公開最強）。

### Read Priority

必讀
「orchestrator 本身可以被學習訓練」直接挑戰了 LangGraph/AutoGen「工程師手寫 routing 邏輯」的主流設計，是這篇的核心命題，對 Agent 平台架構設計者最有啟示。

### 領域背景

現有 multi-agent 系統（AutoGen、LangGraph）靠工程師寫死 routing 規則——A 任務給模型 A，B 任務給模型 B，無法自適應也難維護。過去有人嘗試用分類器做 LLM routing，但那只是靜態決策。Sakana AI 在 ICLR 2026 發表 Trinity 和 The Conductor 兩篇論文，已有初步突破；Fugu 是在那基礎上完整落地的系統。

### 中階導讀


#### 問題

你手上有 10 個不同強項的 LLM（一個擅長數學、一個擅長程式、一個擅長推理），如何讓它們「自動組隊解決任何問題」，而不是靠工程師每次手動分配？

#### 方法

Fugu 的核心是 TRINITY——約 0.6B 參數的協調器，用進化演算法（CMA-ES，一種不需梯度的最佳化方法）訓練，學會把問題拆成 Thinker（思考）、Worker（執行）、Verifier（驗證）三種角色分配給不同 frontier LLM。另一個組件 Conductor 則用強化學習訓練，學習多個模型之間最好的自然語言協調策略。最終提供 Fugu Mini（低延遲優先）和 Fugu Ultra（效能優先）兩個版本，透過 OpenAI 相容的 API 端點提供服務。

#### 為什麼重要

Fugu Ultra 在 SWE-Bench Pro 達到 73.7%，同時在 Terminal Bench、LiveCodeBench、GPQA-Diamond、Humanity's Last Exam、CharXiv Reasoning 也達到公開 SOTA。這表示「用小型協調器組合大型模型」的路線，已能在多個困難任務上超越任何單一 frontier 模型——對 Agent 平台架構是個重要訊號：下一個 foundation model 競爭，可能不在模型本身，而在誰的 orchestrator 最強。

### 深入要點

- TRINITY 協調器只有約 0.6B 參數，遠小於所指揮的 worker 模型（通常百億至千億參數）
- 訓練：TRINITY 用 CMA-ES（進化策略，不需梯度），Conductor 用強化學習——組合了兩種非傳統訓練方式
- 建構在 ICLR 2026 兩篇論文之上：「Trinity: An Evolved LLM Coordinator」和「Learning to Orchestrate Agents」
- SWE-Bench Pro 73.7% 為 Sakana 官方自報數字，尚無第三方獨立複測 **⚠️**
- 完全閉源，只能透過 Sakana API 使用，無法自部署 **⚠️**
- 有使用者回報複雜任務需 30 分鐘以上，延遲問題未解決 **⚠️**
- 與 LangGraph/AutoGen 的關係：Fugu 是「學習如何 orchestrate」，前兩者是「被程式設計 orchestrate」，是更高層次的抽象
- 和 MCP 的關聯：Fugu 可作為上層協調者，由它決定哪個 worker 呼叫哪些 MCP 工具
Learned orchestration 是真正的新方向，但 SWE-Bench Pro 73.7% 只是 Sakana 自報數字、完全閉源、延遲問題仍在，現在宣稱「超越所有公開模型」要打折扣——等第三方獨立複測再下結論。**⚠️**

### 給你的 take-away

- 設計 Agent Router 時問問自己：這段 if/else routing 邏輯，能不能變成一個可訓練的小模型？這篇告訴你這個方向是可行的
- 等 Sakana API 開放公測後的第三方 SWE-Bench 複測結果出來，那才是這篇真正的試金石

---


## 論文二｜NatureBench: Can Coding Agents Match the Published SOTA of Nature-Family Papers?

**作者**: Yuru Wang, Lejun Cheng, Yuxin Zuo, Kaiyan Zhang（通訊）等 17 人（Horizon Research, [Frontis.AI](http://Frontis.AI), 清華大學）　·　**arxiv**: 2606.24530
**連結**: [arxiv](https://arxiv.org/abs/2606.24530) · [alphaxiv](https://www.alphaxiv.org/abs/2606.24530)

### TL;DR

用 90 個 Nature 期刊真實科研任務測試 coding agent：最強 agent 只能超越原論文 17.8%——而且靠的是把問題「翻譯成熟悉的 ML 任務」，不是真正的科學發明。

### Read Priority

必讀（做 coding agent 產品或 agent eval 的人）
揭示了 coding agent 在「真實科研發現」上的當前天花板，NatureGym pipeline 的工程設計也值得直接借鑑。

### 領域背景

SWE-Bench 系列測的是「修 bug、實現功能」——軟體工程任務。但如果 agent 的目標是科學研究助理呢？過去的「AI for science」評測多讓 agent 重現程式碼，而不是要求它發明比原論文更好的方法。NatureBench 想填補這個缺口：用真實科研任務問，agent 能不能發現得更好？

### 中階導讀


#### 問題

想像你給 AI 一篇 Nature 論文的資料集和任務描述，但把原論文的解法遮住，問 AI：「你能做得比原論文更好嗎？」這就是 NatureBench 在測的。

#### 方法

NatureGym 是一個自動化 pipeline：從 Nature 系列期刊篩選論文 → 取得資料集 → 用 Docker 建立容器化環境 → 製作任務包（任務描述 + 資料 + 隱藏測試集 + 自動評測器）。最關鍵的設計是 Information Firewall（資訊防火牆）：刻意把原論文解法從任務描述中移除，強迫 agent 自行想方法。接著用 10 種 frontier agent 配置測試（禁用 web search），以「Surpass-SOTA rate」為主指標。

#### 為什麼重要

最強配置達 17.8% Surpass-SOTA rate（g > 0.1 標準）。分析顯示 agent 成功的主要模式是「方法論轉換（Methodological Translation）」：把科研問題轉為熟悉的監督式 ML 問題——靠的是「轉換框架」而不是「發明新方法」。這個發現直接點出了 coding agent 在 AI for science 場景上的根本限制。

### 深入要點

- 90 個任務，跨 6 個科學領域，Python 97.1% codebase，Docker 容器化確保跨機器可重現
- 每個任務包含：任務描述 + 資料集 + 隱藏測試集 + 自動評測器，設計完整
- 支援 agent backend：Claude Code、Codex、Gemini CLI（3 種主流工具都有）
- 六個科學領域表現不均勻，部分領域顯著低於 17.8%（具體分項數字未公開）**⚠️**
- 已公開：benchmark 資料、NatureGym pipeline 程式碼、公開 leaderboard（含官方重現）
- 限制：90 個任務規模偏小，Nature 期刊偏英語與已開放資料集的領域 **⚠️**
- 「Methodological Translation」目前是定性分析，缺乏嚴格量化驗證 **⚠️**
- 和 SWE-Bench 比較：SWE-Bench 測「改現有 bug」，NatureBench 測「發明更好的方法」，難度和性質差距很大
NatureGym pipeline 的工程設計和 Information Firewall 是最大亮點，17.8% 的結果令人清醒；但 90 個任務偏少、領域覆蓋有限，「Methodological Translation」的定性結論沒有量化支撐——整體算是紮實但規模和分析深度都待擴充。

### 給你的 take-away

- 設計 coding agent 評測時，NatureGym 的「容器化任務包 + Information Firewall」組合可以直接借鑑——比只測 pass@k 更能看出 agent 的真實發明能力上限
- 17.8% 告訴你：若產品宣稱 agent 能「自動做科學研究」，目前的 frontier 模型還差很遠，請先幫使用者設好預期

---


## 論文三｜Rising From the Ashes: How Agentic AI is Unblocking Challenges in Cybersecurity

**作者**: Gabriela F. Ciocarlie, Kathrin Grosse, Somesh Jha（威斯康辛大學）, Daryna Oliynyk, Andrew Paverd（Microsoft Research）, Christian Wressnegger　·　**arxiv**: 2606.23138
**連結**: [arxiv](https://arxiv.org/abs/2606.23138) · [alphaxiv](https://www.alphaxiv.org/abs/2606.23138)

### TL;DR

六位資安研究員整理出讓防禦者長年頭痛的五個瓶頸，逐一對應到 agentic AI 的五種新能力，論點是：「以前太費工、根本做不完」的安全任務，agent 現在可以接手了。

### Read Priority

📖 略讀
這是 position paper（觀點整理），沒有實驗數據。對做企業安全 copilot 或 SOC automation 的 PM/工程師值得掃一遍；純做 Agent 框架基礎建設的人可跳過。

### 領域背景

資安防禦長年面臨人力瓶頸：漏洞太多、log 太多、程式碼稽核太費時。攻擊者靠自動化工具大規模攻擊，防禦者卻還靠人力。過去 AI 在安全的應用（惡意程式分類、異常偵測）都是窄域工具，無法跨任務推理或自主執行。agentic AI 的出現讓人重新期待防禦端的自動化。

### 中階導讀


#### 問題

為什麼資安防禦這麼難？這篇論文歸結出五個根本挑戰（C1-C5），大意是：資料量太大、需要跨域推理、任務邊界模糊、工具不互通、知識更新太快。這五類問題讓許多本來值得做的防禦措施「太費工，划不來」。

#### 方法

作者提出五個 agentic AI 能力（A1-A5）來對應：自然語言理解（A1）、程式碼生成與執行（A2）、跨工具調用（A3）、長期記憶（A4）、多步規劃（A5）。然後用 16 個具體安全場景案例（包含供應鏈分析）說明這個對應關係如何落地。

#### 為什麼重要

這篇論文提供了一個系統化框架：如果你想把 agentic AI 引入安全防禦，C1-C5 是你需要解決的問題，A1-A5 是你需要驗證的能力。作者陣容強（Somesh Jha 是 ML 安全知名研究者，Andrew Paverd 來自 Microsoft Research），代表這個框架有學術與業界的共識支撐。

### 深入要點

- 5 挑戰（C1-C5）+ 5 能力（A1-A5）+ 16 個案例研究，結構清楚，適合當 product roadmap 的參考框架
- 供應鏈分析是案例之一，也是目前 agentic AI 在安全領域最成熟的應用方向
- Position paper：沒有自己跑實驗，引用現有文獻，無新的實驗數據
- 16 個案例研究深度不均，部分只有幾行描述，未深入分析 **⚠️**
- 對 agent 在安全場景的 failure mode（被 prompt injection 攻擊、誤判造成大規模封鎖）討論不足 **⚠️**
- C1-C5/A1-A5 mapping 過於整齊，有事後拼湊框架之嫌 **⚠️**
- 和 LangGraph/AutoGen 的關聯：論文描述的安全場景（log 分析、漏洞稽核）目前都可用現有框架的 tool use + RAG 實作
作者背景強、框架整理清楚，但缺實驗驗證；最嚴重的缺失是對「agent 被攻擊」（prompt injection、adversarial input）和「agent 誤判造成大規模封鎖」的討論幾乎沒有——這些才是安全場景部署最大的障礙。

### 給你的 take-away

- 規劃 SOC automation 或企業安全 copilot 的產品路徑時，C1-C5 的挑戰清單可以直接當作 product requirements 的起點，對照你想解決哪一類問題
- 供應鏈分析案例最值得深挖：看論文那個案例的具體設計，評估你的 agent 框架能不能支撐類似的 multi-step reasoning


## 參考資料

- [arxiv:2606.21228](https://arxiv.org/abs/2606.21228)
- [arxiv:2606.24530](https://arxiv.org/abs/2606.24530)
- [arxiv:2606.23138](https://arxiv.org/abs/2606.23138)
