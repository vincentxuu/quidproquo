---
title: "Harvard CS181 HW6（一）：自迴歸模型的解碼、KV Cache 與 Speculative Decoding"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, homework, generative-models, kv-cache, speculative-decoding]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 11
type: guide
tldr: "HW6 Problem 4（20 分）用三個問題拆解「一個 token 接一個 token 生成」的代價：逐步挑最大機率不等於整句最可能、每步重算所有 key 讓成本變成平方級而 KV cache 把它壓回線性、speculative decoding 用小模型先猜再讓大模型一次驗證。全部是紙筆題，但每一題都對應到今天 LLM 推論系統的真實設計。"
description: "逐週導讀 Harvard CS1810 Spring 2026 HW6（due 2026-05-01）Problem 4 Autoregressive Models：greedy 與 MAP 解碼、k 階自迴歸模型的動態規劃與 Viterbi、N_naive 與 N_cached 的 key 計算次數比、causal attention 為何能快取、訓練為何能平行而生成不能，以及 speculative decoding 的驗證與接受規則。對照 schedule 第 11 週與 Section 9。"
draft: false
glossary:
  - term: "MAP decoding"
    aliases: ["maximum a posteriori decoding", "最大後驗解碼"]
    definition: "在所有可能序列中找聯合機率最高的那一條。對一般自迴歸模型要列舉 V^T 條序列，代價是指數級。"
    context: "HW6 Problem 4 Part 1 拿它跟逐步取最大的 greedy decoding 對比。"
  - term: "prefill"
    aliases: ["預填", "prefill phase"]
    definition: "開始生成前，對整段 prompt 做一次前向傳播，把每個位置的 key 與 value 算好存進 KV cache 的階段。"
    context: "HW6 Problem 4 Part 2c 用它定義 N_cached 的第一項。"
---

> 🌏 [English version](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding-en)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW6](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6)（`hw6_release.tex/.pdf`）、[官方 schedule](https://harvard-ml-courses.github.io/cs181-web/schedule) 第 11 週、[Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf)（標頭 Spring 2026）為準。「Autoregressive Models」是 2026 新排的講題，**2024 scribe notes 沒有對應講義**，課程也無當期錄影。Section 9 講了自迴歸分解、teacher forcing 與 greedy／sampling 等解碼策略，但**沒有講 KV cache 與 speculative decoding**；這兩部分的背景只能靠作業題幹本身。作業解答未公開，Section 9 有 [soln](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf)。存取分級 **A3**，同[系列總覽](/posts/tech/2026-08-27-harvard-cs181-overview)。

本篇是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)第 11 篇。上一篇是 [HW5（下）：SimCLR 對比學習與 GAN](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans)，下一篇是 [HW6（二）：HMM 與 Kalman filter](/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman)。

## 為什麼從 Problem 4 開始讀

HW6 標題是「Sequential Models and Decision Making」，五題依序是 HMM（Kalman filter，15 分）、Policy／Value Iteration（15 分）、Q-learning 玩 Swingy Monkey（20 分）、Autoregressive Models（20 分）、Embedded Ethics（10 分）。但講課順序是反過來的：

| 週 | 日期 | 講題 | Section |
|---|---|---|---|
| 11 | Apr 7（Tue） | Autoregressive Models | S8: Generative Modeling Medley |
| 11 | Apr 9（Thu） | Hidden Markov Models | |
| 12 | Apr 14（Tue） | Single-Agent MDPs | S9: Autoregressive Models and HMMs |
| 12 | Apr 16（Thu） | Reinforcement Learning I | |
| 13 | Apr 21（Tue） | Reinforcement Learning II | S10: MDPs and Reinforcement Learning |

HW6 在 Apr 17 釋出（schedule 寫「Release HW 6 (AR, HMMS, MDPs, RL)」），tex 的 `\duedate` 是 **May 1, 2026 11:59PM EST**。本系列照講課順序拆 HW6，所以先寫 Problem 4。

Problem 4 也是 HW6 唯一跟 [HW4 Transformer](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer) 直接相連的題目：Part 2 的 KV cache 完全建立在 causal self-attention 上。它沒有程式部分，三個 Part 都是紙筆題。

## 題幹：自迴歸分解

任何序列的聯合機率都能用機率連鎖律拆開：

```text
p(x₁, …, x_T) = ∏ₜ p(xₜ | x₍<t₎)
```

[Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) 第 2 節的說法是：這把一個難的聯合建模問題，變成一串「給定前綴，預測下一個」的條件預測，每一步都像一個監督式分類題，但標籤來自資料本身。訓練就是對每個位置的下一個 token 做交叉熵。

題幹說 Problem 4 要看的是這個「一步接一步」結構的三個後果：找最可能序列的演算法成本、每一步生成的計算成本、以及怎麼部分平行化生成。

## Part 1：逐步挑最好，不等於整句最好

題目給一個長度 3、字母表 {A, B} 的小模型，把 p(x₁)、p(x₂|x₁)、p(x₃|x₁,x₂) 全部列出來。

- **1a**：greedy decoding 每一步取 `argmax p(x | x₍<t₎)`，算出序列與它的聯合機率。
- **1b**：MAP decoding 要找 `argmax p(x)`，列舉全部 8 條序列。

這組數字是刻意設計的，兩種解碼算完你會發現答案不同。看一下 x₁ 的兩個分支：選 A 的機率較高，但 B 分支後面的條件機率非常集中。greedy 在第一步就做了決定，之後再也回不去。

Section 9 第 2.5 節列了四種解碼策略（greedy、ancestral sampling、temperature、top-k／nucleus），並說 greedy 適合有唯一正解的任務、但在開放式生成常顯得重複。Part 1 補上的是另一個角度：greedy 連「找到機率最高的那一句」都不保證。

- **1c**：一般自迴歸模型做精確 MAP 要 O(V^T)。但如果每個 token 只依賴前 k 個 token，就能用動態規劃。題目定義 δₜ(w) 為「長度 t、結尾窗口是 w = (x₍t−k+1₎, …, xₜ) 的序列中最大機率」，要你回答：(i) w 有幾種可能；(ii) 寫出 δₜ₊₁ 用 δₜ 表示的遞迴；(iii) 總時間是 T、V、k 的什麼函數，並驗證 k = 1 退回 Viterbi 的 O(TV²)、k = T−1 退回暴力列舉。

這題是 HMM 那一講的預告。Section 9 第 3.9 節的 Exercise 3.3 就是一題手算 Viterbi，先做那題，再回來推 1c 的遞迴會順很多：k = 1 時，窗口 w 就是「上一個 token」，角色跟 HMM 的隱藏狀態一樣。

## Part 2：KV cache 把平方變線性

題幹先定義了 Transformer 的關鍵量：每個位置 t 有表示 hₜ，key 是 `Kₜ = W_K hₜ`，value 是 `Vₜ = W_V hₜ`。causal self-attention 在位置 t 只把位置 1…t 的 key、value 結合起來。

生成時從長度 T 的前綴出發，一次生一個 token，共生 k 個。天真做法是每一步都對整個目前序列重跑一次前向傳播，重算所有 Kₜ、Vₜ。

- **2a**：定義 N_naive(T, k) 為 k 步裡 `W_K hₜ` 的總計算次數。(i) 生成 x₍T+j₎ 前序列多長、這次前向要算幾個 key；(ii) 對 j = 1…k 加總得到封閉式，並證明它是 O((T+k)²)。
- **2b**：KV cache 依賴 causal self-attention 的哪個性質？為什麼成立？為什麼雙向 self-attention 就不能這樣快取？
- **2c**：有快取時，先做一次 prefill 把前綴 T 個位置的 K、V 算好存起來，之後每一步只算新 token 的那一組。(i) 寫出 N_cached(T, k)；(ii) 在 k ≫ T（短 prompt、長生成）時，N_naive / N_cached 的比值是多少。
- **2d**：一次長度 k 的訓練前向傳播，牆鐘時間大約等於推論時生成一個 token，儘管訓練做的運算多得多。為什麼訓練能跨位置平行、生成不能？KV cache 對訓練有幫助嗎？

2b 的線索在題幹：「位置 t 已經在序列裡時，後面接上新 token 不會改變 Kₜ」。問問自己，在 causal mask 下 hₜ 依賴哪些位置？換成雙向 attention，hₜ 又依賴哪些位置？Section 9 第 2.6 節講 causal masking 的實作（在 attention 分數矩陣的上三角加 −∞），可以拿來回答前半。

2d 對應 Section 9 第 2.3.1 節的 teacher forcing：訓練時每個位置的前綴都是真實資料，已經全部知道，所以所有位置能在一次前向裡同時算；生成時下一個 token 必須等上一個 token 抽出來才知道。Section 9 同一節也提到這個訓練與生成的落差叫 exposure bias。

2c(ii) 算出來的比值會隨 k 成長。這就是為什麼題幹說 KV cache「is standard in every production language model inference system」。

## Part 3：Speculative decoding

Part 2 結論是生成慢在不能平行。speculative decoding 用兩個模型繞過一部分限制：想要的大模型（target）p，和便宜但近似 p 的小模型（draft）q。每一輪三步：

1. **Drafting**：q 自迴歸地生出 k 個候選 token。
2. **Verification**：p 對整段序列跑**一次**前向，同時得到 k+1 個條件分布；前 k 個用來驗證候選，最後一個是全部接受時用的「bonus」分布。
3. **Acceptance**：逐個檢查候選，第 i 個以機率 `min(1, p(x₍T+i₎ | …) / q(x₍T+i₎ | …))` 接受。一旦拒絕，後面的候選全丟，並從一個特別構造的分布在該位置重新抽樣，讓輸出仍然完全符合 p。

題幹直接給了結論：這套接受規則讓輸出序列的分布跟直接從 p 抽樣**完全相同**。作業不要求你證明這件事，要你回答的是：

- **3a**：(i) target 模型前向的什麼性質讓平行驗證成為可能？為什麼同一個性質不能讓生成平行？(ii) 如果 q = p，speculative decoding 會怎樣？有加速嗎？有額外成本嗎？
- **3b**：(i) p ≥ q 時接受機率是多少？為什麼此時一律接受合理？(ii) p ≪ q 時接受機率是多少？為什麼此時通常拒絕合理？

3a(i) 跟 2d 是同一個答案的兩面：一旦候選 token 已經寫在序列裡，target 模型就像在做 teacher forcing，所有位置能一起算。3b 可以這樣想：q 在某個 token 上給的機率比 p 高，代表小模型「過度推薦」了它，接受機率 p/q 正好把多出來的部分修掉。

題目只給了演算法描述，沒有附論文。這套方法的原始出處是 [Leviathan et al. 2022](https://arxiv.org/abs/2211.17192) 與 [Chen et al. 2023](https://arxiv.org/abs/2302.01318)，想看分布不變的證明可以讀前者。

## 做題順序建議

1. 先做 Section 9 的 Exercise 2.1（手算一條序列的機率與 perplexity），熟悉條件機率表的讀法。
2. Part 1 的 8 條序列用表格列完，greedy 那條會在表裡。
3. 1c 之前先做 Section 9 Exercise 3.3 的 Viterbi，再把「隱藏狀態」換成「長度 k 的窗口」。
4. Part 2 先寫 2a(i)，用 T = 2、k = 3 這種小數字數一遍 key 的次數，再推封閉式。
5. Part 3 的每一題都可以用 Part 2 的結論回答，寫完 Part 2 再寫。

## 自我檢測

- greedy 解碼在第幾步做了「回不去」的決定？
- k 階自迴歸模型的 MAP 動態規劃，狀態數為什麼是 V 的 k 次方？
- 在雙向 attention 下，後面接上一個新 token，前面位置的 key 為什麼會變？
- N_naive / N_cached 在 k ≫ T 時大約多少？
- q = p 時每個候選都會被接受，那為什麼還是可能沒有加速？

## 延伸閱讀

本系列只講作業要的部分。想看這些技術在真實系統裡怎麼用，站內有兩篇從 LLM 工程角度講的導讀：

- [CME295 第 3 講：LLM 生成時的控制旋鈕](/posts/ai/2026-09-29-cme295-large-language-models)：解碼策略、temperature、top-p。
- [CME295 2026 第 5 講（課前預寫）：LLM 系統](/posts/ai/2026-09-29-cme295-llm-systems)：prefill 與 decode 的差別、KV cache 大小怎麼算、speculative decoding 的接受率與加速上限。

## 參考資料

- [CS1810 Spring 2026 HW6 資料夾（GitHub）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6)：`hw6_release.tex`、`hw6_release.pdf`
- [HW6 題目 PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.pdf)
- [CS1810 2026 官方 schedule](https://harvard-ml-courses.github.io/cs181-web/schedule)（第 11–13 週列、HW6 release；2026-09-29 以 Google Sheet CSV 匯出查閱）
- [Section 9：Autoregressive Models and Hidden Markov Models（Spring 2026）](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf)／[解答](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf)
- [CS1810 2026 Syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [Leviathan et al., Fast Inference from Transformers via Speculative Decoding (2022)](https://arxiv.org/abs/2211.17192)
- [Chen et al., Accelerating Large Language Model Decoding with Speculative Sampling (2023)](https://arxiv.org/abs/2302.01318)
- [Harvard CS181 逐週導讀（系列總覽）](/posts/tech/2026-08-27-harvard-cs181-overview)
