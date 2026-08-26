---
title: "AI Agent Arxiv Digest — 2026-06-30"
date: 2026-06-30
category: daily
tags: [ai-agent, arxiv, daily, agent-evaluation, agent-framework, agent-coding]
lang: zh-TW
description: "今天三篇論文共同聚焦在一個核心問題：**我們到底怎麼評估 agent 夠不夠好"
tldr: "今天三篇論文共同聚焦在一個核心問題：**我們到底怎麼評估 agent 夠不夠好？** SWE-Explore 把 coding agent 最被忽視的中間步驟——讀懂程式庫——單獨拿出來測；Claw-SWE-Bench 揭示框架設計（harness adapter）才是讓 coding agent 分數暴漲的真正槓桿，同一模型換個 adapter 就能從 19% 跳到 73%；Red Queen Gödel Machine（Cambridge × NVIDIA）則走得更遠，讓評測者本身也跟著 agent 一起進化，打破靜態 benchmark 的天花板。三篇合看：**evaluation in"
series:
  name: "AI Agent Arxiv Digest"
  order: 37
---
> 🌏 [English version](/en/posts/daily/2026-06-30-ai-agent-arxiv-digest-en)

## 今日總覽

今天三篇論文共同聚焦在一個核心問題：**我們到底怎麼評估 agent 夠不夠好？** SWE-Explore 把 coding agent 最被忽視的中間步驟——讀懂程式庫——單獨拿出來測；Claw-SWE-Bench 揭示框架設計（harness adapter）才是讓 coding agent 分數暴漲的真正槓桿，同一模型換個 adapter 就能從 19% 跳到 73%；Red Queen Gödel Machine（Cambridge × NVIDIA）則走得更遠，讓評測者本身也跟著 agent 一起進化，打破靜態 benchmark 的天花板。三篇合看：**evaluation infrastructure 正在成為 agent 平台最核心的競爭壁壘**。

## 讀這篇前該知道的詞


| 白話解釋 | 詞 |
|---|---|
| agent 的「腳手架」，提供工具呼叫、workspace 隔離、patch 提取等執行環境；OpenClaw 是一種通用型 harness | Harness／Claw |
| 軟體工程 benchmark，用真實 GitHub issue 測試 coding agent 修 bug 的能力；Pass@1 = 一次就修好的比例 | SWE-bench |
| agent 在生成修改前，需要先瀏覽 codebase 結構、定位相關程式碼行的能力 | Repository Exploration（程式庫探索） |
| 理論上能自我改寫的 AI 系統，只要能證明改寫後系統效能會提升，就允許修改自身 | Gödel Machine |
| LLM 評分時偏好自己生成的內容，導致「自己出題自己改」永遠得高分的評測偏差 | Self-preference Bias |


---


## 論文一｜SWE-Explore: Benchmarking How Coding Agents Explore Repositories

**作者**: Shaoqiu Zhang, Yuhang Wang, Jialiang Liang, Yuling Shi, Wenhao Zeng, Maoquan Wang, Shilin He et al.（Xiaodong Gu 團隊）　·　**arxiv**: 2606.07297
**連結**: [arxiv](https://arxiv.org/abs/2606.07297) · [alphaxiv](https://www.alphaxiv.org/abs/2606.07297)

### TL;DR

大多數 coding agent benchmark 只看最終有沒有修好 bug，但「先找到要改哪幾行」這個中間步驟才是瓶頸——這篇論文專門拆開來測這一步。

### Read Priority

📖 略讀
除非你在開發 coding agent 或 code retrieval 系統，否則看摘要就夠了；如果有，這篇的方法論值得細讀。

### 領域背景

Coding agent 修 bug 可以拆成三步：(1) 讀懂 repo 結構 → (2) 定位要改哪幾行 → (3) 生成 patch。現有的 SWE-bench（軟體工程 benchmark）只評最終結果（binary: 修好/沒修好），把三步混在一起，所以你看到 agent 分數低，卻不知道是哪一步出了問題。Repository Exploration（程式庫探索）就是步驟 (1)+(2)，過去沒有獨立的評測方法。

### 中階導讀


#### 問題

一個 coding agent 拿到 GitHub issue 後，得先瀏覽整個 codebase、找到相關的檔案和程式碼行，才能開始修——就像你剛接手陌生大型專案，被要求修一個 bug，得先找到問題在哪才能動手。現有的 SWE-bench 只告訴你最後有沒有修好，「找問題在哪」這步做得好不好，完全隱形。

#### 方法

SWE-Explore 收集了 848 個 GitHub issue（203 個 repo、10 種程式語言）。對每個 issue，它從多條「成功修好 bug 的 agent 軌跡」中提取共識：所有成功路徑都讀過的那些程式碼行就是 ground truth（核心 context）。給定一個 issue，explorer 必須在固定的行數預算（line budget）內回傳排好序的程式碼行列表；評分用 line-level F1、NDCG@K 等指標。

#### 為什麼重要

研究發現 agentic explorer（agent 主動探索）明顯優於傳統 retrieval（向量搜尋），但即使找到對的檔案，line-level 的精確定位仍然很差。這意味著你的 coding agent 可能「找到對的檔案但看錯地方」——這個 bug 在 SWE-bench 裡完全隱形，現在終於有辦法單獨診斷它。

### 深入要點

- Ground truth 用多條成功軌跡取交集（core context）+ 聯集（optional context），比單一軌跡推導更穩定
- 評測分兩層：file-level hit rate（找到哪個檔案）vs. line-level F1（找到哪幾行）；研究發現兩層差距很大
- 關鍵發現：現有方法 file 層次勉強及格，line 層次大幅落後——說明 agent 的 context window 利用效率問題仍未解決
- 10 種語言涵蓋：Python、JavaScript、TypeScript、Java、Go 等，有多語言泛化性
- Limitation：ground truth 從「成功修好的軌跡」推導，如果 agent 用非傳統方法修好 bug，那些行不會進 ground truth——可能低估創意探索路徑
- LangGraph／AutoGen 關聯：這個 benchmark 暗示 agent framework 需要提供 line-level code indexing tool，而不只是 file-level search
- 落地門檻：低（dataset 開源，可直接評你的 retrieval pipeline；GitHub: Qiushao-E/SWE-Explore-Bench）

### Reviewer 一句話評

切角紮實，把「探索」這個被忽視的中間步驟明確量化，是工具導向的貢獻。Ground truth 靠成功軌跡推導有雞生蛋問題（沒成功的路徑也可能讀了有用的地方），作者有承認但沒完全解決。Benchmark 本身比結論更有長期價值——它是診斷工具，不是顛覆性發現。

### 給你的 take-away

- 如果你的 coding agent 在 SWE-bench 卡關：用 SWE-Explore 先診斷是「找不到相關程式碼」還是「找到了但 patch 生成爛」——兩個問題的解法完全不同
- Agent 框架選型時：確認供應商有提供 line-level code grounding 工具，只有 file search 是不夠的

---


## 論文二｜Claw-SWE-Bench: A Benchmark for Evaluating OpenClaw-style Agent Harnesses on Coding Tasks

**作者**: Mengyu Zheng, Kai Han, Boxun Li, Haiyang Xu, Yunhe Wang, Yu Wang et al.（Huawei 研究院）　·　**arxiv**: 2606.12344
**連結**: [arxiv](https://arxiv.org/abs/2606.12344) · [alphaxiv](https://www.alphaxiv.org/abs/2606.12344)

### TL;DR

同一個 AI backbone，換個 adapter 設計，Pass@1 從 19% 跳到 73%——這篇揭示你以為在比模型，其實在比框架設計。

### Read Priority

⭐ 必讀
任何在評估或選型 coding agent 框架的人，這篇改變你看 benchmark 數字的方式。

### 領域背景

OpenClaw 是一種通用型 agent harness（腳手架），讓 LLM 可以呼叫工具、執行程式碼、管理 workspace。這類通用 agent 越來越被用來做 coding 任務，但 SWE-bench 要求嚴格的輸出格式（Docker workspace 隔離、特定 patch 格式、prediction contract），通用 agent 根本無法直接跑。更麻煩的是，即使能跑，各家 harness 用不同設定，數字根本沒有可比性。

### 中階導讀


#### 問題

A 框架聲稱 Pass@1 60%，B 框架聲稱 40%——但兩者用了不同的 prompt 格式、不同的執行時間、不同的 workspace 環境。你看到的差距是模型本身的差異，還是框架設計的差異？現在根本無法分辨。

#### 方法

Claw-SWE-Bench 設計了一個「adapter protocol（轉接協議）」：在不同的 agent harness 外包一層轉接器，強制所有 agent 使用統一的 prompt 格式、固定的執行時間預算、相同的 workspace 合約，以及同一套 patch 提取器和評分器。Benchmark 有 350 個 GitHub issue（8 種語言、43 個 repo）；Lite 版 80 個 instance 適合快速驗證；dataset 排除 issue 建立後才 commit 的修改，防止資料洩漏。

#### 為什麼重要

最震撼的發現：**同一個 GLM 5.1 backbone，minimal adapter = 19.1% Pass@1，full adapter = 73.4% Pass@1**，差距超過 54 個百分點。這代表 adapter（框架設計）的影響遠大於底層模型選擇——如果你在換模型卻沒有同步優化 harness 設計，你可能在找錯方向。

### 深入要點

- Adapter protocol 標準化四件事：prompt 格式、執行時間預算、workspace 合約（環境隔離方式）、patch 提取邏輯 + 評分器
- **⚠️ 19.1% vs 73.4% 是作者自設 minimal adapter 對比 full adapter**，minimal adapter 的設計選擇可能刻意選弱，這個戲劇性數字需要社群獨立複現才能完全信任
- Future-commit cleanup：排除 issue 建立後才 commit 的修改，避免「agent 偷看了答案」的 data leakage 問題
- 成本感知 Lite subset：用 17 個校準指標選出 80 個最具代表性的 instance，讓快速驗證的成本降低 77%
- 8 語言覆蓋讓非 Python 的 coding agent 也能公平評測
- Limitation：adapter 本身的設計選擇仍影響結果，沒有真正中立的 baseline；350 instance 仍是小型 dataset
- LangGraph／AutoGen 關聯：任何想接入 SWE-bench 類評測的框架，需要設計符合 Claw adapter 合約的 wrapper；這篇點出通用 agent 進入 coding 評測的具體路徑
- 落地門檻：中（需要實作 adapter wrapper，但 Lite 版可以先快速試；GitHub: opensquilla/claw-swe-bench）

### Reviewer 一句話評

核心洞察（adapter 設計 >> 模型選擇）有說服力，框架標準化的貢獻也是實際的。但 19% vs 73% 這個主打數字過於戲劇化——minimal adapter 的設計是否刻意選弱？需要等社群複現。這篇最有長期價值的貢獻是「提供了一個可重複的評測合約」，比任何具體數字都更實在。

### 給你的 take-away

- 看 coding agent 的 benchmark 數字前，先問：「這是用什麼 adapter 設定跑的？」——不同 adapter 可以讓同一模型差出 54 個百分點；你以為在比模型，其實在比框架
- 想快速評估自己 coding agent harness 的設計是否合理：直接拿 Claw-SWE-Bench Lite（80 instance）跑，成本低，結果可解讀

---


## 論文三｜The Red Queen Gödel Machine: Co-Evolving Agents and Their Evaluators

**作者**: Alex Iacob, Andrej Jovanović, William F. Shen, Daniel Burkhardt, Meghdad Kurmanji et al.（Cambridge × NVIDIA × Flower Labs × MBZUAI × Inria，共 13 位作者）　·　**arxiv**: 2606.26294
**連結**: [arxiv](https://arxiv.org/abs/2606.26294) · [alphaxiv](https://www.alphaxiv.org/abs/2606.26294)

### TL;DR

AI agent 越來越強，但評測系統一直是靜態的——這篇論文讓「評測 agent 的系統」也跟著 agent 一起自我進化，打破靜態 benchmark 的天花板。

### Read Priority

⭐ 必讀
對 agent 平台架構師、做 eval infrastructure 的工程師，或對 AI 自我改進系統感興趣的任何人——這篇的概念層面是近期 agent 研究中少數真正有新鮮感的，思路值得深讀。

### 領域背景

Gödel Machine 是理論概念：一個可以自我改寫程式碼的 AI，只要能嚴格證明「改寫後自己會更好」，就被允許修改自身。近年 AI 界在這個概念上延伸，讓 LLM agent 不斷改進自己的推理策略或程式碼。但所有這些自我改進系統有共同盲點：評分標準是固定的（靜態 benchmark 或 LLM judge），當 agent 越來越強，評測系統跟不上，最終 agent 學會「背答案」而非真的變強。LLM-as-judge（用 LLM 來評分）有 self-preference bias（LLM 偏好自己生成的內容），進一步加劇這個問題。

### 中階導讀


#### 問題

你讓 agent 每天自我改進，但評分系統是靜態的 benchmark。就像每天考同一份考卷——agent 早晚把答案背下來，分數上去了，真正的能力卻沒有提升。更糟的是，LLM-as-judge 有 self-preference bias，所以 agent 不用真的變強，只要讓輸出更像 LLM 的風格就能拿高分。

#### 方法

Red Queen Gödel Machine（RQGM）的核心是 epoch 架構：(1) 每個 epoch 內，evaluation criteria（評分標準）固定，自我改進的理論保證在這個 epoch 內成立；(2) 在 epoch 邊界，utility function（評分函數本身）可以更新——agent 進化後，evaluator 也必須更難；(3) 對抗式 evaluator 訓練：mid-search 時強制 evaluator 去「找 AI 生成內容的破綻」，對抗 self-preference bias。應用在三個領域：coding、scientific paper writing、Olympiad-level 數學證明。

#### 為什麼重要

這個框架解決的不只是一個 benchmark 問題，而是 agent 系統設計的結構性問題：**評測基礎設施必須跟著 agent 能力一起演化，否則你永遠不知道真正的進步在哪**。這直接影響任何做 RLHF、agent fine-tuning、或 self-play 訓練的平台設計。

### 深入要點

- 名稱典故：「Red Queen Effect」來自演化生物學——獵物和天敵彼此施壓持續演化，「必須一直跑才能留在原地」；這裡 agent 和 evaluator 互相施壓，誰也不能停下
- Coding 結果：用 agent-as-a-judge 的 code review 信號輔助 test pass，比 SOTA 少用 1.35x-1.72x 的 tokens 達到更高 test pass rate
- Writing 結果：co-evolved writers 的 paper 在 agent judge panel 的接受率提升 1.78x-1.86x
- Grading 結果：co-evolved graders 在 Olympiad 數學題的 ground-truth accuracy 提升 9%
- **⚠️ Writing 的 1.78x-1.86x 是以 agent judge panel 評分，不是人類評審**——最亮眼的數字缺乏獨立的人類驗證，存疑
- Epoch 理論保證的前提：within-epoch 的 evaluator 必須是正確的；如果 evaluator 本身有偏差，proof 不成立
- 主要 limitation：如果 ground truth 本身有偏差，co-evolution 可能放大偏差；preprint，尚未 peer review；epoch 切換的觸發條件需要人工設定
- 機構背景強大：Cambridge（Nicholas D. Lane 團隊）× NVIDIA × Flower Labs（聯邦學習公司）× MBZUAI × Inria，跨機構合作，資源充足
- 落地門檻：高（完整 RQGM 需要 epoch 管理 + evaluator 版本控制）；但「對抗式 evaluator 訓練」可以單獨採用，不需要完整框架

### Reviewer 一句話評

概念層面是這一波 agent 研究裡少數真正有新鮮感的——承認靜態 evaluation 是結構性問題並給出框架解法，而不只是「又加了個 tool」。但最亮眼的 1.78x writing 結果完全靠 agent judge 評，缺乏人類驗證，讓這個數字無法獨立核實；整篇 preprint，技術 proof 依賴多個強假設。屬於「思路值得深讀，數字存疑」的類型——不要拿這些數字去說服人，但這個設計思路值得參考。

### 給你的 take-away

- 如果你在做 LLM-as-judge 評測系統：直接拿「對抗式 evaluator 訓練」這個概念——定期讓 judge 去「找 AI 生成內容的問題」，對抗 self-preference bias，不需要採用完整 RQGM 框架
- 如果你在設計 agent 的 RL 或 fine-tuning pipeline：注意 reward model 靜態化問題——epoch-based 的 evaluator 更新機制值得參考，否則 agent 會學會取悅靜態評分而非真正提升


## 參考資料

- [arxiv:2606.07297](https://arxiv.org/abs/2606.07297)
- [arxiv:2606.12344](https://arxiv.org/abs/2606.12344)
- [arxiv:2606.26294](https://arxiv.org/abs/2606.26294)
