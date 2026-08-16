---
title: "AI Agent Arxiv Digest — 2026-08-09"
date: 2026-08-09
category: daily
tags: [ai-agent, arxiv, daily, agent-harness, long-horizon, agent-evaluation]
lang: zh-TW
description: "今天三篇圍繞同一個問題——Agent 做長任務時真正卡住的不是模型，是鷹架：OneDayAgent 證明一個統一鷹架就能跨後端創 SOTA，Horizon Gap 用 1,547 篇文獻指出長程失敗的結構性根因，LongHorizon-Harness 用外顯任務狀態＋三角迴圈讓 Qwen 3.7-Plus 在 WeaveBench 從 51.8% 飆到 80.7%"
tldr: "OneDayAgent 用任務分解＋執行記憶＋全域驗修三步鷹架在 AgentIF-OneDay 拿下 0.821 新 SOTA，同一鷹架跨五個後端穩定運作；The Horizon Gap 綜述 1,547 篇論文發現長程 Agent 六大失敗類別共享同一結構模式——純結果訊號隨步數增長而失效，領域正在製造更密的過程訊號來補；LongHorizon-Harness 把長程執行重新定義為任務狀態管理問題，用 Manager-Executor-Auditor 三角迴圈讓 Qwen 3.7-Plus 在 WeaveBench 從 51.8% 跳到 80.7%，跨模型跨環境都有增益"
series:
  name: "AI Agent Arxiv Digest"
  order: 77
---

## 今日總覽

這週末三篇論文不約而同指向同一個訊號：模型能力已經不是長程 Agent 的瓶頸——鷹架才是。OneDayAgent 用一個統一的「分解→記憶→驗修」鷹架就跨五個後端模型拿下新 SOTA，證明鷹架的泛化性可以獨立於模型；The Horizon Gap 用 1,547 篇文獻畫出全景——長程失敗從規劃到安全六大類別都踩到同一個坑：只看最終結果的訊號隨步數增長而失效；LongHorizon-Harness 則提出一個具體的工程解法：把任務狀態抽離執行 context，用 Manager-Executor-Auditor 三角迴圈管理，讓 Qwen 3.7-Plus 在 WeaveBench 從 51.8% 飆到 80.7%。三篇合起來的訊息很清楚：2026 下半年，Agent 的競爭力在鷹架工程，不在換更大的模型。

## 讀這篇前該知道的詞

| 詞 | 白話解釋 |
|---|---|
| 鷹架（Harness/Scaffold） | 包裹 LLM 的控制程式——負責任務分解、記憶管理、工具呼叫、錯誤修復，不含模型本身 |
| 長程任務（Long-horizon task） | 需要跨越數十到數百步才能完成的任務，過程中會累積 context、切換工具、丟失目標 |
| 過程訊號（Process signal） | 在任務執行「過程中」給的回饋（如每步獎勵），相對於只看最終結果的「結果訊號」 |
| 執行記憶（Execution memory） | 鷹架在子任務之間保留的壓縮狀態，讓後續步驟能讀到前面做了什麼，但不帶完整對話記錄 |
| 鷹架進化（Harness evolution） | Agent 自己修改自己的控制程式（prompt、工具、迴圈結構）來提升表現，不改底層模型 |

---

## 論文一｜OneDayAgent：一個鷹架打天下的長程 Agent

**OneDayAgent: Towards a Long-Horizon Harness for Autonomous Agents**
Jingsheng Zheng, Xinyuan Fang, Jintian Zhang et al.（Zhejiang University）　·　arxiv: 2608.05013

連結: [arxiv](https://arxiv.org/abs/2608.05013) · [alphaxiv](https://www.alphaxiv.org/abs/2608.05013)

### TL;DR

一個統一鷹架（任務分解＋執行記憶＋全域驗修）在 AgentIF-OneDay 104 個日常任務上以 GLM-5.2 後端達到 0.821 新 SOTA，同一鷹架不改一行程式跨五個後端模型穩定運作。

### Read Priority

必讀 — 如果你正在設計 Agent 執行框架，這篇給出了一個完整且可重現的「分解→記憶→驗修」三步鷹架藍圖，且已開源。

### 領域背景

長程 Agent 面臨三個交互作用的失敗模式：目標漂移（做到後面忘了前面的要求）、狀態丟失（切換工具或環境時中間結果消失）、context 溢出（對話太長超出模型視窗）。之前的做法多半各個擊破——加 reasoning scaffold 或 feedback loop——但這些修補各自為政，沒有人驗證過一個統一鷹架能不能同時處理這三個問題，更不知道同一鷹架能否跨後端模型泛化。

### 中階導讀

- **問題**：想像你請 Agent 花一整天做一個跨網頁搜尋、程式撰寫、文件編輯的複雜任務。到第 50 步時，它已經忘了第 3 步搜到的關鍵數據，而且把早期的格式要求丟了。
- **方法**：OneDayAgent 把執行拆成三個階段——(1) 把大任務分解成有邊界的子任務，每個子任務有局部目標；(2) 子任務之間用壓縮的執行記憶傳遞狀態，而不是帶著完整對話記錄；(3) 所有子任務跑完後，用全域驗證器對照原始需求檢查最終交付物，發現缺漏就進入定向修復迴圈。
- **為什麼重要**：鷹架泛化性的實證。同一個鷹架跨 GLM-5.2、GPT-5.5（Codex）等五個後端模型穩定運作，而不同後端在同一鷹架下展現不同的執行風格（延遲、工具呼叫量、修復率），說明鷹架和模型的能力是可以正交分離的。

### 深入要點

- AgentIF-OneDay 104 個任務，GLM-5.2 後端整體分數 0.821，領先所有任務類型、領域、評分維度 ⚠️（浙大＋智譜自測，需等外部複現）
- 先前最佳：Codex（GPT-5.5 medium）達 0.799
- 五個後端模型來自三個模型家族，鷹架不需要任何後端特定調整
- 消融實驗顯示三個能力各自貢獻：移除驗修模組損失最大
- 落地門檻：需要足夠大的 context window 來支撐子任務執行記憶；已開源
- Limitation：只在 AgentIF-OneDay 一個 benchmark 上驗證，沒有跨 benchmark 泛化證據

### Reviewer 一句話評

架構簡潔且可重現，「鷹架跨後端泛化」的實證很有價值。但單一 benchmark 上的 SOTA 說明力有限——AgentIF-OneDay 的任務分佈是否代表真實長程工作負載，需要更多驗證。

### 給你的 take-away

- 如果你在建 Agent 平台：直接參考「分解→記憶→驗修」三步架構，特別是「子任務邊界即 context 壓縮點」的設計——這是最實用的工程決策
- 如果你在選 Agent 後端模型：這篇暗示鷹架品質的邊際效益可能高於換模型，先投資鷹架再考慮升級模型

---

## 論文二｜The Horizon Gap：長程 Agent 的 1,547 篇文獻全景

**The Horizon Gap: Planning, Memory, Execution, Training, and Evaluation for Long-Horizon LLM Agents**
Mingguang Chen, Licheng Wang, Bo Qu　·　arxiv: 2608.06663

連結: [arxiv](https://arxiv.org/abs/2608.06663) · [alphaxiv](https://www.alphaxiv.org/abs/2608.06663)

### TL;DR

綜述 1,547 篇 2024-2026 論文，發現長程 Agent 從規劃到安全六大類別都踩到同一個結構性問題：純結果訊號隨步數增長而失效，領域的統一回應是製造更密的過程訊號。

### Read Priority

必讀 — 這是目前最完整的長程 Agent 綜述，39 頁覆蓋規劃、記憶、執行、訓練、評測、安全六大面向，適合用來校準你對領域全貌的認知。

### 領域背景

「長程」「長 context」「長期記憶」三個概念在文獻中經常被混為一談，但它們是三個獨立維度——任務要幾步、模型能看多少 token、系統是否跨 session 保留資訊。之前的綜述多半只覆蓋其中一個面向（如純做 RAG 記憶或純做規劃），沒有人把整個生命週期串起來看。

### 中階導讀

- **問題**：為什麼 Agent 在短任務上表現出色，一拉長就崩？是模型不夠強，還是整個系統的某個結構性環節在失敗？
- **方法**：用八條搜尋線程系統性收集 1,547 篇論文，經兩階段過濾（排除 26.8% 離題論文），按任務生命週期分六類（規劃、記憶、執行控制、訓練、評測、基礎/安全），再交叉一個「horizon 在哪裡承載」的維度（context 內、鷹架內、跨 session）。
- **為什麼重要**：發現一個跨類別的統一模式——不論是 process reward model、credit assignment 還是 trajectory diagnostic，領域的回應都是在製造更密的步級訊號來替代失效的結果訊號。這不是巧合，而是長程系統的結構性需求。

### 深入要點

- 語料庫 1,547 篇，涵蓋 2024-2026，其中 72% 的記憶/context 管理論文發表於 2026 年——說明這個方向正在爆發
- 六大類別：規劃 182 篇、記憶 397 篇、執行控制 584 篇、訓練 167 篇、評測、基礎/安全
- 核心發現：「結果訊號隨 horizon 增長而失效」是跨類別的統一模式
- 三個開放測量問題：(1) 如何分離模型能力 vs 鷹架能力 (2) 過程訊號同時用於訓練和評測的相關偏差 (3) 長程可靠性是否允許通用預測理論
- Limitation：語料收集有 26.8% bleed filter，部分邊界領域可能被排除

### Reviewer 一句話評

覆蓋面極廣且方法論透明（公開了 bleed filter 比例），「跨類別統一模式」的觀察具有啟發性。但 39 頁的篇幅意味著深度有限——每個子領域的讀者可能覺得自己的方向被簡化了。

### 給你的 take-away

- 如果你在設計 Agent 評測：注意「過程訊號同時用於訓練和評測」的相關偏差問題——你用來教 Agent 的訊號不該和你用來評判它的訊號是同一個
- 如果你在做長程 Agent 研究：先讀這篇的分類框架，確認你的工作落在哪個象限，避免重複已有 584 篇的執行控制方向而忽略較少人做的基礎/安全面向

---

## 論文三｜LongHorizon-Harness：把任務狀態抽離 context 的三角迴圈

**LongHorizon-Harness: Advancing Long-Horizon Agents for Real-World Tasks**
Ziyu Ma, Hailang Huang, Shun Zou et al.　·　arxiv: 2608.01964

連結: [arxiv](https://arxiv.org/abs/2608.01964) · [alphaxiv](https://www.alphaxiv.org/abs/2608.01964)

### TL;DR

把長程執行重新定義為「任務狀態管理」問題，用 Manager-Executor-Auditor 三角迴圈（MEA）把任務狀態抽離 context，讓 Qwen 3.7-Plus 在 WeaveBench 從 51.8% 跳到 80.7%，跨模型跨環境一致有效。

### Read Priority

必讀 — 如果你正在設計長程 Agent 鷹架，這篇的「外顯任務狀態＋獨立審計」設計比 OneDayAgent 更具體地解決了 context rot 問題，且跨三個 benchmark 驗證。

### 領域背景

現有 Agent 鷹架把任務執行、狀態追蹤和完成度評估全部塞在同一個不斷增長的 context 裡。這帶來兩個互相加強的失敗模式：context rot（有用資訊被稀釋到找不到）和錯誤自評傳播（Agent 誤以為自己完成了某步，後續步驟建立在錯誤的前提上）。之前的修補多半在 context 內部做壓縮或摘要，沒有從根本上把狀態管理拆出來。

### 中階導讀

- **問題**：想像 Agent 跑到第 80 步時，它的 context 已經長到數萬 token。它需要回頭確認第 12 步做了什麼——但那段資訊早被埋在雜訊裡，而且它第 40 步對自己的錯誤評估已經悄悄傳染到後面所有決策。
- **方法**：LongHorizon-Harness 用三角迴圈解決——(1) Manager 維護一個外顯的任務狀態（哪些做了、哪些沒做、產出了什麼），決定下一個子任務；(2) Executor 在全新 context 中執行該子任務（不帶歷史包袱）；(3) Auditor 以唯讀模式直接檢查環境狀態（不是問 Agent「你做完了嗎」，而是自己去看），只有通過審計的結果才寫回任務狀態。加上 AgentAdapter 層讓任何模型和鷹架後端即插即用。
- **為什麼重要**：「外顯狀態＋獨立審計」解決了 context rot 的根因而非症狀。Executor 用 fresh context 消除了歷史干擾，Auditor 的唯讀檢查切斷了錯誤自評的傳播鏈。

### 深入要點

- Qwen 3.7-Plus：WeaveBench 51.8% → 80.7%（+28.9pp），Terminal-Bench 2.1 69.7% → 77.2%，OSWorld 2.0 2.8% → 8.3%
- Claude Opus 4.7：OSWorld 2.0 子集 20.0% → 34.3%（+14.3pp）⚠️（作者自測，需等外部複現）
- 跨三個 benchmark、兩個模型家族、多種互動環境（網頁、終端、桌面）一致有增益
- 核心設計：Executor 每次用 fresh context 執行，不帶歷史——徹底解決 context rot
- AgentAdapter 是 lightweight wrapper，不需要修改底層 Agent 的原生迴圈
- Limitation：OSWorld 2.0 的絕對分數仍然很低（8.3%），說明桌面操作環境的鷹架問題還沒被真正解決

### Reviewer 一句話評

「把狀態管理拆出 context」的思路清晰且效果顯著，跨環境增益讓人信服。但 OSWorld 上 2.8%→8.3% 的絕對值仍然很低——鷹架能提升相對表現，但桌面環境的根本瓶頸可能不在鷹架。

### 給你的 take-away

- 如果你在建 Agent 平台：MEA 三角迴圈的「Executor 用 fresh context」設計值得直接借鏡——比在長 context 裡做摘要壓縮更根本地解決了 context rot
- 如果你在做鷹架跨後端適配：AgentAdapter 的設計模式（wrapper 不改底層 agent loop）是實用的工程參考

---

## 今日收穫

之前以為「Agent 做不好長任務」是模型能力的問題——換更強的模型就行。今天三篇合起來讓我意識到，真正的瓶頸是鷹架工程：OneDayAgent 證明同一鷹架跨五個後端都行，Horizon Gap 指出整個領域都在為鷹架製造更好的訊號，LongHorizon-Harness 則示範了一個具體的工程解法——把任務狀態抽離 context，用獨立審計切斷錯誤傳播。模型是引擎，鷹架才是方向盤。

## 參考資料

- [arxiv:2608.05013](https://arxiv.org/abs/2608.05013)
- [arxiv:2608.06663](https://arxiv.org/abs/2608.06663)
- [arxiv:2608.01964](https://arxiv.org/abs/2608.01964)
