---
title: "Paper Reading 面試攻略：怎麼讀、怎麼討論、必讀清單"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, paper-reading, research]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中 Paper Reading 環節——怎麼快速讀懂一篇論文、怎麼在面試中討論、以及一份必讀論文清單。"
tldr: "Paper Reading 面試不是考你有沒有讀過那篇 paper，而是考你能不能快速理解一個新方法並找出它的限制。AI-native 公司（Anthropic、OpenAI）特別愛考。準備策略：練習 30 分鐘讀完一篇 paper 並能口述 contribution + limitation，建立自己的必讀論文清單，每篇練習用三句話總結。"
series:
  name: "AI Engineer 面試準備"
  order: 8
---

## Paper Reading 面試怎麼考

Paper reading 是 AI-native 公司面試中最獨特的環節。大廠通常不考這個，但 Anthropic、OpenAI、Cohere、DeepMind 這類公司把它當作核心評估項目，因為他們需要的人不只會用現成工具，還要能理解和評估最前沿的方法。

常見的考法有三種：

**當場讀新論文。** 面試官給你一篇你大概率沒讀過的論文（通常是最近幾個月發表的），給你 20-30 分鐘閱讀，然後花 20-30 分鐘討論。這種考法測試的是你的閱讀速度、抓重點的能力，以及能不能在不熟悉的領域快速建立直覺。

**討論你讀過的論文。** 面試官請你挑一篇最近讀過的、覺得有趣的論文來講。這種考法看的是你的品味——你為什麼覺得這篇重要、你怎麼理解它的 contribution、你有沒有自己的觀點。

**針對特定論文深挖。** 面試官指定一篇經典論文（例如 Attention Is All You Need 或 DPO），問你細節問題。這種考法測試的是你對核心文獻的理解深度。

三種考法的共通要求：你要能用自己的話重述方法、找出限制、提出改進方向。照搬原文摘要是不夠的。

## 30 分鐘閱讀法

面試中拿到一篇新論文，你沒有時間從頭讀到尾。以下是經過驗證的閱讀順序：

**前 5 分鐘：建立全貌。** 讀 abstract（這篇在解什麼問題、用什麼方法、結果是什麼），然後跳到 figures 和 tables——好論文的架構圖和實驗結果表通常就能告訴你八成的故事。特別注意 Figure 1（通常是方法概覽）和最後一張 table（通常是主要實驗結果）。

**中間 15 分鐘：理解方法。** 讀 method section，聚焦在「這篇和之前的做法差在哪」。不要試圖理解每一個數學公式——理解直覺比推導細節重要。如果有你不認識的符號或概念，先標記跳過，不要卡住。

**後 10 分鐘：評估結果與限制。** 讀 experiments section，重點看：baseline 選了哪些（有沒有漏掉重要的比較對象）、在哪些 benchmark 上測（數據集是否代表真實場景）、improvement 的幅度（是統計顯著還是 noise 範圍內）。最後掃一眼 conclusion 和 limitations（如果有的話），確認作者自己承認了什麼限制。

**讀完後，在心裡回答三個問題：** 這篇的核心 contribution 是什麼（一句話）？它比之前的方法好在哪裡（具體數字或質化差異）？它有什麼明顯的限制或我會擔心的地方？

## 怎麼在面試中討論

面試官問「講一下這篇 paper」時，用這個四段結構：

**Contribution（一句話）。** 這篇做了什麼？用最精簡的方式說出核心 idea。例如：「DPO 把 RLHF 的三步驟（reward model → PPO → fine-tune）簡化成一步——直接用 preference data 做 supervised learning，不需要訓練 reward model。」

**Method（兩三句話）。** 怎麼做的？重點是直覺，不是公式。如果面試官想聽數學，他會追問。例如：「它把 reward model 的最優解代回 RL 的目標函數，推導出一個 closed-form loss，只需要 preferred 和 dispreferred response 的 log probability 差。」

**Limitation（一兩句話）。** 有什麼問題？這是面試官最想聽的——如果你只會說優點，他會覺得你沒有批判性思維。例如：「DPO 假設 preference data 的品質夠高、且每對 pair 的偏好是一致的。如果標注者之間的 disagreement 很大，DPO 的效果會退化得比 PPO-based RLHF 更快，因為它沒有 reward model 做緩衝。」

**Extension（可選，但加分）。** 你會怎麼改進或延伸？這展示的是你的研究直覺。例如：「一個可能的方向是引入 confidence weight——標注者一致同意的 pair 權重高，有 disagreement 的 pair 權重低，這樣可以對沖標注品質的問題。」

## 批判性思維：怎麼找論文的弱點

面試官追問「你覺得這篇有什麼問題」時，從這幾個角度切入：

**實驗設計。** Baseline 是否足夠？很多論文會選弱的 baseline 來讓自己的數字看起來好。如果一篇 2026 年的論文拿 2023 年的方法當 baseline，你可以提出這個疑問。此外，ablation study 是否充分——如果方法有三個改進點但只做了整體比較，你不知道哪個改進真正有效。

**數據集選擇。** Benchmark 是否代表真實場景？很多論文只在學術 benchmark 上測試（如 MMLU、GSM8K），但這些 benchmark 和生產環境的差距可能很大。如果論文聲稱方法適用於 production，但只在學術數據集上測，這是一個合理的質疑點。

**Generalizability。** 結果能不能推廣到其他模型大小、其他語言、其他領域？很多方法在特定設定下有效，換一個設定就不行。如果論文只在 7B 模型上測試，你可以問這個方法在 70B 或更大的模型上是否還有效。

**計算成本。** 論文有沒有報告訓練和推理的計算成本？有些方法效果好 2% 但計算量增加 10 倍，在生產環境中完全不實用。這是工程師視角的批判，面試官特別欣賞。

**可重現性。** 程式碼有沒有開源？Hyperparameter 有沒有完整列出？如果一篇論文的結果高度依賴特定的 hyperparameter 設定但沒有報告搜尋範圍，這是一個紅旗。

## 必讀論文清單

按主題整理，每個主題 2-3 篇核心論文。面試前每篇至少能用三句話總結（contribution + method + limitation）。

### Transformer 與注意力機制

- **Attention Is All You Need** (Vaswani et al., 2017) — Transformer 的源頭，必須能解釋 self-attention 的計算流程和為什麼它取代了 RNN
- **FlashAttention** (Dao et al., 2022) — IO-aware 的 attention 計算，面試常問「怎麼讓 Transformer 更快」時的核心回答

### Alignment 與 RLHF

- **Training language models to follow instructions with human feedback** (Ouyang et al., 2022) — InstructGPT，RLHF 的經典實作
- **Direct Preference Optimization** (Rafailov et al., 2023) — DPO，理解它為什麼能替代 PPO，以及什麼時候不能

### RAG 與檢索增強

- **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks** (Lewis et al., 2020) — RAG 的開山之作
- **Lost in the Middle** (Liu et al., 2023) — 長 context 中資訊位置對模型表現的影響，面試常考

### Scaling Laws

- **Scaling Laws for Neural Language Models** (Kaplan et al., 2020) — 模型大小、資料量、計算量的關係
- **Chinchilla** (Hoffmann et al., 2022) — 修正了 scaling law 對資料量的估計，引出 compute-optimal training 的概念

### Agent 系統

- **ReAct** (Yao et al., 2022) — reasoning + acting 的 agent 框架，面試常問 agent 架構時的基礎
- **Toolformer** (Schick et al., 2023) — 模型自主學習使用工具

這不是一份完整的文獻清單，而是一份面試準備的 minimum viable reading list。如果你有多餘的時間，優先補你目標公司最相關的方向。

## 面試技巧

**承認不知道比瞎掰好。** 如果面試官問你一篇你沒讀過的論文，直接說：「我沒讀過這篇，但根據標題和你剛才的描述，我猜它在做 X。我讀過一篇相關的 Y 論文，它的做法是...」這比假裝讀過然後被追問穿幫好一百倍。

**準備你自己的「最愛論文」。** 很多面試會問「最近讀過什麼有趣的 paper」。提前準備 2-3 篇你真的讀懂、有自己觀點的論文。選論文的標準不是名氣，而是你能不能講出 contribution + limitation + 你的延伸想法。

**練習口述。** 閱讀理解和口述能力是兩回事。很多人讀懂了但講不清楚。練習的方法是：讀完一篇 paper 後，不看原文，花 5 分鐘對著鏡子或錄音講一遍，然後回去對照原文看自己漏了什麼。

**不要死背，要理解脈絡。** 面試官能一眼看出你是在背 summary 還是真的理解。最好的準備方式不是一篇一篇孤立地讀，而是理解論文之間的演進關係——為什麼 DPO 出現在 InstructGPT 之後、FlashAttention 解決了原始 Transformer 的什麼問題、Chinchilla 怎麼修正了 Kaplan 的 scaling law。

## 面試模擬題

### 題目

「這是 FlashAttention 的論文。你有 30 分鐘閱讀，然後我們會討論。請告訴我它解決了什麼問題、方法的核心 insight 是什麼、以及你認為它的 limitation 在哪裡。」

**來源**：Anthropic / OpenAI 面試（典型格式）　**難度**：進階　**環節**：onsite paper discussion

### 拆解思路

1. **先釐清問題**：確認面試官期待什麼深度——是高層 intuition 還是要深入 IO-aware 的演算法細節？有沒有特別想聽的角度（比如在他們的 inference stack 裡的適用性）？
2. **建立框架**：用 contribution → method → limitation → extension 的四段結構回答。
3. **深入核心**：不要只說「它比較快」。核心 insight 是**把 attention 的瓶頸從計算搬到記憶體 IO**——標準 attention 的 O(n²) 不是慢在算，而是慢在 HBM 和 SRAM 之間搬資料。FlashAttention 用 tiling 把中間結果留在 SRAM，避免來回讀寫 HBM。
4. **收尾**：主動提出 limitation 和你的延伸想法，展現批判性思維。

### 範例回答（面試時可以這樣講）

> **問題與貢獻。** 標準 Transformer self-attention 的時間和空間複雜度都是 O(n²)。之前的大部分工作（Linformer、Performer）試圖用 approximation 把複雜度降到 O(n)，但犧牲了模型品質。FlashAttention 走了一條不同的路——它不改變 attention 的數學，而是改變計算的方式，讓 exact attention 在 GPU 上跑得更快、用更少記憶體。
>
> **核心方法。** 關鍵 insight 是 GPU 的瓶頸不在計算（FLOPs 很便宜），而在 HBM 和 SRAM 之間的資料搬移。標準實作要把 n×n 的 attention matrix 寫入 HBM 再讀回來，FlashAttention 用 tiling 技巧把 Q、K、V 切成小塊，在 SRAM 裡算完 softmax（用 online softmax 避免需要全局 max），不把中間的 attention matrix 寫回 HBM。這帶來兩個好處：wall-clock time 因為減少 IO 而加快 2-4 倍，記憶體使用從 O(n²) 降到 O(n)。
>
> **Limitation 與延伸。** 我看到幾個限制：第一，它高度依賴 GPU 架構的 SRAM 大小，換硬體可能要重新 tune tile size；第二，custom CUDA kernel 增加了工程維護成本；第三，FlashAttention 2 的論文承認在 head dimension 不是 2 的冪次時效率會下降。延伸方面，我好奇 FlashAttention 的 tiling 策略能不能推廣到其他有類似 IO 瓶頸的操作，比如 cross-attention 或稀疏 attention pattern。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 問題定義：標準 attention 的 O(n²) 瓶頸 | |
| 與之前方法的差異（exact vs approximate） | |
| 核心 insight：IO-aware（HBM vs SRAM） | |
| 方法：tiling + online softmax | |
| 具體效果：2-4x speedup + O(n) memory | |
| Limitation：至少一個有深度的觀點 | |
| 加分：延伸想法或跟自己工作的連結 | |

## 參考資料

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — Transformer 原始論文，self-attention 機制的源頭
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290) — DPO 論文，面試討論範例中的核心引用
- [How to Read a Paper](https://web.stanford.edu/class/ee384m/Handouts/HowtoReadPaper.pdf) — Keshav 的經典三遍閱讀法，本文 30 分鐘閱讀法的參考基礎
