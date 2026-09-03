---
title: "AI Agent Arxiv Digest — 2026-06-05"
date: 2026-06-05
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-evaluation, agent-framework, agent-deployment]
lang: zh-TW
description: "今天三篇分別從「評測診斷」、「工具進化」、「安全對齊」三個角度補強 Agent 平台的核心短板：APB 提出一套 4,209 道題的診斷型 benchmark，首次能把「規劃失敗」和「執行失敗」分開來看；MetaForge 讓 agent 能在運行時「自行鍛造」沒有的工具，打破靜態工具庫的天花板；R"
tldr: "今天三篇分別從「評測診斷」、「工具進化」、「安全對齊」三個角度補強 Agent 平台的核心短板：APB 提出一套 4,209 道題的診斷型 benchmark，首次能把「規劃失敗」和「執行失敗」分開來看；MetaForge 讓 agent 能在運行時「自行鍛造」沒有的工具，打破靜態工具庫的天花板；RUBAS 把 agent 安全問題細分成四個評分維度，用強化學習讓模型學會在實用性和安全性間找到平衡。三篇合看：你的 agent 系統能不能被診斷、能不能自我擴展、能不能安全上線——這三道關卡今天同時被研究者正面回應。"
series:
  name: "AI Agent Arxiv Digest"
  order: 12
---
> 🌏 [English version](/en/posts/daily/2026-06-05-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇分別從「評測診斷」、「工具進化」、「安全對齊」三個角度補強 Agent 平台的核心短板：APB 提出一套 4,209 道題的診斷型 benchmark，首次能把「規劃失敗」和「執行失敗」分開來看；MetaForge 讓 agent 能在運行時「自行鍛造」沒有的工具，打破靜態工具庫的天花板；RUBAS 把 agent 安全問題細分成四個評分維度，用強化學習讓模型學會在實用性和安全性間找到平衡。三篇合看：你的 agent 系統能不能被診斷、能不能自我擴展、能不能安全上線——這三道關卡今天同時被研究者正面回應。

## 讀這篇前該知道的詞


| 詞 | 白話解釋 |
|---|---|
| Planning（規劃） | Agent 在行動前「想清楚要怎麼做」的過程：分解目標、選工具、排順序、判斷任務是否可解 |
| Tool Use（工具使用） | Agent 呼叫外部工具（如搜尋引擎、計算機、API、程式執行環境）來完成任務的能力 |
| Benchmark（評測集） | 一套標準化的測試題目，用來衡量 AI 系統的某項能力，讓不同模型可以被客觀比較 |
| Reinforcement Learning / RL（強化學習） | 讓模型從「做對了得分、做錯了扣分」的反饋中學習，而非直接告訴它正確答案 |
| Rubric（評分標準） | 預先定義好的細緻評分規則，描述「什麼算好的行為、什麼算差的行為」，讓評分有依據而非靠感覺 |


---


## 論文一｜Agent Planning Benchmark: A Diagnostic Framework for Planning Capabilities in LLM Agents

**作者**: Haoyu Sun, Wenxuan Wang, Mingyang Song, Jujie He, Weinan Zhang 等（同濟大學 · 上海 AI 實驗室 · 哈工大 · 復旦大學 · 上交大 · CUHK · UCSC · Skywork AI）　·　**arxiv**: 2606.04874
**連結**: [arxiv](https://arxiv.org/abs/2606.04874) · [alphaxiv](https://www.alphaxiv.org/abs/2606.04874)

### TL;DR

4,209 道跨 22 個領域的多模態測試題，專門診斷「LLM Agent 的規劃哪裡出了問題」，測試 12 個頂尖模型後發現全都有系統性弱點。

### Read Priority

必讀
這是目前規模最大、設定最完整的 Agent 規劃診斷 benchmark；選模型、設計 agent 評估、debug 神祕失敗，都能直接用上。

### 領域背景

「規劃」是 Agent 的靈魂動作：在呼叫任何工具前，Agent 必須先想清楚目標是什麼、要做哪些步驟、用哪些工具、什麼情況下任務是無解的。現有大多數評測只看任務最終有沒有成功，根本分不清「是規劃出了問題」還是「是工具呼叫時出了問題」。APB 是第一個系統性填補這個診斷空白的 benchmark。

### 中階導讀


#### 問題

你部署了一個多步驟 Agent，它在完成「搜尋 + 計算 + 撰寫報告」這類任務時常失敗，但不知道問題出在哪：是一開始的計劃就排錯了順序？是工具選錯了？還是它不知道應該放棄並告訴你「這個任務無解」？只看最終成敗率，無法回答這些問題，debug 只能靠猜。

#### 方法

APB 設計 4,209 道多模態測試題（含文字和圖像），涵蓋 22 個領域、五種評測設定：Holistic Planning（整體規劃：給目標讓 Agent 產出完整計畫）、Feedback-Conditioned Step-wise Planning（逐步規劃含反饋：模擬執行中途出錯需重規劃）、Extraneous Tools（多餘工具干擾：測試能否過濾無關工具）、Broken Tools（壞掉的工具：測試能否診斷並繞過失效工具）、Unsolvable Tasks（無解任務：測試能否正確拒絕而非硬湊答案）。

#### 為什麼重要

APB 讓你第一次能精確定位 Agent 的規劃弱點。五種設定直接對應生產環境的真實場景；在 ToolSandbox（200 題）和 τ²-bench（200 題）的跨 benchmark 驗證中，APB 引導的改進能一致性提升規劃正確率和下游執行指標。

### 深入要點

- 4,209 道 multimodal 測試題，22 個領域，是目前 Agent 規劃 benchmark 中規模最大的之一
- 五種設定涵蓋「主動規劃」和「被動應變」，尤其 Broken Tools 和 Unsolvable Tasks 直接對應生產環境最常被忽略的邊界條件
- 測試 12 個 MLLMs，揭示四大系統性弱點：長距規劃（long-horizon planning）、工具雜訊容忍（tool-noise robustness）、校準式拒絕（calibrated refusal）、推理時精修（inference-time refinement）⚠️（具體模型排名與分數需查原始論文）
- 跨 benchmark 驗證：APB 引導的精修在 ToolSandbox 和 τ²-bench 上均一致改善指標 ⚠️（改善幅度數字未見於摘要）
- 機構陣容：同濟、上海 AI Lab、哈工大、復旦、上交大、CUHK、UCSC、Skywork AI——跨機構合作背景紮實
- 與 LangGraph/AutoGen 的關聯：APB 的五種設定可直接作為 agent 系統的回歸測試套件設計藍圖，不依賴特定 runtime
- Limitation：multimodal 設定需要 agent 能處理圖像輸入，純文字 agent 架構只能跑部分測試集；論文開源狀態未確認 ⚠️

### Reviewer 一句話評

切入點清晰、規模充足，Broken Tools 和 Unsolvable Tasks 兩個設定真的抓住生產環境的痛點；唯一需留意的是 multimodal 設定讓適用範圍比「純文字 agent 規劃」更廣，使用前確認你的 agent 場景是否匹配。

### 給你的 take-away

- 選 agent 骨幹模型時，APB 的 long-horizon planning 和 tool-noise robustness 兩個維度比 MMLU 通用分數更直接相關——找在這兩個設定下成績最高的模型
- agent 出現神祕失敗時，先跑 Holistic Planning 確認計劃本身有沒有問題，再跑 Broken Tools 確認 agent 是否能偵測工具失效——這兩步能快速縮小 debug 範圍

---


## 論文二｜MetaForge: A Self-Evolving Multimodal Agent that Retrieves, Adapts, and Forges Tools On Demand

**作者**: Shouang Wei, Houcheng Min, Xinpeng Dong, Xin Lin, Sen Cui, Bo Jiang, Zhongxiang Dai, Kun Kuang, Guandong Xu, Fei Wu, Min Zhang 等　·　**arxiv**: 2606.01801
**連結**: [arxiv](https://arxiv.org/abs/2606.01801) · [alphaxiv](https://www.alphaxiv.org/abs/2606.01801)

### TL;DR

Agent 遇到工具庫裡沒有的場景，不再說「我做不到」，而是走過「判斷 → 找工具 → 調整參數 → 自行鍛造新工具 → 存回庫」五步閉迴路，實現工具能力的自我進化。

### Read Priority

必讀
直接解決「靜態工具庫讓 agent 在新場景卡住」的痛點，對做 tool-use agent 或 agent platform 工具管理的工程師有高度參考價值。

### 領域背景

現有 agent 系統的工具庫幾乎都是人工預先定義的靜態清單：你能用什麼工具，在開發時就決定好了。這帶來兩個問題：遇到工具庫沒有對應的場景就卡住；另外 agent 常常對不需要工具的簡單問題也去呼叫工具，增加延遲和出錯機會。MetaForge 正面解決這兩個問題。

### 中階導讀


#### 問題

你建了一個客服 agent，工具庫有「查訂單」、「退款申請」等工具。某天客戶問了一個需要查外部天氣 API 的問題，agent 傻眼——工具庫沒有天氣查詢。傳統做法是工程師手動加工具，每次有新場景就人工介入，根本無法做到真正自動化擴展。同時，對於能直接回答的簡單問題，agent 卻去呼叫五個工具，慢又容易出錯。

#### 方法

MetaForge 把工具使用分解成四個耦合階段：**Decide**（判斷）：這個任務需不需要呼叫工具，能直接回答就直接回答；**Retrieve**（找工具）：從現有工具庫找最合適的工具；**Adapt**（調整）：把工具參數對應到當前任務情境；**Forge**（鍛造）：如果沒有合適工具，線上合成一個新技能並存回工具庫（Recycle）。形成 judge → retrieve → adapt → forge → recycle 的自我演化閉迴路。

#### 為什麼重要

Decide 機制解決工具濫用（節省 token 和延遲），Forge + Recycle 機制讓工具庫隨使用自動成長，工程師不再需要每次手動擴充工具庫。對 agent 平台開發者來說，這是「工具管理從人工維護走向自動化」的重要架構思路。

### 深入要點

- 四階段 judge-retrieve-adapt-forge-recycle 閉迴路整合成統一的 orchestration policy，是概念上的整合創新 ⚠️（詳細架構和實驗數字需查 PDF，本次搜尋無法取得）
- Decide 機制的引入解決工具濫用問題，在有 API token 費用的生產環境直接有經濟效益
- Forge + Recycle 讓工具庫從「靜態資產」變成「動態知識庫」，是 agent 系統設計哲學上的轉變
- 與 LangGraph 的關聯：Decide 類似 conditional edge；Forge 類似動態 node 擴充——但 MetaForge 是自動觸發而非人工設計
- 與 AutoGen 的關聯：Forge 生成的新工具類似 AutoGen 的 code generation 能力，但 Recycle 讓技能持久化供日後複用，這是關鍵差異
- **核心落地疑慮**：Forge 出來的新工具品質和安全性如何保證？生產環境中需要完善的沙箱隔離和安全審計機制——論文如何處理這個問題需看原文 ⚠️
- 論文提交日期：2026-06-01；作者機構詳細資訊待確認 ⚠️

### Reviewer 一句話評

框架設計思路清晰且有實際痛點支撐，但由於詳細數字無法取得，目前難以判斷 Forge 機制在不同場景下的穩定性——「線上生成新工具」聽起來強大，但生產環境的安全邊界問題論文怎麼處理，必須看原文才能評估是否過度樂觀。

### 給你的 take-away

- 不管你要不要採用 MetaForge，Decide-before-use（先判斷要不要呼叫工具）這個原則可以直接加進現有 agent 架構——加一個 routing 步驟讓 agent 先評估問題是否需要工具，能顯著降低工具濫用帶來的成本和錯誤率
- 如果你的平台正在評估「工具庫自動擴充」功能，Forge 的五步閉迴路（judge-retrieve-adapt-forge-recycle）是目前最完整的設計藍圖之一，值得在技術方案評估中列入參考

---


## 論文三｜RUBAS: Rubric-Based Reinforcement Learning for Agent Safety

**作者**: Xian Qi Loye, Qinglin Su, Zhexin Zhang, Shiyao Cui, Qi Zhu, Fei Mi, Hongning Wang, Minlie Huang（清華大學 · 華為諾亞方舟實驗室）　·　**arxiv**: 2606.04051
**連結**: [arxiv](https://arxiv.org/abs/2606.04051) · [alphaxiv](https://www.alphaxiv.org/abs/2606.04051)

### TL;DR

把 agent 安全問題拆成四個細粒度維度打分，用這個「評分標準（Rubric）」作為強化學習的獎勵訊號，讓模型學會在安全和實用之間找到真正的平衡，而非一律拒絕。

### Read Priority

必讀
任何要把 agent 推上生產的團隊都無法跳過安全對齊問題；RUBAS 提供了一個比「教 agent 說不」更細緻、更可操作的訓練和評估框架。

### 領域背景

LLM 在純文字回答上的安全問題已有成熟解法，但 agent 的安全問題更複雜——agent 會真的去執行工具呼叫。一個 agent 可能說出很安全的話，但同時呼叫了一個刪除資料庫的 API。現有對齊方法靠「拒絕/不拒絕」的粗粒度訊號訓練，無法教模型「在什麼情境下，用什麼參數，執行哪些工具才是安全的」。

### 中階導讀


#### 問題

你的 agent 在安全微調（safety fine-tuning）後，對大量正常請求也說「我無法協助」；或者反過來，它執行了一個不該執行的危險工具呼叫但語氣很禮貌。根本原因是訓練訊號太粗糙——只有「這個回應對/錯」，沒辦法指出「問題出在工具選擇」還是「問題出在工具的參數」還是「其實可以安全地完成任務」。

#### 方法

RUBAS 把 agent 行為分解成四個維度評分，構成細粒度的 Rubric：**tool-use safety**（工具使用安全性：這個工具在這個情境下該不該被呼叫）、**argument safety**（工具參數安全性：傳入的 SQL 指令、檔案路徑、API 金鑰是否安全）、**response safety**（回應文字安全性）、**helpfulness**（有用程度：在安全的前提下任務完成了嗎）。這四個維度的評分組合成 RL 的 reward signal，在完整的 agent 執行軌跡（trajectory）上進行訓練，讓模型學到跨多步驟的安全與實用平衡。

#### 為什麼重要

RUBAS 的四維度 Rubric 本身就是一個可操作的 agent safety checklist，即使不做 RL 訓練，也能直接用來設計 agent 的安全評估標準。對平台工程師而言，這四個維度可以直接轉化為 production 的 safety monitoring 指標。

### 深入要點

- 作者 Zhexin Zhang（清華 CoAI 實驗室）在 LLM safety 領域有多篇知名工作（CValues、SafetyBench），本文機構背景和研究傳承均可信
- RL 訓練在完整執行軌跡（complete trajectory）上進行，比 step-level RLHF 更能捕捉 agent 多步安全決策的長期模式
- 跨多個 agent safety benchmark 和模型的實驗：RUBAS 優於標準對齊 baseline，並減少 tool-grounded hallucination（工具呼叫幻覺：agent 宣稱呼叫了工具但實際沒有，或呼叫了錯的工具）⚠️（具體數字需查 PDF）
- 四維度 Rubric 可整合到任何 agent framework 的 evaluation harness，不依賴特定 LLM 或 runtime
- **Limitation 1**：Rubric 需人工設計，不同部署場景（客服 vs 程式執行 vs 資料分析）的 Rubric 差異可能很大，難以一套通用
- **Limitation 2**：RL 訓練成本較高，中小型團隊可能資源不足以直接複現完整訓練流程
- 與 RLHF 的關鍵差別：RUBAS 的 reward 是結構化多維度分數，不依賴昂貴的人工偏好標注（preference pair），scalability 更好
- tool-grounded hallucination 是 agent 特有的安全問題，text-only safety 研究幾乎沒有覆蓋，本文是少數正面處理這個場景的工作

### Reviewer 一句話評

清華 + 諾亞方舟、Zhexin Zhang 在列，背景紮實可信；四維度分解有說服力且可操作性高。主要疑慮是 Rubric 設計本身引入的人工 bias，以及跨場景的 Rubric 泛化性——使用前需針對你的部署場景仔細定義 Rubric，而非直接套用預設維度。

### 給你的 take-away

- 把 RUBAS 的四維度（tool-use safety / argument safety / response safety / helpfulness）當成 agent safety review 的固定 checklist——上線前逐一確認這四個問題，能系統性地避免常見的 agent 安全盲點，不需要跑 RL 訓練也能用
- 如果你的 agent 出現「安全和實用二選一」的困境，Rubric-based 的四維度評估比「最終任務成功率」更能定位是哪個維度出了問題，讓 prompt engineering 或 fine-tuning 有更清楚的優化目標


## 參考資料

- [arxiv:2606.04874](https://arxiv.org/abs/2606.04874)
- [arxiv:2606.01801](https://arxiv.org/abs/2606.01801)
- [arxiv:2606.04051](https://arxiv.org/abs/2606.04051)
